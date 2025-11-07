'use client'

import React, { startTransition, useActionState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/dialog'
import { Button } from '@repo/ui/button'
import { Label } from '@repo/ui/label'
import { RadioGroup, RadioGroupItem } from '@repo/ui/radio-group'
import { Checkbox } from '@repo/ui/checkbox'
import { cn } from '@repo/ui/cn'
import { subscribeToEvent } from '~/app/event/[eventId]/actions'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Event } from '../models/event'

type RegistrationModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: Event
}

const registrationSchema = z.object({
  modality: z.string().min(1, 'Selecione uma modalidade'),
  expertise: z.string().min(1, 'Selecione seu nível de experiência'),
  weightClasses: z.array(z.number()).min(1, 'Selecione uma categoria de peso')
})

const MOCK_ATLETE_ID = '792a8c2a-7e80-4f42-bc6e-e326f6847c96'

type RegistrationForm = z.infer<typeof registrationSchema>

export function RegistrationModal({ open, onOpenChange, event }: RegistrationModalProps) {
  const [state, formAction, isPending] = useActionState(subscribeToEvent, { success: false, error: null, data: null })
  
  const { control, handleSubmit, formState: { errors }, watch } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      modality: '',
      expertise: '',
      weightClasses: []
    }
  })

  const selectedModality = watch('modality')

  const eventModalities = Object.keys(event.modalitiesConfig) || []
  const availableWeightClasses = event.modalitiesConfig[selectedModality]?.weightClasses || []
  const availableExpertises = event.modalitiesConfig[selectedModality]?.experience || []

  const onSubmit = (data: RegistrationForm) => {
    const payload = {
      ...data,
      eventId: event.id,
      athleteId: MOCK_ATLETE_ID
    }
    startTransition(() => formAction(payload))
  }

  // Close modal when registration is successful
  React.useEffect(() => {
    if (state.success) {
      onOpenChange(false)
    }
  }, [state.success, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-xl h-full max-h-screen md:h-fit md:max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl'>Inscrição no Evento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8 py-2'>
          {state.error && (
            <div className='p-3 text-sm text-destructive bg-destructive/10 rounded-md'>
              {state.error}
            </div>
          )}
          
          <Controller
            name='modality'
            control={control}
            render={({ field }) => (
              <div>
                <Label className='text-base font-semibold mb-4 block'>Escolha sua modalidade</Label>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  {eventModalities.map((modality) => (
                    <button
                      key={modality}
                      type='button'
                      onClick={() => field.onChange(modality)}
                      className={cn(
                        'p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50',
                        field.value === modality
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:bg-accent/50'
                      )}
                    >
                      <div className='font-medium'>{modality}</div>
                    </button>
                  ))}
                </div>
                {errors.modality && <span className='text-sm text-destructive'>{errors.modality.message}</span>}
              </div>
            )}
          />

          <Controller
            name='expertise'
            control={control}
            render={({ field }) => (
              <div>
                <Label className='text-base font-semibold mb-4 block'>Nível de experiência</Label>
                <RadioGroup 
                  value={field.value} 
                  onValueChange={field.onChange}
                  className='grid grid-cols-2 sm:grid-cols-4 gap-3'
                >
                  {availableExpertises.map((experience) => (
                    <div key={experience} className='flex items-center space-x-2'>
                      <RadioGroupItem value={experience} id={experience} />
                      <Label htmlFor={experience} className='text-sm font-medium cursor-pointer'>
                        {experience}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.expertise && <span className='text-sm text-destructive'>{errors.expertise.message}</span>}
              </div>
            )}
          />

          <Controller
            name='weightClasses'
            control={control}
            render={({ field }) => (
              <div>
                <Label className='text-base font-semibold mb-4 block'>Categorias de peso</Label>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  {availableWeightClasses.map((weightClass) => {
                    const weightClassId = `${weightClass.title}-${weightClass.minWeight}-${weightClass.maxWeight}`
                    return (
                      <div key={weightClassId} className='flex items-center space-x-2'>
                        <Checkbox
                          id={weightClassId}
                          checked={field.value?.includes(weightClass.maxWeight) || false}
                          onCheckedChange={(checked) => {
                            const currentValues = field.value || []
                            if (checked) {
                              field.onChange([...currentValues, weightClass.maxWeight])
                            } else {
                              field.onChange(currentValues.filter((weight: number) => weight !== weightClass.maxWeight))
                            }
                          }}
                        />
                        <Label 
                          htmlFor={weightClassId} 
                          className='text-sm font-medium cursor-pointer flex-1'
                        >
                          {weightClass.title} (até {weightClass.maxWeight}kg)
                        </Label>
                      </div>
                    )
                  })}
                </div>
                {errors.weightClasses && <span className='text-sm text-destructive'>{errors.weightClasses.message}</span>}
              </div>
            )}
          />

          <div className='flex gap-3 pt-6 border-t'>
            <Button variant='outline' onClick={() => onOpenChange(false)} className='flex-1'>
              Cancelar
            </Button>
            <Button 
              type='submit'
              className='flex-1'
              disabled={isPending}
            >
              {isPending ? 'Inscrevendo...' : 'Confirmar Inscrição'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}