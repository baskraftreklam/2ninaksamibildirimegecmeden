// src/screens/SplashScreens.js
// Talepify - 4 Adet Animasyonlu Splash Ekranı
// Robot maskot ile sistem tanıtımı

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreens = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  
  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const robotSlideAnim = useRef(new Animated.Value(50)).current;
  const textSlideAnim = useRef(new Animated.Value(30)).current;
  const dotScaleAnim = useRef(new Animated.Value(0)).current;

  const screens = [
    {
      title: "Talepify'a Hoş Geldiniz!",
      subtitle: "Portföy ve talep yönetiminde yeni dönem başlıyor",
      description: "Akıllı eşleştirme sistemi ile portföylerinizi ve taleplerinizi kolayca yönetin",
      robotPose: "waving",
      color: "#E50000"
    },
    {
      title: "Akıllı Eşleştirme",
      subtitle: "AI destekli portföy-talep eşleştirme",
      description: "Yapay zeka algoritmaları ile en uygun portföy ve talepleri bulun",
      robotPose: "thinking",
      color: "#CC0000"
    },
    {
      title: "Güvenli İşlemler",
      subtitle: "End-to-end şifreleme ile güvenlik",
      description: "Tüm işlemleriniz güvenli ve şeffaf bir şekilde gerçekleşir",
      robotPose: "secure",
      color: "#B30000"
    },
    {
      title: "Hızlı ve Kolay",
      subtitle: "Saniyeler içinde işlem yapın",
      description: "Modern arayüz ile hızlı ve kullanıcı dostu deneyim",
      robotPose: "fast",
      color: "#990000"
    }
  ];

  useEffect(() => {
    startScreenAnimation();
  }, [currentScreen, startScreenAnimation]);

  const startScreenAnimation = useCallback(() => {
    // Reset animasyonlar
    fadeAnim.setValue(0);
    slideAnim.setValue(width);
    scaleAnim.setValue(0.8);
    robotSlideAnim.setValue(50);
    textSlideAnim.setValue(30);
    dotScaleAnim.setValue(0);

    // Paralel animasyon sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
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
      Animated.spring(robotSlideAnim, {
        toValue: 0,
        tension: 90,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(textSlideAnim, {
        toValue: 0,
        tension: 85,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(dotScaleAnim, {
        toValue: 1,
        tension: 120,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim, robotSlideAnim, textSlideAnim, dotScaleAnim]);

  const nextScreen = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Son ekranda giriş ekranına git
      navigation.replace('Login');
    }
  };

  const skipToHome = () => {
    navigation.replace('Login');
  };

  const renderRobotMascot = (pose) => {
    // Her pose için farklı animasyonlar
    const getPoseAnimation = (pose) => {
      switch(pose) {
        case 'waving':
          return { transform: [{ rotate: '5deg' }] };
        case 'thinking':
          return { transform: [{ rotate: '-5deg' }] };
        case 'secure':
          return { transform: [{ rotate: '0deg' }] };
        case 'fast':
          return { transform: [{ rotate: '10deg' }] };
        default:
          return {};
      }
    };

    return (
      <Animated.View style={[
        styles.robotContainer,
        {
          transform: [
            { translateY: robotSlideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}>
        <Animated.View style={[
          styles.robotBody, 
          { backgroundColor: screens[currentScreen].color },
          getPoseAnimation(pose)
        ]}>
          <View style={styles.robotHead}>
            <View style={styles.robotEyes}>
              <View style={styles.robotEye} />
              <View style={styles.robotEye} />
            </View>
            <View style={styles.robotMouth} />
            <View style={styles.robotAntenna} />
          </View>
          <View style={styles.robotTie} />
          <View style={styles.robotLogo}>
            <Text style={styles.logoText}>T</Text>
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E50000" />
      
      {/* Üst navigasyon */}
      <View style={styles.topNav}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => currentScreen > 0 ? setCurrentScreen(currentScreen - 1) : null}
          disabled={currentScreen === 0}
        >
          <Text style={[styles.backButtonText, { opacity: currentScreen === 0 ? 0.3 : 1 }]}>←</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.skipButton} onPress={skipToHome}>
          <Text style={styles.skipButtonText}>Atla</Text>
        </TouchableOpacity>
      </View>

      {/* Ana içerik */}
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }]
        }
      ]}>
        {/* Robot Maskot */}
        {renderRobotMascot(screens[currentScreen].robotPose)}

        {/* Metin içeriği */}
        <Animated.View style={[
          styles.textContainer,
          {
            transform: [{ translateY: textSlideAnim }]
          }
        ]}>
          <Text style={styles.title}>{screens[currentScreen].title}</Text>
          <Text style={styles.subtitle}>{screens[currentScreen].subtitle}</Text>
          <Text style={styles.description}>{screens[currentScreen].description}</Text>
        </Animated.View>
      </Animated.View>

      {/* Alt navigasyon */}
      <View style={styles.bottomNav}>
        {/* Pagination dots */}
        <View style={styles.dotsContainer}>
          {screens.map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentScreen ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
                  transform: [{ scale: index === currentScreen ? dotScaleAnim : 1 }]
                }
              ]}
            />
          ))}
        </View>

        {/* İleri butonu */}
        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: screens[currentScreen].color }]} 
          onPress={nextScreen}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentScreen === screens.length - 1 ? 'Başla' : 'İleri'}
          </Text>
          <Text style={styles.nextButtonArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E50000',
  },
  
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  
  robotContainer: {
    marginBottom: 60,
    alignItems: 'center',
  },
  
  robotBody: {
    width: 120,
    height: 160,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  
  robotHead: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  
  robotEyes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 50,
    marginBottom: 10,
  },
  
  robotEye: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0066CC',
  },
  
  robotMouth: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#333333',
  },
  
  robotAntenna: {
    position: 'absolute',
    top: -15,
    width: 4,
    height: 20,
    backgroundColor: '#E50000',
    borderRadius: 2,
  },
  
  robotTie: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#E50000',
    marginTop: 10,
  },
  
  robotLogo: {
    position: 'absolute',
    top: 20,
    right: 15,
    width: 20,
    height: 20,
    backgroundColor: '#E50000',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  logoText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  textContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 34,
  },
  
  subtitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.9,
  },
  
  description: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  
  dotsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 18,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  
  nextButtonArrow: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SplashScreens;
