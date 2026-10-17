import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LandlordDashboardScreen } from '../screens/Landlord/LandlordDashboardScreen';
import { AddListingScreen } from '../screens/Landlord/AddListingScreen';
import { useAuthStore } from '../state/useAuthStore';

export type LandlordStackParamList = {
  LandlordDashboard: undefined;
  AddListing: undefined;
};

const Stack = createNativeStackNavigator<LandlordStackParamList>();

export function LandlordStackNavigator() {
  const userId = useAuthStore((s) => s.userId) ?? '';
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LandlordDashboard">
        {({ navigation }) => (
          <LandlordDashboardScreen landlordId={userId} onAddListing={() => navigation.navigate('AddListing')} />
        )}
      </Stack.Screen>
      <Stack.Screen name="AddListing" component={AddListingScreen} options={{ headerShown: true, title: 'New listing' }} />
    </Stack.Navigator>
  );
}
