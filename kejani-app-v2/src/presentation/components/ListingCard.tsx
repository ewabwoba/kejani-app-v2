import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Listing } from '../../domain/entities/Listing';
import { color, font, radius, spacing } from '../../core/theme/tokens';
import { VerifiedBadge } from './VerifiedBadge';

interface Props {
  listing: Listing;
  onPress: () => void;
  onToggleSave?: () => void;
  saved?: boolean;
}

export function ListingCard({ listing, onPress, onToggleSave, saved }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.card} accessibilityRole="button">
      <View style={styles.imageWrap}>
        {listing.photos[0] ? (
          <Image source={{ uri: listing.photos[0] }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]} />
        )}
        <View style={styles.badgeRow}>
          {listing.landlord.verified && <VerifiedBadge />}
          {listing.isBoosted && (
            <View style={styles.boostPill}>
              <Text style={styles.boostText}>Featured</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>
          <Text style={styles.price}>Ksh {listing.rentKsh.toLocaleString()}</Text>
        </View>
        <Text style={styles.subtitle} numberOfLines={1}>
          {listing.estate}
          {typeof listing.distanceFromUserKm === 'number'
            ? ` · ${listing.distanceFromUserKm.toFixed(1)} km away`
            : ''}
        </Text>

        <View style={styles.actionRow}>
          <Pressable style={styles.callButton} accessibilityLabel="Call agent">
            <Text style={styles.callText}>Call agent</Text>
          </Pressable>
          {onToggleSave && (
            <Pressable
              onPress={onToggleSave}
              style={styles.saveButton}
              accessibilityLabel={saved ? 'Remove from saved' : 'Save listing'}
            >
              <Text style={{ color: saved ? color.sisal600 : color.udongo400, fontSize: 16 }}>
                {saved ? '♥' : '♡'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.border,
    overflow: 'hidden',
    marginBottom: spacing(3),
  },
  imageWrap: { height: 140, backgroundColor: color.udongo100 },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  badgeRow: { position: 'absolute', top: spacing(2), left: spacing(2), flexDirection: 'row', gap: 6 },
  boostPill: {
    backgroundColor: color.boost,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  boostText: { color: color.udongo100, fontFamily: font.bodyMedium, fontSize: 11 },
  body: { padding: spacing(3) },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 },
  title: { ...type_title() },
  price: { fontFamily: font.data, fontSize: 15, color: color.msitu700, fontWeight: '700' as const },
  subtitle: { fontFamily: font.body, fontSize: 12, color: color.inkMuted, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: spacing(2) },
  callButton: {
    flex: 1,
    backgroundColor: color.msitu700,
    borderRadius: radius.sm,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callText: { color: color.white, fontFamily: font.bodyMedium, fontSize: 13 },
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function type_title() {
  return { fontFamily: font.bodyMedium, fontSize: 14, color: color.ink, flexShrink: 1 };
}
