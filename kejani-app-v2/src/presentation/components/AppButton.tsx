import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, GestureResponderEvent } from 'react-native';
import { color, radius, font } from '../../core/theme/tokens';

interface Props {
  label: string;
  onPress: (e: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export function AppButton({ label, onPress, variant = 'primary', loading, disabled }: Props) {
  const styles = variantStyles[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        base.button,
        styles.container,
        (disabled || loading) && base.disabled,
        pressed && base.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={styles.text.color} />
      ) : (
        <Text style={[base.text, styles.text]}>{label}</Text>
      )}
    </Pressable>
  );
}

const base = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  text: { fontFamily: font.bodyMedium, fontSize: 15 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
});

const variantStyles = {
  primary: StyleSheet.create({
    container: { backgroundColor: color.sisal600 },
    text: { color: color.white },
  }),
  secondary: StyleSheet.create({
    container: { backgroundColor: color.msitu700 },
    text: { color: color.white },
  }),
  outline: StyleSheet.create({
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: color.border },
    text: { color: color.ink },
  }),
};
