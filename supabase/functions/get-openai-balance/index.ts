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
    
    // Format dates for OpenAI API (YYYY-MM-DD)
    const startDate = startOfMonth.toISOString().split('T')[0];
    const endDate = now.toISOString().split('T')[0];

    console.log(`Fetching OpenAI costs from ${startDate} to ${endDate}`);

    // Try to get costs from OpenAI Organization API
    // Note: This requires an Admin API Key with billing:read permission
    const costsResponse = await fetch(
      `https://api.openai.com/v1/organization/costs?start_date=${startDate}&end_date=${endDate}`,
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
      console.log('OpenAI costs data:', costsData);

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
          periodStart: startDate,
          periodEnd: endDate,
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

    // Try the legacy usage endpoint as fallback
    const usageResponse = await fetch(
      `https://api.openai.com/v1/usage?date=${endDate}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (usageResponse.ok) {
      const usageData = await usageResponse.json();
      console.log('OpenAI usage data:', usageData);

      return new Response(
        JSON.stringify({
          hasApiKey: true,
          hasBillingAccess: true,
          usage: usageData,
          periodStart: startDate,
          periodEnd: endDate,
          source: 'openai_usage_api',
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Neither endpoint worked - API key doesn't have billing permissions
    console.log('No billing access with current API key');
    
    return new Response(
      JSON.stringify({
        hasApiKey: true,
        hasBillingAccess: false,
        message: 'A chave API atual não tem permissão de billing. Use uma Admin API Key para acessar os custos.',
        periodStart: startDate,
        periodEnd: endDate,
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
