/**
 * utils/auth.js
 * Authentication helpers for BridgeAI.
 * Replace the stub implementations with your real backend calls.
 */

import { saveSession } from "./storage";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "https://api.bridgeai.app";

const post = async (endpoint, body) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || `Server error: ${response.status}`);
  }

  return data;
};

const persistSession = async (data) => {
  await saveSession({ token: data.token, user: data.user });
};

/**
 * @param {{ email: string, username: string, password: string, dob: string, provider: string }} payload
 * @returns {Promise<{ userId: string, token: string }>}
 */
export const registerUser = async ({ email, username, password, dob, provider }) => {
  const data = await post("/auth/register", {
    email,
    username,
    password,
    date_of_birth: dob,
    provider,
  });

  await persistSession(data);
  return data;
};

/**
 * @param {{ email: string, password: string, provider?: string, accessToken?: string, identityToken?: string }} payload
 * @returns {Promise<{ userId: string, token: string }>}
 */
export const signInUser = async ({ email, password, provider, accessToken, identityToken }) => {
  const data = await post("/auth/login", {
    email,
    password,
    provider,
    accessToken,
    identityToken,
  });

  await persistSession(data);
  return data;
};