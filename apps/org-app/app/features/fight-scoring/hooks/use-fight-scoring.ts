import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FightState, FightEvent, FightResult } from '../domain/fight-state';
import { FightScoringService } from '../services/fight-scoring-service';

export function useFightState(fightId: string, enabled = true) {
  return useQuery({
    queryKey: ['fight-state', fightId],
    queryFn: () => FightScoringService.getFightState(fightId),
    enabled,
    refetchInterval: 2000, // Very frequent updates for live scoring
  });
}

export function useStartFight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fightId }: { fightId: string }) =>
      FightScoringService.startFight(fightId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fight-state', variables.fightId] });
    },
  });
}

export function useStartRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fightId }: { fightId: string }) =>
      FightScoringService.startRound(fightId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fight-state', variables.fightId] });
    },
  });
}

export function useEndRound() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fightId }: { fightId: string }) =>
      FightScoringService.endRound(fightId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fight-state', variables.fightId] });
    },
  });
}

export function useRecordPoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fightId,
      fighter,
      action,
      points,
    }: {
      fightId: string;
      fighter: 'A' | 'B';
      action: string;
      points: number;
    }) => FightScoringService.recordPoints(fightId, fighter, action, points),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fight-state', variables.fightId] });
    },
  });
}

export function useEndFight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      fightId,
      result,
    }: {
      fightId: string;
      result: FightResult;
    }) => FightScoringService.endFight(fightId, result),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fight-state', variables.fightId] });
      queryClient.invalidateQueries({ queryKey: ['event-chronogram'] });
    },
  });
}

export function usePauseFight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fightId, reason }: { fightId: string; reason?: string }) =>
      FightScoringService.pauseFight(fightId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fight-state', variables.fightId] });
    },
  });
}

export function useResumeFight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fightId }: { fightId: string }) =>
      FightScoringService.resumeFight(fightId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fight-state', variables.fightId] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fightId, eventId }: { fightId: string; eventId: string }) =>
      FightScoringService.deleteEvent(fightId, eventId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fight-state', variables.fightId] });
    },
  });
}
