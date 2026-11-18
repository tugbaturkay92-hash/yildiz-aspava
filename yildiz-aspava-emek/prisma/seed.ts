import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Yıldız Aspava Emek Seed basliyor...');

  // Temizle
  await prisma.reservation.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.table.deleteMany();
  await prisma.adminUser.deleteMany();
  await prisma.restaurant.deleteMany();

  // Restoran
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'Yıldız Aspava Emek',
      slug: 'yildiz-aspava-emek',
      phone: '+905521193095',
      address: 'Emek Mah. Bişkek Cad. No: 64 B, Çankaya / Ankara',
      description: "1978'den beri Ankara'nın lezzet mirası Yıldız Aspava Emek. Allah Sağlık, Para, Afiyet Versin Amin felsefesiyle meşe odununda Ankara döneri, geleneksel kebaplar, taş fırın pideleri ve 9 çeşit meşhur ikram ritüeli.",
      primaryColor: '#9E1B1B',
      openingTime: '11:00',
      closingTime: '22:00',
      slotDuration: 90,
      maxGuests: 16,
      maxAdvanceDays: 30,
    },
  });

  // Admin kullanici
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@aspava.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: 'Yıldız Aspava Admin',
    },
  });

  // Masalar (Emek Şubesi)
  const tableData = [
    { name: 'Masa 1 (İç Mekân)', capacity: 2, location: 'ic-mekan' },
    { name: 'Masa 2 (İç Mekân)', capacity: 2, location: 'ic-mekan' },
    { name: 'Masa 3 (İç Mekân)', capacity: 4, location: 'ic-mekan' },
    { name: 'Masa 4 (İç Mekân)', capacity: 4, location: 'ic-mekan' },
    { name: 'Masa 5 (İç Mekân)', capacity: 6, location: 'ic-mekan' },
    { name: 'Masa 6 (İç Mekân - Aile)', capacity: 8, location: 'ic-mekan' },
    { name: 'Bahçe 1', capacity: 4, location: 'bahce' },
    { name: 'Bahçe 2', capacity: 4, location: 'bahce' },
    { name: 'Bahçe 3', capacity: 6, location: 'bahce' },
    { name: 'Bahçe 4', capacity: 8, location: 'bahce' },
    { name: 'Teras 1', capacity: 4, location: 'teras' },
    { name: 'Teras 2 (Manzara)', capacity: 6, location: 'teras' },
    { name: 'VIP Loca', capacity: 12, location: 'vip' },
  ];
  for (const td of tableData) {
    await prisma.table.create({ data: { restaurantId: restaurant.id, ...td } });
  }

  // Menü Kategorileri ve Yıldız Aspava'nın Gerçek Ürünleri
  const categoryData = [
    {
      name: 'Meşhur Dönerler & Dürümler',
      sortOrder: 0,
      items: [
        { name: 'Yıldız Special Dürüm', description: 'Meşe odununda yaprak Ankara döneri, özel domates sos, kaşar eritmesi, patates kızartması ve tereyağlı lavaş', price: 340, isPopular: true },
        { name: 'SSK Dürüm (Soslu, Soğanlı, Kaşarlı)', description: 'Efsane Ankara döneri klasiği; özel salçalı sos, ince kıyım soğan, erimiş kaşar peyniri', price: 320, isPopular: true },
        { name: 'Porsiyon Ankara Döneri', description: 'Geleneksel meşe odunu ateşiyle pişirilmiş %100 dana ve kuzu yaprak döner, garnitür eşliğinde', price: 360, isPopular: true },
        { name: 'Pilav Üstü Döner', description: 'Tereyağlı şehriyeli pirinç pilavı üzerinde yaprak Ankara döneri', price: 380, isPopular: false },
        { name: 'İskender Kebap', description: 'Kızarmış pide parçaları üzerinde döner, domates sosu, tava yoğurdu ve hakiki köy tereyağı', price: 390, isPopular: true },
      ],
    },
    {
      name: 'Geleneksel Kebaplar & Izgaralar',
      sortOrder: 1,
      items: [
        { name: 'Adana Kebap', description: 'Zırhla çekilmiş kuzu kıyması, pul biber ve baharatlar, köz biber ve domatesle', price: 340, isPopular: true },
        { name: 'Urfa Kebap', description: 'Zırhla çekilmiş sade kuzu eti, köz sebzeler ve lavaş ile', price: 330, isPopular: false },
        { name: 'Beyti Sarma', description: 'Lavaşa sarılı ızgara kıyma kebabı, dilimlenmiş, yoğurt ve tereyağlı sos eşliğinde', price: 390, isPopular: true },
        { name: 'Kuzu Şiş', description: 'Özel marinasyonlu körpe kuzu but etleri, kömür ateşinde', price: 420, isPopular: true },
        { name: 'Karışık Izgara Yıldız', description: 'Adana, kuzu şiş, tavuk şiş, köfte ve yaprak dönerden oluşan zengin tabak', price: 540, isPopular: true },
        { name: 'Yıldız Kasap Köfte', description: 'Geleneksel lezzetinde dana-kuzu köfte, patates tava ile', price: 310, isPopular: false },
      ],
    },
    {
      name: 'Tavuk Lezzetleri',
      sortOrder: 2,
      items: [
        { name: 'Tavuk Şiş', description: 'Özel baharat sosunda dinlendirilmiş tavuk göğsü, köz sebzeler', price: 270, isPopular: true },
        { name: 'Tavuk Kanat', description: 'Mangal ateşinde çıtır ızgara kanat', price: 280, isPopular: false },
        { name: 'Tavuk Pirzola', description: 'Kemiksiz tavuk but pirzola, köz domates-biber ile', price: 290, isPopular: false },
      ],
    },
    {
      name: 'Kiremitte Özel Lezzetler',
      sortOrder: 3,
      items: [
        { name: 'Kiremitte Köfte', description: 'Toprak güveçte kaşar ve domates soslu fırınlanmış köfte', price: 350, isPopular: false },
        { name: 'Kiremitte Kuşbaşı', description: 'Toprak kapta tereyağlı, biberli domatesli kuşbaşı dana eti', price: 390, isPopular: true },
      ],
    },
    {
      name: 'Taş Fırın Pideleri',
      sortOrder: 4,
      items: [
        { name: 'Kuşbaşılı Kaşarlı Pide', description: 'Taş fırında çıtır hamur, kuşbaşı et ve bol kaşar', price: 260, isPopular: true },
        { name: 'Kıymalı Pide', description: 'İncecik hamur, baharatlı zırh kıyması', price: 220, isPopular: false },
        { name: 'Karışık Pide', description: 'Kuşbaşı, kıyma, sucuk ve kaşar peyniri', price: 270, isPopular: true },
        { name: 'Kavurmalı Kaşarlı Pide', description: 'Özel Rize kavurması ve erimiş kaşar', price: 290, isPopular: false },
      ],
    },
    {
      name: 'Tatlılar & İkram Ritüeli',
      sortOrder: 5,
      items: [
        { name: '9 Çeşit Ücretsiz Aspava İkramı', description: 'Masa siparişlerinde ücretsiz: Salata, cacık, patates tava, soslu patlıcan, ezme, çiğ köfte, irmik helvası, semaverde çay', price: 0, isPopular: true },
        { name: 'Hatay Usulü Künefe', description: 'Özel künefe peyniri, bol Antep fıstığı, çıtır kadayıf ve sıcak şerbet', price: 160, isPopular: true },
        { name: 'Fırın Sütlaç', description: 'Geleneksel fırınlanmış kıvamında sütlaç', price: 120, isPopular: false },
      ],
    },
  ];

  for (const cat of categoryData) {
    const createdCat = await prisma.menuCategory.create({
      data: {
        restaurantId: restaurant.id,
        name: cat.name,
        sortOrder: cat.sortOrder,
      },
    });

    for (let i = 0; i < cat.items.length; i++) {
      const item = cat.items[i];
      await prisma.menuItem.create({
        data: {
          categoryId: createdCat.id,
          name: item.name,
          description: item.description,
          price: item.price,
          isPopular: item.isPopular,
          sortOrder: i,
        },
      });
    }
  }

  console.log('Yıldız Aspava Emek Seed basariyla tamamlandi!');
  console.log(`Admin E-posta: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
