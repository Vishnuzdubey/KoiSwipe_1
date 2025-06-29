import { API_CONFIG, makeAuthenticatedApiCall } from '@/constants/api';
import { mockMatches } from '@/mocks/matches';
import { mockMessages } from '@/mocks/messages';
import { Match, Message, User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

// Placeholder data generators for missing fields from API
const enhanceApiUserWithPlaceholders = (apiUser: any): User => {
  // Calculate compatibility percentage based on API score and shared data
  const baseScore = apiUser.score || 0;
  const sharedGenres = apiUser.sharedGenres || 0;
  const sharedAnime = apiUser.sharedAnime || 0;
  
  // Generate compatibility based on shared interests (60-95% range)
  const compatibility = Math.min(95, Math.max(60, baseScore * 10 + sharedGenres * 5 + sharedAnime * 10));
  
  // Placeholder data for missing fields
  const placeholderAge = Math.floor(Math.random() * 10) + 20; // Age 20-30
  const cities = ['Tokyo', 'Osaka', 'Kyoto', 'Shibuya', 'Harajuku', 'Akihabara'];
  const placeholderLocation = cities[Math.floor(Math.random() * cities.length)];
  
  const genres = ['Action', 'Romance', 'Comedy', 'Drama', 'Fantasy', 'Sci-Fi', 'Slice of Life', 'Adventure', 'Thriller', 'Horror'];
  const placeholderGenres = genres.sort(() => 0.5 - Math.random()).slice(0, 3);
  
  const animeList = [
    { id: '1', title: 'Attack on Titan', imageUrl: 'https://m.media-amazon.com/images/M/MV5BNzc5MTczNDQtNDFjNi00ZDU0LTk2ODQtMWI4NTFjMzRkMzJiXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg', genres: ['Action', 'Drama'] },
    { id: '2', title: 'Your Name', imageUrl: 'https://m.media-amazon.com/images/M/MV5BODRmZDVmNzUtZDA4ZC00NjhkLWI2M2UtN2M0ZDIzNDcxYThjL2ltYWdlXkEyXkFqcGdeQXVyNTk0MzMzODA@._V1_.jpg', genres: ['Romance', 'Drama'] },
    { id: '3', title: 'Demon Slayer', imageUrl: 'https://m.media-amazon.com/images/M/MV5BZjZjNzI5MDctY2Y4YS00NmM4LTljMmItZTFkOTExNGI3ODRhXkEyXkFqcGdeQXVyNjc3MjQzNTI@._V1_.jpg', genres: ['Action', 'Supernatural'] },
    { id: '4', title: 'Spirited Away', imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg', genres: ['Adventure', 'Fantasy'] },
    { id: '5', title: 'One Piece', imageUrl: 'https://m.media-amazon.com/images/M/MV5BODcwNWE3OTMtMDc3MS00NDFjLWE1OTAtNDU3NjgxODMxY2UyXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg', genres: ['Adventure', 'Comedy'] },
    { id: '6', title: 'Naruto', imageUrl: 'https://m.media-amazon.com/images/M/MV5BZmQ5NGFiNWEtMmMyMC00MDdiLWI4VWQtZTlkYWFhYzRlMGUyXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg', genres: ['Action', 'Adventure'] },
    { id: '7', title: 'My Hero Academia', imageUrl: 'https://m.media-amazon.com/images/M/MV5BNjRmNDI5MjMtMmFhZi00NzMxLWJiZTgtMTEyNThlOTQ0NzZjXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_.jpg', genres: ['Action', 'School'] },
    { id: '8', title: 'Princess Mononoke', imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTVlNWM4NTAtNDUxMS00YjU5LWJlM2EtZTVlYzY1YzZkNzhiXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg', genres: ['Adventure', 'Drama'] }
  ];
  const placeholderAnime = animeList.sort(() => 0.5 - Math.random()).slice(0, 3);

  // Use actual API data and enhance with placeholders for missing fields
  return {
    id: apiUser.id,
    username: apiUser.username || 'Unknown User',
    email: '', // Not provided by API
    avatarUrl: apiUser.profilePicture || `https://picsum.photos/400/600?random=${apiUser.id}`,
    isAnimeAvatar: false,
    age: placeholderAge, // Placeholder
    gender: 'other' as const, // Placeholder
    lookingFor: 'everyone' as const, // Placeholder
    location: placeholderLocation, // Placeholder
    discoveryRadius: 50, // Placeholder
    bio: `Anime enthusiast with ${sharedGenres} shared genres and ${sharedAnime} shared anime! Let's explore the world of anime together! 🌸`,
    favoriteGenres: placeholderGenres, // Placeholder
    favoriteAnime: placeholderAnime, // Placeholder
    characterArchetype: 'Protagonist', // Placeholder
    watchingStatus: 'Currently Watching', // Placeholder
    partnerInterestLevel: 'High', // Placeholder
    animeWorld: 'Fantasy', // Placeholder
    conventionInterest: 'Yes', // Placeholder
    subOrDub: 'Both', // Placeholder
    favoriteOpening: 'Unravel - Tokyo Ghoul', // Placeholder
    dateIdea: 'Anime marathon', // Placeholder
    relationshipGoal: 'Long-term', // Placeholder
    watchPartyAvailable: 'Yes', // Placeholder
    compatibility: Math.round(compatibility), // Calculated from API data
    tags: placeholderGenres, // Same as favoriteGenres for now
    createdAt: Date.now(),
    lastActive: Date.now(),
  } as User;
};

interface MatchesState {
  potentialMatches: User[];
  matches: Match[];
  messages: Record<string, Message[]>;
  currentIndex: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadPotentialMatches: () => Promise<void>;
  loadMatches: () => void;
  loadMessages: (matchId: string) => void;
  swipeLeft: () => Promise<void>;
  swipeRight: () => Promise<boolean>; // Returns true if it's a match
  superLike: () => Promise<boolean>; // Returns true if it's a match
  sendMessage: (matchId: string, text: string) => void;
  markMessagesAsRead: (matchId: string) => void;
}

export const useMatchesStore = create<MatchesState>((set, get) => ({
  potentialMatches: [],
  matches: [],
  messages: {},
  currentIndex: 0,
  isLoading: false,
  error: null,
  
  loadPotentialMatches: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const token = await AsyncStorage.getItem('auth_token');
      
      if (!token) {
        console.log('❌ No auth token found');
        set({ 
          potentialMatches: [],
          isLoading: false,
          currentIndex: 0,
          error: 'No authentication token',
        });
        return;
      }

      console.log('🔄 Loading recommendations from API...');
      const response = await makeAuthenticatedApiCall(
        API_CONFIG.ENDPOINTS.GET_RECOMMENDATIONS,
        token
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Recommendations loaded:', data);
        
        // Handle the API response - the data array is returned directly
        const recommendations = Array.isArray(data) ? data : (data.data || []);
        
        if (recommendations.length > 0) {
          const enhancedUsers = recommendations.map(enhanceApiUserWithPlaceholders);
          set({ 
            potentialMatches: enhancedUsers,
            isLoading: false,
            currentIndex: 0,
          });
        } else {
          console.log('📭 No recommendations available');
          set({ 
            potentialMatches: [],
            isLoading: false,
            currentIndex: 0,
          });
        }
      } else {
        console.log('❌ API call failed. Status:', response.status);
        set({ 
          potentialMatches: [],
          isLoading: false,
          currentIndex: 0,
          error: `API call failed with status ${response.status}`,
        });
      }
    } catch (error) {
      console.error('❌ Error loading recommendations:', error);
      set({ 
        potentialMatches: [],
        isLoading: false,
        currentIndex: 0,
        error: 'Failed to load recommendations',
      });
    }
  },
  
  loadMatches: () => {
    set({ isLoading: true });
    // Simulate API call
    setTimeout(() => {
      set({ 
        matches: mockMatches,
        isLoading: false,
      });
    }, 1000);
  },
  
  loadMessages: (matchId) => {
    // Simulate API call
    setTimeout(() => {
      const matchMessages = mockMessages.filter(msg => msg.matchId === matchId);
      set((state) => ({
        messages: {
          ...state.messages,
          [matchId]: matchMessages,
        },
      }));
    }, 500);
  },

  swipeLeft: async () => {
    const { currentIndex, potentialMatches } = get();
    
    if (currentIndex < potentialMatches.length) {
      const currentUser = potentialMatches[currentIndex];
      
      try {
        const token = await AsyncStorage.getItem('auth_token');
        
        if (token) {
          console.log('🔄 Sending DISLIKE swipe action...');
          const response = await makeAuthenticatedApiCall(
            API_CONFIG.ENDPOINTS.SWIPE_ACTION,
            token,
            {
              method: 'POST',
              body: JSON.stringify({
                toUserId: currentUser.id,
                action: 'DISLIKE'
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log('✅ Swipe action successful:', data);
          } else {
            console.log('❌ Swipe action failed:', response.status);
          }
        }
      } catch (error) {
        console.error('Error sending swipe action:', error);
      }
      
      set((state) => ({
        currentIndex: Math.min(state.currentIndex + 1, state.potentialMatches.length - 1),
      }));
    }
  },
  
  swipeRight: async () => {
    const { currentIndex, potentialMatches } = get();
    
    if (currentIndex < potentialMatches.length) {
      const currentUser = potentialMatches[currentIndex];
      
      try {
        const token = await AsyncStorage.getItem('auth_token');
        
        if (token) {
          console.log('🔄 Sending LIKE swipe action...');
          const response = await makeAuthenticatedApiCall(
            API_CONFIG.ENDPOINTS.SWIPE_ACTION,
            token,
            {
              method: 'POST',
              body: JSON.stringify({
                toUserId: currentUser.id,
                action: 'LIKE'
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log('✅ Swipe action successful:', data);
            
            // Check if it's a match
            if (data.success && data.data && data.data.isMatch) {
              console.log('🎉 It\'s a match!');
              const newMatch: Match = {
                id: data.data.matchId || `match-${Date.now()}`,
                userId: 'current-user',
                matchedUserId: currentUser.id,
                createdAt: Date.now(),
                lastMessageAt: Date.now(),
              };
              
              set((state) => ({
                matches: [newMatch, ...state.matches],
                currentIndex: Math.min(state.currentIndex + 1, state.potentialMatches.length - 1),
              }));
              return true; // Indicate it's a match
            }
          } else {
            console.log('❌ Swipe action failed:', response.status);
          }
        }
      } catch (error) {
        console.error('Error sending swipe action:', error);
      }
      
      // Regular like (no match)
      set((state) => ({
        currentIndex: Math.min(state.currentIndex + 1, state.potentialMatches.length - 1),
      }));
    }
    
    return false; // No match
  },

  superLike: async () => {
    const { currentIndex, potentialMatches } = get();
    
    if (currentIndex < potentialMatches.length) {
      const currentUser = potentialMatches[currentIndex];
      
      try {
        const token = await AsyncStorage.getItem('auth_token');
        
        if (token) {
          console.log('🔄 Sending SUPER_LIKE swipe action...');
          const response = await makeAuthenticatedApiCall(
            API_CONFIG.ENDPOINTS.SWIPE_ACTION,
            token,
            {
              method: 'POST',
              body: JSON.stringify({
                toUserId: currentUser.id,
                action: 'SUPER_LIKE'
              }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log('✅ Super like action successful:', data);
            
            // Check if it's a match (super likes have higher match probability)
            if (data.success && data.data && data.data.isMatch) {
              console.log('🎉 Super like matched!');
              const newMatch: Match = {
                id: data.data.matchId || `match-${Date.now()}`,
                userId: 'current-user',
                matchedUserId: currentUser.id,
                createdAt: Date.now(),
                lastMessageAt: Date.now(),
              };
              
              set((state) => ({
                matches: [newMatch, ...state.matches],
                currentIndex: Math.min(state.currentIndex + 1, state.potentialMatches.length - 1),
              }));
              return true; // Indicate it's a match
            }
          } else {
            console.log('❌ Super like action failed:', response.status);
          }
        }
      } catch (error) {
        console.error('Error sending super like action:', error);
      }
      
      set((state) => ({
        currentIndex: Math.min(state.currentIndex + 1, state.potentialMatches.length - 1),
      }));
    }
    
    return false; // No match
  },
  
  sendMessage: (matchId, text) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      matchId,
      senderId: 'current-user',
      text,
      createdAt: Date.now(),
      read: false,
    };
    
    set((state) => {
      const matchMessages = state.messages[matchId] || [];
      
      return {
        messages: {
          ...state.messages,
          [matchId]: [...matchMessages, newMessage],
        },
        matches: state.matches.map(match => 
          match.id === matchId 
            ? { ...match, lastMessageAt: Date.now() }
            : match
        ),
      };
    });
  },
  
  markMessagesAsRead: (matchId) => {
    set((state) => {
      const matchMessages = state.messages[matchId] || [];
      
      return {
        messages: {
          ...state.messages,
          [matchId]: matchMessages.map(msg => 
            msg.senderId !== 'current-user' && !msg.read
              ? { ...msg, read: true }
              : msg
          ),
        },
      };
    });
  },
}));