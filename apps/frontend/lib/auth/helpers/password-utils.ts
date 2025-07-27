import { sha256 } from 'js-sha256';

/**
 * Hash password on frontend before sending to backend
 * This prevents plain text passwords from being visible in network requests
 */
export const hashPassword = (password: string): string => {
  // Simple hash to mask password in network requests
  const hashedPassword = sha256(password);
  return hashedPassword;
};

