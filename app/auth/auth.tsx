import { Button } from '@/components/Button';
import { SignupStep1, SignupStep2, SignupStep3 } from '@/components/SignupSteps';
import { StepProgress } from '@/components/StepProgress';
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
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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
          <View style={styles.loginContainer}>
            <View style={styles.loginCard}>
              <Text style={styles.formTitle}>Welcome Back</Text>
              <Text style={styles.formSubtitle}>Sign in to find your anime soulmate</Text>

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

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={20} color={colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Your password"
                    placeholderTextColor={colors.textLight}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={true}
                    autoComplete="password"
                  />
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setAuthMode('forgotPassword')}
                style={styles.forgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleAuth}
                isLoading={isLoading}
                style={styles.authButton}
              />
            </View>
          </View>
        );

      case 'signup':
        return (
          <View style={styles.signupContainer}>
            <StepProgress
              currentStep={signupStep}
              totalSteps={3}
              animatedValue={progressAnimation}
            />

            {signupStep === 1 && (
              <SignupStep1
                fullname={fullname}
                setFullname={setFullname}
                username={username}
                setUsername={setUsername}
                email={email}
                setEmail={setEmail}
                onNext={handleNextStep}
                animatedValue={stepAnimation}
              />
            )}

            {signupStep === 2 && (
              <SignupStep2
                dob={dob}
                setDob={setDob}
                gender={gender}
                setGender={setGender}
                lookingFor={lookingFor}
                setLookingFor={setLookingFor}
                onNext={handleNextStep}
                onBack={handlePrevStep}
                animatedValue={stepAnimation}
              />
            )}

            {signupStep === 3 && (
              <SignupStep3
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                watchingStatus={watchingStatus}
                setWatchingStatus={setWatchingStatus}
                subDubPreference={subDubPreference}
                setSubDubPreference={setSubDubPreference}
                relationshipGoal={relationshipGoal}
                setRelationshipGoal={setRelationshipGoal}
                onNext={handleAuth}
                onBack={handlePrevStep}
                animatedValue={stepAnimation}
              />
            )}
          </View>
        );

      case 'forgotPassword':
        return (
          <View style={styles.loginContainer}>
            <View style={styles.loginCard}>
              <Text style={styles.formTitle}>Forgot Password</Text>
              <Text style={styles.formSubtitle}>
                Enter your email address and we'll send you an OTP to reset your password.
              </Text>

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
                  />
                </View>
              </View>

              <Button
                title="Send OTP"
                onPress={handleForgotPassword}
                isLoading={isLoading}
                style={styles.authButton}
              />
            </View>
          </View>
        );

      case 'verifyOtp':
        return (
          <View style={styles.loginContainer}>
            <View style={styles.loginCard}>
              <Text style={styles.formTitle}>Verify Email</Text>
              <Text style={styles.formSubtitle}>
                We've sent a 4-digit OTP to {email}. Please enter it below to verify your email.
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>OTP</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="shield" size={20} color={colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
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
                style={styles.authButton}
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
          </View>
        );

      case 'resetPassword':
        return (
          <View style={styles.loginContainer}>
            <View style={styles.loginCard}>
              <Text style={styles.formTitle}>Reset Password</Text>
              <Text style={styles.formSubtitle}>
                Enter the OTP sent to {email} and your new password.
              </Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>OTP</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="shield" size={20} color={colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter 4-digit OTP"
                    placeholderTextColor={colors.textLight}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="numeric"
                    maxLength={4}
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>New Password</Text>
                <View style={styles.inputWrapper}>
                  <Feather name="lock" size={20} color={colors.textLight} style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
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
                style={styles.authButton}
              />

              <View style={styles.resendContainer}>
                <Text style={styles.resendText}>Didn't receive the OTP Passkey? </Text>
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
          </View>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (authMode) {
      case 'login': return 'Welcome Back';
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {authMode === 'signup' ? (
          // Full screen signup flow
          <View style={styles.fullScreenContainer}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            {renderAuthForm()}
          </View>
        ) : (
          // Traditional scroll view for other auth modes
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.header}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000' }}
                style={styles.headerImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
              >
                <Text style={styles.title}>KoiSwipe</Text>
                <Text style={styles.subtitle}>Find your anime soulmate</Text>
              </LinearGradient>
            </View>

            <View style={styles.formContainer}>
              {getBackButton()}

              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {renderAuthForm()}

              {(authMode === 'login') && (
                <View style={styles.switchContainer}>
                  <Text style={styles.switchText}>
                    Don't have an account for?
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
            </View>
          </ScrollView>
        )}

        {authMode === 'signup' && (
          <View style={styles.signupFooter}>
            <Text style={styles.switchText}>
              Already have an account for ?
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: screenHeight,
  },
  header: {
    height: screenHeight * 0.35,
    position: 'relative',
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
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 24,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    minHeight: screenHeight * 0.7,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  loginCard: {
    backgroundColor: colors.card,
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
  },
  signupContainer: {
    flex: 1,
  },
  signupFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: `${colors.error}15`,
    borderColor: colors.error,
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  selectContainer: {
    marginBottom: 16,
  },
  selectLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.text,
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}15`,
  },
  optionText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  authButton: {
    marginTop: 20,
    borderRadius: 16,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  switchText: {
    color: colors.textLight,
    fontSize: 14,
  },
  switchButton: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textLight,
    paddingHorizontal: 16,
    fontSize: 14,
    backgroundColor: colors.background,
  },
  socialButton: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: colors.text,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontFamily: 'System',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resendText: {
    color: colors.textLight,
    fontSize: 14,
  },
  resendButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  resendButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  resendDisabled: {
    color: colors.textLight,
  },
});