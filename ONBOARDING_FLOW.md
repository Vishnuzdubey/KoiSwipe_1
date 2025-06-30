# Updated Onboarding Flow Documentation

## Overview

The onboarding flow has been completely refactored to:

1. **Only ask for new/dynamic fields** - All fields already collected during signup are NOT repeated
2. **Use professional skeleton loaders** instead of spinners for a modern look
3. **Integrate with backend APIs** for anime/genre search and selection with proper authentication
4. **Fix color mismatches** for consistent UI/UX
5. **Redirect to onboarding after signup** instead of repeating already-asked fields

## Fields Already Collected During Signup (DO NOT REPEAT)

Based on the provided signup data structure:

```json
{
  "email": "abc@gmail.com",
  "password": "1234",
  "fullname": "Abhay",
  "username": "AK",
  "dob": "2002-12-02",
  "gender": "MALE",
  "lookingFor": "WOMEN",
  "latitude": 28.483262,
  "longitude": 77.510977,
  "watchingStatus": "BINGE_WATCHER",
  "subDubPreference": "SUB",
  "relationshipGoal": "SERIOUS_RELATIONSHIP"
}
```

## Updated Onboarding Flow Structure

### Step 1: Introduction/Welcome (app/src/onboarding.jsx)

- Language selection
- App feature overview with carousel
- Redirects to BasicInfoScreen instead of auth

### Step 2: Basic Information (app/src/BasicInfoScreen.jsx)

**NEW FIELDS ONLY** (removed already-collected fields):

- ✅ Bio/Description (multiline text)
- ✅ Hobbies & Interests
- ✅ Profession
- ✅ Favorite Quote/Motto

**REMOVED** (already collected):

- ❌ Display Name/Username (already have username)
- ❌ Gender (already collected)
- ❌ Looking For (already collected)
- ❌ Date of Birth (already collected)
- ❌ Discovery Radius (can be set in settings later)

### Step 3: Anime Preferences (app/src/AnimePreferencesScreen.jsx)

**NEW DYNAMIC FIELDS WITH API INTEGRATION**:

- ✅ Favorite Genres (API: `GET /user/anime/genre`, POST `/user/anime/genre/favourites/addmultiple`)
- ✅ Top 5 Favorite Anime (API: `GET /user/anime`, `GET /user/anime/search`, POST `/user/anime/favourites/addmultiple`)
- ✅ Anime Rating System (1-10 for each selected anime)
- ✅ Search functionality for anime selection
- ✅ Skeleton loaders for API data

**REMOVED** (already collected):

- ❌ Watching Status (already collected as watchingStatus)
- ❌ Sub/Dub Preference (already collected as subDubPreference)

### Step 4: Compatibility Questions (app/src/CompatibilityScreen.jsx)

**NEW COMPATIBILITY FIELDS**:

- ✅ Preferred Anime World to live in with partner
- ✅ Convention attendance interest
- ✅ Favorite anime opening song (text input)
- ✅ Perfect anime-themed date ideas
- ✅ Anime personality type
- ✅ Anime deal breakers (optional text)

### Step 5: Final Details (app/src/FinalScreen.jsx)

**NEW FINAL FIELDS**:

- ✅ Watch party availability
- ✅ Communication style preferences
- ✅ Meetup timeframe preferences
- ✅ Age confirmation (18+)
- ✅ Terms & conditions acceptance

**REMOVED** (already collected):

- ❌ Relationship Goal (already collected)

## Technical Implementation

### API Integration

All API calls use the Bearer token from AsyncStorage:

```javascript
const token = await AsyncStorage.getItem("auth_token");
const response = await makeAuthenticatedApiCall(endpoint, token);
```

### Skeleton Loaders

Professional skeleton components replace loading spinners:

```jsx
// For genres
{
  isLoadingGenres ? renderGenresSkeleton() : renderGenres();
}

// For anime
{
  isLoadingAnimes ? renderAnimesSkeleton() : renderAnimes();
}
```

### Zustand Store Integration

Uses the onboarding store for state management:

```javascript
const {
  genres,
  animes,
  selectedGenres,
  selectedAnimes,
  isLoadingGenres,
  isLoadingAnimes,
  fetchGenres,
  fetchAnimes,
  searchAnimes,
  addSelectedGenre,
  addSelectedAnime,
  submitFavoriteGenres,
  submitFavoriteAnimes,
} = useOnboardingStore();
```

### Color Consistency

All screens now use the centralized color system from `@/constants/colors`:

```javascript
import colors from "@/constants/colors";
```

## Navigation Flow

```
Welcome Onboarding → BasicInfoScreen → AnimePreferencesScreen → CompatibilityScreen → FinalScreen → Main App (/(tabs)/discover)
```

## API Endpoints Used

### Genres

- `GET /user/anime/genre` - Fetch all available genres
- `POST /user/anime/genre/favourites/addmultiple` - Submit selected genres

```json
{ "genreIds": ["id1", "id2", "id3"] }
```

### Anime

- `GET /user/anime?page=1&limit=10` - Fetch popular anime
- `GET /user/anime/search?query=demon+slayer` - Search anime
- `POST /user/anime/favourites/addmultiple` - Submit favorite anime with ratings

```json
{
  "animeIdswithRatings": [
    { "animeId": "id1", "rating": 10 },
    { "animeId": "id2", "rating": 7 }
  ]
}
```

## Key Features

### Multi-Step Anime Selection

1. **Step 1**: Genre selection with skeleton loading
2. **Step 2**: Anime selection (up to 5) with search functionality
3. **Step 3**: Rating each selected anime (1-10 scale)

### Professional UI Elements

- Skeleton loaders instead of spinners
- Consistent color scheme
- Smooth animations and transitions
- Professional card-based layouts
- Proper error handling with alerts

### Validation

- Each step validates required fields before allowing progression
- Shows selection counts (e.g., "3/5 anime selected")
- Disabled states for incomplete forms
- Clear error messages for API failures

## Testing

Refer to `TESTING_GUIDE.md` for comprehensive testing instructions including:

- API integration testing
- Skeleton loader verification
- Navigation flow testing
- Error handling validation

## Benefits of This Approach

1. **No Redundancy** - Never asks for information already collected
2. **Professional Look** - Skeleton loaders and consistent design
3. **Real Data** - Integrates with actual backend APIs
4. **Better UX** - Smooth flow with proper validation and feedback
5. **Scalable** - Easy to add new questions without affecting existing flow
