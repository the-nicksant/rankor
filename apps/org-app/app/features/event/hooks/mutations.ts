import { EventUseCases } from "../usecases"
import type { CreateEventFormValues, ModalitiesConfigFormValues, ProfileConfigFormValues, SubscriptionConfigFormValues } from "../schemas"
import { useMutation, type UseMutationOptions } from "@tanstack/react-query"
import type { CustomAxiosError } from "~/lib/http/types";

type CreateEventMutationOptions = UseMutationOptions<void, CustomAxiosError, CreateEventFormValues>;
type UpdateEventMutationOptions = UseMutationOptions<void, CustomAxiosError, { eventid: string, values: CreateEventFormValues }>;

type UpdateEventProfileMutationOptions = UseMutationOptions<void, CustomAxiosError, { eventid: string, values: ProfileConfigFormValues }>;
type UpdateEventModalityConfigMutationOptions = UseMutationOptions<void, CustomAxiosError, { eventId: string, values: ModalitiesConfigFormValues }>;
type UpdateEventSubscriptionConfigMutationOptions = UseMutationOptions<void, CustomAxiosError, { eventId: string, values: SubscriptionConfigFormValues }>;

type UpdateEventBannerMutationOptions = UseMutationOptions<void, CustomAxiosError, { eventId: string, banner: File }>;

export const useCreateEvent = (options?: CreateEventMutationOptions) => {
  return useMutation({
    mutationFn: async (values: CreateEventFormValues) => await EventUseCases.createEvent(values),
    ...options
  })
}

export const useUpdateEvent = (options?: UpdateEventMutationOptions) => {
  return useMutation({
    mutationFn: async (data: { eventid: string, values: CreateEventFormValues }) => await EventUseCases.updateEvent(data.eventid, data.values),
    ...options
  })
}

export const useUpdateEventModalityConfig = (options?: UpdateEventModalityConfigMutationOptions) => {
  return useMutation({
      mutationFn: async (data: { eventId: string, values: ModalitiesConfigFormValues}) => 
        await EventUseCases.updateModalitiesConfig(data.eventId, data.values),
      ...options
    })
}


export const useUpdateEventSubscriptionsConfig = (options?: UpdateEventSubscriptionConfigMutationOptions) => {
  return useMutation({
    mutationFn: async (data: { eventId: string, values: SubscriptionConfigFormValues }) => {
      return await EventUseCases.updateSubscriptionsConfig(data.eventId, data.values)
    },
    ...options
  })
}

export const useUpdateEventPage = (options?: UpdateEventProfileMutationOptions) => {
  return useMutation({
    mutationFn: async (data: { eventid: string, values: ProfileConfigFormValues }) => {
      return await EventUseCases.updateEventProfileConfig(data.eventid, data.values)
    },
    ...options
  })
}

export const useUpdateBanner = (options?: UpdateEventBannerMutationOptions) => {
  return useMutation({
    mutationFn: async (values: { eventId: string, banner: File }) => {
      return await EventUseCases.uploadBanner(values.eventId, values.banner);
    },
    ...options
  })
}