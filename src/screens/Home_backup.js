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
  LinearGradient,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../theme/theme';

const { width, height } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  
  // Business kalitesinde animasyonlar
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const headerSlideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Business kalitesinde animasyon sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideUpAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.spring(headerSlideAnim, {
        toValue: 0,
        tension: 90,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideUpAnim, scaleAnim, headerSlideAnim]);

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
          <TouchableOpacity style={styles.notificationButton}>
            <Image source={require('../assets/images/notification.png')} style={styles.notificationIcon} />
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
              {renderTaskIcon('notlaricon', 'Notlarım', () => navigation.navigate('Notes'))}
              {renderTaskIcon('gorevlericon', 'Görevler', () => navigation.navigate('Tasks'))}
              {renderTaskIcon('haberlericon', 'Haberler', () => navigation.navigate('News'))}
            </View>

          </View>

          {/* Alt İkonlar Container - Ayrı beyaz kart */}
          <View style={styles.bottomIconsCard}>
            <View style={styles.bottomIconsRow}>
              {renderBottomIcon('rediicon', 'Kredi Hesaplama', () => navigation.navigate('CreditCalculation'))}
              {renderBottomIcon('favicon', 'Favori Talepler', () => navigation.navigate('FavoriteRequests'))}
              {renderBottomIcon('destekicon', 'Müşteri Destek', () => navigation.navigate('CustomerSupport'))}
              {renderBottomIcon('favporticon', 'Favori Portföyler', () => navigation.navigate('FavoritePortfolios'))}
              {renderBottomIcon('komisyonicon', 'Komisyon Hesaplama', () => navigation.navigate('CommissionCalculation'))}
            </View>
          </View>

          {/* Yeni Büyük Container - Koyu mor şeffaf */}
          <View style={styles.newLargeContainer}>
            <Text style={styles.newContainerTitle}>Yeni İçerik Alanı</Text>
            <Text style={styles.newContainerSubtitle}>Buraya istediğiniz içeriği ekleyebilirsiniz</Text>
          </View>

          {/* Navigasyon Butonları - Talep Havuzu ve Portföy Havuzu */}
          <View style={styles.navigationButtonsContainer}>
            <TouchableOpacity 
              style={styles.navigationButton}
              onPress={() => navigation.navigate('Talep Havuzu')}
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

            <TouchableOpacity 
              style={styles.navigationButton}
              onPress={() => navigation.navigate('Portföy Havuzu')}
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
          </View>
        </Animated.View>
      </ScrollView>
    </View>
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

  // Yeni Büyük Container Stilleri
  newLargeContainer: {
    backgroundColor: 'rgba(19, 1, 57, 0.85)', // Biraz daha opak
    borderRadius: 15,
    padding: 20,
    marginTop: 5,
    marginBottom: 16,
    marginHorizontal: 0,
    minHeight: 120,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
    zIndex: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  newContainerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },

  newContainerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 20,
  },

  // Navigasyon Butonları
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  navigationButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: (width - 60) / 2,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(19, 1, 57, 0.1)',
  },

  buttonIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(19, 1, 57, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  buttonIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#130139',
  },

  buttonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#130139',
    textAlign: 'center',
    marginBottom: 6,
  },

  buttonSubtitle: {
    fontSize: 12,
    color: 'rgba(19, 1, 57, 0.7)',
    textAlign: 'center',
    lineHeight: 16,
  },

});

export default Home;
