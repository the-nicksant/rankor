import { Trophy, Medal, TrendingUp, Eye } from 'lucide-react';
import { Button } from '@repo/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar';
import { ChevronDown, User } from 'lucide-react';
import type { FightChronogramItem } from '../../domain/event-status';
import { useState } from 'react';
import { cn } from '@repo/ui/cn';

interface CompletedFightsSectionProps {
  fights: FightChronogramItem[];
  onViewDetails: (fightId: string) => void;
}

export function CompletedFightsSection({
  fights,
  onViewDetails,
}: CompletedFightsSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  const completedFights = fights.filter((f) => f.status === 'completed');

  if (completedFights.length === 0) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="rounded-lg border bg-card">
        <CollapsibleTrigger asChild>
          <button className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Trophy className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold">Lutas Finalizadas</h3>
                <p className="text-sm text-muted-foreground">
                  {completedFights.length} {completedFights.length === 1 ? 'luta concluída' : 'lutas concluídas'}
                </p>
              </div>
            </div>
            <ChevronDown
              className={cn(
                'w-5 h-5 text-muted-foreground transition-transform',
                isOpen && 'transform rotate-180'
              )}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3">
            {completedFights.map((fight) => (
              <CompletedFightCard
                key={fight.fightId}
                fight={fight}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

interface CompletedFightCardProps {
  fight: FightChronogramItem;
  onViewDetails: (fightId: string) => void;
}

function CompletedFightCard({ fight, onViewDetails }: CompletedFightCardProps) {
  const result = fight.result;

  if (!result) {
    return null;
  }

  const isDrawOrNC =
    result.winner === 'draw' ||
    result.method === 'draw' ||
    result.method === 'no_contest';

  const winnerIsA = result.winner === 'A'
  const winnerIsB = result.winner === 'B'

  const methodLabels: Record<string, string> = {
    knockout: 'Nocaute',
    technical_knockout: 'Nocaute Técnico',
    submission: 'Finalização',
    decision: 'Decisão',
    unanimous_decision: 'Decisão Unânime',
    split_decision: 'Decisão Dividida',
    draw: 'Empate',
    no_contest: 'Sem Resultado',
    disqualification: 'Desqualificação',
    forfeit: 'Desistência',
  };

  return (
    <div className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-bold">
            #{fight.order}
          </div>
          <div className="text-xs text-muted-foreground">
            {fight.modality.name} • {fight.weightClass.title}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(fight.fightId)}
        >
          <Eye className="w-4 h-4 mr-1" />
          Detalhes
        </Button>
      </div>

      {/* Fighters */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center mb-3">
        {/* Fighter A */}
        <div
          className={cn(
            'flex items-center gap-2',
            winnerIsA && 'opacity-100',
            !isDrawOrNC && !winnerIsA && 'opacity-50'
          )}
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={fight.fighterA.avatarUrl} />
            <AvatarFallback>
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-sm font-semibold truncate">
                {fight.fighterA.name}
              </p>
              {winnerIsA && <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              "{fight.fighterA.nickname}"
            </p>
          </div>
        </div>

        {/* VS */}
        <div className="text-muted-foreground font-bold text-sm">VS</div>

        {/* Fighter B */}
        <div
          className={cn(
            'flex items-center gap-2 justify-end',
            winnerIsB && 'opacity-100',
            !isDrawOrNC && !winnerIsB && 'opacity-50'
          )}
        >
          <div className="flex-1 min-w-0 text-right">
            <div className="flex items-center gap-1 justify-end">
              {winnerIsB && <Trophy className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
              <p className="text-sm font-semibold truncate">
                {fight.fighterB.name}
              </p>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              "{fight.fighterB.nickname}"
            </p>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarImage src={fight.fighterB.avatarUrl} />
            <AvatarFallback>
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Result */}
      <div className="flex items-center justify-center gap-2 pt-3 border-t">
        {!isDrawOrNC && <Medal className="w-4 h-4 text-purple-500" />}
        <p className="text-sm font-medium text-muted-foreground">
          {isDrawOrNC ? (
            <span>{methodLabels[result.method] || result.method}</span>
          ) : (
            <span>
              Vitória por {methodLabels[result.method] || result.method}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
