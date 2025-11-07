import React, { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useModalities } from '~/shared/hooks/data'
import { SelectionCard } from '~/features/event/components/selection-card'
import { Skeleton } from '@repo/ui/skeleton'
import { getModalityImage } from '~/shared/assets/modality-images'
import Select from '@repo/ui/select'
import { Badge } from '@repo/ui/badge'
import type { Event } from '~/features/event/models/event'
import { experienceOptions } from '~/features/athlete/domain/experience'
import { StepFooter, type StepControl } from '..'

type Props = {
  event: Event 
  step: StepControl
}


export const FightDetails = ({ event, step }: Props) => {
  
  const { 
    control, 
    watch, 
    trigger,
    setValue, 
    resetField,
    formState: { errors } 
  } = useFormContext()
  
  const selectedModality = watch('modality')

  const { data: modalities, isLoading: loadingModalities } = useModalities()

  const availableModalities = modalities.filter(mod => Object.keys(event?.modalitiesConfig).includes(mod.code))
  const availableWeightClasses = event?.modalitiesConfig[selectedModality]?.weightClasses || []
  const availableExpertise = experienceOptions.filter(exp => event?.modalitiesConfig[selectedModality]?.experience.includes(exp.value)) || []

  const handleNextStep = async () => {
    const isValid = await trigger(['modality', 'weightClass', 'expertise'])
    if(isValid){
      step.onNext()
    }
  }

  useEffect(() => {
    resetField('weightClass')
    resetField('expertise')
  }, [selectedModality])


  return (
    <section className='w-full flex flex-col gap-6'>
      <div className="flex-1 flex flex-col md:flex-row gap-8 lg:gap-12">
        <section>
          <div className='flex flex-col'>
            <h1>Modalidade</h1> 
            <small className='text-muted-foreground'>Selecione a modalidade da luta</small>
            <p className='text-destructive'>
              
            </p>
          </div>
          
          <div className='grid grid-cols-2 md:flex md:flex-wrap gap-2 w-full mt-4'>
            {loadingModalities && 
              <>
                <Skeleton className='h-[100px] w-[100px]'/>
                <Skeleton className='h-[100px] w-[100px]'/>
                <Skeleton className='h-[100px] w-[100px]'/>
                <Skeleton className='h-[100px] w-[100px]'/>
              </>
            }

            {availableModalities?.map(modality => (
              <SelectionCard 
                key={modality.code}
                value={modality.code}
                checked={selectedModality === modality.code}
                title={modality.name}
                description=''
                size="small"
                image={getModalityImage(modality.code)}
                onClick={(value) => setValue('modality', value)}
              />
            ))}
          </div>
        </section>
        <div className='flex-1 flex flex-col gap-8 w-full'>
          <section>
            <div className='flex flex-col'>
              <h1>Experiência</h1>
              <small className='text-muted-foreground'>Selecione a experiência desejada dos atletas</small>
            </div>
            <div className='w-full py-4'>
              <Controller 
                name='expertise'
                control={control}
                render={({ field }) => (
                  <div className='flex flex-wrap gap-2'>
                    {
                      availableExpertise.map(exp => (
                        <Badge 
                          fill={field.value === exp.value}
                          onClick={() => field.onChange(exp.value)}
                          className='cursor-pointer'
                          size={'lg'}              
                        >
                          {exp.label}
                        </Badge>
                      ))
                    }
                  </div>
                )}
              />
            </div>
          </section>
          <section className='w-full'>
            <div className='flex flex-col'>
              <h1>Categoria de peso</h1>
              <small className='text-muted-foreground'>Selecione a categoria de peso da luta</small>
            </div>
            <div className='w-full py-4'>
              <Controller 
                name='weightClass'
                control={control}
                render={({ field }) => (
                  <div className='w-full'>
                    <Select 
                      value={field.value}
                      onChange={v => field.onChange(v)}
                      options={availableWeightClasses.map((wc) => ({
                        value: wc.maxWeight.toString(),
                        label: `${wc.title} (até ${wc.maxWeight}kg)`
                      }))}
                    />
                  </div>
                )}
              />
            </div>
          </section>
        </div>
      </div>
      <StepFooter 
        onNext={() => handleNextStep()}
      />
    </section>
  )
}
