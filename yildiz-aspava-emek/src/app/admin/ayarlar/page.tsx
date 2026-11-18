'use client';

import { useEffect, useState } from 'react';

interface Restaurant {
  name: string;
  phone: string;
  address: string;
  description: string;
  openingTime: string;
  closingTime: string;
  slotDuration: number;
  maxGuests: number;
  maxAdvanceDays: number;
}

export default function AdminAyarlarPage() {
  const [data, setData] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/restaurant')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    await fetch('/api/restaurant', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#ad3114] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!data) return <div className="p-8 text-red-400">Restoran bilgisi yüklenemedi.</div>;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-white text-2xl font-bold mb-8">Restoran Ayarları</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#1e293b] rounded-lg p-6 border border-white/5 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider pb-2 border-b border-white/5">Temel Bilgiler</h2>

          {[
            { key: 'name', label: 'Restoran Adı', type: 'text' },
            { key: 'phone', label: 'Telefon', type: 'tel' },
            { key: 'address', label: 'Adres', type: 'text' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</label>
              <input
                type={type}
                value={(data as unknown as Record<string, string>)[key]}
                onChange={(e) => setData({ ...data, [key]: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/10 text-white px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#ad3114]"
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Açıklama</label>
            <textarea
              value={data.description || ''}
              onChange={(e) => setData({ ...data, description: e.target.value })}
              rows={2}
              className="w-full bg-[#0f172a] border border-white/10 text-white px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#ad3114] resize-none"
            />
          </div>
        </div>

        <div className="bg-[#1e293b] rounded-lg p-6 border border-white/5 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider pb-2 border-b border-white/5">Rezervasyon Ayarları</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Açılış Saati</label>
              <input type="time" value={data.openingTime}
                onChange={(e) => setData({ ...data, openingTime: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/10 text-white px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#ad3114]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Kapanış Saati</label>
              <input type="time" value={data.closingTime}
                onChange={(e) => setData({ ...data, closingTime: e.target.value })}
                className="w-full bg-[#0f172a] border border-white/10 text-white px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#ad3114]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Slot Süresi (dk)</label>
              <input type="number" min="30" step="30" value={data.slotDuration}
                onChange={(e) => setData({ ...data, slotDuration: Number(e.target.value) })}
                className="w-full bg-[#0f172a] border border-white/10 text-white px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#ad3114]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Max Kişi</label>
              <input type="number" min="1" value={data.maxGuests}
                onChange={(e) => setData({ ...data, maxGuests: Number(e.target.value) })}
                className="w-full bg-[#0f172a] border border-white/10 text-white px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#ad3114]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Max İleri Gün</label>
            <input type="number" min="1" max="90" value={data.maxAdvanceDays}
              onChange={(e) => setData({ ...data, maxAdvanceDays: Number(e.target.value) })}
              className="w-full bg-[#0f172a] border border-white/10 text-white px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#ad3114]" />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-[#ad3114] text-white px-8 py-3 rounded font-bold tracking-widest uppercase text-sm hover:bg-[#8a2710] transition-colors disabled:opacity-60"
        >
          {saving ? 'Kaydediliyor...' : saved ? '✓ Kaydedildi' : 'Kaydet'}
        </button>
      </form>
    </div>
  );
}
