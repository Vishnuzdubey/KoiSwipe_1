import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useMatchesStore } from '@/store/matches-store';
import { ProfileCard } from '@/components/ProfileCard';
import { EmptyState } from '@/components/EmptyState';
import { User } from '@/types';
import colors from '@/constants/colors';

const { width, height } = Dimensions.get('window');

export default function DiscoverScreen() {
  const { 
    potentialMatches, 
    currentIndex, 
    isLoading, 
    loadPotentialMatches, 
    swipeLeft, 
    swipeRight 
  } = useMatchesStore();
  
  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);

  useEffect(() => {
    loadPotentialMatches();
  }, []);

  const handleSwipeRight = () => {
    // Check if we should show a match animation (70% chance)
    const shouldShowMatch = Math.random() < 0.7;
    
    if (shouldShowMatch && currentIndex < potentialMatches.length) {
      setMatchedUser(potentialMatches[currentIndex]);
      setShowMatchAnimation(true);
      
      // Hide the animation after 3 seconds
      setTimeout(() => {
        setShowMatchAnimation(false);
        swipeRight();
      }, 3000);
    } else {
      swipeRight();
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (potentialMatches.length === 0) {
    return (
      <EmptyState
        title="No More Profiles"
        description="We're finding more otaku for you. Check back soon!"
        imageUrl="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000"
        buttonTitle="Refresh"
        onButtonPress={loadPotentialMatches}
      />
    );
  }

  if (currentIndex >= potentialMatches.length) {
    return (
      <EmptyState
        title="You've Seen Everyone"
        description="Check back later for new anime fans in your area."
        imageUrl="https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000"
        buttonTitle="Start Over"
        onButtonPress={loadPotentialMatches}
      />
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.cardContainer}>
        <ProfileCard
          user={potentialMatches[currentIndex]}
          onSwipeLeft={swipeLeft}
          onSwipeRight={handleSwipeRight}
        />
      </View>
      
      {showMatchAnimation && matchedUser && (
        <View style={styles.matchOverlay}>
          <View style={styles.matchContent}>
            <Text style={styles.matchTitle}>It's a Match!</Text>
            <Text style={styles.matchSubtitle}>
              You and {matchedUser.username} like each other
            </Text>
            <View style={styles.matchAvatars}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarBorder}>
                  <View style={styles.avatar}>
                    {/* Current user avatar would go here */}
                  </View>
                </View>
              </View>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarBorder}>
                  <View style={styles.avatar}>
                    {/* Matched user avatar would go here */}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    padding: 16,
  },
  matchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(138, 111, 223, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  matchContent: {
    alignItems: 'center',
    padding: 20,
  },
  matchTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  matchSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 24,
    textAlign: 'center',
  },
  matchAvatars: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginHorizontal: 10,
  },
  avatarBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
  },
});