import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/admin-layout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Separator } from "../../components/ui/separator";
import { CheckCircle2 } from "lucide-react";
import { getAdminSettings, updateAdminSettings } from "../../lib/api";

interface BusinessInfo {
  name: string;
  address: string;
  city: string;
  cap: string;
  phone: string;
  email: string;
  piva: string;
}

const defaults: BusinessInfo = {
  name: "Il Barbiere",
  address: "Via Roma 123",
  city: "Milano",
  cap: "20100",
  phone: "+39 333 123 4567",
  email: "info@ilbarbiere.it",
  piva: "IT12345678901",
};

export default function AdminImpostazioni() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(defaults);
  const [notifications, setNotifications] = useState({
    emailEnabled: true,
    smsEnabled: false,
    reminderHours: "24",
  });

  useEffect(() => {
    getAdminSettings()
      .then((data) =>
        setBusinessInfo({
          name: data.shop_name,
          address: data.shop_address,
          city: data.shop_city,
          cap: data.shop_postal_code,
          phone: data.shop_phone,
          email: data.shop_email,
          piva: data.shop_vat_number ?? "",
        })
      )
      .catch(() => {
        window.location.href = "/admin/login";
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const updated = await updateAdminSettings({
      shop_name: businessInfo.name,
      shop_address: businessInfo.address,
      shop_city: businessInfo.city,
      shop_postal_code: businessInfo.cap,
      shop_phone: businessInfo.phone,
      shop_email: businessInfo.email,
      shop_vat_number: businessInfo.piva || null,
    });

    setBusinessInfo({
      name: updated.shop_name,
      address: updated.shop_address,
      city: updated.shop_city,
      cap: updated.shop_postal_code,
      phone: updated.shop_phone,
      email: updated.shop_email,
      piva: updated.shop_vat_number ?? "",
    });

    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout
      title="Impostazioni"
      breadcrumbs={[{ label: "Impostazioni" }]}
    >
      <div className="max-w-3xl space-y-6">
        {loading && (
          <Alert>
            <AlertDescription>Caricamento impostazioni...</AlertDescription>
          </Alert>
        )}

        {saved && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Impostazioni salvate con successo
            </AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Informazioni negozio</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome attività</Label>
              <Input
                id="name"
                value={businessInfo.name}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Indirizzo</Label>
              <Input
                id="address"
                value={businessInfo.address}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, address: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Città</Label>
                <Input
                  id="city"
                  value={businessInfo.city}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, city: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cap">CAP</Label>
                <Input
                  id="cap"
                  value={businessInfo.cap}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, cap: e.target.value })
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                type="tel"
                value={businessInfo.phone}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={businessInfo.email}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="piva">Partita IVA</Label>
              <Input
                id="piva"
                value={businessInfo.piva}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, piva: e.target.value })
                }
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Notifiche clienti</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reminderHours">
                Promemoria automatico (ore prima)
              </Label>
              <Input
                id="reminderHours"
                type="number"
                value={notifications.reminderHours}
                onChange={(e) =>
                  setNotifications({
                    ...notifications,
                    reminderHours: e.target.value,
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Invia un promemoria automatico ai clienti X ore prima
                dell'appuntamento
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <p className="text-sm font-medium">Canali attivi:</p>
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={
                    notifications.emailEnabled
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }
                >
                  {notifications.emailEnabled ? "✓" : "✗"} Email
                </span>
                <span className="text-muted-foreground">•</span>
                <span
                  className={
                    notifications.smsEnabled
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }
                >
                  {notifications.smsEnabled ? "✓" : "✗"} SMS
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Le notifiche SMS richiedono un piano aggiuntivo
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Regole prenotazione</h2>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg space-y-2">
              <h3 className="font-medium text-sm">Cancellazione</h3>
              <p className="text-sm text-muted-foreground">
                I clienti possono cancellare o modificare fino a{" "}
                <strong>2 ore</strong> prima dell'appuntamento
              </p>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <h3 className="font-medium text-sm">Massimo giorni prenotabili</h3>
              <p className="text-sm text-muted-foreground">
                I clienti possono prenotare fino a <strong>60 giorni</strong> in
                anticipo
              </p>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <h3 className="font-medium text-sm">Appuntamenti multipli</h3>
              <p className="text-sm text-muted-foreground">
                Un cliente può avere massimo <strong>1</strong> prenotazione
                attiva
              </p>
            </div>
          </div>
        </Card>

        <Button onClick={handleSave} size="lg" disabled={loading}>
          Salva tutte le modifiche
        </Button>
      </div>
    </AdminLayout>
  );
}
