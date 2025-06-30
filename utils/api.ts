// API utility functions for anime and genre management
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Replace this with your actual API base URL
// Based on your error message, it might be something like:
// const BASE_URL = 'https://prashant-your-domain.com/api';
// or 
// const BASE_URL = 'https://api.prashant.com';
// For now, using a placeholder - you MUST update this
const BASE_URL = 'https://koi-swipe.vercel.app/api/v1'; 

const API_BASE = BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('auth_token');
  console.log('Retrieved token from AsyncStorage:', token ? 'Token exists' : 'No token found');
  
  let authHeader = '';
  if (token) {
    // Check if token already has Bearer prefix
    if (token.startsWith('Bearer ')) {
      authHeader = token;
    } else {
      authHeader = `Bearer ${token}`;
    }
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...(authHeader && { 'Authorization': authHeader }),
  };
  
  console.log('API Headers:', headers);
  return headers;
};

// Utility functions for token management
export const authUtils = {
  // Set auth token (handles both raw tokens and tokens with Bearer prefix)
  setAuthToken: async (token: string) => {
    // Ensure token has Bearer prefix for storage
    const tokenToStore = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    await AsyncStorage.setItem('auth_token', tokenToStore);
    console.log('Auth token saved to AsyncStorage');
  },
  
  // Get auth token (returns token with Bearer prefix)
  getAuthToken: async () => {
    const token = await AsyncStorage.getItem('auth_token');
    console.log('Current token:', token ? 'Token exists' : 'No token found');
    return token;
  },
  
  // Get raw token (without Bearer prefix)
  getRawAuthToken: async () => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token && token.startsWith('Bearer ')) {
      return token.substring(7); // Remove "Bearer " prefix
    }
    return token;
  },
  
  // Clear auth token
  clearAuthToken: async () => {
    await AsyncStorage.removeItem('auth_token');
    console.log('Auth token cleared from AsyncStorage');
  },
};

export const animeApi = {
  // Get anime list with pagination
  getAnime: async (page: number = 1, limit: number = 10) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/user/anime?page=${page}&limit=${limit}`, {
      headers,
    });
    if (!response.ok) throw new Error('Failed to fetch anime');
    const data = await response.json();
    // Return the animes array from the response
    return data.animes || [];
  },

  // Search anime
  searchAnime: async (query: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/user/anime/search?query=${encodeURIComponent(query)}`, {
      headers,
    });
    if (!response.ok) throw new Error('Failed to search anime');
    const data = await response.json();
    // Return the array directly as it seems to be an array for search results
    return Array.isArray(data) ? data : data.animes || [];
  },

  // Add multiple favorite anime with ratings
  addFavoriteAnime: async (animeIdswithRatings: Array<{ animeId: string; rating: number }>) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/user/anime/favourites/addmultiple`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ animeIdswithRatings }),
    });
    if (!response.ok) throw new Error('Failed to add favorite anime');
    return response.json();
  },

  // Get favorite anime
  getFavoriteAnime: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/user/anime/favourites`, {
      headers,
    });
    if (!response.ok) throw new Error('Failed to fetch favorite anime');
    return response.json();
  },

  // Delete favorite anime
  deleteFavoriteAnime: async (animeId: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/user/anime/favourites/${animeId}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete favorite anime');
    return response.json();
  },
};

export const genreApi = {
  // Get all genres
  getAllGenres: async () => {
    const headers = await getAuthHeaders();
    const url = `${API_BASE}/user/anime/genre`;
    console.log('Fetching genres from:', url);
    console.log('With headers:', headers);
    
    try {
      const response = await fetch(url, {
        headers,
      });
      
      console.log('Genre API Response status:', response.status);
      console.log('Genre API Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Genre API Error response:', errorText);
        throw new Error(`Failed to fetch genres: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Genre API Success:', data);
      return data;
    } catch (error) {
      console.error('Genre API Network Error:', error);
      throw error;
    }
  },

  // Add multiple favorite genres
  addFavoriteGenres: async (genreIds: string[]) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/user/anime/genre/favourites/addmultiple`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ genreIds }),
    });
    if (!response.ok) throw new Error('Failed to add favorite genres');
    return response.json();
  },

  // Get favorite genres
  getFavoriteGenres: async () => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/user/anime/genre/favourites`, {
      headers,
    });
    if (!response.ok) throw new Error('Failed to fetch favorite genres');
    return response.json();
  },

  // Delete favorite genre
  deleteFavoriteGenre: async (genreId: string) => {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/user/anime/genre/favourites/${genreId}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) throw new Error('Failed to delete favorite genre');
    return response.json();
  },
};
