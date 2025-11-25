import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from '@repo/ui/button';
import { Badge } from '@repo/ui/badge';
import { Pause, Play, StopCircle, RotateCcw, Smartphone } from 'lucide-react';
import { cn } from '@repo/ui/cn';
import type { ScoringSession } from '../../domain/scoring';
import { formatTime } from '../../utils/scoring-utils';

interface ScoringHeaderProps {
  session: ScoringSession;
  onPause: () => void;
  onResume: () => void;
  onEndFight: () => void;
  landscapeMode?: boolean;
  onToggleLandscape?: () => void;
}

// Audio file paths - you can replace these with your own sound files
const ROUND_END_SOUND = '/sounds/round-end.mp3';
const WARNING_10S_SOUND = '/sounds/warning-10s.mp3';
const WARNING_30S_SOUND = '/sounds/warning-30s.mp3';

export function ScoringHeader({
  session,
  onPause,
  onResume,
  onEndFight,
  landscapeMode = false,
  onToggleLandscape,
}: ScoringHeaderProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const has30sWarningPlayed = useRef(false);
  const has10sWarningPlayed = useRef(false);

  // Play sound effects based on timer
  // useEffect(() => {
  //   if (session.timerPhase !== 'round_active') {
  //     // Reset warning flags when not in active round
  //     has30sWarningPlayed.current = false;
  //     has10sWarningPlayed.current = false;
  //     return;
  //   }

  //   const timeRemaining = session.roundTimeRemaining;

  //   // 30 second warning
  //   if (timeRemaining === 30 && !has30sWarningPlayed.current) {
  //     playSound(WARNING_30S_SOUND);
  //     has30sWarningPlayed.current = true;
  //   }

  //   // 10 second warning
  //   if (timeRemaining === 10 && !has10sWarningPlayed.current) {
  //     playSound(WARNING_10S_SOUND);
  //     has10sWarningPlayed.current = true;
  //   }

  //   // Round end
  //   if (timeRemaining === 0) {
  //     playSound(ROUND_END_SOUND);
  //   }
  // }, [session.roundTimeRemaining, session.timerPhase]);

  const playSound = (soundPath: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = new Audio(soundPath);
      audioRef.current.play().catch((error) => {
        console.warn('Failed to play sound:', error);
      });
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  };

  const getTimerColor = () => {
    if (session.timerPhase === 'interval') return 'text-blue-600';
    if (session.roundTimeRemaining <= 10) return 'text-red-600';
    if (session.roundTimeRemaining <= 30) return 'text-orange-600';
    return 'text-foreground';
  };

  const isPaused = session.phase === 'paused';
  const isInterval = session.timerPhase === 'interval';

  return (
    <div className="w-full bg-background border-b-2 border-border px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Round Info */}
        <div className="flex items-center gap-3">
          <Badge variant="default" className="text-base px-3 py-1">
            Round {session.currentRound}/{session.totalRounds}
          </Badge>

          {isInterval && (
            <Badge variant="secondary" className="text-sm">
              Interval
            </Badge>
          )}

          {isPaused && (
            <Badge className="text-sm animate-pulse">
              Paused
            </Badge>
          )}
        </div>

        {/* Timer */}
        <motion.div
          className={cn(
            'text-4xl md:text-5xl font-mono font-bold tabular-nums',
            getTimerColor()
          )}
          animate={
            session.roundTimeRemaining <= 10 && session.timerPhase === 'round_active'
              ? { scale: [1, 1.05, 1] }
              : { scale: 1 }
          }
          transition={{
            duration: 1,
            repeat: session.roundTimeRemaining <= 10 ? Infinity : 0,
          }}
        >
          {isInterval
            ? formatTime(session.intervalTimeRemaining)
            : formatTime(session.roundTimeRemaining)}
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Landscape Toggle */}
          {onToggleLandscape && (
            <Button
              variant="ghost"
              size="lg"
              onClick={onToggleLandscape}
              className={cn(
                'gap-2',
                landscapeMode && 'bg-primary/10 text-primary'
              )}
              title="Toggle landscape mode"
            >
              <Smartphone className={cn(
                'w-5 h-5 transition-transform',
                landscapeMode && 'rotate-90'
              )} />
              <span className="hidden md:inline">
                {landscapeMode ? 'Portrait' : 'Landscape'}
              </span>
            </Button>
          )}

          {/* Pause/Resume */}
          {session.timerPhase === 'round_active' && (
            <>
              {!isPaused ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onPause}
                  className="gap-2"
                >
                  <Pause className="w-5 h-5" />
                  <span className="hidden md:inline">Pause</span>
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="lg"
                  onClick={onResume}
                  className="gap-2"
                >
                  <Play className="w-5 h-5" />
                  <span className="hidden md:inline">Resume</span>
                </Button>
              )}
            </>
          )}

          {/* End Fight */}
          <Button
            variant="destructive"
            size="lg"
            onClick={onEndFight}
            className="gap-2"
          >
            <StopCircle className="w-5 h-5" />
            <span className="hidden md:inline">End Fight</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
