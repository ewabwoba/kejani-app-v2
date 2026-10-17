import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Listing } from '../../../domain/entities/Listing';
import { ListingRepositoryImpl } from '../../../data/repositories/ListingRepositoryImpl';
import { getSavedListingIds, toggleSavedListingId } from '../../../data/local/savedListingsStore';
import { ListingCard } from '../../components/ListingCard';
import { color, font, spacing } from '../../../core/theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SavedStackParamList } from '../../navigation/MainTabs';

const repo = new ListingRepositoryImpl();

type Props = NativeStackScreenProps<SavedStackParamList, 'Saved'>;

export function SavedListingsScreen({ navigation }: Props) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const load = useCallback(async () => {
    const ids = await getSavedListingIds();
    setSavedIds(ids);
    const results = await Promise.all(ids.map((id) => repo.getById(id)));
    setListings(results.filter((l): l is Listing => l !== null));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  async function handleUnsave(id: string) {
    const next = await toggleSavedListingId(id);
    setSavedIds(next);
    setListings((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Saved listings</Text>
      <Text style={styles.subtitle}>
        You have {listings.length} {listings.length === 1 ? 'property' : 'properties'} bookmarked.
      </Text>
      <FlatList
        data={listings}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ paddingBottom: spacing(6) }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptyBody}>Tap the heart on any listing to keep it here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            saved={savedIds.includes(item.id)}
            onToggleSave={() => handleUnsave(item.id)}
            onPress={() => navigation.navigate('SavedListingDetail', { listingId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.parchment, paddingHorizontal: spacing(4) },
  title: { fontFamily: font.display, fontSize: 20, color: color.ink, marginTop: spacing(3) },
  subtitle: { fontFamily: font.body, fontSize: 12, color: color.inkMuted, marginBottom: spacing(3) },
  empty: { alignItems: 'center', marginTop: spacing(10) },
  emptyTitle: { fontFamily: font.bodyMedium, fontSize: 14, color: color.ink, marginBottom: 4 },
  emptyBody: { fontFamily: font.body, fontSize: 12, color: color.inkMuted },
});
