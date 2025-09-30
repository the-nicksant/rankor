import React from 'react'
import { cn } from '~/lib/cn'
import { useEventCreation } from './context'
import { Check } from 'lucide-react'

export const Sidenav = () => {

  const { currentStep } = useEventCreation()

  const formSteps = [
    {
      "key": "basicInfo",
      "title": "O Alicerce",
      "description": "Defina a identidade, data e local do seu evento. Este é o alicerce do seu legado.",
      "disabled": false,
      "tips": {
        "title": "💡 Visão Estratégica",
        "description": "Um nome forte é o primeiro golpe. Pense em algo que seus atletas terão orgulho de carregar no peito e que seja fácil de encontrar."
      }
    },
    {
      "key": "modalities",
      "title": "As Regras",
      "description": "Molde as modalidades do combate. Configure categorias de experiência, modalidades de luta e faixas de peso.",
      "disabled": false,
      "tips": {
        "title": "🎯 Ponto-Chave",
        "description": "Seja claro nas regras de peso e experiência para garantir confrontos justos e competitivos. A transparência aqui evita problemas no dia do evento."
      }
    },
    {
      "key": "registrations",
      "title": "A Convocação",
      "description": "Abra as portas para os atletas. Defina limites, valores e prazos para as inscrições.",
      "disabled": false,
      "tips": {
        "title": "💰 Ouro do Evento",
        "description": "Considere criar lotes de inscrição com preços progressivos. Isso incentiva inscrições antecipadas e melhora seu fluxo de caixa."
      }
    },
    {
      "key": "brandingAndTeam",
      "title": "O Legado",
      "description": "Imprima a sua marca no evento. Personalize a página, adicione patrocinadores e gerencie sua equipe.",
      "disabled": true,
      "tips": {
        "title": "✨ Toque Profissional (Plano Pro)",
        "description": "Esta etapa permite adicionar seu próprio logo, cores e banners, transformando a página do evento em uma extensão da sua marca. Faça um upgrade para desbloquear."
      }
    }
  ]

  return (
    <div className="w-full md:h-[calc(100vh-60px)] md:max-w-[25%] hidden md:flex flex-col p-6 bg-sidebar border-r border-border sticky top-[60px] left-0">
      <header>
        <h1 className="text-title">Crie seu evento no Rankor</h1>
        <span className="text-muted-foreground text-sm">Siga os passos para dar vida e propósito aos confrontos. Você pode salvar as informações preenchidas a qualquer hora</span>
      </header>

      <div className='mt-8 flex flex-col gap-8'>
        {
          formSteps.map((step, index) => (
            <div 
              key={step.key} 
              className={cn('flex items-center gap-4', step.disabled && 'text-muted-foreground')}
            >
              <div 
                className={cn(
                  'rounded-full aspect-square h-[30px] w-[30px] flex items-center justify-center font-bold text-lg bg-muted text-muted-foreground', 
                  currentStep >= index && 'bg-rankor text-white'
                )}
              >
                {
                  currentStep <= index
                    ? index + 1
                    : <Check />
                }
              </div>
              <div className='flex flex-col'>
                <span className='text-lg'>{step.title}</span>
                <small className='text-muted-foreground'>{step.description}</small>
              </div> 
            </div>
          ))
        }
      </div>

      <div className='mt-8 bg-background p-4 flex flex-col gap-2'>
        <h1 className='font-semibold text-md'>
          {formSteps[0].tips.title}
        </h1>
        <p className='text-sm'>
          {formSteps[0].tips.description}
        </p>
      </div>
    </div>
  )
}
