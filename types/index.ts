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

export enum WatchingStatus {
  BINGE_WATCHER = 'BINGE_WATCHER',
  WEEKLY_VIEWER = 'WEEKLY_VIEWER',
  CASUAL_VIEWER = 'CASUAL_VIEWER'
}

export enum SubDubPreference {
  SUB = 'SUB',
  DUB = 'DUB',
  BOTH = 'BOTH'
}

export enum RelationshipGoal {
  SERIOUS_RELATIONSHIP = 'SERIOUS_RELATIONSHIP',
  FRIENDSHIP = 'FRIENDSHIP',
  JUST_CHAT = 'JUST_CHAT',
  COSPLAY_PARTNER = 'COSPLAY_PARTNER'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum LookingFor {
  MEN = 'MEN',
  WOMEN = 'WOMEN',
  EVERYONE = 'EVERYONE'
}

// Auth related types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  fullname: string;
  username: string;
  dob: string;
  gender: Gender;
  lookingFor: LookingFor;
  latitude: number;
  longitude: number;
  watchingStatus: WatchingStatus;
  subDubPreference: SubDubPreference;
  relationshipGoal: RelationshipGoal;
}

export interface AuthResponse {
  message: string;
  token: string;
}

export interface OtpRequest {
  email: string;
  type: 'signup' | 'resetpassword';
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

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

// Onboarding data (excluding already collected fields in signup)
export interface OnboardingData {
  // Additional profile info
  bio?: string;
  location?: string;
  profilePicture?: string;
  isAnimeAvatar?: boolean;
  
  // Anime preferences  
  favoriteGenres: string[];
  favoriteAnimes: FavoriteAnimeWithRating[];
  characterArchetype?: string;
  animeWorld?: string;
  conventionInterest?: string;
  favoriteOpening?: string;
  dateIdea?: string;
  watchPartyAvailable?: string;
  
  // Final steps
  termsAccepted?: boolean;
  notificationsEnabled?: boolean;
};

// Anime related types
export interface AnimeItem {
  id: string;
  malId: number;
  title: string;
  titleEnglish: string;
  titleJapanese: string;
  imageUrl: string;
  startDate: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnimeResponse {
  animes: AnimeItem[];
}

export interface Genre {
  id: string;
  name: string;
}

export interface FavoriteAnimeWithRating {
  animeId: string;
  rating: number;
}

export interface AddFavoriteAnimesRequest {
  animeIdswithRatings: FavoriteAnimeWithRating[];
}

export interface AddFavoriteGenresRequest {
  genreIds: string[];
}

