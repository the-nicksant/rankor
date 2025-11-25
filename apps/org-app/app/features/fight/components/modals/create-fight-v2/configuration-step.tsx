import { useEffect, useState } from 'react';
import { Label } from '@repo/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/select';
import { AlertCircle } from 'lucide-react';
import { useFightCreation } from '~/features/fight/context/fight-creation-context';
import { useExpertises, useModalities } from '~/shared/hooks/data';
import { useAvailableAthletes } from '../../../hooks/use-fight-queries';

export function ConfigurationStep() {
  const { state, dispatch } = useFightCreation();
  const [weightClasses, setWeightClasses] = useState<
    Array<{ title: string; minWeight: number; maxWeight: number }>
  >([]);

  const { data: modalities = [] } = useModalities();
  const { data: experiences = [] } = useExpertises();

  const {
    data: availableAthletes = [],
    isLoading: checkingAthletes,
  } = useAvailableAthletes(
    {
      eventId: '1',
      modality: state.configuration.modalityCode,
      experience: state.configuration.experienceLevel,
      weightClassMin: state.configuration.weightClass?.minWeight,
      weightClassMax: state.configuration.weightClass?.maxWeight,
    },
    Boolean(
      state.configuration.modalityCode &&
        state.configuration.experienceLevel &&
        state.configuration.weightClass
    )
  );

  useEffect(() => {
    if (state.configuration.modalityId) {
      const modality = modalities.find((m) => m.id === state.configuration.modalityId);
      if (modality) {
        setWeightClasses(modality.config.defaultWeightClasses);
      }
    }
  }, [state.configuration.modalityId, modalities]);

  useEffect(() => {
    if (availableAthletes.length > 0) {
      dispatch({ type: 'SET_AVAILABLE_ATHLETES', payload: availableAthletes });
    }
  }, [availableAthletes, dispatch]);

  const handleModalityChange = (value: string) => {
    const modality = modalities.find((m) => m.id === value);
    if (modality) {
      dispatch({
        type: 'SET_CONFIGURATION',
        payload: {
          modalityId: value,
          modalityCode: modality.code,
          weightClass: null,
        },
      });
    }
  };

  const handleWeightClassChange = (value: string) => {
    const weightClass = weightClasses.find((wc) => wc.title === value);
    if (weightClass) {
      dispatch({
        type: 'SET_CONFIGURATION',
        payload: { weightClass },
      });
    }
  };

  const availableAthletesCount = availableAthletes.length;
  const hasCheckedAthletes =
    state.configuration.modalityCode &&
    state.configuration.experienceLevel &&
    state.configuration.weightClass;

  const hasEnoughAthletes = hasCheckedAthletes && availableAthletesCount >= 2;
  const showAthleteWarning = hasCheckedAthletes && availableAthletesCount < 2;

  return (
    <div className='w-full items-center justify-center flex'>
      <div className="space-y-6 max-w-2xl w-full">
        <div>
          <h2 className="text-lg font-semibold mb-1">Configuração da Luta</h2>
          <p className="text-sm text-muted-foreground">
            Defina a modalidade, nível e categoria de peso
          </p>
        </div>

        {showAthleteWarning && (
          <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-destructive">
                  Atletas insuficientes
                </p>
                <p className="text-sm text-destructive/80 mt-1">
                  {availableAthletesCount === 0
                    ? 'Não há atletas disponíveis com essa configuração. Ajuste a modalidade, experiência ou categoria de peso.'
                    : 'Apenas 1 atleta disponível. São necessários pelo menos 2 atletas para criar uma luta.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {checkingAthletes && (
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="text-sm text-muted-foreground">Verificando atletas disponíveis...</p>
          </div>
        )}

        {hasEnoughAthletes && (
          <div className="p-4 rounded-lg border border-green-500/50 bg-green-500/10">
            <p className="text-sm text-green-700 dark:text-green-400">
              ✓ {availableAthletesCount} atleta{availableAthletesCount > 1 ? 's' : ''} disponível{availableAthletesCount > 1 ? 'eis' : ''} para essa configuração
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="modality">Modalidade</Label>
            <Select value={state.configuration.modalityId} onValueChange={handleModalityChange}>
              <SelectTrigger id="modality">
                <SelectValue placeholder="Selecione a modalidade" />
              </SelectTrigger>
              <SelectContent>
                {modalities.map((modality) => (
                  <SelectItem key={modality.id} value={modality.id}>
                    {modality.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nível de Experiência</Label>
            <div className="flex flex-wrap gap-2">
              {experiences.map((exp) => {
                const isSelected = state.configuration.experienceLevel === exp.value;
                return (
                  <button
                    key={exp.value}
                    onClick={() =>
                      dispatch({
                        type: 'SET_CONFIGURATION',
                        payload: { experienceLevel: exp.value },
                      })
                    }
                    className={`
                      px-4 py-2 rounded-lg border text-sm font-medium transition-all
                      ${
                        isSelected
                          ? 'border-rankor bg-rankor/10 text-rankor'
                          : 'border-border hover:border-rankor/50 hover:bg-accent'
                      }
                    `}
                  >
                    {exp.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight-class">Categoria de Peso</Label>
            <Select
              value={state.configuration.weightClass?.title || ''}
              onValueChange={handleWeightClassChange}
              disabled={!state.configuration.modalityId}
            >
              <SelectTrigger id="weight-class">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {weightClasses.map((wc) => (
                  <SelectItem key={wc.title} value={wc.title}>
                    {wc.title} ({wc.minWeight}kg - {wc.maxWeight}kg)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
