import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Clock, Scissors, Euro, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface BookingSummaryProps {
  service?: {
    name: string;
    duration: number;
    price: number;
  };
  date?: Date;
  time?: string;
  className?: string;
}

export function BookingSummary({
  service,
  date,
  time,
  className,
}: BookingSummaryProps) {
  const hasData = service || date || time;

  return (
    <Card className={className}>
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-base">Riepilogo prenotazione</h3>

        {hasData ? (
          <div className="space-y-2">
            {service && (
              <div className="flex items-start gap-2">
                <Scissors className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{service.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {service.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Euro className="w-3 h-3" />
                      {service.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <p className="text-sm">
                  {format(date, "EEEE d MMMM yyyy", { locale: it })}
                </p>
              </div>
            )}

            {time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <p className="text-sm">{time}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Seleziona servizio, data e ora
          </p>
        )}

        <div className="pt-3 border-t">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <p>
              Puoi cancellare o modificare la prenotazione fino a 2 ore prima
              dell'appuntamento.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
