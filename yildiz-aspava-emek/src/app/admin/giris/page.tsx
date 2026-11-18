'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GirisPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Giriş başarısız');
        return;
      }
      router.push('/admin');
    } catch {
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-white text-2xl font-bold tracking-widest uppercase mb-1">Yıldız Aspava</div>
          <div className="text-[#C59D5F] text-sm font-semibold">Emek Şubesi — Yönetim Paneli</div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#1e293b] rounded-lg p-8 border border-white/5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="admin@aspava.com"
              className="w-full bg-[#0f172a] border border-white/10 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-[#ad3114]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#0f172a] border border-white/10 text-white px-4 py-3 rounded text-sm focus:outline-none focus:border-[#ad3114]"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ad3114] text-white py-3 rounded font-bold tracking-widest uppercase text-sm hover:bg-[#8a2710] transition-colors disabled:opacity-60 mt-2"
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>

          <div className="pt-2 text-center text-xs text-gray-400 border-t border-white/10">
            Varsayılan E-posta: <span className="text-[#C59D5F] font-mono">admin@aspava.com</span>
          </div>
        </form>
      </div>
    </div>
  );
}
