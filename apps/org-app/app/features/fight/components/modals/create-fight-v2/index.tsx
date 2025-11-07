import React, { Activity, useState } from 'react'

import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@repo/ui/sheet'
import type { ModalProps } from '~/shared/types/modal'
import { FormStepper } from './animated-stepper'
import { File, HandFist, ListChecks, Scale } from 'lucide-react'
import { FightDetails } from './steps/fight-details'
import { FormProvider, useForm } from 'react-hook-form'
import { useEvent } from '~/features/event/hooks/data'
import { Button } from '@repo/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { PickFighters } from './steps/pick-fighters'

type CreateFightModalPayload = {
  eventId: string
}

export interface StepControl {
  onNext: () => void
  onPrev: () => void
}

const fightSchema = z.object({
  modality: z.string().min(1, 'Modalidade é obrigatória'),
  expertise: z.string().min(1, 'Nível é obrigatório'),
  weightClass: z.string().min(1, 'Categoria de peso é obrigatória'),
  athleteA: z.string().min(1, 'Atleta A é obrigatório'),
  athleteB: z.string().min(1, 'Atleta B é obrigatório'),
  config: z.object({
    roundDuration: z.number().min(1, 'Duração do round deve ser maior que 0'),
    numberOfRounds: z.number().min(1, 'Número de rounds deve ser maior que 0'),
    restTime: z.number().min(0, 'Tempo de descanso não pode ser negativo'),
    pointSystem: z.record(z.string(), z.number()),
  })
})

type FightFormData = z.infer<typeof fightSchema>

export default function FightCreationModal ({ onClose, payload }: ModalProps<CreateFightModalPayload>) {
  const methods = useForm<FightFormData>({
    resolver: zodResolver(fightSchema),
    defaultValues: {
      modality: '',
      expertise: '',
      weightClass: '',
      athleteA: '',
      athleteB: '',
      config: {
        roundDuration: 300, // 5 minutes in seconds
        numberOfRounds: 3,
        restTime: 60, // 1 minute in seconds
        pointSystem: {
          'knockdown': 10,
          'takedown': 2,
          'submission_attempt': 3,
          'strike_landed': 1
        },
      }
    }
  })
  const [currentStep, setCurrentStep] = useState(1)

  const { data: event } = useEvent({ eventId: payload?.eventId })

  const stepControl: StepControl = {
    onNext: () => setCurrentStep(s => Math.min(steps.length + 1, s + 1)),
    onPrev: () => setCurrentStep(s => Math.max(1, s - 1)),
  }

  const steps = [
    {
      title: 'Detalhes',
      icon: File,
      description: 'Informações básicas da luta',
      step: <FightDetails event={event!} step={stepControl}/>,
    },
    {
      title: 'Lutadores',
      icon: HandFist,
      description: 'Selecione os melhores competidores',
      step: <PickFighters event={event!} step={stepControl} />
    },
    {
      title: 'Regras',
      icon: Scale,
      description: 'Defina as regras da luta',
      step: <div></div>
    },
    {
      title: 'Revisão',
      icon: ListChecks,
      description: 'Confirme os dados da luta',
      step: <div></div>
    },
  ] 
  
  return (
    <Sheet onOpenChange={() => onClose()} open>
      <SheetContent side='bottom' className='h-screen flex flex-col'>
        <SheetHeader className='shrink-0'>
          <SheetTitle>Criar luta</SheetTitle>
          <SheetDescription>
            Defina os detalhes da luta e selecione os atletas que irão competir.
          </SheetDescription>
        </SheetHeader>
        <div className='h-[calc(100vh-82px)] w-full overflow-y-auto'>
          <Activity mode={event ? 'visible' : 'hidden'}>
            <section className='gap-8 h-full flex flex-row items-center'>
              {/* <div className='py-b w-full shrink-0 px-6'>
                <FormStepper 
                  currentStep={currentStep}
                  steps={steps}
                />
              </div> */}

              <FormProvider {...methods}>
                <div className='w-full h-full flex-1 shrink-0 flex flex-col px-6 pb-6'>
                  {
                    steps.map((step, index) => (
                      <Activity key={index} mode={(currentStep - 1) === index ? 'visible' : 'hidden'}>
                        {step.step}
                      </Activity>
                    ))
                  }
                </div>
              </FormProvider>
            </section>
          </Activity>
        </div>

      </SheetContent>
    </Sheet>
  )
}

type StepFooterProps = {
  showBack?: boolean
  nextProps?: {
    disabled?: boolean
    loading?: boolean
    children?: boolean
  }
  onNext?: () => void
  onBack?: () => void
}


export const StepFooter = ({ nextProps, showBack, onNext, onBack}: StepFooterProps) => {
  return (
    <div className='w-full flex items-center justify-end gap-2'>
      {
        showBack && 
          <Button variant='secondary' onClick={() => onBack?.()}>
            Voltar
          </Button>
      }
      <Button
        {...nextProps}
        children={nextProps?.children || 'Próximo'}
        onClick={() => onNext?.()}
      />
    </div>
  )
}