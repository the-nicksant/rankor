import { useState } from "react";
import Stepper, { Step } from "@repo/ui/stepper";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@repo/ui/input';
import { Button } from '@repo/ui/button';
import type { Route } from "./+types/account-confirmation";
import { Link } from "react-router";
import { CheckCircle } from "lucide-react";
import { passwordSchema } from "~/features/authentication/schemas";
import { useCreatePassword } from "~/features/authentication/hooks/mutations";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Confirmação de Conta" },
    { name: "description", content: "Confirme sua conta para acessar todos os recursos do evento." },
  ];
}

export default function AccountConfirmation({ params }: Route.ComponentProps) {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const { mutateAsync: createPassword } = useCreatePassword({
    onSuccess: () => {
      setStep(s => s + 1)
    }
  })

  return (
    <div className="flex items-center justify-center h-screen w-full">
      <Stepper
        currentStep={step}
        footerClassName="hidden"
        stepCircleContainerClassName="max-h-none pb-12"
      >
        <Step>
          <div className="">
            <h2 className="text-2xl font-bold">Defina sua senha</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Defina sua senha para acessar
            </p>
            <form 
              className="flex flex-col gap-6 items-center mt-8" 
              onSubmit={handleSubmit((v) => createPassword({ 
                accountId: params.accountId, 
                password: v.password
              }))}
            >
              <div className="w-full max-w-sm">
                <Input
                  type="password"
                  placeholder="Senha"
                  {...register('password')}
                  aria-invalid={errors.password ? 'true' : 'false'}
                />
                {errors.password && <span className="text-destructive">{errors.password.message}</span>}
              </div>
              <div className="w-full max-w-sm">
                <Input
                  type="password"
                  placeholder="Confirme a senha"
                  {...register('confirmPassword')}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
                {errors.confirmPassword && <span className="text-destructive">{errors.confirmPassword.message}</span>}
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full max-w-sm">Salvar senha</Button>
            </form>
          </div>
        </Step>

        <Step>
          <div className="flex flex-col items-center">
            <CheckCircle size={100} color="red" className="mb-4"/>
            <h1 className="text-2xl font-bold mb-2">Conta confirmada!</h1>
            <p className="mb-6">Sua conta foi confirmada com sucesso.</p>
            <Link to="/app/login" className="w-full">
              <Button className="w-full max-w-sm">
                Voltar para login
              </Button>
            </Link>
          </div>
        </Step>
      </Stepper>
    </div>
  );
}