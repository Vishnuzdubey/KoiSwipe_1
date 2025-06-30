import { Button } from '@/components/Button';
import colors from '@/constants/colors';
import { Gender, LookingFor, RelationshipGoal, SubDubPreference, WatchingStatus } from '@/types';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

  const validateStep = () => {
    if (!fullname.trim() || !username.trim() || !email.includes('@')) {
      return false;
    }
    return true;
  };

  const getValidationMessage = () => {
    if (!fullname.trim()) return 'Please enter your full name';
    if (!username.trim()) return 'Please enter a username';
    if (!email.includes('@')) return 'Please enter a valid email address';
    return null;
  };

  const validationMessage = getValidationMessage();
  const buttonStyle = validateStep()
    ? styles.continueButton
    : { ...styles.continueButton, ...styles.disabledButton };

  return (
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
          <Text style={styles.stepSubtitle}>
            Tell us a bit about yourself to get started
          </Text>
        </View>

        <ScrollView
          style={styles.stepContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="What's your full name?"
                placeholderTextColor={colors.textLight}
                value={fullname}
                onChangeText={setFullname}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Username</Text>
            <View style={styles.inputWrapper}>
              <Feather name="at-sign" size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Choose a unique username"
                placeholderTextColor={colors.textLight}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="your.email@example.com"
                placeholderTextColor={colors.textLight}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>
        </ScrollView>

        {validationMessage && (
          <View style={styles.validationContainer}>
            <Feather name="info" size={16} color={colors.warning} />
            <Text style={styles.validationText}>{validationMessage}</Text>
          </View>
        )}

        <Button
          title="Continue"
          onPress={onNext}
          disabled={!validateStep()}
          style={buttonStyle}
        />
      </LinearGradient>
    </Animated.View>
  );
};

interface SignupStep2Props {
  dob: string;
  setDob: (value: string) => void;
  gender: Gender;
  setGender: (value: Gender) => void;
  lookingFor: LookingFor;
  setLookingFor: (value: LookingFor) => void;
  onNext: () => void;
  onBack: () => void;
  animatedValue: Animated.Value;
}

