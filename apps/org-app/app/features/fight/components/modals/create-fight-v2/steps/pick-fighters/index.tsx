import React from 'react'
import { Filter, Search } from 'lucide-react'

import type { Event } from '~/features/event/models/event'
import { createAthlete, type Athlete } from '~/features/athlete/domain/athlete'

import { FighterListItem } from './components/fighter-list-item'

import { Input } from '@repo/ui/input'
import { Button } from '@repo/ui/button'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@repo/ui/carousel'

import type { StepControl } from '../..'
import { FightCarrouselItem } from './components/carrousel-item'

type Props = {
  event: Event
  step: StepControl
}


export const PickFighters = ({ step }: Props) => {
  // Generate mock athletes with dynamic data
  const mockAthletes: Athlete[] = Array.from({ length: 15 }, () => createAthlete())

  // State for fight corners
  const [redCornerAthlete, setRedCornerAthlete] = React.useState<Athlete | undefined>()
  const [blueCornerAthlete, setBlueCornerAthlete] = React.useState<Athlete | undefined>()

  // Handle athlete drop
  const handleAthleteDrop = (athlete: Athlete, corner: 'red' | 'blue') => {
    if (corner === 'red') {
      setRedCornerAthlete(athlete)
    } else {
      setBlueCornerAthlete(athlete)
    }
  }

  // Handle athlete removal
  const handleAthleteRemove = (corner: 'red' | 'blue') => {
    if (corner === 'red') {
      setRedCornerAthlete(undefined)
    } else {
      setBlueCornerAthlete(undefined)
    }
  }

  return (
    <div className='flex flex-col gap-4 h-[calc(100vh-82px-100px)]'>
      <div className='w-full items-stretch flex h-full flex-1 gap-4'>
        <div className='flex-1 flex flex-col w-full h-full rounded-lg bg-card border border-border p-4'>
          <header className='mb-4'>
            <h2 className='text-sm mb-1'>Escolha seus atletas</h2>
            <p className='text-xs text-muted-foreground'>Adicione os lutadores que irão se enfrentar. Você pode casar várias lutas de uma vez.</p>
          </header>
          <header className='flex gap-2'>
            <Input size={'sm'} className='w-full' icon={<Search size={16}/>} placeholder='Pesquisar atletas'/>
            <Button size={'sm'} icon={<Filter />} variant={'outline'}/>
          </header>
          <ul className='flex-1 h-full overflow-y-auto flex flex-col gap-2 py-4 scroll-smooth'>
            {mockAthletes.map((athlete) => (
              <FighterListItem 
                key={athlete.id} 
                fighter={athlete} 
                disabled={redCornerAthlete?.id === athlete.id || blueCornerAthlete?.id === athlete.id}
              />
            ))}
          </ul>
        </div>


        <div className='col-span-2 flex-2 flex flex-col gap-4 px-12'>
          <Carousel 
            className='h-full'
            opts={{
              align: 'center',
              loop: false,
            }}
          >
            <CarouselContent className='h-full'>
              <CarouselItem className='h-full'>
                <FightCarrouselItem 
                  athletes={{ red: redCornerAthlete, blue: blueCornerAthlete }}
                  onDropAthlete={handleAthleteDrop}
                  onRemoveAthlete={(_, corner) => handleAthleteRemove(corner)}
                />
              </CarouselItem>
              <CarouselItem className=''>
                <FightCarrouselItem 
                  athletes={{ red: redCornerAthlete, blue: blueCornerAthlete }}
                  onDropAthlete={handleAthleteDrop}
                  onRemoveAthlete={(_, corner) => handleAthleteRemove(corner)}
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>

      <div className='flex justify-end gap-4 shrink-0'>
        <Button variant={'secondary'} onClick={() => step.onPrev()}>
          Voltar
        </Button>
        <Button>
          Próximo
        </Button>
      </div>
    </div>
  )
}
