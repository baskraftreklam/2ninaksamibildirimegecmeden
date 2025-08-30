// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import MainTabs from './src/navigation/MainTabs';

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
    <NavigationContainer theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor="#07141e" />
      <MainTabs />
    </NavigationContainer>
  );
}
