/**
 * constants/auth.js
 * Google OAuth Client IDs — get these from Google Cloud Console.
 *
 * expo-auth-session v5+ requires `webClientId` (Web application type)
 * as the primary ID on all platforms, including Expo Go.
 *
 * How to get them:
 *  1. Go to https://console.cloud.google.com
 *  2. APIs & Services → Credentials → Create Credentials → OAuth Client ID
 *  3. Create one for each type: Web, iOS, Android
 *  4. Add them to your .env file as EXPO_PUBLIC_* variables
 */

// Web Client ID — type "Web application" in Google Cloud Console
// ⚠️  REQUIRED even if you only target mobile (expo-auth-session v5+)
export const GOOGLE_CLIENT_ID_WEB =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || "YOUR_WEB_GOOGLE_CLIENT_ID";

// iOS Client ID — type "iOS" in Google Cloud Console
export const GOOGLE_CLIENT_ID_IOS =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || "YOUR_IOS_GOOGLE_CLIENT_ID";

// Android Client ID — type "Android" in Google Cloud Console
export const GOOGLE_CLIENT_ID_ANDROID =
  process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID ||
  "YOUR_ANDROID_GOOGLE_CLIENT_ID";
