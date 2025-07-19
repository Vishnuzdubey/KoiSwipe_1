import { EmptyState } from '@/components/EmptyState';
import { InteractiveLoader } from '@/components/InteractiveLoader';
import { ProfileCard } from '@/components/ProfileCard';
import colors from '@/constants/colors';
import { useMatchesStore } from '@/store/matches-store';
import { User } from '@/types';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function DiscoverScreen() {
  const {
    potentialMatches,
    currentIndex,
    isLoading,
    isPreloading,
    hasMoreProfiles,
    loadPotentialMatches,
    preloadMoreProfiles,
    swipeLeft,
    swipeRight,
    superLike,
  } = useMatchesStore();

  const [showMatchAnimation, setShowMatchAnimation] = useState(false);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const [isSwipeInProgress, setIsSwipeInProgress] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState<'basic' | 'advanced'>('basic');

  // Filter states
  const [genderFilter, setGenderFilter] = useState('Women');
  const [ageRange, setAgeRange] = useState([20, 30]);
  const [maxDistance, setMaxDistance] = useState(80);
  const [showPeopleOutOfAge, setShowPeopleOutOfAge] = useState(false);
  const [showPeopleOutOfDistance, setShowPeopleOutOfDistance] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = [
    { name: 'Festivals', emoji: '🎊' },
    { name: 'Foodie', emoji: '🍕' },
    { name: 'City breaks', emoji: '🏙️' },
    { name: 'Anime', emoji: '🎌' },
    { name: 'Gaming', emoji: '🎮' },
    { name: 'Music', emoji: '🎵' },
    { name: 'Travel', emoji: '✈️' },
    { name: 'Sports', emoji: '⚽' },
    { name: 'Reading', emoji: '📚' },
    { name: 'Art', emoji: '🎨' },
    { name: 'Cooking', emoji: '👨‍🍳' },
    { name: 'Photography', emoji: '📸' },
  ];

  // Animation values
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const nopeOpacity = useRef(new Animated.Value(0)).current;
  const superLikeOpacity = useRef(new Animated.Value(0)).current;
  const superLikeScale = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    loadPotentialMatches();
  }, []);

  // Preload more profiles when near the end
  useEffect(() => {
    if (!isLoading && currentIndex >= potentialMatches.length - 3 && hasMoreProfiles) {
      preloadMoreProfiles();
    }
  }, [currentIndex, potentialMatches.length, isLoading, hasMoreProfiles]);

  // Pulse animation for preloading indicator
  useEffect(() => {
    if (isPreloading) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isPreloading]);

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

  const handleSwipeLeft = async () => {
    if (isSwipeInProgress) return;
    swipeLeft(); // No await - immediate UI update
  };

  const handleSwipeRight = async () => {
    if (isSwipeInProgress) return;

    swipeRight(); // No await - immediate UI update

    // For match animation, we'll simulate it occasionally for demo
    // In real app, you'd get match info from a notification system
    if (Math.random() < 0.1 && currentIndex < potentialMatches.length) { // 10% chance for demo
      setMatchedUser(potentialMatches[currentIndex]);
      setShowMatchAnimation(true);

      setTimeout(() => {
        setShowMatchAnimation(false);
        setMatchedUser(null);
      }, 3000);
    }
  };

  const handleSuperLike = async () => {
    if (isSwipeInProgress) return;

    superLike(); // No await - immediate UI update

    // Higher chance of match for super like
    if (Math.random() < 0.3 && currentIndex < potentialMatches.length) { // 30% chance for demo
      setMatchedUser(potentialMatches[currentIndex]);
      setShowMatchAnimation(true);

      setTimeout(() => {
        setShowMatchAnimation(false);
        setMatchedUser(null);
      }, 3000);
    }
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

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const resetFilters = () => {
    setGenderFilter('Women');
    setAgeRange([20, 30]);
    setMaxDistance(80);
    setShowPeopleOutOfAge(false);
    setShowPeopleOutOfDistance(false);
    setSelectedInterests([]);
  };

  const applyFilters = () => {
    // Here you would typically call an API or update your store with the filters
    console.log('Applying filters:', {
      gender: genderFilter,
      ageRange,
      maxDistance,
      showPeopleOutOfAge,
      showPeopleOutOfDistance,
      interests: selectedInterests
    });
    setShowFilterModal(false);
    // Refresh matches with new filters
    loadPotentialMatches();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <InteractiveLoader
          message="Finding your perfect match..."
          submessage="Analyzing profiles just for you"
        />
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
      
      {/* Custom Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            style={styles.filterButtonGradient}
          >
            <MaterialIcons name="tune" size={24} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
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

      {/* Subtle preloading indicator */}
      {isPreloading && (
        <View style={styles.preloadingIndicator}>
          <Animated.View style={[styles.preloadingDot, { opacity: pulseAnim }]} />
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.filterModalContainer}>
          {/* Header */}
          <View style={styles.filterHeader}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.filterHeaderTitle}>Narrow your search</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Tab Navigation */}
          <View style={styles.filterTabs}>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilterTab === 'basic' && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilterTab('basic')}
            >
              <Text style={[
                styles.filterTabText,
                activeFilterTab === 'basic' && styles.activeFilterTabText
              ]}>
                Basic filters
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterTab,
                activeFilterTab === 'advanced' && styles.activeFilterTab
              ]}
              onPress={() => setActiveFilterTab('advanced')}
            >
              <Text style={[
                styles.filterTabText,
                activeFilterTab === 'advanced' && styles.activeFilterTabText
              ]}>
                Advanced filters
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
            {activeFilterTab === 'basic' ? (
              <>
                {/* Gender Selection */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Who would you like to date?</Text>
                  <TouchableOpacity style={styles.genderSelector}>
                    <Text style={styles.genderSelectorText}>{genderFilter}</Text>
                    <Feather name="chevron-right" size={20} color={colors.textLight} />
                  </TouchableOpacity>
                </View>

                {/* Age Range */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>How old are they?</Text>
                  <View style={styles.ageContainer}>
                    <Text style={styles.ageRangeText}>Between {ageRange[0]} and {ageRange[1]}</Text>
                    <View style={styles.sliderContainer}>
                      <View style={styles.dualSlider}>
                        <View style={styles.sliderTrack} />
                        <View 
                          style={[
                            styles.sliderActiveTrack,
                            {
                              left: `${((ageRange[0] - 18) / (50 - 18)) * 100}%`,
                              width: `${((ageRange[1] - ageRange[0]) / (50 - 18)) * 100}%`
                            }
                          ]} 
                        />
                        <View 
                          style={[
                            styles.sliderThumb,
                            { left: `${((ageRange[0] - 18) / (50 - 18)) * 100}%` }
                          ]} 
                        />
                        <View 
                          style={[
                            styles.sliderThumb,
                            { left: `${((ageRange[1] - 18) / (50 - 18)) * 100}%` }
                          ]} 
                        />
                      </View>
                    </View>
                    <View style={styles.switchContainer}>
                      <Text style={styles.switchLabel}>See people 2 years either side if I run out</Text>
                      <Switch
                        value={showPeopleOutOfAge}
                        onValueChange={setShowPeopleOutOfAge}
                        trackColor={{ false: colors.border, true: `${colors.primary}40` }}
                        thumbColor={showPeopleOutOfAge ? colors.primary : colors.textLight}
                      />
                    </View>
                  </View>
                </View>

                {/* Distance */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>How far away are they?</Text>
                  <View style={styles.distanceContainer}>
                    <Text style={styles.distanceText}>Up to {maxDistance} kilometres away</Text>
                    <View style={styles.singleSliderContainer}>
                      <View style={styles.sliderTrack} />
                      <View 
                        style={[
                          styles.sliderActiveTrack,
                          { width: `${(maxDistance / 100) * 100}%` }
                        ]} 
                      />
                      <View 
                        style={[
                          styles.sliderThumb,
                          { left: `${(maxDistance / 100) * 100}%` }
                        ]} 
                      />
                    </View>
                    <View style={styles.switchContainer}>
                      <Text style={styles.switchLabel}>See people slightly further away if I run out</Text>
                      <Switch
                        value={showPeopleOutOfDistance}
                        onValueChange={setShowPeopleOutOfDistance}
                        trackColor={{ false: colors.border, true: `${colors.primary}40` }}
                        thumbColor={showPeopleOutOfDistance ? colors.primary : colors.textLight}
                      />
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* Interests */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>Do they share any of your interests?</Text>
                  <Text style={styles.filterSectionSubtitle}>Filter by your interests</Text>
                  <Text style={styles.filterDescription}>
                    We'll try to show you people who share any one of the interests you select.
                  </Text>
                  
                  <View style={styles.interestsGrid}>
                    {interests.map((interest) => (
                      <TouchableOpacity
                        key={interest.name}
                        style={[
                          styles.interestChip,
                          selectedInterests.includes(interest.name) && styles.selectedInterestChip
                        ]}
                        onPress={() => toggleInterest(interest.name)}
                      >
                        <Text style={styles.interestEmoji}>{interest.emoji}</Text>
                        <Text style={[
                          styles.interestText,
                          selectedInterests.includes(interest.name) && styles.selectedInterestText
                        ]}>
                          {interest.name}
                        </Text>
                        {selectedInterests.includes(interest.name) ? (
                          <Feather name="check" size={16} color={colors.primary} />
                        ) : (
                          <Feather name="plus" size={16} color={colors.textLight} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            <View style={{ height: 120 }} />
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.applyButtonGradient}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop:30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  filterButton: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  filterButtonGradient: {
    width: 40,
    height: 40,
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
  preloadingIndicator: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
  },
  preloadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  // Filter Modal Styles
  filterModalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: colors.border,
  },
  activeFilterTab: {
    backgroundColor: colors.text,
  },
  filterTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
  },
  activeFilterTabText: {
    color: colors.background,
  },
  filterContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filterSection: {
    marginBottom: 32,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  filterSectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  filterDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
    marginBottom: 20,
  },
  genderSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  genderSelectorText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  ageContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
  },
  ageRangeText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  dualSlider: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
  },
  singleSliderContainer: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
  },
  sliderActiveTrack: {
    position: 'absolute',
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    marginLeft: -12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    color: colors.textLight,
    flex: 1,
    marginRight: 12,
  },
  distanceContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 20,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedInterestChip: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  interestEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  interestText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginRight: 8,
  },
  selectedInterestText: {
    color: colors.primary,
  },
  filterActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    backgroundColor: colors.card,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  applyButton: {
    flex: 2,
    borderRadius: 25,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});