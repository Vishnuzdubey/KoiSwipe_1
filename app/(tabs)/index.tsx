import { EmptyState } from '@/components/EmptyState';
import { ProfileCard } from '@/components/ProfileCard';
import { Skeleton } from '@/components/Skeleton';
import colors from '@/constants/colors';
import { useMatchesStore } from '@/store/matches-store';
import { User } from '@/types';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const {
    potentialMatches,
    currentIndex,
    isLoading,
    loadPotentialMatches,
    swipeLeft,
    swipeRight,
    superLike,
  } = useMatchesStore();

  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [isSwipeInProgress, setIsSwipeInProgress] = useState(false);

  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadPotentialMatches();
  }, []);

  const animateSwipe = (direction: 'left' | 'right', callback: () => void) => {
    setIsSwipeInProgress(true);

    const toValueX = direction === 'right' ? width + 100 : -width - 100;

    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: toValueX, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Reset animation values
      pan.setValue({ x: 0, y: 0 });
      opacity.setValue(1);
      scale.setValue(1);
      setIsSwipeInProgress(false);
      callback();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && !isSwipeInProgress;
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        if (isSwipeInProgress) return;

        if (gesture.dx > 120) {
          // Swipe right
          animateSwipe('right', () => handleSwipeRight());
        } else if (gesture.dx < -120) {
          // Swipe left
          animateSwipe('left', () => handleSwipeLeft());
        } else {
          // Return to center with spring animation
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            tension: 100,
            friction: 8,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleSwipeLeft = async () => {
    if (isSwipeInProgress) return;
    await swipeLeft();
  };

  const handleSwipeRight = async () => {
    if (isSwipeInProgress) return;

    const isMatch = await swipeRight();

    if (isMatch && currentIndex < potentialMatches.length) {
      setMatchedUser(potentialMatches[currentIndex - 1]); // Previous user since index already incremented
      setShowMatchAnimation(true);

      setTimeout(() => {
        setShowMatchAnimation(false);
        setMatchedUser(null);
      }, 3000);
    }
  };

  const handleSuperLike = async () => {
    if (isSwipeInProgress) return;

    // Animate super like with special effect
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start(() => {
      scale.setValue(1);
      opacity.setValue(1);
    });

    const isMatch = await superLike();

    if (isMatch && currentIndex < potentialMatches.length) {
      setMatchedUser(potentialMatches[currentIndex - 1]); // Previous user since index already incremented
      setShowMatchAnimation(true);

      setTimeout(() => {
        setShowMatchAnimation(false);
        setMatchedUser(null);
      }, 3000);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <View style={styles.cardContainer}>
          <Skeleton
            height={600}
            width="100%"
            borderRadius={16}
          />
        </View>
      </View>
    );
  }

  if (potentialMatches.length === 0 || currentIndex >= potentialMatches.length) {
    return (
      <EmptyState
        title={
          potentialMatches.length === 0
            ? 'No Recommendations Available'
            : 'You\'ve Seen Everyone'
        }
        description={
          potentialMatches.length === 0
            ? 'Complete your profile setup to get personalized recommendations!'
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
                { scale: scale },
                {
                  rotate: pan.x.interpolate({
                    inputRange: [-200, 0, 200],
                    outputRange: ['-20deg', '0deg', '20deg'],
                    extrapolate: 'clamp',
                  }),
                },
              ],
              opacity: opacity,
            },
          ]}
        >
          <ProfileCard
            user={currentUser}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            onSuperLike={handleSuperLike}
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
    backgroundColor: 'rgba(138, 111, 223, 0.95)',
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
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
    borderWidth: 3,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
  },
});
