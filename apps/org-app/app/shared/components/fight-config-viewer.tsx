import { Clock, Timer, Trophy, Target } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@repo/ui/dialog';

interface FightConfig {
  modality: {
    name: string;
    code: string;
  };
  weightClass: {
    title: string;
    minWeight: number;
    maxWeight: number;
  };
  experienceLevel: string;
  rules: {
    numberOfRounds: number;
    roundDuration: number;
    intervalDuration: number;
    scoringMethods: Record<string, number>;
    judgingSystem: 'cumulative' | 'dominance';
  };
}

interface FightConfigViewerProps {
  config: FightConfig;
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function FightConfigViewer({
  config,
  open,
  onClose,
  title = 'Configuração da Luta',
  description = 'Detalhes das regras e pontuação',
}: FightConfigViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-1">Modalidade</p>
              <p className="font-semibold">{config.modality.name}</p>
            </div>

            <div className="p-4 rounded-lg border bg-card">
              <p className="text-sm text-muted-foreground mb-1">Experiência</p>
              <p className="font-semibold">{config.experienceLevel}</p>
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <p className="text-sm text-muted-foreground mb-1">Categoria de Peso</p>
            <p className="font-semibold">
              {config.weightClass.title}{' '}
              <span className="text-sm text-muted-foreground">
                ({config.weightClass.minWeight}kg - {config.weightClass.maxWeight}kg)
              </span>
            </p>
          </div>

          {/* Time Configuration */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tempo & Rounds
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border bg-card text-center">
                <p className="text-2xl font-bold text-rankor">{config.rules.numberOfRounds}</p>
                <p className="text-xs text-muted-foreground">Rounds</p>
              </div>

              <div className="p-3 rounded-lg border bg-card text-center">
                <p className="text-2xl font-bold text-rankor">{config.rules.roundDuration}</p>
                <p className="text-xs text-muted-foreground">min/round</p>
              </div>

              <div className="p-3 rounded-lg border bg-card text-center">
                <p className="text-2xl font-bold text-rankor">{config.rules.intervalDuration}</p>
                <p className="text-xs text-muted-foreground">min intervalo</p>
              </div>
            </div>
          </div>

          {/* Judging System */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Sistema de Julgamento
            </h3>

            <div className="p-4 rounded-lg border bg-card">
              <p className="font-medium">
                {config.rules.judgingSystem === 'cumulative'
                  ? 'Pontuação Cumulativa'
                  : 'Dominância de Rounds'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {config.rules.judgingSystem === 'cumulative'
                  ? 'A soma total de pontos determina o vencedor'
                  : 'Quem vence mais rounds vence a luta'}
              </p>
            </div>
          </div>

          {/* Scoring Methods */}
          {Object.keys(config.rules.scoringMethods).length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="w-4 h-4" />
                Métodos de Pontuação
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {Object.entries(config.rules.scoringMethods).map(([method, points]) => (
                  <div
                    key={method}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <span className="text-sm font-medium capitalize">
                      {method.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                    <span className="text-sm font-bold text-rankor">{points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="p-4 rounded-lg bg-muted/30 border">
            <p className="text-sm">
              <strong>Resumo:</strong> {config.rules.numberOfRounds} rounds de{' '}
              {config.rules.roundDuration} minutos com {config.rules.intervalDuration} minuto(s) de
              intervalo •{' '}
              {config.rules.judgingSystem === 'cumulative'
                ? 'Pontuação Cumulativa'
                : 'Dominância de Rounds'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
