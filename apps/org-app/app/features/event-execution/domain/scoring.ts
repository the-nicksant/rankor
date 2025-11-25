import type { ReactNode } from "react";

export type JudgingSystem = 'cumulative' | 'dominance';
export type TimerPhase = 'idle' | 'round_active' | 'interval' | 'finished';
export type FightPhase = 'not_started' | 'in_progress' | 'paused' | 'finished';

export interface ActionGroup {
  id: string;
  label: string;
  icon: ReactNode;
  color: string;
  actions: ActionItem[];
}

export interface ActionItem {
  key: string;          // From scoringMethods (e.g., "head_punch")
  label: string;        // Display name (e.g., "Head Punch")
  points: number;       // From scoringMethods[key]
  position: number;     // Position in radial menu (0-7, like compass)
}

export interface FightEvent {
  id: string;
  timestamp: Date;
  round: number;
  timeInRound: number; // seconds elapsed in round when event occurred
  type: FightEventType;
  fighter: 'A' | 'B' | 'draw';

  // For point_scored events
  action?: string; // Key from scoringMethods (e.g., 'takedown', 'jab')
  points?: number; // Calculated from scoringMethods[action]

  // For round_dominance_score events (only for 'dominance' system)
  roundScore?: {
    fighterA: number; // e.g., 10
    fighterB: number; // e.g., 9
  };

  note?: string;
}

export type FightEventType =
  | 'point_scored'           // Action happened (jab, takedown, etc.)
  | 'round_dominance_score'  // Round score assigned (10-9, 10-8, etc.)
  | 'knockdown'
  | 'warning'
  | 'pause'
  | 'resume'
  | 'round_start'
  | 'round_end'
  | 'fight_start'
  | 'fight_end';

export interface ScoringSession {
  fightId: string;
  judgingSystem: JudgingSystem;
  scoringMethods: Record<string, number>; // e.g., { jab: 1, takedown: 2 }
  actionGroups: ActionGroup[]; // Grouped and formatted for UI

  // Fight state
  phase: FightPhase;
  currentRound: number;
  totalRounds: number;

  // Timer
  timerPhase: TimerPhase;
  roundTimeRemaining: number; // seconds
  intervalTimeRemaining: number; // seconds
  roundDuration: number; // minutes
  intervalDuration: number; // seconds

  // Scorecard
  scorecard: Scorecard;

  // Events log
  events: FightEvent[];

  // Metadata
  startedAt?: Date;
  finishedAt?: Date;
}

export interface Scorecard {
  fighterA: FighterScore;
  fighterB: FighterScore;
  judgingSystem: JudgingSystem;
}

export interface FighterScore {
  rounds: RoundScore[];
  totalPoints: number;      // For cumulative: sum of all action points across rounds
  roundsWon: number;        // For dominance: rounds won
  dominancePoints: number;  // For dominance: sum of round scores (10+10+9=29)
}

export interface RoundScore {
  round: number;
  actionPoints: number;      // Points from actions (cumulative system)
  dominanceScore?: number;   // Round score (dominance system, e.g., 10, 9, 8)
  eventCount: number;        // Count of scoring events in this round
}

export interface FightResult {
  winner: 'A' | 'B' | 'draw';
  method: string; // 'decision', 'ko', 'tko', 'submission'
  round?: number; // Round where fight ended (for early finishes)
  endedAt: Date;
  finalScorecard: Scorecard;
  notes?: string;
}

// Utility functions

export function createInitialScoringSession(
  fightId: string,
  totalRounds: number,
  roundDuration: number,
  intervalDuration: number,
  judgingSystem: JudgingSystem,
  scoringMethods: Record<string, number>,
  actionGroups: ActionGroup[]
): ScoringSession {
  return {
    fightId,
    judgingSystem,
    scoringMethods,
    actionGroups,
    phase: 'not_started',
    currentRound: 0,
    totalRounds,
    timerPhase: 'idle',
    roundTimeRemaining: roundDuration * 60,
    intervalTimeRemaining: intervalDuration,
    roundDuration,
    intervalDuration,
    scorecard: {
      fighterA: {
        rounds: [],
        totalPoints: 0,
        roundsWon: 0,
        dominancePoints: 0,
      },
      fighterB: {
        rounds: [],
        totalPoints: 0,
        roundsWon: 0,
        dominancePoints: 0,
      },
      judgingSystem,
    },
    events: [],
  };
}

export function calculateRoundWinner(
  roundScore: { fighterA: number; fighterB: number }
): 'A' | 'B' | 'draw' {
  if (roundScore.fighterA > roundScore.fighterB) return 'A';
  if (roundScore.fighterB > roundScore.fighterA) return 'B';
  return 'draw';
}

