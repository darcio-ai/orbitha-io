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

    // Verify the caller is an admin (supports users with multiple roles)
    const { data: roles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)

    const isAdmin = roles?.some(r => r.role === 'admin')
    if (!isAdmin) {
      throw new Error('Insufficient permissions')
    }

    const { userId, userIds } = await req.json()

    // Support both single userId and array of userIds
    const idsToDelete: string[] = userIds ? userIds : (userId ? [userId] : [])

    if (idsToDelete.length === 0) {
      throw new Error('Nenhum usuário especificado para exclusão')
    }

    // Prevent admin from deleting themselves
    if (idsToDelete.includes(user.id)) {
      throw new Error('Você não pode deletar sua própria conta')
    }

    console.log(`Starting deletion of ${idsToDelete.length} user(s)`)

    // Track results
    const results: { success: string[]; failed: Array<{ id: string; error: string }> } = {
      success: [],
      failed: []
    }

    // Delete each user
    for (const id of idsToDelete) {
      try {
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id)

        if (deleteError) {
          console.error(`Failed to delete user ${id}:`, deleteError.message)
          results.failed.push({ id, error: deleteError.message })
        } else {
          console.log(`User deleted successfully: ${id}`)
          results.success.push(id)
        }
      } catch (err: any) {
        console.error(`Exception deleting user ${id}:`, err.message)
        results.failed.push({ id, error: err.message })
      }
    }

    console.log(`Bulk delete completed: ${results.success.length} success, ${results.failed.length} failed`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        deleted: results.success.length,
        failed: results.failed 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error deleting user:', error.message)
    
    let errorMessage = error.message
    
    if (errorMessage.includes('not found')) {
      errorMessage = 'Usuário não encontrado'
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
