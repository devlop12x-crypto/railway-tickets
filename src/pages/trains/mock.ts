import type { LastTicket, TrainRoute, TripLeg } from './types';

/** Данные с макета: до подключения API (этап 4) страница показывает их */

/** Сколько направлений «найдено» на макете */
export const MOCK_TOTAL_COUNT = 20;

const MSK_SPB: TripLeg = {
  from: { time: '00:10', city: 'Москва', station: 'Курский вокзал' },
  to: { time: '09:52', city: 'Санкт-Петербург', station: 'Ладожский вокзал' },
  duration: '9 : 42',
};

const SPB_MSK: TripLeg = { ...MSK_SPB };

const ALL_AMENITIES = { wifi: true, express: true, food: true };

const FULL_SEATS: TrainRoute['seats'] = [
  { seatClass: 'fourth', count: 88, minPrice: 1920 },
  { seatClass: 'third', count: 52, minPrice: 2530 },
  { seatClass: 'second', count: 24, minPrice: 3820 },
  { seatClass: 'first', count: 15, minPrice: 4950 },
];

const route116 = (id: string): TrainRoute => ({
  id,
  trainNumber: '116С',
  origin: 'Адлер',
  fromCity: 'Москва',
  toCity: 'Санкт-Петербург',
  there: MSK_SPB,
  back: SPB_MSK,
  seats: FULL_SEATS,
  amenities: ALL_AMENITIES,
});

export const MOCK_ROUTES: TrainRoute[] = [
  route116('116-1'),
  {
    id: '020',
    trainNumber: '020У',
    fromCity: 'Москва',
    toCity: 'Санкт-Петербург',
    trainName: 'Мегаполис',
    there: {
      from: { time: '00:20', city: 'Москва', station: 'Ленинградский вокзал' },
      to: { time: '08:59', city: 'Санкт-Петербург', station: 'Московский вокзал' },
      duration: '8 : 39',
    },
    seats: [
      { seatClass: 'second', count: 90, minPrice: 3950 },
      { seatClass: 'first', count: 31, minPrice: 4950 },
    ],
    amenities: ALL_AMENITIES,
  },
  {
    id: '116-volga',
    trainNumber: '116С',
    origin: 'Нижний Новгород',
    fromCity: 'Москва',
    toCity: 'Санкт-Петербург',
    trainName: 'Волга',
    there: {
      from: { time: '00:41', city: 'Москва', station: 'Ленинградский вокзал' },
      to: { time: '09:13', city: 'Санкт-Петербург', station: 'Ладожский вокзал' },
      duration: '8 : 32',
    },
    back: {
      from: { time: '00:41', city: 'Москва', station: 'Ленинградский вокзал' },
      to: { time: '09:13', city: 'Санкт-Петербург', station: 'Ладожский вокзал' },
      duration: '8 : 32',
    },
    seats: FULL_SEATS.slice(1),
    amenities: ALL_AMENITIES,
  },
  route116('116-2'),
  route116('116-3'),
];

export const MOCK_LAST_TICKETS: LastTicket[] = [
  {
    id: 'spb-samara',
    from: { city: 'Санкт-Петербург', station: 'Курский вокзал' },
    to: { city: 'Самара', station: 'Московский вокзал' },
    minPrice: 2500,
  },
  {
    id: 'msk-kazan',
    from: { city: 'Москва', station: 'Курский вокзал' },
    to: { city: 'Казань', station: 'Московский вокзал' },
    minPrice: 3500,
  },
  {
    id: 'kazan-nn',
    from: { city: 'Казань', station: 'Курский вокзал' },
    to: { city: 'Нижний Новгород', station: 'Московский вокзал' },
    minPrice: 3800,
  },
];
