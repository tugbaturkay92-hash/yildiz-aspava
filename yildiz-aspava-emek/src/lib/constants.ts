export const RESTAURANT_SLUG = 'yildiz-aspava-emek';
export const RESTAURANT_PHONE = '+905521193095';

export const RESERVATION_STATUSES = {
  pending: { label: 'Bekliyor', color: 'yellow' },
  confirmed: { label: 'Onaylandı', color: 'green' },
  cancelled: { label: 'İptal', color: 'red' },
  completed: { label: 'Tamamlandı', color: 'blue' },
  no_show: { label: 'Gelmedi', color: 'gray' },
} as const;

export type ReservationStatus = keyof typeof RESERVATION_STATUSES;
