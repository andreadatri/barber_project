import type { BookingConfirmation, BookingService } from "./api";

export interface BookingContact {
  name: string;
  phone: string;
  email: string;
  notes: string;
}

const KEYS = {
  service: "booking-service",
  date: "booking-date",
  time: "booking-time",
  contact: "booking-contact",
  confirmation: "booking-confirmation",
} as const;

function readJson<T>(key: string): T | null {
  const raw = sessionStorage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setBookingService(service: BookingService) {
  sessionStorage.setItem(KEYS.service, JSON.stringify(service));
}

export function getBookingService(): BookingService | null {
  return readJson<BookingService>(KEYS.service);
}

export function setBookingDate(dateIso: string) {
  sessionStorage.setItem(KEYS.date, dateIso);
}

export function getBookingDate() {
  return sessionStorage.getItem(KEYS.date);
}

export function setBookingTime(time: string) {
  sessionStorage.setItem(KEYS.time, time);
}

export function getBookingTime() {
  return sessionStorage.getItem(KEYS.time);
}

export function setBookingContact(contact: BookingContact) {
  sessionStorage.setItem(KEYS.contact, JSON.stringify(contact));
}

export function getBookingContact(): BookingContact | null {
  return readJson<BookingContact>(KEYS.contact);
}

export function setBookingConfirmation(confirmation: BookingConfirmation) {
  sessionStorage.setItem(KEYS.confirmation, JSON.stringify(confirmation));
}

export function getBookingConfirmation(): BookingConfirmation | null {
  return readJson<BookingConfirmation>(KEYS.confirmation);
}

export function clearBookingFlow() {
  Object.values(KEYS).forEach((key) => sessionStorage.removeItem(key));
}
