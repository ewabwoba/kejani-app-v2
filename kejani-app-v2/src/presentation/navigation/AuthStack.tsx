import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PhoneEntryScreen } from '../screens/Auth/PhoneEntryScreen';
import { OtpVerificationScreen } from '../screens/Auth/OtpVerificationScreen';

export type AuthStackParamList = {
  PhoneEntry: undefined;
  OtpVerification: { phone: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
    </Stack.Navigator>
  );
}
