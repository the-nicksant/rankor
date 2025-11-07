
import React, { cache, Suspense } from 'react'
import Image from 'next/image'
import { Calendar, MapPin } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'
import { AthletesTab } from '~/features/event/components/profile/tabs/athletes-tab'
import { FightsTab } from '~/features/event/components/profile/tabs/fights-tab'
import { MobileRegistrationCTA } from '~/features/event/components/mobile-registration-cta'
import { getAuthHeaders, isAuthenticated } from '~/lib/auth'
import { logout } from '~/app/athlete/logout/actions'
import { Skeleton } from '@repo/ui/skeleton'
import { Event } from '~/features/event/models/event'

const getEvent = cache(async (eventId: string): Promise<Event | null> => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/v1/event/${eventId}`, {
    headers: await getAuthHeaders()
  })

  if(res.ok){
    return res.json()
  }

  return null
})

export default async function EventProfile({ params }: { params: Promise<{eventId: string}> }) {

  const authenticated = await isAuthenticated()

  if(!authenticated) {
    return logout()
  }

  const { eventId } = await params

  try {
    const event = await getEvent(eventId)

    if(!event) return (
      <div>
        Este evento não existe
      </div>
    )

    return (
      <Suspense
        fallback={
          <div className='bg-background'>
            <Skeleton className='w-full h-20'/>
            <Skeleton className='w-full h-20'/>
            <Skeleton className='w-full h-20'/>
          </div>
        }
      >
        <div className='min-h-screen bg-background pb-[150px]'>
          {/* Banner Section */}
          <div className='relative h-64 md:h-96 w-full overflow-hidden'>
            <Image
              src={'/placeholder-banner.jpg'}
              alt={event.name || 'Event Banner'}
              fill
              className='object-cover'
            />
            <div className='absolute inset-0 bg-black/50' />
            <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8'>
              <div className='max-w-6xl mx-auto'>
                <h1 className='text-2xl md:text-5xl font-bold text-white mb-2'>
                  {event?.name || 'Fight Event'}
                </h1>
                <p className='text-gray-200 text-sm md:text-base max-w-2xl'>
                  {event?.description || 'Event description'}
                </p>
              </div>
            </div>
          </div>
  
          {/* Main Content */}
          <div className='max-w-6xl mx-auto p-4 md:p-8'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Event Details */}
              <div className='lg:col-span-2 space-y-6'>
                {/* Tabs Section */}
                <Tabs defaultValue='info' className='w-full'>
                  <TabsList className='w-full overflow-x-auto'>
                    <TabsTrigger value='info'>Informações</TabsTrigger>
                    <TabsTrigger value='athletes'>Atletas</TabsTrigger>
                    <TabsTrigger value='fights'>Lutas</TabsTrigger>
                    <TabsTrigger value='schedule'>Cronograma</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value='info' className='space-y-6 mt-6'>
                    {/* Event Info Cards */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='bg-card p-4 rounded-lg border'>
                        <div className='flex items-center gap-3 mb-2'>
                          <Calendar className='h-5 w-5 text-primary' />
                          <h3 className='font-semibold'>Data e Hora</h3>
                        </div>
                        <p className='text-muted-foreground'>
                          {new Date(event?.date).toLocaleString()}
                        </p>
                        <p className='text-muted-foreground'>
                          {new Date(event?.date).toLocaleTimeString()}
                        </p>
                      </div>
  
                      <div className='bg-card p-4 rounded-lg border'>
                        <div className='flex items-center gap-3 mb-2'>
                          <MapPin className='h-5 w-5 text-primary' />
                          <h3 className='font-semibold'>Local</h3>
                        </div>
                        <p className='text-muted-foreground'>
                          {event?.address.street}, {event.address.number}
                        </p>
                        <p className='text-muted-foreground text-sm'>
                          {event?.address.district} -{event?.address.city}
                        </p>
                      </div>
                    </div>
  
                    {/* Modalities */}
                    <div className='bg-card p-6 rounded-lg border'>
                      <h3 className='font-semibold text-lg mb-4'>Modalidades</h3>
                      <div className='flex flex-wrap gap-2'>
                        
                      </div>
                    </div>
  
                    {/* Event Description */}
                    <div className='bg-card p-6 rounded-lg border'>
                      <h3 className='font-semibold text-lg mb-4'>Sobre o Evento</h3>
                      <p className='text-muted-foreground leading-relaxed'>
                        {event?.about}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value='athletes' className='mt-6'>
                    <AthletesTab />
                  </TabsContent>
                  
                  <TabsContent value='fights' className='mt-6'>
                    <FightsTab />
                  </TabsContent>
                  
                  <TabsContent value='schedule' className='mt-6'>
                    <div className='bg-card p-6 rounded-lg border'>
                      <h3 className='font-semibold text-lg mb-4'>Cronograma</h3>
                      <p className='text-muted-foreground'>Horários do evento serão exibidos aqui.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
  
              {/* Sidebar - Registration */}

              <MobileRegistrationCTA 
                price={null}
                registeredAthletes={45}
                registrationDeadline={new Date(event?.subscriptionConfig.maxSubscriptions).toLocaleDateString()}
                event={event}
                isAuthenticated={authenticated}
              />
            </div>
          </div>
        </div>
      </Suspense>
    )
  } catch (error) {
    return (
      <div>
        Ocorreu um erro
      </div>
    )
  }

  
}
