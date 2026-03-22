import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Stepper, Step } from "../../components/stepper";
import { Button } from "../../components/ui/button";
import { BookingSummary } from "../../components/booking-summary";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { ArrowLeft, AlertCircle } from "lucide-react";
import {
  getBookingContact,
  getBookingDate,
  getBookingService,
  getBookingTime,
  setBookingContact,
} from "../../lib/booking-storage";

const steps: Step[] = [
  { id: 1, label: "Servizio" },
  { id: 2, label: "Data" },
  { id: 3, label: "Ora" },
  { id: 4, label: "Contatti" },
  { id: 5, label: "Conferma" },
];

interface FormData {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
}

export default function Step4Contact() {
  const navigate = useNavigate();
  const savedContact = getBookingContact();
  const [formData, setFormData] = useState<FormData>({
    name: savedContact?.name ?? "",
    phone: savedContact?.phone ?? "",
    email: savedContact?.email ?? "",
    notes: savedContact?.notes ?? "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Get data from session
  const service = getBookingService() ?? undefined;
  const dateData = getBookingDate();
  const date = dateData ? new Date(dateData) : undefined;
  const time = getBookingTime() || undefined;

  const validateField = (name: keyof FormData, value: string) => {
    const newErrors: FormErrors = { ...errors };

    if (name === "name") {
      if (!value.trim()) {
        newErrors.name = "Il nome è obbligatorio";
      } else if (value.trim().length < 2) {
        newErrors.name = "Il nome deve contenere almeno 2 caratteri";
      } else {
        delete newErrors.name;
      }
    }

    if (name === "phone") {
      if (!value.trim()) {
        newErrors.phone = "Il telefono è obbligatorio";
      } else if (!/^[\d\s\-\+\(\)]{8,}$/.test(value)) {
        newErrors.phone = "Inserisci un numero di telefono valido";
      } else {
        delete newErrors.phone;
      }
    }

    if (name === "email" && value.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors.email = "Inserisci un'email valida";
      } else {
        delete newErrors.email;
      }
    } else if (name === "email" && !value.trim()) {
      delete newErrors.email;
    }

    setErrors(newErrors);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateField(name as keyof FormData, value);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name as keyof FormData, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      name: true,
      phone: true,
      email: true,
    });

    // Validate all fields
    validateField("name", formData.name);
    validateField("phone", formData.phone);
    validateField("email", formData.email);

    // Check if there are errors
    const hasErrors =
      !formData.name.trim() ||
      !formData.phone.trim() ||
      (formData.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));

    if (!hasErrors) {
      setBookingContact(formData);
      navigate("/prenota/step5");
    }
  };

  const hasFormErrors = Object.keys(errors).length > 0;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/prenota/step3">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <h1 className="font-semibold">Prenota appuntamento</h1>
          </div>
        </div>
      </header>

      <div className="container max-w-5xl mx-auto px-4 py-6">
        <Stepper steps={steps} currentStep={4} />

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">I tuoi dati</h2>
              <p className="text-sm text-muted-foreground">
                Inserisci i tuoi contatti per confermare la prenotazione
              </p>
            </div>

            {hasFormErrors && touched.name && touched.phone && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Correggi gli errori nel modulo prima di continuare
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-background rounded-lg border p-6 space-y-4">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nome e cognome <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Mario Rossi"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.name && touched.name ? "border-destructive" : ""}
                  />
                  {errors.name && touched.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Telefono <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+39 333 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.phone && touched.phone ? "border-destructive" : ""
                    }
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email (opzionale)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="mario.rossi@email.it"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.email && touched.email ? "border-destructive" : ""
                    }
                  />
                  {errors.email && touched.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Note (opzionale)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Eventuali richieste particolari..."
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" asChild>
                  <Link to="/prenota/step3">Indietro</Link>
                </Button>
                <Button type="submit">Continua</Button>
              </div>
            </form>
          </div>

          {/* Sidebar summary */}
          <div className="lg:col-span-1">
            <BookingSummary
              service={service}
              date={date}
              time={time}
              className="sticky top-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
