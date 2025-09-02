import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';
import { fetchUserPortfolios, togglePortfolioPublishStatus } from '../services/firestore';
import ListingCard from '../components/ListingCard';

const { width } = Dimensions.get('window');

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
    if (user) {
      loadUserPortfolios();
    }
  }, [user, loadUserPortfolios]);

  const loadUserPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUserPortfolios(user.uid);
      setPortfolios(data);
      console.log('[MyPortfolios] user portfolios loaded:', data.length);
    } catch (error) {
      console.error('Error loading user portfolios:', error);
      Alert.alert('Hata', 'Portföyler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  }, [user]);

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
         onPress={() => navigation.navigate('PropertyDetail', { portfolio })}
         isEditable={true}
       />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
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
    backgroundColor: '#130139',
  },
  
  // Arka Plan
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#130139',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(19, 1, 57, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 20,
  },
  
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  headerButtonBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  headerButtonIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },

  headerButtonIconBack: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#130139',
  },



  headerButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    borderColor: '#10b981',
  },
  
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  
  mainSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  
  portfolioRow: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  
  portfolioCardContainer: {
    width: (width - 60) / 2,
    marginBottom: 20,
  },
  
  portfolioCardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  
  actionButton: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 80,
    paddingHorizontal: 12,
    transition: 'all 0.3s ease',
  },
  
  actionButtonVisible: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  
  actionButtonHidden: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    minWidth: 60,
    paddingHorizontal: 8,
  },
  
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    transition: 'all 0.3s ease',
  },
  
  actionButtonTextVisible: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  
  actionButtonTextHidden: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  
  statusDotPublished: {
    backgroundColor: '#10b981',
  },
  
  statusDotHidden: {
    backgroundColor: '#ef4444',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#130139',
  },

  loadingText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16,
  },

  // Popup Styles
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  popupContainer: {
    backgroundColor: 'rgba(19, 1, 57, 0.95)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 20,
    minWidth: 280,
  },

  popupIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#10b981',
  },

  popupIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    tintColor: '#10b981',
  },

  popupMessage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default MyPortfolios;
