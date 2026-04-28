/**
 * utils/storage.js
 * Persistent auth session using expo-secure-store (encrypted on device).
 * Falls back to AsyncStorage for web/Expo Go where SecureStore is unavailable.
 *
 * Install: npx expo install expo-secure-store @react-native-async-storage/async-storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SESSION_KEYS = {
  TOKEN: 'bridgeai_auth_token',
  USER:  'bridgeai_user',
};

// SecureStore is unavailable on web — AsyncStorage is the safe fallback
const isSecureStoreAvailable = Platform.OS !== 'web';

const serialize = (value) =>
  typeof value === 'string' ? value : JSON.stringify(value);

const store = {
  set: async (key, value) => {
    const serialized = serialize(value);
    return isSecureStoreAvailable
      ? SecureStore.setItemAsync(key, serialized)
      : AsyncStorage.setItem(key, serialized);
  },

  get: async (key) =>
    isSecureStoreAvailable
      ? SecureStore.getItemAsync(key)
      : AsyncStorage.getItem(key),

  remove: async (key) =>
    isSecureStoreAvailable
      ? SecureStore.deleteItemAsync(key)
      : AsyncStorage.removeItem(key),
};

export const saveSession = async ({ token, user }) => {
  await store.set(SESSION_KEYS.TOKEN, token);
  await store.set(SESSION_KEYS.USER, user);
};

export const getSession = async () => {
  const token = await store.get(SESSION_KEYS.TOKEN);
  if (!token) return null;

  const rawUser = await store.get(SESSION_KEYS.USER);
  const user = rawUser ? JSON.parse(rawUser) : null;

  return { token, user };
};

export const clearSession = async () => {
  await store.remove(SESSION_KEYS.TOKEN);
  await store.remove(SESSION_KEYS.USER);
};