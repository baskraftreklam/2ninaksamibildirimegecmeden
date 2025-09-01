// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';

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
  return (
    <AuthProvider>
      <NavigationContainer theme={theme}>
        <StatusBar barStyle="light-content" backgroundColor="#07141d" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
