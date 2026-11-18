import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: 'Yıldız Aspava Emek | Online Masa Rezervasyonu & QR Menü',
  description: "Yıldız Aspava Emek'te anında online masa rezervasyonu yapın veya masada QR menüyü inceleyin. 1978'den beri Ankara'nın lezzet mirası.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
