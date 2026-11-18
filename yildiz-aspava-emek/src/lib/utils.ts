import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `₺${price.toLocaleString('tr-TR')}`;
}

export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.startsWith('90') && clean.length === 12) {
    return `+90 (${clean.slice(2, 5)}) ${clean.slice(5, 8)} ${clean.slice(8, 10)} ${clean.slice(10)}`;
  }
  return phone;
}
