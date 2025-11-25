import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MockFightDataService } from '../services/mock-data';
import type { Athlete } from '../../athlete/domain/athlete';

interface AvailableAthletesParams {
  eventId: string;
  modality?: string;
  experience?: string;
  weightClassMin?: number;
  weightClassMax?: number;
}

export function useAvailableAthletes(params: AvailableAthletesParams, enabled = true) {
  return useQuery({
    queryKey: ['available-athletes', params],
    queryFn: () => MockFightDataService.getAvailableAthletes(params),
    enabled: enabled && Boolean(params.modality && params.experience),
  });
}

interface CreateFightPayload {
  fighterA: Athlete | null;
  fighterB: Athlete | null;
  configuration: any;
}

export function useCreateFight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFightPayload) => MockFightDataService.createFight(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fights'] });
    },
  });
}

export function useCreateBatchFights() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fights: CreateFightPayload[]) => MockFightDataService.createBatchFights(fights),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fights'] });
    },
  });
}
