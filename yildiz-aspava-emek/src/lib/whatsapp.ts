export function buildWhatsAppAppUrl(phone: string, message: string): string {
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
    cleanPhone = '90' + cleanPhone.slice(1);
  } else if (cleanPhone.length === 10) {
    cleanPhone = '90' + cleanPhone;
  }
  return `whatsapp://send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
    cleanPhone = '90' + cleanPhone.slice(1);
  } else if (cleanPhone.length === 10) {
    cleanPhone = '90' + cleanPhone;
  }
  return `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppWebUrl(phone: string, message: string): string {
  let cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
    cleanPhone = '90' + cleanPhone.slice(1);
  } else if (cleanPhone.length === 10) {
    cleanPhone = '90' + cleanPhone;
  }
  return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}

export function getConfirmationMessage(data: {
  customerName: string;
  restaurantName: string;
  date: string;
  time: string;
  guests: number;
  code: string;
}): string {
  return `Merhaba ${data.customerName}! 🎉\n\n${data.restaurantName} rezervasyonunuz onaylandı.\n\n📅 Tarih: ${data.date}\n🕐 Saat: ${data.time}\n👥 Kişi: ${data.guests}\n🔑 Onay Kodu: ${data.code}\n\nHoşgeldiniz! 🙏`;
}

export function getReminderMessage(data: {
  customerName: string;
  restaurantName: string;
  time: string;
  guests: number;
  code: string;
}): string {
  return `Merhaba ${data.customerName}! 👋\n\nYarın saat ${data.time}'da ${data.restaurantName} rezervasyonunuz var.\n\n👥 ${data.guests} kişi\n🔑 Kod: ${data.code}\n\nSizi bekliyoruz! 😊`;
}

export function getCancellationMessage(data: {
  customerName: string;
  date: string;
  reservationUrl: string;
}): string {
  return `Merhaba ${data.customerName},\n\n${data.date} tarihli rezervasyonunuz iptal edilmiştir.\n\nYeni rezervasyon için: ${data.reservationUrl}\n\nİyi günler dileriz. 🙏`;
}
