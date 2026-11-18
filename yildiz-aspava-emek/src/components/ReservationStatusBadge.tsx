import { RESERVATION_STATUSES, type ReservationStatus } from '@/lib/constants';

interface Props {
  status: string;
}

const colorMap: Record<string, string> = {
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-800',
};

export default function ReservationStatusBadge({ status }: Props) {
  const info = RESERVATION_STATUSES[status as ReservationStatus];
  if (!info) return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full font-semibold">{status}</span>;

  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${colorMap[info.color]}`}>
      {info.label}
    </span>
  );
}
