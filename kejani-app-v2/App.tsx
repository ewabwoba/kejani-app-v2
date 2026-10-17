import React, { useCallback, useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts as useFrauncesFonts, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { useFonts as useWorkSansFonts, WorkSans_400Regular, WorkSans_500Medium } from '@expo-google-fonts/work-sans';
import { useFonts as useMonoFonts, IBMPlexMono_500Medium } from '@expo-google-fonts/ibm-plex-mono';
import { RootNavigator } from './src/presentation/navigation/RootNavigator';
import { initAnalytics } from './src/presentation/hooks/useAnalytics';
import { color } from './src/core/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Fails harmlessly if called twice (e.g. fast refresh) — safe to ignore.
});

export default function App() {
  // Pulled from Google Fonts via npm (@expo-google-fonts/*) rather than
  // local .ttf files + require() — no font files to go missing from the
  // bundle, no native asset-linking step. The exported names here
  // (Fraunces_600SemiBold etc.) are what core/theme/tokens.ts's `font.*`
  // values must match exactly, since that's the StyleSheet.fontFamily key.
  const [frauncesLoaded] = useFrauncesFonts({ Fraunces_600SemiBold });
  const [workSansLoaded] = useWorkSansFonts({ WorkSans_400Regular, WorkSans_500Medium });
  const [monoLoaded] = useMonoFonts({ IBMPlexMono_500Medium });
  const fontsLoaded = frauncesLoaded && workSansLoaded && monoLoaded;

  useEffect(() => {
    initAnalytics();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar barStyle="light-content" backgroundColor={color.msitu900} />
      <RootNavigator />
    </View>
  );
}
