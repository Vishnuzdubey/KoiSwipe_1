import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuthStore } from '@/store/auth-store';
import colors from '@/constants/colors';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('');
  
  const { login, signUp, isLoading, error, clearError } = useAuthStore();

  const handleAuth = async () => {
    clearError();
    
    if (isLogin) {
      await login(email, password);
      if (!error) {
        router.replace('/(tabs)');
      }
    } else {
      await signUp(email, password);
      if (!error) {
        router.replace('/(tabs)');
      }
    }
  };

  const toggleAuthMode = () => {
    clearError();
    setIsLogin(!isLogin);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
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
              <Text style={styles.title}>OtakuMatch</Text>
              <Text style={styles.subtitle}>Find your anime soulmate</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
            
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            {!isLogin && (
              <Input
                label="Username"
                placeholder="Your username"
                value={username}
                onChangeText={setUsername}
                leftIcon={<Feather name="user" size={20} color={colors.textLight} />}
                autoCapitalize="none"
              />
            )}
            
            <Input
              label="Email"
              placeholder="your.email@example.com"
              value={email}
              onChangeText={setEmail}
              leftIcon={<Feather name="mail" size={20} color={colors.textLight} />}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Input
              label="Password"
              placeholder="Your password"
              value={password}
              onChangeText={setPassword}
              leftIcon={<Feather name="lock" size={20} color={colors.textLight} />}
              isPassword
            />
            
            {!isLogin && (
              <Input
                label="Location (Optional)"
                placeholder="City, Country"
                value={location}
                onChangeText={setLocation}
                leftIcon={<Feather name="map-pin" size={20} color={colors.textLight} />}
              />
            )}
            
            <Button
              title={isLogin ? 'Sign In' : 'Sign Up'}
              onPress={handleAuth}
              isLoading={isLoading}
              style={styles.authButton}
            />
            
            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </Text>
              <TouchableOpacity onPress={toggleAuthMode}>
                <Text style={styles.switchButton}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
            
            <Button
              title="Continue with Google"
              onPress={() => {}}
              variant="outline"
              style={styles.socialButton}
            />
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 250,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: `${colors.error}20`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  authButton: {
    marginTop: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
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
  },
  socialButton: {
    marginBottom: 16,
  },
});