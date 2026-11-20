import type { PassengerDraft } from '../features/passenger-form/PassengerCard';

/** Пассажиры с макета: взрослая Ирина и ребёнок Кирилл, третий — свёрнут */
export const MOCK_PASSENGERS: PassengerDraft[] = [
  {
    type: 'adult',
    lastName: 'Мартынюк',
    firstName: 'Ирина',
    patronymic: 'Эдуардовна',
    gender: 'female',
    birthDate: '',
    limitedMobility: false,
    document: 'passport',
    series: '',
    number: '',
  },
  {
    type: 'child',
    lastName: '',
    firstName: '',
    patronymic: '',
    gender: 'male',
    birthDate: '',
    limitedMobility: false,
    document: 'birth',
    series: '',
    number: '',
  },
];
