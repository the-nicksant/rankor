import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from '@repo/ui/ui-stepper';
import { Check, LoaderCircleIcon } from 'lucide-react';

type Props = {
  currentStep: number;
  steps: {
    title: string
    icon: React.ElementType,
    description?: string
  }[]
}

export function FormStepper({ currentStep, steps}: Props) {
  

  return (
    <Stepper
      orientation='vertical'
      value={currentStep}
      onValueChange={() => {}}
      indicators={{
        completed: <Check className="size-4" />,
        loading: <LoaderCircleIcon className="size-4 animate-spin" />,
      }}
      className="flex-col flex"
    >
      <StepperNav className="gap-3 flex flex-col">
        {steps.map((step, index) => {
          return (
            <StepperItem key={index} step={index + 1} className={`relative flex-1 items-start last-of-type:whitespace-nowrap last-of-type:flex-0`}>
              <StepperTrigger className="flex flex-col items-start justify-center gap-2.5 grow" asChild>
                <StepperIndicator className="size-8 border-2 data-[state=completed]:text-white data-[state=completed]:bg-green-500 data-[state=inactive]:bg-transparent data-[state=inactive]:border-border data-[state=inactive]:text-muted-foreground">
                  <step.icon className="size-4" />
                </StepperIndicator>
                <div className="hidden md:flex flex-col items-start gap-1">
                  <div className="text-[10px] font-semibold uppercase text-muted-foreground">Passo {index + 1}</div>
                  <StepperTitle className="text-start text-base font-semibold group-data-[state=inactive]/step:text-muted-foreground">
                    {step.title}
                  </StepperTitle>
                  <StepperDescription className='text-start font-normal text-muted-foreground text-xs'>
                    {step.description}
                  </StepperDescription>
                </div>
              </StepperTrigger>

              {steps.length > index + 1 && (
                <StepperSeparator className="absolute top-4 inset-x-2 start-10 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none  group-data-[state=completed]/step:bg-green-500" />
              )}
            </StepperItem>
          );
        })}
      </StepperNav>

      <article className="md:hidden gap-1">
        <div className="text-[10px] font-semibold uppercase text-muted-foreground">Passo {currentStep}</div>
        <span className="text-start text-base font-semibold group-data-[state=inactive]/step:text-muted-foreground">
          {steps[currentStep - 1].title}
        </span>
        <p className='text-start font-normal text-muted-foreground text-xs'>
          {steps[currentStep - 1].description}
        </p>
      </article>
    </Stepper>
  );
}
