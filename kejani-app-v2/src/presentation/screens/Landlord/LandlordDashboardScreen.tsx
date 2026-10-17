import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Switch, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Listing } from '../../../domain/entities/Listing';
import { ListingRepositoryImpl } from '../../../data/repositories/ListingRepositoryImpl';
import { color, font, radius, spacing } from '../../../core/theme/tokens';
import { trackEvent } from '../../hooks/useAnalytics';

const repo = new ListingRepositoryImpl();

interface WeeklyStats {
  views: number;
  calls: number;
  byDay: { day: string; count: number }[];
}

export function LandlordDashboardScreen({ landlordId, onAddListing }: { landlordId: string; onAddListing: () => void }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<WeeklyStats | null>(null);

  useEffect(() => {
    // Real implementation calls GET /api/landlords/{id}/listings and
    // GET /api/landlords/{id}/stats/weekly — mocked shape shown here so
    // the screen renders standalone during development.
    repo.search({}).then(setListings);
    setStats({
      views: 1200,
      calls: 34,
      byDay: [
        { day: 'Mon', count: 60 }, { day: 'Tue', count: 72 }, { day: 'Wed', count: 95 },
        { day: 'Thu', count: 68 }, { day: 'Fri', count: 110 }, { day: 'Sat', count: 50 }, { day: 'Sun', count: 40 },
      ],
    });
  }, [landlordId]);

  const activeCount = listings.length;
  const vacantCount = listings.filter((l) => l.availability === 'available').length;
  const maxDay = stats ? Math.max(...stats.byDay.map((d) => d.count)) : 1;

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>My listings</Text>
      <Text style={styles.subtitle}>Manage your property vacancies.</Text>

      <View style={styles.statsGrid}>
        <StatCard label="Active listings" value={String(activeCount)} />
        <StatCard label="Vacant units" value={String(vacantCount)} accent />
        <StatCard label="Views this week" value={stats ? stats.views.toLocaleString() : '—'} />
        <StatCard label="Calls this week" value={stats ? String(stats.calls) : '—'} />
      </View>

      {stats && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Performance this week</Text>
          <View style={styles.barRow}>
            {stats.byDay.map((d) => (
              <View key={d.day} style={styles.barColumn}>
                <View style={[styles.bar, { height: 12 + (d.count / maxDay) * 60 }]} />
                <Text style={styles.barLabel}>{d.day}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <Text style={styles.sectionLabel}>Property management</Text>
      <FlatList
        data={listings}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ paddingBottom: spacing(8) }}
        renderItem={({ item }) => (
          <View style={styles.propertyRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.propertyTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.propertyMeta}>Ksh {item.rentKsh.toLocaleString()}/mo</Text>
            </View>
            <Switch
              value={item.availability === 'available'}
              onValueChange={() => trackEvent('landlord_toggle_availability', { listingId: item.id })}
              trackColor={{ true: color.msitu700, false: color.border }}
            />
          </View>
        )}
      />

      <Pressable style={styles.fab} onPress={onAddListing} accessibilityLabel="Add new listing">
        <Text style={styles.fabPlus}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, accent && { color: color.sisal600 }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.parchment, padding: spacing(4) },
  title: { fontFamily: font.display, fontSize: 20, color: color.ink },
  subtitle: { fontFamily: font.body, fontSize: 12, color: color.inkMuted, marginBottom: spacing(3) },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: spacing(3) },
  statCard: { width: '47%', backgroundColor: color.white, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, padding: spacing(3) },
  statLabel: { fontFamily: font.body, fontSize: 11, color: color.inkMuted },
  statValue: { fontFamily: font.display, fontSize: 20, color: color.msitu700, marginTop: 2 },
  chartCard: { backgroundColor: color.white, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, padding: spacing(3), marginBottom: spacing(4) },
  chartTitle: { fontFamily: font.bodyMedium, fontSize: 13, color: color.ink, marginBottom: spacing(2) },
  barRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 90 },
  barColumn: { alignItems: 'center', gap: 4 },
  bar: { width: 18, backgroundColor: color.msitu500, borderRadius: 4 },
  barLabel: { fontFamily: font.body, fontSize: 10, color: color.inkMuted },
  sectionLabel: { fontFamily: font.bodyMedium, fontSize: 13, color: color.ink, marginBottom: spacing(2) },
  propertyRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: color.white, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, padding: spacing(3), marginBottom: spacing(2) },
  propertyTitle: { fontFamily: font.bodyMedium, fontSize: 14, color: color.ink },
  propertyMeta: { fontFamily: font.data, fontSize: 12, color: color.msitu700, marginTop: 2 },
  fab: { position: 'absolute', right: spacing(4), bottom: spacing(6), width: 52, height: 52, borderRadius: radius.pill, backgroundColor: color.msitu700, alignItems: 'center', justifyContent: 'center' },
  fabPlus: { color: color.white, fontSize: 26, marginTop: -2 },
});
