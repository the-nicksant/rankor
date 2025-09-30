import type { Route } from "./+types/index";
import { Sidenav } from "./sidenav";
import { BasicInfoEventForm } from "./steps/basic-info";
import { EventCreationContextProvider, useEventCreation } from "./context";
import { ModalityConfigEventForm } from "./steps/modality-config";
import { SubscriptionConfigForm } from "./steps/subscription-config";
import { ProfileConfigForm } from "./steps/profile-config";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";

function withStepAnimation(WrappedComponent: React.ComponentType) {
  return function AnimatedStep(props: any) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <WrappedComponent {...props} />
      </motion.div>
    );
  };
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Rankor" },
    { name: "description", content: "Começe a criar algo histórico no mundo da luta!" },
  ];
}

export default function CreateEvent(){
  return (
    <EventCreationContextProvider>
      <div className="w-full h-full">
        <header className="w-full h-[200px] bg-linear-to-t from-rankor/30 to-background p-4 flex items-center justify-center  flex-col">
        
          <h1 className="text-title text-5xl">Projete sua arena</h1>
          <span className="text-muted-foreground mt-2">Dê vida aos confrontos que entrarão para a história.</span>
        </header>

        <div className="flex border-t border-border relative">
          <Sidenav />
          <CurrentStep />
        </div>
      </div>
    </EventCreationContextProvider>
  )
}

const CurrentStep = () => {
  const { currentStep } = useEventCreation();

  const steps = [
    {
      key: 'basicInfo',
      component: withStepAnimation(BasicInfoEventForm),
    },
    {
      key: 'modality-config',
      component: withStepAnimation(ModalityConfigEventForm),
    },
    {
      key: 'subscription-confirm',
      component: withStepAnimation(SubscriptionConfigForm),
    },
    {
      key: 'profile-config',
      component: withStepAnimation(ProfileConfigForm),
    },
  ];

  return (
    <div className="w-full flex-1 h-full min-h-[calc(100vh-60px)] p-4 md:p-8 bg-background">
      <AnimatePresence mode="wait">
        {steps.map((step, index) => (
          index === currentStep && (
            <div key={step.key}>
              {step.component({})}
            </div>
          )
        ))}
      </AnimatePresence>
    </div>
  );
};