import { createAthlete, type Athlete } from '../../athlete/domain/athlete';
import type { Modality } from '~/shared/domain/models/modality';

export interface MockFightConfig {
  modalities: Modality[];
  experiences: string[];
  weightClasses: Record<string, Array<{ title: string; minWeight: number; maxWeight: number }>>;
}

export const mockAthletes: Athlete[] = Array.from({ length: 40}).map((_, idx) => createAthlete())

export class MockFightDataService {
  static async getAvailableAthletes(params: {
    eventId: string;
    modality?: string;
    experience?: string;
    weightClassMin?: number;
    weightClassMax?: number;
  }): Promise<Athlete[]> {
    await this.simulateDelay();

    let filtered = [...mockAthletes];

    if (params.modality) {
      filtered = filtered.filter((a) => a.modalities.includes(params.modality!));
    }

    if (params.experience) {
      filtered = filtered.filter((a) => a.expertises.includes(params.experience!));
    }

    if (params.weightClassMin !== undefined && params.weightClassMax !== undefined) {
      filtered = filtered.filter(
        (a) => a.weight >= params.weightClassMin! && a.weight <= params.weightClassMax!
      );
    }

    return filtered;
  }

  static async createFight(fight: any): Promise<{ id: string }> {
    await this.simulateDelay();
    return { id: Math.random().toString(36).substr(2, 9) };
  }

  static async createBatchFights(fights: any[]): Promise<{ ids: string[] }> {
    await this.simulateDelay(1000);
    return { ids: fights.map(() => Math.random().toString(36).substr(2, 9)) };
  }

  private static simulateDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
