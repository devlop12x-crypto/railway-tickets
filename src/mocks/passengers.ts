import { createPassenger, type PassengerDraft } from '../features/passenger-form/model';

/** Пассажиры с макетов: Ирина заполнена, у Кирилла не хватает свидетельства, третий пуст */
export const MOCK_PASSENGERS: PassengerDraft[] = [
  {
    ...createPassenger('adult'),
    lastName: 'Мартынюк',
    firstName: 'Ирина',
    patronymic: 'Эдуардовна',
    gender: 'female',
    birthDate: '17.02.1985',
    series: '4204',
    number: '380694',
  },
  {
    ...createPassenger('child'),
    lastName: 'Мартынюк',
    firstName: 'Кирилл',
    patronymic: 'Сергеевич',
    gender: 'male',
    birthDate: '25.01.2020',
  },
  createPassenger('adult'),
];
