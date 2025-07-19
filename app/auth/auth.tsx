import { Button } from '@/components/Button';
import colors from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { Gender, LookingFor, RelationshipGoal, SubDubPreference, WatchingStatus } from '@/types';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

type AuthMode = 'login' | 'signup' | 'forgotPassword' | 'verifyOtp' | 'resetPassword';

export default function AuthScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [lookingFor, setLookingFor] = useState<LookingFor>(LookingFor.WOMEN);
  const [watchingStatus, setWatchingStatus] = useState<WatchingStatus>(WatchingStatus.BINGE_WATCHER);
  const [subDubPreference, setSubDubPreference] = useState<SubDubPreference>(SubDubPreference.SUB);
  const [relationshipGoal, setRelationshipGoal] = useState<RelationshipGoal>(RelationshipGoal.SERIOUS_RELATIONSHIP);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpType, setOtpType] = useState<'signup' | 'resetpassword'>('signup');

  // Signup flow state
  const [signupStep, setSignupStep] = useState(1);
  const stepAnimation = useRef(new Animated.Value(1)).current;
  const progressAnimation = useRef(new Animated.Value(1)).current;

  const { login, signUp, sendOtp, resendOtp, verifyOtp, resetPassword, isLoading, error, clearError, resendCooldown, isResending } = useAuthStore();
  const navigation = useNavigation();

  // Animate step transitions
  useEffect(() => {
    Animated.parallel([
      Animated.spring(stepAnimation, {
        toValue: 1,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(progressAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  }, [signupStep]);

  const animateToNextStep = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(stepAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(progressAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      callback();
      stepAnimation.setValue(0);
      progressAnimation.setValue(0);
    });
  };

  const handleNextStep = () => {
    if (signupStep < 3) {
      animateToNextStep(() => {
        setSignupStep(signupStep + 1);
      });
    }
  };

  const handlePrevStep = () => {
    if (signupStep > 1) {
      animateToNextStep(() => {
        setSignupStep(signupStep - 1);
      });
    }
  };

  const validateForm = () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (authMode === 'signup') {
      if (!fullname.trim()) {
        Alert.alert('Error', 'Please enter your full name');
        return false;
      }
      if (!username.trim()) {
        Alert.alert('Error', 'Please enter a username');
        return false;
      }
      if (!dob) {
        Alert.alert('Error', 'Please enter your date of birth (YYYY-MM-DD)');
        return false;
      }
      if (password.length < 4) {
        Alert.alert('Error', 'Password must be at least 4 characters long');
        return false;
      }
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
    } else if (authMode === 'login') {
      if (!password) {
        Alert.alert('Error', 'Please enter your password');
        return false;
      }
    }

    return true;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    clearError();

    if (authMode === 'login') {
      const result = await login(email, password);
      // Check the store state after the async operation
      const { error: loginError } = useAuthStore.getState();
      if (!loginError) {
        router.replace('/(tabs)');
      }
    } else if (authMode === 'signup' && signupStep === 3) {
      // First send OTP for email verification
      setOtpType('signup');
      await sendOtp(email, 'signup');
      const { error: otpError } = useAuthStore.getState();
      if (!otpError) {
        setAuthMode('verifyOtp');
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP');
      return;
    }

    await verifyOtp(email, otp);
    const { error: verifyError } = useAuthStore.getState();
    if (!verifyError) {
      // After OTP verification, proceed with signup
      const signUpData = {
        email,
        password,
        fullname,
        username,
        dob,
        gender,
        lookingFor,
        latitude: 28.483262, // Default location - you can get from user's location
        longitude: 77.510977,
        watchingStatus,
        subDubPreference,
        relationshipGoal,
      };

      await signUp(signUpData);
      const { error: signupError } = useAuthStore.getState();
      if (!signupError) {
        router.replace('/src/AnimePreferencesScreen');
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setOtpType('resetpassword');
    await sendOtp(email, 'resetpassword');
    const { error: otpError } = useAuthStore.getState();
    if (!otpError) {
      setAuthMode('resetPassword');
    }
  };

  const handleResetPassword = async () => {
    if (!otp || otp.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      Alert.alert('Error', 'Password must be at least 4 characters long');
      return;
    }

    await resetPassword(email, otp, newPassword);
    const { error: resetError } = useAuthStore.getState();
    if (!resetError) {
      Alert.alert('Success', 'Password reset successfully!', [
        { text: 'OK', onPress: () => setAuthMode('login') }
      ]);
    }
  };

  const handleResendOtp = async () => {
    clearError();
    await resendOtp(email, otpType);
  };

  const renderAuthForm = () => {
    switch (authMode) {
      case 'login':
        return (
          <View style={styles.compactLoginForm}>
            <Text style={styles.compactFormTitle}>Welcome Back</Text>
            <Text style={styles.compactFormSubtitle}>Sign in to find your anime soulmate</Text>

            <View style={styles.compactInputContainer}>
              <View style={styles.compactInputWrapper}>
                <Feather name="mail" size={18} color={colors.textLight} style={styles.compactInputIcon} />
                <TextInput
                  style={styles.compactTextInput}
                  placeholder="your.email@example.com"
                  placeholderTextColor={colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  selectionColor={colors.primary}
                />
              </View>
            </View>

            <View style={styles.compactInputContainer}>
              <View style={styles.compactInputWrapper}>
                <Feather name="lock" size={18} color={colors.textLight} style={styles.compactInputIcon} />
                <TextInput
                  style={styles.compactTextInput}
                  placeholder="Your password"
                  placeholderTextColor={colors.textLight}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  autoComplete="password"
                  selectionColor={colors.primary}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={() => setAuthMode('forgotPassword')}
              style={styles.compactForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleAuth}
              isLoading={isLoading}
              style={styles.compactAuthButton}
            />
          </View>
        );

      case 'signup':
        return (
          <View style={styles.compactLoginForm}>
            <Text style={styles.compactFormTitle}>Create Account</Text>
            <Text style={styles.compactFormSubtitle}>Join to find your anime soulmate</Text>

            {signupStep === 1 && (
              <>
                <View style={styles.compactInputContainer}>
                  <View style={styles.compactInputWrapper}>
                    <Feather name="user" size={18} color={colors.textLight} style={styles.compactInputIcon} />
                    <TextInput
                      style={styles.compactTextInput}
                      placeholder="Full Name"
                      placeholderTextColor={colors.textLight}
                      value={fullname}
                      onChangeText={setFullname}
                      autoComplete="name"
                      selectionColor={colors.primary}
                    />
                  </View>
                </View>

                <View style={styles.compactInputContainer}>
                  <View style={styles.compactInputWrapper}>
                    <Feather name="at-sign" size={18} color={colors.textLight} style={styles.compactInputIcon} />
                    <TextInput
                      style={styles.compactTextInput}
                      placeholder="Username"
                      placeholderTextColor={colors.textLight}
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      selectionColor={colors.primary}
                    />
                  </View>
                </View>

                <View style={styles.compactInputContainer}>
                  <View style={styles.compactInputWrapper}>
                    <Feather name="mail" size={18} color={colors.textLight} style={styles.compactInputIcon} />
                    <TextInput
                      style={styles.compactTextInput}
                      placeholder="your.email@example.com"
                      placeholderTextColor={colors.textLight}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      selectionColor={colors.primary}
                    />
                  </View>
                </View>

                <Button
                  title="Next"
                  onPress={handleNextStep}
                  style={styles.compactAuthButton}
                />
              </>
            )}

            {signupStep === 2 && (
              <>
                <View style={styles.compactInputContainer}>
                  <View style={styles.compactInputWrapper}>
                    <Feather name="calendar" size={18} color={colors.textLight} style={styles.compactInputIcon} />
                    <TextInput
                      style={styles.compactTextInput}
                      placeholder="Date of Birth (YYYY-MM-DD)"
                      placeholderTextColor={colors.textLight}
                      value={dob}
                      onChangeText={setDob}
                      selectionColor={colors.primary}
                    />
                  </View>
                </View>

                <View style={styles.compactSelectContainer}>
                  <Text style={styles.compactSelectLabel}>Gender</Text>
                  <View style={styles.compactOptionsRow}>
                    <TouchableOpacity
                      style={[
                        styles.compactOptionButton,
                        gender === Gender.MALE && styles.compactOptionButtonSelected
                      ]}
                      onPress={() => setGender(Gender.MALE)}
                    >
                      <Text style={[
                        styles.compactOptionText,
                        gender === Gender.MALE && styles.compactOptionTextSelected
                      ]}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.compactOptionButton,
                        gender === Gender.FEMALE && styles.compactOptionButtonSelected
                      ]}
                      onPress={() => setGender(Gender.FEMALE)}
                    >
                      <Text style={[
                        styles.compactOptionText,
                        gender === Gender.FEMALE && styles.compactOptionTextSelected
                      ]}>Female</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.compactSelectContainer}>
                  <Text style={styles.compactSelectLabel}>Looking For</Text>
                  <View style={styles.compactOptionsRow}>
                    <TouchableOpacity
                      style={[
                        styles.compactOptionButton,
                        lookingFor === LookingFor.MEN && styles.compactOptionButtonSelected
                      ]}
                      onPress={() => setLookingFor(LookingFor.MEN)}
                    >
                      <Text style={[
                        styles.compactOptionText,
                        lookingFor === LookingFor.MEN && styles.compactOptionTextSelected
                      ]}>Men</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.compactOptionButton,
                        lookingFor === LookingFor.WOMEN && styles.compactOptionButtonSelected
                      ]}
                      onPress={() => setLookingFor(LookingFor.WOMEN)}
                    >
                      <Text style={[
                        styles.compactOptionText,
                        lookingFor === LookingFor.WOMEN && styles.compactOptionTextSelected
                      ]}>Women</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.compactButtonRow}>
                  <Button
                    title="Back"
                    onPress={handlePrevStep}
                    style={styles.compactSecondaryButton}
                  />
                  <Button
                    title="Next"
                    onPress={handleNextStep}
                    style={styles.compactPrimaryButton}
                  />
                </View>
              </>
            )}

            {signupStep === 3 && (
              <>
                <View style={styles.compactInputContainer}>
                  <View style={styles.compactInputWrapper}>
                    <Feather name="lock" size={18} color={colors.textLight} style={styles.compactInputIcon} />
                    <TextInput
                      style={styles.compactTextInput}
                      placeholder="Password"
                      placeholderTextColor={colors.textLight}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={true}
                      selectionColor={colors.primary}
                    />
                  </View>
                </View>

                <View style={styles.compactInputContainer}>
                  <View style={styles.compactInputWrapper}>
                    <Feather name="lock" size={18} color={colors.textLight} style={styles.compactInputIcon} />
                    <TextInput
                      style={styles.compactTextInput}
                      placeholder="Confirm Password"
                      placeholderTextColor={colors.textLight}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={true}
                      selectionColor={colors.primary}
                    />
                  </View>
                </View>

                <View style={styles.compactButtonRow}>
                  <Button
                    title="Back"
                    onPress={handlePrevStep}
                    style={styles.compactSecondaryButton}
                  />
                  <Button
                    title="Sign Up"
                    onPress={handleAuth}
                    isLoading={isLoading}
                    style={styles.compactPrimaryButton}
                  />
                </View>
              </>
            )}

            <View style={styles.compactStepIndicator}>
              <View style={styles.compactStepDots}>
                {[1, 2, 3].map((step) => (
                  <View
                    key={step}
                    style={[
                      styles.compactStepDot,
                      signupStep >= step && styles.compactStepDotActive
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>
        );

      case 'forgotPassword':
        return (
          <View style={styles.compactLoginForm}>
            <Text style={styles.compactFormTitle}>Forgot Password</Text>
            <Text style={styles.compactFormSubtitle}>
              Enter your email address and we'll send you an OTP to reset your password.
            </Text>

            <View style={styles.compactInputContainer}>
              <View style={styles.compactInputWrapper}>
                <Feather name="mail" size={18} color={colors.textLight} style={styles.compactInputIcon} />
                <TextInput
                  style={styles.compactTextInput}
                  placeholder="your.email@example.com"
                  placeholderTextColor={colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor={colors.primary}
                />
              </View>
            </View>

            <Button
              title="Send OTP"
              onPress={handleForgotPassword}
              isLoading={isLoading}
              style={styles.compactAuthButton}
            />
          </View>
        );

      case 'verifyOtp':
        return (
          <View style={styles.compactLoginForm}>
            <Text style={styles.compactFormTitle}>Verify Email</Text>
            <Text style={styles.compactFormSubtitle}>
              We've sent a 4-digit OTP to {email}. Please enter it below to verify your email.
            </Text>

            <View style={styles.compactInputContainer}>
              <View style={styles.compactInputWrapper}>
                <Feather name="shield" size={18} color={colors.textLight} style={styles.compactInputIcon} />
                <TextInput
                  style={styles.compactTextInput}
                  placeholder="Enter 4-digit OTP"
                  placeholderTextColor={colors.textLight}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>

            <Button
              title="Verify OTP"
              onPress={handleVerifyOtp}
              isLoading={isLoading}
              style={styles.compactAuthButton}
            />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the OTP? </Text>
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={resendCooldown > 0 || isResending}
                style={styles.resendButton}
              >
                <Text style={[
                  styles.resendButtonText,
                  (resendCooldown > 0 || isResending) && styles.resendDisabled
                ]}>
                  {isResending ? 'Sending...' :
                    resendCooldown > 0 ? `Resend (${resendCooldown}s)` :
                      'Resend OTP'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'resetPassword':
        return (
          <View style={styles.compactLoginForm}>
            <Text style={styles.compactFormTitle}>Reset Password</Text>
            <Text style={styles.compactFormSubtitle}>
              Enter the OTP sent to {email} and your new password.
            </Text>

            <View style={styles.compactInputContainer}>
              <View style={styles.compactInputWrapper}>
                <Feather name="shield" size={18} color={colors.textLight} style={styles.compactInputIcon} />
                <TextInput
                  style={styles.compactTextInput}
                  placeholder="Enter 4-digit OTP"
                  placeholderTextColor={colors.textLight}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
            </View>

            <View style={styles.compactInputContainer}>
              <View style={styles.compactInputWrapper}>
                <Feather name="lock" size={18} color={colors.textLight} style={styles.compactInputIcon} />
                <TextInput
                  style={styles.compactTextInput}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.textLight}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={true}
                />
              </View>
            </View>

            <Button
              title="Reset Password"
              onPress={handleResetPassword}
              isLoading={isLoading}
              style={styles.compactAuthButton}
            />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the OTP? </Text>
              <TouchableOpacity
                onPress={handleResendOtp}
                disabled={resendCooldown > 0 || isResending}
                style={styles.resendButton}
              >
                <Text style={[
                  styles.resendButtonText,
                  (resendCooldown > 0 || isResending) && styles.resendDisabled
                ]}>
                  {isResending ? 'Sending...' :
                    resendCooldown > 0 ? `Resend (${resendCooldown}s)` :
                      'Resend OTP'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (authMode) {
      case 'login': return 'Welcome Back'
      ;
      case 'signup': return 'Create Account';
      case 'forgotPassword': return 'Forgot Password';
      case 'verifyOtp': return 'Verify Email';
      case 'resetPassword': return 'Reset Password';
      default: return 'Welcome';
    }
  };

  const getBackButton = () => {
    if (authMode === 'login' || authMode === 'signup') return null;

    return (
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (authMode === 'forgotPassword' || authMode === 'resetPassword') {
            setAuthMode('login');
          } else if (authMode === 'verifyOtp') {
            setAuthMode('signup');
          }
          clearError();
          // Reset OTP and related state
          setOtp('');
          setNewPassword('');
        }}
      >
        <Feather name="arrow-left" size={24} color={colors.primary} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#8A6FDF', '#FFA6C9']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {/* Single screen layout without scrolling for all auth modes */}
          <View style={styles.singleScreenContainer}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              {getBackButton()}
              <View style={styles.logoContainer}>
                <View style={styles.logoCircle}>
                  <Text style={styles.logoEmoji}>💕</Text>
                </View>
                <Text style={styles.title}>KoiSwipe</Text>
                <Text style={styles.subtitle}>Find your anime soulmate</Text>
              </View>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              
              {renderAuthForm()}
              
              {(authMode === 'login') && (
                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>
                    Don't have an account?
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setAuthMode('signup');
                    setSignupStep(1);
                    clearError();
                    setOtp('');
                    setNewPassword('');
                  }}>
                    <Text style={styles.switchButton}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {(authMode === 'signup') && (
                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity onPress={() => {
                    setAuthMode('login');
                    clearError();
                    setOtp('');
                    setNewPassword('');
                  }}>
                    <Text style={styles.switchButton}>
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backgroundGradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  singleScreenContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerSection: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formSection: {
    flex: 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 25,
    paddingVertical: 25,
    marginTop: -20,
    shadowColor: '#8A6FDF',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 25,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: screenHeight,
  },
  header: {
    height: screenHeight * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 15,
  },
  logoEmoji: {
    fontSize: 35,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '300',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  formContainer: {
    flex: 1,
    padding: 25,
    paddingTop: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    marginTop: -35,
    minHeight: screenHeight * 0.6,
    shadowColor: '#8A6FDF',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 25,
  },
  // Compact Login Form Styles
  compactLoginForm: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 10,
  },
  compactFormTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  compactFormSubtitle: {
    fontSize: 15,
    color: colors.textLight,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '300',
  },
  compactInputContainer: {
    marginBottom: 14,
  },
  compactInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(138, 111, 223, 0.2)',
    borderRadius: 18,
    backgroundColor: 'rgba(248, 248, 248, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#8A6FDF',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  compactInputIcon: {
    marginRight: 15,
    opacity: 0.7,
  },
  compactTextInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontFamily: 'System',
    fontWeight: '400',
  },
  compactForgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    padding: 5,
  },
  compactAuthButton: {
    marginTop: 10,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  compactSelectContainer: {
    marginBottom: 16,
  },
  compactSelectLabel: {
    fontSize: 14,
    marginBottom: 8,
    color: colors.text,
    fontWeight: '600',
  },
  compactOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  compactOptionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'rgba(138, 111, 223, 0.2)',
    backgroundColor: 'rgba(248, 248, 248, 0.9)',
    alignItems: 'center',
  },
  compactOptionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(138, 111, 223, 0.15)',
  },
  compactOptionText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  compactOptionTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  compactButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 15,
  },
  compactSecondaryButton: {
    flex: 1,
    marginTop: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(138, 111, 223, 0.1)',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  compactPrimaryButton: {
    flex: 1,
    marginTop: 10,
    borderRadius: 20,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  compactStepIndicator: {
    alignItems: 'center',
    marginTop: 20,
  },
  compactStepDots: {
    flexDirection: 'row',
    gap: 8,
  },
  compactStepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(138, 111, 223, 0.3)',
  },
  compactStepDotActive: {
    backgroundColor: colors.primary,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 30,
    padding: 35,
    shadowColor: '#8A6FDF',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  signupContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  signupFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(138, 111, 223, 0.1)',
  },
  backButton: {
    position: 'absolute',
    top: 25,
    left: 25,
    zIndex: 1,
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8A6FDF',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(138, 111, 223, 0.2)',
  },
  formTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: 1,
  },
  formSubtitle: {
    fontSize: 17,
    color: colors.textLight,
    marginBottom: 35,
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '300',
  },
  input: {
    marginBottom: 22,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: colors.error,
    borderWidth: 1,
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    marginHorizontal: 0,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectContainer: {
    marginBottom: 22,
  },
  selectLabel: {
    fontSize: 17,
    marginBottom: 14,
    color: colors.text,
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(138, 111, 223, 0.2)',
    backgroundColor: 'rgba(248, 248, 248, 0.9)',
    alignItems: 'center',
    shadowColor: '#8A6FDF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(138, 111, 223, 0.15)',
    shadowOpacity: 0.2,
    elevation: 8,
  },
  optionText: {
    fontSize: 15,
    color: colors.textLight,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  authButton: {
    marginTop: 30,
    borderRadius: 25,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 15,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 25,
    padding: 8,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 0,
  },
  switchText: {
    color: colors.textLight,
    fontSize: 15,
    fontWeight: '400',
  },
  switchButton: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(138, 111, 223, 0.2)',
  },
  dividerText: {
    color: colors.textLight,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: 'transparent',
    fontWeight: '500',
  },
  socialButton: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 22,
  },
  inputLabel: {
    fontSize: 17,
    marginBottom: 12,
    color: colors.text,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(138, 111, 223, 0.2)',
    borderRadius: 20,
    backgroundColor: 'rgba(248, 248, 248, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#8A6FDF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  inputIcon: {
    marginRight: 18,
    opacity: 0.7,
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    color: colors.text,
    fontFamily: 'System',
    fontWeight: '400',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(138, 111, 223, 0.15)',
  },
  resendText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: '400',
  },
  resendButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resendButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  resendDisabled: {
    color: colors.textLight,
  },
});