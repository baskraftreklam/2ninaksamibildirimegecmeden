// src/screens/Home.js
// Firestore'dan 'talepifyproje' koleksiyonunu okuyup portföyleri listeler.
// Öncelik: docType === 'portfolio' olan belgeler.
// Eğer yoksa, başlık/şehir/fiyat alanları olanları esnek şekilde toplar.
// Koyu tema (#07141e) + cam efektli kart + kırmızı vurgu ile basit liste.

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

export default function Home() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState('');

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    setErrMsg('');
    try {
      const colRef = collection(db, 'talepifyproje');

      // 1) docType='portfolio' olanları getir
      const q1 = query(colRef, where('docType', '==', 'portfolio'));
      const snap1 = await getDocs(q1);

      let items = [];
      if (!snap1.empty) {
        items = snap1.docs.map(d => ({ id: d.id, ...d.data() }));
        console.log('[Firestore] talepifyproje total (portfolio):', items.length);
      } else {
        // 2) Esnek fallback (geliştirme/test için)
        const snapAll = await getDocs(colRef);
        const all = snapAll.docs.map(d => ({ id: d.id, ...d.data() }));
        items = all.filter(
          it =>
            (it.title || it.baslik) &&
            (it.city || it.sehir) &&
            (it.price || it.fiyat)
        );
        console.log('[Firestore] talepifyproje total (fallback):', items.length);
      }

      console.log('[Home] portfolios count:', items.length);
      setPortfolios(items);
    } catch (err) {
      console.error('Firestore fetch error:', err);
      setErrMsg('Veriler alınırken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.muted}>Portföyler yükleniyor…</Text>
      </View>
    );
  }

  if (errMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{errMsg}</Text>
        <Pressable onPress={fetchPortfolios} style={styles.retryBtn}>
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </Pressable>
      </View>
    );
  }

  if (!portfolios.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Henüz portföy bulunamadı.</Text>
        <Text style={styles.tip}>
          Firestore → talepifyproje koleksiyonuna örnek belgeler ekleyebilirsin.
        </Text>
        <Pressable onPress={fetchPortfolios} style={styles.retryBtn}>
          <Text style={styles.retryText}>Yenile</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={portfolios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <PortfolioCard item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

function PortfolioCard({ item }) {
  const title = item.title || item.baslik || 'Başlık yok';
  const city = item.city || item.sehir || 'Şehir yok';
  const price = item.price || item.fiyat || 'Fiyat yok';
  const status = item.status || item.durum || item.kategori || ''; // 'satılık' | 'kiralık' vs.

  return (
    <View style={styles.card}>
      {!!status && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{String(status).toUpperCase()}</Text>
        </View>
      )}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>
        {city} • {price}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07141e' },
  center: {
    flex: 1,
    backgroundColor: '#07141e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  muted: { color: '#c9d1d9', marginTop: 10, textAlign: 'center' },
  tip: { color: '#9aa7b2', marginTop: 6, textAlign: 'center', fontSize: 12 },
  error: { color: '#ffb4b4', fontWeight: '600' },

  card: {
    backgroundColor: 'rgba(255,255,255,0.06)', // glass efekt
    borderRadius: 18,
    padding: 14,
    borderColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
  },
  title: { color: '#ffffff', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  sub: { color: '#d1d5db', fontSize: 13 },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 0, 0, 0.18)', // kırmızı vurgu (şeffaf)
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,0,0,0.35)',
  },
  badgeText: { color: '#ff4d4f', fontWeight: '700', fontSize: 11, letterSpacing: 0.5 },

  retryBtn: {
    marginTop: 14,
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryText: { color: '#fff', fontWeight: '700' },
});
