import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Conversation } from '../../../domain/entities/Conversation';
import { VerifiedBadge } from '../../components/VerifiedBadge';
import { color, font, radius, spacing } from '../../../core/theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { EnquiriesStackParamList } from '../../navigation/MainTabs';

type Props = NativeStackScreenProps<EnquiriesStackParamList, 'EnquiriesList'>;

export function EnquiriesListScreen({ navigation, route }: Props) {
  const conversations: Conversation[] = route.params?.conversations ?? [];

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Enquiries</Text>
      <FlatList
        data={conversations}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingHorizontal: spacing(4) }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptyBody}>Message a landlord from any listing to start one.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              navigation.navigate('Chat', { conversation: item, initialMessages: item.lastMessage ? [item.lastMessage] : [] })
            }
          >
            <View style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{item.otherParty.name}</Text>
                {item.otherParty.verified && <VerifiedBadge compact />}
              </View>
              <Text style={styles.preview} numberOfLines={1}>
                {item.lastMessage?.text ?? item.listingTitle}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.parchment },
  title: { fontFamily: font.display, fontSize: 20, color: color.ink, padding: spacing(4), paddingBottom: spacing(2) },
  row: { flexDirection: 'row', gap: 12, paddingVertical: spacing(3), borderBottomWidth: 1, borderBottomColor: color.border },
  avatar: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: color.udongo100 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontFamily: font.bodyMedium, fontSize: 14, color: color.ink },
  preview: { fontFamily: font.body, fontSize: 12, color: color.inkMuted, marginTop: 2 },
  empty: { alignItems: 'center', marginTop: spacing(10) },
  emptyTitle: { fontFamily: font.bodyMedium, fontSize: 14, color: color.ink, marginBottom: 4 },
  emptyBody: { fontFamily: font.body, fontSize: 12, color: color.inkMuted },
});
