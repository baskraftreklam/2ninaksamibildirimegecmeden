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
  Animated,
  Image
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';
import { fetchPortfolios } from '../services/firestore';
import FiltersModal from './FiltersModal';

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
    navigation.navigate('Ana Sayfa', { screen: 'PropertyDetail', params: { portfolio } });
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
    color: theme.colors.white, 
    fontSize: theme.fontSizes.xl, 
    marginTop: theme.spacing.md,
    fontWeight: theme.fontWeights.medium,
  },
  listContainer: { 
    padding: theme.spacing.lg, 
    paddingTop: 50,
  },
  header: { 
    marginBottom: theme.spacing.xxl,
  },
  headerContent: { 
    alignItems: 'center', 
    marginBottom: theme.spacing.xxl,
  },
  mainTitle: { 
    fontSize: theme.fontSizes.xxxl, 
    fontWeight: theme.fontWeights.bold, 
    color: theme.colors.text, 
    marginBottom: theme.spacing.sm, 
    letterSpacing: 1,
  },
  mainSubtitle: { 
    fontSize: theme.fontSizes.xl, 
    color: theme.colors.primary, 
    opacity: 0.8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  favoriteToggleButton: {
    backgroundColor: theme.colors.borderLight,
    borderWidth: 1,
    borderColor: theme.colors.white,
    borderRadius: theme.borderRadius.sm,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteToggleButtonActive: {
    backgroundColor: theme.colors.white,
  },
  favoriteToggleIcon: {
    fontSize: theme.fontSizes.xxl,
    color: theme.colors.white,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.borderLight,
    borderWidth: 1,
    borderColor: theme.colors.white,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.white,
  },
  filterIcon: {
    fontSize: theme.fontSizes.xl,
    marginRight: theme.spacing.sm,
  },
  filterButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },
  filterButtonTextActive: {
    color: theme.colors.primary,
  },
  clearButton: {
    backgroundColor: theme.colors.borderLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  clearButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSizes.md,
    fontWeight: theme.fontWeights.semibold,
  },

  cardRow: { 
    justifyContent: 'space-between', 
    marginBottom: theme.spacing.md 
  },
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    width: '48%',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.medium,
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
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIcon: { 
    fontSize: theme.fontSizes.xxxl, 
    color: theme.colors.primary
  },
  roomBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xs,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  roomBadgeText: {
    color: theme.colors.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.white + 'E6',
    borderRadius: theme.borderRadius.sm,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  favoriteIcon: {
    fontSize: theme.fontSizes.xl,
  },
  cardContent: {
    padding: theme.spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRoomCount: {
    backgroundColor: theme.colors.primaryLight,
    color: theme.colors.primary,
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.xs,
  },
  cardTitle: { 
    color: theme.colors.primary, 
    fontWeight: theme.fontWeights.bold, 
    fontSize: theme.fontSizes.md,
    marginBottom: theme.spacing.xs
  },
  cardLocation: { 
    color: theme.colors.textSecondary, 
    fontSize: theme.fontSizes.sm, 
    fontWeight: theme.fontWeights.semibold,
    marginBottom: theme.spacing.xs
  },
  cardPrice: { 
    color: theme.colors.primary, 
    fontSize: theme.fontSizes.md, 
    fontWeight: theme.fontWeights.bold 
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xxl,
    backgroundColor: theme.colors.primary + 'D9',
    borderRadius: theme.borderRadius.lg,
    padding: 30,
    marginTop: theme.spacing.lg,
    ...theme.shadows.large,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  emptyIcon: { 
    fontSize: 64, 
    marginBottom: theme.spacing.md 
  },
  emptyText: { 
    color: theme.colors.white,
    fontSize: theme.fontSizes.xxl, 
    fontWeight: theme.fontWeights.semibold,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: { 
    color: theme.colors.textWhite + 'CC',
    fontSize: theme.fontSizes.md, 
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xxl
  },

  // Skeleton Loading Styles
  skeletonCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    ...theme.shadows.large,
    overflow: 'hidden',
  },

  skeletonImage: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.progressBg,
  },

  skeletonContent: {
    padding: theme.spacing.md,
  },

  skeletonTitle: {
    height: 18,
    backgroundColor: theme.colors.progressBg,
    borderRadius: theme.borderRadius.xs,
    marginBottom: theme.spacing.xs,
  },

  skeletonLocation: {
    height: 14,
    backgroundColor: theme.colors.progressBg,
    borderRadius: theme.borderRadius.xs,
    marginBottom: theme.spacing.sm,
    width: '60%',
  },

  skeletonDetails: {
    marginBottom: theme.spacing.sm,
  },

  skeletonDetail: {
    height: 12,
    backgroundColor: theme.colors.progressBg,
    borderRadius: theme.borderRadius.xs,
    marginBottom: theme.spacing.xs,
    width: '40%',
  },

  skeletonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },

  skeletonRoom: {
    width: 50,
    height: 20,
    backgroundColor: theme.colors.progressBg,
    borderRadius: theme.borderRadius.xs,
  },

  skeletonPrice: {
    width: 80,
    height: 16,
    backgroundColor: theme.colors.progressBg,
    borderRadius: theme.borderRadius.xs,
  },
});

export default PortfolioList;
