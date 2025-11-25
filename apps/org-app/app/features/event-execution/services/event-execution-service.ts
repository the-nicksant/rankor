import type { FightChronogramItem, AthleteCheckIn } from '../domain/event-status';
import { isFightReady } from '../domain/event-status';

// Event details type
export interface EventDetails {
  eventId: string;
  name: string;
  date: Date;
  venue: string;
  city: string;
  state: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
}

// Mock data storage
let mockChronogram: FightChronogramItem[] = [];
let mockCheckIns: Map<string, AthleteCheckIn> = new Map();
let mockEventDetails: EventDetails | null = null;

export class EventExecutionService {
  private static simulateDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static async getEventDetails(eventId: string): Promise<EventDetails> {
    await this.simulateDelay();

    // Initialize mock data if empty
    if (!mockEventDetails) {
      mockEventDetails = this.generateMockEventDetails(eventId);
    }

    return mockEventDetails;
  }

  static async finishEvent(eventId: string): Promise<EventDetails> {
    await this.simulateDelay();

    if (!mockEventDetails) {
      throw new Error('Event not found');
    }

    mockEventDetails = {
      ...mockEventDetails,
      status: 'completed',
    };

    return mockEventDetails;
  }

  static async getChronogram(eventId: string): Promise<FightChronogramItem[]> {
    await this.simulateDelay();

    // Initialize mock data if empty
    if (mockChronogram.length === 0) {
      mockChronogram = this.generateMockChronogram(eventId);
    }

    return mockChronogram.map((fight) => ({
      ...fight,
      status: this.calculateFightStatus(fight),
    }));
  }

  static async updateFightOrder(
    eventId: string,
    fights: FightChronogramItem[]
  ): Promise<FightChronogramItem[]> {
    await this.simulateDelay();

    mockChronogram = fights.map((fight, index) => ({
      ...fight,
      order: index + 1,
    }));

    return mockChronogram;
  }

  static async updateFightStatus(
    eventId: string,
    fightId: string,
    status: string
  ): Promise<FightChronogramItem> {
    await this.simulateDelay();

    const fightIndex = mockChronogram.findIndex((f) => f.fightId === fightId);
    if (fightIndex === -1) {
      throw new Error('Fight not found');
    }

    mockChronogram[fightIndex] = {
      ...mockChronogram[fightIndex],
      status: status as any,
    };

    return mockChronogram[fightIndex];
  }

  static async cancelFight(
    eventId: string,
    fightId: string,
    reason?: string
  ): Promise<FightChronogramItem> {
    await this.simulateDelay();

    const fightIndex = mockChronogram.findIndex((f) => f.fightId === fightId);
    if (fightIndex === -1) {
      throw new Error('Fight not found');
    }

    mockChronogram[fightIndex] = {
      ...mockChronogram[fightIndex],
      status: 'cancelled',
    };

    return mockChronogram[fightIndex];
  }

  static async getCheckIns(eventId: string): Promise<AthleteCheckIn[]> {
    await this.simulateDelay();
    return Array.from(mockCheckIns.values());
  }

  static async checkInAthlete(eventId: string, qrCodeToken: string): Promise<AthleteCheckIn> {
    await this.simulateDelay();

    // Parse QR code token
    const [parsedEventId, fightId, athleteId] = qrCodeToken.split(':');

    if (parsedEventId !== eventId) {
      throw new Error('Invalid QR code for this event');
    }

    const checkIn: AthleteCheckIn = {
      athleteId,
      fightId,
      checkedInAt: new Date(),
      qrCodeToken,
    };

    mockCheckIns.set(athleteId, checkIn);

    // Update chronogram
    const fightIndex = mockChronogram.findIndex((f) => f.fightId === fightId);
    if (fightIndex !== -1) {
      const fight = mockChronogram[fightIndex];

      if (fight.fighterA.athleteId === athleteId) {
        fight.fighterA.checkedInAt = new Date();
      } else if (fight.fighterB.athleteId === athleteId) {
        fight.fighterB.checkedInAt = new Date();
      }

      mockChronogram[fightIndex] = fight;
    }

    return checkIn;
  }

