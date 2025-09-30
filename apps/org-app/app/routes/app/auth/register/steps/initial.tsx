import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@repo/ui/button'
import { Input } from '@repo/ui/input'
import { step1Schema, type RegisterStep1Form } from '~/features/authentication/schemas'
import { Checkbox } from '@repo/ui/checkbox'
import { Label } from '@repo/ui/label'
import { Link } from 'react-router'

type Props = {
  onSubmit: (values: RegisterStep1Form) => void,
  values: RegisterStep1Form
}

export const InitialStep = ({ onSubmit, values }: Props) => {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterStep1Form>({
    defaultValues: values,
    resolver: zodResolver(step1Schema)
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Crie sua conta</h2>
        <span className="text-sm text-muted-foreground">Passo 1 de 3</span>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Preencha os detalhes da sua organização para começar.
      </p>

      <form className='mt-8 flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input 
            placeholder='Nome da organização'
            {...register('name')}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && <span className="text-destructive">{errors.name.message}</span>}
        </div>
        <div>
          <Input 
            placeholder='Email'
            type='email'
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && <span className="text-destructive">{errors.email.message}</span>}
        </div>
        <div>
          <Input 
            placeholder='Telefone'
            type='tel'
            {...register('phone')}
            aria-invalid={errors.phone ? 'true' : 'false'}
          />
          {errors.phone && <span className="text-destructive">{errors.phone.message}</span>}
        </div>
        <div>  
          <Controller
            name='acceptTerms'
            control={control}
            render={({ field }) => (
              <div className='flex gap-2'>
                <Checkbox 
                  id='terms'
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor='terms'>Li e aceito os <Link to={'#'} className='text-rankor'>termos e condições</Link></Label>
              </div> 
            )}
          />
           
            
          {errors.acceptTerms?.message && (
            <span className="text-xs text-red-500">{errors.acceptTerms.message}</span>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting}>Próximo</Button>
      </form>
    </div>
  )
}
