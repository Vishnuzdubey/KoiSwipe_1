export type User = {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  isAnimeAvatar: boolean;
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  lookingFor: 'men' | 'women' | 'everyone';
  location: string;
  discoveryRadius: number;
  bio: string;
  favoriteGenres: string[];
  favoriteAnime: Anime[];
  characterArchetype: string;
  watchingStatus: string;
  partnerInterestLevel: string;
  animeWorld: string;
  conventionInterest: string;
  subOrDub: string;
  favoriteOpening?: string;
  dateIdea: string;
  relationshipGoal: string;
  watchPartyAvailable: string;
  compatibility?: number; // Used when displaying other users
  tags: string[];
  createdAt: number;
  lastActive: number;
};

export type Anime = {
  id: string;
  title: string;
  imageUrl: string;
  genres: string[];
};

export type Match = {
  id: string;
  userId: string;
  matchedUserId: string;
  createdAt: number;
  lastMessageAt: number;
};

export type Message = {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  createdAt: number;
  read: boolean;
};

export type AnimeGenre = {
  id: string;
  name: string;
  imageUrl: string;
};

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
};

export type Language = {
  code: string;
  name: string;
  nativeName: string;
};

export type CharacterArchetype = {
  id: string;
  name: string;
  description: string;
  emoji: string;
};

export type WatchingStatus = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type OnboardingPhase = 
  | 'welcome' 
  | 'auth' 
  | 'basic-info' 
  | 'anime-genres' 
  | 'favorite-anime'
  | 'character-archetype'
  | 'watching-status'
  | 'partner-interest'
  | 'anime-world'
  | 'convention'
  | 'sub-dub'
  | 'favorite-song'
  | 'date-idea'
  | 'user-intent'
  | 'watch-party'
  | 'final';

export type OnboardingData = {
  // Basic Info
  displayName: string;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  lookingFor: 'men' | 'women' | 'everyone';
  dateOfBirth: string;
  profilePicture?: string;
  isAnimeAvatar: boolean;
  location?: string;
  discoveryRadius: number;
  
  // Anime Preferences
  selectedGenres: string[];
  favoriteAnime: Anime[];
  characterArchetype: string;
  watchingStatus: string;
  partnerInterestLevel: string;
  
  // Compatibility Questions
  animeWorld: string;
  conventionInterest: string;
  subOrDub: string;
  favoriteOpening?: string;
  dateIdea: string;
  
  // User Intent
  relationshipGoal: string;
  watchPartyAvailable: string;
  
  // Final Steps
  termsAccepted: boolean;
  notificationsEnabled: boolean;
};