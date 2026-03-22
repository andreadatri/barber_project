import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Stepper, Step } from "../../components/stepper";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Scissors,
  Euro,
  User,
  Phone,
  Mail,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { createBooking } from "../../lib/api";
import {
  getBookingConfirmation,
  getBookingContact,
  getBookingDate,
  getBookingService,
  getBookingTime,
  setBookingConfirmation,
} from "../../lib/booking-storage";

const steps: Step[] = [
  { id: 1, label: "Servizio" },
  { id: 2, label: "Data" },
  { id: 3, label: "Ora" },
  { id: 4, label: "Contatti" },
  { id: 5, label: "Conferma" },
];

export default function Step5Confirm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const service = getBookingService();
  const dateData = getBookingDate();
  const date = dateData ? new Date(dateData) : null;
  const time = getBookingTime();
  const contact = getBookingContact();

  const handleConfirm = async () => {
    if (!service || !dateData || !time || !contact) {
      return;
    }

    setIsSubmitting(true);

    try {
      const booking = await createBooking({
        service_id: service.id,
        date: dateData.slice(0, 10),
        time,
        customer_name: contact.name,
        customer_phone: contact.phone,
        customer_email: contact.email || undefined,
        notes: contact.notes || undefined,
      });

      setBookingConfirmation(booking);
      navigate("/prenota/success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "";

      if (message.includes("non è più disponibile")) {
        navigate("/prenota/conflict");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service || !date || !time || !contact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Dati mancanti. Ricomincia la prenotazione.
          </p>
          <Button asChild>
            <Link to="/prenota">Ricomincia</Link>
          </Button>
        </div>
      </div>
    );
  }

  const existingConfirmation = getBookingConfirmation();
  const bookingCode = existingConfirmation ? `BK${existingConfirmation.id}` : null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild disabled={isSubmitting}>
              <Link to="/prenota/step4">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="font-semibold">Prenota appuntamento</h1>
          </div>
        </div>
      </header>

      <div className="container max-w-3xl mx-auto px-4 py-6">
        <Stepper steps={steps} currentStep={5} />

        <div className="space-y-6 mt-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Conferma prenotazione</h2>
            <p className="text-sm text-muted-foreground">
              Controlla i dettagli e conferma il tuo appuntamento
            </p>
          </div>

          <Card className="p-6 space-y-6">
            {bookingCode && (
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-sm text-muted-foreground">
                  Ultimo codice prenotazione
                </span>
                <span className="font-mono font-semibold">{bookingCode}</span>
              </div>
            )}

            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Scissors className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Servizio</p>
                <p className="font-semibold">{service.name}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {service.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Euro className="w-4 h-4" />
                    {service.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 pb-4 border-b">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Data e ora</p>
                <p className="font-semibold">
                  {format(date, "EEEE d MMMM yyyy", { locale: it })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">ore {time}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{contact.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{contact.phone}</span>
              </div>
              {contact.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{contact.email}</span>
                </div>
              )}
              {contact.notes && (
                <div className="flex items-start gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span className="text-sm">{contact.notes}</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Totale</span>
                <span className="text-2xl font-bold text-primary">
                  €{service.price.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          <div className="flex justify-between pt-4">
            <Button variant="outline" asChild disabled={isSubmitting}>
              <Link to="/prenota/step4">Indietro</Link>
            </Button>
            <Button onClick={handleConfirm} disabled={isSubmitting} size="lg">
              {isSubmitting ? "Conferma in corso..." : "Conferma prenotazione"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
