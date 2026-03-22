import { useEffect, useMemo, useState } from "react";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { it } from "date-fns/locale";
import {
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle,
} from "lucide-react";
import { AdminLayout } from "../../components/admin-layout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  getAdminAppointments,
  updateAdminAppointmentStatus,
  type AdminAppointment,
} from "../../lib/api";

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    getAdminAppointments().then(setAppointments).catch(() => setAppointments([]));
  }, []);

  const dayAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => isSameDay(parseISO(appointment.start_at), selectedDate))
      .sort((a, b) => a.start_at.localeCompare(b.start_at));
  }, [appointments, selectedDate]);

  const totalRevenue = dayAppointments.reduce(
    (sum, appointment) => sum + appointment.service.price,
    0
  );

  const handleComplete = async (appointmentId: number) => {
    setUpdatingId(appointmentId);

    try {
      const updated = await updateAdminAppointmentStatus(appointmentId, "completed");
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === appointmentId ? updated : appointment
        )
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <AdminLayout title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Appuntamenti oggi</p>
                <p className="text-2xl font-bold">{dayAppointments.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completati</p>
                <p className="text-2xl font-bold">
                  {dayAppointments.filter((a) => a.status === "completed").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Incasso stimato</p>
                <p className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label className="mb-2 block text-sm text-muted-foreground">
                Seleziona data
              </Label>
              <Input
                type="date"
                value={format(selectedDate, "yyyy-MM-dd")}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="max-w-xs"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(addDays(selectedDate, -1))}
              >
                Giorno precedente
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                Oggi
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              >
                Giorno successivo
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="border-b p-6">
            <h2 className="font-semibold">
              Appuntamenti del {format(selectedDate, "EEEE d MMMM yyyy", { locale: it })}
            </h2>
          </div>

          <div className="divide-y">
            {dayAppointments.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Calendar className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <p>Nessun appuntamento per questa data</p>
              </div>
            ) : (
              dayAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-1 items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="font-semibold">
                            {format(parseISO(appointment.start_at), "HH:mm")}
                          </span>
                          <Badge variant="outline">#{appointment.id}</Badge>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="h-4 w-4" />
                            <span>{appointment.customer_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <a
                              href={`tel:${appointment.customer_phone}`}
                              className="transition-colors hover:text-primary"
                            >
                              {appointment.customer_phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="mb-1 font-semibold">{appointment.service.name}</p>
                      <p className="mb-2 text-sm text-muted-foreground">
                        {appointment.service.duration} min • €
                        {appointment.service.price.toFixed(2)}
                      </p>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          Dettagli
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleComplete(appointment.id)}
                          disabled={
                            appointment.status === "completed" ||
                            updatingId === appointment.id
                          }
                        >
                          {appointment.status === "completed"
                            ? "Completato"
                            : updatingId === appointment.id
                              ? "Salvataggio..."
                              : "Completa"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <label className={className}>{children}</label>;
}
