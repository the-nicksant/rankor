import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'
import { Button } from '@repo/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@repo/ui/dropdown-menu'
import dayjs from 'dayjs'
import { MoreVertical } from 'lucide-react'
import React, { useRef } from 'react'
import type { Athlete } from '~/features/athlete/domain/athlete'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'

type Props = {
  fighter: Athlete
  disabled?: boolean
}

export const FighterListItem = ({ fighter }: Props) => {
  const elementRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return

    return draggable({
      element,
      getInitialData: () => ({
        type: 'athlete',
        athlete: fighter,
      }),
    })
  }, [fighter])
  
  return (
    <div 
      ref={elementRef}
      className='w-full p-4 bg-card flex items-center justify-between cursor-grab active:cursor-grabbing hover:bg-accent transition-colors'
      draggable={false}
    >
      <div className='flex items-center gap-4'>
        <Avatar className='size-12'>
          <AvatarFallback>{fighter.firstname[0]}</AvatarFallback>
          {/* <AvatarImage src={fighter.}></AvatarImage> */}
        </Avatar>
        <div className='flex flex-col'>
          <span>{fighter.firstname} {fighter.lastname}</span>
          <p className='text-muted-foreground text-xs'>{16} / 3 ・ {fighter.city} ・ {dayjs().diff(dayjs(fighter.birthdate), 'years')} anos</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button 
            icon={<MoreVertical />}
            variant={'text'}
            size={'sm'}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup title='Adicionar à'>
            <DropdownMenuItem>Corner vermelho</DropdownMenuItem>
            <DropdownMenuItem>Corner azul</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
