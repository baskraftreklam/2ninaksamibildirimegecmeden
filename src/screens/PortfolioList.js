import React, { useState, useEffect, useMemo, useCallback } from 'react';
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

const { width, height } = Dimensions.get('window');

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
  }, [user, filters, loadPortfolios]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const loadPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      // Sadece yayınlanmış portföyleri getir (public view)
      const data = await fetchPortfolios(filters, true);
      setPortfolios(data);
      console.log('[PortfolioList] published portfolios count:', data.length);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      Alert.alert('Hata', 'Portföyler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

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
      <View style={styles.container}>
        {/* Arka Plan */}
        <View style={styles.backgroundContainer}>
          <Image source={require('../assets/images/dark-bg.jpg')} style={styles.backgroundImage} />
        </View>
        
        {renderHeader()}

        <View style={styles.listContainer}>
          {/* Skeleton Loading Cards */}
          {[1, 2, 3].map((index) => (
            <View key={index} style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />
              <View style={styles.skeletonContent}>
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonLocation} />
                <View style={styles.skeletonDetails}>
                  <View style={styles.skeletonDetail} />
                  <View style={styles.skeletonDetail} />
                </View>
                <View style={styles.skeletonFooter}>
                  <View style={styles.skeletonRoom} />
                  <View style={styles.skeletonPrice} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Arka Plan */}
      <View style={styles.backgroundContainer}>
        <Image source={require('../assets/images/dark-bg.jpg')} style={styles.backgroundImage} />
      </View>
      
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
  },
  
  // Arka Plan - Anasayfadaki gibi
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loadingText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    marginTop: 16,
    fontWeight: '500',
  },
  listContainer: { 
    padding: 20, 
    paddingTop: 50,
  },
  header: { 
    marginBottom: 24,
  },
  headerContent: { 
    alignItems: 'center', 
    marginBottom: 24,
  },
  mainTitle: { 
    fontSize: 32, 
    fontWeight: '700', 
    color: theme.colors.text, 
    marginBottom: 8, 
    letterSpacing: 1,
  },
  mainSubtitle: { 
    fontSize: 16, 
    color: '#ff0000', 
    opacity: 0.8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  favoriteToggleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteToggleButtonActive: {
    backgroundColor: '#ffffff',
  },
  favoriteToggleIcon: {
    fontSize: 18,
    color: '#ffffff',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
  },
  filterButtonActive: {
    backgroundColor: '#ffffff',
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#130139',
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
    backgroundColor: '#FFFFFF', // Anasayfadaki beyaz kart rengi
    borderRadius: Math.min(width * 0.05, 15), // Anasayfadaki border radius
    overflow: 'hidden',
    width: (width - 48) / 2,
    borderWidth: 1,
    borderColor: 'rgba(19, 1, 57, 0.1)', // Koyu mor şeffaf border
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    marginBottom: 16,
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
    backgroundColor: 'rgba(19, 1, 57, 0.1)', // Koyu mor şeffaf
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: { 
    fontSize: 32, 
    color: '#130139' // Koyu mor
  },
  roomBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#130139', // Anasayfadaki koyu mor
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  roomBadgeText: {
    color: '#FFFFFF',
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
    backgroundColor: 'rgba(19, 1, 57, 0.1)', // Koyu mor şeffaf
    color: '#130139', // Koyu mor
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardTitle: { 
    color: '#130139', // Anasayfadaki koyu mor metin rengi
    fontWeight: '800', 
    fontSize: 15,
    marginBottom: 4
  },
  cardLocation: { 
    color: '#374151', // Anasayfadaki gri metin rengi
    fontSize: 12, 
    fontWeight: '600',
    marginBottom: 4
  },
  cardPrice: { 
    color: '#130139', // Anasayfadaki koyu mor
    fontSize: 14, 
    fontWeight: '700' 
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    gap: 8,
    backgroundColor: 'rgba(19, 1, 57, 0.85)', // Anasayfadaki koyu mor container
    borderRadius: 15,
    padding: 30,
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  emptyIcon: { 
    fontSize: 64, 
    marginBottom: 16 
  },
  emptyText: { 
    color: '#FFFFFF', // Beyaz metin
    fontSize: 18, 
    fontWeight: '600',
    textAlign: 'center'
  },
  emptySubtext: { 
    color: 'rgba(255, 255, 255, 0.8)', // Şeffaf beyaz
    fontSize: 14, 
    textAlign: 'center',
    paddingHorizontal: 32
  },

  // Skeleton Loading Styles
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Math.min(width * 0.05, 15),
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(19, 1, 57, 0.3)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },

  skeletonImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E7EB',
  },

  skeletonContent: {
    padding: 12,
  },

  skeletonTitle: {
    height: 18,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
  },

  skeletonLocation: {
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 8,
    width: '60%',
  },

  skeletonDetails: {
    marginBottom: 8,
  },

  skeletonDetail: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
    width: '40%',
  },

  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  skeletonRoom: {
    width: 50,
    height: 20,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },

  skeletonPrice: {
    width: 80,
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
  },
});

export default PortfolioList;
