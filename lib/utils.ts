import { clsx, type ClassValue } from "clsx";
import { createHash } from "crypto";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateDomain(shopName: string, tld = "Xrow.com") {
  const slug = shopName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}.${tld}`;
}

export function generateSlug(shopName: string) {
  return shopName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
export function hashGiftCardCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}
export const initialCountryLookup = async () => {
  const res = await fetch("https://ipapi.co/json");
  const data = await res.json();
  return data.country_code;
};
