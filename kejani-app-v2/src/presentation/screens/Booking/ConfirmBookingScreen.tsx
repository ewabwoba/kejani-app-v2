import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Listing } from '../../../domain/entities/Listing';
import { ListingRepositoryImpl } from '../../../data/repositories/ListingRepositoryImpl';
import { BookingRepositoryImpl } from '../../../data/repositories/BookingRepositoryImpl';
import { AppButton } from '../../components/AppButton';
import { color, font, radius, spacing } from '../../../core/theme/tokens';
import { trackEvent } from '../../hooks/useAnalytics';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/MainTabs';

const listingRepo = new ListingRepositoryImpl();
const bookingRepo = new BookingRepositoryImpl();
const PLATFORM_FEE_KSH = 30;

type Props = NativeStackScreenProps<HomeStackParamList, 'ConfirmBooking'>;

export function ConfirmBookingScreen({ route }: Props) {
  const { listingId } = route.params;
  const [listing, setListing] = useState<Listing | null>(null);
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    listingRepo.getById(listingId).then(setListing);
  }, [listingId]);

  if (!listing) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator color={color.msitu700} />
      </SafeAreaView>
    );
  }

  const holdingDeposit = Math.min(listing.depositKsh, 2000); // small holding deposit, not full deposit
  const total = holdingDeposit + PLATFORM_FEE_KSH;

  async function handlePay() {
    setStatus('sending');
    trackEvent('booking_mpesa_stk_requested', { listingId: listing!.id });
    try {
      const appointment = await bookingRepo.createAppointment({
        listingId: listing!.id,
        preferredDate: new Date().toISOString().slice(0, 10),
        preferredTime: '11:00',
      });
      await bookingRepo.initiateEscrowPayment({
        appointmentId: appointment.id,
        mpesaPhoneNumber: `+254${phone}`,
        amountKsh: total,
      });
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.summaryCard}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.location}>{listing.estate}, {listing.county}</Text>
      </View>

      <View style={styles.paymentCard}>
        <Text style={styles.sectionTitle}>Payment details</Text>
        <Row label="Holding deposit" value={`Ksh ${holdingDeposit.toLocaleString()}`} />
        <Row label="Platform fee" value={`Ksh ${PLATFORM_FEE_KSH}`} />
        <View style={styles.divider} />
        <Row label="Total amount" value={`Ksh ${total.toLocaleString()}`} bold />
      </View>

      <View style={styles.mpesaCard}>
        <Text style={styles.mpesaTitle}>Lipa na M-Pesa</Text>
        <Text style={styles.mpesaHint}>Instant STK push confirmation</Text>
        <Text style={styles.label}>M-Pesa phone number</Text>
        <View style={styles.phoneRow}>
          <Text style={styles.prefix}>+254</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="712 345 678"
            placeholderTextColor={color.inkMuted}
            style={styles.phoneInput}
            maxLength={10}
          />
        </View>
        <Text style={styles.hint}>You'll get a prompt on this phone to enter your M-Pesa PIN.</Text>

        {status === 'sent' ? (
          <View style={styles.sentBanner}>
            <Text style={styles.sentText}>Check your phone to complete payment.</Text>
          </View>
        ) : (
          <AppButton
            label="Pay with M-Pesa"
            onPress={handlePay}
            loading={status === 'sending'}
            disabled={phone.replace(/\D/g, '').length < 9}
          />
        )}
        {status === 'error' && (
          <Text style={styles.error}>Couldn't reach M-Pesa right now. Try again.</Text>
        )}
      </View>

      <View style={styles.escrowNotice}>
        <Text style={styles.escrowTitle}>Secure booking with escrow</Text>
        <Text style={styles.escrowBody}>
          Your deposit is held securely by Kejani. Funds only reach the landlord after you move in,
          with a 14-day refund window if the property doesn't match the listing.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, bold && styles.rowValueBold]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.parchment, padding: spacing(4) },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  summaryCard: { backgroundColor: color.white, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, padding: spacing(3), marginBottom: spacing(3) },
  title: { fontFamily: font.bodyMedium, fontSize: 15, color: color.ink },
  location: { fontFamily: font.body, fontSize: 12, color: color.inkMuted, marginTop: 2 },
  paymentCard: { backgroundColor: color.white, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, padding: spacing(3), marginBottom: spacing(3) },
  sectionTitle: { fontFamily: font.bodyMedium, fontSize: 13, color: color.ink, marginBottom: spacing(2) },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing(1) },
  rowLabel: { fontFamily: font.body, fontSize: 13, color: color.inkMuted },
  rowValue: { fontFamily: font.data, fontSize: 13, color: color.ink },
  rowValueBold: { fontFamily: font.bodyMedium, fontSize: 15, color: color.msitu700 },
  divider: { height: 1, backgroundColor: color.border, marginVertical: spacing(2) },
  mpesaCard: { backgroundColor: color.white, borderRadius: radius.md, borderWidth: 1, borderColor: color.border, padding: spacing(3), marginBottom: spacing(3) },
  mpesaTitle: { fontFamily: font.bodyMedium, fontSize: 14, color: color.ink },
  mpesaHint: { fontFamily: font.body, fontSize: 11, color: color.inkMuted, marginBottom: spacing(3) },
  label: { fontFamily: font.bodyMedium, fontSize: 11, color: color.inkMuted, marginBottom: 4 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: color.border, borderRadius: radius.sm, paddingHorizontal: 12, marginBottom: 4 },
  prefix: { fontFamily: font.bodyMedium, fontSize: 14, color: color.ink, marginRight: 6 },
  phoneInput: { flex: 1, height: 44, fontFamily: font.body, fontSize: 14, color: color.ink },
  hint: { fontFamily: font.body, fontSize: 11, color: color.inkMuted, marginBottom: spacing(3) },
  sentBanner: { backgroundColor: color.msitu100, borderRadius: radius.sm, padding: spacing(3), alignItems: 'center' },
  sentText: { fontFamily: font.bodyMedium, fontSize: 13, color: color.msitu700 },
  error: { fontFamily: font.body, fontSize: 12, color: color.alert, marginTop: spacing(2) },
  escrowNotice: { backgroundColor: color.msitu100, borderRadius: radius.md, padding: spacing(3) },
  escrowTitle: { fontFamily: font.bodyMedium, fontSize: 13, color: color.msitu700, marginBottom: 4 },
  escrowBody: { fontFamily: font.body, fontSize: 12, color: color.msitu700, lineHeight: 17 },
});
