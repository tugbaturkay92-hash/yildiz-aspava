import { z } from 'zod';

export const reservationSchema = z.object({
  date: z.string().min(1, 'Tarih seçiniz'),
  time: z.string().min(1, 'Saat seçiniz'),
  guestCount: z.number().min(1).max(12),
  customerName: z.string().min(2, 'Ad soyad en az 2 karakter olmalı'),
  customerPhone: z.string().min(10, 'Geçerli telefon numarası giriniz'),
  customerEmail: z.string().email('Geçerli e-posta giriniz').optional().or(z.literal('')),
  notes: z.string().optional(),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

export const menuItemSchema = z.object({
  name: z.string().min(1, 'Ürün adı zorunlu'),
  description: z.string().optional(),
  price: z.number().min(0, 'Fiyat 0 veya üzeri olmalı'),
  categoryId: z.string().min(1, 'Kategori seçiniz'),
  isAvailable: z.boolean().default(true),
  isPopular: z.boolean().default(false),
});

export const loginSchema = z.object({
  email: z.string().email('Geçerli e-posta giriniz'),
  password: z.string().min(1, 'Şifre giriniz'),
});
