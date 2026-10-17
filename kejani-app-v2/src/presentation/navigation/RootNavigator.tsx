import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthStackNavigator } from './AuthStack';
import { MainTabs } from './MainTabs';
import { LandlordStackNavigator } from './LandlordStack';
import { IdentityVerificationScreen } from '../screens/Onboarding/IdentityVerificationScreen';
import { ProfileScreenContainer } from '../screens/Profile/ProfileScreenContainer';
import { useAuthStore } from '../state/useAuthStore';

export function RootNavigator() {
  const { isAuthenticated, role, kycSubmitted, markKycSubmitted } = useAuthStore();

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        <AuthStackNavigator />
      ) : role === 'landlord' && !kycSubmitted ? (
        <IdentityVerificationScreen onSubmitted={markKycSubmitted} onSkip={markKycSubmitted} />
      ) : role === 'landlord' ? (
        <LandlordStackNavigator />
      ) : (
        <MainTabs ProfileScreenComponent={ProfileScreenContainer} />
      )}
    </NavigationContainer>
  );
}
