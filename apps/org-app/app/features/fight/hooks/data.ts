import { useQuery } from "@tanstack/react-query"
import { FightUseCases } from "../usecases"

export const useEventFights = (params: { eventId: string }) => {
  return useQuery({
    enabled: !!params.eventId,
    queryKey: ['fetch-event-fights', params.eventId],
    queryFn: async () => await FightUseCases.getEventFights(params.eventId)
  })
}