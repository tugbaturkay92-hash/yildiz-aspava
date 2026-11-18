'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  UtensilsCrossed,
  TableProperties,
  Settings,
  LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/rezervasyonlar', label: 'Rezervasyonlar', icon: CalendarCheck },
  { href: '/admin/menu', label: 'Menü', icon: UtensilsCrossed },
  { href: '/admin/masalar', label: 'Masalar', icon: TableProperties },
  { href: '/admin/ayarlar', label: 'Ayarlar', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/giris');
  };

  return (
    <aside className="w-64 min-h-screen bg-[#111827] flex flex-col border-r border-white/5">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Link href="/admin" className="text-white font-bold text-sm tracking-widest uppercase">
          Yıldız Aspava Admin
        </Link>
        <div className="text-[#C59D5F] text-xs mt-0.5">Yönetim Paneli</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
              isActive(href, exact)
                ? 'bg-[#ad3114] text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut size={17} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
