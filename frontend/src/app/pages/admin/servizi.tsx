import { useState } from "react";
import { AdminLayout } from "../../components/admin-layout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
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
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
}

const initialServices: Service[] = [
  {
    id: 1,
    name: "Taglio classico",
    description: "Taglio tradizionale con forbici e rasoio",
    duration: 30,
    price: 25,
  },
  {
    id: 2,
    name: "Taglio + barba",
    description: "Taglio completo e rifinitura barba",
    duration: 45,
    price: 35,
  },
  {
    id: 3,
    name: "Solo barba",
    description: "Rifinitura e cura della barba",
    duration: 20,
    price: 15,
  },
  {
    id: 4,
    name: "Taglio bambino",
    description: "Taglio dedicato ai più piccoli (0-12 anni)",
    duration: 20,
    price: 18,
  },
  {
    id: 5,
    name: "Rasatura tradizionale",
    description: "Rasatura con rasoio a mano libera",
    duration: 30,
    price: 20,
  },
];

export default function AdminServizi() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: "",
  });

  const handleAdd = () => {
    setEditingService(null);
    setFormData({ name: "", description: "", duration: "", price: "" });
    setIsDialogOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration.toString(),
      price: service.price.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (editingService) {
      // Update existing
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? {
                ...s,
                name: formData.name,
                description: formData.description,
                duration: parseInt(formData.duration),
                price: parseFloat(formData.price),
              }
            : s
        )
      );
    } else {
      // Add new
      const newService: Service = {
        id: Math.max(...services.map((s) => s.id)) + 1,
        name: formData.name,
        description: formData.description,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
      };
      setServices([...services, newService]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setServices(services.filter((s) => s.id !== id));
    setDeleteId(null);
  };

  return (
    <AdminLayout
      title="Servizi"
      breadcrumbs={[{ label: "Servizi" }]}
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Nuovo servizio
        </Button>
      }
    >
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Servizio</TableHead>
              <TableHead>Descrizione</TableHead>
              <TableHead className="text-center">Durata</TableHead>
              <TableHead className="text-right">Prezzo</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {service.description}
                </TableCell>
                <TableCell className="text-center">
                  {service.duration} min
                </TableCell>
                <TableCell className="text-right">
                  €{service.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDeleteId(service.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Modifica servizio" : "Nuovo servizio"}
            </DialogTitle>
            <DialogDescription>
              {editingService
                ? "Modifica i dettagli del servizio"
                : "Inserisci i dettagli del nuovo servizio"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome servizio</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="es. Taglio classico"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Breve descrizione del servizio"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Durata (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Prezzo (€)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="25.00"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annulla
            </Button>
            <Button onClick={handleSave}>Salva</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma eliminazione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questo servizio? Questa azione non
              può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
