/**
 * Mock Data Storage Utilities
 *
 * Provides localStorage-based persistence for mock data
 * This allows data to persist across page reloads and be shared
 * between admin panel and external access pages
 */

import type { AccessToken } from '../../domain/access-token';

const STORAGE_KEY = 'rankor_mock_access_tokens';
const LOGS_KEY = 'rankor_mock_access_logs';

export interface MockAccessTokenStorage {
  tokens: Record<string, AccessToken>;
  lastModified: string;
}

export interface MockAccessLog {
  timestamp: string;
  deviceId?: string;
  ip?: string;
}

export interface MockAccessLogsStorage {
  logs: Record<string, MockAccessLog[]>;
  lastModified: string;
}

/**
 * Load tokens from localStorage
 */
export function loadTokens(): Record<string, AccessToken> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    const data: MockAccessTokenStorage = JSON.parse(stored);

    // Convert date strings back to Date objects
    const tokens: Record<string, AccessToken> = {};
    for (const [id, token] of Object.entries(data.tokens)) {
      tokens[id] = {
        ...token,
        expiresAt: new Date(token.expiresAt),
        createdAt: new Date(token.createdAt),
        lastAccessedAt: token.lastAccessedAt ? new Date(token.lastAccessedAt) : undefined,
        revokedAt: token.revokedAt ? new Date(token.revokedAt) : undefined,
      };
    }

    return tokens;
  } catch (error) {
    console.error('Error loading tokens from storage:', error);
    return {};
  }
}

/**
 * Save tokens to localStorage
 */
export function saveTokens(tokens: Record<string, AccessToken>): void {
  try {
    const data: MockAccessTokenStorage = {
      tokens,
      lastModified: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving tokens to storage:', error);
  }
}

/**
 * Load access logs from localStorage
 */
export function loadLogs(): Record<string, MockAccessLog[]> {
  try {
    const stored = localStorage.getItem(LOGS_KEY);
    if (!stored) return {};

    const data: MockAccessLogsStorage = JSON.parse(stored);

    // Convert timestamp strings back to Date objects
    const logs: Record<string, MockAccessLog[]> = {};
    for (const [id, tokenLogs] of Object.entries(data.logs)) {
      logs[id] = tokenLogs.map((log) => ({
        ...log,
        timestamp: log.timestamp,
      }));
    }

    return logs;
  } catch (error) {
    console.error('Error loading logs from storage:', error);
    return {};
  }
}

/**
 * Save access logs to localStorage
 */
export function saveLogs(logs: Record<string, MockAccessLog[]>): void {
  try {
    const data: MockAccessLogsStorage = {
      logs,
      lastModified: new Date().toISOString(),
    };

    localStorage.setItem(LOGS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving logs to storage:', error);
  }
}

/**
 * Clear all mock data (useful for testing)
 */
export function clearAllMockData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LOGS_KEY);
  } catch (error) {
    console.error('Error clearing mock data:', error);
  }
}

/**
 * Export all mock data (useful for debugging)
 */
export function exportMockData(): { tokens: MockAccessTokenStorage; logs: MockAccessLogsStorage } {
  return {
    tokens: {
      tokens: loadTokens(),
      lastModified: new Date().toISOString(),
    },
    logs: {
      logs: loadLogs(),
      lastModified: new Date().toISOString(),
    },
  };
}

/**
 * Import mock data (useful for debugging/testing)
 */
export function importMockData(data: { tokens: MockAccessTokenStorage; logs: MockAccessLogsStorage }): void {
  saveTokens(data.tokens.tokens);
  saveLogs(data.logs.logs);
}
