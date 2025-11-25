import { motion } from 'motion/react';
import type { FightChronogramItem } from '../../domain/event-status';
import type { ScoringSession } from '../../domain/scoring';
import { FighterScoringPanel } from './FighterScoringPanel';

interface SplitScoreViewProps {
  fight: FightChronogramItem;
  session: ScoringSession;
  onActionSelect: (fighter: 'A' | 'B', actionKey: string) => void;
  disabled?: boolean;
}

export function SplitScoreView({
  fight,
  session,
  onActionSelect,
  disabled = false,
}: SplitScoreViewProps) {
  return (
    <div className="flex h-full">
      {/* Fighter A Panel */}
      <motion.div
        className="flex-1 border-r-2 border-border"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <FighterScoringPanel
          fighter="A"
          name={fight.fighterA.name}
          nickname={fight.fighterA.nickname}
          avatarUrl={fight.fighterA.avatarUrl}
          score={session.scorecard.fighterA}
          judgingSystem={session.judgingSystem}
          actionGroups={session.actionGroups}
          onActionSelect={(actionKey) => onActionSelect('A', actionKey)}
          disabled={disabled}
        />
      </motion.div>

      {/* VS Divider */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <motion.div
          className="w-16 h-16 rounded-full bg-background border-4 border-border flex items-center justify-center shadow-lg"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <span className="text-xl font-bold text-muted-foreground">VS</span>
        </motion.div>
      </div>

      {/* Fighter B Panel */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <FighterScoringPanel
          fighter="B"
          name={fight.fighterB.name}
          nickname={fight.fighterB.nickname}
          avatarUrl={fight.fighterB.avatarUrl}
          score={session.scorecard.fighterB}
          judgingSystem={session.judgingSystem}
          actionGroups={session.actionGroups}
          onActionSelect={(actionKey) => onActionSelect('B', actionKey)}
          disabled={disabled}
        />
      </motion.div>
    </div>
  );
}
