import { API_CONFIG, makeApiCall } from '@/constants/api';
import { SignUpRequest, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  
  // Actions
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signUp: (signUpData: SignUpRequest) => Promise<void>;
  sendOtp: (email: string, type: 'signup' | 'resetpassword') => Promise<void>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,
      
      initializeAuth: async () => {
        try {
          const storedToken = await AsyncStorage.getItem('auth_token');
          if (storedToken) {
            // TODO: Validate token with API and fetch user profile
            // For now, we'll just set the authentication state
            set({ 
              isAuthenticated: true, 
              token: storedToken,
            });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          await AsyncStorage.removeItem('auth_token');
          set({ user: null, isAuthenticated: false, token: null });
        }
      },
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await makeApiCall(API_CONFIG.ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (response.ok) {
            const token = `Bearer ${data.token}`;
            await AsyncStorage.setItem('auth_token', token);
            
            // Mock user data - you'll need to fetch user profile from API
            const user: User = {
              id: 'current-user',
              username: 'AnimeExplorer',
              email,
              avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000',
              isAnimeAvatar: false,
              age: 25,
              gender: 'male',
              lookingFor: 'women',
              location: 'Tokyo, Japan',
              discoveryRadius: 50,
              bio: "Anime enthusiast looking for someone to share my passion with. Let's discuss our favorite shows!",
              favoriteGenres: ['Action', 'Adventure', 'Fantasy'],
              favoriteAnime: [
                { id: '1', title: 'Attack on Titan', imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000', genres: ['Action', 'Drama'] },
                { id: '2', title: 'Demon Slayer', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000', genres: ['Action', 'Fantasy'] },
              ],
              characterArchetype: 'Protagonist',
              watchingStatus: 'Binge Watcher',
              partnerInterestLevel: 'High',
              animeWorld: 'Fantasy',
              conventionInterest: 'Very Interested',
              subOrDub: 'Sub',
              dateIdea: 'Anime marathon',
              relationshipGoal: 'Serious Relationship',
              watchPartyAvailable: 'Yes',
              tags: ['Manga Reader', 'Figurine Collector', 'Cosplay Enthusiast'],
              createdAt: Date.now() - 5000000,
              lastActive: Date.now(),
            };
            
            set({ user, isAuthenticated: true, isLoading: false, token });
          } else {
            set({ error: data.message || 'Login failed', isLoading: false });
          }
        } catch (error) {
          // set({ error: 'Network error. Please check your connection.', isLoading: false });
        }
      },
      
      signUp: async (signUpData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await makeApiCall(API_CONFIG.ENDPOINTS.SIGNUP, {
            method: 'POST',
            body: JSON.stringify(signUpData),
          });

          const data = await response.json();

          if (response.ok) {
            const token = `Bearer ${data.token}`;
            await AsyncStorage.setItem('auth_token', token);
            
            // Create user object from signup data
            const user: User = {
              id: 'current-user',
              username: signUpData.username,
              email: signUpData.email,
              avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000',
              isAnimeAvatar: false,
              age: new Date().getFullYear() - new Date(signUpData.dob).getFullYear(),
              gender: signUpData.gender.toLowerCase() as 'male' | 'female' | 'other',
              lookingFor: signUpData.lookingFor.toLowerCase() as 'men' | 'women' | 'everyone',
              location: '',
              discoveryRadius: 50,
              bio: '',
              favoriteGenres: [],
              favoriteAnime: [],
              characterArchetype: '',
              watchingStatus: signUpData.watchingStatus.replace('_', ' '),
              partnerInterestLevel: '',
              animeWorld: '',
              conventionInterest: '',
              subOrDub: signUpData.subDubPreference,
              dateIdea: '',
              relationshipGoal: signUpData.relationshipGoal.replace('_', ' '),
              watchPartyAvailable: '',
              tags: [],
              createdAt: Date.now(),
              lastActive: Date.now(),
            };
            
            set({ user, isAuthenticated: true, isLoading: false, token });
          } else {
            set({ error: data.message || 'Signup failed', isLoading: false });
          }
        } catch (error) {
          // set({ error: 'Network error. Please check your connection.', isLoading: false });
        }
      },

      sendOtp: async (email, type) => {
        set({ isLoading: true, error: null });
        try {
          const response = await makeApiCall(API_CONFIG.ENDPOINTS.SEND_OTP, {
            method: 'POST',
            body: JSON.stringify({ email, type }),
          });

          const data = await response.json();

          if (!response.ok) {
            set({ error: data.message || 'Failed to send OTP', isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          // set({ error: 'Network error. Please check your connection.', isLoading: false });
        }
      },

      verifyOtp: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
          const response = await makeApiCall(API_CONFIG.ENDPOINTS.VERIFY_OTP, {
            method: 'POST',
            body: JSON.stringify({ email, otp }),
          });

          const data = await response.json();

          if (!response.ok) {
            set({ error: data.message || 'Invalid OTP', isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          // set({ error: 'Network error. Please check your connection.', isLoading: false });
        }
      },

      resetPassword: async (email, otp, newPassword) => {
        set({ isLoading: true, error: null });
        try {
          const response = await makeApiCall(API_CONFIG.ENDPOINTS.RESET_PASSWORD, {
            method: 'POST',
            body: JSON.stringify({ email, otp, newPassword }),
          });

          const data = await response.json();

          if (!response.ok) {
            set({ error: data.message || 'Password reset failed', isLoading: false });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          // set({ error: 'Network error. Please check your connection.', isLoading: false });
        }
      },
      
      logout: async () => {
        try {
          // Clear token from AsyncStorage
          await AsyncStorage.removeItem('auth_token');
          
          // Clear any other stored user data
          await AsyncStorage.removeItem('user_profile');
          await AsyncStorage.removeItem('onboarding_data');
          await AsyncStorage.removeItem('otaku-match-app');
          await AsyncStorage.removeItem('otaku-match-auth');
          
          // Clear app state and other stores (we'll import stores dynamically to avoid circular dependency)
          try {
            const { useAppStore } = await import('./app-store');
            const resetApp = useAppStore.getState().resetApp;
            resetApp();
            
            const { useOnboardingStore } = await import('./onboarding-store');
            const resetOnboarding = useOnboardingStore.getState().reset;
            resetOnboarding();
          } catch (error) {
            console.warn('Could not reset app/onboarding state:', error);
          }
          
          // Reset auth state
          set({ 
            user: null, 
            isAuthenticated: false, 
            token: null,
            error: null,
            isLoading: false
          });
          
          console.log('Logout completed successfully');
        } catch (error) {
          console.error('Error during logout:', error);
          // Still reset auth state even if there's an error clearing storage
          set({ 
            user: null, 
            isAuthenticated: false, 
            token: null,
            error: null,
            isLoading: false
          });
        }
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'otaku-match-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);