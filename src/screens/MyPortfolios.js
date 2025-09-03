import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';
import { fetchUserPortfolios, togglePortfolioPublishStatus } from '../services/firestore';
import ListingCard from '../components/ListingCard';

const MyPortfolios = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hiddenPortfolios, setHiddenPortfolios] = useState(new Set());
  
  // Popup state ve animasyon
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState(''); // 'success' veya 'info'
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Load user portfolios on component mount
  useEffect(() => {
    // Geçici olarak mock user kullan
    const mockUser = { uid: 'mock-user-id' };
    loadUserPortfolios(mockUser.uid);
  }, [loadUserPortfolios]);

  const loadUserPortfolios = useCallback(async (userId) => {
    try {
      setLoading(true);
      const data = await fetchUserPortfolios(userId);
      setPortfolios(data);
      console.log('[MyPortfolios] user portfolios loaded:', data.length);
    } catch (error) {
      console.error('Error loading user portfolios:', error);
      Alert.alert('Hata', 'Portföyler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleVisibility = (portfolioId) => {
    setHiddenPortfolios(prev => {
      const newSet = new Set(prev);
      if (newSet.has(portfolioId)) {
        newSet.delete(portfolioId);
      } else {
        newSet.add(portfolioId);
      }
      return newSet;
    });
  };

  const isHidden = (portfolioId) => hiddenPortfolios.has(portfolioId);

  const toggleHiddenPortfolios = () => {
    setShowHiddenOnly(!showHiddenOnly);
  };

  const showPopupMessage = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    
    // Animasyon başlat
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
    
    // 3 saniye sonra popup'ı kapat
    setTimeout(() => {
      hidePopup();
    }, 3000);
  };

  const hidePopup = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPopup(false);
    });
  };

  const togglePortfolioStatus = async (portfolioId) => {
    try {
      const portfolio = portfolios.find(p => p.id === portfolioId);
      if (!portfolio) return;

      const newStatus = !portfolio.isPublished;
      
      // API'ye gönder
      const result = await togglePortfolioPublishStatus(portfolioId, newStatus);
      
      if (result.success) {
        // Local state'i güncelle
        const updatedPortfolios = portfolios.map(p => 
          p.id === portfolioId 
            ? { ...p, isPublished: newStatus }
            : p
        );
        
        setPortfolios(updatedPortfolios);
        
        // Popup mesajını göster
        const message = newStatus 
          ? 'Portföyünüz yayınlanmıştır' 
          : 'Portföyünüz gizlenmiştir';
        showPopupMessage(message, 'success');
      }
    } catch (error) {
      console.error('Error toggling portfolio status:', error);
      Alert.alert('Hata', 'Portföy durumu değiştirilirken bir hata oluştu.');
    }
  };

  const renderPortfolioCard = ({ item: portfolio }) => (
    <View style={styles.portfolioCardContainer}>
      {/* Portfolio Card Header with Actions */}
      <View style={styles.portfolioCardHeader}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            portfolio.isPublished ? styles.actionButtonVisible : styles.actionButtonHidden
          ]}
          onPress={() => togglePortfolioStatus(portfolio.id)}
        >
          <View style={[
            styles.statusDot,
            portfolio.isPublished ? styles.statusDotPublished : styles.statusDotHidden
          ]} />
          <Text style={[
            styles.actionButtonText,
            portfolio.isPublished ? styles.actionButtonTextVisible : styles.actionButtonTextHidden
          ]}>
            {portfolio.isPublished ? 'Yayında' : 'Gizli'}
          </Text>
        </TouchableOpacity>
      </View>

             {/* Portfolio Card */}
       <ListingCard
         listing={portfolio}
         onPress={() => navigation.navigate('Ana Sayfa', { screen: 'PropertyDetail', params: { portfolio } })}
         isEditable={true}
       />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.white} />
        <Text style={styles.loadingText}>Portföyler yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Arka Plan - Koyu renk */}
      <View style={styles.backgroundContainer} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButtonBack}
          onPress={() => navigation.goBack()}
        >
          <Image 
            source={require('../assets/images/icons/return.png')} 
            style={styles.headerButtonIconBack}
          />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.mainTitle}>Portföylerim</Text>
          <Text style={styles.mainSubtitle}>
            {showHiddenOnly ? 'Gizli Portföyler' : 'Portföy yönetimi'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.headerButton,
            showHiddenOnly && styles.headerButtonActive
          ]}
          onPress={() => toggleHiddenPortfolios()}
        >
          <Image 
            source={require('../assets/images/icons/hide.png')} 
            style={styles.headerButtonIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Portfolio List - Yan yana 2 sütun */}
      <FlatList
        data={showHiddenOnly ? portfolios.filter(p => !p.isPublished) : portfolios}
        renderItem={renderPortfolioCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.portfolioRow}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Success Popup */}
      {showPopup && (
        <Animated.View 
          style={[
            styles.popupOverlay,
            { opacity: fadeAnim }
          ]}
        >
          <Animated.View 
            style={[
              styles.popupContainer,
              { 
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim 
              }
            ]}
          >
            <View style={styles.popupIconContainer}>
              <Image 
                source={require('../assets/images/icons/check.png')} 
                style={styles.popupIcon}
              />
            </View>
            <Text style={styles.popupMessage}>{popupMessage}</Text>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  
  // Arka Plan
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: 60,
    paddingBottom: theme.spacing.lg,
    backgroundColor: theme.colors.primary + 'D9',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    marginBottom: theme.spacing.lg,
  },
  
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.small,
  },

  headerButtonBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.medium,
  },
  
  headerButtonIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: theme.colors.white,
  },

  headerButtonIconBack: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: theme.colors.primary,
  },

  headerButtonActive: {
    backgroundColor: theme.colors.success + '4D',
    borderColor: theme.colors.success,
  },
  
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
  },
  
  mainTitle: {
    fontSize: theme.fontSizes.xxxl,
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
    textAlign: 'center',
  },
  
  mainSubtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textWhite + 'CC',
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  
  listContainer: {
    padding: theme.spacing.lg,
    paddingBottom: 100,
  },
  
  portfolioRow: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  
  portfolioCardContainer: {
    width: '48%',
    marginBottom: theme.spacing.lg,
  },
  
  portfolioCardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  
  actionButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    paddingHorizontal: theme.spacing.md,
  },
  
  actionButtonVisible: {
    backgroundColor: theme.colors.success + '1A',
  },
  
  actionButtonHidden: {
    backgroundColor: theme.colors.error + '1A',
    minWidth: 60,
    paddingHorizontal: theme.spacing.sm,
  },
  
  actionButtonText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  },
  
  actionButtonTextVisible: {
    opacity: 1,
  },
  
  actionButtonTextHidden: {
    opacity: 0.9,
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  
  statusDotPublished: {
    backgroundColor: theme.colors.success,
  },
  
  statusDotHidden: {
    backgroundColor: theme.colors.error,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
  },

  loadingText: {
    color: theme.colors.white,
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSizes.xl,
  },

  // Popup Styles
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  popupContainer: {
    backgroundColor: theme.colors.primary + 'F2',
    borderRadius: theme.borderRadius.xl,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.large,
    minWidth: 280,
  },

  popupIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.success + '33',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.success,
  },

  popupIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    tintColor: theme.colors.success,
  },

  popupMessage: {
    fontSize: theme.fontSizes.xxl,
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default MyPortfolios;
