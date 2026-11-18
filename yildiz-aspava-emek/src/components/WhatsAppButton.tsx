import { buildWhatsAppUrl } from '@/lib/whatsapp';

interface Props {
  phone?: string;
  message?: string;
  label?: string;
  className?: string;
}

export default function WhatsAppButton({
  phone = '+905521193095',
  message = 'Merhaba, rezervasyon hakkında bilgi almak istiyorum.',
  label = 'WhatsApp',
  className = '',
}: Props) {
  const url = buildWhatsAppUrl(phone, message);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 bg-[#25d366] text-white font-bold px-4 py-2 rounded transition-opacity hover:opacity-90 text-sm ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.116 1.524 5.849L.057 23.5l5.82-1.526A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.655-.511-5.18-1.402l-.371-.22-3.455.905.923-3.36-.241-.387A9.955 9.955 0 0 1 2 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10z" />
      </svg>
      {label}
    </a>
  );
}
