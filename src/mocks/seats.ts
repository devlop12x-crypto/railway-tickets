import type { SeatClass, TripLeg } from '../entities/train/types';
import type { CoachDetails, CoachSet, ServiceId, ServiceOffer } from '../entities/coach/coach';

/** Данные с макетов выбора мест. Настоящие придут из API на этапе 4 */

export const SEATS_LEG: TripLeg = {
  from: { time: '00:10', city: 'Москва', station: 'Курский вокзал' },
  to: { time: '09:52', city: 'Санкт-Петербург', station: 'Ладожский вокзал' },
  duration: '9 : 42',
};

const services = (
  offers: Partial<Record<ServiceId, ServiceOffer>>,
): Record<ServiceId, ServiceOffer> => ({
  ac: 'included',
  wifi: 'none',
  linens: 150,
  food: 'none',
  ...offers,
});

/** Свободные места вагона, которого нет на макетах: каждое третье из всех мест */
const everyThird = (total: number, shift: number) =>
  new Set(Array.from({ length: total }, (_, index) => index + 1).filter((n) => n % 3 === shift));

const coach = (
  number: string,
  details: Omit<CoachDetails, 'number' | 'watching'> & { watching?: number },
): CoachDetails => ({ number, watching: 13, ...details });

/**
 * Вагоны по типам. Первые в каждом списке — с макетов: купе — «выбор мест»,
 * плацкарт — «вариант с несколькими вагонами», люкс и сидячий — свои макеты
 */
export const COACHES_BY_TYPE: Record<SeatClass, CoachSet> = {
  second: [
    coach('07', {
      prices: { upper: 2920, lower: 3530 },
      available: new Set([1, 3, 11, 13, 15, 18, 19, 27, 30, 31, 32]),
      watching: 11,
      services: services({ wifi: 200, food: 350 }),
    }),
    coach('09', {
      prices: { upper: 2920, lower: 3530 },
      available: everyThird(32, 1),
      services: services({ wifi: 200, food: 350 }),
    }),
  ],
  third: [
    coach('12', {
      prices: { upper: 2020, lower: 3030, side: 2020 },
      available: new Set([
        1, 3, 11, 13, 15, 17, 18, 19, 20, 27, 29, 30, 31, 32, 33, 37, 39, 41, 45, 46, 47,
      ]),
      services: services({ ac: 'none' }),
    }),
    coach('10', {
      prices: { upper: 2020, lower: 3030, side: 2020 },
      available: new Set([
        2, 4, 5, 9, 10, 12, 14, 16, 21, 22, 23, 24, 25, 26, 28, 29, 31, 32, 34, 36, 40, 42,
      ]),
      services: services({ ac: 'none' }),
    }),
    coach('15', {
      prices: { upper: 2020, lower: 3030, side: 2020 },
      available: everyThird(48, 0),
      services: services({ ac: 'none' }),
    }),
  ],
  first: [
    coach('02', {
      prices: { single: 4920 },
      available: new Set([1, 3, 7, 8, 9, 11, 15, 16]),
      watching: 19,
      services: services({ wifi: 'included', linens: 'included', food: 500 }),
    }),
    coach('05', {
      prices: { single: 4920 },
      available: everyThird(16, 2),
      services: services({ wifi: 'included', linens: 'included', food: 500 }),
    }),
  ],
  fourth: [
    coach('22', {
      prices: { single: 1920 },
      available: new Set([
        1, 2, 3, 4, 9, 11, 12, 13, 14, 15, 19, 20, 27, 28, 31, 32, 33, 34, 35, 42, 43, 44, 45, 46,
        47, 49, 50, 51, 52, 54, 55, 58, 59, 62,
      ]),
      services: services({ wifi: 150, linens: 'none' }),
    }),
    ...['20', '21', '25'].map((number, index) =>
      coach(number, {
        prices: { single: 1920 },
        available: everyThird(62, index),
        services: services({ wifi: 150, linens: 'none' }),
      }),
    ),
  ],
};

/** Поезд на макете выбора мест */
export const SEATS_TRAIN = {
  trainNumber: '116С',
  origin: 'Адлер',
  fromCity: 'Москва',
  toCity: 'Санкт-Петербург',
  leg: SEATS_LEG,
  durationText: '9 часов\n42 минуты',
};
