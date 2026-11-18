# Restoran & Lokanta QR Menü ve Rezervasyon Sistemi

Bu proje **Next.js 14**, **Tailwind CSS**, **Prisma ORM** ve **PostgreSQL (Supabase)** kullanılarak geliştirilmiş bir restoran QR menü ve masa rezervasyon yönetim sistemidir.

---

## 🚀 Hızlı Başlangıç

### 1. Gereksinimler
- **Node.js** (v18 veya üzeri önerilir)
- **PostgreSQL Veritabanı** (Örn: [Supabase](https://supabase.com))

Bilgisayarınızda Node.js yüklü değilse, PowerShell veya Komut İstemi'nde şu komutla yükleyebilirsiniz:
```powershell
winget install OpenJS.NodeJS.LTS
```

---

### 2. Ortam Değişkenleri (.env)

Proje kök dizinindeki `.env` dosyasını açıp kendi veritabanı ve admin bilgilerinizi girin:

```env
# Supabase Transaction pooler (port 6543)
DATABASE_URL="postgresql://postgres.[PROJE_REF]:[SIFRE]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase Session pooler (port 5432)
DIRECT_URL="postgresql://postgres.[PROJE_REF]:[SIFRE]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"

# Uygulama URL'si
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Oturum güvenliği anahtarı (en az 32 karakterlik rastgele bir metin)
SESSION_SECRET="buraya-en-az-32-karakter-rastgele-bir-sifre-yazin-ornek123"

# Admin paneli giriş bilgileri
ADMIN_EMAIL="admin@restoraniniz.com"
ADMIN_PASSWORD="guclu-bir-sifre-secin"
```

---

### 3. Otomatik Kurulum ve Veritabanı Başlatma

Aşağıdaki komutu çalıştırarak bağımlılıkları yükleyebilir, Prisma şemasını veritabanına aktarabilir ve örnek verileri (masalar, menü kategorileri, admin hesabı) ekleyebilirsiniz:

```bash
npm run setup
```

*(Bu komut sırasıyla `npm install`, `npx prisma generate`, `npx prisma db push` ve `npx tsx prisma/seed.ts` adımlarını yürütür).*

---

### 4. Geliştirme Sunucusunu Başlatma

```bash
npm run dev
```

Tarayıcınızda açın:
- **Müşteri QR Menü & Rezervasyon Sayfası:** [http://localhost:3000](http://localhost:3000)
- **Admin Yönetim Paneli:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Prisma Studio (Veritabanı Görsel Arayüzü):** `npm run db:studio`

---

## 📁 Proje Yapısı

- `src/app/` : Sayfa ve rota tanımları (App Router)
  - `admin/` : Rezervasyon ve menü yönetimi, masa düzeni
  - `menu/` : Restoran menüsü
  - `qr/` : Masa bazlı QR kod oluşturucu ve gösterici
  - `rezervasyon/` : Müşteri rezervasyon adımları
- `src/components/` : Yeniden kullanılabilir UI bileşenleri
- `src/lib/` : Prisma istemcisi, oturum yönetimi, QR oluşturucu, WhatsApp bildirim yardımcıları
- `prisma/` : Veritabanı şeması (`schema.prisma`) ve başlangıç verileri (`seed.ts`)
