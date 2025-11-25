import { useState } from 'react';
import { Shuffle, X, Plus, ChevronDown, ChevronUp, User, Info } from 'lucide-react';
import { Button } from '@repo/ui/button';
import { useFightCreation } from '../../../context/fight-creation-context';
import { AthleteCard } from './athlete-card';
import { TaleOfTheTape } from './tale-of-the-tape';
import { AthleteSelectorDialog } from './athlete-selector-dialog';
import type { Athlete } from '../../../../../features/athlete/domain/athlete';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@repo/ui/empty';
import { useModalities } from '~/shared/hooks/data';
import { useAvailableAthletes } from '../../../hooks/use-fight-queries';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar';

const MAX_BATCH_FIGHTS = 20;

export function BatchModeMatchmaking() {
  const { state, dispatch } = useFightCreation();
  const { data: modalities } = useModalities();

  const modality = modalities?.find((m) => m.id === state.configuration.modalityId);
  const weightClass = state.configuration.weightClass;
  const [selectingFighter, setSelectingFighter] = useState<{ matchupId: string; corner: 'A' | 'B' } | null>(null);

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

  const handleAddMatchup = () => {
    if (state.batchMode.matchups.length >= MAX_BATCH_FIGHTS) return;

    dispatch({
      type: 'ADD_MATCHUP',
      payload: {
        id: Math.random().toString(36).substr(2, 9),
        fighterA: null,
        fighterB: null,
      },
    });
  };

  const selectedAthletes = state.batchMode.matchups.flatMap(m =>
    [m.fighterA, m.fighterB].filter(Boolean)
  );

  const availableAthletes = athletes.filter(
    (a) => !selectedAthletes.some((sa) => sa?.id === a.id)
  );

  const canAddMore = state.batchMode.matchups.length < MAX_BATCH_FIGHTS;

  const handleSelectFighter = (athlete: Athlete) => {
    if (selectingFighter) {
      dispatch({
        type: 'UPDATE_MATCHUP',
        payload: {
          id: selectingFighter.matchupId,
          matchup: {
            [selectingFighter.corner === 'A' ? 'fighterA' : 'fighterB']: athlete,
          },
        },
      });
    }
  };

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

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Criação em Lote</h2>
          <p className="text-sm text-muted-foreground">
            Arraste atletas para criar várias lutas de uma vez
          </p>
        </div>

        <Button onClick={() => dispatch({ type: 'AUTO_MATCH' })} variant="outline" size="sm">
          <Shuffle className="w-4 h-4 mr-2" />
          Auto-Emparelhar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Lutas ({state.batchMode.matchups.length})</h3>
            {canAddMore && (
              <Button onClick={handleAddMatchup} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Luta
              </Button>
            )}
          </div>

          {state.batchMode.matchups.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground mb-4">Nenhuma luta criada</p>
              <Button onClick={handleAddMatchup} size="sm">
                Adicionar Primeira Luta
              </Button>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {state.batchMode.matchups.map((matchup, index) => (
                <MatchupRow
                  key={matchup.id}
                  matchup={matchup}
                  index={index}
                  athletes={athletes}
                  onClickSelect={(matchupId, corner) => setSelectingFighter({ matchupId, corner })}
                />
              ))}
            </div>
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
                    <EmptyDescription>Todos os atletas já foram selecionados</EmptyDescription>
                  </EmptyHeader>
                </EmptyContent>
              </Empty>
            ) : (
              availableAthletes.map((athlete) => (
                <AthleteCard
                  key={athlete.id}
                  athlete={athlete}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('athleteId', athlete.id);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <AthleteSelectorDialog
        open={selectingFighter !== null}
        onClose={() => setSelectingFighter(null)}
        athletes={availableAthletes}
        onSelect={handleSelectFighter}
        title={`Selecionar Lutador - Canto ${selectingFighter?.corner || ''}`}
        description="Escolha um atleta da lista abaixo"
      />
    </div>
  );
}

interface MatchupRowProps {
  matchup: { id: string; fighterA: Athlete | null; fighterB: Athlete | null };
  index: number;
  athletes: Athlete[];
  onClickSelect: (matchupId: string, corner: 'A' | 'B') => void;
}

function MatchupRow({ matchup, index, athletes, onClickSelect }: MatchupRowProps) {
  const { dispatch } = useFightCreation();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDrop = (corner: 'A' | 'B') => (e: React.DragEvent) => {
    e.preventDefault();
    const athleteId = e.dataTransfer.getData('athleteId');
    const athlete = athletes.find(a => a.id === athleteId);

    if (athlete) {
      dispatch({
        type: 'UPDATE_MATCHUP',
        payload: {
          id: matchup.id,
          matchup: {
            [corner === 'A' ? 'fighterA' : 'fighterB']: athlete,
          },
        },
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const canExpand = matchup.fighterA && matchup.fighterB;

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted-foreground min-w-[30px]">
            #{index + 1}
          </span>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <FighterDropZone
              corner="A"
              fighter={matchup.fighterA}
              onDrop={handleDrop('A')}
              onDragOver={handleDragOver}
              onClear={() =>
                dispatch({
                  type: 'UPDATE_MATCHUP',
                  payload: { id: matchup.id, matchup: { fighterA: null } },
                })
              }
              onClick={() => onClickSelect(matchup.id, 'A')}
            />

            <FighterDropZone
              corner="B"
              fighter={matchup.fighterB}
              onDrop={handleDrop('B')}
              onDragOver={handleDragOver}
              onClear={() =>
                dispatch({
                  type: 'UPDATE_MATCHUP',
                  payload: { id: matchup.id, matchup: { fighterB: null } },
                })
              }
              onClick={() => onClickSelect(matchup.id, 'B')}
            />
          </div>

          <div className="flex items-center gap-2">
            {canExpand && (
              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="text"
                size="icon"
                title={isExpanded ? 'Recolher' : 'Expandir'}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            )}

            <Button
              onClick={() => dispatch({ type: 'REMOVE_MATCHUP', payload: matchup.id })}
              variant="text"
              size="icon"
              title="Remover luta"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && matchup.fighterA && matchup.fighterB && (
        <div className="border-t p-4 bg-muted/30">
          <TaleOfTheTape fighterA={matchup.fighterA} fighterB={matchup.fighterB} />

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border bg-card">
              <p className="text-sm font-medium mb-2">Lutas Anteriores</p>
              <p className="text-xs text-muted-foreground">
                Histórico não disponível (mock data)
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-card">
              <p className="text-sm font-medium mb-2">Estatísticas</p>
              <p className="text-xs text-muted-foreground">
                Estatísticas não disponíveis (mock data)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface FighterDropZoneProps {
  corner: 'A' | 'B';
  fighter: Athlete | null;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onClear: () => void;
  onClick: () => void;
}

function FighterDropZone({ corner, fighter, onDrop, onDragOver, onClear, onClick }: FighterDropZoneProps) {
  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onClick={!fighter ? onClick : undefined}
      className={`
        relative p-3 rounded border transition-all min-h-[80px] flex items-center
        ${fighter ? 'border-rankor/30 bg-rankor/5' : 'border-dashed border-border hover:border-rankor/50 hover:bg-accent cursor-pointer'}
      `}
    >
      {fighter ? (
        <div className="flex items-center gap-3 w-full">
          <Avatar className='size-12'>
            <AvatarImage src={fighter.avatarUrl} alt={fighter.nickname}/>
            <AvatarFallback><User /></AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {fighter.firstname} "{fighter.nickname}" {fighter.lastname}
            </p>
            <p className="text-xs text-muted-foreground">
              {fighter.weight}kg • {fighter.height}cm
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="text-muted-foreground hover:text-foreground p-1"
            title="Remover"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="w-full text-center">
          <Plus className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">
            Arraste atleta para o Canto {corner}
          </p>
        </div>
      )}
    </div>
  );
}
