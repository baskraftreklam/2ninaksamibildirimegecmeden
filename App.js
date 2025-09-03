// App.js
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import reminderScheduler from './src/services/reminderScheduler';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#07141e',
    card: '#07141e',
    text: '#e5eef5',
    border: 'rgba(255,255,255,0.08)',
    primary: '#ff2d2d',
  },
};

export default function App() {
  useEffect(() => {
    // Uygulama başladığında bildirim sistemini başlat
    console.log('Bildirim sistemi başlatılıyor...');
    
    return () => {
      // Uygulama kapanırken bildirim sistemini durdur
      reminderScheduler.stopScheduler();
    };
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="#07141d" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
