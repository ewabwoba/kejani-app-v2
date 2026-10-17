import React from 'react';
import { useAuthStore } from '../../state/useAuthStore';
import { ProfileScreen } from './ProfileScreen';

export function ProfileScreenContainer() {
  const { name, role, logout, setRole } = useAuthStore();
  return (
    <ProfileScreen
      user={{ name: name || 'Guest', role, location: 'Nairobi, KE' }}
      onLogout={logout}
      onSwitchToLandlord={role === 'tenant' ? () => setRole('landlord') : undefined}
    />
  );
}
