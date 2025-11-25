import { apiClient } from "~/lib/http/http-client";
import type { Event } from "~/features/event/models/event";
import type { CreateEventFormValues, ProfileConfigFormValues, SubscriptionConfigFormValues } from "~/features/event/schemas/event-forms";
import type { Paginated } from "~/shared/types/protocol/paginated";
import { fakerPT_BR } from "@faker-js/faker";
import { Experience } from "~/features/athlete/domain/experience";

export namespace EventUseCases {
  export const createEvent = async (values: CreateEventFormValues) => {
    const res = await apiClient.post('/v1/event', {...values, address: { ...values.address, latitude: 9999, longitude: 9999} })
    return res.data
  }

  export const updateEvent = async (eventId: string, values: CreateEventFormValues) => {
    const res = await apiClient.put(`/v1/event/${eventId}`, {...values, address: { ...values.address, latitude: 9999, longitude: 9999} })
    return res.data
  }

  export const updateModalitiesConfig = async (eventId: string, values: any) => {
    const res = await apiClient.put(`/v1/event/${eventId}/modalities`, values)
    return res.data
  }

  export const updateSubscriptionsConfig = async (eventId: string, values: SubscriptionConfigFormValues) => {
    const res = await apiClient.put(`/v1/event/${eventId}/subscriptions`, {
      subscriptionsconfig: values
    })
    return res.data
  }

  export const updateEventProfileConfig = async (eventId: string, values: ProfileConfigFormValues) => {
    const res = await apiClient.put(`/v1/event/${eventId}/extras`, values)
    return res.data
  }

  export const uploadBanner = async (eventId: string, banner: File) => {
    const formData = new FormData()

    formData.append('file', banner)

    const res = await apiClient.put(`/v1/event/${eventId}/banner`, formData)
    return res.data
  }

  export const getOrganizationEvents = async (params: { skip: number, take: number }): Promise<{ data: Event[], total: number }> => {
    const res = await apiClient.get('/v1/events', {
      params
    });

    return res.data
  }

  export const getEventById = async (eventId: string): Promise<Event> => {
    const res = await apiClient.get(`/v1/event/${eventId}`);

    return res.data
  }

  export const completeEventRegistration = async (eventId: string): Promise<void> => {
    const res = await apiClient.put(`/v1/event/${eventId}/complete`);

    return res.data
  }

  export const getSubscriptions = async (eventId: string, filters: Requests.GetSubscriptionsFilter): Promise<Paginated<any>> => {
    const res = await apiClient.get(`/v1/event/${eventId}/subscriptions`, { params: filters });

    return res.data
  }


  export namespace Requests {
    export interface GetSubscriptionsFilter {
      skip: number, 
      take: number
      modalities?: string[]
      expertises?: string[]
      statuses?: string[]
    }
  }
}