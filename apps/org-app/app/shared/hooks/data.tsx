import { useQuery } from "@tanstack/react-query"
import { SharedUseCases } from "../usecases"

export const useModalities = () => {
  return useQuery({
    queryKey: ['fetch-modalities'],
    initialData: [],
    queryFn: async () => {
      return await SharedUseCases.getModalities()
    }
  })
  // return { data: [
  //   {
  //     "title": "Boxe",
  //     "value": 'boxing',
  //     "description": "A nobre arte do confronto.",
  //     "image": boxingImg
  //   },
  //   {
  //     "title": "Muay Thai",
  //     "value": 'muaythai',
  //     "description": "A arte das oito armas.",
  //     "image": muayThaiImg
  //   },
  //   {
  //     "title": "Kickboxing",
  //     "value": 'kickboxing',
  //     "description": "Potência nos punhos e nos pés.",
  //     "image":kickboxingImg
  //   },
  //   {
  //     "title": "Jiu-Jitsu",
  //     "value": 'jiujitsu',
  //     "description": "A famosa arte suave",
  //     "image": jiujitsuImg
  //   },
  //   {
  //     "title": "MMA",
  //     "value": 'mma',
  //     "description": "O palco do lutador completo.",
  //     "image": mmaImg
  //   },
  //   {
  //     "title": "Karate",
  //     "value": 'karate',
  //     "description": "O caminho do golpe perfeito.",
  //     "image": karateImg
  //   },
  //   {
  //     "title": "Judo",
  //     "value": 'judo',
  //     "description": "O caminho suave da queda.",
  //     "image": judoImg
  //   },
  //   {
  //     "title": "Taekwondo",
  //     "value": 'taekwondo',
  //     "description": "A força explosiva dos chutes.",
  //     "image": taekwondoImg
  //   }
  // ]}

} 