import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { Button } from '@repo/ui/button'
import { Input } from '@repo/ui/input'
import { step2Schema, type RegisterStep2Form } from '~/features/authentication/schemas'

type Props = {
  onSubmit: (values: RegisterStep2Form) => void,
  onReturn: () => void
  values: RegisterStep2Form
}

export const SecondStep = ({ onSubmit, onReturn, values }: Props) => {

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterStep2Form>({
    defaultValues: values,
    resolver: zodResolver(step2Schema)
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'organizers'
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Organizadores</h2>
        <span className="text-sm text-muted-foreground">Passo 2 de 3</span>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Nos conte quem está por trás da sua organização
      </p>

      <form className='mt-8 flex flex-col gap-6' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-4'>
          {fields.map((field, index) => (
            <div key={field.id}>
              <div className='flex items-center gap-2'>
                <Input
                  {...register(`organizers.${index}.name`)}
                  placeholder={`Nome do organizador #${index + 1}`}
                  defaultValue={field.name}
                />
                <Button type="button" variant="destructive" onClick={() => remove(index)}>
                  Remover
                </Button>
              </div>
              {errors.organizers?.[index]?.name && (
                <span className="text-xs text-red-500">{errors.organizers[index].name.message}</span>
              )}
            </div>
          ))}

          {errors.organizers?.message && (
            <span className="text-xs text-red-500">{errors.organizers.message}</span>
          )}
          <Button type="button" variant="secondary" onClick={() => append({ name: '' })}>
            Adicionar organizador
          </Button>
        </div>
        <div className='flex gap-6 items-center justify-end'>
          <Button type="button" variant="secondary" onClick={() => onReturn()}>Voltar</Button>
          <Button type="submit" disabled={isSubmitting}>Próximo</Button>
        </div>
      </form>
    </div>
  )
}
