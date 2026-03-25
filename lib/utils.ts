import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWhatsAppUrl(phone: string, name?: string) {
  const cleaned = phone.replace(/\D/g, "");
  const message = name
    ? `Hi ${name}, I saw your profile and I'd like to connect.`
    : "Hi, I saw your profile and I'd like to connect.";
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function getInitials(name: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatNumber(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

export function getAvatarUrl(url: string | null) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${url}`;
}

export function getProjectImageUrl(url: string | null) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/${url}`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function isValidUsername(username: string) {
  return /^[a-z0-9_-]{3,30}$/.test(username);
}
