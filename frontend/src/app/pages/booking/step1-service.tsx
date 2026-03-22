import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Stepper, Step } from "../../components/stepper";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { BookingSummary } from "../../components/booking-summary";
import { ArrowLeft, Clock, Euro, Check } from "lucide-react";
import { cn } from "../../components/ui/utils";
import { getServices, type BookingService } from "../../lib/api";
import { getBookingService, setBookingService } from "../../lib/booking-storage";

const steps: Step[] = [
  { id: 1, label: "Servizio" },
  { id: 2, label: "Data" },
  { id: 3, label: "Ora" },
  { id: 4, label: "Contatti" },
  { id: 5, label: "Conferma" },
];

export default function Step1Service() {
  const navigate = useNavigate();
  const [services, setServices] = useState<BookingService[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(
    getBookingService()?.id ?? null
  );

  useEffect(() => {
    getServices().then(setServices).catch(() => setServices([]));
  }, []);

  const handleNext = () => {
    const service = services.find((item) => item.id === selectedService);

    if (!service) {
      return;
    }

    setBookingService(service);
    navigate("/prenota/step2");
  };

  const currentService = services.find((item) => item.id === selectedService);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="font-semibold">Prenota appuntamento</h1>
          </div>
        </div>
      </header>

      <div className="container max-w-5xl mx-auto px-4 py-6">
        <Stepper steps={steps} currentStep={1} />

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Seleziona servizio</h2>
              <p className="text-sm text-muted-foreground">
                Scegli il servizio che desideri prenotare
              </p>
            </div>

            <div className="space-y-3">
              {services.map((service) => {
                const isSelected = selectedService === service.id;

                return (
                  <Card
                    key={service.id}
                    className={cn(
                      "p-4 cursor-pointer transition-all hover:shadow-md",
                      isSelected &&
                        "ring-2 ring-primary ring-offset-2 bg-primary/5"
                    )}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{service.name}</h3>
                          {isSelected && (
                            <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {service.duration} min
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-primary">
                            <Euro className="w-4 h-4" />
                            {service.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" asChild>
                <Link to="/">Indietro</Link>
              </Button>
              <Button onClick={handleNext} disabled={!selectedService}>
                Continua
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <BookingSummary service={currentService} className="sticky top-24" />
          </div>
        </div>
      </div>
    </div>
  );
}
