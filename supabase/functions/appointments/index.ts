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

// Função para atualizar evento no Google Calendar
async function updateGoogleCalendarEvent(
  eventId: string,
  title: string,
  description: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  try {
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");
    const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID");

    if (!clientId || !clientSecret || !refreshToken || !calendarId) {
      return false;
    }

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
    
    if (!tokenData.access_token) return false;

    const eventResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
      {
        method: "PUT",
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

    return eventResponse.ok;
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return false;
  }
}

// Função para deletar evento no Google Calendar
async function deleteGoogleCalendarEvent(eventId: string): Promise<boolean> {
  try {
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");
    const calendarId = Deno.env.get("GOOGLE_CALENDAR_ID");

    if (!clientId || !clientSecret || !refreshToken || !calendarId) {
      return false;
    }

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
    
    if (!tokenData.access_token) return false;

    const deleteResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    return deleteResponse.ok || deleteResponse.status === 404;
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    return false;
  }
}

// Timezone do Brasil (São Paulo)
const BRAZIL_TIMEZONE = "America/Sao_Paulo";

// Formatar data para texto legível no horário brasileiro
function formatDateText(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: BRAZIL_TIMEZONE,
  };
  
  const formatted = new Intl.DateTimeFormat("pt-BR", options).format(date);
  // Capitaliza primeira letra do dia da semana
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatTimeText(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: BRAZIL_TIMEZONE,
  };
  
  const startTime = new Intl.DateTimeFormat("pt-BR", options).format(startDate);
  const endTime = new Intl.DateTimeFormat("pt-BR", options).format(endDate);
  
  return `${startTime} - ${endTime}`;
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

    const url = new URL(req.url);
    const method = req.method;

    // GET - Buscar agendamentos
    if (method === "GET") {
      const phone = url.searchParams.get("phone");
      const id = url.searchParams.get("id");
      const status = url.searchParams.get("status");
      const dateFrom = url.searchParams.get("date_from");
      const dateTo = url.searchParams.get("date_to");

      let query = supabase
        .from("agendamentos")
        .select(`
          *,
          cliente:clientes(*)
        `)
        .order("data_inicio", { ascending: true });

      if (id) {
        query = query.eq("id", id);
      }

      if (phone) {
        // Buscar cliente primeiro
        const { data: cliente } = await supabase
          .from("clientes")
          .select("id")
          .eq("telefone", phone)
          .maybeSingle();

        if (cliente) {
          query = query.eq("cliente_id", cliente.id);
        } else {
          return new Response(
            JSON.stringify({ agendamentos: [] }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      if (status) {
        query = query.eq("status", status);
      }

      if (dateFrom) {
        query = query.gte("data_inicio", dateFrom);
      }

      if (dateTo) {
        query = query.lte("data_inicio", dateTo);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao buscar agendamentos:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ agendamentos: data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST - Criar agendamento
    if (method === "POST") {
      const body = await req.json();
      const { cliente_id, telefone, titulo, descricao, data_inicio, data_fim } = body;

      let finalClienteId = cliente_id;

      // Se não tem cliente_id mas tem telefone, buscar cliente
      if (!finalClienteId && telefone) {
        const { data: cliente } = await supabase
          .from("clientes")
          .select("id")
          .eq("telefone", telefone)
          .maybeSingle();

        if (cliente) {
          finalClienteId = cliente.id;
        } else {
          return new Response(
            JSON.stringify({ error: "Cliente não encontrado. Cadastre o cliente primeiro." }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }

      if (!finalClienteId || !data_inicio || !data_fim) {
        return new Response(
          JSON.stringify({ error: "Campos obrigatórios: cliente_id ou telefone, data_inicio, data_fim" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const startDate = new Date(data_inicio);
      const endDate = new Date(data_fim);
      
      const dataTxt = formatDateText(startDate);
      const horarioTxt = formatTimeText(startDate, endDate);

      console.log(`Criando agendamento: ${titulo} em ${dataTxt} ${horarioTxt}`);

      // Criar evento no Google Calendar
      const googleEventId = await createGoogleCalendarEvent(
        titulo || "Agendamento",
        descricao || "",
        data_inicio,
        data_fim
      );

      // Inserir no banco
      const { data, error } = await supabase
        .from("agendamentos")
        .insert({
          cliente_id: finalClienteId,
          google_event_id: googleEventId,
          titulo: titulo || "Agendamento",
          descricao,
          data_inicio,
          data_fim,
          data_txt: dataTxt,
          horario_txt: horarioTxt,
          status: "agendado",
        })
        .select(`
          *,
          cliente:clientes(*)
        `)
        .single();

      if (error) {
        console.error("Erro ao criar agendamento:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Agendamento criado: ${data.id}`);

      return new Response(
        JSON.stringify({ 
          agendamento: data, 
          success: true,
          google_calendar_synced: !!googleEventId 
        }),
        { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // PATCH - Atualizar/Reagendar
    if (method === "PATCH") {
      const body = await req.json();
      const { id, data_inicio, data_fim, status, titulo, descricao } = body;

      if (!id) {
        return new Response(
          JSON.stringify({ error: "Campo 'id' é obrigatório" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Buscar agendamento atual
      const { data: current } = await supabase
        .from("agendamentos")
        .select("*")
        .eq("id", id)
        .single();

      if (!current) {
        return new Response(
          JSON.stringify({ error: "Agendamento não encontrado" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

      if (status) updateData.status = status;
      if (titulo) updateData.titulo = titulo;
      if (descricao !== undefined) updateData.descricao = descricao;

      // Se está reagendando (mudando data/hora)
      if (data_inicio && data_fim) {
        const startDate = new Date(data_inicio);
        const endDate = new Date(data_fim);
        
        updateData.data_inicio = data_inicio;
        updateData.data_fim = data_fim;
        updateData.data_txt = formatDateText(startDate);
        updateData.horario_txt = formatTimeText(startDate, endDate);
        
        if (!status) updateData.status = "reagendado";

        // Atualizar no Google Calendar
        if (current.google_event_id) {
          await updateGoogleCalendarEvent(
            current.google_event_id,
            titulo || current.titulo,
            descricao !== undefined ? descricao : current.descricao,
            data_inicio,
            data_fim
          );
        }
      }

      console.log(`Atualizando agendamento ${id}:`, updateData);

      const { data, error } = await supabase
        .from("agendamentos")
        .update(updateData)
        .eq("id", id)
        .select(`
          *,
          cliente:clientes(*)
        `)
        .single();

      if (error) {
        console.error("Erro ao atualizar agendamento:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ agendamento: data, success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // DELETE - Cancelar agendamento
    if (method === "DELETE") {
      const id = url.searchParams.get("id");

      if (!id) {
        return new Response(
          JSON.stringify({ error: "Parâmetro 'id' é obrigatório" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Buscar agendamento para pegar google_event_id
      const { data: current } = await supabase
        .from("agendamentos")
        .select("google_event_id")
        .eq("id", id)
        .single();

      // Deletar do Google Calendar
      if (current?.google_event_id) {
        await deleteGoogleCalendarEvent(current.google_event_id);
      }

      // Atualizar status para cancelado (soft delete)
      const { error } = await supabase
        .from("agendamentos")
        .update({ status: "cancelado", updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) {
        console.error("Erro ao cancelar agendamento:", error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.log(`Agendamento ${id} cancelado`);

      return new Response(
        JSON.stringify({ success: true, message: "Agendamento cancelado" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Método não suportado" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erro na função appointments:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
