export type FightPhase = 'not_started' | 'in_progress' | 'paused' | 'finished';
export type TimerPhase = 'idle' | 'round_active' | 'interval' | 'finished';

export interface FightState {
  fightId: string;
  phase: FightPhase;
  currentRound: number;
  totalRounds: number;

  // Timer
  timerPhase: TimerPhase;
  roundTimeRemaining: number; // seconds
  intervalTimeRemaining: number; // seconds

  // Scores
  scorecard: Scorecard;

  // Events log
  events: FightEvent[];

  // Metadata
  startedAt?: Date;
  pausedAt?: Date;
  finishedAt?: Date;
}

export interface Scorecard {
  fighterA: FighterScore;
  fighterB: FighterScore;
  judgingSystem: 'cumulative' | 'dominance';
}

export interface FighterScore {
  rounds: RoundScore[];
  totalPoints: number;
  roundsWon: number;
}

export interface RoundScore {
  round: number;
  points: number;
  events: number; // Count of scoring events in this round
}

export interface FightEvent {
  id: string;
  timestamp: Date;
  round: number;
  timeInRound: number; // seconds into the round when event occurred
  type: FightEventType;
  fighter: 'A' | 'B';
  action?: string; // e.g., 'strike_landed', 'takedown'
  points?: number;
  note?: string;
}

export type FightEventType =
  | 'point_scored'
  | 'knockdown'
  | 'warning'
  | 'pause'
  | 'resume'
  | 'round_start'
  | 'round_end'
  | 'fight_start'
  | 'fight_end';

export interface FightResult {
  winner: 'A' | 'B' | 'draw';
  method: string; // KO, TKO, SUBMISSION, DECISION
  endedAt: Date;
  finalScorecard: Scorecard;
  notes?: string;
}

// Utility functions
export function createInitialFightState(
  fightId: string,
  totalRounds: number,
  roundDuration: number,
  intervalDuration: number,
  judgingSystem: 'cumulative' | 'dominance'
): FightState {
  return {
    fightId,
    phase: 'not_started',
    currentRound: 0,
    totalRounds,
    timerPhase: 'idle',
    roundTimeRemaining: roundDuration * 60,
    intervalTimeRemaining: intervalDuration * 60,
    scorecard: {
      fighterA: {
        rounds: [],
        totalPoints: 0,
        roundsWon: 0,
      },
      fighterB: {
        rounds: [],
        totalPoints: 0,
        roundsWon: 0,
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
    return 'draw';
  }
}

export function addPointsToFighter(
  scorecard: Scorecard,
  fighter: 'A' | 'B',
  round: number,
  points: number
): Scorecard {
  const fighterKey = fighter === 'A' ? 'fighterA' : 'fighterB';
  const fighterScore = { ...scorecard[fighterKey] };
  const rounds = [...fighterScore.rounds];

  // Find or create round score
  let roundIndex = rounds.findIndex((r) => r.round === round);
  if (roundIndex === -1) {
    rounds.push({ round, points: 0, events: 0 });
    roundIndex = rounds.length - 1;
  }

  const roundScore = { ...rounds[roundIndex] };
  roundScore.points += points;
  roundScore.events += 1;
  rounds[roundIndex] = roundScore;

  fighterScore.rounds = rounds;
  fighterScore.totalPoints = rounds.reduce((sum, r) => sum + r.points, 0);

  return {
    ...scorecard,
    [fighterKey]: fighterScore,
  };
}

export function finalizeRound(scorecard: Scorecard, round: number): Scorecard {
  const fighterARound = scorecard.fighterA.rounds.find((r) => r.round === round);
  const fighterBRound = scorecard.fighterB.rounds.find((r) => r.round === round);

  if (!fighterARound || !fighterBRound) {
    return scorecard;
  }

  const winner = calculateRoundWinner({
    fighterA: fighterARound.points,
    fighterB: fighterBRound.points,
  });

  const updatedScorecard = { ...scorecard };

  if (winner === 'A') {
    updatedScorecard.fighterA = {
      ...updatedScorecard.fighterA,
      roundsWon: updatedScorecard.fighterA.roundsWon + 1,
    };
  } else if (winner === 'B') {
    updatedScorecard.fighterB = {
      ...updatedScorecard.fighterB,
      roundsWon: updatedScorecard.fighterB.roundsWon + 1,
    };
  }

  return updatedScorecard;
}
