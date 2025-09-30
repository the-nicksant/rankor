export interface Modality {
  id: string;
  name: string;
  code: string;
  config: Config;
}

interface Config {
  defaultWeightClasses: DefaultWeightClass[];
  scoringMethods: Record<string, number>;
  winMethods: string[];
}

interface DefaultWeightClass {
  maxWeight: number;
  minWeight: number;
  title: string;
}