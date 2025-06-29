import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import colors from '@/constants/colors';
import { Gender, LookingFor, RelationshipGoal, SubDubPreference, WatchingStatus } from '@/types';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SignupStep1Props {
  fullname: string;
  setFullname: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  onNext: () => void;
  animatedValue: Animated.Value;
}

export const SignupStep1: React.FC<SignupStep1Props> = ({
  fullname,
  setFullname,
  username,
  setUsername,
  email,
  setEmail,
  onNext,
  animatedValue,
}) => {
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep = () => {
    return fullname.trim().length >= 2 &&
      username.trim().length >= 3 &&
      validateEmail(email.trim());
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <Animated.View
          style={[
            styles.stepContainer,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary + '15', colors.secondary + '15']}
            style={styles.card}
          >
            <View style={styles.stepHeader}>
              <View style={styles.iconContainer}>
                <Feather name="user" size={32} color={colors.primary} />
              </View>
              <Text style={styles.stepTitle}>Let's get to know you</Text>
            </View>

            <ScrollView
              style={styles.stepContent}
              contentContainerStyle={styles.scrollContentPadding}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Input
                label="Full Name"
                placeholder="What's your full name?"
                value={fullname}
                onChangeText={setFullname}
                leftIcon={<Feather name="user" size={20} color={colors.textLight} />}
                autoCapitalize="words"
                style={styles.input}
                returnKeyType="next"
              />

              <Input
                label="Username"
                placeholder="Choose a unique username"
                value={username}
                onChangeText={setUsername}
                leftIcon={<Feather name="at-sign" size={20} color={colors.textLight} />}
                autoCapitalize="none"
                style={styles.input}
                returnKeyType="next"
              />

              <Input
                label="Email"
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                leftIcon={<Feather name="mail" size={20} color={colors.textLight} />}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={handleNext}
              />
            </ScrollView>

            <View style={styles.buttonContainer}>
              <Button
                title="Continue"
                onPress={handleNext}
                disabled={!validateStep()}
                style={!validateStep() ? styles.continueButtonDisabled : styles.continueButton}
              />
            </View>
          </LinearGradient>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

interface SignupStep2Props {
  dob: string;
  setDob: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
  animatedValue: Animated.Value;
}

export const SignupStep2: React.FC<SignupStep2Props> = ({
  dob,
  setDob,
  onNext,
  onBack,
  animatedValue,
}) => {
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const validateDob = (dob: string) => {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(dob)) return false;

    const date = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return age >= 18 && age <= 100 && date <= today;
  };

  const validateStep = () => {
    return validateDob(dob);
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const formatDob = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');

    // Format as YYYY-MM-DD
    if (cleaned.length >= 8) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
    } else if (cleaned.length >= 6) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6)}`;
    } else if (cleaned.length >= 4) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    }
    return cleaned;
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 60 }, (_, i) => currentYear - 18 - i);
  };

  const generateMonths = () => {
    return [
      { value: '01', label: 'January' },
      { value: '02', label: 'February' },
      { value: '03', label: 'March' },
      { value: '04', label: 'April' },
      { value: '05', label: 'May' },
      { value: '06', label: 'June' },
      { value: '07', label: 'July' },
      { value: '08', label: 'August' },
      { value: '09', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' },
    ];
  };

  const generateDays = () => {
    return Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  };

  const selectDate = (type: 'year' | 'month' | 'day', value: string) => {
    const dobParts = dob.split('-');
    const year = type === 'year' ? value : (dobParts[0] || '');
    const month = type === 'month' ? value : (dobParts[1] || '');
    const day = type === 'day' ? value : (dobParts[2] || '');

    if (year && month && day) {
      setDob(`${year}-${month}-${day}`);
    } else if (year && month) {
      setDob(`${year}-${month}-01`);
    } else if (year) {
      setDob(`${year}-01-01`);
    }

    // Close all pickers
    setShowYearPicker(false);
    setShowMonthPicker(false);
    setShowDayPicker(false);
  };

  const closeAllPickers = () => {
    setShowYearPicker(false);
    setShowMonthPicker(false);
    setShowDayPicker(false);
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <Animated.View
          style={[
            styles.stepContainer,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.secondary + '15', colors.primary + '15']}
            style={styles.card}
          >
            <View style={styles.stepHeader}>
              <View style={styles.iconContainer}>
                <Feather name="calendar" size={32} color={colors.primary} />
              </View>
              <Text style={styles.stepTitle}>When's your birthday?</Text>
              <Text style={styles.stepSubtitle}>
                We need to verify you're 18 or older
              </Text>
            </View>

            <ScrollView
              style={styles.stepContent}
              contentContainerStyle={styles.scrollContentPadding}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Input
                label="Date of Birth"
                placeholder="YYYY-MM-DD (e.g., 1995-12-25)"
                value={dob}
                onChangeText={(text) => setDob(formatDob(text))}
                leftIcon={<Feather name="calendar" size={20} color={colors.textLight} />}
                style={styles.input}
                keyboardType="numeric"
                maxLength={10}
                returnKeyType="done"
              />

              <View style={styles.datePickerContainer}>
                <Text style={styles.selectLabel}>Or select your birth date:</Text>
                <View style={styles.datePickerRow}>
                  <View style={styles.dateColumn}>
                    <Text style={styles.dateLabel}>Year</Text>
                    <TouchableOpacity
                      style={styles.dateSelector}
                      onPress={() => {
                        closeAllPickers();
                        setShowYearPicker(true);
                      }}
                    >
                      <Text style={styles.dateSelectorText}>
                        {dob.split('-')[0] || 'Year'}
                      </Text>
                      <Feather name="chevron-down" size={16} color={colors.textLight} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dateColumn}>
                    <Text style={styles.dateLabel}>Month</Text>
                    <TouchableOpacity
                      style={styles.dateSelector}
                      onPress={() => {
                        closeAllPickers();
                        setShowMonthPicker(true);
                      }}
                    >
                      <Text style={styles.dateSelectorText}>
                        {generateMonths().find(m => m.value === dob.split('-')[1])?.label.slice(0, 3) || 'Month'}
                      </Text>
                      <Feather name="chevron-down" size={16} color={colors.textLight} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dateColumn}>
                    <Text style={styles.dateLabel}>Day</Text>
                    <TouchableOpacity
                      style={styles.dateSelector}
                      onPress={() => {
                        closeAllPickers();
                        setShowDayPicker(true);
                      }}
                    >
                      <Text style={styles.dateSelectorText}>
                        {dob.split('-')[2] || 'Day'}
                      </Text>
                      <Feather name="chevron-down" size={16} color={colors.textLight} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Year Picker Modal */}
              <Modal
                visible={showYearPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowYearPicker(false)}
              >
                <TouchableOpacity
                  style={styles.pickerOverlay}
                  activeOpacity={1}
                  onPress={() => setShowYearPicker(false)}
                >
                  <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.pickerContainer}>
                      <View style={styles.pickerHeader}>
                        <Text style={styles.pickerTitle}>Select Year</Text>
                        <TouchableOpacity onPress={() => setShowYearPicker(false)}>
                          <Feather name="x" size={24} color={colors.text} />
                        </TouchableOpacity>
                      </View>
                      <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                        {generateYears().map(year => (
                          <TouchableOpacity
                            key={year}
                            style={[
                              styles.pickerOption,
                              dob.split('-')[0] === year.toString() && styles.pickerOptionSelected
                            ]}
                            onPress={() => selectDate('year', year.toString())}
                          >
                            <Text style={[
                              styles.pickerOptionText,
                              dob.split('-')[0] === year.toString() && styles.pickerOptionTextSelected
                            ]}>
                              {year}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
              </Modal>

              {/* Month Picker Modal */}
              <Modal
                visible={showMonthPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowMonthPicker(false)}
              >
                <TouchableOpacity
                  style={styles.pickerOverlay}
                  activeOpacity={1}
                  onPress={() => setShowMonthPicker(false)}
                >
                  <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.pickerContainer}>
                      <View style={styles.pickerHeader}>
                        <Text style={styles.pickerTitle}>Select Month</Text>
                        <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                          <Feather name="x" size={24} color={colors.text} />
                        </TouchableOpacity>
                      </View>
                      <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                        {generateMonths().map(month => (
                          <TouchableOpacity
                            key={month.value}
                            style={[
                              styles.pickerOption,
                              dob.split('-')[1] === month.value && styles.pickerOptionSelected
                            ]}
                            onPress={() => selectDate('month', month.value)}
                          >
                            <Text style={[
                              styles.pickerOptionText,
                              dob.split('-')[1] === month.value && styles.pickerOptionTextSelected
                            ]}>
                              {month.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
              </Modal>

              {/* Day Picker Modal */}
              <Modal
                visible={showDayPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowDayPicker(false)}
              >
                <TouchableOpacity
                  style={styles.pickerOverlay}
                  activeOpacity={1}
                  onPress={() => setShowDayPicker(false)}
                >
                  <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                    <View style={styles.pickerContainer}>
                      <View style={styles.pickerHeader}>
                        <Text style={styles.pickerTitle}>Select Day</Text>
                        <TouchableOpacity onPress={() => setShowDayPicker(false)}>
                          <Feather name="x" size={24} color={colors.text} />
                        </TouchableOpacity>
                      </View>
                      <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                        {generateDays().map(day => (
                          <TouchableOpacity
                            key={day}
                            style={[
                              styles.pickerOption,
                              dob.split('-')[2] === day && styles.pickerOptionSelected
                            ]}
                            onPress={() => selectDate('day', day)}
                          >
                            <Text style={[
                              styles.pickerOptionText,
                              dob.split('-')[2] === day && styles.pickerOptionTextSelected
                            ]}>
                              {day}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
              </Modal>

              <Text style={styles.ageNote}>You must be 18 or older to use this app</Text>
            </ScrollView>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Feather name="arrow-left" size={20} color={colors.primary} />
              </TouchableOpacity>
              <Button
                title="Continue"
                onPress={handleNext}
                disabled={!validateStep()}
                style={!validateStep() ? styles.continueButtonRowDisabled : styles.continueButtonRow}
              />
            </View>
          </LinearGradient>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

interface SignupStep3Props {
  gender: Gender;
  setGender: (value: Gender) => void;
  lookingFor: LookingFor;
  setLookingFor: (value: LookingFor) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  watchingStatus: WatchingStatus;
  setWatchingStatus: (value: WatchingStatus) => void;
  subDubPreference: SubDubPreference;
  setSubDubPreference: (value: SubDubPreference) => void;
  relationshipGoal: RelationshipGoal;
  setRelationshipGoal: (value: RelationshipGoal) => void;
  onNext: () => void;
  onBack: () => void;
  animatedValue: Animated.Value;
}

export const SignupStep3: React.FC<SignupStep3Props> = ({
  gender,
  setGender,
  lookingFor,
  setLookingFor,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  watchingStatus,
  setWatchingStatus,
  subDubPreference,
  setSubDubPreference,
  relationshipGoal,
  setRelationshipGoal,
  onNext,
  onBack,
  animatedValue,
}) => {
  // Debug log
  console.log('SignupStep3 props:', { gender, setGender: typeof setGender, lookingFor, setLookingFor: typeof setLookingFor });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const validatePassword = (password: string) => {
    return password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
  };

  const validateStep = () => {
    return validatePassword(password) &&
      password === confirmPassword &&
      gender &&
      lookingFor &&
      watchingStatus &&
      subDubPreference &&
      relationshipGoal;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'Weak';
    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'Fair';
    return 'Strong';
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <Animated.View
          style={[
            styles.stepContainer,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          <LinearGradient
            colors={[colors.primary + '15', colors.secondary + '15']}
            style={styles.card}
          >
            <View style={styles.stepHeader}>
              <View style={styles.iconContainer}>
                <Feather name="shield" size={32} color={colors.primary} />
              </View>
              <Text style={styles.stepTitle}>Complete your profile</Text>
              <Text style={styles.stepSubtitle}>
                Set your password and preferences
              </Text>
            </View>

            <ScrollView
              style={styles.stepContent}
              contentContainerStyle={styles.scrollContentPadding}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>I am</Text>
                <View style={styles.optionsGrid}>
                  {Object.values(Gender).map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionCard,
                        gender === option && styles.optionCardSelected
                      ]}
                      onPress={() => setGender && setGender(option)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        gender === option && styles.optionTextSelected
                      ]}>
                        {option === 'MALE' ? '👨 Male' : option === 'FEMALE' ? '👩 Female' : '🌈 Other'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Looking for</Text>
                <View style={styles.optionsGrid}>
                  {Object.values(LookingFor).map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionCard,
                        lookingFor === option && styles.optionCardSelected
                      ]}
                      onPress={() => setLookingFor && setLookingFor(option)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        lookingFor === option && styles.optionTextSelected
                      ]}>
                        {option === 'MEN' ? '👨 Men' : option === 'WOMEN' ? '👩 Women' : '🌈 Everyone'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View>
                <Input
                  label="Password"
                  placeholder="Choose a secure password (8+ characters)"
                  value={password}
                  onChangeText={setPassword}
                  leftIcon={<Feather name="lock" size={20} color={colors.textLight} />}
                  isPassword
                  style={styles.input}
                  returnKeyType="next"
                />
                {password.length > 0 && (
                  <Text style={[
                    styles.passwordStrength,
                    passwordStrength === 'Weak' && styles.weakPassword,
                    passwordStrength === 'Fair' && styles.fairPassword,
                    passwordStrength === 'Strong' && styles.strongPassword,
                  ]}>
                    Password strength: {passwordStrength}
                  </Text>
                )}
              </View>

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                leftIcon={<Feather name="lock" size={20} color={colors.textLight} />}
                isPassword
                style={styles.input}
                returnKeyType="done"
              />
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <Text style={styles.errorText}>Passwords don't match</Text>
              )}

              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Watching Status</Text>
                <View style={styles.optionsWrap}>
                  {Object.values(WatchingStatus).map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionChip,
                        watchingStatus === option && styles.optionChipSelected
                      ]}
                      onPress={() => setWatchingStatus(option)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionChipText,
                        watchingStatus === option && styles.optionChipTextSelected
                      ]}>
                        {option.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Sub or Dub?</Text>
                <View style={styles.optionsRow}>
                  {Object.values(SubDubPreference).map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionCard,
                        subDubPreference === option && styles.optionCardSelected
                      ]}
                      onPress={() => setSubDubPreference(option)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        subDubPreference === option && styles.optionTextSelected
                      ]}>
                        {option === 'SUB' ? '🎌 Subtitles' : '🎙️ Dubbed'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Relationship Goal</Text>
                <View style={styles.optionsWrap}>
                  {Object.values(RelationshipGoal).map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionChip,
                        relationshipGoal === option && styles.optionChipSelected
                      ]}
                      onPress={() => setRelationshipGoal(option)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionChipText,
                        relationshipGoal === option && styles.optionChipTextSelected
                      ]}>
                        {option.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                <Feather name="arrow-left" size={20} color={colors.primary} />
              </TouchableOpacity>
              <Button
                title="Create Account"
                onPress={handleNext}
                disabled={!validateStep()}
                style={!validateStep() ? styles.continueButtonRowDisabled : styles.continueButtonRow}
              />
            </View>
          </LinearGradient>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
    backgroundColor: colors.background,
    height: screenHeight * 0.75,
    justifyContent: 'space-between',
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  stepContent: {
    flex: 1,
    paddingVertical: 8,
  },
  scrollContentPadding: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  buttonContainer: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  input: {
    marginBottom: 20,
  },
  selectContainer: {
    marginBottom: 20,
  },
  selectLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'left',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    minWidth: screenWidth * 0.20,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 44,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
  },
  optionChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  optionChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  optionChipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    textTransform: 'capitalize',
    textAlign: 'center',
    lineHeight: 18,
  },
  optionChipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  continueButton: {
    borderRadius: 16,
    paddingVertical: 18,
    marginVertical: 4,
  },
  continueButtonDisabled: {
    borderRadius: 16,
    paddingVertical: 18,
    marginVertical: 4,
    opacity: 0.5,
  },
  continueButtonRow: {
    flex: 1,
    marginLeft: 12,
    borderRadius: 16,
    paddingVertical: 18,
  },
  continueButtonRowDisabled: {
    flex: 1,
    marginLeft: 12,
    borderRadius: 16,
    paddingVertical: 18,
    opacity: 0.5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  passwordStrength: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '500',
  },
  weakPassword: {
    color: '#ff4444',
  },
  fairPassword: {
    color: '#ffaa00',
  },
  strongPassword: {
    color: '#00aa00',
  },
  errorText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 4,
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '500',
  },
  ageNote: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePickerRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  dateColumn: {
    flex: 1,
    position: 'relative',
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
    minHeight: 48,
  },
  dateSelectorText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  pickerModal: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    maxHeight: 150,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pickerScroll: {
    maxHeight: 150,
  },
  pickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '30',
  },
  pickerOptionText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: colors.background,
    borderRadius: 16,
    maxHeight: 400,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  pickerOptionSelected: {
    backgroundColor: colors.primary + '20',
  },
  pickerOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});