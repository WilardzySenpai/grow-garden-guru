import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function maskEmail(email: string): string {
  if (!email) return '';

  const [name, domain] = email.split('@');
  if (!name || !domain) return email;

  const maskedName = name.length > 2
    ? `${name.charAt(0)}${'*'.repeat(Math.max(0, name.length - 2))}${name.charAt(name.length - 1)}`
    : `${name.charAt(0)}*`;

  return `${maskedName}@${domain}`;
}
