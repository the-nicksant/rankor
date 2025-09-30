import { UserRoundSearch } from 'lucide-react'
import React from 'react'
import { ExpBadges } from '~/components/shared/exp-badges'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'
import { Skeleton } from '@repo/ui/skeleton'
import { Experience } from '~/features/athlete/domain/experience'
import { useAthletes } from '~/features/athlete/hooks/queries'

const mockedAthletes = [
  {
    id: 1,
    name: 'Conor McGregor',
    record: '22 / 6',
    team: 'SBG Ireland',
    avatar: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mma/players/full/3022677.png&w=350&h=254',
    city: 'Dublin',
    exp: Experience.PRO,
    height: 175,
    weight: 70,
    reach: 188,
  },
  {
    id: 2,
    name: 'Khabib Nurmagomedov',
    record: '29 / 0',
    team: 'Eagles MMA',
    avatar: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mma/players/full/2611557.png&w=350&h=254',
    city: 'Makhachkala',
    exp: Experience.PRO,
    height: 178,
    weight: 70,
    reach: 178,
  },
  {
    id: 3,
    name: 'Israel Adesanya',
    record: '24 / 2',
    team: 'City Kickboxing',
    avatar: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mma/players/full/4285679.png&w=350&h=254',
    city: 'Lagos',
    exp: Experience.PRO,
    height: 193,
    weight: 84,
    reach: 203,
  },
  {
    id: 4,
    name: 'Jon Jones',
    record: '27 / 1',
    team: 'Jackson Wink MMA',
    avatar: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mma/players/full/2335639.png&w=350&h=254',
    city: 'Rochester',
    exp: Experience.PRO,
    height: 193,
    weight: 93,
    reach: 215,
  },
  {
    id: 5,
    name: 'Amanda Nunes',
    record: '23 / 5',
    team: 'American Top Team',
    avatar: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mma/players/full/2516131.png&w=350&h=254',
    city: 'Salvador',
    height: 173,
    exp: Experience.PRO,
    weight: 61,
    reach: 175,
  },
  {
    id: 6,
    name: 'Francis Ngannou',
    record: '17 / 3',
    team: 'MMA Factory',
    avatar: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mma/players/full/3933168.png&&w=350&h=254',
    city: 'Batié',
    exp: Experience.PRO,
    height: 193,
    weight: 120,
    reach: 211,
  },
  {
    id: 7,
    name: 'Stipe Miocic',
    record: '20 / 4',
    team: 'Strong Style Fight Team',
    avatar: 'https://a.espncdn.com/combiner/i?img=/i/headshots/mma/players/full/2504951.png&w=350&h=254',
    city: 'Cleveland',
    exp: Experience.PRO,
    height: 193,
    weight: 113,
    reach: 203,
  },
]

type Props = {
  fightConfig: {
    modality: string
    weightclass: any
    experience: string
  },
  selectedAthletes: {
    a?: any
    b?: any
  },
  onSelectAthlete: (fighter: any) => void
}

export const AthleteSelection = ({ selectedAthletes, onSelectAthlete }: Props) => {

  const { data: athletes, isLoading } = useAthletes({ skip: 0, take: 100 })
  
  const isFighterSelected = (fighterId: number) => {
    if(selectedAthletes.a?.id === fighterId || selectedAthletes.b?.id === fighterId){
      return true
    }

    return false
  }

  return (
    <ul>
      
      {
        athletes?.data.map(fighter => (
          <li
            aria-disabled={isFighterSelected(fighter.id) ? 'true' : 'false'}
            className="w-full hover:bg-sidebar-accent p-4 flex items-center justify-between group aria-disabled:pointer-events-none aria-disabled:opacity-40 cursor-pointer" 
            onClick={() => !isFighterSelected(fighter.id) && onSelectAthlete(fighter)}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col items-center relative">
                <Avatar className="size-16">
                  <AvatarFallback>{fighter.name[0]}</AvatarFallback>
                  <AvatarImage src={fighter.avatar} />
                </Avatar>
                <ExpBadges  exp={fighter.exp as any} size={"sm"} className="z-1 mt-1 absolute left-[50%] -translate-x-[50%] -bottom-[15px]"/>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{fighter.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{fighter.team}</span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <small>{fighter.record}</small>
                </div>
              </div>
            </div>
          </li>
        ))
      }
      {
        athletes.data?.length === 0 && (
          <div className='flex flex-col items-center justify-center py-8 gap-2'>
            <UserRoundSearch size={50}/>
            <span className='text-center'>Nenhum atleta disponível</span>
          </div>
        )
      }
      {
        isLoading && (
          <div className='flex flex-col gap-1'>
            <Skeleton className='h-[60px] w-full'/>
            <Skeleton className='h-[60px] w-full'/>
            <Skeleton className='h-[60px] w-full'/>
            <Skeleton className='h-[60px] w-full'/>
          </div>
        )
      }
    </ul>
  )
}
