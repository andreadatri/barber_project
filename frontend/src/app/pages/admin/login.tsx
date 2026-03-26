import { Link, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Scissors } from "lucide-react";
import { AdminLoginForm } from "../../components/admin-login-form";
import { Button } from "../../components/ui/button";

export default function AdminLogin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4"
            aria-label="Torna alla home"
          >
            <Scissors className="w-6 h-6 text-primary-foreground" />
          </Link>
          <h1 className="text-2xl font-bold">Accesso Admin</h1>
          <p className="text-muted-foreground mt-2">
            Inserisci le tue credenziali per accedere
          </p>
        </div>

        <Card className="p-6">
          <AdminLoginForm onSuccess={() => navigate("/admin")} />

          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/">Torna alla home</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
}
