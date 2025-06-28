import { useState } from 'react';
import { router } from 'expo-router';
import { Button } from 'react-native';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

// Color palette
const colors = {
  primary: '#8A6FDF',
  secondary: '#FFA6C9',
  background: '#FFFFFF',
  card: '#F8F8F8',
  text: '#333333',
  textLight: '#777777',
  border: '#EEEEEE',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FFC107',
  info: '#2196F3',
  overlay: 'rgba(0, 0, 0, 0.5)',
  transparent: 'transparent',
  white: '#FFFFFF',
  gradientStart: '#8A6FDF',
  gradientEnd: '#FFA6C9',
};

// Sample data arrays
const animeGenres = [
  { id: '1', name: 'Shounen', imageUrl: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000' },
  { id: '2', name: 'Shoujo', imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000' },
  { id: '3', name: 'Isekai', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000' },
  { id: '4', name: 'Slice of Life', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000' },
  { id: '5', name: 'Yaoi / Yuri', imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000' },
  { id: '6', name: 'Seinen', imageUrl: 'https://images.unsplash.com/photo-1509909756405-be0199881695?q=80&w=1000' },
  { id: '7', name: 'Romance', imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000' },
  { id: '8', name: 'Action / Adventure', imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000' },
  { id: '9', name: 'Comedy', imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=1000' },
  { id: '10', name: 'Horror', imageUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=1000' },
  { id: '11', name: 'Mecha', imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000' },
  { id: '12', name: 'Fantasy', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000' },
  { id: '13', name: 'Sports', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000' },
];

const popularAnime = [
  { id: '1', title: 'Naruto', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000', genres: ['Shounen', 'Action'] },
  { id: '2', title: 'One Piece', imageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000', genres: ['Shounen', 'Adventure'] },
  { id: '3', title: 'Demon Slayer', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000', genres: ['Shounen', 'Action'] },
  { id: '4', title: 'Death Note', imageUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=1000', genres: ['Seinen', 'Psychological'] },
  { id: '5', title: 'Spy x Family', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000', genres: ['Comedy', 'Action'] },
  { id: '6', title: 'Attack on Titan', imageUrl: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000', genres: ['Shounen', 'Action'] },
  { id: '7', title: 'My Hero Academia', imageUrl: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000', genres: ['Shounen', 'Superhero'] },
  { id: 8, title: 'Dragon Ball Z', imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000' },
  { id: 9, title: 'Fullmetal Alchemist', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000' },
  { id: 10, title: 'Hunter x Hunter', imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=1000' },
  { id: 11, title: 'Tokyo Ghoul', imageUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=1000' },
  { id: 12, title: 'Jujutsu Kaisen', imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1000' },
  { id: 13, title: 'Mob Psycho 100', imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000' },
  { id: 14, title: 'Chainsaw Man', imageUrl: 'https://images.unsplash.com/photo-1509909756405-be0199881695?q=80&w=1000' },
  { id: 15, title: 'Spy x Family', imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1000' },
];

const characterArchetypes = [
  { id: 1, name: 'Protagonist', emoji: '🦸', description: 'Main character energy' },
  { id: 2, name: 'Tsundere', emoji: '😤', description: 'Tough exterior, soft heart' },
  { id: 3, name: 'Kuudere', emoji: '😐', description: 'Cool and collected' },
  { id: 4, name: 'Yandere', emoji: '😈', description: 'Obsessively devoted' },
  { id: 5, name: 'Dandere', emoji: '😊', description: 'Shy and sweet' },
  { id: 6, name: 'Sensei', emoji: '👨‍🏫', description: 'Wise mentor type' },
];

const watchingStatuses = [
  { id: 1, name: 'Binge Watcher', icon: '📺', description: 'I watch entire seasons in one sitting' },
  { id: 2, name: 'Weekly Viewer', icon: '📅', description: 'I follow ongoing series religiously' },
  { id: 3, name: 'Casual Watcher', icon: '🍿', description: 'I watch when I have time' },
  { id: 4, name: 'Manga Reader', icon: '📚', description: 'I prefer reading the source material' },
];

const partnerInterestLevels = [
  { id: 1, name: 'Must Love Anime', description: 'They should be as passionate as me' },
  { id: 2, name: 'Open to Anime', description: 'Willing to watch with me sometimes' },
  { id: 3, name: 'Anime Tolerant', description: 'Respects my hobby, doesn\'t have to participate' },
  { id: 4, name: 'No Preference', description: 'Their anime interest level doesn\'t matter' },
];

export const AnimePreferencesScreen = () => {
  const [onboardingData, setOnboardingData] = useState({
    selectedGenres: [],
    favoriteAnime: [],
    characterArchetype: '',
    watchingStatus: '',
    partnerInterestLevel: '',
  });

  const updateOnboardingData = (updates) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };

  const handlePhaseTransition = (phase) => {
    console.log('Transitioning to:', phase);
    // Handle navigation or phase transition logic here
  };
    const handleNext = () => {
     router.replace('/src/CompatibilityScreen');
    };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '50%' }]} />
        </View>
        <Text style={styles.stepIndicator}>Step 3 of 6</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.phaseTitle}>Anime Preferences</Text>
          <Text style={styles.phaseSubtitle}>Tell us about your anime tastes</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Favorite Genres */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              Favorite Genres <Text style={styles.subLabel}>(Select multiple)</Text>
            </Text>
            <View style={styles.genreGrid}>
              {animeGenres.map((genre) => (
                <TouchableOpacity
                  key={genre.id}
                  style={[
                    styles.genreCard,
                    onboardingData.selectedGenres.includes(genre.name) && styles.selectedGenreCard
                  ]}
                  onPress={() => {
                    const newGenres = onboardingData.selectedGenres.includes(genre.name)
                      ? onboardingData.selectedGenres.filter(g => g !== genre.name)
                      : [...onboardingData.selectedGenres, genre.name];
                    updateOnboardingData({ selectedGenres: newGenres });
                  }}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: genre.imageUrl }} style={styles.genreImage} />
                  <Text style={[
                    styles.genreText,
                    onboardingData.selectedGenres.includes(genre.name) && styles.selectedGenreText
                  ]}>
                    {genre.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Favorite Anime */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>
              Top 5 Favorite Anime <Text style={styles.selectedCount}>({onboardingData.favoriteAnime.length}/5)</Text>
            </Text>
            <View style={styles.animeGrid}>
              {popularAnime.slice(0, 15).map((anime) => (
                <TouchableOpacity
                  key={anime.id}
                  style={[
                    styles.animeCard,
                    onboardingData.favoriteAnime.some(a => a.id === anime.id) && styles.selectedAnimeCard
                  ]}
                  onPress={() => {
                    const newFavorites = onboardingData.favoriteAnime.some(a => a.id === anime.id)
                      ? onboardingData.favoriteAnime.filter(a => a.id !== anime.id)
                      : onboardingData.favoriteAnime.length < 5
                      ? [...onboardingData.favoriteAnime, anime]
                      : onboardingData.favoriteAnime;
                    updateOnboardingData({ favoriteAnime: newFavorites });
                  }}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: anime.imageUrl }} style={styles.animeImage} />
                  <Text style={[
                    styles.animeText,
                    onboardingData.favoriteAnime.some(a => a.id === anime.id) && styles.selectedAnimeText
                  ]} numberOfLines={2}>
                    {anime.title}
                  </Text>
                  {onboardingData.favoriteAnime.some(a => a.id === anime.id) && (
                    <View style={styles.selectedBadge}>
                      <Text style={styles.selectedBadgeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Character Archetype */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Character Archetype You Relate To</Text>
            <View style={styles.archetypeGrid}>
              {characterArchetypes.map((archetype) => (
                <TouchableOpacity
                  key={archetype.id}
                  style={[
                    styles.archetypeCard,
                    onboardingData.characterArchetype === archetype.name && styles.selectedArchetypeCard
                  ]}
                  onPress={() => updateOnboardingData({ characterArchetype: archetype.name })}
                  activeOpacity={0.7}
                >
                  <Text style={styles.archetypeEmoji}>{archetype.emoji}</Text>
                  <Text style={[
                    styles.archetypeText,
                    onboardingData.characterArchetype === archetype.name && styles.selectedArchetypeText
                  ]}>
                    {archetype.name}
                  </Text>
                  <Text style={styles.archetypeDescription}>{archetype.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Watching Status */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Your Watching Status</Text>
            <View style={styles.statusGrid}>
              {watchingStatuses.map((status) => (
                <TouchableOpacity
                  key={status.id}
                  style={[
                    styles.statusCard,
                    onboardingData.watchingStatus === status.name && styles.selectedStatusCard
                  ]}
                  onPress={() => updateOnboardingData({ watchingStatus: status.name })}
                  activeOpacity={0.7}
                >
                  <Text style={styles.statusIcon}>{status.icon}</Text>
                  <Text style={[
                    styles.statusText,
                    onboardingData.watchingStatus === status.name && styles.selectedStatusText
                  ]}>
                    {status.name}
                  </Text>
                  <Text style={styles.statusDescription}>{status.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Partner Interest Level */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Preferred Partner's Anime Interest Level</Text>
            <View style={styles.interestGrid}>
              {partnerInterestLevels.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.interestCard,
                    onboardingData.partnerInterestLevel === level.name && styles.selectedInterestCard
                  ]}
                  onPress={() => updateOnboardingData({ partnerInterestLevel: level.name })}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.interestText,
                    onboardingData.partnerInterestLevel === level.name && styles.selectedInterestText
                  ]}>
                    {level.name}
                  </Text>
                  <Text style={styles.interestDescription}>{level.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (
                onboardingData.selectedGenres.length === 0 ||
                onboardingData.favoriteAnime.length === 0 ||
                !onboardingData.characterArchetype ||
                !onboardingData.watchingStatus ||
                !onboardingData.partnerInterestLevel
              ) && styles.disabledButton
            ]}
            disabled={
              onboardingData.selectedGenres.length === 0 ||
              onboardingData.favoriteAnime.length === 0 ||
              !onboardingData.characterArchetype ||
              !onboardingData.watchingStatus ||
              !onboardingData.partnerInterestLevel
            }
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    gap: 22,
  },
  genreCard: {
    width: (width) / 4,
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedGenreCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  genreImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginBottom: 4,
  },
  genreText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  selectedGenreText: {
    color: colors.white,
    fontWeight: '600',
  },
  // Anime Cards
  animeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 22,
  },
  animeCard: {
    width: (width)/4,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 8,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  selectedAnimeCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  animeImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  animeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedAnimeText: {
    color: colors.white,
    fontWeight: '600',
  },
  selectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
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
  // Button
  buttonContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
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