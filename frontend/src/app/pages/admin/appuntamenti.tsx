import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/admin-layout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Search, Eye, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  getAdminAppointments,
  type AdminAppointment,
} from "../../lib/api";

export default function AdminAppuntamenti() {
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAppointments()
      .then((data) => setAppointments(data))
      .catch(() => {
        window.location.href = "/admin/login";
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.customer_phone.includes(searchTerm) ||
      `BK${apt.id}`.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: number) => {
    setAppointments(appointments.filter((a) => a.id !== id));
    setDeleteId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "booked":
        return <Badge variant="outline">Confermato</Badge>;
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Completato
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Cancellato
          </Badge>
        );
    }
  };

  return (
    <AdminLayout
      title="Appuntamenti"
      breadcrumbs={[{ label: "Appuntamenti" }]}
    >
      <div className="space-y-4">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca per cliente, telefono o codice..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                <SelectItem value="booked">Confermati</SelectItem>
                <SelectItem value="completed">Completati</SelectItem>
                <SelectItem value="cancelled">Cancellati</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Appointments table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Codice</TableHead>
                  <TableHead>Data e ora</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Servizio</TableHead>
                  <TableHead className="text-right">Prezzo</TableHead>
                  <TableHead className="text-center">Stato</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      Caricamento appuntamenti...
                    </TableCell>
                  </TableRow>
                ) : filteredAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Nessun appuntamento trovato
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAppointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell className="font-mono">{`BK${apt.id}`}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {format(new Date(apt.start_at), "dd/MM/yyyy", {
                              locale: it,
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(apt.start_at), "HH:mm")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{apt.customer_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {apt.customer_phone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{apt.service.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {apt.service.duration} min
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        €{apt.service.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(apt.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setDeleteId(apt.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma cancellazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler cancellare questo appuntamento? Il cliente
              dovrebbe essere avvisato della cancellazione.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancella appuntamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
