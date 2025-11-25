import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AthleteCheckIn } from '../domain/event-status';
import { EventExecutionService } from '../services/event-execution-service';

export function useEventCheckIns(eventId: string, enabled = true) {
  return useQuery({
    queryKey: ['event-checkins', eventId],
    queryFn: () => EventExecutionService.getCheckIns(eventId),
    enabled,
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}

export function useCheckInAthlete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      qrCodeToken,
    }: {
      eventId: string;
      qrCodeToken: string;
    }) => EventExecutionService.checkInAthlete(eventId, qrCodeToken),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event-checkins', variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ['event-chronogram', variables.eventId] });
    },
  });
}

export function useGenerateQRCodes() {
  return useMutation({
    mutationFn: ({ eventId }: { eventId: string }) =>
      EventExecutionService.generateQRCodes(eventId),
  });
}
