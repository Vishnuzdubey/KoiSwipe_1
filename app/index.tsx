import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { useAuthStore } from '@/store/auth-store';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function SplashScreen() {
  const hasCompletedOnboarding = useAppStore((state) => state.hasCompletedOnboarding);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else if (!isAuthenticated) {
        router.replace('/auth/auth');
      } else {
        router.replace('/(tabs)');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding, isAuthenticated]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000' }}
        style={styles.backgroundImage}
        blurRadius={3}
      />
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
});