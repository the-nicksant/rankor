import { apiClient } from "~/lib/http/http-client"
import type { Modality } from "../domain/models/modality"
import type { Experience } from "~/features/athlete/domain/experience"


export namespace SharedUseCases {

  export const getModalities = async (): Promise<Modality[]> => {
    const res = await apiClient.get('/v1/modalities')
    return res.data
  }

  export const getExpertises = async (): Promise<{ id: Experience, name: string }[]> => {
    const res = await apiClient.get('/v1/expertises')
    return res.data
  }
}