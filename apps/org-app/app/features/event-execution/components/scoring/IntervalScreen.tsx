import { motion } from 'motion/react';
import { Button } from '@repo/ui/button';
import { Card, CardContent } from '@repo/ui/card';
import { Badge } from '@repo/ui/badge';
import { PlayCircle, StopCircle, Trophy } from 'lucide-react';
import { cn } from '@repo/ui/cn';
import type { FightChronogramItem } from '../../domain/event-status';
import type { ScoringSession } from '../../domain/scoring';
import { formatTime } from '../../utils/scoring-utils';

interface IntervalScreenProps {
  fight: FightChronogramItem;
  session: ScoringSession;
  onStartNextRound: () => void;
  onEndFightEarly: () => void;
}

export function IntervalScreen({
  fight,
  session,
  onStartNextRound,
  onEndFightEarly,
}: IntervalScreenProps) {
  const isLastRound = session.currentRound === session.totalRounds;
  const currentRoundScoreA = session.scorecard.fighterA.rounds.find(
    (r) => r.round === session.currentRound
  );
  const currentRoundScoreB = session.scorecard.fighterB.rounds.find(
    (r) => r.round === session.currentRound
  );

  return (
    <div className="h-full flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-2">
          <CardContent className="p-8 space-y-6">
            {/* Interval Header */}
            <div className="text-center space-y-2">
              <Badge
                variant={session.intervalTimeRemaining === 0 ? "default" : "secondary"}
                className={cn(
                  "text-lg px-4 py-2",
                  session.intervalTimeRemaining === 0 && "animate-pulse"
                )}
              >
                {session.intervalTimeRemaining === 0 ? "READY!" : "INTERVAL"}
              </Badge>
              <motion.div
                className={cn(
                  "text-6xl font-mono font-bold",
                  session.intervalTimeRemaining === 0 ? "text-primary" : "text-muted-foreground"
                )}
                animate={
                  session.intervalTimeRemaining === 0
                    ? { scale: [1, 1.1, 1] }
                    : { scale: [1, 1.05, 1] }
                }
                transition={{ duration: 1, repeat: Infinity }}
              >
                {formatTime(session.intervalTimeRemaining)}
              </motion.div>
              <p className="text-sm text-muted-foreground">
                {session.intervalTimeRemaining === 0
                  ? "Ready to start next round"
                  : "Rest before next round"}
              </p>
            </div>

            {/* Round Complete Badge */}
            <div className="text-center">
              <Badge variant="default" className="text-base px-4 py-1">
                Round {session.currentRound} Complete
              </Badge>
            </div>

            {/* Round Scores */}
            <div className="grid grid-cols-2 gap-4">
              {/* Fighter A */}
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">
                  {fight.fighterA.name}
                </p>
                {session.judgingSystem === 'cumulative' ? (
                  <div className="text-3xl font-bold text-primary">
                    {currentRoundScoreA?.actionPoints || 0} pts
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-primary">
                    {currentRoundScoreA?.dominanceScore || 0}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {currentRoundScoreA?.eventCount || 0} events
                </p>
              </div>

              {/* Fighter B */}
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground mb-1">
                  {fight.fighterB.name}
                </p>
                {session.judgingSystem === 'cumulative' ? (
                  <div className="text-3xl font-bold text-primary">
                    {currentRoundScoreB?.actionPoints || 0} pts
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-primary">
                    {currentRoundScoreB?.dominanceScore || 0}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {currentRoundScoreB?.eventCount || 0} events
                </p>
              </div>
            </div>

            {/* Total Scores */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Total</p>
                {session.judgingSystem === 'cumulative' ? (
                  <div className="text-2xl font-bold">
                    {session.scorecard.fighterA.totalPoints} pts
                  </div>
                ) : (
                  <div className="text-2xl font-bold">
                    {session.scorecard.fighterA.roundsWon} rounds
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Total</p>
                {session.judgingSystem === 'cumulative' ? (
                  <div className="text-2xl font-bold">
                    {session.scorecard.fighterB.totalPoints} pts
                  </div>
                ) : (
                  <div className="text-2xl font-bold">
                    {session.scorecard.fighterB.roundsWon} rounds
                  </div>
                )}
              </div>
            </div>

            {/* Next Round Info */}
            {!isLastRound && (
              <div className="text-center py-4 px-6 bg-primary/10 rounded-lg">
                <p className="text-sm font-semibold text-primary">
                  Next: Round {session.currentRound + 1}/{session.totalRounds}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              {/* Start Next Round / End Fight */}
              {!isLastRound ? (
                <Button
                  onClick={onStartNextRound}
                  size="lg"
                  className="w-full gap-2 text-lg h-14"
                >
                  <PlayCircle className="w-6 h-6" />
                  Start Round {session.currentRound + 1}
                </Button>
              ) : (
                <Button
                  onClick={onEndFightEarly}
                  size="lg"
                  variant="default"
                  className="w-full gap-2 text-lg h-14"
                >
                  <Trophy className="w-6 h-6" />
                  Declare Winner
                </Button>
              )}

              {/* End Fight Early Option */}
              {!isLastRound && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground text-center mb-2">
                    Or finish fight early:
                  </p>
                  <Button
                    onClick={onEndFightEarly}
                    size="sm"
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <StopCircle className="w-4 h-4" />
                    End Fight (KO/TKO/Submission)
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
