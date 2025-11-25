/**
 * Access Token Domain Models
 *
 * Defines the structure for event collaborator access tokens
 * that allow role-based access without user accounts
 */

export type AccessRole = 'referee' | 'judge' | 'check_in' | 'announcer' | 'reception';

export type AccessScope =
  | 'view_chronogram'
  | 'view_fight_details'
  | 'view_next_fights'
  | 'score_fight'
  | 'pause_timer'
  | 'end_fight'
  | 'score_rounds'
  | 'scan_qr'
  | 'manual_checkin'
  | 'view_athletes'
  | 'view_schedule';

export type AccessTokenStatus = 'active' | 'revoked' | 'expired';

export interface AccessToken {
  id: string;
  eventId: string;
  role: AccessRole;
  label?: string;
  scopes: AccessScope[];
  token: string;
  pin?: string;
  requireDeviceBinding: boolean;
  boundDeviceId?: string;
  status: AccessTokenStatus;
  expiresAt: Date;
  createdAt: Date;
  createdBy: string; 
  lastAccessedAt?: Date;
  lastAccessedFrom?: string;
  revokedAt?: Date;
  revokedBy?: string;
  revokedReason?: string;
  redirectTo: string;
}

export interface AccessTokenWithUsage extends AccessToken {
  accessCount: number;
  isCurrentlyActive: boolean;
}

export interface CreateAccessTokenPayload {
  eventId: string;
  role: AccessRole;
  label?: string;
  scopes?: AccessScope[];
  pin?: string;
  requireDeviceBinding?: boolean;
  expiresAt?: Date; 
}

export interface RevokeAccessTokenPayload {
  tokenId: string;
  reason?: string;
}

export interface VerifyAccessTokenPayload {
  token: string;
  pin?: string;
  deviceFingerprint?: string;
}

export interface AccessTokenVerificationResult {
  valid: boolean;
  accessToken?: AccessToken;
  error?: 'invalid_token' | 'invalid_pin' | 'expired' | 'revoked' | 'device_mismatch';
  requiresPin: boolean;
  requiresDeviceBinding: boolean;
}

// Role configuration templates
export interface RoleTemplate {
  role: AccessRole;
  label: string;
  icon: string;
  description: string;
  defaultScopes: AccessScope[];
  redirectTo: string;
  color: string;
}

export const ROLE_TEMPLATES: Record<AccessRole, RoleTemplate> = {
  referee: {
    role: 'referee',
    label: 'Árbitro',
    icon: '🥋',
    description: 'Pontuar lutas, controlar timer e finalizar combates',
    defaultScopes: ['view_chronogram', 'view_fight_details', 'score_fight', 'pause_timer', 'end_fight'],
    redirectTo: '/scoring',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-500',
  },
  judge: {
    role: 'judge',
    label: 'Juiz',
    icon: '📋',
    description: 'Avaliar rounds e atribuir pontuações',
    defaultScopes: ['view_fight_details', 'score_rounds'],
    redirectTo: '/judging',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-500',
  },
  check_in: {
    role: 'check_in',
    label: 'Check-in',
    icon: '🎫',
    description: 'Fazer check-in de atletas via QR code ou manual',
    defaultScopes: ['scan_qr', 'manual_checkin', 'view_athletes', 'view_chronogram'],
    redirectTo: '/check-in',
    color: 'bg-green-500/10 text-green-600 dark:text-green-500',
  },
  announcer: {
    role: 'announcer',
    label: 'Locutor',
    icon: '📢',
    description: 'Visualizar cronograma e detalhes das lutas',
    defaultScopes: ['view_chronogram', 'view_fight_details', 'view_next_fights'],
    redirectTo: '/announcer',
    color: 'bg-orange-500/10 text-orange-600 dark:text-orange-500',
  },
  reception: {
    role: 'reception',
    label: 'Recepção',
    icon: '🚪',
    description: 'Visualizar atletas e cronograma do evento',
    defaultScopes: ['view_athletes', 'view_schedule', 'view_chronogram'],
    redirectTo: '/reception',
    color: 'bg-pink-500/10 text-pink-600 dark:text-pink-500',
  },
};

// Utility functions
export function isTokenExpired(token: AccessToken): boolean {
  return new Date() > new Date(token.expiresAt);
}

export function isTokenActive(token: AccessTokenWithUsage): boolean {
  if (token.status !== 'active') return false;
  if (isTokenExpired(token)) return false;
  return true;
}

export function getTokenStatusColor(status: AccessTokenStatus): string {
  switch (status) {
    case 'active':
      return 'text-green-600 dark:text-green-500';
    case 'revoked':
      return 'text-red-600 dark:text-red-500';
    case 'expired':
      return 'text-gray-600 dark:text-gray-500';
  }
}

export function getTokenStatusLabel(token: AccessTokenWithUsage): string {
  if (token.status === 'revoked') return '🔴 Revogado';
  if (isTokenExpired(token)) return '⚫ Expirado';
  if (token.isCurrentlyActive) return '🟢 Ativo';
  if (!token.lastAccessedAt) return '🟡 Nunca utilizado';
  return '⏸️ Inativo';
}

export function generateToken(): string {
  // Generate a random token string
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export function generatePIN(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function getAccessTokenUrl(eventId: string, token: string): string {
  // In production, this would use the actual domain
  return `${typeof window !== 'undefined' ? window.location.origin : 'https://rankor.app'}/e/${eventId}/${token}`;
}
