import colors from '@/constants/colors';
import { router, useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import {
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Color palette
// const colors = {
//   primary: '#8A6FDF',
//   secondary: '#FFA6C9',
//   background: '#FFFFFF',
//   card: '#F8F8F8',
//   text: '#333333',
//   textLight: '#777777',
//   border: '#EEEEEE',
//   success: '#4CAF50',
//   error: '#F44336',
//   warning: '#FFC107',
//   info: '#2196F3',
//   overlay: 'rgba(0, 0, 0, 0.5)',
//   transparent: 'transparent',
//   white: '#FFFFFF',
//   gradientStart: '#8A6FDF',
//   gradientEnd: '#FFA6C9',
// };

// Data arrays with enhanced visual elements
const animeWorlds = [
  { id: 1, name: 'Attack on Titan', description: 'Fight titans together', emoji: '⚔️' },
  { id: 2, name: 'My Hero Academia', description: 'Be heroes with quirks', emoji: '🦸' },
  { id: 3, name: 'Demon Slayer', description: 'Slay demons as a duo', emoji: '👺' },
  { id: 4, name: 'One Piece', description: 'Sail the Grand Line', emoji: '🏴‍☠️' },
  { id: 5, name: 'Naruto', description: 'Train as ninja partners', emoji: '🥷' },
  { id: 6, name: 'Studio Ghibli', description: 'Magical peaceful world', emoji: '🌟' }
];

const conventionOptions = [
  { id: 1, name: 'Absolutely!', emoji: '🎉' },
  { id: 2, name: 'Maybe', emoji: '🤔' },
  { id: 3, name: 'Not really', emoji: '😅' }
];

const subDubPreferences = [
  { id: 1, name: 'Sub only', description: 'Original voices matter', emoji: '🇯🇵' },
  { id: 2, name: 'Dub only', description: 'English all the way', emoji: '🇺🇸' },
  { id: 3, name: 'Both', description: 'Best of both worlds', emoji: '🌍' }
];

const dateIdeas = [
  { id: 1, name: 'Anime Marathon', description: 'Binge watch together', emoji: '📺' },
  { id: 2, name: 'Cosplay Date', description: 'Dress up as characters', emoji: '🎭' },
  { id: 3, name: 'Anime Cafe', description: 'Themed restaurant visit', emoji: '☕' },
  { id: 4, name: 'Manga Shopping', description: 'Browse bookstores together', emoji: '📚' }
];

const CompatibilityScreen = () => {
  const [onboardingData, setOnboardingData] = useState({
    animeWorld: '',
    conventionInterest: '',
    subOrDub: '',
    favoriteOpening: '',
    dateIdea: ''
  });

  // Prevent going back during onboarding
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Return true to prevent default back behavior
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription?.remove();
    }, [])
  );

  const updateOnboardingData = (updates) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };

  const handlePhaseTransition = (phase) => {
    console.log('Transitioning to:', phase);
    // Add your navigation logic here
  };
  const handleNext = () => {
    router.replace('/src/FinalScreen'); // Navigate to the final screen
  };

  const renderCompatibilityScreen = () => (
    <View style={styles.phaseContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '75%' }]} />
        </View>
        <Text style={styles.stepIndicator}>Step 3 of 5</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleContainer}>
          <Text style={styles.phaseTitle}>Compatibility Questions</Text>
          <Text style={styles.phaseSubtitle}>Let's find your perfect anime match! 💕</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.fieldLabel}>Which anime world would you live in?</Text>
          <View style={styles.optionGrid}>
            {animeWorlds.map((world) => (
              <TouchableOpacity
                key={world.id}
                style={[
                  styles.worldCard,
                  onboardingData.animeWorld === world.name && styles.selectedOptionCard
                ]}
                onPress={() => updateOnboardingData({ animeWorld: world.name })}
                activeOpacity={0.7}
              >
                <Text style={styles.cardEmoji}>{world.emoji}</Text>
                <Text style={[
                  styles.worldText,
                  onboardingData.animeWorld === world.name && styles.selectedOptionText
                ]}>
                  {world.name}
                </Text>
                <Text style={[
                  styles.worldDescription,
                  onboardingData.animeWorld === world.name && styles.selectedDescriptionText
                ]}>
                  {world.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Would you attend a real anime convention with your partner?</Text>
          <View style={styles.optionRow}>
            {conventionOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.conventionCard,
                  onboardingData.conventionInterest === option.name && styles.selectedOptionCard
                ]}
                onPress={() => updateOnboardingData({ conventionInterest: option.name })}
                activeOpacity={0.7}
              >
                <Text style={styles.cardEmoji}>{option.emoji}</Text>
                <Text style={[
                  styles.conventionText,
                  onboardingData.conventionInterest === option.name && styles.selectedOptionText
                ]}>
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Sub or Dub?</Text>
          <View style={styles.optionRow}>
            {subDubPreferences.map((pref) => (
              <TouchableOpacity
                key={pref.id}
                style={[
                  styles.subDubCard,
                  onboardingData.subOrDub === pref.name && styles.selectedOptionCard
                ]}
                onPress={() => updateOnboardingData({ subOrDub: pref.name })}
                activeOpacity={0.7}
              >
                <Text style={styles.cardEmoji}>{pref.emoji}</Text>
                <Text style={[
                  styles.subDubText,
                  onboardingData.subOrDub === pref.name && styles.selectedOptionText
                ]}>
                  {pref.name}
                </Text>
                <Text style={[
                  styles.subDubDescription,
                  onboardingData.subOrDub === pref.name && styles.selectedDescriptionText
                ]}>
                  {pref.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>What's your favorite anime opening/ending song? (Optional)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={onboardingData.favoriteOpening || ''}
                onChangeText={(text) => updateOnboardingData({ favoriteOpening: text })}
                placeholder="Song name or anime title..."
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>

          <Text style={styles.fieldLabel}>Anime Date Idea</Text>
          <View style={styles.optionGrid}>
            {dateIdeas.map((idea) => (
              <TouchableOpacity
                key={idea.id}
                style={[
                  styles.dateCard,
                  onboardingData.dateIdea === idea.name && styles.selectedOptionCard
                ]}
                onPress={() => updateOnboardingData({ dateIdea: idea.name })}
                activeOpacity={0.7}
              >
                <Text style={styles.cardEmoji}>{idea.emoji}</Text>
                <Text style={[
                  styles.dateText,
                  onboardingData.dateIdea === idea.name && styles.selectedOptionText
                ]}>
                  {idea.name}
                </Text>
                <Text style={[
                  styles.dateDescription,
                  onboardingData.dateIdea === idea.name && styles.selectedDescriptionText
                ]}>
                  {idea.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ marginTop: 40 }}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (
                !onboardingData.animeWorld ||
                !onboardingData.conventionInterest ||
                !onboardingData.subOrDub ||
                !onboardingData.dateIdea
              ) && styles.disabledButton
            ]}
            disabled={
              !onboardingData.animeWorld ||
              !onboardingData.conventionInterest ||
              !onboardingData.subOrDub ||
              !onboardingData.dateIdea
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

  return renderCompatibilityScreen();
};

const styles = StyleSheet.create({
  phaseContainer: {
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
  fieldLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    marginTop: 32,
    letterSpacing: -0.3,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 8,
    textAlign: 'center',
  },
  worldCard: {
    flex: 1,
    minWidth: (width - 40 - 16) / 2,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  conventionCard: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  subDubCard: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  dateCard: {
    flex: 1,
    minWidth: (width - 40 - 16) / 2,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  selectedOptionCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  worldText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  conventionText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subDubText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  worldDescription: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  subDubDescription: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  dateDescription: {
    fontSize: 13,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: colors.white,
    fontWeight: '700',
  },
  selectedDescriptionText: {
    color: colors.white,
    opacity: 0.95,
    fontWeight: '600',
  },
  inputContainer: {
    marginTop: 32,
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  textInput: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.3,
  },
});

export default CompatibilityScreen;