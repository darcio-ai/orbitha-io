import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-token",
};

// Função para criar evento no Google Calendar
async function createGoogleCalendarEvent(
  title: string,
  description: string,
  startTime: string,
  endTime: string
): Promise<string | null> {
  try {
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");
    const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID");

    if (!clientId || !clientSecret || !refreshToken || !calendarId) {
      console.log("Credenciais do Google Calendar não configuradas");
      return null;
    }

    // Obter access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      console.error("Erro ao obter access token:", tokenData);
      return null;
    }

    // Criar evento
    const eventResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: title,
          description: description,
          start: { dateTime: startTime, timeZone: "America/Sao_Paulo" },
          end: { dateTime: endTime, timeZone: "America/Sao_Paulo" },
        }),
      }
    );

    const eventData = await eventResponse.json();
    
    if (eventData.id) {
      console.log(`Evento criado no Google Calendar: ${eventData.id}`);
      return eventData.id;
    }
    
    console.error("Erro ao criar evento:", eventData);
    return null;
  } catch (error) {
    console.error("Erro na integração com Google Calendar:", error);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate webhook token
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

    console.log("Iniciando sincronização de agendamentos com Google Calendar...");

    // Buscar agendamentos sem google_event_id (não sincronizados)
    const { data: agendamentos, error: fetchError } = await supabase
      .from("agendamentos")
      .select(`
        *,
        cliente:clientes(nome, telefone, email)
      `)
      .is("google_event_id", null)
      .in("status", ["agendado", "confirmado"])
      .order("data_inicio", { ascending: true });

    if (fetchError) {
      console.error("Erro ao buscar agendamentos:", fetchError);
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!agendamentos || agendamentos.length === 0) {
      console.log("Nenhum agendamento para sincronizar");
      return new Response(
        JSON.stringify({ 
          message: "Nenhum agendamento para sincronizar",
          synced: 0,
          failed: 0 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Encontrados ${agendamentos.length} agendamentos para sincronizar`);

    let synced = 0;
    let failed = 0;
    const results: Array<{ id: string; success: boolean; google_event_id?: string; error?: string }> = [];

    for (const agendamento of agendamentos) {
      try {
        const clienteNome = agendamento.cliente?.nome || "Cliente";
        const description = `Cliente: ${clienteNome}\nTelefone: ${agendamento.cliente?.telefone || "N/A"}\n${agendamento.descricao || ""}`;

        console.log(`Sincronizando: ${agendamento.titulo} - ${agendamento.data_txt} ${agendamento.horario_txt}`);

        const googleEventId = await createGoogleCalendarEvent(
          agendamento.titulo,
          description,
          agendamento.data_inicio,
          agendamento.data_fim
        );

        if (googleEventId) {
          // Atualizar o agendamento com o google_event_id
          const { error: updateError } = await supabase
            .from("agendamentos")
            .update({ google_event_id: googleEventId })
            .eq("id", agendamento.id);

          if (updateError) {
            console.error(`Erro ao atualizar agendamento ${agendamento.id}:`, updateError);
            failed++;
            results.push({ id: agendamento.id, success: false, error: updateError.message });
          } else {
            console.log(`Agendamento ${agendamento.id} sincronizado com evento ${googleEventId}`);
            synced++;
            results.push({ id: agendamento.id, success: true, google_event_id: googleEventId });
          }
        } else {
          console.error(`Falha ao criar evento para agendamento ${agendamento.id}`);
          failed++;
          results.push({ id: agendamento.id, success: false, error: "Falha ao criar evento no Google Calendar" });
        }
      } catch (error) {
        console.error(`Erro ao processar agendamento ${agendamento.id}:`, error);
        failed++;
        results.push({ id: agendamento.id, success: false, error: String(error) });
      }
    }

    console.log(`Sincronização concluída: ${synced} sincronizados, ${failed} falharam`);

    return new Response(
      JSON.stringify({
        message: `Sincronização concluída`,
        total: agendamentos.length,
        synced,
        failed,
        results
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro na sincronização:", error);
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
