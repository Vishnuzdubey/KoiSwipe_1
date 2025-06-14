import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful login
          if (email === 'test@example.com' && password === 'password') {
            const user: User = {
              id: 'current-user',
              username: 'AnimeExplorer',
              email: 'test@example.com',
              avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000',
              isAnimeAvatar: false,
              age: 25,
              gender: 'male',
              location: 'Tokyo, Japan',
              bio: "Anime enthusiast looking for someone to share my passion with. Let's discuss our favorite shows!",
              favoriteGenres: ['Action', 'Adventure', 'Fantasy'],
              favoriteAnime: [
                { id: '1', title: 'Attack on Titan', imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000', genres: ['Action', 'Drama'] },
                { id: '2', title: 'Demon Slayer', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000', genres: ['Action', 'Fantasy'] },
                { id: '3', title: 'My Hero Academia', imageUrl: 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=1000', genres: ['Action', 'Superhero'] },
              ],
              tags: ['Manga Reader', 'Figurine Collector', 'Cosplay Enthusiast'],
              createdAt: Date.now() - 5000000,
              lastActive: Date.now(),
            };
            set({ user, isAuthenticated: true, isLoading: false });
          } else {
            set({ error: 'Invalid email or password', isLoading: false });
          }
        } catch (error) {
          set({ error: 'Login failed. Please try again.', isLoading: false });
        }
      },
      
      signUp: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful signup
          const user: User = {
            id: 'current-user',
            username: 'NewOtaku',
            email,
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000',
            isAnimeAvatar: false,
            age: 25,
            gender: 'male',
            location: '',
            bio: '',
            favoriteGenres: [],
            favoriteAnime: [],
            tags: [],
            createdAt: Date.now(),
            lastActive: Date.now(),
          };
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Signup failed. Please try again.', isLoading: false });
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
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