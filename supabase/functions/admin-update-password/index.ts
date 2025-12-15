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
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
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

    const { userId, newPassword } = await req.json()

    // Validate userId
    if (!userId || !isValidUUID(userId)) {
      return new Response(
        JSON.stringify({ error: 'ID de usuário inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate password
    const passwordValidation = isValidPassword(newPassword)
    if (!passwordValidation.valid) {
      return new Response(
        JSON.stringify({ error: passwordValidation.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if password has been leaked
    const isLeaked = await checkLeakedPassword(newPassword);
    if (isLeaked) {
      console.warn('Attempt to update to a leaked password for user:', userId.substring(0, 8) + '***');
      return new Response(
        JSON.stringify({ error: 'Esta senha foi encontrada em vazamentos de dados. Por favor, escolha uma senha diferente.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update password using admin client
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    )

    if (updateError) throw updateError

    console.log(`Password updated successfully for user: ${userId.substring(0, 8)}***`)

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error updating password')
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
