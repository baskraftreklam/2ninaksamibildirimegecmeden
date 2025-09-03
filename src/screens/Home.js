// src/screens/Home.js
// Resimdeki tasarımı birebir uygulayan ana sayfa

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubscriptionGuard from '../components/SubscriptionGuard';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Business kalitesinde animasyonlar
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const headerSlideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Business kalitesinde animasyon sequence - Sadece JavaScript thread'de
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: false,
      }),
      Animated.spring(headerSlideAnim, {
        toValue: 0,
        tension: 90,
        friction: 7,
        useNativeDriver: false,
      }),
    ]).start();
  }, [fadeAnim, slideUpAnim, scaleAnim, headerSlideAnim]);

  // Okunmamış bildirim sayısını yükle
  useEffect(() => {
    loadUnreadCount();
    
    // Her 5 saniyede bir güncelle
    const interval = setInterval(loadUnreadCount, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const storedNotifications = await AsyncStorage.getItem('notifications');
      if (storedNotifications) {
        const notifications = JSON.parse(storedNotifications);
        const unreadNotifications = notifications.filter(notification => !notification.isRead);
        setUnreadCount(unreadNotifications.length);
      } else {
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Okunmamış bildirim sayısı yüklenirken hata:', error);
      setUnreadCount(0);
    }
  };

  const getIconSource = (iconName) => {
    const iconMap = {
      'ajandaicon': require('../assets/images/ajandaicon.png'),
      'notlaricon': require('../assets/images/notlaricon.png'),
      'gorevlericon': require('../assets/images/gorevlericon.png'),
      'haberlericon': require('../assets/images/haberlericon.png'),
      'rediicon': require('../assets/images/rediicon.png'),
      'favicon': require('../assets/images/favicon.png'),
      'destekicon': require('../assets/images/destekicon.png'),
      'favporticon': require('../assets/images/favporticon.png'),
      'komisyonicon': require('../assets/images/komisyonicon.png'),
      'portanaicon': require('../assets/images/portanaicon.png'),
      'talanaicon': require('../assets/images/talanaicon.png'),
      'logo': require('../assets/images/logo.png'),
    };
    return iconMap[iconName] || require('../assets/images/logo.png');
  };

  const renderTaskIcon = (iconName, label, onPress) => (
    <TouchableOpacity 
      style={styles.featureIconContainer} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={getIconSource(iconName)} style={styles.taskFeatureIcon} />
      <Text style={styles.taskFeatureLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const renderBottomIcon = (iconName, label, onPress) => (
    <TouchableOpacity 
      style={styles.featureIconContainer} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={getIconSource(iconName)} style={styles.bottomFeatureIcon} />
      <Text style={styles.bottomFeatureLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SubscriptionGuard>
      <View style={styles.container}>
        {/* Arka Plan */}
        <View style={styles.backgroundContainer}>
          <Image source={require('../assets/images/dark-bg.jpg')} style={styles.backgroundImage} />
        </View>

        {/* Header - Logo ve Bildirim */}
        <Animated.View 
          style={[
            styles.header,
            {
              transform: [{ translateY: headerSlideAnim }]
            }
          ]}
        >
          <View style={styles.headerLeft}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Image source={require('../assets/images/notification.png')} style={styles.notificationIcon} />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ 
            opacity: fadeAnim,
            transform: [
              { translateY: slideUpAnim },
              { scale: scaleAnim }
            ]
          }}>
            {/* Görev Kartı - Resimdeki gibi beyaz */}
            <View style={styles.taskCard}>
              {/* Kartın Üst Bölümü - Görev Metni ve İlerleme */}
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>Bu gün tamamladığın görevler...</Text>
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>%67</Text>
                  <View style={styles.progressArc}>
                    <View style={styles.progressFill} />
                  </View>
                </View>
              </View>
              
              {/* Ayırıcı Çizgi */}
              <View style={styles.divider} />
              
              {/* İlk Satır İkonları - 4 adet */}
              <View style={styles.iconRow}>
                {renderTaskIcon('ajandaicon', 'Ajanda', () => navigation.navigate('Calendar'))}
                {renderTaskIcon('notlaricon', 'Notlarım', () => navigation.navigate('Profile'))}
                {renderTaskIcon('gorevlericon', 'Görevler', () => navigation.navigate('RequestList'))}
                {renderTaskIcon('haberlericon', 'Haberler', () => navigation.navigate('Settings'))}
              </View>

            </View>

            {/* Alt İkonlar Container - Ayrı beyaz kart */}
            <View style={styles.bottomIconsCard}>
              <View style={styles.bottomIconsRow}>
                {renderBottomIcon('rediicon', 'Kredi Hesaplama', () => navigation.navigate('Settings'))}
                {renderBottomIcon('favicon', 'Favori Talepler', () => navigation.navigate('RequestList'))}
                {renderBottomIcon('destekicon', 'Müşteri Destek', () => navigation.navigate('Settings'))}
                {renderBottomIcon('favporticon', 'Favori Portföyler', () => navigation.navigate('MyPortfolios'))}
                {renderBottomIcon('komisyonicon', 'Komisyon Hesaplama', () => navigation.navigate('Settings'))}
              </View>
            </View>

            {/* Navigasyon Butonları - Talep Havuzu ve Portföy Havuzu */}
            <View style={styles.navigationButtonsContainer}>
              <TouchableOpacity 
                style={styles.navigationButton}
                onPress={() => navigation.navigate('PortfolioList')}
                activeOpacity={0.8}
              >
                <View style={styles.buttonIconContainer}>
                  <Image 
                    source={require('../assets/images/porfoyhavuz.png')} 
                    style={styles.buttonIcon}
                  />
                </View>
                <Text style={styles.buttonTitle}>Portföy Havuzu</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.navigationButton}
                onPress={() => navigation.navigate('DemandPool')}
                activeOpacity={0.8}
              >
                <View style={styles.buttonIconContainer}>
                  <Image 
                    source={require('../assets/images/talephavuz.png')} 
                    style={styles.buttonIcon}
                  />
                </View>
                <Text style={styles.buttonTitle}>Talep Havuzu</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </SubscriptionGuard>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  // Arka Plan
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
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    zIndex: 10,
  },
  
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  logo: {
    width: 150,
    height: 40,
    resizeMode: 'contain',
  },
  
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  notificationButton: {
    position: 'relative',
  },
  
  notificationIcon: {
    width: 40,
    height: 40,
    tintColor: '#ffffff',
  },

  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Ana İçerik
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  
  // Görev Kartı - Resimdeki gibi beyaz
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Math.min(width * 0.05, 15),
    padding: Math.min(width * 0.04, 15),
    marginTop: height * 0,
    marginBottom: height * 0.015,
    marginHorizontal: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    zIndex: 10,
  },
  
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  
  taskTitle: {
    color: '#130139',
    fontSize: Math.min(width * 0.04, 16), // Responsive font size
    fontWeight: '500',
    flex: 1,
    marginRight: width * 0.05, // Responsive margin
    marginLeft: width * 0.08,  // Responsive margin
    marginTop: height * 0.012, // Responsive margin
    textAlign: 'left',
  },
  
  progressContainer: {
    alignItems: 'center',
  },
  
  progressText: {
    color: '#130139', // Koyu mor
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  
  progressArc: {
    width: 50,
    height: 25,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    position: 'relative',
  },
  
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '67%',
    height: '100%',
    backgroundColor: '#130139', // Koyu mor
    borderRadius: 25,
  },
  
  divider: {
    height: 1,
    backgroundColor: '#130139',
    marginVertical: height * 0.018,
    width: Math.min(width * 0.8, 320),
    alignSelf: 'center',
  },
  
  // İkon Satırları
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  
  // Alt İkonlar Container
  bottomIconsCard: {
    backgroundColor: '#130139',
    borderRadius: 35,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 20,
    marginTop: -50,
    marginBottom: 20,
    marginHorizontal: 7,
    height: 140,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    zIndex: 1,
  },
  
  bottomIconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  
  featureIconContainer: {
    alignItems: 'center',
    flex: 1,
  },
  
  // Görev kartı ikonları için stil
  taskFeatureIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
    tintColor: '#130139',    // Koyu mor
  },
  
  // Alt kart ikonları için stil
  bottomFeatureIcon: {
    width: 32,
    height: 32,
    marginBottom: 8,
    tintColor: '#ffffff',    // Açık mor (farklı renk)
  },
  
  // Görev kartı etiketleri için stil
  taskFeatureLabel: {
    color: '#374151',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Alt kart etiketleri için stil
  bottomFeatureLabel: {
    color: '#ffffff',        // Farklı renk
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Navigasyon Butonları
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Ortala
    marginTop: 40, // Daha büyük margin ile butonları aşağıya indir
    marginBottom: 15, // Alt margin'i azalttım (navigasyon barının daha yakınında)
    paddingHorizontal: 20,
    gap: 15, // Butonlar arası boşluk
  },

  navigationButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8, // Radius'u azalttım
    padding: 12, // Daha ince yapmak için
    width: (width - 70) / 2, // Genişliği azalt
    flexDirection: 'row', // Yatay düzen için
    alignItems: 'center',
    justifyContent: 'flex-start', // Sola hizala
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(19, 1, 57, 0.1)',
  },

  buttonIconContainer: {
    width: 28, // Daha küçük ikon container
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(19, 1, 57, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10, // Sağa margin ekle
    marginBottom: 0, // Alt margin'i kaldır
  },

  buttonIcon: {
    width: 16, // Daha küçük ikon
    height: 16,
    resizeMode: 'contain',
    tintColor: '#130139',
  },

  buttonTitle: {
    fontSize: 13, // Daha küçük font
    fontWeight: '700',
    color: '#130139',
    textAlign: 'left', // Sola hizala
    marginBottom: 0, // Alt margin'i kaldır
    flex: 1, // Kalan alanı kapla
  },

});

export default Home;
