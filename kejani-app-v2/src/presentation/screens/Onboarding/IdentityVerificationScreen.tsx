import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { color, font, radius, spacing } from '../../../core/theme/tokens';
import { trackEvent } from '../../hooks/useAnalytics';

type DocType = 'national_id' | 'business_permit';

export function IdentityVerificationScreen({ onSubmitted, onSkip }: { onSubmitted: () => void; onSkip: () => void }) {
  const [docType, setDocType] = useState<DocType>('national_id');
  const [photoAttached, setPhotoAttached] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    trackEvent('kyc_submit_tapped', { docType });
    // Real implementation uploads the photo to /api/kyc/submit, which puts
    // it in the moderation queue seen on the Admin dashboard.
    setTimeout(() => {
      setSubmitting(false);
      onSubmitted();
    }, 800);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>
      <Text style={styles.step}>Step 1 of 2: Identity document</Text>

      <Text style={styles.title}>Verify your identity</Text>
      <Text style={styles.body}>
        As a landlord on Kejani, we verify credentials to keep the marketplace safe for everyone.
      </Text>

      <View style={styles.docRow}>
        {(['national_id', 'business_permit'] as DocType[]).map((t) => (
          <Pressable
            key={t}
            onPress={() => setDocType(t)}
            style={[styles.docOption, docType === t && styles.docOptionActive]}
          >
            <Text style={[styles.docText, docType === t && styles.docTextActive]}>
              {t === 'national_id' ? 'National ID' : 'Business permit'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.uploadZone} onPress={() => setPhotoAttached(true)}>
        <Text style={styles.uploadTitle}>{photoAttached ? 'Photo attached' : 'Position your ID here'}</Text>
        <Text style={styles.uploadHint}>Make sure all details are clearly visible with no glare.</Text>
        <View style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>{photoAttached ? 'Retake photo' : 'Upload photo'}</Text>
        </View>
      </Pressable>

      <View style={styles.noticeCard}>
        <Text style={styles.noticeTitle}>Manual review within 24h</Text>
        <Text style={styles.noticeBody}>
          Our team personally checks every document to maintain Kenya's most trusted landlord database.
        </Text>
      </View>

      <AppButton label="Submit for verification" onPress={handleSubmit} loading={submitting} disabled={!photoAttached} />
      <Pressable onPress={onSkip} style={{ marginTop: spacing(2) }}>
        <Text style={styles.skip}>I'll do this later</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.parchment, padding: spacing(5) },
  progressTrack: { height: 4, backgroundColor: color.border, borderRadius: 2, marginTop: spacing(2) },
  progressFill: { width: '50%', height: 4, backgroundColor: color.msitu700, borderRadius: 2 },
  step: { fontFamily: font.bodyMedium, fontSize: 11, color: color.msitu700, marginTop: spacing(2), marginBottom: spacing(4) },
  title: { fontFamily: font.display, fontSize: 20, color: color.ink, marginBottom: 6 },
  body: { fontFamily: font.body, fontSize: 13, color: color.inkMuted, marginBottom: spacing(4), lineHeight: 19 },
  docRow: { flexDirection: 'row', gap: 10, marginBottom: spacing(4) },
  docOption: { flex: 1, borderWidth: 1, borderColor: color.border, borderRadius: radius.md, padding: spacing(4), alignItems: 'center', backgroundColor: color.white },
  docOptionActive: { borderColor: color.msitu700, borderWidth: 2 },
  docText: { fontFamily: font.body, fontSize: 13, color: color.ink },
  docTextActive: { fontFamily: font.bodyMedium, color: color.msitu700 },
  uploadZone: { borderWidth: 1, borderColor: color.border, borderStyle: 'dashed', borderRadius: radius.lg, padding: spacing(6), alignItems: 'center', marginBottom: spacing(4) },
  uploadTitle: { fontFamily: font.bodyMedium, fontSize: 14, color: color.ink, marginBottom: 4 },
  uploadHint: { fontFamily: font.body, fontSize: 11, color: color.inkMuted, textAlign: 'center', marginBottom: spacing(3) },
  uploadButton: { borderWidth: 1, borderColor: color.ink, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8 },
  uploadButtonText: { fontFamily: font.bodyMedium, fontSize: 12, color: color.ink },
  noticeCard: { flexDirection: 'column', backgroundColor: color.white, borderRadius: radius.md, padding: spacing(3), marginBottom: spacing(4) },
  noticeTitle: { fontFamily: font.bodyMedium, fontSize: 13, color: color.ink, marginBottom: 2 },
  noticeBody: { fontFamily: font.body, fontSize: 12, color: color.inkMuted, lineHeight: 17 },
  skip: { textAlign: 'center', fontFamily: font.body, fontSize: 13, color: color.inkMuted },
});
