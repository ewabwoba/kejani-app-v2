import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Listing } from '../../../domain/entities/Listing';
import { ListingRepositoryImpl } from '../../../data/repositories/ListingRepositoryImpl';
import { AppButton } from '../../components/AppButton';
import { VerifiedBadge } from '../../components/VerifiedBadge';
import { color, font, radius, spacing } from '../../../core/theme/tokens';
import { trackEvent } from '../../hooks/useAnalytics';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/MainTabs';

const repo = new ListingRepositoryImpl();

type Props = NativeStackScreenProps<HomeStackParamList, 'ListingDetail'>;

export function ListingDetailScreen({ route, navigation }: Props) {
  const { listingId } = route.params;
  const [listing, setListing] = useState<Listing | null>(null);

  useEffect(() => {
    repo.getById(listingId).then(setListing);
    trackEvent('listing_detail_viewed', { listingId });
  }, [listingId]);

  if (!listing) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator color={color.msitu700} />
      </SafeAreaView>
    );
  }

  const facts = [
    { label: 'Deposit', value: `Ksh ${listing.depositKsh.toLocaleString()}` },
    { label: 'Service charge', value: `Ksh ${listing.serviceChargeKsh.toLocaleString()}` },
    { label: 'Available slots', value: String(listing.availableSlots) },
    { label: 'Rating', value: `${listing.rating.toFixed(1)} / 5` },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView>
        {listing.photos[0] ? (
          <Image source={{ uri: listing.photos[0] }} style={styles.hero} />
        ) : (
          <View style={[styles.hero, { backgroundColor: color.udongo100 }]} />
        )}

        <View style={styles.body}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.location}>{listing.estate}, {listing.county}</Text>
          <Text style={styles.price}>Ksh {listing.rentKsh.toLocaleString()}/month</Text>

          <View style={styles.factsGrid}>
            {facts.map((f) => (
              <View style={styles.factCard} key={f.label}>
                <Text style={styles.factLabel}>{f.label}</Text>
                <Text style={styles.factValue}>{f.value}</Text>
              </View>
            ))}
          </View>

          {listing.landlord.verified && (
            <View style={{ marginBottom: spacing(3) }}>
              <VerifiedBadge />
            </View>
          )}

          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenityRow}>
            {listing.amenities.map((a) => (
              <View style={styles.amenityPill} key={a}>
                <Text style={styles.amenityText}>{a.replace(/_/g, ' ')}</Text>
              </View>
            ))}
          </View>

          <View style={styles.safetyCard}>
            <Text style={styles.safetyTitle}>Safety first</Text>
            <Text style={styles.safetyBody}>
              The exact location is revealed once the property manager confirms your viewing request.
            </Text>
          </View>
          <View style={styles.locationHidden}>
            <Text style={styles.locationHiddenText}>Location hidden until viewing is confirmed</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          label="Request viewing"
          variant="secondary"
          onPress={() => navigation.navigate('ConfirmBooking', { listingId: listing.id })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.parchment },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  hero: { width: '100%', height: 240 },
  body: { padding: spacing(4) },
  title: { fontFamily: font.display, fontSize: 20, color: color.ink },
  location: { fontFamily: font.body, fontSize: 13, color: color.inkMuted, marginTop: 2 },
  price: { fontFamily: font.data, fontSize: 18, color: color.msitu700, marginTop: 6, marginBottom: spacing(3) },
  factsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: spacing(3) },
  factCard: { width: '47%', backgroundColor: color.white, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, padding: spacing(3) },
  factLabel: { fontFamily: font.body, fontSize: 11, color: color.inkMuted },
  factValue: { fontFamily: font.bodyMedium, fontSize: 15, color: color.ink, marginTop: 2 },
  sectionTitle: { fontFamily: font.bodyMedium, fontSize: 14, color: color.ink, marginBottom: spacing(2) },
  amenityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing(4) },
  amenityPill: { backgroundColor: color.udongo100, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  amenityText: { fontFamily: font.body, fontSize: 12, color: color.udongo700 },
  safetyCard: { backgroundColor: color.msitu100, borderRadius: radius.md, padding: spacing(3), marginBottom: spacing(2) },
  safetyTitle: { fontFamily: font.bodyMedium, fontSize: 13, color: color.msitu700, marginBottom: 2 },
  safetyBody: { fontFamily: font.body, fontSize: 12, color: color.msitu700, lineHeight: 17 },
  locationHidden: { backgroundColor: color.udongo100, borderRadius: radius.md, height: 100, alignItems: 'center', justifyContent: 'center' },
  locationHiddenText: { fontFamily: font.body, fontSize: 12, color: color.udongo700 },
  footer: { padding: spacing(4), borderTopWidth: 1, borderTopColor: color.border, backgroundColor: color.parchment },
});