export const SignupStep2: React.FC<SignupStep2Props> = ({
  dob,
  setDob,
  gender,
  setGender,
  lookingFor,
  setLookingFor,
  onNext,
  onBack,
  animatedValue,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(2000);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);

  // Generate arrays for picker options
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Calculate days in selected month/year
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const validateStep = () => {
    return dob && dob.length === 10;
  };

  const getValidationMessage = () => {
    if (!dob || dob.length !== 10) return 'Please select your date of birth';
    return null;
  };

  const validationMessage = getValidationMessage();

  const openDatePicker = () => {
    // Parse existing date if available
    if (dob) {
      const parts = dob.split('-');
      if (parts.length === 3) {
        setSelectedYear(parseInt(parts[0]));
        setSelectedMonth(parseInt(parts[1]));
        setSelectedDay(parseInt(parts[2]));
      }
    }
    setShowDatePicker(true);
  };

  const confirmDate = () => {
    const formattedDate = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
    setDob(formattedDate);
    setShowDatePicker(false);
  };

  const cancelDate = () => {
    setShowDatePicker(false);
  };

  const buttonStyle = validateStep()
    ? styles.continueButtonRow
    : { ...styles.continueButtonRow, ...styles.disabledButton };

  return (
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
            <Feather name="heart" size={32} color={colors.primary} />
          </View>
          <Text style={styles.stepTitle}>About your preferences</Text>
          <Text style={styles.stepSubtitle}>
            Help us find your perfect anime match
          </Text>
        </View>

        <ScrollView
          style={styles.stepContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Date of Birth</Text>
            <TouchableOpacity
              style={styles.inputWrapper}
              onPress={openDatePicker}
              activeOpacity={0.7}
            >
              <Feather name="calendar" size={20} color={colors.textLight} style={styles.inputIcon} />
              <View style={styles.dateInputDisplay}>
                <Text style={[
                  styles.dateInputText,
                  !dob && styles.placeholderText
                ]}>
                  {dob || 'YYYY-MM-DD (e.g., 2002-12-02)'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

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
                  onPress={() => setGender(option)}
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
                  onPress={() => setLookingFor(option)}
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
        </ScrollView>

        {validationMessage && (
          <View style={styles.validationContainer}>
            <Feather name="info" size={16} color={colors.warning} />
            <Text style={styles.validationText}>{validationMessage}</Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Feather name="arrow-left" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Button
            title="Continue"
            onPress={onNext}
            disabled={!validateStep()}
            style={buttonStyle}
          />
        </View>
      </LinearGradient>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={cancelDate}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date of Birth</Text>
              <TouchableOpacity onPress={cancelDate}>
                <Feather name="x" size={24} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <View style={styles.datePickerContainer}>
              <View style={styles.pickerRow}>
                {/* Year Picker */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Year</Text>
                  <ScrollView
                    style={styles.pickerScrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.pickerContent}
                  >
                    {years.map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.pickerItem,
                          selectedYear === year && styles.pickerItemSelected
                        ]}
                        onPress={() => setSelectedYear(year)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedYear === year && styles.pickerItemTextSelected
                        ]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Month Picker */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Month</Text>
                  <ScrollView
                    style={styles.pickerScrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.pickerContent}
                  >
                    {months.map((month) => (
                      <TouchableOpacity
                        key={month.value}
                        style={[
                          styles.pickerItem,
                          selectedMonth === month.value && styles.pickerItemSelected
                        ]}
                        onPress={() => setSelectedMonth(month.value)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedMonth === month.value && styles.pickerItemTextSelected
                        ]}>
                          {month.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Day Picker */}
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Day</Text>
                  <ScrollView
                    style={styles.pickerScrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.pickerContent}
                  >
                    {days.map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.pickerItem,
                          selectedDay === day && styles.pickerItemSelected
                        ]}
                        onPress={() => setSelectedDay(day)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.pickerItemText,
                          selectedDay === day && styles.pickerItemTextSelected
                        ]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={cancelDate}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={confirmDate}>
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

interface SignupStep3Props {
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
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const validateStep = () => {
    return password.length >= 4 && password === confirmPassword;
  };

  const getValidationMessage = () => {
    if (password.length < 4) return 'Password must be at least 4 characters long';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const validationMessage = getValidationMessage();

  const buttonStyle = validateStep()
    ? styles.continueButtonRow
    : { ...styles.continueButtonRow, ...styles.disabledButton };

  return (
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
          <Text style={styles.stepTitle}>Secure your account</Text>
          <Text style={styles.stepSubtitle}>
            Set your password and anime preferences
          </Text>
        </View>

        <ScrollView
          style={styles.stepContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Choose a secure password"
                placeholderTextColor={colors.textLight}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputWrapper}>
              <Feather name="lock" size={20} color={colors.textLight} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Confirm your password"
                placeholderTextColor={colors.textLight}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
              />
            </View>
          </View>

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

        {validationMessage && (
          <View style={styles.validationContainer}>
            <Feather name="info" size={16} color={colors.warning} />
            <Text style={styles.validationText}>{validationMessage}</Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Feather name="arrow-left" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Button
            title="Create Account"
            onPress={onNext}
            disabled={!validateStep()}
            style={buttonStyle}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
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
    backgroundColor: colors.card,
    maxHeight: screenHeight * 0.9,
    minHeight: screenHeight * 0.7,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 2,
    paddingBottom: 16,
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
  },
  stepContent: {
    flex: 1,
    marginBottom: 20,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 12,
    color: colors.text,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontFamily: 'System',
    minHeight: 24,
  },
  dateInputDisplay: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 24,
  },
  dateInputText: {
    fontSize: 16,
    color: colors.text,
    fontFamily: 'System',
  },
  placeholderText: {
    color: colors.textLight,
  },
  selectContainer: {
    marginBottom: 28,
  },
  selectLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionCard: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 60,
    justifyContent: 'center',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
  },
  optionChip: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    marginBottom: 10,
    minHeight: 44,
    justifyContent: 'center',
  },
  optionChipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '15',
  },
  optionText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  optionChipText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  optionChipTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  continueButton: {
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 16,
  },
  continueButtonRow: {
    flex: 1,
    marginLeft: 12,
    borderRadius: 16,
    paddingVertical: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  datePickerContainer: {
    marginBottom: 24,
  },
  pickerRow: {
    flexDirection: 'row',
    gap: 12,
    height: 200,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    marginBottom: 8,
    textAlign: 'center',
  },
  pickerScrollView: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  pickerContent: {
    paddingVertical: 8,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  pickerItemSelected: {
    backgroundColor: colors.primary + '15',
  },
  pickerItemText: {
    fontSize: 10,
    color: colors.text,
    fontWeight: '500',
  },
  pickerItemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textLight,
  },
  modalConfirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white || '#FFFFFF',
  },
  validationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '15',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.warning + '30',
  },
  validationText: {
    fontSize: 14,
    color: colors.warning,
    marginLeft: 8,
    fontWeight: '500',
    flex: 1,
  },
});