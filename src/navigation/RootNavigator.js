import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from '../screens/Onboarding';
import Login from '../screens/Login';
import MainTabs from './MainTabs';
import FiltersModal from '../screens/FiltersModal';
import SplashScreens from '../screens/SplashScreens';
import Settings from '../screens/Settings';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs" // Direkt ana sayfaya git
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="Settings" component={Settings} />

      <Stack.Screen
        name="FiltersModal"
        component={FiltersModal}
        options={{ presentation: 'containedModal' }}
      />
    </Stack.Navigator>
  );
}
