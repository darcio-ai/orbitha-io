import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'OPENAI_API_KEY not configured',
          hasApiKey: false 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get current date and first day of month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Convert to Unix timestamps (seconds) as required by OpenAI API
    const startTime = Math.floor(startOfMonth.getTime() / 1000);
    const endTime = Math.floor(now.getTime() / 1000);

    console.log(`Fetching OpenAI costs from ${startTime} to ${endTime} (Unix timestamps)`);
    console.log(`Period: ${startOfMonth.toISOString()} to ${now.toISOString()}`);

    // Try to get costs from OpenAI Organization API
    // Note: This requires an Admin API Key with api.usage.read permission
    const costsResponse = await fetch(
      `https://api.openai.com/v1/organization/costs?start_time=${startTime}&end_time=${endTime}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (costsResponse.ok) {
      const costsData = await costsResponse.json();
      console.log('OpenAI costs data:', JSON.stringify(costsData, null, 2));

      // Calculate total cost from the response
      let totalCost = 0;
      if (costsData.data && Array.isArray(costsData.data)) {
        totalCost = costsData.data.reduce((sum: number, item: any) => {
          return sum + (item.results?.reduce((s: number, r: any) => s + (r.amount?.value || 0), 0) || 0);
        }, 0);
      }

      return new Response(
        JSON.stringify({
          hasApiKey: true,
          hasBillingAccess: true,
          currentMonthCost: totalCost,
          periodStart: startOfMonth.toISOString(),
          periodEnd: now.toISOString(),
          source: 'openai_api',
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // If costs API fails, check the specific error
    const errorText = await costsResponse.text();
    console.log('OpenAI costs API error:', costsResponse.status, errorText);

    // Parse error for more details
    let errorDetails = '';
    try {
      const errorJson = JSON.parse(errorText);
      errorDetails = errorJson.error?.message || errorText;
    } catch {
      errorDetails = errorText;
    }

    // Check if it's a permission issue
    if (costsResponse.status === 403 || errorText.includes('permission') || errorText.includes('scope')) {
      return new Response(
        JSON.stringify({
          hasApiKey: true,
          hasBillingAccess: false,
          message: 'A Admin Key não tem permissão api.usage.read. Verifique as permissões no painel OpenAI.',
          error: errorDetails,
          periodStart: startOfMonth.toISOString(),
          periodEnd: now.toISOString(),
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Other API errors
    return new Response(
      JSON.stringify({
        hasApiKey: true,
        hasBillingAccess: false,
        message: `Erro ao consultar API OpenAI: ${costsResponse.status}`,
        error: errorDetails,
        periodStart: startOfMonth.toISOString(),
        periodEnd: now.toISOString(),
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in get-openai-balance:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        hasApiKey: true,
        hasBillingAccess: false,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
