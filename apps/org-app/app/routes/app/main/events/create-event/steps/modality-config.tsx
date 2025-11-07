'use client'

import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form'
import { Input } from '@repo/ui/input'
import { cn } from '~/lib/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@repo/ui/button'
import { SelectionCard } from '~/features/event/components/selection-card'
import { useEffect, useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@repo/ui/collapsible'
import { Badge } from '@repo/ui/badge'

import { CheckCircle, ChevronDown, List, Plus } from 'lucide-react'
import { useEventCreation } from '../context'

import { useParams } from 'react-router'

import { modalityConfigSchema } from '~/features/event/schemas'
import { experienceOptions } from '~/features/athlete/domain/experience'
import { useUpdateEventModalityConfig } from '~/features/event/hooks/mutations'
import { toast } from 'sonner'

import Tooltip from '@repo/ui/tooltip'
import { useModalities } from '~/shared/hooks/data'
import { getModalityImage } from '~/shared/assets/modality-images'
import type { Modality } from '~/shared/domain/models/modality'

export const ModalityConfigEventForm = () => {
  const { eventId } = useParams()
  const { 
    nextStep, 
    previousStep, 
    setCurrentStep, 
    currentEvent, 
    updateCurrentEventData 
  } = useEventCreation()

  const [selectedModalities, setSelectedModalities] = useState<string[]>([])

  const { data: modalities } = useModalities()

  const indexedModalities = modalities?.reduce((acc, modality) => {
    acc[modality.code] = modality

    return acc
  }, {} as Record<string, Modality>) || {}

  const methods = useForm({
    resolver: zodResolver(modalityConfigSchema)
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    setValue,
    watch,
  } = methods

  const configs = watch('modalitiesConfig')

  const { mutate: saveModalitiesConfig, isPending } = useUpdateEventModalityConfig({
    onSuccess: (_, values) => {
      updateCurrentEventData(values.values)
      nextStep()
    },
    onError: (e) => toast.error(e.message)
  })

  useEffect(() => {
    if(!currentEvent) {
      setCurrentStep(0)
      return;
    }

    if(!currentEvent?.modalitiesConfig) return
    setSelectedModalities(Object.keys(currentEvent.modalitiesConfig))
    setValue('modalitiesConfig', currentEvent.modalitiesConfig as any)
  }, [currentEvent])

  if(!eventId){
    toast.error("Não conseguimos encontrar seu evento, tente novamente")
    setCurrentStep(0)
    return null
  }
  
  return (
    <section className='w-full h-full flex-1'>
      <header className='flex items-center gap-4'>
         <div className={cn('bg-rankor text-white rounded-full aspect-square h-[50px] w-[50px] flex items-center justify-center font-bold text-2xl')}>
            {2}
          </div>
          <div className='flex flex-col'>
            <span className='text-title text-4xl'>As Regras</span>
            <p className='mt-2'>
              Molde as modalidades do combate. Configure categorias de experiência, modalidades de luta e faixas de peso
            </p>
          </div> 
      </header>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit((values) => {
          saveModalitiesConfig({ eventId, values })
        })} className='py-12'>
          <section>
            <div className='flex flex-col'>
              <h1>Modalidades</h1>
              <small className='text-muted-foreground'>Selecione as modalidades do seu evento</small>
            </div>
            
            <div className='flex flex-wrap gap-2 w-full mt-4'>
              {modalities?.map(modality => (
                <SelectionCard 
                  key={modality.code}
                  value={modality.code}
                  checked={selectedModalities?.includes(modality.code)}
                  title={modality.name}
                  description=''
                  image={getModalityImage(modality.code)}
                  onClick={(value) => {
                    if (selectedModalities.includes(value)) {
                      setSelectedModalities(selectedModalities.filter(m => m !== value));
                    } else {
                      setSelectedModalities([...selectedModalities, value]);
                    }
                  }}
                />
              ))}
            </div>
          </section>

          <section className='mt-12'>
            <div className='flex flex-col'>
              <h1>Configurações</h1>
              <small className='text-muted-foreground'>
                Defina as configurações específicas de cada modalidade
              </small>
            </div>
            <div className='mt-4 flex flex-col gap-4'>
              {selectedModalities.map((modality) => (
                <Collapsible key={modality} title={modality} className='w-full'>
                  <CollapsibleTrigger className='bg-card flex items-center justify-between p-4 w-full border border-border'>
                    <div className='flex items-center gap-2'>
                      <h1>{indexedModalities[modality]?.name}</h1>

                      {
                        configs?.[modality]?.experience?.length > 0 && 
                        configs?.[modality]?.weightClasses?.length > 0 && (
                          <CheckCircle className='text-rankor'/>
                        )
                      }
                    </div>
                    <ChevronDown />
                  </CollapsibleTrigger>
                  <CollapsibleContent className='w-full bg-card p-4'>
                    <div className='mb-12'>
                      <div className='flex flex-col'>
                        <label className=''>Experiência</label>
                        <small className='text-muted-foreground'>Selecione as categorias de experiência disponíveis para essa modalidade</small>
                      </div>
                      <Controller
                        control={control}
                        name={`modalitiesConfig.${modality}.experience`}
                        defaultValue={[]}
                        render={({ field }) => (
                          <div className='flex gap-2 mt-2'>
                            {experienceOptions.map(opt => (
                              <Badge
                                key={opt.value}
                                fill={field.value?.includes(opt.value)}
                                size={'md'}
                                onClick={() => {
                                  if (field.value?.includes(opt.value)) {
                                    field.onChange(field.value.filter((v: string) => v !== opt.value))
                                  } else {
                                    field.onChange([...(field.value || []), opt.value])
                                  }
                                }}
                                className='cursor-pointer'
                              >
                                {opt.label}
                              </Badge>
                            ))}
                          </div>
                        )}
                      />
                      {errors.modalitiesConfig?.[modality]?.experience && <small className='text-destructive'>{errors.modalitiesConfig[modality]?.experience.message}</small>}
                    </div>  

                    <WeightClassesFieldArray 
                      modality={indexedModalities[modality]} 
                      control={control} 
                      register={register}
                      errors={errors}
                    />
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </section>

          <div className='flex justify-end gap-2'>
            <Button type='button' onClick={() => previousStep()} className='mt-4' variant={'secondary'}>Anterior</Button>
            <Button 
              type='submit' 
              className='mt-4' 
              loading={isPending}
            >
              Salvar e continuar
            </Button>
          </div>

        </form>
      </FormProvider>
    </section>
  )
}

type WeightClassesFieldArrayProps = {
  modality: Modality,
  control: any,
  register: any,
  errors: any
}


function WeightClassesFieldArray({ 
  modality, 
  control, 
  register, 
  errors 
}: WeightClassesFieldArrayProps) {
  const { setValue } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: `modalitiesConfig.${modality.code}.weightClasses`,
    rules: { minLength: 1, required: true }
  });

  return (
    <div className='w-full'>
      <div className='flex items-center justify-between w-full'>
        <div className='flex flex-col'>
          <label className=''>Categorias de Peso</label>
          <small className='text-muted-foreground w-[80%]'>
            Defina as categorias de peso do seu evento nas quais os atletas irão se registrar. Você também pode escolher nossas pré-definições.
          </small>
        </div>

        <div className='flex items-center gap-2'>
          <Tooltip
            content='Você pode inserir uma pré-definião de categoria de peso utilizada globalmente'
          >
            <Button 
              variant={'text'} 
              size={"sm"} 
              icon={<List />}
              type='button'
              onClick={() => setValue(`modalitiesConfig.${modality.code}.weightClasses`, modality.config.defaultWeightClasses)}
            >
              Escolher pré-definição
            </Button>
          </Tooltip>

          <Button 
            type='button' 
            onClick={() => append({ name: '', minWeight: undefined, maxWeight: undefined })} 
            size={'sm'}
          >
            <Plus /> Adicionar Categoria
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-2 mt-2'>
        {fields.map((field, idx) => (
          <div key={field.id} className='flex gap-2 items-center'>
            <Input 
              {...register(`modalitiesConfig.${modality.code}.weightClasses.${idx}.title`)} placeholder='Nome' 
              size={'sm'}
              aria-invalid={errors.modalitiesConfig?.[modality.code]?.weightClasses[idx]?.name ? 'true' : 'false'}
            />
            <Input 
              type='number' 
              {...register(`modalitiesConfig.${modality.code}.weightClasses.${idx}.minWeight`, { valueAsNumber: true })} 
              placeholder='Peso Mínimo' 
              step={'0.1'}
              size={'sm'}
              aria-invalid={errors.modalitiesConfig?.[modality.code]?.weightClasses[idx]?.minWeight ? 'true' : 'false'}
            />
            <Input 
              type='number' 
              {...register(`modalitiesConfig.${modality.code}.weightClasses.${idx}.maxWeight`, { valueAsNumber: true })} 
              placeholder='Peso Máximo'
              size={'sm'}
              step={'0.1'}
              aria-invalid={errors.modalitiesConfig?.[modality.code]?.weightClasses[idx]?.maxWeight ? 'true' : 'false'}
            />

            <Button type='button' variant='outline' onClick={() => remove(idx)} size={'sm'}>Remover</Button>
          </div>
        ))}
      </div>

      {
        errors.modalitiesConfig?.[modality.code]?.weightClasses?.length > 0 &&
        errors.modalitiesConfig?.[modality.code]?.weightClasses?.map((wc: any, idx: number) => (
          <div key={idx}>
            <small className='text-destructive' key={wc[0]}>
              {wc.name?.message}
            </small>
            <small className='text-destructive' key={wc[0]}>
              {wc.minWeight?.message}
            </small>
            <small className='text-destructive' key={wc[0]}>
              {wc.maxWeight?.message}
            </small>
          </div>
        ))
      }

      {
        /* @ts-ignore */
        errors.modalitiesConfig?.[modality.code]?.weightClasses && 
          <small className='text-destructive'>
            { /* @ts-ignore */}
            {errors.modalitiesConfig?.[modality.code]?.weightClasses.message}
          </small>
      }
      {
        /* @ts-ignore */
        errors.modalitiesConfig?.[modality.code]?.weightClasses.root && 
          <small className='text-destructive'>
            { /* @ts-ignore */}
            {errors.modalitiesConfig?.[modality.code]?.weightClasses.root.message}
          </small>
      }
    </div>
  );
}
