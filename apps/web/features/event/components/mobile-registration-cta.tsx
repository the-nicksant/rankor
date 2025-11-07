'use client'

import React, { useState } from 'react'
import { Button } from '@repo/ui/button'
import { ChevronUp, ChevronDown, Users, LogIn } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@repo/ui/collapsible'
import { RegistrationModal } from './registration-modal'
import Link from 'next/link'
import { Event } from '../models/event'

type MobileRegistrationCTAProps = {
  price: string | null
  registeredAthletes: number
  registrationDeadline: string
  event: Event
  isAuthenticated: boolean
}

export function MobileRegistrationCTA({ 
  price, 
  registeredAthletes, 
  registrationDeadline,
  event,
  isAuthenticated
}: MobileRegistrationCTAProps) {

  const [isOpen, setIsOpen] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)

  const handleRegistrationClick = () => {
    if (isAuthenticated) {
      setShowRegistrationModal(true)
    }
  }

  const loginUrl = `/athlete/login?redirect=${encodeURIComponent(`/event/${event.id}`)}`

  return (
    <>
      <div className='space-y-6 hidden lg:block'>
        {/* Registration Card */}
        <div className='bg-card p-6 rounded-lg border sticky top-4'>
          <div className='text-center mb-6'>
            <div className='flex items-center justify-center gap-2 mb-2'>
              <Users className='h-5 w-5 text-primary' />
              <span className='text-sm text-muted-foreground'>
                {registeredAthletes || 45} atletas inscritos
              </span>
            </div>
            {
              price &&
                <>
                  <div className='text-2xl font-bold text-primary mb-1'>
                    R$ {price || '150,00'}
                  </div>
                  <p className='text-sm text-muted-foreground'>Taxa de inscrição</p>
                </>
            }
          </div>

          <div className='space-y-4'>
            {isAuthenticated ? (
              <Button 
                size={'lg'} 
                className='w-full rounded-md text-lg'
                onClick={handleRegistrationClick}
              >
                Inscrever-se
              </Button>
            ) : (
              <Link href={loginUrl}>
                <Button 
                  size={'lg'} 
                  className='w-full rounded-md text-lg'
                  variant="outline"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Fazer Login para Inscrever-se
                </Button>
              </Link>
            )}
          </div>

          <div className='mt-6 pt-6 border-t'>
            <h4 className='font-semibold mb-3'>Informações Importantes</h4>
            <ul className='space-y-2 text-sm text-muted-foreground'>
              <li>• Inscrições até {registrationDeadline || '10/01/2024'}</li>
              <li>• Pesagem no dia do evento</li>
              <li>• Documento obrigatório</li>
              <li>• Atestado médico necessário</li>
            </ul>
          </div>
        </div>
      </div>
      <div className='lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50'>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent>
            <div className='p-4 border-b'>
              <div className='flex items-center justify-center gap-2 mb-3'>
                <Users className='h-4 w-4 text-primary' />
                <span className='text-sm text-muted-foreground'>
                  {registeredAthletes} atletas inscritos
                </span>
              </div>
              <ul className='space-y-2 text-sm text-muted-foreground'>
                <li>• Inscrições até {registrationDeadline}</li>
                <li>• Pesagem no dia do evento</li>
                <li>• Documento obrigatório</li>
                <li>• Atestado médico necessário</li>
              </ul>
            </div>
          </CollapsibleContent>
          
          <div className='p-4'>
            <div className='flex items-center justify-between mb-3'>
              <div>
                <div className='text-xl font-bold text-primary'>R$ {price}</div>
                <div className='text-sm text-muted-foreground'>Taxa de inscrição</div>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant='text' size='sm'>
                  {isOpen ? <ChevronDown className='h-4 w-4' /> : <ChevronUp className='h-4 w-4' />}
                </Button>
              </CollapsibleTrigger>
            </div>
            {isAuthenticated ? (
              <Button 
                size='lg' 
                className='w-full rounded-md text-lg'
                onClick={handleRegistrationClick}
              >
                Inscrever-se
              </Button>
            ) : (
              <Link href={loginUrl}>
                <Button 
                  size='lg' 
                  className='w-full rounded-md text-lg'
                  variant="outline"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Fazer Login para Inscrever-se
                </Button>
              </Link>
            )}
          </div>
        </Collapsible>
      </div>


      {isAuthenticated && (
        <RegistrationModal 
          open={showRegistrationModal}
          onOpenChange={setShowRegistrationModal}
          event={event}
        />
      )}
    </>
  )
}