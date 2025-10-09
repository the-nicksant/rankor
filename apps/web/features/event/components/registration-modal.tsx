'use client'

import React, { startTransition, useActionState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui/dialog'
import { Button } from '@repo/ui/button'
import { Label } from '@repo/ui/label'
import { RadioGroup, RadioGroupItem } from '@repo/ui/radio-group'
import Select from '@repo/ui/select'
import { cn } from '@repo/ui/cn'
import { subscribeToEvent } from '~/app/event/[eventId]/actions'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type RegistrationModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  eventId: string
}

const registrationSchema = z.object({
  modality: z.string().min(1, 'Selecione uma modalidade'),
  expertiseId: z.string().min(1, 'Selecione seu nível de experiência'),
  weightClass: z.string().min(1, 'Selecione uma categoria de peso')
})

type RegistrationForm = z.infer<typeof registrationSchema>

export function RegistrationModal({ open, onOpenChange, eventId }: RegistrationModalProps) {
  const [state, formAction, isPending] = useActionState(subscribeToEvent, { success: false, data: null })
  
  const { control, handleSubmit, formState: { errors } } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      modality: '',
      expertiseId: '',
      weightClass: ''
    }
  })

  const expertiseIds = ['Iniciante', 'Amador', 'Semi-Pro', 'Profissional']
  const weightClasses = [
    { value: 'flyweight', label: 'Peso Mosca (até 57kg)' },
    { value: 'bantamweight', label: 'Peso Galo (até 61kg)' },
    { value: 'featherweight', label: 'Peso Pena (até 66kg)' },
    { value: 'lightweight', label: 'Peso Leve (até 70kg)' },
    { value: 'welterweight', label: 'Peso Meio-Médio (até 77kg)' },
    { value: 'middleweight', label: 'Peso Médio (até 84kg)' },
    { value: 'lightheavyweight', label: 'Peso Meio-Pesado (até 93kg)' },
    { value: 'heavyweight', label: 'Peso Pesado (acima de 93kg)' }
  ]

  const eventModalities = ['Jiu-Jitsu', 'Muay Thai', 'Boxing', 'MMA']

  const onSubmit = (data: RegistrationForm) => {
    
    startTransition(() => formAction({
      ...data,
      athleteId: 'aaa',
      eventId,
    }))
    
    if (state.success) {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg h-full max-h-screen md:h-fit md:max-h-[90vh] overflow-y-auto'>
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
                      <div className='text-sm text-muted-foreground mt-1'>
                        {modality === 'Jiu-Jitsu' && 'Arte suave brasileira'}
                        {modality === 'Muay Thai' && 'Arte das oito armas'}
                        {modality === 'Boxing' && 'Nobre arte'}
                        {modality === 'MMA' && 'Artes marciais mistas'}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.modality && <span className='text-sm text-destructive'>{errors.modality.message}</span>}
              </div>
            )}
          />

          <Controller
            name='expertiseId'
            control={control}
            render={({ field }) => (
              <div>
                <Label className='text-base font-semibold mb-4 block'>Nível de experiência</Label>
                <RadioGroup 
                  value={field.value} 
                  onValueChange={field.onChange}
                  className='grid grid-cols-2 sm:grid-cols-4 gap-3'
                >
                  {expertiseIds.map((experience) => (
                    <div key={experience} className='flex items-center space-x-2'>
                      <RadioGroupItem value={experience} id={experience} />
                      <Label htmlFor={experience} className='text-sm font-medium cursor-pointer'>
                        {experience}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.expertiseId && <span className='text-sm text-destructive'>{errors.expertiseId.message}</span>}
              </div>
            )}
          />

          <Controller
            name='weightClass'
            control={control}
            render={({ field }) => (
              <div>
                <Label className='text-base font-semibold mb-4 block'>Categoria de peso</Label>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  options={weightClasses}
                  placeholder='Selecione sua categoria'
                />
                {errors.weightClass && <span className='text-sm text-destructive'>{errors.weightClass.message}</span>}
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