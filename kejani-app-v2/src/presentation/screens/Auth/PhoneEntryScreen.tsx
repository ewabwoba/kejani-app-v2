import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { AppButton } from '../../components/AppButton';
import { color, font, radius, spacing } from '../../../core/theme/tokens';
import { trackEvent } from '../../hooks/useAnalytics';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../navigation/AuthStack';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneEntry'>;

export function PhoneEntryScreen({ navigation }: Props) {
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = phone.replace(/\D/g, '').length >= 9;

  async function handleSendCode() {
    setLoading(true);
    trackEvent('auth_send_code_tapped', { language });
    // Real implementation calls POST /api/auth/otp/send here.
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('OtpVerification', { phone: `+254${phone}` });
    }, 600);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.logoDot} />
        <Text style={styles.brand}>Kejani</Text>
        <Text style={styles.tagline}>Connecting Kenyan tenants, landlords and agents</Text>

        <Text style={styles.label}>Choose language</Text>
        <View style={styles.languageRow}>
          {(['en', 'sw'] as const).map((code) => (
            <View
              key={code}
              style={[styles.langOption, language === code && styles.langOptionActive]}
              onTouchEnd={() => setLanguage(code)}
            >
              <Text style={[styles.langText, language === code && styles.langTextActive]}>
                {code === 'en' ? 'English' : 'Kiswahili'}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.label}>Mobile number</Text>
        <View style={styles.phoneRow}>
          <Text style={styles.prefix}>+254</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="712 345 678"
            placeholderTextColor={color.inkMuted}
            keyboardType="phone-pad"
            style={styles.phoneInput}
            maxLength={10}
          />
        </View>
        <Text style={styles.hint}>We'll send a 4-digit code to verify your account.</Text>

        <AppButton label="Send code" onPress={handleSendCode} loading={loading} disabled={!canSubmit} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.parchment, justifyContent: 'center', padding: spacing(6) },
  card: { backgroundColor: color.white, borderRadius: radius.lg, padding: spacing(6), alignItems: 'center' },
  logoDot: { width: 56, height: 56, borderRadius: radius.lg, backgroundColor: color.msitu700, marginBottom: spacing(3) },
  brand: { fontFamily: font.display, fontSize: 22, color: color.msitu700 },
  tagline: { fontFamily: font.body, fontSize: 12, color: color.inkMuted, textAlign: 'center', marginTop: 4, marginBottom: spacing(5) },
  label: { alignSelf: 'flex-start', fontFamily: font.bodyMedium, fontSize: 11, color: color.inkMuted, marginBottom: spacing(1) },
  languageRow: { flexDirection: 'row', gap: 8, width: '100%', marginBottom: spacing(4) },
  langOption: { flex: 1, borderWidth: 1, borderColor: color.border, borderRadius: radius.sm, paddingVertical: 10, alignItems: 'center' },
  langOptionActive: { borderColor: color.msitu700, backgroundColor: color.msitu100 },
  langText: { fontFamily: font.body, fontSize: 13, color: color.ink },
  langTextActive: { color: color.msitu700, fontFamily: font.bodyMedium },
  phoneRow: { flexDirection: 'row', alignItems: 'center', width: '100%', borderWidth: 1, borderColor: color.border, borderRadius: radius.sm, paddingHorizontal: 12, marginBottom: spacing(1) },
  prefix: { fontFamily: font.bodyMedium, fontSize: 14, color: color.ink, marginRight: 6 },
  phoneInput: { flex: 1, height: 44, fontFamily: font.body, fontSize: 14, color: color.ink },
  hint: { alignSelf: 'flex-start', fontFamily: font.body, fontSize: 11, color: color.inkMuted, marginBottom: spacing(4) },
});
