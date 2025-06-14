import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '@/types';

interface AppState {
  language: Language;
  hasCompletedOnboarding: boolean;
  isDarkMode: boolean;
  notificationsEnabled: boolean;
  
  // Actions
  setLanguage: (language: Language) => void;
  completeOnboarding: () => void;
  toggleDarkMode: () => void;
  toggleNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: { code: 'en', name: 'English', nativeName: 'English' },
      hasCompletedOnboarding: false,
      isDarkMode: false,
      notificationsEnabled: true,
      
      setLanguage: (language) => {
        set({ language });
      },
      
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },
      
      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },
      
      toggleNotifications: () => {
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled }));
      },
    }),
    {
      name: 'otaku-match-app',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);