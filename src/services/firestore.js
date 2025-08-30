// src/services/firestore.js
import {
  collection,
  getDocs,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Esnek portföy çekimi:
 * - Koleksiyon: talepifyproje
 * - docType 'portfolio' OLANLARI tercih eder.
 * - Ama docType YOKSA da portföy benzeri kayıtları (title/price/city alanları olan) "olasılık" olarak kabul eder.
 * - isPublished === false olanları eler.
 * - createdAt varsa tarihe göre sıralar; yoksa gelen sıra.
 */
export async function getPortfolios() {
  const colRef = collection(db, 'talepifyproje');

  // orderBy createdAt varsa çalışır, yoksa Firestore hata vermez (field yok diye); getDocs ile basic query alıyoruz
  let q = colRef;
  try {
    q = query(colRef, orderBy('createdAt', 'desc'));
  } catch (_e) {
    // field yoksa basic query ile devam
    q = colRef;
  }

  const snap = await getDocs(q);

  const all = snap.docs.map((d) => {
    const data = d.data() || {};
    return { id: d.id, ...data };
  });

  // 1) docType 'portfolio' olanlar
  let portfolios = all.filter((x) => {
    const dt = String(x?.docType ?? '').toLowerCase();
    return dt === 'portfolio';
  });

  // 2) Eğer hiç yoksa, portföy benzeri kayıtları yakala (title/baslik + city/sehir + price vb.)
  if (portfolios.length === 0) {
    portfolios = all.filter((x) => {
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
      listingType: p.listingType || p.kategori || p.tur || p.type || p.adType,
      isPublished: p.isPublished,
      cover,
      createdAt: p.createdAt || null,
      _raw: p,
    };
  });

  // Debug log: konsolda kaç kayıt geldi görelim
  console.log('[Firestore] talepifyproje total:', all.length, '→ portfolios:', portfolios.length);

  return portfolios;
}
