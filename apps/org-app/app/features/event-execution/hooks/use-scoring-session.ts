import { useState, useEffect, useRef, useCallback } from 'react';
import type { FightChronogramItem } from '../domain/event-status';
import type { ScoringSession, FightEvent, Scorecard } from '../domain/scoring';
import {
  createInitialScoringSession,
  addPointsToFighter,
  setRoundDominanceScore,
  generateEventId,
  calculateFightWinner,
} from '../domain/scoring';
import { groupScoringActions } from '../utils/scoring-utils';

interface UseScoringSessionReturn {
  session: ScoringSession;
  actions: {
    startFight: () => void;
    startRound: () => void;
    pauseRound: () => void;
    resumeRound: () => void;
    recordAction: (fighter: 'A' | 'B', actionKey: string) => void;
    recordRoundScore: (fighterAScore: number, fighterBScore: number) => void;
    undoLastAction: () => void;
    endRound: () => void;
    endFight: (method: string, winner?: 'A' | 'B') => void;
  };
}

export function useScoringSession(fight: FightChronogramItem): UseScoringSessionReturn {
  const [session, setSession] = useState<ScoringSession>(() => {
    const actionGroups = groupScoringActions(fight.rules.scoringMethods);
    return createInitialScoringSession(
      fight.fightId,
      fight.rules.numberOfRounds,
      fight.rules.roundDuration,
      fight.rules.intervalDuration,
      fight.rules.judgingSystem,
      fight.rules.scoringMethods,
      actionGroups
    );
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const roundStartTimeRef = useRef<Date | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    if (session.timerPhase === 'round_active' && session.phase === 'in_progress') {
      timerRef.current = setInterval(() => {
        setSession((prev) => {
          const newTimeRemaining = prev.roundTimeRemaining - 1;

          // Round ends
          if (newTimeRemaining <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);

            // Log round_end event
            const roundEndEvent: FightEvent = {
              id: generateEventId(),
              timestamp: new Date(),
              round: prev.currentRound,
              timeInRound: prev.roundDuration * 60,
              type: 'round_end',
              fighter: 'A',
            };

            return {
              ...prev,
              roundTimeRemaining: 0,
              timerPhase: 'interval',
              intervalTimeRemaining: prev.intervalDuration,
              events: [...prev.events, roundEndEvent],
            };
          }

          return {
            ...prev,
            roundTimeRemaining: newTimeRemaining,
          };
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else if (session.timerPhase === 'interval') {
      timerRef.current = setInterval(() => {
        setSession((prev) => {
          const newIntervalTime = prev.intervalTimeRemaining - 1;

          // Interval ends
          if (newIntervalTime <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            return {
              ...prev,
              intervalTimeRemaining: 0,
              timerPhase: 'idle',
            };
          }

          return {
            ...prev,
            intervalTimeRemaining: newIntervalTime,
          };
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [session.timerPhase, session.phase]);

  const startFight = useCallback(() => {
    const event: FightEvent = {
      id: generateEventId(),
      timestamp: new Date(),
      round: 0,
      timeInRound: 0,
      type: 'fight_start',
      fighter: 'A',
    };

    setSession((prev) => ({
      ...prev,
      phase: 'in_progress',
      startedAt: new Date(),
      events: [...prev.events, event],
    }));
  }, []);

  const startRound = useCallback(() => {
    roundStartTimeRef.current = new Date();

    setSession((prev) => {
      const nextRound = prev.currentRound + 1;

      const event: FightEvent = {
        id: generateEventId(),
        timestamp: new Date(),
        round: nextRound,
        timeInRound: 0,
        type: 'round_start',
        fighter: 'A',
      };

      return {
        ...prev,
        currentRound: nextRound,
        roundTimeRemaining: prev.roundDuration * 60,
        timerPhase: 'round_active',
        events: [...prev.events, event],
      };
    });
  }, []);

  const pauseRound = useCallback(() => {
    const event: FightEvent = {
      id: generateEventId(),
      timestamp: new Date(),
      round: session.currentRound,
      timeInRound: getTimeInRound(),
      type: 'pause',
      fighter: 'A',
    };

    setSession((prev) => ({
      ...prev,
      phase: 'paused',
      events: [...prev.events, event],
    }));

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [session.currentRound]);

  const resumeRound = useCallback(() => {
    const event: FightEvent = {
      id: generateEventId(),
      timestamp: new Date(),
      round: session.currentRound,
      timeInRound: getTimeInRound(),
      type: 'resume',
      fighter: 'A',
    };

    setSession((prev) => ({
      ...prev,
      phase: 'in_progress',
      events: [...prev.events, event],
    }));
  }, [session.currentRound]);

  const getTimeInRound = useCallback((): number => {
    if (!roundStartTimeRef.current) return 0;
    const elapsed = (Date.now() - roundStartTimeRef.current.getTime()) / 1000;
    return Math.floor(elapsed);
  }, []);

  const recordAction = useCallback(
    (fighter: 'A' | 'B', actionKey: string) => {
      const points = session.scoringMethods[actionKey] || 0;

      const event: FightEvent = {
        id: generateEventId(),
        timestamp: new Date(),
        round: session.currentRound,
        timeInRound: getTimeInRound(),
        type: 'point_scored',
        fighter,
        action: actionKey,
        points,
      };

      setSession((prev) => {
        let updatedScorecard = prev.scorecard;

        // Only add points immediately in cumulative system
        if (prev.judgingSystem === 'cumulative') {
          updatedScorecard = addPointsToFighter(
            prev.scorecard,
            fighter,
            prev.currentRound,
            points
          );
        } else {
          // In dominance system, just increment event count
          updatedScorecard = addPointsToFighter(
            prev.scorecard,
            fighter,
            prev.currentRound,
            0 // Don't add points, just log event
          );
        }

        return {
          ...prev,
          scorecard: updatedScorecard,
          events: [...prev.events, event],
        };
      });
    },
    [session.scoringMethods, session.currentRound, session.judgingSystem, getTimeInRound]
  );

  const recordRoundScore = useCallback(
    (fighterAScore: number, fighterBScore: number) => {
      const event: FightEvent = {
        id: generateEventId(),
        timestamp: new Date(),
        round: session.currentRound,
        timeInRound: 0,
        type: 'round_dominance_score',
        fighter: 'A',
        roundScore: {
          fighterA: fighterAScore,
          fighterB: fighterBScore,
        },
      };

      setSession((prev) => {
        const updatedScorecard = setRoundDominanceScore(
          prev.scorecard,
          prev.currentRound,
          fighterAScore,
          fighterBScore
        );

        return {
          ...prev,
          scorecard: updatedScorecard,
          events: [...prev.events, event],
        };
      });
    },
    [session.currentRound]
  );

  const undoLastAction = useCallback(() => {
    setSession((prev) => {
      const events = [...prev.events];
      const lastEvent = events.pop();

      if (!lastEvent) return prev;

      // Only undo point_scored events
      if (lastEvent.type !== 'point_scored') {
        // Put it back
        events.push(lastEvent);
        return prev;
      }

      // Recalculate scorecard from scratch
      const newScorecard: Scorecard = {
        fighterA: { rounds: [], totalPoints: 0, roundsWon: 0, dominancePoints: 0 },
        fighterB: { rounds: [], totalPoints: 0, roundsWon: 0, dominancePoints: 0 },
        judgingSystem: prev.judgingSystem,
      };

      // Replay all point_scored events except the one we removed
      for (const event of events) {
        if (event.type === 'point_scored' && event.points) {
          if (prev.judgingSystem === 'cumulative') {
            const updatedScorecard = addPointsToFighter(
              newScorecard,
              event.fighter,
              event.round,
              event.points
            );
            Object.assign(newScorecard, updatedScorecard);
          } else {
            const updatedScorecard = addPointsToFighter(
              newScorecard,
              event.fighter,
              event.round,
              0
            );
            Object.assign(newScorecard, updatedScorecard);
          }
        }
      }

      return {
        ...prev,
        scorecard: newScorecard,
        events,
      };
    });
  }, []);

  const endRound = useCallback(() => {
    setSession((prev) => {
      // Already handled by timer reaching 0
      return prev;
    });
  }, []);

  const endFight = useCallback(
    (method: string, winner?: 'A' | 'B') => {
      setSession((prev) => {
        const finalWinner = winner || calculateFightWinner(prev.scorecard);

        const event: FightEvent = {
          id: generateEventId(),
          timestamp: new Date(),
          round: prev.currentRound,
          timeInRound: getTimeInRound(),
          type: 'fight_end',
          fighter: finalWinner,
          note: method,
        };

        return {
          ...prev,
          phase: 'finished',
          timerPhase: 'finished',
          finishedAt: new Date(),
          events: [...prev.events, event],
        };
      });

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    },
    [getTimeInRound]
  );

  return {
    session,
    actions: {
      startFight,
      startRound,
      pauseRound,
      resumeRound,
      recordAction,
      recordRoundScore,
      undoLastAction,
      endRound,
      endFight,
    },
  };
}
