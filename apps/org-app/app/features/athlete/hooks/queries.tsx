import { useQuery } from "@tanstack/react-query"
import { AthleteUseCases } from "../usecases"


export const useAthletes = (params: {
   skip: number,
   take: number
}) => {
  return useQuery({
    initialData: {
      data: [],
      total: 0
    },
    queryKey: ['fetch-athletes', params],
    queryFn: async () => await AthleteUseCases.getAthletes(params)
  })
}