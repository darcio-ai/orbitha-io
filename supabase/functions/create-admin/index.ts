import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  try {
    // Simple auth check - only for initial setup
    const setupKey = req.headers.get('x-setup-key')
    if (setupKey !== 'setup-admin-orbitha-2024') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { 'Content-Type': 'application/json' }, status: 401 }
      )
    }

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

    // Create admin user
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: 'mvnpereira@gmail.com',
      password: '123456789',
      email_confirm: true,
      user_metadata: {
        firstname: 'Marcos',
        lastname: 'Pereira',
        phone: '5548991893313'
      }
    })

    if (userError) throw userError

    // Update role to admin
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userData.user.id)

    if (roleError) throw roleError

    const { error: insertRoleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: 'admin'
      })

    if (insertRoleError) throw insertRoleError

    return new Response(
      JSON.stringify({ 
        message: 'Admin user created successfully',
        user: userData.user
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
