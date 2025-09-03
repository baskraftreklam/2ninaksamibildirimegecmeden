import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import MainTabs from './MainTabs';
import FiltersModal from '../screens/FiltersModal';
import Settings from '../screens/Settings';
import ReferralSystem from '../screens/ReferralSystem';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs" // Direkt ana sayfaya git
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: 'transparent' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen 
        name="Login" 
        component={Login}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen 
        name="Register" 
        component={Register}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={Settings}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen 
        name="ReferralSystem" 
        component={ReferralSystem}
        options={{ animation: 'slide_from_right' }}
      />

      <Stack.Screen
        name="FiltersModal"
        component={FiltersModal}
        options={{ 
          presentation: 'containedModal',
          animation: 'slide_from_bottom'
        }}
      />
    </Stack.Navigator>
  );
}
