// API Configuration
// TODO: Replace 'https://your-api-url.com' with your actual API URL
// Example: 'https://koiswipe-api.herokuapp.com' or 'http://localhost:3000'
export const API_CONFIG = {
  BASE_URL: 'https://koi-swipe.vercel.app/api/v1', // ⚠️ REPLACE WITH YOUR ACTUAL API URL
  ENDPOINTS: {
    // Auth endpoints
    LOGIN: '/user/login/login',
    SIGNUP: '/user/login/signup',
    SEND_OTP: '/user/login/signup/sendotp',
    VERIFY_OTP: '/user/login/signup/verifyotp',
    RESET_PASSWORD: '/user/login/resetpassword',
    
    // Profile endpoints
    MY_PROFILE: '/user/profile/myprofile',
    UPDATE_PROFILE: '/user/profile/update',
    GET_PROFILE_BY_USERNAME: '/user/profile/', // append username
    
    // Anime endpoints
    GET_ANIMES: '/user/anime',
    SEARCH_ANIME: '/user/anime/search',
    GET_FAVORITE_ANIMES: '/user/anime/favourites',
    ADD_FAVORITE_ANIMES: '/user/anime/favourites/addmultiple',
    DELETE_FAVORITE_ANIME: '/user/anime/favourites/', // append animeId
    RATE_ANIME: '/user/anime/ratings',
    DELETE_ANIME_RATING: '/user/anime/ratings/', // append animeId
    
    // Genre endpoints
    GET_GENRES: '/user/anime/genre',
    GET_FAVORITE_GENRES: '/user/anime/genre/favourites',
    ADD_FAVORITE_GENRES: '/user/anime/genre/favourites/addmultiple',
    DELETE_FAVORITE_GENRE: '/user/anime/genre/favourites/', // append genreId
    
    // Swipe endpoints
    GET_RECOMMENDATIONS: '/user/swipe/recommendations',
    SWIPE_ACTION: '/user/swipe/swipeaction',
    
    // Post endpoints
    GET_POSTS: '/user/post',
    CREATE_POST: '/user/post',
    DELETE_POST: '/user/post/', // append postId
    TOGGLE_LIKE: '/user/post/toggle-like/', // append postId
    GET_COMMENTS: '/user/post/comments/', // append postId
    CREATE_COMMENT: '/user/post/comments/', // append postId
    REPORT_USER: '/user/report',
  },
};

// Helper function to make API calls with proper headers
export const makeApiCall = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  return response;
};

// Helper function to make authenticated API calls
export const makeAuthenticatedApiCall = async (
  endpoint: string, 
  token: string, 
  options: RequestInit = {}
) => {
  // Ensure token has Bearer prefix
  const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
  
  const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authToken,
      ...options.headers,
    },
  });

  return response;
};
