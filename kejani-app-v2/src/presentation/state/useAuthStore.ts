import { create } from 'zustand';
import { disconnectChatSocket } from '../../data/api/chatSocket';

export type UserRole = 'tenant' | 'landlord' | 'agent';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  role: UserRole;
  name: string;
  kycSubmitted: boolean;
  login: (userId: string, name: string, role: UserRole) => void;
  logout: () => void;
  markKycSubmitted: () => void;
  setRole: (role: UserRole) => void;
}

/**
 * Single source of truth for "who is logged in and as what." Screens read
 * this via the hook below rather than each holding their own copy —
 * that's what lets Profile's "switch to landlord dashboard" and the root
 * navigator's tab choice stay in sync automatically.
 */
export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userId: null,
  role: 'tenant',
  name: '',
  kycSubmitted: false,
  login: (userId, name, role) => set({ isAuthenticated: true, userId, name, role }),
  logout: () => {
    disconnectChatSocket();
    set({ isAuthenticated: false, userId: null, name: '', kycSubmitted: false });
  },
  markKycSubmitted: () => set({ kycSubmitted: true }),
  setRole: (role) => set({ role }),
}));
