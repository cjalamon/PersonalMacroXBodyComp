import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import { colors } from "@/theme";

SplashScreen.preventAutoHideAsync();

// The design is light-only for now, so the app always uses the light theme.
const AppTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.background },
};

export default function RootLayout() {
  // Load Inter before showing any screen, so text never flashes in the wrong font.
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  return (
    <ThemeProvider value={AppTheme}>
      <StatusBar style="dark" />
      <AnimatedSplashOverlay />
      {fontsLoaded && <AppTabs />}
    </ThemeProvider>
  );
}
