'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import Stepper, { Step } from "@repo/ui/stepper";
import { CheckCircle, Link, Lock } from "lucide-react";
import { useParams } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { confirmAthleteAccount } from "./actions";

const passwordSchema = z.object({
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export default function AccountConfirmation() {
  const [step, setStep] = useState(1);

  const { accountId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const [actionState, action, loading] = useActionState(
    confirmAthleteAccount, 
    { success: false, data: null, error: null }
  )

  const createPassword = async (values: { password: string }) => {
    if(!accountId) return;

    startTransition(() => action({
      athleteId: accountId as string,
      password: values.password
    }))
  }

  useEffect(() => {
    if(actionState.success){
      setStep(s => s + 1)
    }
  }, [actionState])

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
              onSubmit={handleSubmit((v) => createPassword({ password: v.password }))}
            >
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
              <div className="w-full max-w-sm">
                <Input
                  type="password"
                  placeholder="Confirme a senha"
                  {...register('confirmPassword')}
                  icon={<Lock size={14} />}
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                />
                {errors.confirmPassword && <span className="text-destructive">{errors.confirmPassword.message}</span>}
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full max-w-sm"
                loading={loading}
              >
                Salvar senha
              </Button>
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