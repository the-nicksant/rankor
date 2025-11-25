import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  AccessTokenWithUsage,
  CreateAccessTokenPayload,
  RevokeAccessTokenPayload,
  VerifyAccessTokenPayload,
  AccessTokenVerificationResult,
} from '../domain/access-token';
import { AccessTokenService } from '../services/access-token-service';

/**
 * Fetch all access tokens for an event
 */
export function useEventAccessTokens(eventId: string, enabled = true) {
  return useQuery({
    queryKey: ['event-access-tokens', eventId],
    queryFn: () => {
      // Initialize mock data on first fetch
      return AccessTokenService.getEventAccessTokens(eventId);
    },
    enabled,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time status updates
  });
}

/**
 * Create a new access token
 */
export function useCreateAccessToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAccessTokenPayload) =>
      AccessTokenService.createAccessToken(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-access-tokens', variables.eventId] });
    },
  });
}

/**
 * Revoke an access token
 */
export function useRevokeAccessToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RevokeAccessTokenPayload & { eventId: string }) =>
      AccessTokenService.revokeAccessToken(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-access-tokens', variables.eventId] });
    },
  });
}

/**
 * Verify an access token (for staff members accessing via link)
 */
export function useVerifyAccessToken() {
  return useMutation({
    mutationFn: (payload: VerifyAccessTokenPayload) =>
      AccessTokenService.verifyAccessToken(payload),
  });
}

/**
 * Regenerate an access token (creates new token string)
 */
export function useRegenerateAccessToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tokenId, eventId }: { tokenId: string; eventId: string }) =>
      AccessTokenService.regenerateToken(tokenId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-access-tokens', variables.eventId] });
    },
  });
}

/**
 * Update access token label
 */
export function useUpdateTokenLabel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tokenId, label, eventId }: { tokenId: string; label: string; eventId: string }) =>
      AccessTokenService.updateTokenLabel(tokenId, label),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-access-tokens', variables.eventId] });
    },
  });
}

/**
 * Get access token statistics for an event
 */
export function useAccessTokenStats(eventId: string) {
  const { data: tokens = [] } = useEventAccessTokens(eventId);

  return {
    total: tokens.length,
    active: tokens.filter((t) => t.status === 'active').length,
    currentlyActive: tokens.filter((t) => t.isCurrentlyActive).length,
    revoked: tokens.filter((t) => t.status === 'revoked').length,
    byRole: {
      referee: tokens.filter((t) => t.role === 'referee' && t.status === 'active').length,
      judge: tokens.filter((t) => t.role === 'judge' && t.status === 'active').length,
      check_in: tokens.filter((t) => t.role === 'check_in' && t.status === 'active').length,
      announcer: tokens.filter((t) => t.role === 'announcer' && t.status === 'active').length,
      reception: tokens.filter((t) => t.role === 'reception' && t.status === 'active').length,
    },
  };
}
