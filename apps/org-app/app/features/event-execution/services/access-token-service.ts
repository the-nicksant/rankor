import type {
  AccessToken,
  AccessTokenWithUsage,
  CreateAccessTokenPayload,
  RevokeAccessTokenPayload,
  VerifyAccessTokenPayload,
  AccessTokenVerificationResult,
} from '../domain/access-token';
import { ROLE_TEMPLATES, generateToken, generatePIN, isTokenExpired } from '../domain/access-token';
import { loadTokens, saveTokens, loadLogs, saveLogs, type MockAccessLog } from './mock-data/storage';

export class AccessTokenService {
  private static simulateDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get all access tokens for an event
   */
  static async getEventAccessTokens(eventId: string): Promise<AccessTokenWithUsage[]> {
    await this.simulateDelay();

    const tokens = loadTokens();
    const logs = loadLogs();

    const eventTokens = Object.values(tokens)
      .filter((token) => token.eventId === eventId)
      .map((token) => this.addUsageInfo(token, logs));

    // Sort by: active first, then by creation date
    return eventTokens.sort((a, b) => {
      if (a.status === 'active' && b.status !== 'active') return -1;
      if (a.status !== 'active' && b.status === 'active') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  /**
   * Create a new access token
   */
  static async createAccessToken(payload: CreateAccessTokenPayload): Promise<AccessToken> {
    await this.simulateDelay();

    const tokens = loadTokens();
    const logs = loadLogs();

    const roleTemplate = ROLE_TEMPLATES[payload.role];
    const tokenString = generateToken();
    const pin = payload.pin === undefined ? undefined : payload.pin || generatePIN();

    // Calculate expiration (default: 24h after event or provided date)
    const expiresAt = payload.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000);

    const token: AccessToken = {
      id: `token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventId: payload.eventId,
      role: payload.role,
      label: payload.label,
      scopes: payload.scopes || roleTemplate.defaultScopes,
      token: tokenString,
      pin,
      requireDeviceBinding: payload.requireDeviceBinding || false,
      status: 'active',
      expiresAt,
      createdAt: new Date(),
      createdBy: 'current-user-id', // Would come from auth context
      redirectTo: roleTemplate.redirectTo,
    };

    tokens[token.id] = token;
    logs[token.id] = [];

    saveTokens(tokens);
    saveLogs(logs);

    return token;
  }

  /**
   * Revoke an access token
   */
  static async revokeAccessToken(payload: RevokeAccessTokenPayload): Promise<AccessToken> {
    await this.simulateDelay();

    const tokens = loadTokens();
    const token = tokens[payload.tokenId];

    if (!token) {
      throw new Error('Token not found');
    }

    const revokedToken: AccessToken = {
      ...token,
      status: 'revoked',
      revokedAt: new Date(),
      revokedBy: 'current-user-id',
      revokedReason: payload.reason,
    };

    tokens[payload.tokenId] = revokedToken;
    saveTokens(tokens);

    return revokedToken;
  }

  /**
   * Verify an access token
   */
  static async verifyAccessToken(
    payload: VerifyAccessTokenPayload
  ): Promise<AccessTokenVerificationResult> {
    await this.simulateDelay(200);

    const tokens = loadTokens();
    const logs = loadLogs();

    // Find token by token string
    const token = Object.values(tokens).find((t) => t.token === payload.token);

    if (!token) {
      return {
        valid: false,
        error: 'invalid_token',
        requiresPin: false,
        requiresDeviceBinding: false,
      };
    }

    // Check if revoked
    if (token.status === 'revoked') {
      return {
        valid: false,
        error: 'revoked',
        requiresPin: !!token.pin,
        requiresDeviceBinding: token.requireDeviceBinding,
      };
    }

    // Check if expired
    if (isTokenExpired(token)) {
      // Auto-update status to expired
      token.status = 'expired';
      tokens[token.id] = token;
      saveTokens(tokens);

      return {
        valid: false,
        error: 'expired',
        requiresPin: !!token.pin,
        requiresDeviceBinding: token.requireDeviceBinding,
      };
    }

    // Check PIN if required
    if (token.pin && payload.pin !== token.pin) {
      return {
        valid: false,
        error: 'invalid_pin',
        requiresPin: true,
        requiresDeviceBinding: token.requireDeviceBinding,
      };
    }

    // Check device binding
    if (token.requireDeviceBinding) {
      if (token.boundDeviceId && token.boundDeviceId !== payload.deviceFingerprint) {
        return {
          valid: false,
          error: 'device_mismatch',
          requiresPin: !!token.pin,
          requiresDeviceBinding: true,
        };
      }

      // Bind device on first access
      if (!token.boundDeviceId && payload.deviceFingerprint) {
        token.boundDeviceId = payload.deviceFingerprint;
        tokens[token.id] = token;
        saveTokens(tokens);
      }
    }

    // Log access
    const tokenLogs = logs[token.id] || [];
    tokenLogs.push({
      timestamp: new Date().toISOString(),
      deviceId: payload.deviceFingerprint,
      ip: '192.168.1.1', // Would come from request
    });
    logs[token.id] = tokenLogs;
    saveLogs(logs);

    // Update last accessed
    token.lastAccessedAt = new Date();
    token.lastAccessedFrom = payload.deviceFingerprint || 'unknown';
    tokens[token.id] = token;
    saveTokens(tokens);

    return {
      valid: true,
      accessToken: token,
      requiresPin: !!token.pin,
      requiresDeviceBinding: token.requireDeviceBinding,
    };
  }

  /**
   * Regenerate a token
   */
  static async regenerateToken(tokenId: string): Promise<AccessToken> {
    await this.simulateDelay();

    const tokens = loadTokens();
    const logs = loadLogs();

    const token = tokens[tokenId];
    if (!token) {
      throw new Error('Token not found');
    }

    // Create new token string and reset access info
    const regeneratedToken: AccessToken = {
      ...token,
      token: generateToken(),
      boundDeviceId: undefined,
      lastAccessedAt: undefined,
      lastAccessedFrom: undefined,
      status: 'active',
    };

    tokens[tokenId] = regeneratedToken;
    logs[tokenId] = [];

    saveTokens(tokens);
    saveLogs(logs);

    return regeneratedToken;
  }

  /**
   * Update token label
   */
  static async updateTokenLabel(tokenId: string, label: string): Promise<AccessToken> {
    await this.simulateDelay();

    const tokens = loadTokens();
    const token = tokens[tokenId];

    if (!token) {
      throw new Error('Token not found');
    }

    const updatedToken: AccessToken = {
      ...token,
      label,
    };

    tokens[tokenId] = updatedToken;
    saveTokens(tokens);

    return updatedToken;
  }

  /**
   * Add usage information to a token
   */
  private static addUsageInfo(token: AccessToken, logs: Record<string, MockAccessLog[]>): AccessTokenWithUsage {
    const tokenLogs = logs[token.id] || [];
    const accessCount = tokenLogs.length;

    // Check if accessed in last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentLog = tokenLogs.find((log) => new Date(log.timestamp) > tenMinutesAgo);
    const isCurrentlyActive = !!recentLog && token.status === 'active';

    return {
      ...token,
      accessCount,
      isCurrentlyActive,
    };
  }

  /**
   * Initialize mock data for testing
   */
  static initializeMockData(eventId: string) {
    const tokens = loadTokens();

    // Check if already initialized for this event
    const hasEventTokens = Object.values(tokens).some((t) => t.eventId === eventId);
    if (hasEventTokens) return;

    const logs = loadLogs();
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Active referee token
    const refereeToken: AccessToken = {
      id: 'token-1',
      eventId,
      role: 'referee',
      label: 'Ring A',
      scopes: ROLE_TEMPLATES.referee.defaultScopes,
      token: 'ref-a1b2c3d4',
      pin: '1234',
      requireDeviceBinding: true,
      status: 'active',
      expiresAt: tomorrow,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2h ago
      createdBy: 'org-user-1',
      lastAccessedAt: new Date(now.getTime() - 2 * 60 * 1000), // 2min ago
      redirectTo: ROLE_TEMPLATES.referee.redirectTo,
    };

    // Check-in token without PIN
    const checkinToken: AccessToken = {
      id: 'token-2',
      eventId,
      role: 'check_in',
      label: 'Entrada Principal',
      scopes: ROLE_TEMPLATES.check_in.defaultScopes,
      token: 'chk-e5f6g7h8',
      requireDeviceBinding: false,
      status: 'active',
      expiresAt: tomorrow,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1h ago
      createdBy: 'org-user-1',
      lastAccessedAt: new Date(now.getTime() - 15 * 60 * 1000), // 15min ago
      redirectTo: ROLE_TEMPLATES.check_in.redirectTo,
    };

    // Inactive judge token
    const judgeToken: AccessToken = {
      id: 'token-3',
      eventId,
      role: 'judge',
      label: 'Mesa Central',
      scopes: ROLE_TEMPLATES.judge.defaultScopes,
      token: 'jdg-i9j0k1l2',
      pin: '5678',
      requireDeviceBinding: true,
      status: 'active',
      expiresAt: tomorrow,
      createdAt: new Date(now.getTime() - 30 * 60 * 1000), // 30min ago
      createdBy: 'org-user-1',
      redirectTo: ROLE_TEMPLATES.judge.redirectTo,
    };

    // Revoked referee token
    const revokedToken: AccessToken = {
      id: 'token-4',
      eventId,
      role: 'referee',
      label: 'Ring B',
      scopes: ROLE_TEMPLATES.referee.defaultScopes,
      token: 'ref-m3n4o5p6',
      pin: '9876',
      requireDeviceBinding: true,
      status: 'revoked',
      expiresAt: tomorrow,
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3h ago
      createdBy: 'org-user-1',
      revokedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1h ago
      revokedBy: 'org-user-1',
      revokedReason: 'Trocado turno',
      redirectTo: ROLE_TEMPLATES.referee.redirectTo,
    };

    tokens[refereeToken.id] = refereeToken;
    tokens[checkinToken.id] = checkinToken;
    tokens[judgeToken.id] = judgeToken;
    tokens[revokedToken.id] = revokedToken;

    // Add some access logs
    logs[refereeToken.id] = [
      { timestamp: new Date(now.getTime() - 2 * 60 * 1000).toISOString(), deviceId: 'device-123' },
      { timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(), deviceId: 'device-123' },
    ];

    logs[checkinToken.id] = [
      { timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(), deviceId: 'device-456' },
    ];

    saveTokens(tokens);
    saveLogs(logs);
  }
}
