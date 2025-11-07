import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import React, { useEffect, useRef, useState } from "react"
import type { Athlete } from "~/features/athlete/domain/athlete"
import { Avatar, AvatarFallback } from '@repo/ui/avatar'
import { Button } from '@repo/ui/button'
import { X, ExternalLink } from 'lucide-react'
import { cn } from '~/lib/cn'

export const FightCornerDropZone = React.memo(({ 
  corner, 
  athlete, 
  onAthleteDrop,
  onRemove
}: { 
  corner: 'red' | 'blue', 
  athlete?: Athlete,
  onAthleteDrop: (athlete: Athlete, corner: 'red' | 'blue') => void,
  onRemove?: () => void
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    return dropTargetForElements({
      element,
      getData: () => ({ type: 'fight-corner', corner }),
      canDrop: ({ source }) => source.data.type === 'athlete',
      onDragEnter: () => setIsDragOver(true),
      onDragLeave: () => setIsDragOver(false),
      onDrop: ({ source }) => {
        setIsDragOver(false)
        const athleteData = source.data.athlete as Athlete
        if (athleteData) {
          onAthleteDrop(athleteData, corner)
        }
      },
    })
  }, [corner, onAthleteDrop])

  const cornerLabels = {
    red: 'Canto Vermelho',
    blue: 'Canto Azul'
  }

  return (
    <div 
      ref={ref}
      className={cn(
        'w-full flex-1 py-4 relative transition-all duration-200', 
        corner === 'red' 
          ? 'pr-8 bg-corner-a'
          : 'pl-8 bg-corner-b',
        !athlete && 'bg-background',
        isDragOver && 'ring-2 ring-primary ring-opacity-50'
      )}
    >
      {/* Action buttons when athlete is present */}
      {athlete && onRemove && (
        <div
          className={cn(
            'flex flex-col gap-2 absolute top-2',
            corner === 'red'
              ? 'left-2'
              : 'right-2'
          )}
        >
          <Button variant='text' size={'sm'} onClick={onRemove}>
            <X />
          </Button>
          <Button variant='text' size={'sm'}>
            <ExternalLink />
          </Button>
        </div>
      )}

      {/* Avatar section */}
      <div 
        className={cn(
          'flex', 
          corner === 'red' 
            ? 'text-end justify-end'
            : 'text-start justify-start'
        )}
      >
        {athlete ? (
          <Avatar className='size-24'>
            <AvatarFallback>
              {athlete.firstname[0]}{athlete.lastname[0]}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="size-24 rounded-full border-2 border-dashed border-border flex items-center justify-center">
            <div className="text-muted-foreground text-xs text-center">
              <div className="font-medium">{cornerLabels[corner]}</div>
              <div className="text-xs">Arraste aqui</div>
            </div>
          </div>
        )}
      </div>

      <div 
        className={cn(
          'flex flex-col gap-2 mt-4', 
          corner === 'red' 
            ? 'text-end justify-end pl-2'
            : 'text-start justify-start pr-2'
        )}
      >
        <h1 className="text-title text-xl">
          {athlete ? `${athlete.firstname} ${athlete.lastname}` : 'Selecione um atleta'}
        </h1>
        {athlete ? (
          <p className="text-label">{athlete.nickname}</p>
        ) : (
          <p className="text-muted-foreground text-sm">Arraste um atleta da lista</p>
        )}
      </div>
    </div>
  )
})