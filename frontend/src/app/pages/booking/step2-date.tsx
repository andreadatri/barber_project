import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Stepper, Step } from "../../components/stepper";
import { Button } from "../../components/ui/button";
import { BookingSummary } from "../../components/booking-summary";
import { ArrowLeft } from "lucide-react";
import { Calendar } from "../../components/ui/calendar";
import { addDays, isWeekend, isSunday } from "date-fns";

const steps: Step[] = [
  { id: 1, label: "Servizio" },
  { id: 2, label: "Data" },
  { id: 3, label: "Ora" },
  { id: 4, label: "Contatti" },
  { id: 5, label: "Conferma" },
];

export default function Step2Date() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Get service from session
  const serviceData = sessionStorage.getItem("booking-service");
  const service = serviceData ? JSON.parse(serviceData) : undefined;

  const handleNext = () => {
    if (selectedDate) {
      sessionStorage.setItem("booking-date", selectedDate.toISOString());
      navigate("/prenota/step3");
    }
  };

  // Disable past dates and Sundays (closed)
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || isSunday(date);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/prenota/step1">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="font-semibold">Prenota appuntamento</h1>
          </div>
        </div>
      </header>

      <div className="container max-w-5xl mx-auto px-4 py-6">
        <Stepper steps={steps} currentStep={2} />

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Seleziona data</h2>
              <p className="text-sm text-muted-foreground">
                Scegli il giorno in cui vuoi venire (chiusi la domenica)
              </p>
            </div>

            <div className="bg-background rounded-lg border p-6 flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                fromDate={new Date()}
                toDate={addDays(new Date(), 60)}
                className="rounded-md"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" asChild>
                <Link to="/prenota/step1">Indietro</Link>
              </Button>
              <Button onClick={handleNext} disabled={!selectedDate}>
                Continua
              </Button>
            </div>
          </div>

          {/* Sidebar summary */}
          <div className="lg:col-span-1">
            <BookingSummary
              service={service}
              date={selectedDate}
              className="sticky top-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
