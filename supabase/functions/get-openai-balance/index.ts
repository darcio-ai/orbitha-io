import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CostBucket {
  start_time: number;
  end_time: number;
  results: Array<{
    object: string;
    amount: { value: number; currency: string };
    line_item?: string;
    project_id?: string;
  }>;
}

interface CostsResponse {
  object: string;
  data: CostBucket[];
  has_more: boolean;
  next_page?: string;
}

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

    // Fetch all pages of costs with pagination
    let allCostBuckets: CostBucket[] = [];
    let hasMore = true;
    let nextPage: string | null = null;
    let pageCount = 0;
    const maxPages = 10; // Safety limit

    while (hasMore && pageCount < maxPages) {
      const url = nextPage 
        ? `https://api.openai.com/v1/organization/costs?start_time=${startTime}&end_time=${endTime}&page=${nextPage}`
        : `https://api.openai.com/v1/organization/costs?start_time=${startTime}&end_time=${endTime}`;

      console.log(`Fetching page ${pageCount + 1}: ${url}`);

      const costsResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!costsResponse.ok) {
        const errorText = await costsResponse.text();
        console.log('OpenAI costs API error:', costsResponse.status, errorText);

        let errorDetails = '';
        try {
          const errorJson = JSON.parse(errorText);
          errorDetails = errorJson.error?.message || errorText;
        } catch {
          errorDetails = errorText;
        }

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
      }

      const costsData: CostsResponse = await costsResponse.json();
      console.log(`Page ${pageCount + 1} data:`, JSON.stringify(costsData, null, 2));

      allCostBuckets = [...allCostBuckets, ...costsData.data];
      hasMore = costsData.has_more;
      nextPage = costsData.next_page || null;
      pageCount++;
    }

    console.log(`Fetched ${pageCount} pages, ${allCostBuckets.length} cost buckets total`);

    // Calculate total cost from all buckets
    let totalCost = 0;
    const costsByModel: Record<string, number> = {};
    const costsByProject: Record<string, number> = {};

    allCostBuckets.forEach(bucket => {
      if (bucket.results && Array.isArray(bucket.results)) {
        bucket.results.forEach(result => {
          const amount = result.amount?.value || 0;
          totalCost += amount;

          // Track by line item (model/category)
          if (result.line_item) {
            costsByModel[result.line_item] = (costsByModel[result.line_item] || 0) + amount;
          }

          // Track by project
          if (result.project_id) {
            costsByProject[result.project_id] = (costsByProject[result.project_id] || 0) + amount;
          }
        });
      }
    });

    console.log(`Total cost calculated: $${totalCost.toFixed(6)}`);
    console.log('Costs by model:', costsByModel);
    console.log('Costs by project:', costsByProject);

    return new Response(
      JSON.stringify({
        hasApiKey: true,
        hasBillingAccess: true,
        currentMonthCost: totalCost,
        costsByModel,
        costsByProject,
        periodStart: startOfMonth.toISOString(),
        periodEnd: now.toISOString(),
        source: 'openai_api',
        pagesProcessed: pageCount,
        bucketsProcessed: allCostBuckets.length,
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