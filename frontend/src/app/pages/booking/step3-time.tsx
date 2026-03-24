import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Stepper, Step } from "../../components/stepper";
import { Button } from "../../components/ui/button";
import { BookingSummary } from "../../components/booking-summary";
import { ArrowLeft, Clock } from "lucide-react";
import { Skeleton } from "../../components/ui/skeleton";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { cn } from "../../components/ui/utils";
import {
  getAvailability,
  type AvailabilitySlot,
} from "../../lib/api";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  getBookingDate,
  getBookingService,
  getBookingTime,
  setBookingTime,
} from "../../lib/booking-storage";

const steps: Step[] = [
  { id: 1, label: "Servizio" },
  { id: 2, label: "Data" },
  { id: 3, label: "Ora" },
  { id: 4, label: "Contatti" },
  { id: 5, label: "Conferma" },
];

export default function Step3Time() {
  const navigate = useNavigate();
  const [selectedTime, setSelectedTime] = useState<string | null>(() =>
    getBookingTime()
  );
  const [loading, setLoading] = useState(true);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [service] = useState(() => getBookingService());
  const [dateIso] = useState(() => getBookingDate());
  const date = dateIso ? new Date(dateIso) : undefined;
  const bookingDate = dateIso ? dateIso.slice(0, 10) : null;

  useEffect(() => {
    if (!service || !bookingDate) {
      navigate("/prenota/step2");
      return;
    }

    setLoading(true);
    getAvailability(service.id, bookingDate)
      .then((data) => setSlots(data.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [bookingDate, navigate, service]);

  useEffect(() => {
    if (!selectedTime) {
      return;
    }

    const selectedSlot = slots.find((slot) => slot.time === selectedTime);

    if (!selectedSlot?.available) {
      setSelectedTime(null);
    }
  }, [selectedTime, slots]);

  const handleNext = () => {
    if (!selectedTime) {
      return;
    }

    setBookingTime(selectedTime);
    navigate("/prenota/step4");
  };

  const hasAvailableSlots = useMemo(
    () => slots.some((slot) => slot.available),
    [slots]
  );

  const morningSlots = useMemo(
    () => slots.filter((slot) => parseInt(slot.time, 10) < 13),
    [slots]
  );

  const afternoonSlots = useMemo(
    () => slots.filter((slot) => parseInt(slot.time, 10) >= 13),
    [slots]
  );

  const renderSlotButton = (slot: AvailabilitySlot) => {
    const isSelected = selectedTime === slot.time;
    const button = (
      <Button
        key={slot.time}
        type="button"
        variant={isSelected ? "default" : "outline"}
        disabled={!slot.available}
        onClick={() => slot.available && setSelectedTime(slot.time)}
        className={cn(
          "h-10 w-full",
          !slot.available &&
            "cursor-not-allowed border-dashed opacity-40 hover:bg-background hover:text-foreground",
        )}
      >
        {slot.time}
      </Button>
    );

    if (slot.available) {
      return button;
    }

    return (
      <Tooltip key={slot.time}>
        <TooltipTrigger asChild>
          <span className="block w-full" tabIndex={0}>
            {button}
          </span>
        </TooltipTrigger>
        <TooltipContent sideOffset={8}>
          {slot.reason ?? "Orario non disponibile"}
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/prenota/step2">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="font-semibold">Prenota appuntamento</h1>
          </div>
        </div>
      </header>

      <div className="container max-w-5xl mx-auto px-4 py-6">
        <Stepper steps={steps} currentStep={3} />

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Seleziona orario</h2>
              <p className="text-sm text-muted-foreground">
                Scegli l'orario che preferisci
              </p>
            </div>

            {loading ? (
              <div className="bg-background rounded-lg border p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {[...Array(7)].map((_, i) => (
                        <Skeleton key={i} className="h-10" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {[...Array(11)].map((_, i) => (
                        <Skeleton key={i} className="h-10" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-background rounded-lg border p-6">
                {!hasAvailableSlots && (
                  <Alert className="mb-6">
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Nessuna disponibilità per questa data. Gli orari visibili
                      qui sotto non sono prenotabili: seleziona un'altra data.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                      Mattina
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {morningSlots.length > 0 ? (
                        morningSlots.map(renderSlotButton)
                      ) : (
                        <p className="col-span-full text-sm text-muted-foreground">
                          Nessuno slot al mattino.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                      Pomeriggio
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {afternoonSlots.length > 0 ? (
                        afternoonSlots.map(renderSlotButton)
                      ) : (
                        <p className="col-span-full text-sm text-muted-foreground">
                          Nessuno slot al pomeriggio.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-border rounded"></div>
                      <span>Disponibile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-primary bg-primary rounded"></div>
                      <span>Selezionato</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border-2 border-border bg-muted rounded opacity-50"></div>
                      <span>Non disponibile</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" asChild>
                <Link to="/prenota/step2">Indietro</Link>
              </Button>
              <Button onClick={handleNext} disabled={!selectedTime}>
                Continua
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingSummary
              service={service ?? undefined}
              date={date}
              time={selectedTime || undefined}
              className="sticky top-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
