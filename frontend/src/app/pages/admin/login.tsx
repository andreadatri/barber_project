import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Scissors } from "lucide-react";
import { AdminLoginForm } from "../../components/admin-login-form";

export default function AdminLogin() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4">
            <Scissors className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Accesso Admin</h1>
          <p className="text-muted-foreground mt-2">
            Inserisci le tue credenziali per accedere
          </p>
        </div>

        <Card className="p-6">
          <AdminLoginForm onSuccess={() => navigate("/admin")} />
        </Card>
      </div>
    </div>
  );
}
