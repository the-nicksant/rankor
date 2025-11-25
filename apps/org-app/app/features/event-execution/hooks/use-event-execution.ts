import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FightChronogramItem, EventExecutionMetrics } from '../domain/event-status';
import { EventExecutionService, type EventDetails } from '../services/event-execution-service';
import { calculateMetrics } from '../domain/event-status';

export function useEventDetails(eventId: string, enabled = true) {
  return useQuery({
    queryKey: ['event-details', eventId],
    queryFn: () => EventExecutionService.getEventDetails(eventId),
    enabled,
  });
}

export function useFinishEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => EventExecutionService.finishEvent(eventId),
    onSuccess: (_, eventId) => {
      queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-chronogram', eventId] });
    },
  });
}

export function useEventChronogram(eventId: string, enabled = true) {
  return useQuery({
    queryKey: ['event-chronogram', eventId],
    queryFn: () => EventExecutionService.getChronogram(eventId),
    enabled,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });
}

export function useEventExecutionMetrics(eventId: string, enabled = true) {
  const { data: chronogram = [] } = useEventChronogram(eventId, enabled);

  return useQuery({
    queryKey: ['event-execution-metrics', eventId],
    queryFn: () => calculateMetrics(chronogram),
    enabled: enabled && chronogram.length > 0,
  });
}

export function useUpdateFightOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, fights }: { eventId: string; fights: FightChronogramItem[] }) =>
      EventExecutionService.updateFightOrder(eventId, fights),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-chronogram', variables.eventId] });
    },
  });
}

export function useUpdateFightStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      fightId,
      status,
    }: {
      eventId: string;
      fightId: string;
      status: string;
    }) => EventExecutionService.updateFightStatus(eventId, fightId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-chronogram', variables.eventId] });
    },
  });
}

export function useCancelFight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, fightId, reason }: { eventId: string; fightId: string; reason?: string }) =>
      EventExecutionService.cancelFight(eventId, fightId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-chronogram', variables.eventId] });
    },
  });
}
