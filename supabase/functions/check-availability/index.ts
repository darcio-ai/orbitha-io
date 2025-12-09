import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-token",
};

// Configurações de horário de funcionamento
const BUSINESS_HOURS = {
  start: 9,  // 9h
  end: 18,   // 18h
  appointmentDuration: 60, // 1 hora em minutos
  workDays: [1, 2, 3, 4, 5], // Segunda a Sexta (0 = Domingo)
};

function generateTimeSlots(date: Date): { start: string; end: string; startFormatted: string }[] {
  const slots: { start: string; end: string; startFormatted: string }[] = [];
  const dayOfWeek = date.getDay();

  // Verificar se é dia útil
  if (!BUSINESS_HOURS.workDays.includes(dayOfWeek)) {
    return slots;
  }

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  for (let hour = BUSINESS_HOURS.start; hour < BUSINESS_HOURS.end; hour++) {
    const startTime = new Date(year, month, day, hour, 0, 0);
    const endTime = new Date(year, month, day, hour + 1, 0, 0);

    // Não incluir slots que já passaram se for hoje
    const now = new Date();
    if (startTime < now) continue;

    const pad = (n: number) => n.toString().padStart(2, "0");

    slots.push({
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      startFormatted: `${pad(hour)}:00`,
    });
  }

  return slots;
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

    if (req.method !== "GET") {
      return new Response(
        JSON.stringify({ error: "Método não suportado" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");
    const daysAhead = url.searchParams.get("days_ahead");

    // Se passar days_ahead, retorna disponibilidade para múltiplos dias
    if (daysAhead) {
      const days = parseInt(daysAhead) || 7;
      const availability: Record<string, { start: string; end: string; startFormatted: string }[]> = {};
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < days; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() + i);
        
        const dateStr = checkDate.toISOString().split("T")[0];
        const allSlots = generateTimeSlots(checkDate);

        if (allSlots.length === 0) continue;

        // Buscar agendamentos existentes para este dia
        const startOfDay = new Date(checkDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(checkDate);
        endOfDay.setHours(23, 59, 59, 999);

        const { data: existingAppointments } = await supabase
          .from("agendamentos")
          .select("data_inicio, data_fim")
          .gte("data_inicio", startOfDay.toISOString())
          .lte("data_inicio", endOfDay.toISOString())
          .neq("status", "cancelado");

        // Filtrar slots ocupados
        const availableSlots = allSlots.filter(slot => {
          const slotStart = new Date(slot.start).getTime();
          const slotEnd = new Date(slot.end).getTime();

          return !existingAppointments?.some(appt => {
            const apptStart = new Date(appt.data_inicio).getTime();
            const apptEnd = new Date(appt.data_fim).getTime();
            // Verifica sobreposição
            return slotStart < apptEnd && slotEnd > apptStart;
          });
        });

        if (availableSlots.length > 0) {
          availability[dateStr] = availableSlots;
        }
      }

      console.log(`Disponibilidade para ${days} dias calculada`);

      return new Response(
        JSON.stringify({ 
          availability,
          business_hours: {
            start: `${BUSINESS_HOURS.start}:00`,
            end: `${BUSINESS_HOURS.end}:00`,
            work_days: ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"],
            appointment_duration: "1 hora"
          }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Consulta para uma data específica
    if (!dateParam) {
      return new Response(
        JSON.stringify({ error: "Parâmetro 'date' (YYYY-MM-DD) ou 'days_ahead' é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const checkDate = new Date(dateParam + "T00:00:00");
    
    if (isNaN(checkDate.getTime())) {
      return new Response(
        JSON.stringify({ error: "Formato de data inválido. Use YYYY-MM-DD" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const dayOfWeek = checkDate.getDay();
    
    // Verificar se é dia útil
    if (!BUSINESS_HOURS.workDays.includes(dayOfWeek)) {
      const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
      return new Response(
        JSON.stringify({ 
          date: dateParam,
          day_of_week: diasSemana[dayOfWeek],
          is_business_day: false,
          available_slots: [],
          message: "Não há atendimento neste dia. Funcionamos de Segunda a Sexta."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Gerar todos os slots do dia
    const allSlots = generateTimeSlots(checkDate);

    // Buscar agendamentos existentes para este dia
    const startOfDay = new Date(checkDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(checkDate);
    endOfDay.setHours(23, 59, 59, 999);

    console.log(`Buscando agendamentos entre ${startOfDay.toISOString()} e ${endOfDay.toISOString()}`);

    const { data: existingAppointments, error } = await supabase
      .from("agendamentos")
      .select("data_inicio, data_fim, horario_txt")
      .gte("data_inicio", startOfDay.toISOString())
      .lte("data_inicio", endOfDay.toISOString())
      .neq("status", "cancelado");

    if (error) {
      console.error("Erro ao buscar agendamentos:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Filtrar slots que já estão ocupados
    const availableSlots = allSlots.filter(slot => {
      const slotStart = new Date(slot.start).getTime();
      const slotEnd = new Date(slot.end).getTime();

      return !existingAppointments?.some(appt => {
        const apptStart = new Date(appt.data_inicio).getTime();
        const apptEnd = new Date(appt.data_fim).getTime();
        // Verifica sobreposição
        return slotStart < apptEnd && slotEnd > apptStart;
      });
    });

    const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

    console.log(`${availableSlots.length} slots disponíveis para ${dateParam}`);

    return new Response(
      JSON.stringify({
        date: dateParam,
        day_of_week: diasSemana[dayOfWeek],
        is_business_day: true,
        total_slots: allSlots.length,
        occupied_slots: allSlots.length - availableSlots.length,
        available_slots: availableSlots,
        business_hours: {
          start: `${BUSINESS_HOURS.start}:00`,
          end: `${BUSINESS_HOURS.end}:00`,
          appointment_duration: "1 hora"
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Erro na função check-availability:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
