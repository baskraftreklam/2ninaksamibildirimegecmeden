import React, { useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const FloatingActionButton = () => {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(1)).current;

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    setIsOpen(!isOpen);

    Animated.parallel([
      Animated.timing(animation, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: isOpen ? 1 : 1.1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePortfolioAdd = () => {
    navigation.navigate('AddPortfolio');
    toggleMenu();
  };

  const handleRequestAdd = () => {
    navigation.navigate('RequestForm');
    toggleMenu();
  };

  const portfolioButtonStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -80],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  const requestButtonStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -160],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  const mainButtonStyle = {
    transform: [
      {
        scale: scaleAnimation,
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* Portföy Ekle Butonu */}
      <Animated.View style={[styles.actionButton, styles.portfolioButton, portfolioButtonStyle]}>
        <TouchableOpacity
          style={styles.actionButtonInner}
          onPress={handlePortfolioAdd}
          activeOpacity={0.8}
        >
          <View style={styles.actionButtonIcon}>
            {/* Portföy ikonu buraya gelecek */}
            <Text style={styles.actionButtonText}>📁</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Talep Ekle Butonu */}
      <Animated.View style={[styles.actionButton, styles.requestButton, requestButtonStyle]}>
        <TouchableOpacity
          style={styles.actionButtonInner}
          onPress={handleRequestAdd}
          activeOpacity={0.8}
        >
          <View style={styles.actionButtonIcon}>
            {/* Talep ikonu buraya gelecek */}
            <Text style={styles.actionButtonText}>📋</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      {/* Ana Ekleme Butonu */}
      <Animated.View style={[styles.mainButton, mainButtonStyle]}>
        <TouchableOpacity
          style={styles.mainButtonInner}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <View style={styles.mainButtonIcon}>
            {/* Ana ekleme ikonu buraya gelecek */}
            <Text style={styles.mainButtonText}>+</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    alignItems: 'center',
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff0000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  mainButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainButtonText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  actionButton: {
    position: 'absolute',
    bottom: 0,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ff0000',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  actionButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  portfolioButton: {
    backgroundColor: '#ff0000',
  },
  requestButton: {
    backgroundColor: '#ff0000',
  },
});

export default FloatingActionButton;

