import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@repo/ui/button';
import { toast } from 'sonner';
import { Play, RotateCcw } from 'lucide-react';
import type { FightChronogramItem } from '../../domain/event-status';
import { useScoringSession } from '../../hooks/use-scoring-session';
import { ScoringHeader } from './ScoringHeader';
import { SplitScoreView } from './SplitScoreView';
import { IntervalScreen } from './IntervalScreen';
import { RoundDominanceModal } from './RoundDominanceModal';
import { DeclareWinnerSheet } from './DeclareWinnerSheet';
import { formatActionLabel } from '../../utils/scoring-utils';

interface ScoringInterfaceProps {
  fight: FightChronogramItem;
  onComplete: (result: any) => void;
  landscapeMode?: boolean;
  onToggleLandscape?: () => void;
}

export function ScoringInterface({
  fight,
  onComplete,
  landscapeMode = false,
  onToggleLandscape,
}: ScoringInterfaceProps) {
  const { session, actions } = useScoringSession(fight);

  const [showRoundScoreModal, setShowRoundScoreModal] = useState(false);
  const [showWinnerSheet, setShowWinnerSheet] = useState(false);
  const [isEarlyFinish, setIsEarlyFinish] = useState(false);
  const [lastActionTimeout, setLastActionTimeout] = useState<NodeJS.Timeout | null>(null);

  // Handle interval end -> show round score modal for dominance system
  useEffect(() => {
    if (
      session.timerPhase === 'interval' &&
      session.judgingSystem === 'dominance' &&
      session.intervalTimeRemaining === 0 &&
      session.currentRound > 0
    ) {
      // Check if this round already has a dominance score
      const currentRoundA = session.scorecard.fighterA.rounds.find(
        (r) => r.round === session.currentRound
      );
      const currentRoundB = session.scorecard.fighterB.rounds.find(
        (r) => r.round === session.currentRound
      );

      if (
        currentRoundA?.dominanceScore === undefined ||
        currentRoundB?.dominanceScore === undefined
      ) {
        setShowRoundScoreModal(true);
      }
    }
  }, [
    session.timerPhase,
    session.intervalTimeRemaining,
    session.judgingSystem,
    session.currentRound,
    session.scorecard,
  ]);

  // Handle fight not started state
  const handleStartFight = () => {
    actions.startFight();
    // Start first round immediately
    setTimeout(() => {
      actions.startRound();
    }, 100);
  };

  // Handle action selection
  const handleActionSelect = (fighter: 'A' | 'B', actionKey: string) => {
    actions.recordAction(fighter, actionKey);

    const points = session.scoringMethods[actionKey];
    const actionLabel = formatActionLabel(actionKey);

    toast.success(
      `${fighter === 'A' ? fight.fighterA.name : fight.fighterB.name}: ${actionLabel}`,
      {
        description: session.judgingSystem === 'cumulative' ? `+${points} points` : 'Event logged',
        duration: 2000,
      }
    );
  };

  // Handle undo
  const handleUndo = () => {
    actions.undoLastAction();
    toast.info('Last action undone');
  };

  // Handle round dominance score
  const handleRoundScore = (fighterAScore: number, fighterBScore: number) => {
    actions.recordRoundScore(fighterAScore, fighterBScore);
    setShowRoundScoreModal(false);

    toast.success('Round scored', {
      description: `${fighterAScore}-${fighterBScore}`,
    });
  };


  const handleStartNextRound = () => {
    if (session.judgingSystem === 'dominance') {
      const currentRoundA = session.scorecard.fighterA.rounds.find(
        (r) => r.round === session.currentRound
      );
      const currentRoundB = session.scorecard.fighterB.rounds.find(
        (r) => r.round === session.currentRound
      );

      if (
        currentRoundA?.dominanceScore === undefined ||
        currentRoundB?.dominanceScore === undefined
      ) {
        setShowRoundScoreModal(true);
        return;
      }
    }

    actions.startRound();
  };

  // Handle end fight
  const handleEndFight = () => {
    setIsEarlyFinish(true);
    setShowWinnerSheet(true);
  };

  // Handle end fight after last round
  const handleEndFightAfterRounds = () => {
    setIsEarlyFinish(false);
    setShowWinnerSheet(true);
  };

  // Handle winner confirmation
  const handleWinnerConfirm = (winner: 'A' | 'B', method: string, round?: number) => {
    actions.endFight(method, winner);

    const result = {
      fightId: fight.fightId,
      winner,
      method,
      round,
      scorecard: session.scorecard,
      events: session.events,
      finishedAt: new Date(),
    };

    setShowWinnerSheet(false);
    onComplete(result);

    toast.success('Fight completed!', {
      description: `${winner === 'A' ? fight.fighterA.name : fight.fighterB.name} wins by ${method}`,
    });
  };

  // Get last action for undo display
  const lastAction = session.events
    .slice()
    .reverse()
    .find((e) => e.type === 'point_scored');

  // Calculate event count for round score modal
  const currentRoundEventCount = session.events.filter(
    (e) => e.round === session.currentRound && e.type === 'point_scored'
  ).length;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      {/* Not Started State */}
      {session.phase === 'not_started' && (
        <div className="h-full flex items-center justify-center p-8">
          <motion.div
            className="text-center space-y-6 max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Pronto para Pontuar</h2>
              <p className="text-muted-foreground">
                Fight #{fight.order} • {fight.modality.name}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {fight.rules.numberOfRounds}x{fight.rules.roundDuration} min •{' '}
                {fight.rules.judgingSystem === 'cumulative' ? 'Pontos Cumulativos' : 'Dominância de Rounds'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <p className="font-bold text-lg">{fight.fighterA.name}</p>
                <p className="text-sm text-muted-foreground">"{fight.fighterA.nickname}"</p>
              </div>
              <div className="text-2xl font-bold text-muted-foreground">VS</div>
              <div className="text-center">
                <p className="font-bold text-lg">{fight.fighterB.name}</p>
                <p className="text-sm text-muted-foreground">"{fight.fighterB.nickname}"</p>
              </div>
            </div>

            <Button onClick={handleStartFight} size="lg" className="gap-2 text-lg h-16 w-full">
              <Play className="w-6 h-6" />
              Iniciar Luta
            </Button>
          </motion.div>
        </div>
      )}

      {/* Active Scoring State */}
      {session.phase === 'in_progress' && session.timerPhase === 'round_active' && (
        <>
          <ScoringHeader
            session={session}
            onPause={actions.pauseRound}
            onResume={actions.resumeRound}
            onEndFight={handleEndFight}
            landscapeMode={landscapeMode}
            onToggleLandscape={onToggleLandscape}
          />
          <div className="flex-1 relative">
            <SplitScoreView
              fight={fight}
              session={session}
              onActionSelect={handleActionSelect}
              disabled={false}
            />
          </div>

          <AnimatePresence>
            {lastAction && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t-2 border-border"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
              >
                <div className="flex items-center justify-between max-w-4xl mx-auto">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Last: </span>
                    <span className="font-semibold">
                      {lastAction.fighter === 'A' ? fight.fighterA.name : fight.fighterB.name}
                    </span>
                    <span className="text-muted-foreground"> - </span>
                    <span className="font-semibold">
                      {lastAction.action ? formatActionLabel(lastAction.action) : 'Action'}
                    </span>
                    {lastAction.points && session.judgingSystem === 'cumulative' && (
                      <span className="text-muted-foreground"> (+{lastAction.points})</span>
                    )}
                  </div>
                  <Button onClick={handleUndo} variant="outline" size="sm" className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Desfazer
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {session.phase === 'paused' && (
        <>
          <ScoringHeader
            session={session}
            onPause={actions.pauseRound}
            onResume={actions.resumeRound}
            onEndFight={handleEndFight}
            landscapeMode={landscapeMode}
            onToggleLandscape={onToggleLandscape}
          />
          <div className="flex-1 relative opacity-50">
            <SplitScoreView
              fight={fight}
              session={session}
              onActionSelect={handleActionSelect}
              disabled={true}
            />
          </div>
        </>
      )}

      {/* Interval State */}
      {session.phase === 'in_progress' &&
       (session.timerPhase === 'interval' ||
        (session.timerPhase === 'idle' && session.currentRound < session.totalRounds && session.currentRound > 0)) && (
        <IntervalScreen
          fight={fight}
          session={session}
          onStartNextRound={handleStartNextRound}
          onEndFightEarly={handleEndFightAfterRounds}
        />
      )}

      {/* Round Dominance Score Modal */}
      <RoundDominanceModal
        isOpen={showRoundScoreModal}
        round={session.currentRound}
        fighterAName={fight.fighterA.name}
        fighterBName={fight.fighterB.name}
        eventCount={currentRoundEventCount}
        onConfirm={handleRoundScore}
        onCancel={() => setShowRoundScoreModal(false)}
      />

      {/* Declare Winner Sheet */}
      <DeclareWinnerSheet
        isOpen={showWinnerSheet}
        fight={fight}
        session={session}
        isEarlyFinish={isEarlyFinish}
        onConfirm={handleWinnerConfirm}
        onCancel={() => setShowWinnerSheet(false)}
      />
    </div>
  );
}
