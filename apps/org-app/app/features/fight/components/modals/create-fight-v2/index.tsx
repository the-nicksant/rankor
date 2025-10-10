import React, { useState } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogClose, DialogTitle } from '@repo/ui/dialog'
import type { ModalProps } from '~/shared/types/modal'
import { FormStepper } from './animated-stepper'
import { File, HandFist, ListChecks, Scale } from 'lucide-react'

type CreateFightModalPayload = {
  eventId: string
}

export default function FightCreationModal ({ onClose, payload }: ModalProps<CreateFightModalPayload>) {
  const [currentStep, setCurrentStep] = useState(1)
  
  const steps = [
    {
      id: 1,
      label: 'Detalhes',
      description: 'Informações básicas da luta'
    },
    {
      id: 2,
      label: 'Atletas',
      description: 'Selecionar competidores'
    },
    {
      id: 3,
      label: 'Revisão',
      description: 'Confirmar dados'
    }
  ]
  
  return (
    <Dialog onOpenChange={() => onClose()} open>
      <DialogContent className='h-full !w-[100vw] !max-w-[100vw]'>
        <DialogHeader>
          <DialogTitle>Criar luta</DialogTitle>
          <DialogDescription>
            Defina os detalhes da luta e selecione os atletas que irão competir.
          </DialogDescription>
        </DialogHeader>
        <section className='w-full h-full flex flex-col items-center'>
          <FormStepper 
            currentStep={1}
            steps={[
              {
                title: 'Detalhes',
                icon: File,
                description: 'Informações básicas da luta'
              },
              {
                title: 'Lutadores',
                icon: HandFist,
                description: 'Selecione os melhores competidores'
              },
              {
                title: 'Regras',
                icon: Scale,
                description: 'Defina as regras da luta'
              },
              {
                title: 'Revisão',
                icon: ListChecks,
                description: 'Confirme os dados da luta'
              },
            ]}
          />
          <div className='flex-1 flex items-center justify-center w-full'>
            <div className='max-w-xl w-full p-4'>

              <div className='text-center'>
                <h3 className='text-lg font-semibold mb-2'>Passo {currentStep}</h3>
                <p className='text-gray-600 mb-6'>{steps[currentStep - 1]?.description}</p>
                
                <div className='flex gap-4 justify-center'>
                  <button 
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                    className='px-4 py-2 border rounded-md disabled:opacity-50'
                  >
                    Anterior
                  </button>
                  <button 
                    onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                    disabled={currentStep === steps.length}
                    className='px-4 py-2 bg-red-500 text-white rounded-md disabled:opacity-50'
                  >
                    Próximo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
      </DialogContent>
    </Dialog>
  )
}
