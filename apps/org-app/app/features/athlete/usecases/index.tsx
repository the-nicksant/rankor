import { apiClient } from "~/lib/http/http-client";
import type { Athlete } from "../domain/athlete";
import type { Paginated } from "~/shared/types/protocol/paginated";


export namespace AthleteUseCases {
  export const getAthletes = async (params: Requests.GetAthletesRequest): Promise<Paginated<Athlete>> => {
    const res = await apiClient.get(`/v1/athletes`, {
      params
    });

    return res.data
  }

  export namespace Requests {
    export interface GetAthletesRequest {
      skip: number
      take: number
    }
  }
}