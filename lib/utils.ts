import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getMonday(date = new Date()) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = copy.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(copy.setDate(diff));
}

export function toDateInput(date: Date) {
  return date.toISOString().split("T")[0];
}
