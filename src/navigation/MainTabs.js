// src/navigation/MainTabs.js
import React, { useState, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Modal, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Screens
import Home from '../screens/Home';
import PortfolioList from '../screens/PortfolioList';
import AddPortfolio from '../screens/AddPortfolio';
import RequestForm from '../screens/RequestForm';
import RequestList from '../screens/RequestList';
import Profile from '../screens/Profile';
import PropertyDetail from '../screens/PropertyDetail';

const { width, height } = Dimensions.get('window');
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Portfolio Stack
const PortfolioStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PortfolioList" component={PortfolioList} />
    <Stack.Screen name="AddPortfolio" component={AddPortfolio} />
    <Stack.Screen name="PropertyDetail" component={PropertyDetail} />
  </Stack.Navigator>
);

// Request Stack
const RequestStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RequestList" component={RequestList} />
    <Stack.Screen name="RequestForm" component={RequestForm} />
  </Stack.Navigator>
);

// Home Stack
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={Home} />
    <Stack.Screen name="PropertyDetail" component={PropertyDetail} />
  </Stack.Navigator>
);

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const buttonScaleAnimation = useRef(new Animated.Value(0.8)).current;

  const showModal = () => {
    setIsModalVisible(true);
    
    // Slide up animation
    Animated.parallel([
      Animated.spring(slideAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScaleAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 6,
      }),
    ]).start();
  };

  const hideModal = () => {
    // Slide down animation
    Animated.parallel([
      Animated.spring(slideAnimation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnimation, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsModalVisible(false);
    });
  };

  const handlePortfolioAdd = () => {
    hideModal();
    navigation.navigate('Portföy Havuzu', { screen: 'AddPortfolio' });
  };

  const handleRequestAdd = () => {
    hideModal();
    navigation.navigate('Talep Havuzu', { screen: 'RequestForm' });
  };

  return (
    <View style={styles.customTabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        
        const onPress = () => {
          if (route.name === 'Ekleme') {
            showModal();
            return;
          }

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let icon;
        if (route.name === 'Ana Sayfa') {
          icon = (
            <Image 
              source={require('../assets/images/home.png')} 
              style={[styles.iconImage, { tintColor: isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.6)' }]}
              resizeMode="contain"
            />
          );
        } else if (route.name === 'Portföy Havuzu') {
          icon = (
            <Image 
              source={require('../assets/images/porfoyhavuz.png')} 
              style={[styles.iconImage, { tintColor: isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.6)' }]}
              resizeMode="contain"
            />
          );
        } else if (route.name === 'Ekleme') {
          icon = (
            <TouchableOpacity style={styles.centerAddButton} onPress={showModal}>
              <Text style={styles.addButtonPlus}>+</Text>
            </TouchableOpacity>
          );
        } else if (route.name === 'Talep Havuzu') {
          icon = (
            <Image 
              source={require('../assets/images/talephavuz.png')} 
              style={[styles.iconImage, { tintColor: isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.6)' }]}
              resizeMode="contain"
            />
          );
        } else if (route.name === 'Profil') {
          icon = (
            <Image 
              source={require('../assets/images/profil.png')} 
              style={[styles.iconImage, { tintColor: isFocused ? '#ffffff' : 'rgba(255, 255, 255, 0.6)' }]}
              resizeMode="contain"
            />
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={onPress}
            activeOpacity={0.7}
          >
            {icon}
            {isFocused && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}

      {/* Enhanced Modal for Add Options */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideModal}
      >
        <Animated.View 
          style={[
            styles.modalOverlay,
            {
              opacity: fadeAnimation
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.modalOverlayTouch} 
            activeOpacity={1} 
            onPress={hideModal}
          >
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  opacity: fadeAnimation,
                  transform: [
                    { scale: buttonScaleAnimation }
                  ]
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={handlePortfolioAdd}
                activeOpacity={0.8}
              >
                <View style={styles.modalButtonContent}>
                  <Text style={styles.modalButtonIcon}>📁</Text>
                  <View style={styles.modalButtonTextContainer}>
                    <Text style={styles.modalButtonText}>Yeni Portföy Ekle</Text>
                    <Text style={styles.modalButtonSubtext}>Portföyünüzü ekleyin</Text>
                  </View>
                </View>
                <Text style={styles.modalButtonArrow}>→</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={handleRequestAdd}
                activeOpacity={0.8}
              >
                <View style={styles.modalButtonContent}>
                  <Text style={styles.modalButtonIcon}>📋</Text>
                  <View style={styles.modalButtonTextContainer}>
                    <Text style={styles.modalButtonText}>Yeni Talep Ekle</Text>
                    <Text style={styles.modalButtonSubtext}>Yeni talep oluşturun</Text>
                  </View>
                </View>
                <Text style={styles.modalButtonArrow}>→</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
};

const MainTabs = () => {
  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={props => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="Ana Sayfa" component={HomeStack} />
        <Tab.Screen name="Portföy Havuzu" component={PortfolioStack} />
        <Tab.Screen name="Ekleme" component={Home} />
        <Tab.Screen name="Talep Havuzu" component={RequestStack} />
        <Tab.Screen name="Profil" component={Profile} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  
  // Custom Tab Bar
  customTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#E60000',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginBottom: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 0,
    // Flexbox ile mükemmel ortalama
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  
  // Tab Item
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flex: 1,
    height: 50,
  },
  
  // Icon Image
  iconImage: {
    width: 24,
    height: 24,
  },
  
  // Merkezdeki + butonu
  centerAddButton: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#E60000',
  },
  
  addButtonPlus: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E60000',
  },
  
  // Active Dot - Daha yakın konumlandırıldı
  activeDot: {
    position: 'absolute',
    bottom: -4, // Daha yakın - önceki -8'den -4'e değiştirildi
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  
  // Enhanced Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalOverlayTouch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: 'rgba(26, 26, 26, 0.95)', // Dark glassmorphism background
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
    minWidth: 300,
    maxWidth: width * 0.85,
    // Glassmorphism effect
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
  },
  
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginVertical: 8,
    backgroundColor: '#E60000', // Solid red buttons
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  
  modalButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  
  modalButtonIcon: {
    fontSize: 28,
    marginRight: 15,
  },
  
  modalButtonTextContainer: {
    flex: 1,
  },
  
  modalButtonText: {
    fontSize: 16,
    color: '#ffffff', // White text on red background
    fontWeight: '700',
    marginBottom: 2,
  },
  
  modalButtonSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white
    fontWeight: '500',
  },
  
  modalButtonArrow: {
    fontSize: 20,
    color: '#ffffff', // White arrow on red background
    fontWeight: '600',
  },
});

export default MainTabs;
