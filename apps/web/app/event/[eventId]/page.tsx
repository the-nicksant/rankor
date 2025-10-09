
import React, { cache } from 'react'
import Image from 'next/image'
import { Calendar, MapPin } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'
import { AthletesTab } from '~/features/event/components/profile/tabs/athletes-tab'
import { FightsTab } from '~/features/event/components/profile/tabs/fights-tab'
import { MobileRegistrationCTA } from '~/features/event/components/mobile-registration-cta'

const getEvent = cache(async (id: string) => {
  const event = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/events/${id}`).then(res => res.json())
  return event
})

export default async function EventProfile({ params }: { params: Promise<{eventId: string}> }) {

  const { eventId } = await params

  //const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  // Mock event data - replace with actual data fetching
  const event = {
    title: 'Fight Event',
    description: 'Event description',
    date: '15 de Janeiro, 2024',
    time: '19:00',
    venue: 'Arena de Lutas',
    address: 'Rua das Lutas, 123 - São Paulo, SP',
    modalities: ['Jiu-Jitsu', 'Muay Thai', 'Boxing'],
    fullDescription: 'Descrição completa do evento de lutas. Aqui você encontrará todas as informações sobre as categorias, regras e premiações do evento.',
    registeredAthletes: 45,
    price: '150,00',
    registrationDeadline: '10/01/2024'
  }

  return (
    <div className='min-h-screen bg-background pb-[150px]'>
      {/* Banner Section */}
      <div className='relative h-64 md:h-96 w-full overflow-hidden'>
        <Image
          src={event?.banner || '/placeholder-banner.jpg'}
          alt={event?.title || 'Event Banner'}
          fill
          className='object-cover'
        />
        <div className='absolute inset-0 bg-black/50' />
        <div className='absolute bottom-0 left-0 right-0 p-4 md:p-8'>
          <div className='max-w-6xl mx-auto'>
            <h1 className='text-2xl md:text-5xl font-bold text-white mb-2'>
              {event?.title || 'Fight Event'}
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
                      {event?.date || '15 de Janeiro, 2024'}
                    </p>
                    <p className='text-muted-foreground'>
                      {event?.time || '19:00'}
                    </p>
                  </div>

                  <div className='bg-card p-4 rounded-lg border'>
                    <div className='flex items-center gap-3 mb-2'>
                      <MapPin className='h-5 w-5 text-primary' />
                      <h3 className='font-semibold'>Local</h3>
                    </div>
                    <p className='text-muted-foreground'>
                      {event?.venue || 'Arena de Lutas'}
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {event?.address || 'Rua das Lutas, 123 - São Paulo, SP'}
                    </p>
                  </div>
                </div>

                {/* Modalities */}
                <div className='bg-card p-6 rounded-lg border'>
                  <h3 className='font-semibold text-lg mb-4'>Modalidades</h3>
                  <div className='flex flex-wrap gap-2'>
                    {event?.modalities?.map((modality: string, index: number) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-primary/10 text-primary rounded-full text-sm'
                      >
                        {modality}
                      </span>
                    )) || [
                      'Jiu-Jitsu',
                      'Muay Thai',
                      'Boxing'
                    ].map((modality, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-primary/10 text-primary rounded-full text-sm'
                      >
                        {modality}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Event Description */}
                <div className='bg-card p-6 rounded-lg border'>
                  <h3 className='font-semibold text-lg mb-4'>Sobre o Evento</h3>
                  <p className='text-muted-foreground leading-relaxed'>
                    {event?.fullDescription || 'Descrição completa do evento de lutas. Aqui você encontrará todas as informações sobre as categorias, regras e premiações do evento.'}
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
            price={event?.price || '150,00'}
            registeredAthletes={event?.registeredAthletes || 45}
            registrationDeadline={event?.registrationDeadline || '10/01/2024'}
            eventId={eventId}
          />
          
        </div>
      </div>
    </div>
  )
}
