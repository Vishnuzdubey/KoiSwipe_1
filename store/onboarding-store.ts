import { API_CONFIG, makeAuthenticatedApiCall } from '@/constants/api';
import { AnimeItem, FavoriteAnimeWithRating, Genre, OnboardingData } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface OnboardingState {
  // Data
  animes: AnimeItem[];
  genres: Genre[];
  selectedGenres: string[];
  selectedAnimes: FavoriteAnimeWithRating[];
  onboardingData: OnboardingData;
  
  // Loading states
  isLoadingAnimes: boolean;
  isLoadingGenres: boolean;
  isSubmitting: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  fetchAnimes: (page?: number, limit?: number) => Promise<void>;
  searchAnimes: (query: string) => Promise<void>;
  fetchGenres: () => Promise<void>;
  updateOnboardingData: (data: Partial<OnboardingData>) => void;
  addSelectedGenre: (genreId: string) => void;
  removeSelectedGenre: (genreId: string) => void;
  addSelectedAnime: (anime: AnimeItem, rating: number) => void;
  removeSelectedAnime: (animeId: string) => void;
  updateAnimeRating: (animeId: string, rating: number) => void;
  submitFavoriteAnimes: () => Promise<void>;
  submitFavoriteGenres: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  animes: [],
  genres: [],
  selectedGenres: [],
  selectedAnimes: [],
  onboardingData: {
    favoriteGenres: [],
    favoriteAnimes: [],
  },
  isLoadingAnimes: false,
  isLoadingGenres: false,
  isSubmitting: false,
  error: null,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,
  
  fetchAnimes: async (page = 1, limit = 10) => {
    set({ isLoadingAnimes: true, error: null });
    try {
      const token = await AsyncStorage.getItem('auth_token');
      console.log('Auth token for animes:', token ? 'Token found' : 'No token found');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const endpoint = `${API_CONFIG.ENDPOINTS.GET_ANIMES}?page=${page}&limit=${limit}`;
      console.log('Fetching animes from:', endpoint);
      
      const response = await makeAuthenticatedApiCall(endpoint, token);
      console.log('Animes API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Animes data received:', data);
        set({ animes: data.animes || [], isLoadingAnimes: false });
      } else {
        const errorData = await response.text();
        console.error('Animes API error:', response.status, errorData);
        throw new Error(`Failed to fetch animes: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in fetchAnimes:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch animes', 
        isLoadingAnimes: false 
      });
    }
  },

  searchAnimes: async (query: string) => {
    set({ isLoadingAnimes: true, error: null });
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await makeAuthenticatedApiCall(
        `${API_CONFIG.ENDPOINTS.SEARCH_ANIME}?query=${encodeURIComponent(query)}`,
        token
      );

      if (response.ok) {
        const data = await response.json();
        set({ animes: data || [], isLoadingAnimes: false });
      } else {
        throw new Error('Failed to search animes');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to search animes', 
        isLoadingAnimes: false 
      });
    }
  },

  fetchGenres: async () => {
    set({ isLoadingGenres: true, error: null });
    try {
      const token = await AsyncStorage.getItem('auth_token');
      console.log('Auth token retrieved:', token ? 'Token found' : 'No token found');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('Fetching genres from:', API_CONFIG.ENDPOINTS.GET_GENRES);
      const response = await makeAuthenticatedApiCall(
        API_CONFIG.ENDPOINTS.GET_GENRES,
        token
      );

      console.log('Genres API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Genres data received:', data);
        set({ genres: data || [], isLoadingGenres: false });
      } else {
        const errorData = await response.text();
        console.error('Genres API error:', response.status, errorData);
        throw new Error(`Failed to fetch genres: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in fetchGenres:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch genres', 
        isLoadingGenres: false 
      });
    }
  },

  updateOnboardingData: (data: Partial<OnboardingData>) => {
    set(state => ({
      onboardingData: { ...state.onboardingData, ...data }
    }));
  },

  addSelectedGenre: (genreId: string) => {
    set(state => ({
      selectedGenres: [...new Set([...state.selectedGenres, genreId])]
    }));
  },

  removeSelectedGenre: (genreId: string) => {
    set(state => ({
      selectedGenres: state.selectedGenres.filter(id => id !== genreId)
    }));
  },

  addSelectedAnime: (anime: AnimeItem, rating: number) => {
    set(state => {
      const newAnime = { animeId: anime.id, rating };
      const updatedAnimes = state.selectedAnimes.filter(a => a.animeId !== anime.id);
      return {
        selectedAnimes: [...updatedAnimes, newAnime]
      };
    });
  },

  removeSelectedAnime: (animeId: string) => {
    set(state => ({
      selectedAnimes: state.selectedAnimes.filter(a => a.animeId !== animeId)
    }));
  },

  updateAnimeRating: (animeId: string, rating: number) => {
    set(state => ({
      selectedAnimes: state.selectedAnimes.map(anime =>
        anime.animeId === animeId ? { ...anime, rating } : anime
      )
    }));
  },

  submitFavoriteAnimes: async () => {
    set({ isSubmitting: true, error: null });
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const { selectedAnimes } = get();
      const response = await makeAuthenticatedApiCall(
        API_CONFIG.ENDPOINTS.ADD_FAVORITE_ANIMES,
        token,
        {
          method: 'POST',
          body: JSON.stringify({ animeIdswithRatings: selectedAnimes }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save favorite animes');
      }

      set({ isSubmitting: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to save favorite animes', 
        isSubmitting: false 
      });
    }
  },

  submitFavoriteGenres: async () => {
    set({ isSubmitting: true, error: null });
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const { selectedGenres } = get();
      const response = await makeAuthenticatedApiCall(
        API_CONFIG.ENDPOINTS.ADD_FAVORITE_GENRES,
        token,
        {
          method: 'POST',
          body: JSON.stringify({ genreIds: selectedGenres }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save favorite genres');
      }

      set({ isSubmitting: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to save favorite genres', 
        isSubmitting: false 
      });
    }
  },

  completeOnboarding: async () => {
    try {
      await get().submitFavoriteGenres();
      await get().submitFavoriteAnimes();
      // Mark onboarding as complete in app store
    } catch (error) {
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set(initialState);
  },
}));
