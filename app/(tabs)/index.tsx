import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useMatchesStore } from '@/store/matches-store';
import { EmptyState } from '@/components/EmptyState';
import { ProfileCard } from '@/components/ProfileCard';
import { User } from '@/types';
import colors from '@/constants/colors';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const {
    potentialMatches,
    currentIndex,
    isLoading,
    loadPotentialMatches,
    swipeLeft,
    swipeRight,
  } = useMatchesStore();

  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);

  const pan = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    loadPotentialMatches();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          // Swipe right
          Animated.timing(pan, {
            toValue: { x: width + 100, y: gesture.dy },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            handleSwipeRight();
          });
        } else if (gesture.dx < -120) {
          // Swipe left
          Animated.timing(pan, {
            toValue: { x: -width - 100, y: gesture.dy },
            duration: 300,
            useNativeDriver: false,
          }).start(() => {
            pan.setValue({ x: 0, y: 0 });
            swipeLeft();
          });
        } else {
          // Return to center
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleSwipeRight = () => {
    const shouldShowMatch = Math.random() < 0.7;
    if (shouldShowMatch && currentIndex < potentialMatches.length) {
      setMatchedUser(potentialMatches[currentIndex]);
      setShowMatchAnimation(true);

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

  if (potentialMatches.length === 0 || currentIndex >= potentialMatches.length) {
    return (
      <EmptyState
        title={
          potentialMatches.length === 0
            ? 'No More Profiles'
            : 'You\'ve Seen Everyone'
        }
        description={
          potentialMatches.length === 0
            ? 'We\'re finding more otaku for you. Check back soon!'
            : 'Check back later for new anime fans in your area.'
        }
        imageUrl={
          potentialMatches.length === 0
            ? 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000'
            : 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000'
        }
        buttonTitle="Refresh"
        onButtonPress={loadPotentialMatches}
      />
    );
  }

  const currentUser = potentialMatches[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.cardContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.animatedCard,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y },
                {
                  rotate: pan.x.interpolate({
                    inputRange: [-200, 0, 200],
                    outputRange: ['-20deg', '0deg', '20deg'],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          <ProfileCard
            user={currentUser}
            onSwipeLeft={swipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        </Animated.View>
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
                  <View style={styles.avatar} />
                </View>
              </View>
              <View style={styles.avatarContainer}>
                <View style={styles.avatarBorder}>
                  <View style={styles.avatar} />
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
  animatedCard: {
    flex: 1,
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
