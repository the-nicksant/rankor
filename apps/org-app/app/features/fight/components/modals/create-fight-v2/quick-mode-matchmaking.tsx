import { useState } from 'react';
import { User, Plus, X, Info } from 'lucide-react';
import { useFightCreation } from '../../../context/fight-creation-context';
import { AthleteCard } from './athlete-card';
import { TaleOfTheTape } from './tale-of-the-tape';
import { AthleteSelectorDialog } from './athlete-selector-dialog';
import type { Athlete } from '../../../../../features/athlete/domain/athlete';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@repo/ui/empty';
import { useModalities } from '~/shared/hooks/data';
import { useAvailableAthletes } from '../../../hooks/use-fight-queries';

export function QuickModeMatchmaking() {
  const { state, dispatch } = useFightCreation();
  const { data: modalities } = useModalities();

  const modality = modalities?.find((m) => m.id === state.configuration.modalityId);
  const weightClass = state.configuration.weightClass;
  const [draggedAthlete, setDraggedAthlete] = useState<Athlete | null>(null);
  const [selectingCorner, setSelectingCorner] = useState<'A' | 'B' | null>(null);

  const {
    data: athletes = [],
    isLoading: loading,
  } = useAvailableAthletes({
    eventId: '1',
    modality: state.configuration.modalityCode,
    experience: state.configuration.experienceLevel,
    weightClassMin: state.configuration.weightClass?.minWeight,
    weightClassMax: state.configuration.weightClass?.maxWeight,
  });

  const handleDragStart = (athlete: Athlete) => (e: React.DragEvent) => {
    setDraggedAthlete(athlete);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (corner: 'A' | 'B') => (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedAthlete) {
      dispatch({
        type: 'SELECT_QUICK_FIGHTER',
        payload: { corner, athlete: draggedAthlete },
      });
      setDraggedAthlete(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleSelectAthlete = (athlete: Athlete) => {
    if (selectingCorner) {
      dispatch({
        type: 'SELECT_QUICK_FIGHTER',
        payload: { corner: selectingCorner, athlete },
      });
    }
  };

  const selectedAthletes = [state.quickMode.fighterA, state.quickMode.fighterB].filter(Boolean);
  const availableAthletes = athletes.filter(
    (a) => !selectedAthletes.some((sa) => sa?.id === a.id)
  );

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-lg border bg-muted/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-1">Configuração da Luta</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>
                <strong>Modalidade:</strong> {modality?.name || '—'}
              </span>
              <span>
                <strong>Experiência:</strong> {state.configuration.experienceLevel || '—'}
              </span>
              {weightClass && (
                <span>
                  <strong>Categoria:</strong> {weightClass.title} ({weightClass.minWeight}kg - {weightClass.maxWeight}kg)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-1">Seleção de Lutadores</h2>
        <p className="text-sm text-muted-foreground">
          Arraste os atletas para os cantos ou clique para selecionar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <DropZone
              corner="A"
              fighter={state.quickMode.fighterA}
              onDrop={handleDrop('A')}
              onDragOver={handleDragOver}
              onClear={() =>
                dispatch({ type: 'SELECT_QUICK_FIGHTER', payload: { corner: 'A', athlete: null } })
              }
              onClick={() => setSelectingCorner('A')}
            />

            <DropZone
              corner="B"
              fighter={state.quickMode.fighterB}
              onDrop={handleDrop('B')}
              onDragOver={handleDragOver}
              onClear={() =>
                dispatch({ type: 'SELECT_QUICK_FIGHTER', payload: { corner: 'B', athlete: null } })
              }
              onClick={() => setSelectingCorner('B')}
            />
          </div>

          {state.quickMode.fighterA && state.quickMode.fighterB && (
            <TaleOfTheTape fighterA={state.quickMode.fighterA} fighterB={state.quickMode.fighterB} />
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Atletas Disponíveis</h3>
            <span className="text-sm text-muted-foreground">{availableAthletes.length > 0 && availableAthletes.length}</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Carregando...</div>
            ) : availableAthletes.length === 0 ? (
              <Empty>
                <EmptyMedia variant={'icon'}>
                  <X />
                </EmptyMedia>
                <EmptyContent>
                  <EmptyHeader>
                    <EmptyTitle>Nenhum atleta disponível</EmptyTitle>
                    <EmptyDescription>Promova o evento para ter mais atletas incritos</EmptyDescription>
                  </EmptyHeader>
                </EmptyContent>
              </Empty>
            ) : (
              availableAthletes.map((athlete) => (
                <AthleteCard
                  key={athlete.id}
                  athlete={athlete}
                  draggable
                  onDragStart={handleDragStart(athlete)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <AthleteSelectorDialog
        open={selectingCorner !== null}
        onClose={() => setSelectingCorner(null)}
        athletes={availableAthletes}
        onSelect={handleSelectAthlete}
        title={`Selecionar Lutador - Canto ${selectingCorner || ''}`}
        description="Escolha um atleta da lista abaixo"
      />
    </div>
  );
}

interface DropZoneProps {
  corner: 'A' | 'B';
  fighter: Athlete | null;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onClear: () => void;
  onClick: () => void;
}

function DropZone({ corner, fighter, onDrop, onDragOver, onClear, onClick }: DropZoneProps) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={!fighter ? onClick : undefined}
      className={`
        relative p-6 rounded-lg border-2 border-dashed min-h-[200px] flex flex-col items-center justify-center
        ${fighter ? 'border-rankor bg-rankor/5' : 'border-border bg-muted/30 cursor-pointer hover:border-rankor/50'}
        transition-all
      `}
    >
      <div className="absolute top-4 left-4">
        <span className="text-sm font-semibold px-2 py-1 rounded bg-background border">
          Canto {corner}
        </span>
      </div>

      {fighter ? (
        <div className="w-full mt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-rankor/20 flex items-center justify-center">
              <User className="w-10 h-10 text-rankor" />
            </div>
            <div className="text-center">
              <h4 className="font-semibold">
                {fighter.firstname} "{fighter.nickname}" {fighter.lastname}
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                {fighter.weight}kg • {fighter.height}cm
              </p>
            </div>
            <button
              onClick={onClear}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Remover
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Arraste um atleta aqui</p>
        </div>
      )}
    </div>
  );
}
