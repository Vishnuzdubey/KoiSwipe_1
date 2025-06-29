import { API_CONFIG, makeAuthenticatedApiCall } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface ProfileData {
  id: string;
  email: string;
  fullname: string;
  username: string;
  dateOfBirth: string;
  profilePicture: string[];
  gender: string;
  lookingFor: string;
  latitude: number;
  longitude: number;
  UserAnime?: Array<{
    rating: number;
    anime: {
      id: string;
      titleEnglish: string;
      titleJapanese: string;
      imageUrl: string;
      startDate: string;
    };
  }>;
  UserGenre?: Array<{
    genre: {
      name: string;
    };
  }>;
  AnimeRating?: Array<{
    animeId: string;
    rating: number;
    review: string;
    createdAt: string;
    updatedAt: string;
    anime: {
      titleEnglish: string;
      titleJapanese: string;
      imageUrl: string;
    };
  }>;
}

interface Anime {
  id: string;
  title?: string;
  titleEnglish: string;
  titleJapanese: string;
  imageUrl: string;
  genres?: Array<{ genre: { name: string } }>;
  startDate: string;
}

interface FavoriteAnime {
  rating: number;
  anime: Anime;
}

interface Genre {
  id: string;
  name: string;
}

interface FavoriteGenre {
  id: string;
  userId: string;
  genreId: string;
  weight: number;
  genre: Genre;
}

interface ProfileState {
  profile: ProfileData | null;
  favoriteAnimes: FavoriteAnime[];
  favoriteGenres: FavoriteGenre[];
  allGenres: Genre[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadProfile: () => Promise<void>;
  loadFavoriteAnimes: () => Promise<void>;
  loadFavoriteGenres: () => Promise<void>;
  loadAllGenres: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<boolean>;
  addFavoriteAnimes: (animes: Array<{ animeId: string; rating: number }>) => Promise<boolean>;
  deleteFavoriteAnime: (animeId: string) => Promise<boolean>;
  rateAnime: (animeId: string, rating: number, review?: string) => Promise<boolean>;
  deleteAnimeRating: (animeId: string) => Promise<boolean>;
  addFavoriteGenres: (genreIds: string[]) => Promise<boolean>;
  deleteFavoriteGenre: (genreId: string) => Promise<boolean>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  favoriteAnimes: [],
  favoriteGenres: [],
  allGenres: [],
  isLoading: false,
  error: null,
  
  loadProfile: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        set({ error: 'No auth token found', isLoading: false });
        return;
      }

      console.log('🔄 Loading profile from API...');
      const response = await makeAuthenticatedApiCall(
        API_CONFIG.ENDPOINTS.MY_PROFILE,
        token
      );

      if (response.ok) {
        const profileData = await response.json();
        console.log('✅ Profile loaded:', profileData);
        
        set({ 
          profile: profileData,
          isLoading: false,
        });
      } else {
        console.log('❌ Profile load failed:', response.status);
        set({ 
          error: 'Failed to load profile',
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      set({ 
        error: 'Failed to load profile',
        isLoading: false,
      });
    }
  },

  loadFavoriteAnimes: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        console.log('No auth token found for favorite animes');
        return;
      }

