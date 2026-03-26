import { createBrowserRouter } from "react-router-dom";

// Public pages
import Landing from "./pages/landing";
import Step1Service from "./pages/booking/step1-service";
import Step2Date from "./pages/booking/step2-date";
import Step3Time from "./pages/booking/step3-time";
import Step4Contact from "./pages/booking/step4-contact";
import Step5Confirm from "./pages/booking/step5-confirm";
import BookingSuccess from "./pages/booking/success";
import BookingConflict from "./pages/booking/conflict";

// Admin pages
import AdminLogin from "./pages/admin/login";
import AdminDashboard from "./pages/admin/dashboard";
import AdminServizi from "./pages/admin/servizi";
import AdminAppuntamenti from "./pages/admin/appuntamenti";
import AdminDisponibilita from "./pages/admin/disponibilita";
import AdminImpostazioni from "./pages/admin/impostazioni";
import AdminSicurezza from "./pages/admin/sicurezza";

// Simple pages
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <p className="text-muted-foreground">Pagina non trovata</p>
      </div>
    </div>
  );
}

function Privacy() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose prose-sm">
          <p>Informativa sulla privacy in fase di implementazione.</p>
        </div>
      </div>
    </div>
  );
}

function Terms() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Termini e Condizioni</h1>
        <div className="prose prose-sm">
          <p>Termini e condizioni in fase di implementazione.</p>
        </div>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/prenota",
    Component: Step1Service,
  },
  {
    path: "/prenota/step1",
    Component: Step1Service,
  },
  {
    path: "/prenota/step2",
    Component: Step2Date,
  },
  {
    path: "/prenota/step3",
    Component: Step3Time,
  },
  {
    path: "/prenota/step4",
    Component: Step4Contact,
  },
  {
    path: "/prenota/step5",
    Component: Step5Confirm,
  },
  {
    path: "/prenota/success",
    Component: BookingSuccess,
  },
  {
    path: "/prenota/conflict",
    Component: BookingConflict,
  },
  {
    path: "/privacy",
    Component: Privacy,
  },
  {
    path: "/termini",
    Component: Terms,
  },
  {
    path: "/admin/login",
    Component: AdminLogin,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/admin/appuntamenti",
    Component: AdminAppuntamenti,
  },
  {
    path: "/admin/servizi",
    Component: AdminServizi,
  },
  {
    path: "/admin/disponibilita",
    Component: AdminDisponibilita,
  },
  {
    path: "/admin/impostazioni",
    Component: AdminImpostazioni,
  },
  {
    path: "/admin/sicurezza",
    Component: AdminSicurezza,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
