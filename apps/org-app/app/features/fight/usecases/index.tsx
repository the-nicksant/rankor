import { apiClient } from "~/lib/http/http-client";

type Fight = any

export namespace FightUseCases {
  export const getEventFights = async (eventId: string): Promise<Fight> => {
    const res = await apiClient.get(`/v1/event/${eventId}/fights`);

    return res.data
  }
}