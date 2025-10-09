import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'

type Athlete = {
  firstname: string
  lastname: string
  nickname: string
  birthdate: string
  city: string
  state: string
  country: string
  phone: string
  document: string
  email: string
  weight: number
  height: number
  modalities: string[]
  expertises: string[]
  wins?: number
  losses?: number
  avatar?: string
}

type AthleteListItemProps = {
  athlete: Athlete
}

export default function AthleteListItem({ athlete }: AthleteListItemProps) {
  const getWeightClass = (weight: number) => {
    if (weight <= 70) return 'Peso Leve'
    if (weight <= 80) return 'Peso Meio-Médio'
    if (weight <= 90) return 'Peso Médio'
    return 'Peso Pesado'
  }

  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase()
  }

  return (
    <div className='flex items-center gap-4 px-6 py-4 border-b hover:bg-accent/50 transition-colors'>
      <Avatar className='h-12 w-12'>
        <AvatarImage src={athlete.avatar} />
        <AvatarFallback>{getInitials(athlete.firstname, athlete.lastname)}</AvatarFallback>
      </Avatar>
      
      <div className='flex-1 grid grid-cols-1 md:grid-cols-6 gap-2 md:gap-4 items-center'>
        <div className='md:col-span-4'>
          <div className='font-semibold text-sm'>
            {athlete.firstname} <span className='text-rankor'>"{athlete.nickname}"</span> {athlete.lastname}
          </div>
          <div className='text-sm text-muted-foreground'>
            {athlete.city}, {athlete.state}
          </div>
        </div>
        
        <div className='text-sm'>
          <div className='font-medium'>
            {athlete.wins || 0}W - {athlete.losses || 0}L
          </div>
          <div className='text-muted-foreground'>Cartel</div>
        </div>
        
        <div className='text-sm'>
          <div className='font-medium'>{getWeightClass(athlete.weight)}</div>
          <div className='text-muted-foreground'>{athlete.weight}kg</div>
        </div>
      </div>
    </div>
  )
}
