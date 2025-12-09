import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

type AppointmentStatus = "agendado" | "confirmado" | "cancelado" | "reagendado" | "concluido";

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
}

interface Agendamento {
  id: string;
  titulo: string;
  data_inicio: string;
  data_fim: string;
  horario_txt: string;
  status: AppointmentStatus;
  cliente: Cliente;
}

interface AppointmentCalendarProps {
  agendamentos: Agendamento[];
}

const statusColors: Record<AppointmentStatus, string> = {
  agendado: "bg-blue-500",
  confirmado: "bg-green-500",
  cancelado: "bg-red-500",
  reagendado: "bg-yellow-500",
  concluido: "bg-gray-500",
};

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];

export default function AppointmentCalendar({ agendamentos }: AppointmentCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const getAppointmentsForDayAndHour = (day: Date, hour: number) => {
    return agendamentos.filter((a) => {
      const apptDate = new Date(a.data_inicio);
      return isSameDay(apptDate, day) && apptDate.getHours() === hour;
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {format(weekStart, "d 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "d 'de' MMMM, yyyy", { locale: ptBR })}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header with days */}
            <div className="grid grid-cols-6 gap-1 mb-2">
              <div className="h-12" /> {/* Empty cell for hours column */}
              {days.map((day) => (
                <div
                  key={day.toISOString()}
                  className={`h-12 flex flex-col items-center justify-center rounded-lg ${
                    isSameDay(day, new Date()) ? "bg-primary/10" : "bg-muted/50"
                  }`}
                >
                  <span className="text-xs text-muted-foreground">
                    {format(day, "EEE", { locale: ptBR })}
                  </span>
                  <span className={`text-lg font-semibold ${isSameDay(day, new Date()) ? "text-primary" : ""}`}>
                    {format(day, "d")}
                  </span>
                </div>
              ))}
            </div>

            {/* Time grid */}
            <div className="space-y-1">
              {HOURS.map((hour) => (
                <div key={hour} className="grid grid-cols-6 gap-1">
                  {/* Hour label */}
                  <div className="h-16 flex items-start justify-end pr-2 text-sm text-muted-foreground">
                    {hour}:00
                  </div>
                  {/* Day cells */}
                  {days.map((day) => {
                    const appointments = getAppointmentsForDayAndHour(day, hour);
                    return (
                      <div
                        key={`${day.toISOString()}-${hour}`}
                        className="h-16 rounded-lg border border-border/50 bg-background p-1 overflow-hidden"
                      >
                        {appointments.map((appt) => (
                          <div
                            key={appt.id}
                            className={`${statusColors[appt.status]} text-white text-xs p-1 rounded mb-0.5 truncate cursor-pointer hover:opacity-80`}
                            title={`${appt.titulo} - ${appt.cliente?.nome}`}
                          >
                            {appt.cliente?.nome || appt.titulo}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-500" />
                <span className="text-sm text-muted-foreground">Agendado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-sm text-muted-foreground">Confirmado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500" />
                <span className="text-sm text-muted-foreground">Reagendado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500" />
                <span className="text-sm text-muted-foreground">Cancelado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-500" />
                <span className="text-sm text-muted-foreground">Concluído</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
