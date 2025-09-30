import z from "zod";

const schema = z.object({
  email: z
    .email('Insira um email válido')
    .nonempty('Campo obrigatório'),
  password: z.string()
    .nonempty('Campo obrigatório')
})

export type LoginSchema = z.infer<typeof schema>