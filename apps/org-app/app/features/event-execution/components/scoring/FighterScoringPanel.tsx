import { motion } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar';
import { User } from 'lucide-react';
import { cn } from '@repo/ui/cn';
import type { ActionGroup, FighterScore, JudgingSystem } from '../../domain/scoring';
import { ActionButtonGroup } from './ActionButtonGroup';

interface FighterScoringPanelProps {
  fighter: 'A' | 'B';
  name: string;
  nickname: string;
  avatarUrl?: string;
  score: FighterScore;
  judgingSystem: JudgingSystem;
  actionGroups: ActionGroup[];
  onActionSelect: (actionKey: string) => void;
  disabled?: boolean;
}

export function FighterScoringPanel({
  fighter,
  name,
  nickname,
  avatarUrl,
  score,
  judgingSystem,
  actionGroups,
  onActionSelect,
  disabled = false,
}: FighterScoringPanelProps) {
  // Calculate total event count
  const eventCount = score.rounds.reduce((sum, r) => sum + r.eventCount, 0);

  return (
    <div className="flex flex-col gap-4 h-full p-4 overflow-y-auto">
      {/* Fighter Info - Sticky Header */}
      <motion.div
        className="flex flex-col items-center gap-2 sticky top-0 bg-background z-10 pb-2 border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Avatar */}
        <Avatar className="w-16 h-16 md:w-20 md:h-20 border-4 border-primary">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="text-2xl">
            <User className="w-8 h-8 md:w-10 md:h-10" />
          </AvatarFallback>
        </Avatar>

        {/* Name & Nickname */}
        <div className="text-center">
          <h3 className="font-bold text-base md:text-lg leading-tight">{name}</h3>
          <p className="text-xs md:text-sm text-muted-foreground">"{nickname}"</p>
        </div>

        {/* Score Display */}
        <div className="text-center">
          {judgingSystem === 'cumulative' ? (
            <>
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {score.totalPoints}
              </div>
              <div className="text-xs text-muted-foreground">Pontos</div>
            </>
          ) : (
            <>
              <div className="text-2xl md:text-3xl font-bold text-primary">
                {score.roundsWon}/{score.rounds.length}
              </div>
              <div className="text-xs text-muted-foreground">Rounds vencidos</div>
            </>
          )}

          {/* Event count */}
          <div className="mt-1 text-sm text-muted-foreground">
            {eventCount} eventos
          </div>
        </div>
      </motion.div>

      {/* Action Button Groups */}
      <div className="space-y-4 flex-1">
        {actionGroups.map((group) => (
          <ActionButtonGroup
            key={group.id}
            group={group}
            onActionSelect={onActionSelect}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}
