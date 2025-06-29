import { Button } from '@/components/Button';
import colors from '@/constants/colors';
import { useAppStore } from '@/store/app-store';
import { router, useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import {
  BackHandler,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Data arrays for final questions (excluding already asked fields)
const watchPartyAvailability = [
  { id: 1, name: 'Always!', description: 'Love watching with others', emoji: '🍿' },
  { id: 2, name: 'Sometimes', description: 'Depends on my mood', emoji: '🤷' },
  { id: 3, name: 'Rarely', description: 'Prefer watching alone', emoji: '🙈' }
];

const communicationStyles = [
  { id: 1, name: 'Daily Chatter', description: 'Love texting throughout the day', emoji: '💬' },
  { id: 2, name: 'Quality Conversations', description: 'Prefer deeper, less frequent talks', emoji: '💭' },
  { id: 3, name: 'Flexible', description: 'Adapt to my partner\'s style', emoji: '🌊' }
];

const meetupTimeframes = [
  { id: 1, name: 'Within a week', description: 'Let\'s meet soon!', emoji: '⚡' },
  { id: 2, name: 'Within a month', description: 'Take some time to chat first', emoji: '📅' },
  { id: 3, name: 'When we\'re ready', description: 'No rush, let it happen naturally', emoji: '🌱' }
];

const FinalScreen = () => {
  const [onboardingData, setOnboardingData] = useState({
    watchPartyAvailable: '',
    communicationStyle: '',
    meetupTimeframe: '',
    isOver18: false
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

  const completeOnboarding = useAppStore((state) => state.completeOnboarding);

  const updateOnboardingData = (updates) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };

  const handleCompleteOnboarding = async () => {
    try {
      // Mark onboarding as complete in the app store
      completeOnboarding();

      // Navigate to the main app
      router.replace('/(tabs)/discover');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <View style={styles.phaseContainer}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
        <Text style={styles.stepIndicator}>Step 4 of 5</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.phaseTitle}>Almost Done! 🎉</Text>
          <Text style={styles.phaseSubtitle}>Just a few final questions</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Watch Party Availability */}
          <Text style={styles.fieldLabel}>Available for anime watch parties?</Text>
          <View style={styles.optionRow}>
            {watchPartyAvailability.map((availability) => (
              <TouchableOpacity
                key={availability.id}
                style={[
                  styles.optionCard,
                  onboardingData.watchPartyAvailable === availability.name && styles.selectedOptionCard
                ]}
                onPress={() => updateOnboardingData({ watchPartyAvailable: availability.name })}
                activeOpacity={0.7}
              >
                <Text style={styles.cardEmoji}>{availability.emoji}</Text>
                <Text style={[
                  styles.optionText,
                  onboardingData.watchPartyAvailable === availability.name && styles.selectedOptionText
                ]}>
                  {availability.name}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  onboardingData.watchPartyAvailable === availability.name && styles.selectedDescriptionText
                ]}>
                  {availability.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Communication Style */}
          <Text style={styles.fieldLabel}>How do you like to communicate?</Text>
          <View style={styles.optionGrid}>
            {communicationStyles.map((style) => (
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.optionCard,
                  onboardingData.communicationStyle === style.name && styles.selectedOptionCard
                ]}
                onPress={() => updateOnboardingData({ communicationStyle: style.name })}
                activeOpacity={0.7}
              >
                <Text style={styles.cardEmoji}>{style.emoji}</Text>
                <Text style={[
                  styles.optionText,
                  onboardingData.communicationStyle === style.name && styles.selectedOptionText
                ]}>
                  {style.name}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  onboardingData.communicationStyle === style.name && styles.selectedDescriptionText
                ]}>
                  {style.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Meetup Timeframe */}
          <Text style={styles.fieldLabel}>When would you like to meet matches in person?</Text>
          <View style={styles.optionGrid}>
            {meetupTimeframes.map((timeframe) => (
              <TouchableOpacity
                key={timeframe.id}
                style={[
                  styles.optionCard,
                  onboardingData.meetupTimeframe === timeframe.name && styles.selectedOptionCard
                ]}
                onPress={() => updateOnboardingData({ meetupTimeframe: timeframe.name })}
                activeOpacity={0.7}
              >
                <Text style={styles.cardEmoji}>{timeframe.emoji}</Text>
                <Text style={[
                  styles.optionText,
                  onboardingData.meetupTimeframe === timeframe.name && styles.selectedOptionText
                ]}>
                  {timeframe.name}
                </Text>
                <Text style={[
                  styles.optionDescription,
                  onboardingData.meetupTimeframe === timeframe.name && styles.selectedDescriptionText
                ]}>
                  {timeframe.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Age Confirmation */}
          <TouchableOpacity
            style={[
              styles.checkboxContainer,
              onboardingData.isOver18 && styles.selectedCheckboxContainer
            ]}
            onPress={() => updateOnboardingData({ isOver18: !onboardingData.isOver18 })}
            activeOpacity={0.7}
          >
            <View style={[
              styles.checkbox,
              onboardingData.isOver18 && styles.selectedCheckbox
            ]}>
              {onboardingData.isOver18 && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={styles.checkboxText}>
              I confirm that I am 18 years or older
            </Text>
          </TouchableOpacity>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
              We'll send you notifications about matches and messages.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Let's Go! 🚀"
            onPress={handleCompleteOnboarding}
            style={styles.finalButton}
            disabled={
              !onboardingData.watchPartyAvailable ||
              !onboardingData.communicationStyle ||
              !onboardingData.meetupTimeframe ||
              !onboardingData.isOver18
            }
          />
        </View>
      </ScrollView>
    </View>
  );
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
  optionCard: {
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
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  optionDescription: {
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingVertical: 20,
    paddingHorizontal: 20,
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
  selectedCheckboxContainer: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  selectedCheckbox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
    lineHeight: 22,
  },
  termsContainer: {
    marginTop: 32,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  termsText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 40,
    paddingHorizontal: 0,
  },
  finalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
});

export default FinalScreen;