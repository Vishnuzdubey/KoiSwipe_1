# Authentication & API Debugging Guide

## Current Issues Fixed

### 1. Bearer Token Handling

✅ **Fixed**: Updated `makeAuthenticatedApiCall` in `constants/api.ts` to ensure Bearer prefix is always included:

```javascript
const authToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
```

### 2. Authentication Check

✅ **Added**: Authentication verification in AnimePreferencesScreen before loading data
✅ **Added**: Mock data fallback if API fails
✅ **Added**: Detailed console logging for debugging

### 3. Error Handling

✅ **Improved**: Better error messages and retry functionality
✅ **Added**: Console logging for debugging token and API calls

## Debugging Steps

### Step 1: Check Console Logs

When you open the AnimePreferencesScreen, check the console for these logs:

- "Stored token check: Token exists" or "No token found"
- "Auth state - isAuthenticated: true/false"
- "Loading initial data..."
- "Fetching genres from: /user/anime/genre"
- "Genres API response status: 200"

### Step 2: Test Authentication

1. Make sure you complete the signup flow first
2. Check that the token is saved by looking for "Token exists" in console
3. If no token, go back to signup and complete the process

### Step 3: API Connection

The app will now show mock data if the API fails, so you should see:

- 8 genre options (Action, Adventure, Comedy, etc.)
- 4 anime options (Naruto, One Piece, etc.)

### Step 4: Check Network

If real API data doesn't load:

1. Verify the API URL in `constants/api.ts`: `https://koi-swipe.vercel.app/api/v1`
2. Check if the backend is running
3. Verify the endpoints are correct

## Expected Behavior

### On Screen Load:

1. ✅ Authentication check passes
2. ✅ Skeleton loaders show while fetching data
3. ✅ Either real API data OR mock data displays
4. ✅ No "No auth token found" alerts if properly signed up

### Genre Selection:

1. ✅ Click on genres to select/deselect
2. ✅ Selected count updates
3. ✅ Can proceed to next step with at least 1 genre

### Anime Selection:

1. ✅ Search bar filters anime
2. ✅ Can select up to 5 anime
3. ✅ Selected count shows (X/5)

### Rating:

1. ✅ Rate selected anime 1-10
2. ✅ Submit to backend (or continue with mock data)

## Troubleshooting

### "No auth token found" Alert:

- **Solution**: Complete the signup process first
- **Check**: Console should show "Token exists"

### Genres not loading:

- **Fallback**: Mock genres will show instead
- **Check**: Console for API error messages
- **Verify**: Backend is running and accessible

### API calls failing:

- **Check**: Network connection
- **Verify**: API endpoints in `constants/api.ts`
- **Confirm**: Bearer token format is correct

## Testing the Flow

1. **Start fresh**: Clear app data or reinstall
2. **Sign up**: Complete the full signup process with OTP
3. **Onboarding**: Should redirect to BasicInfoScreen, then AnimePreferences
4. **Genres**: Should show 8 options (real or mock)
5. **Anime**: Should show anime list (real or mock)
6. **Rating**: Should allow rating selected anime

The app now has robust fallbacks and detailed logging to help identify exactly where any issues occur.
