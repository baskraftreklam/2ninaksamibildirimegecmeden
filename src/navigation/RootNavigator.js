import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from '../screens/Onboarding';
import Login from '../screens/Login';
import MainTabs from './MainTabs';
import PropertyDetail from '../screens/PropertyDetail';
import FiltersModal from '../screens/FiltersModal';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
      }}
    >
      {/* İlk sürümde onboarding → login → app */}
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetail} />
      <Stack.Screen
        name="FiltersModal"
        component={FiltersModal}
        options={{ presentation: 'containedModal' }}
      />
    </Stack.Navigator>
  );
}
