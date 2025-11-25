import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@repo/ui/sheet';
import { Button } from '@repo/ui/button';
import { Undo2, Redo2, Check } from 'lucide-react';
import { FightCreationProvider, useFightCreation } from '../../../context/fight-creation-context';
import { ModeSelector } from './mode-selector';
import { ConfigurationStep } from './configuration-step';
import { FightRulesStep } from './fight-rules-step';
import { QuickModeMatchmaking } from './quick-mode-matchmaking';
import { BatchModeMatchmaking } from './batch-mode-matchmaking';
import { useCreateFight, useCreateBatchFights } from '../../../hooks/use-fight-queries';
import { toast } from 'sonner';
import type { ModalProps } from '~/shared/types/modal';

type CreateFightModalPayload = {
  eventId: string;
};

export default function FightCreationModal({ onClose, payload }: ModalProps<CreateFightModalPayload>) {
  return (
    <Sheet onOpenChange={() => onClose()} open>
      <SheetContent side="bottom" className="h-screen flex flex-col">
        <FightCreationProvider>
          <FightCreationContent onClose={onClose} />
        </FightCreationProvider>
      </SheetContent>
    </Sheet>
  );
}

function FightCreationContent({ onClose }: { onClose: () => void }) {
  const { state, dispatch, canUndo, canRedo } = useFightCreation();
  const createFightMutation = useCreateFight();
  const createBatchFightsMutation = useCreateBatchFights();

  const steps = state.mode === 'quick'
    ? ['Modo', 'Configuração', 'Regras', 'Matchmaking']
    : ['Modo', 'Configuração', 'Regras', 'Lutas'];

  const isConfigValid =
    state.configuration.modalityId &&
    state.configuration.experienceLevel &&
    state.configuration.weightClass &&
    state.availableAthletes.length >= 2;

  const canProceed = () => {
    if (state.currentStep === 0) return true;
    if (state.currentStep === 1) return isConfigValid;
    if (state.currentStep === 2) return true;
    if (state.currentStep === 3) {
      if (state.mode === 'quick') {
        return state.quickMode.fighterA && state.quickMode.fighterB;
      } else {
        return state.batchMode.matchups.length > 0 &&
          state.batchMode.matchups.every(m => m.fighterA && m.fighterB);
      }
    }
    return false;
  };

  const handleNext = () => {
    if (state.currentStep < steps.length - 1) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  const handleBack = () => {
    if (state.currentStep > 0) {
      dispatch({ type: 'PREV_STEP' });
    }
  };

  const handleCreate = () => {
    if (state.mode === 'quick') {
      createFightMutation.mutate(
        {
          fighterA: state.quickMode.fighterA,
          fighterB: state.quickMode.fighterB,
          configuration: state.configuration,
        },
        {
          onSuccess: () => {
            toast.success('Luta criada com sucesso!');
            dispatch({ type: 'RESET' });
            onClose();
          },
          onError: () => {
            toast.error('Erro ao criar luta');
          },
        }
      );
    } else {
      createBatchFightsMutation.mutate(
        state.batchMode.matchups.map((m) => ({
          fighterA: m.fighterA,
          fighterB: m.fighterB,
          configuration: state.configuration,
        })),
        {
          onSuccess: () => {
            toast.success(`${state.batchMode.matchups.length} lutas criadas com sucesso!`);
            dispatch({ type: 'RESET' });
            onClose();
          },
          onError: () => {
            toast.error('Erro ao criar lutas');
          },
        }
      );
    }
  };

  return (
    <>
      <SheetHeader className="shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <SheetTitle>Criar Luta{state.mode === 'batch' ? 's' : ''}</SheetTitle>
            <SheetDescription>
              {state.mode === 'quick'
                ? 'Crie uma luta rapidamente'
                : 'Crie várias lutas de uma vez'}
            </SheetDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => dispatch({ type: 'UNDO' })}
              disabled={!canUndo}
              variant="ghost"
              size="icon"
              title="Desfazer (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => dispatch({ type: 'REDO' })}
              disabled={!canRedo}
              variant="ghost"
              size="icon"
              title="Refazer (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-8 flex items-center justify-center gap-2 flex-wrap">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${index === state.currentStep ? 'bg-rankor/10 text-rankor' : 'text-muted-foreground'}
                  ${index < state.currentStep ? 'text-foreground' : ''}
                `}
              >
                <div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold
                    ${index === state.currentStep ? 'bg-rankor text-white' : 'bg-muted'}
                    ${index < state.currentStep ? 'bg-green-500 text-white' : ''}
                  `}
                >
                  {index < state.currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{step}</span>
              </div>

              {index < steps.length - 1 && (
                <div className="w-8 h-px bg-border mx-2 hidden sm:block" />
              )}
            </div>
          ))}
        </div>

        <div className="min-h-[400px] max-w-7xl mx-auto">
          {state.currentStep === 0 && <ModeSelector />}
          {state.currentStep === 1 && <ConfigurationStep />}
          {state.currentStep === 2 && <FightRulesStep />}
          {state.currentStep === 3 && (
            <>
              {state.mode === 'quick' ? (
                <QuickModeMatchmaking />
              ) : (
                <BatchModeMatchmaking />
              )}
            </>
          )}
        </div>
      </div>

      <div className="border-t px-6 py-4 flex items-center justify-between bg-muted/30 shrink-0">
        <Button
          onClick={handleBack}
          variant="ghost"
          disabled={state.currentStep === 0}
        >
          Voltar
        </Button>

        <div className="flex gap-2">
          <Button onClick={onClose} variant="outline">
            Cancelar
          </Button>

          {state.currentStep < steps.length - 1 ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Próximo
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              disabled={
                !canProceed() ||
                createFightMutation.isPending ||
                createBatchFightsMutation.isPending
              }
            >
              {createFightMutation.isPending || createBatchFightsMutation.isPending
                ? 'Criando...'
                : `Criar ${state.mode === 'batch' ? `${state.batchMode.matchups.length} Lutas` : 'Luta'}`}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
