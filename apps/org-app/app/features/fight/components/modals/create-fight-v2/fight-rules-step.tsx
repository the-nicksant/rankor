import { useEffect, useState } from 'react';
import { Label } from '@repo/ui/label';
import { Input } from '@repo/ui/input';
import { Info, Minus, Plus } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { useFightCreation } from '../../../context/fight-creation-context';
import { useModalities } from '~/shared/hooks/data';
import type { Modality } from '~/shared/domain/models/modality';

export function FightRulesStep() {
  const { state, dispatch } = useFightCreation();
  const [scoringMethods, setScoringMethods] = useState<Record<string, number>>({});
  const { data: modalities = [] } = useModalities();

  const modality = modalities.find((m: Modality) => m.id === state.configuration.modalityId);

  useEffect(() => {
    if (modality?.config.scoringMethods) {
      const defaultScoring = Object.keys(modality.config.scoringMethods).length > 0
        ? modality.config.scoringMethods
        : {};
      setScoringMethods(defaultScoring);
      dispatch({
        type: 'SET_FIGHT_RULES',
        payload: { scoringMethods: defaultScoring },
      });
    }
  }, [modality, dispatch]);

  const handleNumberChange = (field: 'numberOfRounds' | 'roundDuration' | 'intervalDuration') => (
    value: number
  ) => {
    dispatch({
      type: 'SET_FIGHT_RULES',
      payload: { [field]: Math.max(1, value) },
    });
  };

  const handleJudgingSystemChange = (system: 'cumulative' | 'dominance') => {
    dispatch({
      type: 'SET_FIGHT_RULES',
      payload: { judgingSystem: system },
    });
  };

  const handleScoringMethodChange = (method: string, value: number) => {
    const updated = { ...scoringMethods, [method]: value };
    setScoringMethods(updated);
    dispatch({
      type: 'SET_FIGHT_RULES',
      payload: { scoringMethods: updated },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Regras da Luta</h2>
        <p className="text-sm text-muted-foreground">
          Configure os rounds, duração e sistema de pontuação
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Número de Rounds</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('numberOfRounds')(state.fightRules.numberOfRounds - 1)}
              disabled={state.fightRules.numberOfRounds <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              value={state.fightRules.numberOfRounds}
              onChange={(e) => handleNumberChange('numberOfRounds')(parseInt(e.target.value) || 1)}
              className="text-center"
              min={1}
              max={12}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('numberOfRounds')(state.fightRules.numberOfRounds + 1)}
              disabled={state.fightRules.numberOfRounds >= 12}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Duração do Round (min)</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('roundDuration')(state.fightRules.roundDuration - 1)}
              disabled={state.fightRules.roundDuration <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              value={state.fightRules.roundDuration}
              onChange={(e) => handleNumberChange('roundDuration')(parseInt(e.target.value) || 1)}
              className="text-center"
              min={1}
              max={15}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('roundDuration')(state.fightRules.roundDuration + 1)}
              disabled={state.fightRules.roundDuration >= 15}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Intervalo (min)</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('intervalDuration')(state.fightRules.intervalDuration - 1)}
              disabled={state.fightRules.intervalDuration <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              value={state.fightRules.intervalDuration}
              onChange={(e) => handleNumberChange('intervalDuration')(parseInt(e.target.value) || 1)}
              className="text-center"
              min={1}
              max={5}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleNumberChange('intervalDuration')(state.fightRules.intervalDuration + 1)}
              disabled={state.fightRules.intervalDuration >= 5}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Sistema de Julgamento</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleJudgingSystemChange('cumulative')}
            className={`
              p-4 rounded-lg border text-left transition-all
              ${
                state.fightRules.judgingSystem === 'cumulative'
                  ? 'border-rankor bg-rankor/10'
                  : 'border-border hover:border-rankor/50 hover:bg-accent'
              }
            `}
          >
            <p className="font-semibold text-sm mb-1">Pontuação Cumulativa</p>
            <p className="text-xs text-muted-foreground">
              Soma total de pontos determina o vencedor
            </p>
          </button>

          <button
            onClick={() => handleJudgingSystemChange('dominance')}
            className={`
              p-4 rounded-lg border text-left transition-all
              ${
                state.fightRules.judgingSystem === 'dominance'
                  ? 'border-rankor bg-rankor/10'
                  : 'border-border hover:border-rankor/50 hover:bg-accent'
              }
            `}
          >
            <p className="font-semibold text-sm mb-1">Dominância de Rounds</p>
            <p className="text-xs text-muted-foreground">
              Quem vence mais rounds vence a luta
            </p>
          </button>
        </div>
      </div>

      {Object.keys(scoringMethods).length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>Métodos de Pontuação</Label>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Info className="w-3 h-3" />
              <span>Pontos atribuídos por ação</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(scoringMethods).map(([method, points]) => (
              <div key={method} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <span className="text-sm font-medium capitalize">
                  {method.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleScoringMethodChange(method, Math.max(0, points - 1))}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-sm font-semibold min-w-[30px] text-center">{points} pts</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => handleScoringMethodChange(method, points + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 rounded-lg border bg-muted/30">
        <p className="text-sm text-muted-foreground">
          <strong>Resumo:</strong> {state.fightRules.numberOfRounds} rounds de{' '}
          {state.fightRules.roundDuration} minutos com {state.fightRules.intervalDuration} minuto(s) de intervalo
          • Sistema: {state.fightRules.judgingSystem === 'cumulative' ? 'Pontuação Cumulativa' : 'Dominância de Rounds'}
        </p>
      </div>
    </div>
  );
}