export function calculateFightWinner(scorecard: Scorecard): 'A' | 'B' | 'draw' {
  if (scorecard.judgingSystem === 'cumulative') {
    if (scorecard.fighterA.totalPoints > scorecard.fighterB.totalPoints) return 'A';
    if (scorecard.fighterB.totalPoints > scorecard.fighterA.totalPoints) return 'B';
    return 'draw';
  } else {
    // Dominance - who won more rounds
    if (scorecard.fighterA.roundsWon > scorecard.fighterB.roundsWon) return 'A';
    if (scorecard.fighterB.roundsWon > scorecard.fighterA.roundsWon) return 'B';

    // Tiebreaker: total dominance points
    if (scorecard.fighterA.dominancePoints > scorecard.fighterB.dominancePoints) return 'A';
    if (scorecard.fighterB.dominancePoints > scorecard.fighterA.dominancePoints) return 'B';

    return 'draw';
  }
}

export function addPointsToFighter(
  scorecard: Scorecard,
  fighter: 'A' | 'B' | 'draw',
  round: number,
  points: number
): Scorecard {
  const fighterKey = fighter === 'A' ? 'fighterA' : 'fighterB';
  const fighterScore = { ...scorecard[fighterKey] };
  const rounds = [...fighterScore.rounds];

  // Find or create round score
  let roundIndex = rounds.findIndex((r) => r.round === round);
  if (roundIndex === -1) {
    rounds.push({ round, actionPoints: 0, eventCount: 0, dominanceScore: undefined });
    roundIndex = rounds.length - 1;
  }

  const roundScore = { ...rounds[roundIndex] };
  roundScore.actionPoints += points;
  roundScore.eventCount += 1;
  rounds[roundIndex] = roundScore;

  fighterScore.rounds = rounds;

  // Update total points (for cumulative system)
  if (scorecard.judgingSystem === 'cumulative') {
    fighterScore.totalPoints = rounds.reduce((sum, r) => sum + r.actionPoints, 0);
  }

  return {
    ...scorecard,
    [fighterKey]: fighterScore,
  };
}

export function setRoundDominanceScore(
  scorecard: Scorecard,
  round: number,
  fighterAScore: number,
  fighterBScore: number
): Scorecard {
  const updatedScorecard = { ...scorecard };

  // Update Fighter A
  const fighterARounds = [...updatedScorecard.fighterA.rounds];
  let fighterARoundIndex = fighterARounds.findIndex((r) => r.round === round);
  if (fighterARoundIndex === -1) {
    fighterARounds.push({ round, actionPoints: 0, eventCount: 0, dominanceScore: fighterAScore });
    fighterARoundIndex = fighterARounds.length - 1;
  } else {
    fighterARounds[fighterARoundIndex] = {
      ...fighterARounds[fighterARoundIndex],
      dominanceScore: fighterAScore,
    };
  }

  // Update Fighter B
  const fighterBRounds = [...updatedScorecard.fighterB.rounds];
  let fighterBRoundIndex = fighterBRounds.findIndex((r) => r.round === round);
  if (fighterBRoundIndex === -1) {
    fighterBRounds.push({ round, actionPoints: 0, eventCount: 0, dominanceScore: fighterBScore });
    fighterBRoundIndex = fighterBRounds.length - 1;
  } else {
    fighterBRounds[fighterBRoundIndex] = {
      ...fighterBRounds[fighterBRoundIndex],
      dominanceScore: fighterBScore,
    };
  }

  // Calculate round winner
  const roundWinner = calculateRoundWinner({ fighterA: fighterAScore, fighterB: fighterBScore });

  updatedScorecard.fighterA = {
    ...updatedScorecard.fighterA,
    rounds: fighterARounds,
    dominancePoints: fighterARounds.reduce((sum, r) => sum + (r.dominanceScore || 0), 0),
    roundsWon: roundWinner === 'A'
      ? updatedScorecard.fighterA.roundsWon + 1
      : updatedScorecard.fighterA.roundsWon,
  };

  updatedScorecard.fighterB = {
    ...updatedScorecard.fighterB,
    rounds: fighterBRounds,
    dominancePoints: fighterBRounds.reduce((sum, r) => sum + (r.dominanceScore || 0), 0),
    roundsWon: roundWinner === 'B'
      ? updatedScorecard.fighterB.roundsWon + 1
      : updatedScorecard.fighterB.roundsWon,
  };

  return updatedScorecard;
}

export function generateEventId(): string {
  return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
