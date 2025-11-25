import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui/dialog';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { cn } from '@repo/ui/cn';

interface RoundDominanceModalProps {
  isOpen: boolean;
  round: number;
  fighterAName: string;
  fighterBName: string;
  eventCount: number;
  onConfirm: (fighterAScore: number, fighterBScore: number) => void;
  onCancel: () => void;
}

const SCORE_OPTIONS = [10, 9, 8, 7];

const COMMON_SCORES = [
  { fighterA: 10, fighterB: 9, label: '10-9 (Close Round)', color: 'bg-green-500' },
  { fighterA: 10, fighterB: 8, label: '10-8 (Dominant)', color: 'bg-orange-500' },
  { fighterA: 10, fighterB: 10, label: '10-10 (Even)', color: 'bg-blue-500' },
  { fighterA: 9, fighterB: 10, label: '9-10 (Close Round)', color: 'bg-green-500' },
  { fighterA: 8, fighterB: 10, label: '8-10 (Dominant)', color: 'bg-orange-500' },
];

export function RoundDominanceModal({
  isOpen,
  round,
  fighterAName,
  fighterBName,
  eventCount,
  onConfirm,
  onCancel,
}: RoundDominanceModalProps) {
  const [fighterAScore, setFighterAScore] = useState<number>(10);
  const [fighterBScore, setFighterBScore] = useState<number>(9);

  const handleConfirm = () => {
    onConfirm(fighterAScore, fighterBScore);
    // Reset for next round
    setFighterAScore(10);
    setFighterBScore(9);
  };

  const handleQuickSelect = (scoreA: number, scoreB: number) => {
    setFighterAScore(scoreA);
    setFighterBScore(scoreB);
  };

  const getWinner = () => {
    if (fighterAScore > fighterBScore) return 'A';
    if (fighterBScore > fighterAScore) return 'B';
    return 'draw';
  };

  const winner = getWinner();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Score Round {round}</DialogTitle>
          <DialogDescription>
            Assign 10-point must system scores for this round
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Count Info */}
          <div className="text-center">
            <Badge variant="secondary" className="text-sm">
              {eventCount} scoring events this round
            </Badge>
          </div>

          {/* Quick Select Common Scores */}
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">
              Quick Select:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {COMMON_SCORES.map((score, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSelect(score.fighterA, score.fighterB)}
                  className={cn(
                    'justify-start text-left h-auto py-2',
                    fighterAScore === score.fighterA &&
                      fighterBScore === score.fighterB &&
                      'border-primary border-2'
                  )}
                >
                  <div>
                    <div className="font-bold">{score.fighterA}-{score.fighterB}</div>
                    <div className="text-xs text-muted-foreground">
                      {score.label.split('(')[1]?.replace(')', '')}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Fighter A Score Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">{fighterAName}</p>
              {winner === 'A' && (
                <Badge className="bg-green-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Winner
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SCORE_OPTIONS.map((score) => (
                <Button
                  key={score}
                  variant={fighterAScore === score ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setFighterAScore(score)}
                  className="text-2xl h-16"
                >
                  {score}
                </Button>
              ))}
            </div>
          </div>

          {/* Fighter B Score Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold">{fighterBName}</p>
              {winner === 'B' && (
                <Badge className="bg-green-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Winner
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {SCORE_OPTIONS.map((score) => (
                <Button
                  key={score}
                  variant={fighterBScore === score ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => setFighterBScore(score)}
                  className="text-2xl h-16"
                >
                  {score}
                </Button>
              ))}
            </div>
          </div>

          {/* Score Preview */}
          <motion.div
            className="p-4 rounded-lg bg-muted text-center"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-sm text-muted-foreground mb-1">Round Score</p>
            <div className="flex items-center justify-center gap-4">
              <span className={cn(
                'text-4xl font-bold',
                winner === 'A' && 'text-green-600'
              )}>
                {fighterAScore}
              </span>
              <span className="text-2xl text-muted-foreground">-</span>
              <span className={cn(
                'text-4xl font-bold',
                winner === 'B' && 'text-green-600'
              )}>
                {fighterBScore}
              </span>
            </div>
            {winner === 'draw' && (
              <p className="text-sm text-muted-foreground mt-2">Even Round</p>
            )}
          </motion.div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 gap-2"
              size="lg"
            >
              Confirm & Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
