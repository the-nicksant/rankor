import crypto from 'crypto'
import { faker } from '@faker-js/faker'

export interface Athlete {
  id: string
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
  const nickname = faker.person.firstName().slice(0, 3).toUpperCase()
  
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
    modalities: faker.helpers.arrayElements(athleticModalities, { min: 2, max: 5 }),
    expertises: faker.helpers.arrayElements(athleticExpertises, { min: 2, max: 4 })
  }
}