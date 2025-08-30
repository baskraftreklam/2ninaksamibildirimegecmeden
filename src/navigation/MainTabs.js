// src/navigation/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
const ProfilScreen = () => null;

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Ana Sayfa"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#ff2d2d',
        tabBarInactiveTintColor: '#8aa0b2',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 6,
        },
        tabBarStyle: {
          position: 'absolute',
          height: 64,
          paddingTop: 6,
          paddingBottom: 6,
          marginHorizontal: 10,
          marginBottom: 8,
          borderRadius: 16,
          backgroundColor: 'rgba(7,20,30,0.92)',
          borderTopWidth: 0,
          borderColor: 'rgba(255,45,45,0.35)',
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
        },
        tabBarIcon: ({ focused, color }) => {
          let name = 'home-outline';
          if (route.name === 'Ana Sayfa') {
            name = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profil') {
            name = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={name} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Ana Sayfa" component={HomeScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}
