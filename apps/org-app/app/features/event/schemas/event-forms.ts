import z from "zod";

const validateWeightClasses = (weightclasses: { minWeight: number, maxWeight: number }[]) => {
  for (let i = 0; i < weightclasses.length; i++) {
    for (let j = i + 1; j < weightclasses.length; j++) {
      const a = weightclasses[i];
      const b = weightclasses[j];

      if (
        (a.minWeight < b.maxWeight && a.maxWeight > b.minWeight) ||
        (b.minWeight < a.maxWeight && b.maxWeight > a.minWeight)
      ) {
        return false;
      }
    }
  }
  return true;
};

export const basicInfoEventSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  date: z.date("Formato inválido").min(1, 'A data é obrigatória'),
  address: z.object({
    zipCode: z.string("CEP é obrigatório").min(1, 'CEP é obrigatório'),
    street: z.string("Rua é obrigatório").min(1, 'Rua é obrigatória'),
    number: z.string("Número é obrigatório").min(1, 'Número é obrigatório'),
    district: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().min(1, 'Estado é obrigatório'),
    country: z.string().min(1, 'País é obrigatório'),
    complement: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  })
})

const weightClassSchema = z.object({
  title: z.string().nonoptional('Nome é obrigatório'),
  minWeight: z.float32().nonoptional('Peso mínimo é obrigatório'),
  maxWeight: z.float32().nonoptional('Peso máximo é obrigatório')
}).refine(data => data.minWeight < data.maxWeight, {
  error: 'Peso mínimo não pode ser maior que o máximo',
  path: ['minWeight']
});

export const modalityConfigSchema = z.object({
  modalitiesConfig: z.record(z.string(), z.object({
    experience: z.array(z.string()).min(1, 'Selecione ao menos uma experiência'),
    weightClasses: z.array(weightClassSchema)
      .refine(validateWeightClasses, {
        message: 'Categorias de peso conflitantes detectadas. Por favor, ajuste os valores.',
      })
      .min(1, 'Defina ao menos uma categoria de peso')
  }))
});


export const subscriptionConfigSchema = z.object({
  startSubscription: z.date({ error: 'A data de início é obrigatória' }),
  endSubscription: z.date({ error: 'A data de término é obrigatória' }),
  maxSubscriptions: z.number("Insira um número válido").min(2, 'O número deve ser maior que dois'),
})
  .refine(data => data.startSubscription.getTime() < data.endSubscription.getTime(), {
    error: "A data de início não pode ser maior que a final",
    path: ['startSubscription'],
  })
;

export const profileConfigSchema = z.object({
  about: z.string().optional(),
  website: z.string()
    .min(1, 'Insira sua URL personalizada')
    .regex(/^[a-zA-Z0-9-_]+$/, 'A URL não pode conter espaços ou caracteres inválidos'),
  banner: z.instanceof(File, { message: 'Selecione uma imagem válida' }).nonoptional("Adicione um banner para seu evento"),
});




export type CreateEventFormValues = z.infer<typeof basicInfoEventSchema>
export type ModalitiesConfigFormValues = z.infer<typeof modalityConfigSchema>
export type SubscriptionConfigFormValues = z.infer<typeof subscriptionConfigSchema>
export type ProfileConfigFormValues = z.infer<typeof profileConfigSchema>