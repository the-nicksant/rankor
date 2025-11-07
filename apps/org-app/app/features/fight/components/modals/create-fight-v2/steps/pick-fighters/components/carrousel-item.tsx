import React, { Activity } from 'react'
import { ArrowRightLeft, HandFist, Shuffle } from 'lucide-react'

import { Button } from '@repo/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@repo/ui/empty'

import type { Athlete } from '~/features/athlete/domain/athlete'

import { FightCornerDropZone } from './fighters-drop-zone'

type Props = {
  athletes: {
    red?: Athlete
    blue?: Athlete
  },
  onDropAthlete: (athlete: Athlete, corner: 'red' | 'blue') => void
  onRemoveAthlete: (id: string, corner: 'red' | 'blue') => void 
}

export const FightCarrouselItem = ({ athletes, onRemoveAthlete, onDropAthlete }: Props) => {
  return (
    <div className='flex flex-col flex-1 w-full h-full'>
      <header className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Button 
            size={'sm'} 
            icon={<Shuffle  />} 
            title="Escolher atletas randomicamente"
            variant={'secondary'}
          />
          <Button 
            size={'sm'} 
            icon={<ArrowRightLeft />} 
            title="Trocar corners"
            variant={'secondary'}
          />
        </div>
      </header>

      <section className='h-[220px] flex gap-4 shrink-0 p-1'>
        <FightCornerDropZone 
          corner="red" 
          athlete={athletes.red} 
          onAthleteDrop={onDropAthlete}
          onRemove={() => athletes.red && onRemoveAthlete(athletes.red?.id, 'red')}
        />
        <FightCornerDropZone 
          corner="blue" 
          athlete={athletes.blue} 
          onAthleteDrop={onDropAthlete}
          onRemove={() => athletes.blue && onRemoveAthlete(athletes.blue?.id, 'blue')}
        />
      </section>
      <div className='h-full flex-1 bg-card rounded-lg p-4 m-1'>
        <Activity mode={(!athletes.blue && !athletes.blue) ? 'visible' : 'hidden'}>
          <Empty>
            <EmptyMedia variant={'icon'}>
              <HandFist size={24}/>
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Nenhum atleta selecionado</EmptyTitle>
              <EmptyDescription>
                Arraste dois dos atletas ao lado para confirmar uma nova luta
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </Activity>
        <Activity mode={(athletes.blue || athletes.blue) ? 'visible' : 'hidden'}>
          <Tabs defaultValue='compare'>
            <TabsList>
              <TabsTrigger value='compare'>Comparativo</TabsTrigger>
              <TabsTrigger value='historic'>Histórico</TabsTrigger>
              <TabsTrigger value='rules'>Regras</TabsTrigger>
            </TabsList>
            <TabsContent value='compare'>
              Comparing
            </TabsContent>
            <TabsContent value='historic'>
              Histórico
            </TabsContent>
            <TabsContent value='rules'>
              Regras
            </TabsContent>
          </Tabs>
        </Activity>
      </div>
    </div>
  )
}
