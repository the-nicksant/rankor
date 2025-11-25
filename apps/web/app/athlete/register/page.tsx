"use client"

import Image from 'next/image'
import React, { startTransition, useActionState, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@repo/ui/input'
import Stepper, { Step } from '@repo/ui/stepper'
import { fighterProfileSchema } from '~/features/athlete/account-creation'
import Select from '@repo/ui/select'
import { DatePicker } from '@repo/ui/date-picker'
import { useStateCities } from '~/shared/hooks/use-state-cities'
import { brazilianStates } from '~/shared/constants/ufs'
import { CheckCircle, Mail, Phone } from 'lucide-react'
import { formatBrazilianCellphone, formatCpf } from '~/shared/helpers/field-formatters'
import { Checkbox } from '@repo/ui/checkbox'
import { useExpertises, useModalities } from '~/shared/data/queries'
import { Skeleton } from '@repo/ui/skeleton'

import { createAthlete } from './actions'

export default function Page() {
  const [currentStep, setCurrentStep] = useState(1)

  const formRef = useRef<HTMLFormElement>(null)

  const { 
    control,
    register, 
    handleSubmit, 
    trigger, 
    watch,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(fighterProfileSchema),
    defaultValues: {
      firstname: "Nicolas",
      nickname: 'Superman',
      lastname: 'Santos',
      birthdate: new Date('2003-03-17'),
      country: "BR",
      email: 'nicolasalmeidasantos@gmail.com',
      phone: '(11) 973727800',
      document: "45440722807",
      state: 'SP',
      city: 'São Paulo',
      weight: 80,
      height: 180,
      modalities: [],
      expertises: [],
    }
  })

  const uf = watch('state')
  const cities = useStateCities(uf)

  const [modalities, loadingModalities] = useModalities()
  const [expertises, loadingExpertises] = useExpertises()

  const [actionState, action, pendingAction] = useActionState(createAthlete, { error: null, data: null, success: false})

  const stepsFields = [
    ['firstname', 'lastname', 'nickname', 'birthdate', 'email', 'phone'],
    ['state', 'city'],
    ['weight', 'height'],
    ['modalities'],
    ['expertises']
  ]

  function toggleValue(value: string, array: string[]): string[] {
    if (array.includes(value)) {
      return array.filter(item => item !== value);
    } else {
      return [...array, value];
    }
  }

  return (
    <div className='min-h-screen w-screen bg-background flex flex-col gap-12 items-center justify-center p-12'>

      <Image 
        src={'/rankor-logo-white-h.png'}
        alt='Rankor Logo'
        width={200}
        height={100}
        className='pointer-events-none'
      />

      <div 
        hidden={!pendingAction}
        className='border border-border rounded-lg delay-150 p-12 flex items-center justify-center flex-col'
      >
        <div 
          className='rounded-full bg-none border-2 border-t-0 border-white animate-spin size-10 mb-4'
        />
        <h1 className='text-title text-2xl'>Carregando</h1>
        <p className='mt-2 text-muted-foreground'>Estamos preparando tudo para você ter a melhor experiência</p>
      </div>

      <div 
        hidden={!actionState.success}
        className='border border-border rounded-lg delay-150 p-12 flex items-center justify-center flex-col'
      >
         <CheckCircle size={80} className='text-rankor mb-4'/>
        <h1 className='text-title text-2xl'>Tudo certo por aqui!</h1>
        <p className='text-muted-foreground'>
          Você receberá um email para confirmar sua conta e criar sua senha
        </p>
      </div>

      <div className='transition-all' hidden={pendingAction || actionState.success}>
        <form ref={formRef}>
          <Stepper
            initialStep={1}
            currentStep={currentStep}
            onStepChange={async (s) => {
              if(s < currentStep) return setCurrentStep(s)

              const result = await trigger(stepsFields[currentStep - 1] as any)

              if(result){
                setCurrentStep(s)
              }
            }}
            onFinalStepCompleted={() => handleSubmit(val => startTransition(() => action(val)))()}
            stepContainerClassName='pointer-events-none'
            stepCircleContainerClassName='w-full border-0 md:border-[1px] pb-12 min-w-fit w-full md:min-w-lg md:max-w-2xl w-full p-0 md:p-4 md:pb-12 max-h-none'
          >
            <FormStep 
              title='Crie sua conta'
              description='Preencha suas informações para começar'
            >
              <div className='flex flex-col gap-2'>
                <div>
                  <Input 
                    title='Primeiro nome'
                    placeholder='Primeiro nome'
                    {...register('firstname')}
                    aria-invalid={errors.firstname ? "true" : "false"}
                  />
                  {errors.firstname && <span className="text-destructive">{errors.firstname.message}</span>}
                </div>
                <Input 
                  title='Apelido'
                  placeholder='Apelido'
                  {...register('nickname')}
                  aria-invalid={errors.nickname ? "true" : "false"}
                />
                  {errors.nickname && <span className="text-destructive">{errors.nickname.message}</span>}
                <Input 
                  title='Último nome'
                  placeholder='Último nome'
                  {...register('lastname')}
                  aria-invalid={errors.lastname ? "true" : "false"}
                />
                {errors.lastname && <span className="text-destructive">{errors.lastname.message}</span>}

                <Input 
                  title='CPF'
                  placeholder='CPF'
                  {...register('document')}
                  aria-invalid={errors.document ? "true" : "false"}
                  formatter={formatCpf}
                />
                {errors.document && <span className="text-destructive">{errors.document.message}</span>}
                <br />

                <Input 
                  title='Email'
                  placeholder='Email'
                  {...register('email')}
                  icon={<Mail size={16}/>}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && <span className="text-destructive">{errors.email.message}</span>}

                <Input 
                  title='Telefone'
                  placeholder='Telefone'
                  {...register('phone')}
                  
                  icon={<Phone size={16} />}
                  aria-invalid={errors.phone ? "true" : "false"}
                  formatter={formatBrazilianCellphone}
                />
                {errors.phone && <span className="text-destructive">{errors.phone.message}</span>}

                <Controller 
                  control={control}
                  name='birthdate'
                  render={({ field, fieldState }) => (
                    <div>
                      <DatePicker 
                        {...field}
                        placeholder='Data de nascimento'
                        aria-invalid={fieldState.error ? 'true' : 'false'}
                      />
                      
                      {errors.birthdate && <span className="text-destructive">{errors.birthdate.message}</span>}
                    </div>
                  )}
                />
              </div>
            </FormStep>
           
            <FormStep
              title='Sua origem'
              description='Nos conte de onde você é'
            >
              <div className='flex flex-col gap-2'>
                <Controller
                  control={control}
                  name='state' 
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={brazilianStates}
                      placeholder='Selecione seu estado'
                    />
                  )}
                />
                
                <Controller
                  control={control}
                  name='city' 
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={cities}
                      placeholder='Selecione sua cidade'
                    />
                  )}
                />
              </div>
            </FormStep>

            <FormStep
              title='Informações do atleta'
              description='Preencha suas informações físicas'
            >
              <div className='flex flex-col gap-2'>
                <Input 
                  title='Altura (cm)'
                  placeholder='Altura em centímetros'
                  type='number'
                  {...register('height', { valueAsNumber: true })}
                  aria-invalid={errors.height ? "true" : "false"}
                />
                {errors.height && <span className="text-destructive">{errors.height.message}</span>}

                <Input 
                  title='Peso (kg)'
                  placeholder='Peso em quilogramas'
                  type='number'
                  {...register('weight', { valueAsNumber: true })}
                  aria-invalid={errors.weight ? "true" : "false"}
                />
                {errors.weight && <span className="text-destructive">{errors.weight.message}</span>}
              </div>
            </FormStep>

            <FormStep
              title='Modalidades'
              description='Escolha as modalidades que você pratica. Você pode alterar isso a qualquer hora no seu perfil'
            >
              <div className='flex flex-col gap-2'>
                {
                  loadingModalities && (
                    <>
                      <Skeleton className='w-full h-10'/>
                      <Skeleton className='w-full h-10'/>
                      <Skeleton className='w-full h-10'/>
                      <Skeleton className='w-full h-10'/>
                    </>
                  )
                }

                <Controller 
                  name='modalities'
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <div>
                      {
                        modalities?.map(modality => (
                          <label 
                            htmlFor={modality.code} 
                            key={modality.code} 
                            className='px-4 py-2 rounded-sm border-border border hover:bg-rankor/10 transition-all cursor-pointer flex items-center gap-4 aria-selected:border-rankor'
                          >
                            <Checkbox 
                              id={modality.code} 
                              value={modality.code}
                              checked={field.value?.includes(modality.code as never )}
                              onCheckedChange={() => field.onChange(
                                toggleValue(
                                  modality.code, 
                                  field.value || []
                                )
                              )}
                            />
                            {modality.name}
                          </label>
                        ))
                      }
                      {errors.modalities && <span className="text-destructive">{errors.modalities.message}</span>}
                    </div>
                  )}
                />
              </div>
            </FormStep>
            <FormStep
              title='Experiência'
              description='Selecione suas categorias de experiência. Você será emparelhado com atletas na mesma categoria.'
            >
              <div className='flex flex-col gap-2'>
                {
                  loadingExpertises && (
                    <>
                      <Skeleton className='w-full h-10'/>
                      <Skeleton className='w-full h-10'/>
                      <Skeleton className='w-full h-10'/>
                      <Skeleton className='w-full h-10'/>
                    </>
                  )
                }

                <Controller 
                  name='expertises'
                  control={control}
                  defaultValue={[]}
                  render={({ field }) => (
                    <div>
                      {
                        expertises?.map(expertise => (
                          <label 
                            htmlFor={expertise.id} 
                            key={expertise.id} 
                            className='px-4 py-2 rounded-sm border-border border hover:bg-rankor/10 transition-all cursor-pointer flex items-center gap-4 aria-selected:border-rankor'
                          >
                            <Checkbox 
                              id={expertise.id} 
                              value={expertise.id}
                              checked={field.value.includes(expertise.id as never)}
                              onCheckedChange={() => field.onChange(
                                toggleValue(
                                  expertise.id, 
                                  field.value || []
                                )
                              )}
                            />
                            {expertise.name}
                          </label>
                        ))
                      }
                      {errors.expertises && <span className="text-destructive">{errors.expertises.message}</span>}
                    </div>
                  )}
                />

               
              </div>
            </FormStep>


          </Stepper>    
        </form>
      </div>
    </div>
  )
}

type FormStepProps = {
  title: string
  description: string
  children: React.ReactNode
}


const FormStep = ({ title, description, children }: FormStepProps) => {
  return (
    <Step>
      <header className='mb-4'>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {description}
        </p>
      </header>
      <div className='pb-1'>
      {children}
      </div>

    </Step>
  )
}