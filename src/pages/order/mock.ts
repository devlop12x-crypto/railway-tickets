import type { TripDetailsData } from './TripDetails';

/** Детали поездки с макетов пассажиров и оплаты. Настоящие — из заказа на этапе 4 */
export const MOCK_TRIP_DETAILS: TripDetailsData = {
  there: {
    date: '30.08.2018',
    trainNumber: '116С',
    trainRoute: ['Адлер', 'Санкт-Петербург'],
    duration: '9 : 42',
    from: { time: '00:10', date: '30.08.2018', city: 'Москва', station: 'Курский вокзал' },
    to: { time: '09:52', date: '31.08.2018', city: 'Санкт-Петербург', station: 'Ладожский вокзал' },
  },
  back: {
    date: '09.09.2018',
    trainNumber: '116С',
    trainRoute: ['Адлер', 'Санкт-Петербург'],
    duration: '9 : 42',
    from: { time: '00:10', date: '09.09.2018', city: 'Москва', station: 'Курский вокзал' },
    to: { time: '09:52', date: '08.09.2018', city: 'Санкт-Петербург', station: 'Ладожский вокзал' },
  },
  passengers: [
    { label: '2 Взрослых', price: 5840 },
    { label: '1 Ребенок', price: 1920 },
  ],
  total: 7760,
};
