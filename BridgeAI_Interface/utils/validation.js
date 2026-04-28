/**
 * utils/validation.js
 * Reusable validation helpers for the BridgeAI app.
 */

// RFC 5322-inspired practical regex — defined once at module level to avoid recompilation on each call
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const MIN_PASSWORD_LENGTH = 8;
const MIN_USER_AGE = 13;
const DATE_STRING_LENGTH = 10;
const DATE_PARTS_COUNT = 3;

export const isValidEmail = (email = '') =>
  EMAIL_REGEX.test(email.trim());

export const isValidPassword = (password = '') =>
  password.length >= MIN_PASSWORD_LENGTH &&
  /[A-Z]/.test(password) &&
  /[0-9]/.test(password);

export const passwordsMatch = (password = '', confirm = '') =>
  password.length > 0 && password === confirm;

const parseDateParts = (dateStr) => {
  if (dateStr.length !== DATE_STRING_LENGTH) return null;
  const parts = dateStr.split('.');
  if (parts.length !== DATE_PARTS_COUNT) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return null;
  return { day, month, year };
};

const isCalendarDateValid = (day, month, year) => {
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;

  // Construct a real Date to catch impossible dates (e.g. Feb 31)
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const meetsMinimumAge = (day, month, year) => {
  const today = new Date();
  const age =
    today.getFullYear() -
    year -
    (today < new Date(today.getFullYear(), month - 1, day) ? 1 : 0);
  return age >= MIN_USER_AGE;
};

export const isValidDate = (dateStr = '') => {
  const parsed = parseDateParts(dateStr);
  if (!parsed) return false;

  const { day, month, year } = parsed;
  return isCalendarDateValid(day, month, year) && meetsMinimumAge(day, month, year);
};