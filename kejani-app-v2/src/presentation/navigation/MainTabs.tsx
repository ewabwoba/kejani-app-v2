import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DiscoverScreen } from '../screens/Home/DiscoverScreen';
import { ListingDetailScreen } from '../screens/Listing/ListingDetailScreen';
import { ConfirmBookingScreen } from '../screens/Booking/ConfirmBookingScreen';
import { SavedListingsScreen } from '../screens/Saved/SavedListingsScreen';
import { EnquiriesListScreen } from '../screens/Enquiries/EnquiriesListScreen';
import { ChatScreen } from '../screens/Enquiries/ChatScreen';
import { color, font } from '../../core/theme/tokens';
import type { Conversation, ChatMessage } from '../../domain/entities/Conversation';

/* ---------- Home stack: Discover -> ListingDetail -> ConfirmBooking ---------- */
export type HomeStackParamList = {
  Discover: undefined;
  ListingDetail: { listingId: string };
  ConfirmBooking: { listingId: string };
};
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Discover" component={DiscoverScreen} />
      <HomeStack.Screen name="ListingDetail" component={ListingDetailScreen} options={{ headerShown: true, title: '' }} />
      <HomeStack.Screen name="ConfirmBooking" component={ConfirmBookingScreen} options={{ headerShown: true, title: 'Confirm booking' }} />
    </HomeStack.Navigator>
  );
}

/* ---------- Saved stack: Saved -> (reuses) ListingDetail ---------- */
export type SavedStackParamList = {
  Saved: undefined;
  SavedListingDetail: { listingId: string };
};
const SavedStack = createNativeStackNavigator<SavedStackParamList>();
function SavedStackNavigator() {
  return (
    <SavedStack.Navigator screenOptions={{ headerShown: false }}>
      <SavedStack.Screen name="Saved" component={SavedListingsScreen} />
      <SavedStack.Screen
        name="SavedListingDetail"
        component={ListingDetailScreen as any}
        options={{ headerShown: true, title: '' }}
      />
    </SavedStack.Navigator>
  );
}

/* ---------- Enquiries stack: list -> chat ---------- */
export type EnquiriesStackParamList = {
  EnquiriesList: { conversations?: Conversation[] } | undefined;
  Chat: { conversation: Conversation; initialMessages?: ChatMessage[] };
};
const EnquiriesStack = createNativeStackNavigator<EnquiriesStackParamList>();
function EnquiriesStackNavigator() {
  return (
    <EnquiriesStack.Navigator screenOptions={{ headerShown: false }}>
      <EnquiriesStack.Screen name="EnquiriesList" component={EnquiriesListScreen} />
      <EnquiriesStack.Screen name="Chat" component={ChatScreen} options={{ headerShown: true, title: '' }} />
    </EnquiriesStack.Navigator>
  );
}

/* ---------- Bottom tabs ---------- */
export type MainTabParamList = {
  HomeTab: undefined;
  SavedTab: undefined;
  EnquiriesTab: undefined;
  ProfileTab: undefined;
};
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICON: Record<keyof MainTabParamList, string> = {
  HomeTab: '⌂',
  SavedTab: '♡',
  EnquiriesTab: '⌗',
  ProfileTab: '☺',
};

export function MainTabs({ ProfileScreenComponent }: { ProfileScreenComponent: React.ComponentType }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: color.msitu700,
        tabBarInactiveTintColor: color.inkMuted,
        tabBarLabelStyle: { fontFamily: font.body, fontSize: 11 },
        tabBarIcon: () => <Text style={{ fontSize: 16 }}>{TAB_ICON[route.name as keyof MainTabParamList]}</Text>,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="SavedTab" component={SavedStackNavigator} options={{ title: 'Saved' }} />
      <Tab.Screen name="EnquiriesTab" component={EnquiriesStackNavigator} options={{ title: 'Enquiries' }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreenComponent} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
