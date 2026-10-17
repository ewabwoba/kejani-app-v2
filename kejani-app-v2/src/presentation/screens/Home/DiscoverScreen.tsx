import React from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, SafeAreaView, Pressable, ActivityIndicator } from 'react-native';
import { useDiscoverViewModel } from './useDiscoverViewModel';
import { ListingCard } from '../../components/ListingCard';
import { color, font, radius, spacing } from '../../../core/theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/MainTabs';

type Props = NativeStackScreenProps<HomeStackParamList, 'Discover'>;

const TYPE_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'single_room', label: 'Single room' },
  { key: 'bedsitter', label: 'Bedsitter' },
  { key: 'one_bedroom', label: '1 bedroom' },
] as const;

export function DiscoverScreen({ navigation }: Props) {
  const vm = useDiscoverViewModel();

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.brand}>Kejani</Text>

      <View style={styles.searchBar}>
        <TextInput
          value={vm.query}
          onChangeText={vm.setQuery}
          onSubmitEditing={vm.reload}
          placeholder="Search estate, ward or street"
          placeholderTextColor={color.inkMuted}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={vm.radiusPresets}
        keyExtractor={(r) => String(r)}
        style={styles.radiusRow}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => vm.setRadiusKm(item)}
            style={[styles.chip, vm.radiusKm === item && styles.chipActive]}
          >
            <Text style={[styles.chipText, vm.radiusKm === item && styles.chipTextActive]}>
              {item === 999 ? 'All Kenya' : `${item} km`}
            </Text>
          </Pressable>
        )}
      />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={TYPE_FILTERS}
        keyExtractor={(f) => f.key}
        style={styles.typeRow}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => vm.setPropertyType(item.key as any)}
            style={[styles.typeChip, vm.propertyType === item.key && styles.typeChipActive]}
          >
            <Text style={[styles.typeChipText, vm.propertyType === item.key && styles.typeChipTextActive]}>
              {item.label}
            </Text>
          </Pressable>
        )}
      />

      {vm.locationNotice && <Text style={styles.notice}>{vm.locationNotice}</Text>}

      {vm.loading ? (
        <ActivityIndicator style={{ marginTop: spacing(8) }} color={color.msitu700} />
      ) : (
        <FlatList
          data={vm.listings}
          keyExtractor={(l) => l.id}
          contentContainerStyle={{ paddingBottom: spacing(6) }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No listings match yet</Text>
              <Text style={styles.emptyBody}>Try a wider radius or a different property type.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              saved={vm.savedIds.includes(item.id)}
              onToggleSave={() => vm.toggleSave(item.id)}
              onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.parchment, paddingHorizontal: spacing(4) },
  brand: { fontFamily: font.display, fontSize: 20, color: color.msitu700, marginTop: spacing(3), marginBottom: spacing(3) },
  searchBar: { backgroundColor: color.white, borderWidth: 1, borderColor: color.border, borderRadius: radius.md, paddingHorizontal: 12, marginBottom: spacing(3) },
  searchInput: { height: 44, fontFamily: font.body, fontSize: 14, color: color.ink },
  radiusRow: { flexGrow: 0, marginBottom: spacing(2) },
  chip: { borderWidth: 1, borderColor: color.border, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 7, marginRight: 8, backgroundColor: color.white },
  chipActive: { backgroundColor: color.msitu700, borderColor: color.msitu700 },
  chipText: { fontFamily: font.body, fontSize: 12, color: color.ink },
  chipTextActive: { color: color.white, fontFamily: font.bodyMedium },
  typeRow: { flexGrow: 0, marginBottom: spacing(3) },
  typeChip: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  typeChipActive: { backgroundColor: color.udongo100 },
  typeChipText: { fontFamily: font.body, fontSize: 12, color: color.inkMuted },
  typeChipTextActive: { color: color.udongo700, fontFamily: font.bodyMedium },
  notice: { fontFamily: font.body, fontSize: 11, color: color.inkMuted, marginBottom: spacing(2) },
  empty: { alignItems: 'center', marginTop: spacing(10) },
  emptyTitle: { fontFamily: font.bodyMedium, fontSize: 14, color: color.ink, marginBottom: 4 },
  emptyBody: { fontFamily: font.body, fontSize: 12, color: color.inkMuted },
});
