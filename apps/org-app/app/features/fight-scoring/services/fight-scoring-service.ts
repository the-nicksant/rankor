import type { FightState, FightEvent, FightResult } from '../domain/fight-state';
import {
  createInitialFightState,
  addPointsToFighter,
  finalizeRound,
  calculateFightWinner,
} from '../domain/fight-state';

// Mock data storage
const mockFightStates: Map<string, FightState> = new Map();

export class FightScoringService {
  private static simulateDelay(ms: number = 200): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getFightState(fightId: string): Promise<FightState> {
    await this.simulateDelay();

    if (!mockFightStates.has(fightId)) {
      // Initialize with default config
      const initialState = createInitialFightState(fightId, 3, 5, 1, 'cumulative');
      mockFightStates.set(fightId, initialState);
    }

    return mockFightStates.get(fightId)!;
  }

  static async startFight(fightId: string): Promise<FightState> {
    await this.simulateDelay();

    const state = await this.getFightState(fightId);

    const updatedState: FightState = {
      ...state,
      phase: 'in_progress',
      currentRound: 1,
      startedAt: new Date(),
      events: [
        ...state.events,
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          round: 1,
          timeInRound: 0,
          type: 'fight_start',
          fighter: 'A',
        },
      ],
    };

    mockFightStates.set(fightId, updatedState);
    return updatedState;
  }

  static async startRound(fightId: string): Promise<FightState> {
    await this.simulateDelay();

    const state = await this.getFightState(fightId);

    const updatedState: FightState = {
      ...state,
      timerPhase: 'round_active',
      events: [
        ...state.events,
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          round: state.currentRound,
          timeInRound: 0,
          type: 'round_start',
          fighter: 'A',
        },
      ],
    };

    mockFightStates.set(fightId, updatedState);
    return updatedState;
  }

  static async endRound(fightId: string): Promise<FightState> {
    await this.simulateDelay();

    const state = await this.getFightState(fightId);

    // Finalize round scores
    const updatedScorecard = finalizeRound(state.scorecard, state.currentRound);

    const isLastRound = state.currentRound >= state.totalRounds;

    const updatedState: FightState = {
      ...state,
      scorecard: updatedScorecard,
      timerPhase: isLastRound ? 'finished' : 'interval',
      currentRound: isLastRound ? state.currentRound : state.currentRound + 1,
      events: [
        ...state.events,
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          round: state.currentRound,
          timeInRound: state.roundTimeRemaining,
          type: 'round_end',
          fighter: 'A',
        },
      ],
    };

    mockFightStates.set(fightId, updatedState);
    return updatedState;
  }

  static async recordPoints(
    fightId: string,
    fighter: 'A' | 'B',
    action: string,
    points: number
  ): Promise<FightState> {
    await this.simulateDelay(100);

    const state = await this.getFightState(fightId);

    const updatedScorecard = addPointsToFighter(
      state.scorecard,
      fighter,
      state.currentRound,
      points
    );

    const event: FightEvent = {
      id: Date.now().toString(),
      timestamp: new Date(),
      round: state.currentRound,
      timeInRound: state.roundTimeRemaining,
      type: 'point_scored',
      fighter,
      action,
      points,
    };

    const updatedState: FightState = {
      ...state,
      scorecard: updatedScorecard,
      events: [...state.events, event],
    };

    mockFightStates.set(fightId, updatedState);
    return updatedState;
  }

  static async endFight(fightId: string, result: FightResult): Promise<FightState> {
    await this.simulateDelay();

    const state = await this.getFightState(fightId);

    const updatedState: FightState = {
      ...state,
      phase: 'finished',
      timerPhase: 'finished',
      finishedAt: new Date(),
      events: [
        ...state.events,
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          round: state.currentRound,
          timeInRound: state.roundTimeRemaining,
          type: 'fight_end',
          fighter: result.winner === 'draw' ? 'A' : result.winner,
          note: `Winner: ${result.winner} by ${result.method}`,
        },
      ],
    };

    mockFightStates.set(fightId, updatedState);
    return updatedState;
  }

  static async pauseFight(fightId: string, reason?: string): Promise<FightState> {
    await this.simulateDelay();

    const state = await this.getFightState(fightId);

    const updatedState: FightState = {
      ...state,
      phase: 'paused',
      pausedAt: new Date(),
      events: [
        ...state.events,
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          round: state.currentRound,
          timeInRound: state.roundTimeRemaining,
          type: 'pause',
          fighter: 'A',
          note: reason,
        },
      ],
    };

    mockFightStates.set(fightId, updatedState);
    return updatedState;
  }

  static async resumeFight(fightId: string): Promise<FightState> {
    await this.simulateDelay();

    const state = await this.getFightState(fightId);

    const updatedState: FightState = {
      ...state,
      phase: 'in_progress',
      pausedAt: undefined,
      events: [
        ...state.events,
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          round: state.currentRound,
          timeInRound: state.roundTimeRemaining,
          type: 'resume',
          fighter: 'A',
        },
      ],
    };

    mockFightStates.set(fightId, updatedState);
    return updatedState;
  }

  static async deleteEvent(fightId: string, eventId: string): Promise<FightState> {
    await this.simulateDelay();

    const state = await this.getFightState(fightId);

    // Find the event to delete
    const eventToDelete = state.events.find((e) => e.id === eventId);
    if (!eventToDelete || eventToDelete.type !== 'point_scored') {
      throw new Error('Cannot delete this event');
    }

    // Remove the event
    const updatedEvents = state.events.filter((e) => e.id !== eventId);

    // Recalculate scorecard by replaying all point events
    let updatedScorecard = {
      ...state.scorecard,
      fighterA: { rounds: [], totalPoints: 0, roundsWon: 0 },
      fighterB: { rounds: [], totalPoints: 0, roundsWon: 0 },
    };

    updatedEvents
      .filter((e) => e.type === 'point_scored')
      .forEach((e) => {
        if (e.points) {
          updatedScorecard = addPointsToFighter(
            updatedScorecard,
            e.fighter,
            e.round,
            e.points
          );
        }
      });

    const updatedState: FightState = {
      ...state,
      scorecard: updatedScorecard,
      events: updatedEvents,
    };

    mockFightStates.set(fightId, updatedState);
    return updatedState;
  }
}
