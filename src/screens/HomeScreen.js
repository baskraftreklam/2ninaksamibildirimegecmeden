// src/screens/HomeScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getPortfolios } from '../services/firestore';

const { width } = Dimensions.get('window');

// const localLogo = require('../assets/logo.png');
// const HAS_LOCAL_LOGO = true;
const HAS_LOCAL_LOGO = false;
const LOGO_URI = null;

const CATEGORIES = [
  { key: 'all', label: 'Tümü', icon: 'apps-outline' },
  { key: 'satilik', label: 'Satılık', icon: 'pricetag-outline' },
  { key: 'kiralik', label: 'Kiralık', icon: 'business-outline' },
  { key: 'gunluk', label: 'Günlük', icon: 'time-outline' },
];

function normalizeType(item) {
  const raw =
    item?.listingType ||
    item?._raw?.listingType ||
    item?._raw?.kategori ||
    item?._raw?.tur ||
    item?._raw?.type ||
    item?._raw?.adType ||
    '';
  const v = String(raw).toLowerCase();
  if (v.includes('sat')) return 'satilik';
  if (v.includes('kir')) return 'kiralik';
  if (v.includes('gün') || v.includes('gun')) return 'gunluk';
  return 'unknown';
}

function PortfolioCard({ item }) {
  const cover = item?.cover;

  return (
    <View style={styles.card}>
      <View style={styles.cardImageWrap}>
        {cover ? (
          <Image source={{ uri: cover }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
            <Ionicons name="image-outline" size={28} color="#9ab0c0" />
          </View>
        )}
        {typeof item?.price !== 'undefined' && item?.price !== null ? (
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>
              {typeof item.price === 'number'
                ? `${item.price.toLocaleString('tr-TR')} ₺`
                : String(item.price)}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item?.title || 'Portföy'}
        </Text>
        <Text style={styles.cardMeta} numberOfLines={1}>
          {(item?.city || 'Şehir')} • {(item?.district || 'İlçe')}
        </Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [portfolios, setPortfolios] = useState([]);
  const [selected, setSelected] = useState('all');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPortfolios();
        if (mounted) {
          setPortfolios(data);
          console.log('[Home] portfolios count:', data.length);
          if (data.length === 0) {
            console.log('[Home] Uyarı: Hiç portföy gelmedi. Alan adları farklı olabilir.');
          }
        }
      } catch (e) {
        console.log('Firestore fetch error:', e);
        Alert.alert('Hata', 'Veriler alınırken bir sorun oluştu. Konsolu kontrol et.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (selected === 'all') return portfolios;
    return portfolios.filter((p) => normalizeType(p) === selected);
  }, [selected, portfolios]);

  const HeaderBar = (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {HAS_LOCAL_LOGO ? (
          // <Image source={localLogo} style={styles.logo} />
          <Text style={styles.brandText}>talepify</Text>
        ) : LOGO_URI ? (
          <Image source={{ uri: LOGO_URI }} style={styles.logo} />
        ) : (
          <Text style={styles.brandText}>talepify</Text>
        )}
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.menuBtn}
        onPress={() => console.log('Menü butonu')}
      >
        <Ionicons name="menu" size={26} color="#e5eef5" />
      </TouchableOpacity>
    </View>
  );

  const CategoryBar = (
    <View style={styles.catRow}>
      {CATEGORIES.map((c) => {
        const active = selected === c.key;
        return (
          <TouchableOpacity
            key={c.key}
            onPress={() => setSelected(c.key)}
            style={[styles.chip, active && styles.chipActive]}
            activeOpacity={0.8}
          >
            <Ionicons
              name={c.icon}
              size={16}
              color={active ? '#07141e' : '#c7d6e2'}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const content = loading ? (
    <View style={styles.loadingBox}>
      <ActivityIndicator size="small" color="#ff2d2d" />
      <Text style={styles.loadingText}>Yükleniyor…</Text>
    </View>
  ) : filtered.length === 0 ? (
    <View style={styles.emptyBox}>
      <Ionicons name="search-outline" size={22} color="#97aabd" />
      <Text style={styles.emptyText}>
        Uygun portföy bulunamadı. (Konsolda sayım/log var)
      </Text>
    </View>
  ) : (
    <FlatList
      data={filtered}
      keyExtractor={(it) => it.id}
      renderItem={({ item }) => <PortfolioCard item={item} />}
      contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    />
  );

  return (
    <View style={styles.container}>
      {HeaderBar}
      <View style={styles.body}>
        {CategoryBar}
        {content}
      </View>
    </View>
  );
}

const CARD_W = width - 12 * 2;
const CARD_H = 210;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07141e' },
  header: {
    height: 60,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  brandText: {
    color: '#e5eef5',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'lowercase',
  },
  logo: { height: 36, width: 140 },
  menuBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,45,45,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,45,45,0.35)',
  },
  body: { flex: 1, paddingTop: 4 },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#284053',
    backgroundColor: 'rgba(10,22,32,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chipActive: { backgroundColor: '#ff2d2d', borderColor: '#ff2d2d' },
  chipText: { color: '#c7d6e2', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#07141e', fontWeight: '800' },
  loadingBox: { alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 8 },
  loadingText: { color: '#c7d6e2', fontSize: 13 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 8 },
  emptyText: { color: '#a8bdcf', fontSize: 13, textAlign: 'center' },
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 16,
    backgroundColor: 'rgba(12,24,34,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardImageWrap: { width: '100%', height: 130 },
  cardImage: { width: '100%', height: '100%' },
  cardImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18,32,44,0.8)',
  },
  priceBadge: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(255,45,45,0.95)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  priceText: { color: '#07141e', fontWeight: '800', fontSize: 12 },
  cardBody: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, gap: 4 },
  cardTitle: { color: '#e8f1f7', fontWeight: '800', fontSize: 15 },
  cardMeta: { color: '#9bb0bf', fontSize: 12, fontWeight: '600' },
});
