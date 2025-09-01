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
            <Text style={styles.imageIcon}>
              <Text>🖼️</Text>
            </Text>
          </View>
        )}
        {typeof item?.price !== 'undefined' && item?.price !== null ? (
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>
              {typeof item.price === 'number' ? (
                <>
                  <Text>{item.price.toLocaleString('tr-TR')}</Text>
                  <Text> ₺</Text>
                </>
              ) : (
                <Text>{String(item.price)}</Text>
              )}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          <Text>{item?.title || 'Portföy'}</Text>
        </Text>
        <Text style={styles.cardMeta} numberOfLines={1}>
          <Text>{item?.city || 'Şehir'}</Text>
          <Text> • </Text>
          <Text>{item?.district || 'İlçe'}</Text>
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
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredPortfolios = useMemo(() => {
    if (selected === 'all') return portfolios;
    return portfolios.filter((item) => normalizeType(item) === selected);
  }, [portfolios, selected]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => console.log('Menü butonu')}
        >
          <Text style={styles.menuIcon}>
            <Text>☰</Text>
          </Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            <Text>Portföyler</Text>
          </Text>
          <Text style={styles.subtitle}>
            <Text>{filteredPortfolios.length}</Text>
            <Text> portföy bulundu</Text>
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCategoryChip = ({ item }) => {
    const active = selected === item.key;
    return (
      <TouchableOpacity
        style={[styles.chip, active && styles.chipActive]}
        onPress={() => setSelected(item.key)}
      >
        <Text style={[styles.chipIcon, { color: active ? '#07141e' : '#c7d6e2' }]}>
          {item.icon === 'apps-outline' ? (
            <Text>📱</Text>
          ) : item.icon === 'pricetag-outline' ? (
            <Text>🏷️</Text>
          ) : item.icon === 'business-outline' ? (
            <Text>🏢</Text>
          ) : item.icon === 'time-outline' ? (
            <Text>⏰</Text>
          ) : (
            <Text>📱</Text>
          )}
        </Text>
        <Text style={[styles.chipText, active && styles.chipTextActive]}>
          <Text>{item.label}</Text>
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#ff2d2d" />
          <Text style={styles.loadingText}>
            <Text>Portföyler yükleniyor...</Text>
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={CATEGORIES}
        renderItem={renderCategoryChip}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      />

      {filteredPortfolios.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            <Text>Bu kategoride portföy bulunamadı</Text>
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPortfolios}
          renderItem={({ item }) => <PortfolioCard item={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#07141e' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: 'rgba(7, 20, 30, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIcon: { fontSize: 20, color: '#fff' },
  titleContainer: { flex: 1 },
  title: { fontSize: 24, fontWeight: '700', color: '#fff' },
  subtitle: { fontSize: 14, color: '#ccc', marginTop: 2 },
  categoriesContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  chipActive: { backgroundColor: '#ff2d2d', borderColor: '#ff2d2d' },
  chipText: { color: '#c7d6e2', fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: '#07141e', fontWeight: '800' },
  chipIcon: { fontSize: 16, marginRight: 6 },
  listContainer: { padding: 16 },
  loadingBox: { alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 8 },
  loadingText: { color: '#c7d6e2', fontSize: 13 },
  emptyBox: { alignItems: 'center', justifyContent: 'center', paddingTop: 40, gap: 8 },
  emptyText: { color: '#a8bdcf', fontSize: 13, textAlign: 'center' },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardImageWrap: { width: '100%', height: 130 },
  cardImage: { width: '100%', height: '100%' },
  cardImagePlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: { fontSize: 32, color: '#666' },
  priceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 45, 45, 0.9)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  priceText: { color: '#07141e', fontWeight: '800', fontSize: 12 },
  cardBody: { padding: 12 },
  cardTitle: { color: '#e8f1f7', fontWeight: '800', fontSize: 15 },
  cardMeta: { color: '#9bb0bf', fontSize: 12, fontWeight: '600' },
});