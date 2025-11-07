'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Lock, Mail } from "lucide-react";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { login } from "./actions";
import Image from "next/image";
import Link from "next/link";

const loginSchema = z.object({
  email: z.email(),
  password: z.string()
})

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const [actionState, action, loading] = useActionState(
    login, 
    { success: false, data: null, error: null }
  )

  const createPassword = async (values: { password: string, email: string }) => {
    startTransition(() => action({
      email: values.email as string,
      password: values.password
    }))
  }

  useEffect(() => {
    
  }, [actionState])

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="p-8 w-md border border-border rounded">
        <div className="w-full flex items-center justify-center mb-8">
          <Image 
            src={'/rankor-logo-white-h.png'}
            alt="Rankor"
            width={200}
            height={80}
          />
        </div>
        <h2 className="text-2xl font-bold">Login</h2>
        <p className="text-sm text-muted-foreground mt-2 mb-2">
          Insira seu email e senha para entrar
        </p>
        {
          actionState.error && 
            <div className="border border-destructive bg-destructive/20 p-4 rounded-lg text-sm my-4">
              {
                actionState.error?.message || "Ocorreu um erro"
              }
            </div>
        }
        <form 
          className="flex flex-col gap-4 items-center" 
          onSubmit={handleSubmit((v) => createPassword(v))}
        >
          <div className="w-full max-w-sm">
            <Input
              type="email"
              placeholder="Email"
              {...register('email')}
              icon={<Mail size={14} />}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && <span className="text-destructive">{errors.email.message}</span>}
          </div>
          <div className="w-full max-w-sm">
            <Input
              type="password"
              placeholder="Senha"
              {...register('password')}
              icon={<Lock size={14} />}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            {errors.password && <span className="text-destructive">{errors.password.message}</span>}
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full max-w-sm"
            loading={loading}
          >
            Salvar senha
          </Button>

          <div className="mt-2 flex items-center justify-center">
            <Link href={'/athlete/register'}>
              <Button variant={'link'} type="button">
                Criar uma conta
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}