import { useQuery } from "@tanstack/react-query"
import { EventUseCases } from "../usecases"

export const useEvents = (params: { skip: number, take: number }) => {
  return useQuery({
    initialData: {
      data: [],
      total: 0
    },
    queryKey: ['fetch-events', params],
    queryFn: async () => await EventUseCases.getOrganizationEvents(params)
  })
}

export const useDashboardMetrics = () => {
  return {
    data: {
      totalRevenue: 20123,
      totalAthletes: 200,
      totalEvents: 12,
      newSubscribers: 32,
    }
  }
}

export const useEvent = (parmas: { eventId?: string }) => {
  return useQuery({
    queryKey: ['fetch-event-by-id', parmas.eventId],
    enabled: !!parmas.eventId,
    queryFn: async () => {
      if (!parmas.eventId) return;

      return await EventUseCases.getEventById(parmas.eventId)
    }
  })
}
  
export const useSubscriptions = (params: EventUseCases.Requests.GetSubscriptionsFilter & { eventId: string }) => {
  return useQuery({
    enabled: !!params.eventId,
    queryKey: ['fetch-subcriptions', params],
    queryFn: async () => await EventUseCases.getSubscriptions(params.eventId, params)
  })
}