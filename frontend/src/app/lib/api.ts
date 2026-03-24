const API_BASE = "/api";

export interface BookingService {
  id: number;
  name: string;
  duration: number;
  price: number;
  description: string;
}

export interface AvailabilitySlot {
  time: string;
  available: boolean;
  reason?: string | null;
}

export interface SiteSettings {
  shop_name: string;
  shop_address: string;
  shop_city: string;
  shop_postal_code: string;
  shop_phone: string;
  shop_email: string;
  shop_vat_number: string | null;
}

export interface OpeningHour {
  weekday: number;
  start_time: string;
  end_time: string;
}

export interface SiteConfig {
  settings: SiteSettings;
  opening_hours: OpeningHour[];
}

export interface BookingContactPayload {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  notes?: string;
}

export interface BookingConfirmation {
  id: number;
  status: string;
  service: {
    id: number;
    name: string;
    duration: number;
    price: number;
  };
  customer: {
    name: string;
    phone: string;
    email?: string | null;
    notes?: string | null;
  };
  start_at: string;
  end_at: string;
}

export interface AdminAppointment {
  id: number;
  status: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  notes?: string | null;
  start_at: string;
  end_at: string;
  service: {
    id: number;
    name: string;
    duration: number;
    price: number;
  };
}

function getCsrfToken() {
  return (
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") ?? ""
  );
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      payload.message ??
      payload.error ??
      "Richiesta non riuscita. Riprova tra qualche istante.";

    throw new Error(message);
  }

  return payload as T;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const response = await request<{ data: SiteConfig }>("/site");
  return response.data;
}

export async function getServices(): Promise<BookingService[]> {
  const response = await request<{ data: BookingService[] }>("/services");
  return response.data;
}

export async function getAvailability(serviceId: number, date: string) {
  const response = await request<{
    data: {
      date: string;
      slots: AvailabilitySlot[];
    };
  }>(`/availability?service_id=${serviceId}&date=${date}`);

  return response.data;
}

export async function createBooking(
  payload: {
    service_id: number;
    date: string;
    time: string;
  } & BookingContactPayload
): Promise<BookingConfirmation> {
  const response = await request<{ data: BookingConfirmation }>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function getAdminAppointments(): Promise<AdminAppointment[]> {
  const response = await request<{ data: AdminAppointment[] }>(
    "/admin/appointments"
  );

  return response.data;
}

export async function updateAdminAppointmentStatus(
  appointmentId: number,
  status: "booked" | "completed" | "cancelled"
): Promise<AdminAppointment> {
  const response = await request<{ data: AdminAppointment }>(
    `/admin/appointments/${appointmentId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );

  return response.data;
}

export async function getAdminSettings(): Promise<SiteSettings> {
  const response = await request<{ data: SiteSettings }>("/admin/settings");
  return response.data;
}

export async function updateAdminSettings(
  payload: SiteSettings
): Promise<SiteSettings> {
  const response = await request<{ data: SiteSettings }>("/admin/settings", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return response.data;
}

export async function login(email: string, password: string): Promise<void> {
  const response = await fetch("/login", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
    },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    return;
  }

  const payload = await response.json().catch(() => ({}));
  throw new Error(payload.message ?? "Email o password non corretti.");
}

export async function logout(): Promise<void> {
  await fetch("/logout", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "X-CSRF-TOKEN": getCsrfToken(),
    },
  });
}
