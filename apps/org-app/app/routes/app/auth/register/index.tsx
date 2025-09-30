import { useState } from 'react'
import BgImage from '~/assets/kick.jpg'
import { motion } from 'motion/react'
import Stepper, { Step } from '@repo/ui/stepper';

import { InitialStep } from './steps/initial';
import { SecondStep } from './steps/organizers';
import { ThirdStep } from './steps/final';

import { 
  defaultValues, 
  type RegisterForm, 
} from '~/features/authentication/schemas';

import { useCreateAccount } from '~/features/authentication/hooks/mutations';

export function meta({}) {
  return [
    { title: "Registre-se" },
    { name: "description", content: "Faça seu login e transforme seu evento em algo histórico" },
  ];
}

export default function Register() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formValues, setFormValues] = useState<RegisterForm>(defaultValues)
  
  const { mutate: createOrganization, data: accountId } = useCreateAccount({
    onSuccess: () => {
      setCurrentStep(s => s + 1)
    }
  })

  return (
    <div className="flex w-full h-full">
      <motion.div 
        className="hidden md:block h-screen"
        style={{
          backgroundImage: `url(${BgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: '20%',
          backgroundRepeat: 'no-repeat',
        }}
        initial={{ width: 0 }}
        animate={{ width: '40%' }}
        transition={{ duration: 0.8 }}
      />
      <div className="flex-1 items-center justify-center flex p-0 md:p-8 md:py-12">
        <motion.div 
          className="w-full md:w-max"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Stepper
            initialStep={1}
            currentStep={currentStep}
            footerClassName='hidden'
            stepContainerClassName='pointer-events-none'
            stepCircleContainerClassName='w-full border-0 md:border-[1px] pb-12 min-w-fit w-full md:min-w-lg md:max-w-2xl w-full p-0 md:p-4 md:pb-12 max-h-none'
          >

            <Step>
              <InitialStep 
                values={formValues?.step1}
                onSubmit={(values) => {
                  setFormValues(prev => ({ ...prev, step1: values }))
                  setCurrentStep(s => s + 1)
                }}
              />

            </Step>
            <Step>
              <SecondStep
                values={formValues?.step2}
                onReturn={() => setCurrentStep(s => s - 1)}
                onSubmit={(values) => {
                  setFormValues(prev => ({ ...prev, step2: values}))
                  createOrganization({ ...formValues.step1, ...values })
                }}
              />
            </Step>
            <Step>
              <ThirdStep id={accountId}/>
            </Step>
          </Stepper>
        </motion.div>
      </div>
    </div>
  )
}
