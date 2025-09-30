export interface Event {
  id: string;
  about?: string
  name: string;
  description: string;
  date: Date;
  address: Address;
  organization: Organization;
  bannerUrl: string;
  modalitiesConfig: ModalitiesConfig;
  subscriptionConfig: SubscriptionConfig;
  sponsors?: Sponsor[] | null;
  website?: string
}

interface ModalitiesConfig {
  [modality: string]: {
    experience: string[]
    weightclasses: {maxWeight: number, minWeight: number, title: string}[]
  }
}

interface SubscriptionConfig {
  startSubscription: Date
  endSubscription: Date
  maxSubscriptions: number
}

interface Sponsor {
  id: string
  name: string
  logo?: string
}

interface Organization {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface Address {
  street: string;
  district: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}