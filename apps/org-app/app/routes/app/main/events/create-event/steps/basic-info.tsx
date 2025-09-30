import { Controller, useForm } from 'react-hook-form'
import { Input, TextArea } from '@repo/ui/input'
import { cn } from '~/lib/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@repo/ui/button'
import { useEventCreation } from '../context'
import { basicInfoEventSchema } from '~/features/event/schemas'
import { DatePicker } from '@repo/ui/date-picker'
import { useEffect, useRef } from 'react'

import cep from 'cep-promise'
import dayjs from 'dayjs'
import { LoadingOverlay } from '@repo/ui/loading'
import { toast } from 'sonner'
import { useCreateEvent, useUpdateEvent } from '~/features/event/hooks/mutations'
import { useNavigate } from 'react-router'

export const BasicInfoEventForm = () => {
  const submissionRef = useRef<HTMLButtonElement>(null)
  const { nextStep, updateCurrentEventData, currentEvent, loadingCurrentEvent } = useEventCreation()

  const navigate = useNavigate()

  const { 
    handleSubmit, 
    register,
    control,
    setValue,
    formState: { errors, touchedFields } 
  } = useForm({
    resolver: zodResolver(basicInfoEventSchema),
    defaultValues: {
      address: {
        // temporary mock
        latitude: 999,
        longitude: 999
      }
    }
  })

  const handleFormSubmission = () => {
    if(!Object.keys(touchedFields)?.length && currentEvent){
      return nextStep()
    }

    submissionRef.current?.click()
  }

  const { mutate: createEvent, isPending: loadingCreation } = useCreateEvent({
    onSuccess: (_, values) => {
      toast.success('Seu evento foi criado!!')
      updateCurrentEventData(values)
      navigate
      nextStep()
    },
    onError: (e) => {
      toast.error(e.message)
    }
  })

  const { mutate: updateEvent, isPending: loadingUpdate } = useUpdateEvent({
    onSuccess: (eventId, data) => {
      toast.success('Seu evento foi atualizado!')
      updateCurrentEventData(data.values)
      navigate('/app/events/new/' + eventId + '?step=2')
    },
    onError: (e) => {
      toast.error(e.message)
    }
  })

  useEffect(() => {
    if(!currentEvent) return;

    setValue('name', currentEvent.name)
    setValue('description', currentEvent.description)
    setValue('date', dayjs(currentEvent.date).toDate())
    setValue('address', currentEvent.address)
  }, [currentEvent])

  if(loadingCurrentEvent){
    return (
      <LoadingOverlay 
        loading
        title='Carregando'
        description='Buscando informações do seu evento'
      >
        <div className='h-[calc(100vh-60px)] w-full'></div>
      </LoadingOverlay>
    )
  }

  return (
    <section className='w-full h-full flex-1'>
      <header className='flex items-center gap-4'>
        <div className={cn('bg-rankor text-white rounded-full aspect-square h-[50px] w-[50px] flex items-center justify-center font-bold text-2xl')}>
            {1}
          </div>
          <div className='flex flex-col'>
            <span className='text-title text-4xl'>O Alicerce</span>
            <p className='mt-2'>
              Defina a identidade, data e local do seu evento. Este é o alicerce do seu legado.
            </p>
          </div> 
      </header>

      <form 
        onSubmit={
          handleSubmit((values) => currentEvent 
            ? updateEvent({ eventid: currentEvent.id, values }) 
            : createEvent(values))
        } 
        className='py-12'
      >
        <section className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between py-12 border-b border-border'>
          <div className='flex flex-col'>
            <h1>Nome do evento</h1>
            <small className='text-muted-foreground'>Dê um título memorável ao seu evento</small>
          </div>

          <div className='md:w-[400px]'>
            <Input 
              placeholder='Nome do seu evento'
              {...register('name')}
              aria-invalid={errors.name ? 'true' : 'false'}
              className='w-full'
            />
            {errors.name && <span className="text-destructive">{errors.name.message}</span>}
          </div>
        </section>

        <section className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between py-12 border-b border-border'>
          <div className='flex flex-col'>
            <h1>Descrição</h1>
            <small className='text-muted-foreground'>Descreva brevemente o evento</small>
          </div>
          <div className='md:w-[400px]'>
            <TextArea 
              aria-multiline
              className='h-[100px] items-start'
              placeholder='Descrição do evento'
              {...register('description')}
              aria-invalid={errors.description ? 'true' : 'false'}
            />
            {errors.description && <span className="text-destructive">{errors.description.message}</span>}
          </div>
        </section>

        <section className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between py-12 border-b border-border'>
          <div className='flex flex-col'>
            <h1>Data</h1>
            <small className='text-muted-foreground'>Escolha a data do evento</small>
          </div>
          <div className='md:w-[400px]'>
            <Controller 
              name='date'
              control={control}
              render={({ field, fieldState }) => 
                <DatePicker 
                  {...field}
                  minDate={new Date()}
                  aria-invalid={fieldState.error ? 'true' : 'false'}
                />
              }
            />
            
            {errors.date && <span className="text-destructive">{errors.date.message?.toString()}</span>}
          </div>
        </section>

        <section className='flex flex-col py-12 border-b border-border'>
          <h1>Localização</h1>
          <small className='text-muted-foreground mb-4'>Informe o endereço completo do evento</small>
              
          <Controller 
            name='address.zipCode'
            control={control}
            render={({ field, fieldState }) => (
              <Input 
                placeholder='CEP' 
                {...field} 
                onChange={(e) => {
                  field.onChange(e)
                  if(e.target.value.length < 6) return;

                  cep(e.target.value)
                    .then(address => {
                      setValue('address', {
                        zipCode: address.cep,
                        city: address.city,
                        country: 'Brasil',
                        district: address.neighborhood,
                        state: address.state,
                        street: address.street,
                        number: ''
                      })
                    })
                }}
                aria-invalid={fieldState.error ? 'true' : 'false'} 
                className='max-w-[300px]'
              />
            )}
          />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
            <Input placeholder='Rua' {...register('address.street')} aria-invalid={errors.address?.street ? 'true' : 'false'} />
            <Input placeholder='Número' {...register('address.number')} aria-invalid={errors.address?.number ? 'true' : 'false'} />
            <Input placeholder='Bairro' {...register('address.district')} aria-invalid={errors.address?.district ? 'true' : 'false'} />
            <Input placeholder='Cidade' {...register('address.city')} aria-invalid={errors.address?.city ? 'true' : 'false'} />
            <Input placeholder='Estado' {...register('address.state')} aria-invalid={errors.address?.state ? 'true' : 'false'} />
            <Input placeholder='Complemento (opcional)' {...register('address.complement')} />
            <Input placeholder='País' {...register('address.country')} aria-invalid={errors.address?.country ? 'true' : 'false'} />
          </div>
          <div className='flex flex-col gap-2'>
            {errors.address?.zipCode && <span className="text-destructive">{errors.address.zipCode.message}</span>}
            {errors.address?.street && <span className="text-destructive">{errors.address.street.message}</span>}
            {errors.address?.number && <span className="text-destructive">{errors.address.number.message}</span>}
            {errors.address?.district && <span className="text-destructive">{errors.address.district.message}</span>}
            {errors.address?.city && <span className="text-destructive">{errors.address.city.message}</span>}
            {errors.address?.state && <span className="text-destructive">{errors.address.state.message}</span>}
          </div>
        </section>

        <div className='flex items-center justify-end gap-2'>
          <Button 
            type='button'
            loading={loadingCreation || loadingUpdate}
            onClick={() => handleFormSubmission()}
          >
            Próximo
          </Button>

          <button ref={submissionRef} className='hidden'/>
        </div>

      </form>
    </section>
  )
}
