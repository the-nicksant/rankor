export type EventStatus = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';

export type FightStatus =
  | 'pending'      // Not ready (missing athletes)
  | 'ready'        // Both athletes checked in
  | 'upcoming'     // Next in line
  | 'in_progress'  // Currently fighting
  | 'completed'    // Finished
  | 'cancelled';   // Cancelled

export interface AthleteCheckIn {
  athleteId: string;
  fightId: string;
  checkedInAt: Date | null;
  qrCodeToken: string;
}

export interface EventExecutionMetrics {
  totalAthletes: number;
  checkedInAthletes: number;
  totalFights: number;
  readyFights: number;
  inProgressFights: number;
  completedFights: number;
  upcomingFights: number;
  pendingFights: number;
}

export function calculateMetrics(fights: FightChronogramItem[]): EventExecutionMetrics {
  const totalFights = fights.length;
  const readyFights = fights.filter((f) => f.status === 'ready').length;
  const inProgressFights = fights.filter((f) => f.status === 'in_progress').length;
  const completedFights = fights.filter((f) => f.status === 'completed').length;
  const upcomingFights = fights.filter((f) => f.status === 'upcoming').length;
  const pendingFights = fights.filter((f) => f.status === 'pending').length;

  const athleteIds = new Set<string>();
  const checkedInAthleteIds = new Set<string>();

  fights.forEach((fight) => {
    athleteIds.add(fight.fighterA.athleteId);
    athleteIds.add(fight.fighterB.athleteId);

    if (fight.fighterA.checkedInAt) {
      checkedInAthleteIds.add(fight.fighterA.athleteId);
    }
    if (fight.fighterB.checkedInAt) {
      checkedInAthleteIds.add(fight.fighterB.athleteId);
    }
  });

  return {
    totalAthletes: athleteIds.size,
    checkedInAthletes: checkedInAthleteIds.size,
    totalFights,
    readyFights,
    inProgressFights,
    completedFights,
    upcomingFights,
    pendingFights,
  };
}

export interface FightChronogramItem {
  id: string;
  fightId: string;
  order: number;
  status: FightStatus;
  ring?: string; // For simultaneous fights

  // Timing
  estimatedStartTime?: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;

  // Athletes
  fighterA: {
    athleteId: string;
    name: string;
    nickname: string;
    avatarUrl?: string;
    checkedInAt: Date | null;
    qrCodeToken: string;
  };
  fighterB: {
    athleteId: string;
    name: string;
    nickname: string;
    avatarUrl?: string;
    checkedInAt: Date | null;
    qrCodeToken: string;
  };

  // Fight configuration
  modality: {
    id: string;
    name: string;
    code: string;
  };
  weightClass: {
    title: string;
    minWeight: number;
    maxWeight: number;
  };
  experienceLevel: string;
  rules: {
    numberOfRounds: number;
    roundDuration: number;
    intervalDuration: number;
    scoringMethods: Record<string, number>;
    judgingSystem: 'cumulative' | 'dominance';
  };

  // Result (if completed)
  result?: {
    winner: 'A' | 'B' | 'draw';
    method: string;
    endedAt: Date;
    scorecard?: any;
  };
}

export function isFightReady(fight: FightChronogramItem): boolean {
  return Boolean(fight.fighterA.checkedInAt && fight.fighterB.checkedInAt);
}

export function canStartFight(fight: FightChronogramItem): boolean {
  return fight.status === 'ready' || fight.status === 'upcoming';
}
