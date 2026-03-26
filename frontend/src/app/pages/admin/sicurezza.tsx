import { useEffect, useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { AdminLayout } from "../../components/admin-layout";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { getAdminProfile, updateAdminSecurity } from "../../lib/api";

type SecurityFormState = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const initialState: SecurityFormState = {
  name: "",
  email: "",
  password: "",
  passwordConfirmation: "",
};

export default function AdminSicurezza() {
  const [form, setForm] = useState<SecurityFormState>(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  useEffect(() => {
    getAdminProfile()
      .then((profile) => {
        setForm((current) => ({
          ...current,
          name: profile.name,
          email: profile.email,
        }));
      })
      .catch(() => {
        window.location.href = "/admin/login";
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const updated = await updateAdminSecurity({
        name: form.name,
        email: form.email,
        password: form.password || undefined,
        password_confirmation: form.passwordConfirmation || undefined,
      });

      setForm({
        name: updated.name,
        email: updated.email,
        password: "",
        passwordConfirmation: "",
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossibile aggiornare le credenziali."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Sicurezza"
      breadcrumbs={[{ label: "Sicurezza" }]}
    >
      <div className="max-w-2xl space-y-6">
        {loading && (
          <Alert>
            <AlertDescription>Caricamento profilo admin...</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {saved && (
          <Alert className="border-green-200 bg-green-50 text-green-900">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            <AlertDescription>Credenziali aggiornate con successo.</AlertDescription>
          </Alert>
        )}

        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Nome</Label>
              <Input
                id="admin-name"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                disabled={loading || saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-email-security">Mail</Label>
              <Input
                id="admin-email-security"
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                disabled={loading || saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password-security">Nuova password</Label>
              <div className="relative">
                <Input
                  id="admin-password-security"
                  type={showPassword ? "text" : "password"}
                  className="pr-12"
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  placeholder="Lascia vuoto per non modificarla"
                  disabled={loading || saving}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Nascondi password" : "Mostra password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password-confirmation">
                Conferma password
              </Label>
              <div className="relative">
                <Input
                  id="admin-password-confirmation"
                  type={showPasswordConfirmation ? "text" : "password"}
                  className="pr-12"
                  value={form.passwordConfirmation}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      passwordConfirmation: event.target.value,
                    })
                  }
                  placeholder="Ripeti la nuova password"
                  disabled={loading || saving}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() =>
                    setShowPasswordConfirmation((current) => !current)
                  }
                  aria-label={
                    showPasswordConfirmation
                      ? "Nascondi conferma password"
                      : "Mostra conferma password"
                  }
                >
                  {showPasswordConfirmation ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Button onClick={handleSave} size="lg" disabled={loading || saving}>
          {saving ? "Salvataggio..." : "Salva credenziali"}
        </Button>
      </div>
    </AdminLayout>
  );
}