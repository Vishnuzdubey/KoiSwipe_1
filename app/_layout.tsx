import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  const [isAppReady, setIsAppReady] = useState(false);
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);
  const { isAuthenticated, initializeAuth } = useAuthStore();

  // Check for existing token on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsAppReady(true);
      }
    };

    if (loaded) {
      checkAuthStatus();
    }
  }, [loaded, initializeAuth]);

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded && isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isAppReady]);

  if (!loaded || !isAppReady) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="auth/auth" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: true, title: "Chat" }} />
      <Stack.Screen name="profile/[id]" options={{ headerShown: true, title: "Profile" }} />
      <Stack.Screen name="settings" options={{ headerShown: true, title: "Settings" }} />
      <Stack.Screen name="preferences" options={{ headerShown: true, title: "Edit Preferences" }} />
    </Stack>
  );
}