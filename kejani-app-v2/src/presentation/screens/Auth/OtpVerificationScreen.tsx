import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { color, font, radius, spacing } from '../../../core/theme/tokens';
import { trackEvent } from '../../hooks/useAnalytics';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerification'>;

export function OtpVerificationScreen({ route }: Props) {
  const { phone } = route.params;
  const [digits, setDigits] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<Array<TextInput | null>>([]);

  function handleChange(value: string, index: number) {
    const next = [...digits];
    next[index] = value.replace(/\D/g, '').slice(-1);
    setDigits(next);
    if (value && index < 3) inputs.current[index + 1]?.focus();
  }

  async function handleVerify() {
    setLoading(true);
    setError(null);
    trackEvent('auth_otp_verify_tapped');
    // Real implementation calls POST /api/auth/otp/verify here, then
    // routes to Onboarding (new user) or MainTabs (returning user).
    setTimeout(() => {
      setLoading(false);
      if (digits.join('').length < 4) setError("That code doesn't look right. Try again.");
    }, 600);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Enter the code</Text>
      <Text style={styles.subtitle}>We sent a 4-digit code to {phone}</Text>

      <View style={styles.digitRow}>
        {digits.map((d, i) => (
          <TextInput
            key={i}
            ref={(r) => (inputs.current[i] = r)}
            value={d}
            onChangeText={(v) => handleChange(v, i)}
            keyboardType="number-pad"
            maxLength={1}
            style={styles.digitBox}
          />
        ))}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}

      <AppButton label="Verify" onPress={handleVerify} loading={loading} disabled={digits.join('').length < 4} />
      <Text style={styles.resend}>Didn't get a code? Resend</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.parchment, padding: spacing(6), justifyContent: 'center' },
  title: { fontFamily: font.display, fontSize: 20, color: color.ink, marginBottom: 4 },
  subtitle: { fontFamily: font.body, fontSize: 13, color: color.inkMuted, marginBottom: spacing(5) },
  digitRow: { flexDirection: 'row', gap: 12, marginBottom: spacing(4) },
  digitBox: {
    width: 52, height: 56, borderWidth: 1, borderColor: color.border, borderRadius: radius.md,
    textAlign: 'center', fontFamily: font.display, fontSize: 20, color: color.ink, backgroundColor: color.white,
  },
  error: { color: color.alert, fontFamily: font.body, fontSize: 12, marginBottom: spacing(3) },
  resend: { textAlign: 'center', color: color.sisal600, fontFamily: font.bodyMedium, fontSize: 13, marginTop: spacing(4) },
});
