'use client';

import { useEffect, useState } from 'react';
import { Plus, X, QrCode, Download } from 'lucide-react';

interface Table {
  id: string;
  name: string;
  capacity: number;
  location: string;
  isActive: boolean;
}

const LOCATIONS = [
  { value: 'ic-mekan', label: 'İç Mekan' },
  { value: 'bahce', label: 'Bahçe' },
  { value: 'teras', label: 'Teras' },
];

export default function AdminMasalarPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', capacity: '2', location: 'ic-mekan' });
  const [qrData, setQrData] = useState<{ dataUrl: string; tableName: string } | null>(null);

  const fetchTables = async () => {
    const res = await fetch('/api/tables');
    const data = await res.json();
    setTables(data);
    setLoading(false);
  };

  useEffect(() => { fetchTables(); }, []);

  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/tables', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, capacity: parseInt(form.capacity) }),
    });
    setShowForm(false);
    setForm({ name: '', capacity: '2', location: 'ic-mekan' });
    fetchTables();
  };

  const handleDeleteTable = async (id: string) => {
    if (!confirm('Masayı devre dışı bırakmak istediğinizden emin misiniz?')) return;
    await fetch(`/api/tables/${id}`, { method: 'DELETE' });
    fetchTables();
  };

  const handleGenerateQR = async (table: Table) => {
    const res = await fetch(`/api/qr/generate?tableId=${table.id}`);
    const data = await res.json();
    setQrData({ dataUrl: data.dataUrl, tableName: table.name });
  };

  const downloadQR = () => {
    if (!qrData) return;
    const a = document.createElement('a');
    a.href = qrData.dataUrl;
    a.download = `${qrData.tableName.replace(/\s+/g, '-')}-qr.png`;
    a.click();
  };

  const locationLabel = (loc: string) => LOCATIONS.find((l) => l.value === loc)?.label || loc;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-2xl font-bold">Masa Yönetimi</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#ad3114] text-white px-4 py-2 rounded text-sm font-bold hover:bg-[#8a2710] transition-colors"
        >
          <Plus size={15} /> Masa Ekle
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-lg border border-white/5">
        {loading ? (
          <div className="py-16 flex justify-center">
            <div className="w-8 h-8 border-2 border-[#ad3114] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Masa', 'Kapasite', 'Konum', 'QR Kod'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {tables.map((t) => (
                  <tr key={t.id}>
                    <td className="px-6 py-4 text-white font-medium">{t.name}</td>
                    <td className="px-6 py-4 text-gray-300">{t.capacity} kişi</td>
                    <td className="px-6 py-4 text-gray-300">{locationLabel(t.location)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleGenerateQR(t)}
                          className="flex items-center gap-1 text-[#ad3114] hover:text-white text-xs font-semibold"
                        >
                          <QrCode size={14} /> QR Oluştur
                        </button>
                        <button
                          onClick={() => handleDeleteTable(t.id)}
                          className="text-gray-500 hover:text-red-400 text-xs"
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add table modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#1e293b] rounded-lg p-8 max-w-sm w-full border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold">Masa Ekle</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddTable} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Masa Adı *</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Masa 9"
                  className="w-full bg-[#0f172a] border border-white/10 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-[#ad3114]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Kapasite *</label>
                <input type="number" required min="1" max="20" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-[#ad3114]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Konum</label>
                <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full bg-[#0f172a] border border-white/10 text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-[#ad3114]">
                  {LOCATIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-[#ad3114] text-white py-2.5 rounded text-sm font-bold hover:bg-[#8a2710]">Ekle</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-[#0f172a] text-gray-400 py-2.5 rounded text-sm font-bold">İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR modal */}
      {qrData && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setQrData(null)}>
          <div className="bg-[#1e293b] rounded-lg p-8 border border-white/10 text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-white font-bold mb-4">{qrData.tableName} — QR Kod</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrData.dataUrl} alt="QR Kod" className="mx-auto mb-4 rounded" />
            <div className="flex gap-3">
              <button
                onClick={downloadQR}
                className="flex items-center gap-2 bg-[#ad3114] text-white px-5 py-2.5 rounded text-sm font-bold hover:bg-[#8a2710]"
              >
                <Download size={15} /> İndir
              </button>
              <button onClick={() => setQrData(null)} className="bg-[#0f172a] text-gray-400 px-5 py-2.5 rounded text-sm font-bold hover:text-white">
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
