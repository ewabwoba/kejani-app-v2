import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { color, font, radius, spacing } from '../../../core/theme/tokens';

interface UserProfile {
  name: string;
  role: 'tenant' | 'landlord' | 'agent';
  location: string;
  avatarUrl?: string;
}

const MENU_ITEMS = [
  { key: 'saved', label: 'My saved listings' },
  { key: 'enquiries', label: 'My enquiries' },
  { key: 'payments', label: 'Payment history', sublabel: 'M-Pesa, bank statements' },
] as const;

export function ProfileScreen({ user, onLogout, onSwitchToLandlord }: {
  user: UserProfile;
  onLogout: () => void;
  onSwitchToLandlord?: () => void;
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>{user.name.charAt(0)}</Text>
          </View>
        )}
        <Text style={styles.name}>{user.name}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user.role} · {user.location}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Manage account</Text>
      <View style={styles.card}>
        {MENU_ITEMS.map((item, i) => (
          <View key={item.key} style={[styles.menuRow, i < MENU_ITEMS.length - 1 && styles.menuRowBorder]}>
            <View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {'sublabel' in item && <Text style={styles.menuSublabel}>{item.sublabel}</Text>}
            </View>
            <Text style={styles.chevron}>›</Text>
          </View>
        ))}
      </View>

      {onSwitchToLandlord && (
        <Pressable style={styles.switchRow} onPress={onSwitchToLandlord}>
          <Text style={styles.switchText}>Switch to landlord dashboard</Text>
        </Pressable>
      )}

      <Pressable style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
      <Text style={styles.version}>Kejani v2.0.0</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.parchment, padding: spacing(4) },
  header: { alignItems: 'center', marginBottom: spacing(5) },
  avatar: { width: 88, height: 88, borderRadius: radius.pill, marginBottom: spacing(2) },
  avatarPlaceholder: { backgroundColor: color.msitu700, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: color.white, fontFamily: font.display, fontSize: 28 },
  name: { fontFamily: font.display, fontSize: 18, color: color.ink },
  roleBadge: { backgroundColor: color.msitu100, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4, marginTop: 6 },
  roleText: { fontFamily: font.bodyMedium, fontSize: 12, color: color.msitu700, textTransform: 'capitalize' },
  sectionLabel: { fontFamily: font.bodyMedium, fontSize: 12, color: color.udongo700, marginBottom: spacing(2) },
  card: { backgroundColor: color.white, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, marginBottom: spacing(4) },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing(3) },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: color.border },
  menuLabel: { fontFamily: font.bodyMedium, fontSize: 14, color: color.ink },
  menuSublabel: { fontFamily: font.body, fontSize: 11, color: color.inkMuted, marginTop: 2 },
  chevron: { fontSize: 18, color: color.inkMuted },
  switchRow: { alignItems: 'center', paddingVertical: spacing(3), marginBottom: spacing(2) },
  switchText: { fontFamily: font.bodyMedium, fontSize: 13, color: color.sisal600 },
  logoutButton: { borderWidth: 1, borderColor: color.ink, borderRadius: radius.md, height: 48, alignItems: 'center', justifyContent: 'center' },
  logoutText: { fontFamily: font.bodyMedium, fontSize: 14, color: color.ink },
  version: { textAlign: 'center', fontFamily: font.body, fontSize: 11, color: color.inkMuted, marginTop: spacing(4) },
});
