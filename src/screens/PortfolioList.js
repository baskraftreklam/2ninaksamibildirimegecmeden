import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Animated,
  Image
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';
import { fetchPortfolios } from '../services/firestore';
import FiltersModal from './FiltersModal';

const { width } = Dimensions.get('window');

const PortfolioList = ({ navigation }) => {
  const { user, userProfile } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    if (user) {
      loadPortfolios();
    }
  }, [user]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      const data = await fetchPortfolios();
      setPortfolios(data);
      console.log('[PortfolioList] portfolios count:', data.length);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      Alert.alert('Hata', 'Portföyler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPortfolios();
    setRefreshing(false);
  };

  const handlePortfolioPress = (portfolio) => {
    navigation.navigate('PropertyDetail', { portfolio });
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => filters[key] !== '' && filters[key] !== null && filters[key] !== undefined).length;
  };

  const toggleFavorite = (portfolioId) => {
    setFavorites(prev => {
      if (prev.includes(portfolioId)) {
        return prev.filter(id => id !== portfolioId);
      } else {
        return [...prev, portfolioId];
      }
    });
  };

  const isFavorite = (portfolioId) => {
    return favorites.includes(portfolioId);
  };

  // Kullanıcının şehir bilgisine ve filtrelerine göre portföyleri filtrele
  const filteredPortfolios = useMemo(() => {
    let filtered = portfolios;

    // Favori portföyleri göster
    if (showFavorites) {
      filtered = filtered.filter(portfolio => favorites.includes(portfolio.id));
      return filtered;
    }

    // Önce kullanıcının şehir bilgisine göre filtrele
    if (userProfile?.city && !filters.city) {
      filtered = filtered.filter(portfolio => 
        portfolio.city === userProfile.city
      );
    }

    // Şehir filtresi
    if (filters.city) {
      filtered = filtered.filter(portfolio => portfolio.city === filters.city);
    }

    // İlçe filtresi
    if (filters.district) {
      filtered = filtered.filter(portfolio => portfolio.district === filters.district);
    }

    // Portföy tipi filtresi
    if (filters.propertyType) {
      filtered = filtered.filter(portfolio => portfolio.propertyType === filters.propertyType);
    }

    // İşlem türü filtresi
    if (filters.listingStatus) {
      filtered = filtered.filter(portfolio => portfolio.listingStatus === filters.listingStatus);
    }

    // Minimum fiyat filtresi
    if (filters.minPrice) {
      const minPrice = parseInt(filters.minPrice);
      filtered = filtered.filter(portfolio => portfolio.price >= minPrice);
    }

    // Maksimum fiyat filtresi
    if (filters.maxPrice) {
      const maxPrice = parseInt(filters.maxPrice);
      filtered = filtered.filter(portfolio => portfolio.price <= maxPrice);
    }

    return filtered;
  }, [portfolios, userProfile?.city, filters, showFavorites, favorites]);

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(1) + 'M TL';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(0) + 'K TL';
    }
    return price.toLocaleString() + ' TL';
  };

  const renderPortfolioCard = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim, flex: 1, marginHorizontal: 4 }}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => handlePortfolioPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.cardImageContainer}>
          {item.cover ? (
            <Image source={{ uri: item.cover }} style={styles.cardImage} />
          ) : (
            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
              <Text style={styles.imageIcon}>🖼️</Text>
            </View>
          )}
          
          {item.roomCount && (
            <View style={styles.roomBadge}>
              <Text style={styles.roomBadgeText}>{item.roomCount}</Text>
            </View>
          )}
          
                     <TouchableOpacity 
             style={styles.favoriteButton}
             onPress={() => toggleFavorite(item.id)}
           >
             <Text style={styles.favoriteIcon}>
               {isFavorite(item.id) ? '❤️' : '🤍'}
             </Text>
           </TouchableOpacity>
        </View>
        
                 <View style={styles.cardContent}>
           <Text style={styles.cardTitle} numberOfLines={1}>
             {item.title || 'Portföy'}
           </Text>
           
           <Text style={styles.cardLocation} numberOfLines={1}>
             {item.city || 'Şehir'} • {item.district || 'İlçe'}
           </Text>
           
           <View style={styles.cardFooter}>
             <View style={styles.cardInfo}>
               {item.roomCount && (
                 <Text style={styles.cardRoomCount}>{item.roomCount}</Text>
               )}
             </View>
             
             {typeof item.price !== 'undefined' && item.price !== null && (
               <Text style={styles.cardPrice}>
                 {formatPrice(item.price)}
               </Text>
             )}
           </View>
         </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerTop}>
          <Text style={styles.mainTitle}>
            {showFavorites ? 'Favori Portföyler' : 'Portföy Havuzu'}
          </Text>
          
          <TouchableOpacity
            style={[styles.favoriteToggleButton, showFavorites && styles.favoriteToggleButtonActive]}
            onPress={() => setShowFavorites(!showFavorites)}
          >
            <Text style={styles.favoriteToggleIcon}>
              {showFavorites ? '🏠' : '❤️'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.mainSubtitle}>
          {showFavorites 
            ? `${favorites.length} favori portföy` 
            : (userProfile?.city && !filters.city ? `${userProfile.city} şehrindeki portföyler` : 'Tüm portföyler')
          }
        </Text>
        
        {!showFavorites && (
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, getActiveFiltersCount() > 0 && styles.filterButtonActive]}
              onPress={() => setShowFilters(true)}
            >
              <Text style={styles.filterIcon}>🔍</Text>
              <Text style={[styles.filterButtonText, getActiveFiltersCount() > 0 && styles.filterButtonTextActive]}>
                {getActiveFiltersCount() > 0 ? `Filtre (${getActiveFiltersCount()})` : 'Filtre'}
              </Text>
            </TouchableOpacity>

            {getActiveFiltersCount() > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                <Text style={styles.clearButtonText}>Temizle</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>
        {showFavorites ? '❤️' : '🏠'}
      </Text>
      <Text style={styles.emptyText}>
        {showFavorites 
          ? 'Henüz favori portföyünüz yok' 
          : (userProfile?.city ? `${userProfile.city} şehrinde portföy bulunamadı` : 'Henüz portföy bulunamadı')
        }
      </Text>
      <Text style={styles.emptySubtext}>
        {showFavorites 
          ? 'Beğendiğiniz portföyleri favorilere ekleyin' 
          : (userProfile?.city ? 'Diğer şehirlerdeki portföyleri görmek için profil bilgilerinizi güncelleyin' : 'Filtrelerinizi değiştirmeyi deneyin')
        }
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4d4f" />
        <Text style={styles.loadingText}>Portföyler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

      <FiltersModal 
        visible={showFilters} 
        onClose={() => setShowFilters(false)} 
        onApply={applyFilters}
        initialFilters={filters}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loadingText: { 
    color: theme.colors.text, 
    fontSize: 16, 
    marginTop: 16 
  },
  listContainer: { 
    padding: 16, 
    paddingTop: 8 
  },
  header: { 
    marginBottom: 24 
  },
  headerContent: { 
    alignItems: 'center', 
    marginBottom: 24 
  },
  mainTitle: { 
    fontSize: 32, 
    fontWeight: '700', 
    color: theme.colors.text, 
    marginBottom: 8, 
    letterSpacing: 1 
  },
  mainSubtitle: { 
    fontSize: 16, 
    color: '#ff0000', 
    opacity: 0.8 
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  favoriteToggleButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#ff0000',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteToggleButtonActive: {
    backgroundColor: '#ff0000',
  },
  favoriteToggleIcon: {
    fontSize: 18,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#ff0000',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
  },
  filterButtonActive: {
    backgroundColor: '#ff0000',
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  filterButtonText: {
    color: '#ff0000',
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  clearButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  cardRow: { 
    justifyContent: 'space-between', 
    marginBottom: 16 
  },
  card: {
    backgroundColor: theme.colors.cardBg,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    width: (width - 48) / 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: theme.spacing.md,
  },
  cardImageContainer: {
    position: 'relative',
    height: 120,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImagePlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: { 
    fontSize: 32, 
    color: '#666' 
  },
  roomBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#ff0000',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  roomBadgeText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 6,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  cardContent: {
    padding: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRoomCount: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    color: '#ff0000',
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardTitle: { 
    color: theme.colors.text, 
    fontWeight: '800', 
    fontSize: 15,
    marginBottom: 4
  },
  cardLocation: { 
    color: theme.colors.textSecondary, 
    fontSize: 12, 
    fontWeight: '600',
    marginBottom: 4
  },
  cardPrice: { 
    color: theme.colors.primary, 
    fontSize: 14, 
    fontWeight: '700' 
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    gap: 8,
  },
  emptyIcon: { 
    fontSize: 64, 
    marginBottom: 16 
  },
  emptyText: { 
    color: theme.colors.text, 
    fontSize: 18, 
    fontWeight: '600',
    textAlign: 'center'
  },
  emptySubtext: { 
    color: theme.colors.textSecondary, 
    fontSize: 14, 
    textAlign: 'center',
    paddingHorizontal: 32
  },
});

export default PortfolioList;