  static async generateQRCodes(eventId: string): Promise<{ count: number }> {
    await this.simulateDelay(500);
    return { count: mockChronogram.length * 2 };
  }

  private static calculateFightStatus(fight: FightChronogramItem): any {
    // If already completed or cancelled, keep that status
    if (fight.status === 'completed' || fight.status === 'cancelled') {
      return fight.status;
    }

    // If both athletes checked in, mark as ready
    if (isFightReady(fight)) {
      return fight.status === 'in_progress' ? 'in_progress' : 'ready';
    }

    // Otherwise pending
    return 'pending';
  }

  private static generateMockEventDetails(eventId: string): EventDetails {
    return {
      eventId,
      name: 'Campeonato Regional de Artes Marciais 2025',
      date: new Date('2025-02-15T14:00:00'),
      venue: 'Arena Kombat Center',
      city: 'São Paulo',
      state: 'SP',
      status: 'in_progress',
    };
  }

  private static generateMockChronogram(eventId: string): FightChronogramItem[] {
    return [
      {
        id: '1',
        fightId: 'fight-1',
        order: 1,
        status: 'ready',
        ring: 'Ring A',
        fighterA: {
          athleteId: 'athlete-1',
          name: 'João Silva',
          nickname: 'Thunder',
          avatarUrl: undefined,
          checkedInAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min ago
          qrCodeToken: `${eventId}:fight-1:athlete-1:token1`,
        },
        fighterB: {
          athleteId: 'athlete-2',
          name: 'Pedro Santos',
          nickname: 'The Beast',
          avatarUrl: undefined,
          checkedInAt: new Date(Date.now() - 25 * 60 * 1000), // 25 min ago
          qrCodeToken: `${eventId}:fight-1:athlete-2:token2`,
        },
        modality: {
          id: '1',
          name: 'MMA',
          code: 'mma',
        },
        weightClass: {
          title: 'Peso Leve',
          minWeight: 65.8,
          maxWeight: 70.3,
        },
        experienceLevel: 'AMATEUR',
        rules: {
          numberOfRounds: 3,
          roundDuration: 1,
          intervalDuration: 60,
          scoringMethods: {
            strike_landed: 1,
            takedown: 2,
            guard_pass: 1,
            submission_attempt: 2,
            knockdown: 3,
          },
          judgingSystem: 'dominance',
        },
      },
      {
        id: '2',
        fightId: 'fight-2',
        order: 2,
        status: 'ready',
        ring: 'Ring A',
        fighterA: {
          athleteId: 'athlete-3',
          name: 'Lucas Oliveira',
          nickname: 'Pitbull',
          avatarUrl: undefined,
          checkedInAt: new Date(Date.now() - 20 * 60 * 1000),
          qrCodeToken: `${eventId}:fight-2:athlete-3:token3`,
        },
        fighterB: {
          athleteId: 'athlete-4',
          name: 'Carlos Mendes',
          nickname: 'The Lion',
          avatarUrl: undefined,
          checkedInAt: new Date(Date.now() - 30 * 60 * 1000),
          qrCodeToken: `${eventId}:fight-2:athlete-4:token4`,
        },
        modality: {
          id: '2',
          name: 'Boxing',
          code: 'boxing',
        },
        weightClass: {
          title: 'Peso Médio',
          minWeight: 66.68,
          maxWeight: 72.57,
        },
        experienceLevel: 'AMATEUR',
        rules: {
          numberOfRounds: 5,
          roundDuration: 3,
          intervalDuration: 1,
          scoringMethods: {
            jab: 1,
            power_punch: 2,
            knockdown: 4,
            body_shot: 1,
          },
          judgingSystem: 'dominance',
        },
      },
      {
        id: '3',
        fightId: 'fight-3',
        order: 3,
        status: 'pending',
        ring: 'Ring B',
        fighterA: {
          athleteId: 'athlete-5',
          name: 'Rafael Costa',
          nickname: 'Gladiator',
          avatarUrl: undefined,
          checkedInAt: null,
          qrCodeToken: `${eventId}:fight-3:athlete-5:token5`,
        },
        fighterB: {
          athleteId: 'athlete-6',
          name: 'Bruno Ferreira',
          nickname: 'Warrior',
          avatarUrl: undefined,
          checkedInAt: null,
          qrCodeToken: `${eventId}:fight-3:athlete-6:token6`,
        },
        modality: {
          id: '3',
          name: 'Muay Thai',
          code: 'muay_thai',
        },
        weightClass: {
          title: 'Peso Leve',
          minWeight: 65.77,
          maxWeight: 70.31,
        },
        experienceLevel: 'AMATEUR',
        rules: {
          numberOfRounds: 3,
          roundDuration: 5,
          intervalDuration: 1,
          scoringMethods: {
            punch: 1,
            kick: 2,
            knee: 2,
            elbow: 3,
            clinch_strike: 1,
            knockdown: 4,
          },
          judgingSystem: 'cumulative',
        },
      },
      {
        id: '4',
        fightId: 'fight-4',
        order: 4,
        status: 'completed',
        ring: 'Ring A',
        fighterA: {
          athleteId: 'athlete-7',
          name: 'Fernando Alves',
          nickname: 'Sniper',
          avatarUrl: undefined,
          checkedInAt: new Date(Date.now() - 90 * 60 * 1000), // 90 min ago
          qrCodeToken: `${eventId}:fight-4:athlete-7:token7`,
        },
        fighterB: {
          athleteId: 'athlete-8',
          name: 'Marcos Lima',
          nickname: 'The Tank',
          avatarUrl: undefined,
          checkedInAt: new Date(Date.now() - 85 * 60 * 1000), // 85 min ago
          qrCodeToken: `${eventId}:fight-4:athlete-8:token8`,
        },
        modality: {
          id: '2',
          name: 'Boxing',
          code: 'boxing',
        },
        weightClass: {
          title: 'Peso Pesado',
          minWeight: 90.72,
          maxWeight: null,
        },
        experienceLevel: 'PRO',
        rules: {
          numberOfRounds: 5,
          roundDuration: 3,
          intervalDuration: 1,
          scoringMethods: {
            jab: 1,
            power_punch: 2,
            knockdown: 4,
            body_shot: 1,
          },
          judgingSystem: 'dominance',
        },
        result: {
          winner: 'A',
          method: 'knockout',
       
  
          
        },
      },
      {
        id: '5',
        fightId: 'fight-5',
        order: 5,
        status: 'completed',
        ring: 'Ring B',
        fighterA: {
          athleteId: 'athlete-9',
          name: 'André Costa',
          nickname: 'Spider',
          avatarUrl: undefined,
          checkedInAt: new Date(Date.now() - 120 * 60 * 1000), // 2h ago
          qrCodeToken: `${eventId}:fight-5:athlete-9:token9`,
        },
        fighterB: {
          athleteId: 'athlete-10',
          name: 'Gabriel Souza',
          nickname: 'The Panther',
          avatarUrl: undefined,
          checkedInAt: new Date(Date.now() - 115 * 60 * 1000), // 2h ago
          qrCodeToken: `${eventId}:fight-5:athlete-10:token10`,
        },
        modality: {
          id: '1',
          name: 'MMA',
          code: 'mma',
        },
        weightClass: {
          title: 'Peso Meio-Médio',
          minWeight: 70.31,
          maxWeight: 77.11,
        },
        experienceLevel: 'AMATEUR',
        rules: {
          numberOfRounds: 3,
          roundDuration: 5,
          intervalDuration: 1,
          scoringMethods: {
            strike_landed: 1,
            takedown: 2,
            guard_pass: 1,
            submission_attempt: 2,
            knockdown: 3,
          },
          judgingSystem: 'cumulative',
        },
        result: {
          winnerFighter: 'athlete-9',
          method: 'submission',
          round: 2,
          time: '4:12',
          notes: 'Finalização por triângulo',
        },
      },
    ];
  }
}
