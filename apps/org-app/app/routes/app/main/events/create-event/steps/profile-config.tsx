import { Controller, useForm } from 'react-hook-form'
import { cn } from '~/lib/cn'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileConfigSchema } from '~/features/event/schemas'
import { Button } from '@repo/ui/button'
import { useEventCreation } from '../context'
import { useNavigate, useParams } from 'react-router'

import MDEditor from '@uiw/react-md-editor'
import { Input } from '@repo/ui/input'
import { Delete, Trash } from 'lucide-react'
import UploadInput from '@repo/ui/upload'
import { useEffect } from 'react'
import { useCompleteRegistration, useUpdateBanner, useUpdateEventPage } from '~/features/event/hooks/mutations'
import { toast } from 'sonner'

export const ProfileConfigForm = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    resetField,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(profileConfigSchema),
    mode: 'onChange'
  })

  const banner = watch('banner')

  const { previousStep, setCurrentStep, currentEvent, updateCurrentEventData } = useEventCreation()

  const { mutateAsync: completeRegistration } = useCompleteRegistration({ })

  const { mutateAsync: saveProfileConfig, isPending } = useUpdateEventPage({
    onSuccess: (_, data) => {
      updateCurrentEventData({ 
        website: data.values.website, 
        about: data.values.about 
      })

      completeRegistration({ eventId: eventId! })
      navigate(`/app/event/${eventId}`)
    }
  })

  const { mutateAsync: updateBanner, isPending: isUpdatingBanner } = useUpdateBanner({
    onSuccess: (_, data) => {
      toast.success("O Banner do evento foi atualizado")
    },
    onError: (e) => toast.error(e.message)
  })

  useEffect(() => {
    if(!currentEvent) return

    setValue('website', currentEvent.website || '')
    setValue('about', currentEvent.about || '')
  }, [currentEvent])

  useEffect(() => {
    if(!banner || !eventId) return;

    updateBanner({ eventId, banner })
  }, [banner])

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
          <span className='text-title text-4xl'>O Legado</span>
          <p className='mt-2'>
            Imprima a sua marca no evento. Personalize a página, adicione patrocinadores e faça seu evento ser visto e lembrado.
          </p>
        </div>
      </header>

      <form 
        onSubmit={handleSubmit((values) => saveProfileConfig({ eventid: eventId!, values }))} 
        className='py-12'
      >
        <section className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between py-12 border-b border-border'>
          <div className='flex flex-col'>
            <h1>URL personalizada</h1>
            <small className='text-muted-foreground max-w-[70%]'>Defina uma url personalizada para seu evento, facilitando o acesso e busca de atletas e espectadores.</small>
          </div>

          <div className='md:w-[400px]'>
            <div className='flex flex-row gap-2 items-center'>
              <span className='text-muted-foreground'>rankor.com.br/event/</span>
              <Input
                {...register('website')}
                aria-invalid={errors.website ? 'true' : 'false'}
              />
            </div>
            {errors.website && <span className="text-destructive">{errors.website.message}</span>}
          </div>
        </section>

        <section className='flex flex-col gap-2 md:justify-between py-12 border-b border-border'>
          <div className='flex flex-col'>
            <h1>Descrição detalhada</h1>
            <small className='text-muted-foreground'>
              Descreva todas as informações importantes para seus atletas e espectadores. Você pode inserir regras, instruções, informações sobre o local, chaveamento e o que mais achar relevante. Essa descrição será exibida na página do seu evento.
            </small>
          </div>

          <div className='w-full'>
            <Controller
              name='about'
              control={control}
              render={({ field }) => (
                <MDEditor
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </section>

        <section className='flex flex-col md:justify-between py-12 gap-4'>
          <div className='flex flex-col'>
            <h1>Banner</h1>
            <small className='text-muted-foreground'>Selecione uma imagem para o banner do evento</small>
          </div>
          <div>
            {
              banner
                ? <div className='relative w-full h-fit rounded-lg overflow-hidden'>
                  <img src={URL.createObjectURL(banner)} alt={banner.name} />
                  <Button
                    className='absolute top-4 right-4'
                    type='button'
                    onClick={() => resetField('banner')}
                  >
                    <Trash />
                  </Button>
                </div>
                : <Controller
                  control={control}
                  name='banner'
                  render={({ field }) => (
                    <div className='w-full'>
                      <UploadInput
                        title='Anexe um banner do seu evento'
                        description='Anexe uma imagem que se adeque ao formato dos banners do Rankor'
                        iconName='upload'
                        iconSize={40}
                        acceptedFileTypes={['image/jpg', 'image/png', 'image/jpeg']}
                        onFilesChange={(file) => field.onChange(file[0])}
                      />
                      {errors.banner && <span className="text-destructive">{errors.banner.message}</span>}
                    </div>
                  )}
                />
            }


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
