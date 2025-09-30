import { z } from 'zod';
const phoneRegex = /^\(?([0-9]{2})\)?\s?([0-9]{5})-?([0-9]{4})$/;
const cpfRegex = /^[0-9]{11}$/;

export const fighterProfileSchema = z.object({
  firstname: z.string()
    .min(1, "Nome é obrigatório.")
    .max(50, "Nome não pode ter mais de 50 caracteres.")
    .trim(), // Remove espaços em branco do início/fim
  
  lastname: z.string()
    .min(1, "Sobrenome é obrigatório.")
    .max(50, "Sobrenome não pode ter mais de 50 caracteres.")
    .trim(),
  
  nickname: z.string()
    .max(50, "Apelido não pode ter mais de 50 caracteres.")
    .trim()
    .optional(), // Apelido é opcional
  
  birthdate: z.date("Selecione uma data válida")
    .refine((dateString) => {
      const birthDate = new Date(dateString);
      return birthDate < new Date();
    }, "Data de nascimento deve ser no passado."),
  
  city: z.string()
    .min(1, "Cidade é obrigatória.")
    .max(50, "Cidade não pode ter mais de 50 caracteres.")
    .trim(),
  
  state: z.string()
    .min(1, "Estado é obrigatório.")
    .max(50, "Estado não pode ter mais de 50 caracteres.")
    .trim(),
  
  country: z.string()
    .min(1, "País é obrigatório.")
    .max(50, "País não pode ter mais de 50 caracteres.")
    .trim(),
  
  phone: z.string()
    .regex(phoneRegex, "Número de telefone inválido. Formato esperado: (DDD)XXXXX-XXXX ou DDDXXXXXXXXX.")
    .trim(),
  
  document: z.string()
    .regex(cpfRegex, "Documento (CPF) inválido. Deve conter 11 dígitos numéricos.")
    .length(11, "Documento (CPF) deve ter 11 dígitos.")
    .trim(),
  
  email: z.string()
    .email("Formato de e-mail inválido.")
    .max(100, "E-mail não pode ter mais de 100 caracteres.")
    .trim(),
  
  weight: z.number()
    .min(30, "Peso mínimo é 30kg.")
    .max(300, "Peso máximo é 300kg.")
    .positive("Peso deve ser um valor positivo."),
  
  height: z.number()
    .min(100, "Altura mínima é 100cm.")
    .max(250, "Altura máxima é 250cm.")
    .positive("Altura deve ser um valor positivo."),
  
  modalities: z.array(
    z.string()
  ).min(1, "Selecione ao menos uma modalidade."),

  expertises: z.array(
    z.string()
  ).min(1, "Selecione ao menos uma experiência."),
});

export type FighterProfile = z.infer<typeof fighterProfileSchema>;