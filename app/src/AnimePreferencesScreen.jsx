import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useOnboardingStore } from '@/store/onboarding-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const AnimePreferencesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState(0); // 0: genres, 1: anime selection, 2: ratings

  // Get auth state
  const { isAuthenticated, token } = useAuthStore();

  // Genre image mapping for API loaded genres
  const getGenreImage = (genreName) => {
    const genreImages = {
      'Romance': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&h=400&fit=crop',
      'Sci-Fi': 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?q=80&w=400&h=400&fit=crop',
      'Slice of Life': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&h=400&fit=crop',
      'Sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=400&h=400&fit=crop',
      'Supernatural': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&h=400&fit=crop',
      'Suspense': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop',
      'Action': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&h=400&fit=crop',
      'Adventure': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&h=400&fit=crop',
      'Avant Garde': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=400&h=400&fit=crop',
      'Award Winning': 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=400&h=400&fit=crop',
      'Boys Love': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&h=400&fit=crop',
      'Comedy': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=400&h=400&fit=crop',
      'Drama': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&h=400&fit=crop',
      'Ecchi': 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=400&h=400&fit=crop',
      'Erotica': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&h=400&fit=crop',
      'Fantasy': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&h=400&fit=crop',
      'Girls Love': 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&h=400&fit=crop',
      'Gourmet': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&h=400&fit=crop',
      'Hentai': 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=400&h=400&fit=crop',
      'Horror': 'https://images.unsplash.com/photo-1509248961158-d3f20ce5d1cb?q=80&w=400&h=400&fit=crop',
      'Mystery': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop',
    };

    // Return the specific image or a default fallback
    return genreImages[genreName] || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&h=400&fit=crop';
  };

  // Mock data as fallback with genre images
  const mockGenres = [
    { id: 'mock-1', name: 'Action', imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=400&h=400&fit=crop' },
    { id: 'mock-2', name: 'Adventure', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&h=400&fit=crop' },
    { id: 'mock-3', name: 'Comedy', imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=400&h=400&fit=crop' },
    { id: 'mock-4', name: 'Drama', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&h=400&fit=crop' },
    { id: 'mock-5', name: 'Fantasy', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&h=400&fit=crop' },
    { id: 'mock-6', name: 'Romance', imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&h=400&fit=crop' },
    { id: 'mock-7', name: 'Sci-Fi', imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?q=80&w=400&h=400&fit=crop' },
    { id: 'mock-8', name: 'Slice of Life', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&h=400&fit=crop' },
    { id: 'mock-9', name: 'Supernatural', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&h=400&fit=crop' },
    { id: 'mock-10', name: 'Mystery', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&fit=crop' },
    { id: 'mock-11', name: 'Horror', imageUrl: 'https://images.unsplash.com/photo-1509248961158-d3f20ce5d1cb?q=80&w=400&h=400&fit=crop' },
    { id: 'mock-12', name: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=400&h=400&fit=crop' },
  ];

  const mockAnimes = [
    { id: 'anime-1', title: 'Naruto', titleEnglish: 'Naruto', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400' },
    { id: 'anime-2', title: 'One Piece', titleEnglish: 'One Piece', imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=400' },
    { id: 'anime-3', title: 'Attack on Titan', titleEnglish: 'Attack on Titan', imageUrl: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=400' },
    { id: 'anime-4', title: 'Demon Slayer', titleEnglish: 'Demon Slayer', imageUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=400' },
    { id: 'anime-5', title: 'My Hero Academia', titleEnglish: 'My Hero Academia', imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400' },
    { id: 'anime-6', title: 'Dragon Ball Z', titleEnglish: 'Dragon Ball Z', imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=400' },
  ];

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = await AsyncStorage.getItem('auth_token');
      console.log('Stored token check:', storedToken ? 'Token exists' : 'No token found');
      console.log('Auth state - isAuthenticated:', isAuthenticated, 'token:', token ? 'exists' : 'none');

      if (!storedToken && !isAuthenticated) {
        Alert.alert(
          'Authentication Required',
          'Please log in to continue.',
          [{ text: 'OK', onPress: () => router.replace('/auth/auth') }]
        );
        return;
      }
    };

    checkAuth();
  }, [isAuthenticated, token]);

  // Prevent going back during onboarding
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Only allow back within the anime preferences steps
        if (currentStep > 0) {
          setCurrentStep(currentStep - 1);
          return true;
        }
        // Prevent going back to previous onboarding screen
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [currentStep])
  );

  const {
    genres,
    animes,
    selectedGenres,
    selectedAnimes,
    isLoadingGenres,
    isLoadingAnimes,
    isSubmitting,
    error,
    fetchGenres,
    fetchAnimes,
    searchAnimes,
    addSelectedGenre,
    removeSelectedGenre,
    addSelectedAnime,
    removeSelectedAnime,
    updateAnimeRating,
    submitFavoriteGenres,
    submitFavoriteAnimes,
    clearError
  } = useOnboardingStore();

  useEffect(() => {
    // Load initial data only if authenticated
    const loadData = async () => {
      const storedToken = await AsyncStorage.getItem('auth_token');
      if (storedToken || isAuthenticated) {
        console.log('Loading initial data...');
        await fetchGenres();
        await fetchAnimes();
      }
    };

    loadData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      console.error('Onboarding error:', error);
      Alert.alert('Error', error, [
        {
          text: 'Retry', onPress: () => {
            clearError();
            fetchGenres();
            fetchAnimes();
          }
        },
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error]);

  const handleSearchAnime = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchAnimes(query);
    } else {
      fetchAnimes();
    }
  };

  const handleGenreSelect = (genreId) => {
    if (selectedGenres.includes(genreId)) {
      removeSelectedGenre(genreId);
    } else {
      addSelectedGenre(genreId);
    }
  };

  const handleAnimeSelect = (anime) => {
    const isSelected = selectedAnimes.some(a => a.animeId === anime.id);
    if (isSelected) {
      removeSelectedAnime(anime.id);
    } else if (selectedAnimes.length < 5) {
      addSelectedAnime(anime, 5); // Default rating of 5
    } else {
      Alert.alert('Limit Reached', 'You can only select up to 5 favorite anime.');
    }
  };

  const handleRatingChange = (animeId, rating) => {
    updateAnimeRating(animeId, rating);
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      // Genre selection step
      if (selectedGenres.length === 0) {
        Alert.alert('Required', 'Please select at least one genre.');
        return;
      }
      await submitFavoriteGenres();
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Anime selection step
      if (selectedAnimes.length === 0) {
        Alert.alert('Required', 'Please select at least one anime.');
        return;
      }
      setCurrentStep(2);
    } else {
      // Ratings step - submit and continue
      await submitFavoriteAnimes();
      router.replace('/src/CompatibilityScreen');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const renderGenresSkeleton = () => (
    <View style={styles.genreGrid}>
      {Array.from({ length: 9 }).map((_, index) => (
        <View key={index} style={[styles.genreCard, { backgroundColor: colors.border }]}>
          <Skeleton width={40} height={40} borderRadius={20} style={{ marginBottom: 8 }} />
          <Skeleton width="80%" height={16} borderRadius={8} />
        </View>
      ))}
    </View>
  );

  const renderAnimesSkeleton = () => (
    <View style={styles.animeGrid}>
      {Array.from({ length: 12 }).map((_, index) => (
        <View key={index} style={[styles.animeCard, { backgroundColor: colors.border }]}>
          <Skeleton width="100%" height={90} borderRadius={12} style={{ marginBottom: 10 }} />
          <Skeleton width="90%" height={14} borderRadius={7} />
          <Skeleton width="70%" height={14} borderRadius={7} style={{ marginTop: 4 }} />
        </View>
      ))}
    </View>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return 'Select Your Favorite Genres';
      case 1: return 'Choose Your Top 5 Anime';
      case 2: return 'Rate Your Selected Anime';
      default: return 'Anime Preferences';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 0: return 'Pick the genres you love most';
      case 1: return 'Choose up to 5 anime you absolutely love';
      case 2: return 'Rate each anime from 1 to 10';
      default: return 'Tell us about your anime tastes';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${((currentStep + 1) / 3) * 50}%` }]} />
        </View>
        <Text style={styles.stepIndicator}>Step 2 of 5 - {currentStep + 1} of 3</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.phaseTitle}>{getStepTitle()}</Text>
          <Text style={styles.phaseSubtitle}>{getStepSubtitle()}</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Genre Selection Step */}
          {currentStep === 0 && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Select Genres <Text style={styles.selectedCount}>({selectedGenres.length} selected)</Text>
              </Text>

              {isLoadingGenres ? renderGenresSkeleton() : (
                <View style={styles.genreGrid}>
                  {(genres.length > 0 ? genres : mockGenres).map((genre) => (
                    <TouchableOpacity
                      key={genre.id}
                      style={[
                        styles.genreCard,
                        selectedGenres.includes(genre.id) && styles.selectedGenreCard
                      ]}
                      onPress={() => handleGenreSelect(genre.id)}
                      activeOpacity={0.7}
                    >
                      <Image
                        source={{ uri: genre.imageUrl || getGenreImage(genre.name) }}
                        style={styles.genreImage}
                        resizeMode="cover"
                      />
                      <Text style={[
                        styles.genreText,
                        selectedGenres.includes(genre.id) && styles.selectedGenreText
                      ]}>
                        {genre.name}
                      </Text>
                      {selectedGenres.includes(genre.id) && (
                        <View style={styles.genreSelectedBadge}>
                          <Text style={styles.genreSelectedBadgeText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Anime Selection Step */}
          {currentStep === 1 && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>
                Select Anime <Text style={styles.selectedCount}>({selectedAnimes.length}/5 selected)</Text>
              </Text>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for anime..."
                  value={searchQuery}
                  onChangeText={handleSearchAnime}
                  placeholderTextColor={colors.textLight}
                />
              </View>

              {isLoadingAnimes ? renderAnimesSkeleton() : (
                <View style={styles.animeGrid}>
                  {(animes.length > 0 ? animes : mockAnimes).map((anime) => {
                    const isSelected = selectedAnimes.some(a => a.animeId === anime.id);
                    return (
                      <TouchableOpacity
                        key={anime.id}
                        style={[
                          styles.animeCard,
                          isSelected && styles.selectedAnimeCard
                        ]}
                        onPress={() => handleAnimeSelect(anime)}
                        activeOpacity={0.7}
                      >
                        <Image
                          source={{ uri: anime.imageUrl || anime.image_url }}
                          style={styles.animeImage}
                        />
                        <Text style={[
                          styles.animeTitle,
                          isSelected && styles.selectedAnimeTitle
                        ]}>
                          {anime.title || anime.name}
                        </Text>
                        {isSelected && (
                          <View style={styles.selectedBadge}>
                            <Text style={styles.selectedBadgeText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* Rating Step */}
          {currentStep === 2 && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Rate Your Selected Anime</Text>

              {selectedAnimes.map((selectedAnime) => {
                const allAnimes = animes.length > 0 ? animes : mockAnimes;
                const anime = allAnimes.find(a => a.id === selectedAnime.animeId);
                if (!anime) return null;

                return (
                  <View key={selectedAnime.animeId} style={styles.ratingContainer}>
                    <View style={styles.ratingAnimeInfo}>
                      <Image
                        source={{ uri: anime.imageUrl || anime.image_url }}
                        style={styles.ratingAnimeImage}
                      />
                      <Text style={styles.ratingAnimeTitle}>{anime.title || anime.name}</Text>
                    </View>

                    <View style={styles.ratingStars}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                        <TouchableOpacity
                          key={rating}
                          style={[
                            styles.ratingStar,
                            selectedAnime.rating >= rating && styles.selectedRatingStar
                          ]}
                          onPress={() => handleRatingChange(selectedAnime.animeId, rating)}
                        >
                          <Text style={[
                            styles.ratingStarText,
                            selectedAnime.rating >= rating && styles.selectedRatingStarText
                          ]}>
                            {rating}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {currentStep > 0 && (
          <Button
            title="Back"
            onPress={handleBack}
            style={[styles.navButton, styles.backButton]}
            disabled={isSubmitting}
          />
        )}

        <Button
          title={currentStep === 2 ? "Continue" : "Next"}
          onPress={handleNext}
          style={[styles.navButton, styles.nextButton]}
          loading={isSubmitting}
          disabled={
            isSubmitting ||
            (currentStep === 0 && selectedGenres.length === 0) ||
            (currentStep === 1 && selectedAnimes.length === 0)
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  stepIndicator: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  phaseTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  phaseSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: 32,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textLight,
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  // Genre Cards
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  genreCard: {
    width: (width - 40 - 16 * 2) / 3,
    height: 110,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedGenreCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  genreImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedGenreText: {
    color: colors.white,
    fontWeight: '700',
  },
  genreSelectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.success,
    borderRadius: 12,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genreSelectedBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Anime Cards
  animeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  animeCard: {
    width: (width - 40 - 16 * 2) / 3,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 8,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  selectedAnimeCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  animeImage: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    marginBottom: 10,
  },
  animeTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
    numberOfLines: 2,
    minHeight: 32,
  },
  selectedAnimeTitle: {
    color: colors.white,
    fontWeight: '700',
  },
  selectedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.success,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Archetype Cards
  archetypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  archetypeCard: {
    width: (width - 64) / 2,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedArchetypeCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  archetypeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  archetypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  selectedArchetypeText: {
    color: colors.white,
  },
  archetypeDescription: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  // Status Cards
  statusGrid: {
    gap: 12,
  },
  statusCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedStatusCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  statusIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  selectedStatusText: {
    color: colors.white,
  },
  statusDescription: {
    fontSize: 12,
    color: colors.textLight,
    flex: 2,
    lineHeight: 16,
  },
  // Interest Cards
  interestGrid: {
    gap: 12,
  },
  interestCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedInterestCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  interestText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  selectedInterestText: {
    color: colors.white,
  },
  interestDescription: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 18,
  },
  // Search
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  // Rating Components
  ratingContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ratingAnimeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingAnimeImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  ratingAnimeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  ratingStars: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingStar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedRatingStar: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  ratingStarText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  selectedRatingStarText: {
    color: colors.white,
  },
  // Navigation Buttons
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.border,
  },
  nextButton: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: -0.3,
  },
});

export default AnimePreferencesScreen;