// Simple auth token helper for testing
import AsyncStorage from '@react-native-async-storage/async-storage';

export const setupAuthToken = async () => {
  // Replace 'your-actual-token-here' with your real auth token
  const token = 'your-actual-token-here';
  await AsyncStorage.setItem('auth_token', token);
  console.log('Auth token set for testing');
};

export const checkAuthToken = async () => {
  const token = await AsyncStorage.getItem('auth_token');
  console.log('Current auth token:', token);
  return token;
};
