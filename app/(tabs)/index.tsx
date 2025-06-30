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

const { width, height } = Dimensions.get('window');

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

  // Animation values
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const nopeOpacity = useRef(new Animated.Value(0)).current;
  const superLikeOpacity = useRef(new Animated.Value(0)).current;
  const superLikeScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadPotentialMatches();
  }, []);

  // Reset all overlay animations
  const resetOverlayAnimations = () => {
    likeOpacity.setValue(0);
    nopeOpacity.setValue(0);
    superLikeOpacity.setValue(0);
    superLikeScale.setValue(0);
  };

  const animateSwipe = (direction: 'left' | 'right', callback: () => void) => {
    setIsSwipeInProgress(true);

    const toValueX = direction === 'right' ? width + 100 : -width - 100;
    const toRotation = direction === 'right' ? '30deg' : '-30deg';

    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: toValueX, y: -50 },
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Reset animation values
      pan.setValue({ x: 0, y: 0 });
      opacity.setValue(1);
      scale.setValue(1);
      resetOverlayAnimations();
      setIsSwipeInProgress(false);
      callback();
    });
  };

  const animateButtonAction = (action: 'like' | 'nope' | 'superlike', callback: () => void) => {
    setIsSwipeInProgress(true);

    if (action === 'superlike') {
      // Super like animation
      Animated.parallel([
        Animated.sequence([
          Animated.timing(superLikeOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
          }),
          Animated.timing(superLikeScale, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.05,
            duration: 150,
            useNativeDriver: false,
          }),
          Animated.timing(scale, {
            toValue: 0.9,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ]),
      ]).start(() => {
        // Reset values
        scale.setValue(1);
        opacity.setValue(1);
        resetOverlayAnimations();
        setIsSwipeInProgress(false);
        callback();
      });
    } else {
      // Like/Nope button animation
      const overlayOpacity = action === 'like' ? likeOpacity : nopeOpacity;
      const direction = action === 'like' ? 'right' : 'left';

      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.02,
            duration: 100,
            useNativeDriver: false,
          }),
          Animated.timing(scale, {
            toValue: 0.9,
            duration: 300,
            useNativeDriver: false,
          }),
        ]),
        Animated.timing(pan, {
          toValue: {
            x: direction === 'right' ? width + 100 : -width - 100,
            y: -30
          },
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        // Reset values
        pan.setValue({ x: 0, y: 0 });
        scale.setValue(1);
        opacity.setValue(1);
        resetOverlayAnimations();
        setIsSwipeInProgress(false);
        callback();
      });
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5) && !isSwipeInProgress;
      },
      onPanResponderMove: (_, gesture) => {
        if (isSwipeInProgress) return;

        pan.setValue({ x: gesture.dx, y: gesture.dy });

        // Show like/nope overlays based on swipe direction
        const likeOpacityValue = Math.max(0, Math.min(1, gesture.dx / 120));
        const nopeOpacityValue = Math.max(0, Math.min(1, -gesture.dx / 120));

        likeOpacity.setValue(likeOpacityValue);
        nopeOpacity.setValue(nopeOpacityValue);

        // Super like detection (swipe up)
        if (gesture.dy < -50 && Math.abs(gesture.dx) < 50) {
          const superLikeOpacityValue = Math.max(0, Math.min(1, -gesture.dy / 100));
          superLikeOpacity.setValue(superLikeOpacityValue);
          superLikeScale.setValue(superLikeOpacityValue);
        } else {
          superLikeOpacity.setValue(0);
          superLikeScale.setValue(0);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (isSwipeInProgress) return;

        // Super like (swipe up)
        if (gesture.dy < -100 && Math.abs(gesture.dx) < 80) {
          animateButtonAction('superlike', () => handleSuperLike());
        }
        // Swipe right (like)
        else if (gesture.dx > 120) {
          animateSwipe('right', () => handleSwipeRight());
        }
        // Swipe left (nope)
        else if (gesture.dx < -120) {
          animateSwipe('left', () => handleSwipeLeft());
        }
        // Return to center
        else {
          Animated.parallel([
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              tension: 150,
              friction: 8,
              useNativeDriver: false,
            }),
            Animated.timing(likeOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(nopeOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(superLikeOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(superLikeScale, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const handleSwipeLeft = () => {
    if (isSwipeInProgress) return;
    // Make API call in background, don't wait for it
    swipeLeft().catch(error => console.warn('Swipe left API error:', error));
  };

  const handleSwipeRight = () => {
    if (isSwipeInProgress) return;

    // Get current user before swipe for potential match animation
    const currentUser = potentialMatches[currentIndex];

    // Make API call in background and handle match result
    swipeRight().then(isMatch => {
      if (isMatch && currentUser) {
        setMatchedUser(currentUser);
        setShowMatchAnimation(true);

        setTimeout(() => {
          setShowMatchAnimation(false);
          setMatchedUser(null);
        }, 3000);
      }
    }).catch(error => console.warn('Swipe right API error:', error));
  };

  const handleSuperLike = () => {
    if (isSwipeInProgress) return;

    // Get current user before swipe for potential match animation
    const currentUser = potentialMatches[currentIndex];

    // Make API call in background and handle match result
    superLike().then(isMatch => {
      if (isMatch && currentUser) {
        setMatchedUser(currentUser);
        setShowMatchAnimation(true);

        setTimeout(() => {
          setShowMatchAnimation(false);
          setMatchedUser(null);
        }, 3000);
      }
    }).catch(error => console.warn('Super like API error:', error));
  };

  // Button handlers with animations
  const handleLikeButton = () => {
    if (isSwipeInProgress) return;
    animateButtonAction('like', () => handleSwipeRight());
  };

  const handleNopeButton = () => {
    if (isSwipeInProgress) return;
    animateButtonAction('nope', () => handleSwipeLeft());
  };

  const handleSuperLikeButton = () => {
    if (isSwipeInProgress) return;
    animateButtonAction('superlike', () => handleSuperLike());
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

  const cardRotation = pan.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

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
                { rotate: cardRotation },
              ],
              opacity: opacity,
            },
          ]}
        >
          <ProfileCard
            user={currentUser}
            onSwipeLeft={handleNopeButton}
            onSwipeRight={handleLikeButton}
            onSuperLike={handleSuperLikeButton}
          />

          {/* LIKE Overlay */}
          <Animated.View
            style={[
              styles.overlayContainer,
              styles.likeOverlay,
              { opacity: likeOpacity }
            ]}
            pointerEvents="none"
          >
            <View style={styles.likeTextContainer}>
              <Text style={styles.likeText}>LIKE</Text>
            </View>
          </Animated.View>

          {/* NOPE Overlay */}
          <Animated.View
            style={[
              styles.overlayContainer,
              styles.nopeOverlay,
              { opacity: nopeOpacity }
            ]}
            pointerEvents="none"
          >
            <View style={styles.nopeTextContainer}>
              <Text style={styles.nopeText}>NOPE</Text>
            </View>
          </Animated.View>

          {/* SUPER LIKE Overlay */}
          <Animated.View
            style={[
              styles.overlayContainer,
              styles.superLikeOverlay,
              {
                opacity: superLikeOpacity,
                transform: [{ scale: superLikeScale }]
              }
            ]}
            pointerEvents="none"
          >
            <View style={styles.superLikeTextContainer}>
              <Text style={styles.superLikeText}>SUPER</Text>
              <Text style={styles.superLikeText}>LIKE</Text>
              <Text style={styles.superLikeEmoji}>⭐</Text>
            </View>
          </Animated.View>
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
    position: 'relative',
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  likeOverlay: {
    backgroundColor: 'rgba(76, 217, 100, 0.1)',
  },
  nopeOverlay: {
    backgroundColor: 'rgba(255, 59, 92, 0.1)',
  },
  superLikeOverlay: {
    backgroundColor: 'rgba(67, 156, 255, 0.1)',
  },
  likeTextContainer: {
    transform: [{ rotate: '-20deg' }],
    borderWidth: 4,
    borderColor: '#4CD964',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 217, 100, 0.1)',
  },
  nopeTextContainer: {
    transform: [{ rotate: '20deg' }],
    borderWidth: 4,
    borderColor: '#FF3B5C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 59, 92, 0.1)',
  },
  superLikeTextContainer: {
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#439CFF',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: 'rgba(67, 156, 255, 0.1)',
  },
  likeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CD964',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  nopeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF3B5C',
    letterSpacing: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  superLikeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#439CFF',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  superLikeEmoji: {
    fontSize: 32,
    marginTop: 5,
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