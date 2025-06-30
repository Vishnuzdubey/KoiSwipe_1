# Updated Onboarding Flow

## Overview

The onboarding flow has been updated to redirect users to the onboarding screens after signup and prevent them from going back to the authentication screen during the onboarding process.

## Flow Structure

### 1. Authentication (auth.tsx)

- After successful signup and OTP verification, users are redirected to `/src/AnimePreferencesScreen` instead of the main tabs
- All signup fields that are already collected won't be asked again in onboarding

### 2. Onboarding Screens with Back Prevention

#### A. Initial Onboarding (onboarding.jsx)

- **Purpose**: App introduction and language selection
- **Navigation**: Redirects to AnimePreferencesScreen after completion
- **Back Prevention**: ✅ Hardware back button disabled

#### B. Anime Preferences Screen (AnimePreferencesScreen.jsx)

- **Purpose**: Multi-step anime preferences collection
- **Steps**:
  1. Genre selection (from API)
  2. Favorite anime selection (up to 5, with search functionality)
  3. Rating selected anime (1-10 scale)
- **Features**:
  - Integration with onboarding store for API calls
  - Skeleton loaders for professional loading states
  - Real-time search with backend API
  - Genre and anime submission to backend
- **Navigation**: → CompatibilityScreen
- **Back Prevention**: ✅ Allows back within internal steps, prevents going to previous screen

#### C. Compatibility Screen (CompatibilityScreen.jsx)

- **Purpose**: Anime-related compatibility questions
- **Fields**: Anime worlds, convention interest, date ideas, favorite opening
- **Navigation**: → FinalScreen
- **Back Prevention**: ✅ Hardware back button disabled

#### D. Final Screen (FinalScreen.jsx)

- **Purpose**: Final preferences and app completion
- **Fields**: Watch party availability, communication style, meetup timeframe, age confirmation
- **Navigation**: → Main app (tabs)
- **Back Prevention**: ✅ Hardware back button disabled

## Key Features Implemented

### 1. No Field Repetition

✅ Fields already collected during signup are NOT asked again:

- Email, password, fullname, username
- Date of birth, gender, lookingFor
- Latitude, longitude
- WatchingStatus, subDubPreference, relationshipGoal

### 2. Professional Skeleton Loaders

✅ Skeleton components instead of spinners for:

- Genre loading
- Anime search results
- API data fetching

### 3. Backend Integration

✅ All API calls use authentication tokens from AsyncStorage:

- Get genres: `GET /user/anime/genre`
- Search anime: `GET /user/anime/search?query=...`
- Get anime list: `GET /user/anime?page=1&limit=10`
- Submit favorite genres: `POST /user/anime/genre/favourites/addmultiple`
- Submit favorite anime with ratings: `POST /user/anime/favourites/addmultiple`

### 4. Back Button Prevention

✅ Hardware back button is disabled on all onboarding screens to prevent users from returning to auth

### 5. Multi-step Anime Preferences

✅ Professional 3-step flow:

1. Genre selection with real API data
2. Anime selection with search and 5-anime limit
3. Rating system (1-10) for selected anime

## API Integration Details

### Genre Selection

```javascript
// Fetch genres from API
const genres = await fetchGenres();
// Submit selected genres
await submitFavoriteGenres();
```

### Anime Selection & Rating

```javascript
// Search anime
const animes = await searchAnimes(query);
// Add anime with rating
addSelectedAnime(anime, rating);
// Submit with ratings
await submitFavoriteAnimes();
```

## Color Consistency

✅ All screens use the centralized color palette from `constants/colors.ts`:

- Primary: #8A6FDF
- Secondary: #FFA6C9
- Background: #FFFFFF
- Card: #F8F8F8
- Text: #333333
- TextLight: #777777

## Navigation Flow

```
Auth (Signup) → AnimePreferencesScreen → CompatibilityScreen → FinalScreen → Main App
```

## Error Handling

✅ Comprehensive error handling:

- Form validation
- API error alerts
- Loading states with skeletons
- Required field validation

This implementation ensures a smooth, professional onboarding experience that doesn't repeat information and integrates seamlessly with the backend APIs while preventing users from navigating backwards during the process.
