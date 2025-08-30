// src/screens/Home.js
// Firestore'dan 'talepifyproje' koleksiyonunu okuyup portföyleri listeler.
// Öncelik: docType === 'portfolio' olan belgeler.
// Eğer yoksa, başlık/şehir/fiyat alanları olanları esnek şekilde toplar.
// Koyu tema (#07141e) + cam efektli kart + kırmızı vurgu ile basit liste.
// Filtre butonu ile FilterSheet açılır ve client-side filtreleme yapılır.

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import FiltersModal from './FiltersModal';
import SuccessModal from '../components/SuccessModal';
import ListingCard from '../components/ListingCard';
import { fetchPortfolios } from '../services/firestore';
import { showSuccess } from '../services/index';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadPortfolios();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, loadPortfolios]);

  const loadPortfolios = useCallback(async () => {
    try {
      const data = await fetchPortfolios();
      setPortfolios(data);
    } catch (error) {
      console.error('Portföyler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchPortfolios]);

  const fetchPortfolios = useCallback(async () => {
    // Mock data - gerçek uygulamada Firebase'den gelecek
    return [
      {
        id: '1',
        title: 'Atakum Denizevleri Satılık Daire',
        city: 'Samsun',
        district: 'Atakum',
        neighborhood: 'Denizevleri',
        price: 2500000,
        listingStatus: 'Satılık',
        propertyType: 'Daire',
        squareMeters: 120,
        roomCount: '3+1',
        buildingAge: 5,
        floor: 3,
        parking: true,
        images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop']
      },
      {
        id: '2',
        title: 'İlkadım Merkez Kiralık Daire',
        city: 'Samsun',
        district: 'İlkadım',
        neighborhood: 'Merkez',
        price: 8500,
        listingStatus: 'Kiralık',
        propertyType: 'Daire',
        squareMeters: 85,
        roomCount: '2+1',
        buildingAge: 8,
        floor: 2,
        parking: false,
        images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop']
      },
      {
        id: '3',
        title: 'Canik Villa Satılık',
        city: 'Samsun',
        district: 'Canik',
        neighborhood: 'Villa Mahallesi',
        price: 4500000,
        listingStatus: 'Satılık',
        propertyType: 'Villa',
        squareMeters: 200,
        roomCount: '4+2',
        buildingAge: 3,
        floor: 2,
        parking: true,
        images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop']
      },
      {
        id: '4',
        title: 'Tekkeköy İş Yeri Kiralık',
        city: 'Samsun',
        district: 'Tekkeköy',
        neighborhood: 'Ticaret Merkezi',
        price: 12000,
        listingStatus: 'Kiralık',
        propertyType: 'İş Yeri',
        squareMeters: 150,
        roomCount: null,
        buildingAge: 10,
        floor: 1,
        parking: true,
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop']
      },
      {
        id: '5',
        title: 'Bafra Sahil Daire Satılık',
        city: 'Samsun',
        district: 'Bafra',
        neighborhood: 'Sahil Mahallesi',
        price: 1800000,
        listingStatus: 'Satılık',
        propertyType: 'Daire',
        squareMeters: 95,
        roomCount: '2+1',
        buildingAge: 2,
        floor: 5,
        parking: true,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop']
      }
    ];
  }, []);

  const toggleFavorite = (itemId) => {
    setFavorites(prev => {
      if (prev.includes(itemId)) {
        showSuccess('Favorilerden çıkarıldı');
        return prev.filter(id => id !== itemId);
      } else {
        showSuccess('Favorilere eklendi');
        return [...prev, itemId];
      }
    });
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    showSuccess(isDarkMode ? 'Açık tema aktif' : 'Koyu tema aktif');
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadPortfolios().finally(() => setRefreshing(false));
  }, [loadPortfolios]);

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + 'M TL';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(0) + 'K TL';
    }
    return price.toLocaleString() + ' TL';
  };

  const applyFilters = useCallback((newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
    setShowOnlyFavorites(false);
  }, []);

  const filteredPortfolios = useMemo(() => {
    let filtered = portfolios;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.city.toLowerCase().includes(query) ||
        item.district.toLowerCase().includes(query) ||
        item.neighborhood.toLowerCase().includes(query)
      );
    }

    // Favorites filter
    if (showOnlyFavorites) {
      filtered = filtered.filter(item => favorites.includes(item.id));
    }

    // Other filters
    if (filters.city) {
      filtered = filtered.filter(item => item.city === filters.city);
    }
    if (filters.district) {
      filtered = filtered.filter(item => item.district === filters.district);
    }
    if (filters.propertyType) {
      filtered = filtered.filter(item => item.propertyType === filters.propertyType);
    }
    if (filters.listingStatus) {
      filtered = filtered.filter(item => item.listingStatus === filters.listingStatus);
    }
    if (filters.minPrice) {
      filtered = filtered.filter(item => item.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(item => item.price <= filters.maxPrice);
    }

    return filtered;
  }, [portfolios, searchQuery, showOnlyFavorites, favorites, filters]);

  const activeFilters = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (showOnlyFavorites) count++;
    if (filters.city) count++;
    if (filters.district) count++;
    if (filters.propertyType) count++;
    if (filters.listingStatus) count++;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    return count;
  }, [searchQuery, showOnlyFavorites, filters]);

  const renderPortfolioCard = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <ListingCard
        item={item}
        onPress={() => navigation.navigate('PropertyDetail', { portfolio: item })}
        onFavorite={toggleFavorite}
        isFavorite={favorites.includes(item.id)}
      />
    </Animated.View>
  );

  const renderHeader = () => {
    const totalPortfolios = portfolios.length;
    const avgPrice = portfolios.length > 0 
      ? portfolios.reduce((sum, item) => sum + item.price, 0) / portfolios.length 
      : 0;
    
    return (
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.mainTitle}>Portföyler</Text>
          <Text style={styles.mainSubtitle}>
            {favorites.length > 0 ? `${favorites.length} favori portföy` : 'En iyi fırsatları keşfedin'}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalPortfolios}</Text>
            <Text style={styles.statLabel}>Toplam</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{formatPrice(avgPrice)}</Text>
            <Text style={styles.statLabel}>Ortalama</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredPortfolios.length}</Text>
            <Text style={styles.statLabel}>Gösterilen</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.favoriteFilterButton, showOnlyFavorites && styles.favoriteFilterButtonActive]}
            onPress={() => setShowOnlyFavorites(!showOnlyFavorites)}
          >
            <Text style={[styles.favoriteFilterIcon, showOnlyFavorites && styles.favoriteFilterIconActive]}>
              ❤️
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, activeFilters > 0 && styles.filterButtonActive]}
            onPress={() => setShowFilters(true)}
          >
            <Text style={styles.filterIcon}>F</Text>
            <Text style={[styles.filterButtonText, activeFilters > 0 && styles.filterButtonTextActive]}>
              {activeFilters > 0 ? 'Filtre (' + activeFilters + ')' : 'Filtre'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.themeButton}
            onPress={toggleTheme}
          >
            <Text style={styles.themeIcon}>
              {isDarkMode ? '☀️' : '🌙'}
            </Text>
          </TouchableOpacity>

          {activeFilters > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Temizle</Text>
            </TouchableOpacity>
          )}
        </View>

        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Portföy ara..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        )}
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>?</Text>
      <Text style={styles.emptyText}>Uygun portföy bulunamadı</Text>
      <Text style={styles.emptySubtext}>Filtrelerinizi değiştirmeyi deneyin</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Header title="Talepify" />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#ff4d4f" />
          <Text style={styles.loadingText}>Portföyler yükleniyor...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Talepify" />

      <FlatList
        data={filteredPortfolios}
        renderItem={renderPortfolioCard}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.cardRow}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />

      <FiltersModal visible={showFilters} onClose={() => setShowFilters(false)} onApply={applyFilters} />
      <SuccessModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  loadingContainer: { flex: 1, backgroundColor: theme.colors.background },
  loadingContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: theme.colors.text, fontSize: 16, marginTop: 16 },

  listContainer: { padding: 16, paddingTop: 8 },
  header: { marginBottom: 24 },
  headerContent: { alignItems: 'center', marginBottom: 24 },
  mainTitle: { fontSize: 32, fontWeight: '700', color: theme.colors.text, marginBottom: 8, letterSpacing: 1 },
  mainSubtitle: { fontSize: 16, color: '#ff0000', opacity: 0.8 },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 12,
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: '700', color: '#ff0000' },
  statLabel: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },

  headerActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  favoriteFilterButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  favoriteFilterButtonActive: {
    backgroundColor: '#ff4d4f',
  },
  favoriteFilterIcon: { fontSize: 16 },
  favoriteFilterIconActive: { fontSize: 18 },
  themeButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 8,
  },
  themeIcon: { fontSize: 16 },
  filterButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderWidth: 1, borderColor: '#ff0000',
    borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12,
    flex: 1, marginRight: 12,
  },
  filterButtonActive: { backgroundColor: '#ff0000' },
  filterIcon: { fontSize: 20, marginRight: 8, color: theme.colors.white },
  filterButtonText: { color: '#ff0000', fontSize: 14, fontWeight: '600' },
  filterButtonTextActive: { color: theme.colors.white },

  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12,
  },
  clearButtonText: { color: theme.colors.text, fontSize: 14, fontWeight: '600' },

  searchContainer: { marginTop: 16 },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: theme.colors.text,
    fontSize: 16,
  },

  cardRow: { justifyContent: 'space-between', marginBottom: 16 },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: { 
    fontSize: 48, 
    color: theme.colors.gray, 
    marginBottom: 16 
  },
  emptyText: { 
    fontSize: 18, 
    color: theme.colors.text, 
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubtext: { 
    fontSize: 14, 
    color: theme.colors.lightGray 
  },
});

export default Home;
