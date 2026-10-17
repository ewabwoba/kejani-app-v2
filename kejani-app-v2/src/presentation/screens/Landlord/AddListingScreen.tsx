import React from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { useAddListingViewModel } from './useAddListingViewModel';
import { AppButton } from '../../components/AppButton';
import { PropertyType } from '../../../domain/entities/Listing';
import { color, font, radius, spacing } from '../../../core/theme/tokens';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { LandlordStackParamList } from '../../navigation/LandlordStack';

type Props = NativeStackScreenProps<LandlordStackParamList, 'AddListing'>;

const TYPE_OPTIONS: { key: PropertyType; label: string }[] = [
  { key: 'single_room', label: 'Single room' },
  { key: 'bedsitter', label: 'Bedsitter' },
  { key: 'one_bedroom', label: '1 bedroom' },
  { key: 'two_bedroom', label: '2 bedroom' },
  { key: 'commercial', label: 'Commercial' },
];

export function AddListingScreen({ navigation }: Props) {
  const vm = useAddListingViewModel(() => navigation.replace('LandlordDashboard'));

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={{ padding: spacing(4) }}>
        <Text style={styles.title}>List a new property</Text>
        <Text style={styles.subtitle}>Verified landlords get 3x more enquiries.</Text>

        <Field label="Title">
          <TextInput style={styles.input} value={vm.title} onChangeText={vm.setTitle} placeholder="e.g. Modern bedsitter, Kayole" placeholderTextColor={color.inkMuted} />
        </Field>

        <Field label="Property type">
          <View style={styles.chipRow}>
            {TYPE_OPTIONS.map((t) => (
              <Pressable key={t.key} onPress={() => vm.setPropertyType(t.key)} style={[styles.chip, vm.propertyType === t.key && styles.chipActive]}>
                <Text style={[styles.chipText, vm.propertyType === t.key && styles.chipTextActive]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <View style={styles.row2}>
          <Field label="Rent (Ksh/mo)" style={{ flex: 1 }}>
            <TextInput style={styles.input} value={vm.rentKsh} onChangeText={vm.setRentKsh} keyboardType="number-pad" placeholder="8500" placeholderTextColor={color.inkMuted} />
          </Field>
          <Field label="Deposit (Ksh)" style={{ flex: 1 }}>
            <TextInput style={styles.input} value={vm.depositKsh} onChangeText={vm.setDepositKsh} keyboardType="number-pad" placeholder="8500" placeholderTextColor={color.inkMuted} />
          </Field>
        </View>

        <Field label="Service charge (Ksh/mo, optional)">
          <TextInput style={styles.input} value={vm.serviceChargeKsh} onChangeText={vm.setServiceChargeKsh} keyboardType="number-pad" placeholderTextColor={color.inkMuted} />
        </Field>

        <View style={styles.row2}>
          <Field label="County" style={{ flex: 1 }}>
            <TextInput style={styles.input} value={vm.county} onChangeText={vm.setCounty} placeholder="Nairobi" placeholderTextColor={color.inkMuted} />
          </Field>
          <Field label="Estate / ward" style={{ flex: 1 }}>
            <TextInput style={styles.input} value={vm.estate} onChangeText={vm.setEstate} placeholder="Kayole" placeholderTextColor={color.inkMuted} />
          </Field>
        </View>

        <Field label="Nearest landmark (optional)">
          <TextInput style={styles.input} value={vm.nearestLandmark} onChangeText={vm.setNearestLandmark} placeholder="Near Kayole Spine Road" placeholderTextColor={color.inkMuted} />
        </Field>

        <Field label="Amenities">
          <View style={styles.chipRow}>
            {vm.amenityOptions.map((a) => (
              <Pressable key={a} onPress={() => vm.toggleAmenity(a)} style={[styles.amenityChip, vm.amenities.includes(a) && styles.amenityChipActive]}>
                <Text style={[styles.amenityText, vm.amenities.includes(a) && styles.amenityTextActive]}>{a.replace(/_/g, ' ')}</Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label="House rules (optional)">
          <TextInput style={[styles.input, styles.multiline]} value={vm.houseRules} onChangeText={vm.setHouseRules} multiline placeholder="e.g. No pets, rent due by the 5th" placeholderTextColor={color.inkMuted} />
        </Field>

        <Field label={`Photos (${vm.photos.length})`}>
          <Pressable style={styles.photoAdd} onPress={vm.addMockPhoto}>
            <Text style={styles.photoAddText}>+ Add photo</Text>
          </Pressable>
        </Field>

        {vm.error && <Text style={styles.error}>{vm.error}</Text>}

        <AppButton label="Publish listing" onPress={vm.handleSubmit} loading={vm.submitting} disabled={!vm.isValid} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: object }) {
  return (
    <View style={[{ marginBottom: spacing(3) }, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.parchment },
  title: { fontFamily: font.display, fontSize: 20, color: color.ink },
  subtitle: { fontFamily: font.body, fontSize: 12, color: color.inkMuted, marginBottom: spacing(4) },
  label: { fontFamily: font.bodyMedium, fontSize: 12, color: color.udongo700, marginBottom: 6 },
  input: { backgroundColor: color.white, borderWidth: 1, borderColor: color.border, borderRadius: radius.sm, height: 44, paddingHorizontal: 12, fontFamily: font.body, fontSize: 14, color: color.ink },
  multiline: { height: 80, paddingTop: 10, textAlignVertical: 'top' },
  row2: { flexDirection: 'row', gap: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: color.border, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: color.white },
  chipActive: { backgroundColor: color.msitu700, borderColor: color.msitu700 },
  chipText: { fontFamily: font.body, fontSize: 12, color: color.ink },
  chipTextActive: { color: color.white, fontFamily: font.bodyMedium },
  amenityChip: { borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 7, backgroundColor: color.udongo100 },
  amenityChipActive: { backgroundColor: color.udongo400 },
  amenityText: { fontFamily: font.body, fontSize: 12, color: color.udongo700 },
  amenityTextActive: { color: color.white, fontFamily: font.bodyMedium },
  photoAdd: { borderWidth: 1, borderColor: color.border, borderStyle: 'dashed', borderRadius: radius.md, height: 64, alignItems: 'center', justifyContent: 'center' },
  photoAddText: { fontFamily: font.bodyMedium, fontSize: 13, color: color.sisal600 },
  error: { fontFamily: font.body, fontSize: 12, color: color.alert, marginBottom: spacing(3) },
});
