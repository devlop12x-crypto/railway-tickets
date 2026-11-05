import type { SeatClass, TripLeg } from '../trains/types';
import type { CoachSet, ServiceId, ServiceState } from './coach';

/** Данные с макетов выбора мест. Настоящие придут из API на этапе 4 */

export const SEATS_LEG: TripLeg = {
  from: { time: '00:10', city: 'Москва', station: 'Курский вокзал' },
  to: { time: '09:52', city: 'Санкт-Петербург', station: 'Ладожский вокзал' },
  duration: '9 : 42',
};

const services = (
  states: Partial<Record<ServiceId, ServiceState>>,
): Record<ServiceId, ServiceState> => ({
  ac: 'off',
  wifi: 'off',
  linens: 'off',
  food: 'off',
  ...states,
});

/** Вагоны по типам: купе — «выбор мест», плацкарт — «вариант с несколькими вагонами», остальные — свои макеты */
export const COACHES_BY_TYPE: Partial<Record<SeatClass, CoachSet>> = {
  second: {
    coachNumbers: ['07', '09'],
    coaches: [
      {
        number: '07',
        prices: { upper: 2920, lower: 3530 },
        available: new Set([1, 3, 11, 13, 15, 18, 19, 27, 30, 31, 32]),
        watching: 11,
        services: services({ linens: 'on', food: 'on' }),
      },
    ],
  },
  third: {
    coachNumbers: ['10', '12', '15'],
    coaches: [
      {
        number: '12',
        prices: { upper: 2020, lower: 3030, side: 2020 },
        available: new Set([
          1, 3, 11, 13, 15, 17, 18, 19, 20, 27, 29, 30, 31, 32, 33, 37, 39, 41, 45, 46, 47,
        ]),
        selected: new Set([17, 18, 19]),
        watching: 13,
        services: services({ linens: 'on' }),
      },
      {
        number: '10',
        prices: { upper: 2020, lower: 3030, side: 2020 },
        available: new Set([
          2, 4, 5, 9, 10, 12, 14, 16, 21, 22, 23, 24, 25, 26, 28, 29, 31, 32, 34, 36, 40, 42,
        ]),
        watching: 13,
        services: services({ linens: 'on' }),
      },
    ],
  },
  first: {
    coachNumbers: ['02', '05'],
    coaches: [
      {
        number: '02',
        prices: { single: 4920 },
        available: new Set([1, 3, 7, 8, 9, 11, 15, 16]),
        watching: 19,
        services: services({ ac: 'included', wifi: 'included', linens: 'included', food: 'on' }),
      },
    ],
  },
  fourth: {
    coachNumbers: ['20', '21', '22', '25'],
    coaches: [
      {
        number: '22',
        prices: { single: 1920 },
        available: new Set([
          1, 2, 3, 4, 9, 11, 12, 13, 14, 15, 19, 20, 27, 28, 31, 32, 33, 34, 35, 42, 43, 44, 45, 46,
          47, 49, 50, 51, 52, 54, 55, 58, 59, 62,
        ]),
        selected: new Set([11, 12, 14]),
        watching: 13,
        services: services({ wifi: 'on' }),
      },
    ],
  },
};
