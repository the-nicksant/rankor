import React from 'react'

import { Calendar } from '@repo/ui/calendar'
import { EventHeaderCard } from '~/features/event/components/dashboard-header-card'
import { useEvents } from '~/features/event/hooks/data'
import { Skeleton } from '@repo/ui/skeleton'

export default function Events() {
  const { data: events, isLoading } = useEvents({ skip: 0, take: 100 })


  if(isLoading || !events.data.length){
    return (
      <div className='grid grid-cols-3'>
        <Skeleton className='col-span-2'/>
        <Skeleton className='col-span-2'/>
        <Skeleton className='col-span-2'/>
        <Skeleton className='col-span-1 row-span-3' />
      </div>
    )
  }

  return (
    <div className='w-full p-8'>
      <EventHeaderCard event={events?.data[0]}/>
      <header className='md:col-start-1 md:col-end-3 w-full'>
      </header>
      <div className='md:col-start-2 md:col-end-4'>
        <Calendar />
      </div>
      <main className='md:col-start-1 md:col-end-4'>

      </main>
    </div>
  )
}
