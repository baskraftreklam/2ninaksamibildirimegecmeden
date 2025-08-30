// src/navigation/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Platform, View, Text, StyleSheet } from 'react-native';

import Home from '../screens/Home';
import PropertyDetail from '../screens/PropertyDetail';
import DemandPool from '../screens/DemandPool';
import Calendar from '../screens/Calendar';
import AddPortfolio from '../screens/AddPortfolio';
import Subscription from '../screens/Subscription';
import Packages from '../screens/Packages';
import Payment from '../screens/Payment';
import RequestForm from '../screens/RequestForm';
import RequestList from '../screens/RequestList';
import EditProfile from '../screens/EditProfile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Placeholder components for screens that don't exist yet
const PlaceholderScreen = React.memo(({ title }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#07141e' }}>
    <Text style={{ color: '#fff', fontSize: 18 }}>
      <Text>{title}</Text>
    </Text>
  </View>
));

// Screen components
import Profile from '../screens/Profile';

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Ana Sayfa"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 2,
          marginTop: 2,
        },
        tabBarStyle: {
          position: 'absolute',
          height: Platform.OS === 'ios' ? 88 : 70,
          paddingTop: Platform.OS === 'ios' ? 8 : 4,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          marginHorizontal: 16,
          marginBottom: Platform.OS === 'ios' ? 8 : 6,
          borderRadius: 20,
          backgroundColor: '#ff0000', // Tam kırmızı - GitHub projesindeki renk
          borderTopWidth: 0,
          borderWidth: 0,
          elevation: Platform.OS === 'android' ? 12 : 0,
          shadowColor: '#ff0000',
          shadowOpacity: 0.4,
          shadowRadius: 15,
          shadowOffset: { width: 0, height: 8 },
          // Android optimizations
          ...(Platform.OS === 'android' && {
            overflow: 'hidden',
            elevation: 12,
          }),
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Ana Sayfa') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Portföy Ekle') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Talep Ekle') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Talep Havuzu') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Profil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={styles.iconContainer}>
              <Text style={[styles.tabIcon, { color }]}>
                {iconName === 'home' || iconName === 'home-outline' ? (
                  <Text>H</Text>
                ) : iconName === 'add-circle' || iconName === 'add-circle-outline' ? (
                  <Text>+</Text>
                ) : iconName === 'document-text' || iconName === 'document-text-outline' ? (
                  <Text>📝</Text>
                ) : iconName === 'people' || iconName === 'people-outline' ? (
                  <Text>P</Text>
                ) : iconName === 'person' || iconName === 'person-outline' ? (
                  <Text>U</Text>
                ) : (
                  <Text>H</Text>
                )}
              </Text>
              {focused && <View style={styles.activeIndicator} />}
            </View>
          );
        },
        // Android specific optimizations
        ...(Platform.OS === 'android' && {
          tabBarHideOnKeyboard: true,
          tabBarPressColor: 'rgba(255, 255, 255, 0.2)',
          tabBarPressOpacity: 0.8,
        }),
      })}
    >
      <Tab.Screen 
        name="Ana Sayfa" 
        component={Home}
        options={{
          tabBarLabel: 'Ana Sayfa',
        }}
      />
      
      <Tab.Screen 
        name="Portföy Ekle" 
        component={AddPortfolio}
        options={{
          tabBarLabel: 'Portföy Ekle',
        }}
      />
      
      <Tab.Screen 
        name="Talep Ekle" 
        component={RequestForm}
        options={{
          tabBarLabel: 'Talep Ekle',
        }}
      />
      
      <Tab.Screen 
        name="Takvim" 
        component={Calendar}
        options={{
          tabBarLabel: 'Takvim',
        }}
      />
      
      <Tab.Screen 
        name="Talep Havuzu" 
        component={DemandPool}
        options={{
          tabBarLabel: 'Talep Havuzu',
        }}
      />
      
                        <Tab.Screen
                    name="Profil"
                    component={Profile}
                    options={{
                      tabBarLabel: 'Profil',
                    }}
                  />
    </Tab.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetail} />
      <Stack.Screen name="Subscription" component={Subscription} />
      <Stack.Screen name="Packages" component={Packages} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="RequestForm" component={RequestForm} />
      <Stack.Screen name="RequestList" component={RequestList} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabIcon: {
    fontSize: Platform.OS === 'ios' ? 24 : 22,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
});
