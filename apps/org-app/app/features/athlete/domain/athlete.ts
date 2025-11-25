import { fakerPT_BR as faker } from '@faker-js/faker'
import { Experience } from './experience';

export interface Athlete {
  id: string
  avatarUrl?: string;
  firstname: string;
  lastname: string;
  nickname: string;
  birthdate: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  document: string;
  email: string;
  weight: number;
  height: number;
  modalities: string[];
  expertises: string[];
}

// Common athletic modalities and expertises
const athleticModalities = [
  "kickboxing", "muay_thai", "jiu_jitsu", "mma", "boxing"
]

const athleticExpertises = [
  "KIDS", "AMATEUR", "SEMIPRO", "PRO"
]

export const createAthlete = (): Athlete => {
  const firstname = faker.person.firstName()
  const lastname = faker.person.lastName()
  const nickname = faker.helpers.arrayElement(['Trovão', 'Relampago', 'Marreta', 'Puro Osso', 'Pedreiro', 'Linguiça', 'Torresmo', 'Fantasma', 'Pesadelo', 'Goldenboy', 'Silverboy', 'Hancock', 'Pretin', 'Pelé', 'Superman', 'Superboy', 'Larica', 'Fumante'])
  
  return {
    id: faker.string.uuid(),
    firstname,
    lastname,
    nickname,
    birthdate: faker.date.birthdate({ min: 18, max: 45, mode: 'age' }).toISOString().split('T')[0],
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    phone: faker.phone.number(),
    document: faker.string.numeric(9),
    email: faker.internet.email({ firstName: firstname, lastName: lastname }),
    weight: faker.number.float({ min: 50, max: 120, fractionDigits: 1 }),
    height: faker.number.int({ min: 150, max: 200 }),
    modalities: [athleticModalities[0], athleticModalities[1]],
    expertises: [Experience.PRO, Experience.SEMIPRO]
  }
}