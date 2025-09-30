import type { Route } from "./+types/login";
import RankorLogo from '~/assets/rankor-logo-white-h.png'
import BgImage from '~/assets/fighters.jpg'
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";

import { motion } from "motion/react"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from "react-router";
import useAuthStore from "~/features/authentication/stores/auth";
import { toast } from "sonner";
import { useLogin } from "~/features/authentication/hooks/mutations";
import type { LoginSchema } from "~/features/authentication/schemas";
import { CustomErrorCodes } from "~/lib/http/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Entrar" },
    { name: "description", content: "Faça seu login e transforme seu evento em algo histórico" },
  ];
}

export default function Login(){
  const navigate = useNavigate()

  const schema = z.object({
    email: z
      .email('Insira um email válido')
      .nonempty('Campo obrigatório'),
    password: z.string()
      .nonempty('Campo obrigatório')
  })

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginSchema>({
    resolver: zodResolver(schema)
  })

  const setAccessToken = useAuthStore(s => s.setAccessToken)

  const { mutate: handleLogin, isPending } = useLogin({
    onSuccess: (res) => {
      setAccessToken(res)
      navigate('/app/home', { viewTransition: true })
    },
    onError: (e) => {
      switch (e.code) {
        case CustomErrorCodes.UNAUTHORIZED: return toast.error("Email ou senha inválidos")
        default: return toast.error("Ocorreu um erro ao tentar se logar")
      }
    }
  })

  return (
    <div className="w-full flex h-screen">
      <motion.div 
        className="hidden md:block h-full w-[60%]"
        style={{
          backgroundImage: `url(${BgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        initial={{ height: 0 }}
        animate={{ height: '100vh' }}
        transition={{ duration: 0.8 }}
      />
      <div className="flex-1 w-full items-center justify-center flex px-4 py-8 md:p-8 md:py-12">
        <motion.div 
          className="w-full max-w-[400px] h-full flex flex-col justify-between"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <img src={RankorLogo} alt="Logo" className="w-[150px] md:w-[200px] pointer-events-none"/>

          <form 
            className="flex flex-col gap-10 my-8 w-full"
            onSubmit={handleSubmit(values => handleLogin(values))}
          >
            <header>
              <h2 className="text-title">
                Bem vindo ao Rankor!
              </h2>
              <span className="">
                Entre para acessar sua conta.
              </span>
            </header>

            <div className="flex flex-col gap-6">
              <div>
                <Input 
                  placeholder="Insira seu email"
                  className="w-full"
                  type="email"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  {...register('email')}
                />
                {
                  errors.email && <span className="text-destructive">{errors.email.message}</span>
                }
              </div>
              
              <div>
                <Input 
                  type="password"
                  placeholder="Insira sua senha"
                  className="w-full"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  {...register('password')}
                />
                {
                  errors.password && <span className="text-destructive">{errors.password.message}</span>
                }
              </div>
            </div>

            <Button 
              className="w-full" 
              
              type="submit"
              loading={isPending}
            >
              Entrar
            </Button>
          </form>

          <Link to={'/app/register'} className="w-full">
            <Button 
              variant="link"
            >
              Não tem uma conta? {" "} Registre sua organização
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}