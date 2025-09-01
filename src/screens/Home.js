// src/screens/Home.js
// Yeni ana sayfa tasarımı - kırmızı header, görev kartı, ikonlar ve toggle butonları

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

const { width, height } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation();
  const [selectedPortfolioTab, setSelectedPortfolioTab] = useState('portfolios');
  const [selectedFavoriteTab, setSelectedFavoriteTab] = useState('favoritePortfolios');

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

  const renderFeatureIcon = (iconName, label, onPress) => (
    <TouchableOpacity 
      style={styles.featureIconContainer} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={getIconSource(iconName)} style={styles.featureIcon} />
      <Text style={styles.featureLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const renderLargeToggleButton = (title, icon, isSelected, onPress) => (
      <TouchableOpacity 
      style={[styles.largeToggleButton, isSelected && styles.largeToggleButtonSelected]} 
      onPress={onPress}
    >
      <Image source={getIconSource(icon)} style={styles.largeToggleIcon} />
      <Text style={[styles.largeToggleText, isSelected && styles.largeToggleTextSelected]}>{title}</Text>
    </TouchableOpacity>
  );

  const renderSmallToggleButton = (title, isSelected, onPress) => (
          <TouchableOpacity 
      style={[styles.smallToggleButton, isSelected && styles.smallToggleButtonSelected]} 
      onPress={onPress}
    >
      <Text style={[styles.smallToggleText, isSelected && styles.smallToggleTextSelected]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
            {/* Kırmızı Header */}
      <Animated.View 
        style={[
          styles.redHeader,
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
          {/* Görev Kartı */}
          <View style={styles.taskCard}>
            <View style={styles.taskHeader}>
              <Text style={styles.taskTitle}>Bu gün tamamladığın görevler...</Text>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>%67</Text>
                <View style={styles.progressArc}>
                  <View style={styles.progressFill} />
                </View>
              </View>
              </View>
            <View style={styles.divider} />
            
            {/* İlk Satır İkonları */}
            <View style={styles.iconRow}>
              {renderFeatureIcon('ajandaicon', 'Ajanda', () => navigation.navigate('Calendar'))}
              {renderFeatureIcon('notlaricon', 'Notlarım', () => navigation.navigate('Notes'))}
              {renderFeatureIcon('gorevlericon', 'Görevler', () => navigation.navigate('Tasks'))}
              {renderFeatureIcon('haberlericon', 'Haberler', () => navigation.navigate('News'))}
              </View>
          </View>

          {/* İkinci Satır İkonları */}
          <View style={styles.secondIconRow}>
            {renderFeatureIcon('rediicon', 'Kredi Hesaplama', () => navigation.navigate('CreditCalculation'))}
            {renderFeatureIcon('favicon', 'Favori Talepler', () => navigation.navigate('FavoriteRequests'))}
            {renderFeatureIcon('destekicon', 'Müşteri Destek', () => navigation.navigate('CustomerSupport'))}
            {renderFeatureIcon('favporticon', 'Favori Portföyler', () => navigation.navigate('FavoritePortfolios'))}
            {renderFeatureIcon('komisyonicon', 'Komisyon Hesaplama', () => navigation.navigate('CommissionCalculation'))}
        </View>


    </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A191E', // Koyu teal arka plan
  },
  
  // Kırmızı Header
  redHeader: {
    backgroundColor: '#E50000',
    height: height * 0.4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 0,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'absolute',
    top: 0,
    left: 7,
    right: 7,
    zIndex: 0,
  },
  
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  
  logo: {
    width: 235,
    height: 40,
    marginRight: 0,
    resizeMode: 'contain',
  },
  
  appName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  notificationButton: {
    marginRight: 25,
  },
  
  notificationIcon: {
    width: 45,
    height: 45,
  },
  

  
  // Ana İçerik
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 125,
  },
  
  // Görev Kartı
  taskCard: {
    backgroundColor: '#00141c',
    borderRadius: 19,
    padding: 17,
    marginTop: 0,
    marginBottom: 30,
    marginHorizontal: 0,
  },
  
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  
  progressContainer: {
    alignItems: 'center',
  },
  
  progressText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  
  progressArc: {
    width: 40,
    height: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#333333',
    overflow: 'hidden',
    position: 'relative',
  },
  
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '67%',
    height: '100%',
    backgroundColor: '#E50000',
    borderRadius: 20,
  },
  
  divider: {
    height: 1,
    backgroundColor: '#FFFFFF',
    marginVertical: 15,
  },
  
  // İkon Satırları
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  secondIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 130,
  },
  
  featureIconContainer: {
    alignItems: 'center',
    flex: 1,
  },
  
  featureIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  
  featureLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  
  // Kırmızı ikili butonlar
  duoWrap: {
    marginTop: 50,
    backgroundColor: 'transparent',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E50000',
    shadowColor: '#000', 
    shadowOpacity: 0.25, 
    shadowRadius: 8, 
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  
  duoBtn: { 
    flex: 1, 
    paddingVertical: 18, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  
  duoActive: { 
    backgroundColor: 'transparent' 
  },
  
  duoDivider: { 
    width: 1, 
    backgroundColor: '#E50000' 
  },
  
  duoIcon: { 
    width: 28, 
    height: 28, 
    resizeMode: 'contain', 
    marginBottom: 4 
  },
  
  duoTxt: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '800' 
  },

  // Alt satır - Kısa yükseklikli butonlar
  duoWrapShort: {
    marginTop: 20,
    backgroundColor: 'transparent',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'stretch',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E50000',
    shadowColor: '#000', 
    shadowOpacity: 0.15, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  
  duoBtnShort: { 
    flex: 1, 
    paddingVertical: 12, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  
  duoTxtShort: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '600' 
  },
});

export default Home;
