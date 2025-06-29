import { Button } from '@/components/Button';
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
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const BasicInfoScreen = () => {
  const [onboardingData, setOnboardingData] = useState({
    bio: '',
    hobbies: '',
    profession: '',
    favoriteQuote: '',
  });

  // Prevent going back to auth screen during onboarding
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

  const handleNext = () => {
    router.replace('/src/AnimePreferencesScreen');
  };

  const updateOnboardingData = (updates) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };

  return (
    <View style={styles.container}>
      {/* Header with gradient background */}
      <View style={styles.header}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
        <Text style={styles.stepIndicator}>Step 2 of 6</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.phaseTitle}>Tell Us About Yourself</Text>
          <Text style={styles.phaseSubtitle}>Help others get to know you better</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>

          {/* Bio Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <Text style={styles.fieldDescription}>Write a short description about yourself</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={onboardingData.bio}
                onChangeText={(text) => updateOnboardingData({ bio: text })}
                placeholder="Tell people about yourself, your interests, what makes you unique..."
                placeholderTextColor={colors.textLight}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Hobbies Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Hobbies & Interests</Text>
            <Text style={styles.fieldDescription}>What do you love doing in your free time?</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={onboardingData.hobbies}
                onChangeText={(text) => updateOnboardingData({ hobbies: text })}
                placeholder="Gaming, reading, traveling, cooking..."
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>

          {/* Profession Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Profession</Text>
            <Text style={styles.fieldDescription}>What do you do for work or study?</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={onboardingData.profession}
                onChangeText={(text) => updateOnboardingData({ profession: text })}
                placeholder="Software Developer, Student, Teacher..."
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>

          {/* Favorite Quote Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Favorite Quote or Motto</Text>
            <Text style={styles.fieldDescription}>Something that inspires you or represents your philosophy</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={onboardingData.favoriteQuote}
                onChangeText={(text) => updateOnboardingData({ favoriteQuote: text })}
                placeholder="A quote from your favorite anime character or personal motto..."
                placeholderTextColor={colors.textLight}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleNext}
            style={styles.continueButton}
            disabled={!onboardingData.bio.trim() || !onboardingData.profession.trim()}
          />
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
  inputContainer: {
    marginBottom: 32,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  fieldDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 12,
    lineHeight: 20,
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
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 40,
    paddingHorizontal: 0,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
});

export default BasicInfoScreen;