import { apiClient } from "~/lib/http/http-client"
import type { Modality } from "../domain/models/modality"


export namespace SharedUseCases {

  export const getModalities = async (): Promise<Modality[]> => {
    const res = await apiClient.get('/v1/modalities')
    return res.data
  }

  export const getExpertises = async () => {
    const res = await apiClient.get('/v1/expertises')
    return res.data
  }
}