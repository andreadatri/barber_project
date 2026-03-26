import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { getServices, getSiteConfig, type BookingService, type SiteConfig } from "../lib/api";
import { AdminLoginForm } from "../components/admin-login-form";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../components/ui/drawer";
import {
  MapPin,
  Clock,
  Phone,
  Scissors,
  Calendar,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [services, setServices] = useState<BookingService[]>([]);
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getServices().catch(() => [] as BookingService[]),
      getSiteConfig().catch(() => null),
    ]).then(([fetchedServices, fetchedSite]) => {
      setServices(fetchedServices);
      setSite(fetchedSite);
      setIsLoading(false);
    });
  }, []);

  const phoneHref = useMemo(() => {
    const phone = site?.settings.shop_phone ?? "+39 333 123 4567";
    return `tel:${phone.replace(/(?!^\+)[^\d]/g, "")}`;
  }, [site]);

  const groupedHours = useMemo(() => {
    const hours = site?.opening_hours ?? [];

    if (hours.length === 0) {
      return [
        "Lun - Ven: 9:00 - 19:30",
        "Sabato: 9:00 - 18:00",
        "Domenica: Chiuso",
      ];
    }

    const labels = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];

    return hours.map((hour) => `${labels[hour.weekday]}: ${hour.start_time} - ${hour.end_time}`);
  }, [site]);

  const shopName = site?.settings?.shop_name ?? "Essenza del Barbiere";
  const shopAddress = site?.settings
    ? `${site.settings.shop_address}, ${site.settings.shop_postal_code} ${site.settings.shop_city}`
    : "Via Roma 100, 20100 Milano (MI)";
  const shopPhone = site?.settings?.shop_phone ?? "+39 333 123 4567";
  const shopEmail = site?.settings?.shop_email ?? "info@ilbarbiere.it";

  return (
    <div className="min-h-screen bg-background">
      <Drawer open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DrawerContent className="mx-auto w-full max-w-xl rounded-t-3xl">
          <DrawerHeader className="px-6 pb-2 pt-6">
            <DrawerTitle className="text-xl">Accesso Admin</DrawerTitle>
            <DrawerDescription>
              Inserisci le tue credenziali per accedere al pannello.
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-6 pb-6">
            <Card className="border-0 p-0 shadow-none">
              <AdminLoginForm
                onSuccess={() => {
                  setIsLoginOpen(false);
                  navigate("/admin");
                }}
              />
            </Card>
          </div>
        </DrawerContent>
      </Drawer>

      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto max-w-5xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">{shopName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => setIsLoginOpen(true)}>
                Login admin
              </Button>
              <Button asChild>
                <Link to="/prenota">Prenota ora</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-accent to-background py-12 lg:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="space-y-6 text-center">
            <h1 className="text-4xl font-bold lg:text-5xl">
              Benvenuto da {shopName}
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Taglio, barba e stile. Prenota il tuo appuntamento in pochi secondi.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="text-base">
                <Link to="/prenota">
                  <Calendar className="mr-2 h-5 w-5" />
                  Prenota online
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base">
                <a href={phoneHref}>
                  <Phone className="mr-2 h-5 w-5" />
                  Chiama ora
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          {isLoading ? (
            <div className="mb-6 grid gap-6 md:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            services.length > 0 && (
              <div className="mb-6 grid gap-6 md:grid-cols-3">
                {services.slice(0, 3).map((service) => (
                  <Card key={service.id} className="p-6">
                    <h3 className="font-semibold">{service.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {service.duration} min • €{service.price.toFixed(2)}
                    </p>
                  </Card>
                ))}
              </div>
            )
          )}

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Indirizzo</h3>
                  {isLoading ? (
                    <Skeleton className="h-4 w-48" />
                  ) : (
                    <p className="text-sm text-muted-foreground">{shopAddress}</p>
                  )}
                  <Button variant="link" className="h-auto p-0 text-primary" asChild>
                    <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                      Visualizza mappa
                    </a>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">Orari</h3>
                  {isLoading ? (
                    <div className="space-y-1">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-40" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-0.5 text-sm text-muted-foreground">
                      {groupedHours.map((row) => (
                        <p key={row}>{row}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Contatti</h3>
                  {isLoading ? (
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Button variant="link" className="h-auto p-0 text-sm text-primary" asChild>
                        <a href={phoneHref}>{shopPhone}</a>
                      </Button>
                      <Button variant="link" className="block h-auto p-0 text-sm text-primary" asChild>
                        <a href={`mailto:${shopEmail}`}>{shopEmail}</a>
                      </Button>
                      <Button
                        variant="link"
                        className="block h-auto p-0 text-sm text-primary"
                        onClick={() => setIsLoginOpen(true)}
                      >
                        Login admin
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-12 lg:py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-center text-2xl font-semibold">Come raggiungerci</h2>
          <div className="aspect-video overflow-hidden rounded-lg bg-muted">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.3157379144516!2d9.186515!3d45.464211!2m3!1f0!2f0!3f0!2f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDI3JzUxLjIiTiA5wrAxMScxMS41IkU!5e0!3m2!1sen!2sit!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mappa Essenza del Barbiere"
            />
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                © 2026 {shopName}. Tutti i diritti riservati.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/termini" className="text-muted-foreground transition-colors hover:text-foreground">
                Termini e Condizioni
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
