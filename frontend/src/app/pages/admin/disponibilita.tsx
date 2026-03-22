import { useState } from "react";
import { AdminLayout } from "../../components/admin-layout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { CheckCircle2, Plus, Trash2, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface WeeklyHours {
  day: string;
  enabled: boolean;
  openTime: string;
  closeTime: string;
}

interface Closure {
  id: number;
  startDate: Date;
  endDate: Date;
  reason: string;
}

const initialWeeklyHours: WeeklyHours[] = [
  { day: "Lunedì", enabled: true, openTime: "09:00", closeTime: "19:30" },
  { day: "Martedì", enabled: true, openTime: "09:00", closeTime: "19:30" },
  { day: "Mercoledì", enabled: true, openTime: "09:00", closeTime: "19:30" },
  { day: "Giovedì", enabled: true, openTime: "09:00", closeTime: "19:30" },
  { day: "Venerdì", enabled: true, openTime: "09:00", closeTime: "19:30" },
  { day: "Sabato", enabled: true, openTime: "09:00", closeTime: "18:00" },
  { day: "Domenica", enabled: false, openTime: "", closeTime: "" },
];

const mockClosures: Closure[] = [
  {
    id: 1,
    startDate: new Date(2026, 7, 10),
    endDate: new Date(2026, 7, 20),
    reason: "Ferie estive",
  },
  {
    id: 2,
    startDate: new Date(2026, 11, 24),
    endDate: new Date(2026, 11, 26),
    reason: "Festività natalizie",
  },
];

export default function AdminDisponibilita() {
  const [weeklyHours, setWeeklyHours] = useState<WeeklyHours[]>(initialWeeklyHours);
  const [closures, setClosures] = useState<Closure[]>(mockClosures);
  const [bufferTime, setBufferTime] = useState("15");
  const [minAdvance, setMinAdvance] = useState("2");
  const [saved, setSaved] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClosure, setNewClosure] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleSaveHours = () => {
    // Save to API in real app
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddClosure = () => {
    const closure: Closure = {
      id: Math.max(...closures.map((c) => c.id), 0) + 1,
      startDate: new Date(newClosure.startDate),
      endDate: new Date(newClosure.endDate),
      reason: newClosure.reason,
    };
    setClosures([...closures, closure]);
    setIsDialogOpen(false);
    setNewClosure({ startDate: "", endDate: "", reason: "" });
  };

  const handleDeleteClosure = (id: number) => {
    setClosures(closures.filter((c) => c.id !== id));
  };

  const updateWeeklyHours = (
    index: number,
    field: keyof WeeklyHours,
    value: string | boolean
  ) => {
    const updated = [...weeklyHours];
    updated[index] = { ...updated[index], [field]: value };
    setWeeklyHours(updated);
  };

  return (
    <AdminLayout
      title="Disponibilità"
      breadcrumbs={[{ label: "Disponibilità" }]}
    >
      <div className="space-y-6">
        {saved && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Impostazioni salvate con successo
            </AlertDescription>
          </Alert>
        )}

        {/* Weekly hours */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Orari settimanali</h2>
          <div className="space-y-4">
            {weeklyHours.map((day, index) => (
              <div key={day.day} className="flex items-center gap-4">
                <div className="w-32">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={day.enabled}
                      onCheckedChange={(checked) =>
                        updateWeeklyHours(index, "enabled", checked as boolean)
                      }
                    />
                    <Label className="cursor-pointer">{day.day}</Label>
                  </div>
                </div>
                {day.enabled ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      type="time"
                      value={day.openTime}
                      onChange={(e) =>
                        updateWeeklyHours(index, "openTime", e.target.value)
                      }
                      className="w-32"
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                      type="time"
                      value={day.closeTime}
                      onChange={(e) =>
                        updateWeeklyHours(index, "closeTime", e.target.value)
                      }
                      className="w-32"
                    />
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">Chiuso</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Impostazioni prenotazioni</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="buffer">Buffer tra appuntamenti (minuti)</Label>
              <Input
                id="buffer"
                type="number"
                value={bufferTime}
                onChange={(e) => setBufferTime(e.target.value)}
                placeholder="15"
              />
              <p className="text-xs text-muted-foreground">
                Tempo di pausa tra un appuntamento e l'altro
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="advance">Preavviso minimo (ore)</Label>
              <Input
                id="advance"
                type="number"
                value={minAdvance}
                onChange={(e) => setMinAdvance(e.target.value)}
                placeholder="2"
              />
              <p className="text-xs text-muted-foreground">
                Ore minime di anticipo richieste per prenotare
              </p>
            </div>
          </div>
        </Card>

        <Button onClick={handleSaveHours}>Salva modifiche</Button>

        {/* Closures */}
        <Card>
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Chiusure e blackout</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Gestisci periodi di chiusura (ferie, festività, etc.)
              </p>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi chiusura
            </Button>
          </div>

          {closures.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nessuna chiusura programmata</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dal</TableHead>
                  <TableHead>Al</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {closures.map((closure) => (
                  <TableRow key={closure.id}>
                    <TableCell>
                      {format(closure.startDate, "dd MMMM yyyy", { locale: it })}
                    </TableCell>
                    <TableCell>
                      {format(closure.endDate, "dd MMMM yyyy", { locale: it })}
                    </TableCell>
                    <TableCell>{closure.reason}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClosure(closure.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>

      {/* Add Closure Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi chiusura</DialogTitle>
            <DialogDescription>
              Inserisci il periodo di chiusura del negozio
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Data inizio</Label>
              <Input
                id="startDate"
                type="date"
                value={newClosure.startDate}
                onChange={(e) =>
                  setNewClosure({ ...newClosure, startDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data fine</Label>
              <Input
                id="endDate"
                type="date"
                value={newClosure.endDate}
                onChange={(e) =>
                  setNewClosure({ ...newClosure, endDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo</Label>
              <Input
                id="reason"
                value={newClosure.reason}
                onChange={(e) =>
                  setNewClosure({ ...newClosure, reason: e.target.value })
                }
                placeholder="es. Ferie estive"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annulla
            </Button>
            <Button
              onClick={handleAddClosure}
              disabled={
                !newClosure.startDate ||
                !newClosure.endDate ||
                !newClosure.reason
              }
            >
              Aggiungi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
