import { Controller, useForm } from 'react-hook-form'
import { cn } from '~/lib/cn'
import { Input } from '@repo/ui/input'
import { DatePicker } from '@repo/ui/date-picker'
import { zodResolver } from '@hookform/resolvers/zod'
import { subscriptionConfigSchema } from '~/features/event/schemas'
import { Button } from '@repo/ui/button'
import { useEventCreation } from '../context'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { useParams } from 'react-router'
import { useUpdateEventSubscriptionsConfig } from '~/features/event/hooks/mutations'
import { toast } from 'sonner'

export const SubscriptionConfigForm = () => {
  const { eventId } = useParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue
  } = useForm({
    resolver: zodResolver(subscriptionConfigSchema)
  })

  const { 
    previousStep, 
    nextStep, 
    currentEvent, 
    setCurrentStep, 
    updateCurrentEventData 
  } = useEventCreation()

  const { mutateAsync: saveSubscriptionConfig, isPending } = useUpdateEventSubscriptionsConfig({
    onSuccess: (_, data) => {
      updateCurrentEventData({ subscriptionConfig: data.values })
      nextStep()
    },
    onError: (e) => toast.error(e.message)
  })

  useEffect(() => {
    if (!currentEvent) {
      setCurrentStep(0)
      return
    }
    
    if (!currentEvent?.subscriptionConfig) return;

    setValue('startSubscription', dayjs(currentEvent.subscriptionConfig.startSubscription).toDate())
    setValue('endSubscription', dayjs(currentEvent.subscriptionConfig.endSubscription).toDate())
    setValue('maxSubscriptions', currentEvent.subscriptionConfig.maxSubscriptions)
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
          {3}
        </div>
        <div className='flex flex-col'>
          <span className='text-title text-4xl'>A Convocação</span>
          <p className='mt-2'>
            Abra as portas para os atletas. Defina limites, valores e prazos para as inscrições.
          </p>
        </div>
      </header>

      <form 
        onSubmit={handleSubmit((values) => saveSubscriptionConfig({ eventId, values }))} 
        className='py-12'
      >

        <section className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between py-12 border-b border-border'>
          <div className='flex flex-col'>
            <h1>Início das inscrições</h1>
            <small className='text-muted-foreground'>Defina a data de início das inscrições</small>
          </div>

          <div className='md:w-[400px]'>
            <Controller
              control={control}
              name='startSubscription'
              render={({ field }) => (
                <DatePicker
                  {...field}
                  minDate={new Date()}
                  className='w-full'
                  aria-invalid={errors.startSubscription ? 'true' : 'false'}
                />
              )}
            />
            {errors.startSubscription && <span className="text-destructive">{errors.startSubscription.message}</span>}
          </div>
        </section>

        <section className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between py-12 border-b border-border'>
          <div className='flex flex-col'>
            <h1>Fim das inscrições</h1>
            <small className='text-muted-foreground'>Defina a data de término das inscrições</small>
          </div>

          <div className='md:w-[400px]'>
            <Controller
              control={control}
              name='endSubscription'
              render={({ field }) => (
                <DatePicker
                  {...field}
                  minDate={dayjs().add(1, 'day').toDate()}
                  className='w-full'
                  aria-invalid={errors.endSubscription ? 'true' : 'false'}
                />
              )}
            />
            {errors.endSubscription && <span className="text-destructive">{errors.endSubscription.message}</span>}
          </div>
        </section>

        <section className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between py-12 border-b border-border'>
          <div className='flex flex-col'>
            <h1>Máximo de inscrições</h1>
            <small className='text-muted-foreground'>Defina o número máximo de inscrições</small>
          </div>

          <div className='md:w-[400px]'>
            <Input
              type='number'
              placeholder='Número máximo de inscrições'
                {...register('maxSubscriptions', { 
                  setValueAs: value => value === '' 
                    ? undefined 
                    : Number(value)
              })}
              aria-invalid={errors.maxSubscriptions ? 'true' : 'false'}
              className='w-full'
            />
            {errors.maxSubscriptions && <span className="text-destructive">{errors.maxSubscriptions.message}</span>}
          </div>
        </section>

        <div className='flex items-center justify-end gap-2'>
          <Button type='button' onClick={previousStep} variant={'secondary'}>Voltar</Button>
          <Button type='submit' loading={isPending}>Salvar configurações</Button>
        </div>
      </form>
    </section>
  )
}
