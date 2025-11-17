import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
      console.error('Auth error:', authError)
      throw new Error(`Auth error: ${authError.message}`)
    }
    
    if (!user) {
      console.error('No user found from token')
      throw new Error('User not found')
    }
    
    console.log('Authenticated user:', user.id)

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

    // Create user with admin client (doesn't affect current session)
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        firstname,
        lastname,
        phone
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

    console.log(`User created successfully: ${email}`)

    return new Response(
      JSON.stringify({ 
        success: true,
        user: userData.user
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating user:', error.message)
    
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
