import React, { useState } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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
  Animated,
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

export const BasicInfoScreen = ({Navigation}) => {
  const [onboardingData, setOnboardingData] = useState({
    displayName: '',
    gender: 'male',
    lookingFor: 'women',
    dateOfBirth: '',
    discoveryRadius: 50,
  });

  const [sliderValue, setSliderValue] = useState(50);

  const handleNext = () => {
     router.replace('/src/AnimePreferencesScreen');
    };

  const updateOnboardingData = (updates) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };

  const handleSliderChange = (value) => {
    setSliderValue(value);
    updateOnboardingData({ discoveryRadius: value });
  };

  const SliderComponent = () => {
    return (
      <View style={styles.sliderContainer}>
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>5km</Text>
          <Text style={styles.sliderLabel}>500km</Text>
        </View>
        <View style={styles.sliderTrack}>
          <View 
            style={[
              styles.sliderProgress, 
              { width: `${((sliderValue - 5) / 495) * 100}%` }
            ]} 
          />
          <TouchableOpacity
            style={[
              styles.sliderThumb,
              { left: `${((sliderValue - 5) / 495) * 100}%` }
            ]}
            onPress={() => {}}
          />
        </View>
      </View>
    );
  };

  const renderOptionGrid = (options, selectedValue, onSelect) => (
    <View style={styles.optionGrid}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.optionCard,
            selectedValue === option && styles.selectedOptionCard
          ]}
          onPress={() => onSelect(option)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.optionText,
            selectedValue === option && styles.selectedOptionText
          ]}>
            {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

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
          <Text style={styles.phaseTitle}>Basic Information</Text>
          <Text style={styles.phaseSubtitle}>Let's get to know you better</Text>
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          
          {/* Display Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Display Name / Username</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={onboardingData.displayName}
                onChangeText={(text) => updateOnboardingData({ displayName: text })}
                placeholder="Your anime name..."
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>

          {/* Gender Selection */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Gender</Text>
            {renderOptionGrid(
              ['male', 'female', 'non-binary', 'other'],
              onboardingData.gender,
              (value) => updateOnboardingData({ gender: value })
            )}
          </View>

          {/* Looking For Selection */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Looking For</Text>
            {renderOptionGrid(
              ['men', 'women', 'everyone'],
              onboardingData.lookingFor,
              (value) => updateOnboardingData({ lookingFor: value })
            )}
          </View>

          {/* Date of Birth Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.fieldLabel}>Date of Birth</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                value={onboardingData.dateOfBirth}
                onChangeText={(text) => updateOnboardingData({ dateOfBirth: text })}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={colors.textLight}
              />
            </View>
          </View>

        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!onboardingData.displayName || !onboardingData.dateOfBirth) && styles.disabledButton
            ]}
            disabled={!onboardingData.displayName || !onboardingData.dateOfBirth}
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
  inputContainer: {
    marginBottom: 32,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  radiusValue: {
    color: colors.primary,
    fontWeight: 'bold',
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
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
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
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: colors.white,
    fontWeight: '600',
  },
  sliderContainer: {
    marginTop: 8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sliderLabel: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  sliderTrack: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    position: 'relative',
    marginHorizontal: 8,
  },
  sliderProgress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 18,
    height: 18,
    backgroundColor: colors.white,
    borderRadius: 9,
    borderWidth: 3,
    borderColor: colors.primary,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginLeft: -9,
  },
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

export default BasicInfoScreen;