      console.log('🔄 Loading favorite animes...');
      const response = await makeAuthenticatedApiCall(
        API_CONFIG.ENDPOINTS.GET_FAVORITE_ANIMES,
        token
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Favorite animes loaded:', data);
        
        set({ favoriteAnimes: Array.isArray(data) ? data : [] });
      } else {
        console.log('❌ Favorite animes load failed:', response.status);
      }
    } catch (error) {
      console.error('Error loading favorite animes:', error);
    }
  },

  loadFavoriteGenres: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        console.log('No auth token found for favorite genres');
        return;
      }

      console.log('🔄 Loading favorite genres...');
      const response = await makeAuthenticatedApiCall(
        API_CONFIG.ENDPOINTS.GET_FAVORITE_GENRES,
        token
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Favorite genres loaded:', data);
        
        set({ favoriteGenres: Array.isArray(data) ? data : [] });
      } else {
        console.log('❌ Favorite genres load failed:', response.status);
      }
    } catch (error) {
      console.error('Error loading favorite genres:', error);
    }
  },

  loadAllGenres: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        console.log('No auth token found for genres');
        return;
      }

      console.log('🔄 Loading all genres...');
      const response = await makeAuthenticatedApiCall(
        API_CONFIG.ENDPOINTS.GET_GENRES,
        token
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ All genres loaded:', data);
        
        set({ allGenres: Array.isArray(data) ? data : [] });
      } else {
        console.log('❌ All genres load failed:', response.status);
      }
    } catch (error) {
      console.error('Error loading all genres:', error);
    }
  },

  updateProfile: async (profileData) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        console.log('No auth token found for profile update');
        return false;
      }

      console.log('🔄 Updating profile...');
      const response = await makeAuthenticatedApiCall(
        API_CONFIG.ENDPOINTS.UPDATE_PROFILE,
        token,
        {
          method: 'PUT',
          body: JSON.stringify(profileData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Profile updated:', data);
        
        // Reload profile to get updated data
        await get().loadProfile();
        return true;
      } else {
        console.log('❌ Profile update failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  },

  addFavoriteAnimes: async (animes) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        console.log('No auth token found for adding favorite animes');
        return false;
      }

      console.log('🔄 Adding favorite animes...');
      const response = await makeAuthenticatedApiCall(
        API_CONFIG.ENDPOINTS.ADD_FAVORITE_ANIMES,
        token,
        {
          method: 'POST',
          body: JSON.stringify({ animeIdswithRatings: animes }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Favorite animes added:', data);
        
        // Reload favorite animes
        await get().loadFavoriteAnimes();
        return true;
      } else {
        console.log('❌ Add favorite animes failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error adding favorite animes:', error);
      return false;
    }
  },

  deleteFavoriteAnime: async (animeId) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        console.log('No auth token found for deleting favorite anime');
        return false;
      }

      console.log('🔄 Deleting favorite anime...');
      const response = await makeAuthenticatedApiCall(
        `${API_CONFIG.ENDPOINTS.DELETE_FAVORITE_ANIME}${animeId}`,
        token,
        { method: 'DELETE' }
      );

      if (response.ok) {
        console.log('✅ Favorite anime deleted');
        
        // Reload favorite animes
        await get().loadFavoriteAnimes();
        return true;
      } else {
        console.log('❌ Delete favorite anime failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error deleting favorite anime:', error);
      return false;
    }
  },

  rateAnime: async (animeId, rating, review) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        console.log('No auth token found for rating anime');
        return false;
      }

      console.log('🔄 Rating anime...');
      const response = await makeAuthenticatedApiCall(
        API_CONFIG.ENDPOINTS.RATE_ANIME,
        token,
        {
          method: 'POST',
          body: JSON.stringify({ animeId, rating, review }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Anime rated:', data);
        
        // Reload profile to get updated ratings
        await get().loadProfile();
        return true;
      } else {
        console.log('❌ Rate anime failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error rating anime:', error);
      return false;
    }
  },

  deleteAnimeRating: async (animeId) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        console.log('No auth token found for deleting anime rating');
        return false;
      }

      console.log('🔄 Deleting anime rating...');
      const response = await makeAuthenticatedApiCall(
        `${API_CONFIG.ENDPOINTS.DELETE_ANIME_RATING}${animeId}`,
        token,
        { method: 'DELETE' }
      );

      if (response.ok) {
        console.log('✅ Anime rating deleted');
        
        // Reload profile to get updated ratings
        await get().loadProfile();
        return true;
      } else {
        console.log('❌ Delete anime rating failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error deleting anime rating:', error);
      return false;
    }
  },

  addFavoriteGenres: async (genreIds) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        console.log('No auth token found for adding favorite genres');
        return false;
      }

      console.log('🔄 Adding favorite genres...');
      const response = await makeAuthenticatedApiCall(
        API_CONFIG.ENDPOINTS.ADD_FAVORITE_GENRES,
        token,
        {
          method: 'POST',
          body: JSON.stringify({ genreIds }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Favorite genres added:', data);
        
        // Reload favorite genres
        await get().loadFavoriteGenres();
        return true;
      } else {
        console.log('❌ Add favorite genres failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error adding favorite genres:', error);
      return false;
    }
  },

  deleteFavoriteGenre: async (genreId) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        console.log('No auth token found for deleting favorite genre');
        return false;
      }

      console.log('🔄 Deleting favorite genre...');
      const response = await makeAuthenticatedApiCall(
        `${API_CONFIG.ENDPOINTS.DELETE_FAVORITE_GENRE}${genreId}`,
        token,
        { method: 'DELETE' }
      );

      if (response.ok) {
        console.log('✅ Favorite genre deleted');
        
        // Reload favorite genres
        await get().loadFavoriteGenres();
        return true;
      } else {
        console.log('❌ Delete favorite genre failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error deleting favorite genre:', error);
      return false;
    }
  },
}));
