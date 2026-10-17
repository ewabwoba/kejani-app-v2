import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { color, font, radius } from '../../core/theme/tokens';

export function VerifiedBadge({ compact = false }: { compact?: boolean }) {
  return (
    <View style={[styles.pill, compact && styles.compact]} accessibilityLabel="Verified landlord">
      <Text style={styles.text}>{compact ? '✓' : '✓ Verified landlord'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    backgroundColor: color.msitu700,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  compact: { paddingHorizontal: 6, paddingVertical: 2 },
  text: { color: color.msitu100, fontFamily: font.bodyMedium, fontSize: 11 },
});
