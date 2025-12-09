import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-token",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate webhook token for n8n calls
    const webhookToken = req.headers.get("x-webhook-token");
    const expectedToken = Deno.env.get("N8N_WEBHOOK_TOKEN");
    
    if (!webhookToken || webhookToken !== expectedToken) {
      console.error("Invalid or missing webhook token");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const method = req.method;

    // GET - Buscar cliente por telefone
    if (method === "GET") {
      const phone = url.searchParams.get("phone");
      
      if (!phone) {
        return new Response(
          JSON.stringify({ error: "Parâmetro 'phone' é obrigatório" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Buscando cliente com telefone: ${phone}`);
      
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("telefone", phone)
        .maybeSingle();

      if (error) {
        console.error("Erro ao buscar cliente:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ cliente: data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST - Criar ou atualizar cliente (upsert por telefone)
    if (method === "POST") {
      const body = await req.json();
      const { nome, telefone, email, conversa_id } = body;

      if (!telefone) {
        return new Response(
          JSON.stringify({ error: "Campo 'telefone' é obrigatório" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Criando/atualizando cliente: ${nome} - ${telefone}`);

      // Upsert - insere ou atualiza se telefone já existe
      const { data, error } = await supabase
        .from("clientes")
        .upsert(
          { 
            nome: nome || "Cliente", 
            telefone, 
            email, 
            conversa_id,
            updated_at: new Date().toISOString()
          },
          { onConflict: "telefone" }
        )
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar/atualizar cliente:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Cliente salvo com sucesso: ${data.id}`);

      return new Response(
        JSON.stringify({ cliente: data, success: true }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Método não suportado" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erro na função clients:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
