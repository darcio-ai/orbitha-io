import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Leaked password check using k-anonymity (HaveIBeenPwned API)
async function checkLeakedPassword(password: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: { 'Add-Padding': 'true' },
    });

    if (!response.ok) {
      console.warn('HIBP API error, skipping check');
      return false;
    }

    const text = await response.text();
    return text.split('\n').some(line => line.split(':')[0].trim() === suffix);
  } catch (error) {
    console.warn('Error checking leaked password:', error);
    return false;
  }
}

// Input validation helpers
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email && typeof email === 'string' && email.length <= 255 && emailRegex.test(email);
}

function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Senha é obrigatória' };
  }
  if (password.length < 6) {
    return { valid: false, message: 'Senha deve ter pelo menos 6 caracteres' };
  }
  if (password.length > 72) {
    return { valid: false, message: 'Senha deve ter no máximo 72 caracteres' };
  }
  return { valid: true };
}

function isValidName(name: string): boolean {
  return name && typeof name === 'string' && name.length >= 1 && name.length <= 100;
}

function isValidPhone(phone: string): boolean {
  if (!phone) return true; // Phone is optional
  return typeof phone === 'string' && phone.length <= 20;
}

function isValidRole(role: string): boolean {
  const validRoles = ['admin', 'user'];
  return validRoles.includes(role);
}

function maskEmail(email: string): string {
  if (!email) return '***';
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return '***';
  const maskedLocal = localPart.substring(0, 2) + '***';
  return `${maskedLocal}@${domain}`;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Verify the caller is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header present')
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError) {
      console.error('Auth error')
      throw new Error('Authentication failed')
    }
    
    if (!user) {
      console.error('No user found from token')
      throw new Error('User not found')
    }
    
    console.log('Admin action by user:', user.id)

    // Verify the caller is an admin
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!roleData || roleData.role !== 'admin') {
      throw new Error('Insufficient permissions')
    }

    const { email, password, firstname, lastname, phone, role } = await req.json()

    // Validate all inputs
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Email inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const passwordValidation = isValidPassword(password)
    if (!passwordValidation.valid) {
      return new Response(
        JSON.stringify({ error: passwordValidation.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!isValidName(firstname)) {
      return new Response(
        JSON.stringify({ error: 'Nome é obrigatório (máximo 100 caracteres)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!isValidName(lastname)) {
      return new Response(
        JSON.stringify({ error: 'Sobrenome é obrigatório (máximo 100 caracteres)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!isValidPhone(phone)) {
      return new Response(
        JSON.stringify({ error: 'Telefone inválido (máximo 20 caracteres)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (role && !isValidRole(role)) {
      return new Response(
        JSON.stringify({ error: 'Role inválida' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if password has been leaked
    const isLeaked = await checkLeakedPassword(password);
    if (isLeaked) {
      console.warn('Attempt to create user with leaked password');
      return new Response(
        JSON.stringify({ error: 'Esta senha foi encontrada em vazamentos de dados. Por favor, escolha uma senha diferente.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Creating user:', maskEmail(email))

    // Create user with admin client (doesn't affect current session)
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        phone: phone?.trim() || ''
      }
    })

    if (userError) {
      // Handle specific error cases
      if (userError.message.includes('already been registered')) {
        throw new Error('Este email já está cadastrado no sistema')
      }
      throw new Error(userError.message)
    }

    // Delete existing role (created by trigger)
    await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userData.user.id)

    // Insert the desired role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: role || 'user'
      })

    if (roleError) throw roleError

    console.log('User created successfully')

    return new Response(
      JSON.stringify({ 
        success: true,
        user: { id: userData.user.id }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating user')
    
    // Return user-friendly error messages
    let errorMessage = error.message
    
    if (error.message.includes('duplicate key')) {
      errorMessage = 'Este email já está cadastrado no sistema'
    } else if (error.message.includes('invalid email')) {
      errorMessage = 'Email inválido'
    } else if (error.message.includes('password')) {
      errorMessage = 'A senha deve ter pelo menos 6 caracteres'
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
