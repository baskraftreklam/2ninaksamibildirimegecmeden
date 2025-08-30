import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from '../screens/Onboarding';
import Login from '../screens/Login';
import MainTabs from './MainTabs';
import FiltersModal from '../screens/FiltersModal';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login" // Login ekranından başla
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="MainTabs" component={MainTabs} />

      <Stack.Screen
        name="FiltersModal"
        component={FiltersModal}
        options={{ presentation: 'containedModal' }}
      />
    </Stack.Navigator>
  );
}
