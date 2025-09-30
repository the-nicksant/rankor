import z from "zod"

export const step1Schema = z.object({
  name: z.string().nonempty('Nome da organização é obrigatório'),
  email: z.email('Insira um email válido').nonempty('Email é obrigatório'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos').nonempty('Telefone é obrigatório'),
  acceptTerms: z.literal(true, "Aceite os termos e condições para continuar"),
})

export const step2Schema = z.object({
  organizers: z.array(
    z.object({
      name: z.string().nonempty('Nome do organizador é obrigatório'),
    })
  ).min(1, 'Adicione pelo menos um organizador'),
})

export type RegisterStep1Form = z.infer<typeof step1Schema>
export type RegisterStep2Form = z.infer<typeof step2Schema>

export type RegisterForm = {
  step1: RegisterStep1Form
  step2: RegisterStep2Form
}

export type AccountCreationParams = RegisterStep1Form & RegisterStep2Form

export const defaultValues: RegisterForm = {
  step1: {
    name: '',
    email: '',
    phone: '',
    acceptTerms: false as any
  },
  step2: {
    organizers: []
  },
}