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
const relationshipGoals = [
  { id: 1, name: 'Casual Dating', description: 'Fun and relaxed connections' },
  { id: 2, name: 'Serious Relationship', description: 'Looking for something long-term' },
  { id: 3, name: 'Friends First', description: 'Take it slow and build friendship' },
  { id: 4, name: 'Anime Buddy', description: 'Someone to watch anime with' }
];

const watchPartyAvailability = [
  { id: 1, name: 'Always!' },
  { id: 2, name: 'Sometimes' },
  { id: 3, name: 'Rarely' }
];

const FinalScreen = () => {
  const [onboardingData, setOnboardingData] = useState({
    relationshipGoal: '',
    watchPartyAvailable: ''
  });

  const updateOnboardingData = (updates) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };
     const handleNext = () => {
     router.replace('/(tabs)/discover'); // Navigate to the final screen
    };
  const handleCompleteOnboarding = () => {
    console.log('Onboarding completed!', onboardingData);
    // Add your completion logic here
  };

  const renderFinalScreen = () => (
    <View style={styles.phaseContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.phaseTitle}>Almost Done!</Text>
          <Text style={styles.phaseSubtitle}>Just a few more questions</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.fieldLabel}>Looking for:</Text>
          <View style={styles.optionGrid}>
            {relationshipGoals.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.goalCard,
                  onboardingData.relationshipGoal === goal.name && styles.selectedOptionCard
                ]}
                onPress={() => updateOnboardingData({ relationshipGoal: goal.name })}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.goalText,
                  onboardingData.relationshipGoal === goal.name && styles.selectedOptionText
                ]}>
                  {goal.name}
                </Text>
                <Text style={[
                  styles.goalDescription,
                  onboardingData.relationshipGoal === goal.name && styles.selectedDescriptionText
                ]}>
                  {goal.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.fieldLabel}>Available for watch parties?</Text>
          <View style={styles.optionRow}>
            {watchPartyAvailability.map((availability) => (
              <TouchableOpacity
                key={availability.id}
                style={[
                  styles.watchPartyCard,
                  onboardingData.watchPartyAvailable === availability.name && styles.selectedOptionCard
                ]}
                onPress={() => updateOnboardingData({ watchPartyAvailable: availability.name })}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.watchPartyText,
                  onboardingData.watchPartyAvailable === availability.name && styles.selectedOptionText
                ]}>
                  {availability.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By continuing, you agree to our Terms of Service and Privacy Policy.
              We'll send you notifications about matches and messages.
            </Text>
          </View>
        </View>
        
        <View style={{ marginTop: 40 }}>
          <TouchableOpacity
            style={[
              styles.finalButton,
              (
                !onboardingData.relationshipGoal ||
                !onboardingData.watchPartyAvailable
              ) && styles.disabledButton
            ]}
            disabled={
              !onboardingData.relationshipGoal ||
              !onboardingData.watchPartyAvailable
            }
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.finalButtonText}>
              Let's Go!
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  return renderFinalScreen();
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
  goalCard: {
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
  watchPartyCard: {
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
  selectedOptionCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  goalText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  watchPartyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  goalDescription: {
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
  termsContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  termsText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  finalButton: {
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
  finalButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: -0.3,
  },
});

export default FinalScreen;