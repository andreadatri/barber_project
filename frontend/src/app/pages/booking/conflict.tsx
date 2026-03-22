import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { AlertCircle, Calendar } from "lucide-react";

export default function BookingConflict() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-background">
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <AlertCircle className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Orario non più disponibile</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Ci dispiace, ma l'orario che hai selezionato è stato appena
            prenotato da un altro cliente.
          </p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Cosa è successo?</strong>
                <br />
                Un altro cliente ha completato la prenotazione per lo stesso
                orario mentre tu compilavi il modulo. Questo può accadere nei
                momenti di maggiore affluenza.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Cosa puoi fare:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Seleziona un altro orario disponibile per la stessa data
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Scegli un'altra data che ti sia comoda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>
                    Contattaci telefonicamente per verificare disponibilità
                    immediate
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link to="/prenota/step3">
              <Calendar className="w-5 h-5 mr-2" />
              Scegli un altro orario
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/">Torna alla home</Link>
          </Button>
        </div>

        <Card className="p-4 mt-8 bg-muted/50">
          <p className="text-sm text-center text-muted-foreground">
            <strong>Suggerimento:</strong> Per evitare questo inconveniente,
            completa la prenotazione il più velocemente possibile dopo aver
            selezionato l'orario.
          </p>
        </Card>
      </div>
    </div>
  );
}
