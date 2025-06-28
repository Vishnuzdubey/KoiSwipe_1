import React, { useState } from 'react';
import { router } from 'expo-router';
import { Button } from 'react-native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
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

// Data arrays
const animeWorlds = [
  { id: 1, name: 'Attack on Titan', description: 'Fight titans together' },
  { id: 2, name: 'My Hero Academia', description: 'Be heroes with quirks' },
  { id: 3, name: 'Demon Slayer', description: 'Slay demons as a duo' },
  { id: 4, name: 'One Piece', description: 'Sail the Grand Line' },
  { id: 5, name: 'Naruto', description: 'Train as ninja partners' },
  { id: 6, name: 'Studio Ghibli', description: 'Magical peaceful world' }
];

const conventionOptions = [
  { id: 1, name: 'Absolutely!' },
  { id: 2, name: 'Maybe' },
  { id: 3, name: 'Not really' }
];

const subDubPreferences = [
  { id: 1, name: 'Sub only', description: 'Original voices matter' },
  { id: 2, name: 'Dub only', description: 'English all the way' },
  { id: 3, name: 'Both', description: 'Best of both worlds' }
];

const dateIdeas = [
  { id: 1, name: 'Anime Marathon', description: 'Binge watch together' },
  { id: 2, name: 'Cosplay Date', description: 'Dress up as characters' },
  { id: 3, name: 'Anime Cafe', description: 'Themed restaurant visit' },
  { id: 4, name: 'Manga Shopping', description: 'Browse bookstores together' }
];

const CompatibilityScreen = () => {
  const [onboardingData, setOnboardingData] = useState({
    animeWorld: '',
    conventionInterest: '',
    subOrDub: '',
    favoriteOpening: '',
    dateIdea: ''
  });

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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.phaseTitle}>Compatibility Questions</Text>
          <Text style={styles.phaseSubtitle}>Let's find your perfect anime match!</Text>
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
    marginTop:40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginTop: 24,
    letterSpacing: -0.2,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  worldCard: {
    flex: 1,
    minWidth: (width - 64) / 2,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  conventionCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  subDubCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dateCard: {
    flex: 1,
    minWidth: (width - 64) / 2,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedOptionCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  worldText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  conventionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  subDubText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  worldDescription: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  subDubDescription: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  dateDescription: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedOptionText: {
    color: colors.white,
    fontWeight: '600',
  },
  selectedDescriptionText: {
    color: colors.white,
    opacity: 0.9,
  },
  inputContainer: {
    marginTop: 24,
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  textInput: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
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

export default CompatibilityScreen;