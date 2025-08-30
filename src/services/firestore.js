// src/services/firestore.js
// Mock data kullanıyoruz - Hermes uyumluluk sorunu nedeniyle

/**
 * Esnek portföy çekimi:
 * - Koleksiyon: talepifyproje
 * - docType 'portfolio' OLANLARI tercih eder.
 * - Ama docType YOKSA da portföy benzeri kayıtları (title/price/city alanları olan) "olasılık" olarak kabul eder.
 * - isPublished === false olanları eler.
 * - createdAt varsa tarihe göre sıralar; yoksa gelen sıra.
 */
export async function getPortfolios() {
  // Mock data
  const mockData = [
    {
      id: '1',
      title: 'Lüks Villa - Beşiktaş',
      city: 'İstanbul',
      price: '2.500.000 ₺',
      status: 'satılık',
      ptype: 'villa',
      docType: 'portfolio',
      isPublished: true,
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Modern Daire - Kadıköy',
      city: 'İstanbul',
      price: '850.000 ₺',
      status: 'satılık',
      ptype: 'daire',
      docType: 'portfolio',
      isPublished: true,
      createdAt: new Date('2024-01-14')
    },
    {
      id: '3',
      title: 'Günlük Kiralık - Sultanahmet',
      city: 'İstanbul',
      price: '500 ₺/gün',
      status: 'günlük',
      ptype: 'daire',
      docType: 'portfolio',
      isPublished: true,
      createdAt: new Date('2024-01-13')
    },
    {
      id: '4',
      title: 'İşyeri - Şişli',
      city: 'İstanbul',
      price: '15.000 ₺/ay',
      status: 'kiralık',
      ptype: 'işyeri',
      docType: 'portfolio',
      isPublished: true,
      createdAt: new Date('2024-01-12')
    },
    {
      id: '5',
      title: 'Arsa - Çeşme',
      city: 'İzmir',
      price: '1.200.000 ₺',
      status: 'satılık',
      ptype: 'arsa',
      docType: 'portfolio',
      isPublished: true,
      createdAt: new Date('2024-01-11')
    }
  ];

  // 1) docType 'portfolio' olanlar
  let portfolios = mockData.filter((x) => {
    const dt = String(x?.docType ?? '').toLowerCase();
    return dt === 'portfolio';
  });

  // 2) Eğer hiç yoksa, portföy benzeri kayıtları yakala (title/baslik + city/sehir + price vb.)
  if (portfolios.length === 0) {
    portfolios = mockData.filter((x) => {
      const hasTitle = x?.title || x?.baslik;
      const hasLoc = x?.city || x?.sehir || x?.il;
      const maybePrice = x?.price || x?.fiyat;
      return hasTitle && (hasLoc || typeof maybePrice !== 'undefined');
    });
  }

  // 3) Yayınlama filtresi (isPublished === false olanları çıkar)
  portfolios = portfolios.filter((x) => x?.isPublished !== false);

  // 4) Görsel/başlık alanlarını normalize et (HomeScreen kartları için)
  portfolios = portfolios.map((p) => {
    const cover =
      p?.cover ||
      p?.image ||
      (Array.isArray(p?.images) && p.images.length ? p.images[0] : undefined);

    return {
      id: p.id,
      title: p.title || p.baslik || 'Portföy',
      price: typeof p.fiyat !== 'undefined' ? p.fiyat : p.price,
      city: p.city || p.sehir || p.il,
      district: p.district || p.ilce,
      listingType: p.listingType || p.kategori || p.tur || p.type || p.adType || p.status,
      isPublished: p.isPublished,
      cover,
      createdAt: p.createdAt || null,
      _raw: p,
    };
  });

  // Debug log: konsolda kaç kayıt geldi görelim
  console.log('[Mock Firestore] talepifyproje total:', mockData.length, '→ portfolios:', portfolios.length);

  return portfolios;
}
