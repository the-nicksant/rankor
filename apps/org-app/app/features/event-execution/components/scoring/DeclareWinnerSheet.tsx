import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@repo/ui/sheet';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar';
import { Trophy, User, ArrowRight } from 'lucide-react';
import { cn } from '@repo/ui/cn';
import { SlideToConfirm } from '~/components/ui/slide-to-confirm';
import type { FightChronogramItem } from '../../domain/event-status';
import type { ScoringSession } from '../../domain/scoring';
import { calculateFightWinner } from '../../domain/scoring';

interface DeclareWinnerSheetProps {
  isOpen: boolean;
  fight: FightChronogramItem;
  session: ScoringSession;
  isEarlyFinish?: boolean;
  onConfirm: (winner: 'A' | 'B', method: string, round?: number) => void;
  onCancel: () => void;
}

const FINISH_METHODS = [
  { value: 'decision', label: 'Decision', earlyFinish: false },
  { value: 'ko', label: 'KO', earlyFinish: true },
  { value: 'tko', label: 'TKO', earlyFinish: true },
  { value: 'submission', label: 'Submission', earlyFinish: true },
  { value: 'disqualification', label: 'Disqualification', earlyFinish: true },
];

export function DeclareWinnerSheet({
  isOpen,
  fight,
  session,
  isEarlyFinish = false,
  onConfirm,
  onCancel,
}: DeclareWinnerSheetProps) {
  const suggestedWinner = calculateFightWinner(session.scorecard);

  const [selectedWinner, setSelectedWinner] = useState<'A' | 'B' | null>(
    suggestedWinner === 'draw' ? null : suggestedWinner
  );
  const [selectedMethod, setSelectedMethod] = useState<string>(
    isEarlyFinish ? 'ko' : 'decision'
  );
  const [selectedRound, setSelectedRound] = useState<number | undefined>(
    isEarlyFinish ? session.currentRound : undefined
  );

  const handleConfirm = () => {
    if (!selectedWinner) return;
    onConfirm(selectedWinner, selectedMethod, selectedRound);
  };

  const availableMethods = isEarlyFinish
    ? FINISH_METHODS.filter((m) => m.earlyFinish)
    : FINISH_METHODS.filter((m) => !m.earlyFinish);

  const needsRoundSelection = ['ko', 'tko', 'submission'].includes(selectedMethod);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto flex flex-col items-center justify-center">
        <SheetHeader>
          <SheetTitle className="text-2xl flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Declare Winner
          </SheetTitle>
          <SheetDescription>
            {isEarlyFinish
              ? 'Fight ended early. Select the winner and finish method.'
              : 'All rounds complete. Select the winner and method.'}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6  p-6 max-w-2xl">
          {/* Winner Selection */}
          <div>
            <p className="font-semibold mb-3">Select Winner:</p>
            <div className="grid grid-cols-2 gap-4">
              {/* Fighter A */}
              <motion.button
                onClick={() => setSelectedWinner('A')}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all',
                  selectedWinner === 'A'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-border hover:border-primary'
                )}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="w-20 h-20 border-4 border-current">
                    <AvatarImage src={fight.fighterA.avatarUrl} />
                    <AvatarFallback>
                      <User className="w-10 h-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="font-bold">{fight.fighterA.name}</p>
                    <p className="text-xs text-muted-foreground">
                      "{fight.fighterA.nickname}"
                    </p>
                  </div>
                  {session.judgingSystem === 'cumulative' ? (
                    <Badge variant="secondary">
                      {session.scorecard.fighterA.totalPoints} pts
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {session.scorecard.fighterA.roundsWon} rounds
                    </Badge>
                  )}
                  {suggestedWinner === 'A' && (
                    <Badge className="bg-green-500">Suggested</Badge>
                  )}
                </div>
              </motion.button>

              {/* Fighter B */}
              <motion.button
                onClick={() => setSelectedWinner('B')}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all',
                  selectedWinner === 'B'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-border hover:border-primary'
                )}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="w-20 h-20 border-4 border-current">
                    <AvatarImage src={fight.fighterB.avatarUrl} />
                    <AvatarFallback>
                      <User className="w-10 h-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p className="font-bold">{fight.fighterB.name}</p>
                    <p className="text-xs text-muted-foreground">
                      "{fight.fighterB.nickname}"
                    </p>
                  </div>
                  {session.judgingSystem === 'cumulative' ? (
                    <Badge variant="secondary">
                      {session.scorecard.fighterB.totalPoints} pts
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {session.scorecard.fighterB.roundsWon} rounds
                    </Badge>
                  )}
                  {suggestedWinner === 'B' && (
                    <Badge className="bg-green-500">Suggested</Badge>
                  )}
                </div>
              </motion.button>
            </div>
          </div>

          {/* Method Selection */}
          <div>
            <p className="font-semibold mb-3">Finish Method:</p>
            <div className="grid grid-cols-2 gap-2">
              {availableMethods.map((method) => (
                <Button
                  key={method.value}
                  variant={selectedMethod === method.value ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setSelectedMethod(method.value)}
                  className="h-14 text-base"
                >
                  {method.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Round Selection (for KO/TKO/Submission) */}
          {needsRoundSelection && (
            <div>
              <p className="font-semibold mb-3">Round of Finish:</p>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                {Array.from({ length: session.totalRounds }, (_, i) => i + 1).map((round) => (
                  <Button
                    key={round}
                    variant={selectedRound === round ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => setSelectedRound(round)}
                    disabled={round > session.currentRound}
                    className="text-lg"
                  >
                    R{round}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedWinner && (
            <motion.div
              className="p-4 rounded-lg bg-primary/10 border-2 border-primary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm text-muted-foreground mb-2">Result Summary:</p>
              <p className="font-bold text-lg">
                {selectedWinner === 'A' ? fight.fighterA.name : fight.fighterB.name}
                {' wins by '}
                {availableMethods.find((m) => m.value === selectedMethod)?.label}
                {needsRoundSelection && selectedRound && ` in Round ${selectedRound}`}
              </p>
            </motion.div>
          )}

          {/* Confirmation */}
          <div className="space-y-3 pt-4">
            <SlideToConfirm
              onConfirm={handleConfirm}
              isLoading={false}
              disabled={!selectedWinner || (needsRoundSelection && !selectedRound)}
              text="Slide to confirm result"
              confirmText="Result confirmed!"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
