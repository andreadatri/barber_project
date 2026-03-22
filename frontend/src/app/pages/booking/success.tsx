import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Scissors,
  Phone,
  Mail,
  MapPin,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { getSiteConfig, type SiteConfig } from "../../lib/api";
import { getBookingConfirmation } from "../../lib/booking-storage";

export default function BookingSuccess() {
  const [site, setSite] = useState<SiteConfig | null>(null);
  const confirmation = getBookingConfirmation();

  useEffect(() => {
    getSiteConfig().then(setSite).catch(() => setSite(null));
  }, []);

  const phoneHref = useMemo(() => {
    const phone = site?.settings.shop_phone ?? "+39 333 123 4567";
    return `tel:${phone.replace(/(?!^\+)[^\d]/g, "")}`;
  }, [site]);

  if (!confirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Prenotazione non trovata.
          </p>
          <Button asChild>
            <Link to="/">Torna alla home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const startAt = new Date(confirmation.start_at);
  const bookingId = `BK${confirmation.id}`;
  const shopName = site?.settings.shop_name ?? "Il Barbiere";
  const shopAddress = site
    ? `${site.settings.shop_address}, ${site.settings.shop_postal_code} ${site.settings.shop_city}`
    : "Via Roma 123, 20100 Milano (MI)";
  const shopPhone = site?.settings.shop_phone ?? "+39 333 123 4567";
  const shopEmail = site?.settings.shop_email ?? "info@ilbarbiere.it";

  const handleDownloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//${shopName}//Booking//IT
BEGIN:VEVENT
UID:${bookingId}@ilbarbiere.it
DTSTAMP:${format(new Date(), "yyyyMMdd'T'HHmmss")}
DTSTART:${format(startAt, "yyyyMMdd'T'HHmmss")}
DURATION:PT${confirmation.service.duration}M
SUMMARY:${confirmation.service.name} - ${shopName}
DESCRIPTION:Prenotazione presso ${shopName}\\nServizio: ${confirmation.service.name}\\nPrezzo: €${confirmation.service.price}
LOCATION:${shopAddress}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prenotazione-${bookingId}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background">
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Prenotazione confermata!</h1>
          <p className="text-muted-foreground">
            Grazie per aver scelto {shopName}. Ti aspettiamo!
          </p>
        </div>

        <Card className="p-6 space-y-6 mb-6">
          <div className="flex items-center justify-between pb-4 border-b">
            <span className="text-sm text-muted-foreground">
              Numero prenotazione
            </span>
            <span className="font-mono font-semibold">{bookingId}</span>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Scissors className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Servizio</p>
                <p className="font-semibold">{confirmation.service.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {confirmation.service.duration} min • €
                  {confirmation.service.price.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Quando</p>
                <p className="font-semibold">
                  {format(startAt, "EEEE d MMMM yyyy", { locale: it })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ore {format(startAt, "HH:mm")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Dove</p>
                <p className="font-semibold">{shopName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {shopAddress}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-3 mb-8">
          <Button
            onClick={handleDownloadICS}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Aggiungi al calendario
          </Button>
        </div>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">Hai bisogno di aiuto?</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <a href={phoneHref} className="text-primary hover:underline">
                {shopPhone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <a
                href={`mailto:${shopEmail}`}
                className="text-primary hover:underline"
              >
                {shopEmail}
              </a>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Puoi cancellare o modificare la prenotazione fino a 2 ore prima
            dell'appuntamento chiamandoci.
          </p>
        </Card>

        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link to="/">Torna alla home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
