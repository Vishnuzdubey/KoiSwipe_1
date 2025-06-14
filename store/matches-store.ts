import { create } from 'zustand';
import { User, Match, Message } from '@/types';
import { mockUsers } from '@/mocks/users';
import { mockMatches } from '@/mocks/matches';
import { mockMessages } from '@/mocks/messages';

interface MatchesState {
  potentialMatches: User[];
  matches: Match[];
  messages: Record<string, Message[]>;
  currentIndex: number;
  isLoading: boolean;
  
  // Actions
  loadPotentialMatches: () => void;
  loadMatches: () => void;
  loadMessages: (matchId: string) => void;
  swipeLeft: () => void;
  swipeRight: () => void;
  sendMessage: (matchId: string, text: string) => void;
  markMessagesAsRead: (matchId: string) => void;
}

export const useMatchesStore = create<MatchesState>((set, get) => ({
  potentialMatches: [],
  matches: [],
  messages: {},
  currentIndex: 0,
  isLoading: false,
  
  loadPotentialMatches: () => {
    set({ isLoading: true });
    // Simulate API call
    setTimeout(() => {
      set({ 
        potentialMatches: mockUsers,
        isLoading: false,
      });
    }, 1000);
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
  
  swipeLeft: () => {
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.potentialMatches.length - 1),
    }));
  },
  
  swipeRight: () => {
    // Simulate a match (in a real app, this would be handled by the backend)
    const { currentIndex, potentialMatches } = get();
    
    if (currentIndex < potentialMatches.length) {
      const matchedUser = potentialMatches[currentIndex];
      
      // 70% chance of matching
      const isMatch = Math.random() < 0.7;
      
      if (isMatch) {
        const newMatch: Match = {
          id: `new-match-${Date.now()}`,
          userId: 'current-user',
          matchedUserId: matchedUser.id,
          createdAt: Date.now(),
          lastMessageAt: Date.now(),
        };
        
        set((state) => ({
          matches: [newMatch, ...state.matches],
          currentIndex: Math.min(state.currentIndex + 1, state.potentialMatches.length - 1),
        }));
      } else {
        set((state) => ({
          currentIndex: Math.min(state.currentIndex + 1, state.potentialMatches.length - 1),
        }));
      }
    }
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