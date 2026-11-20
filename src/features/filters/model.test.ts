import { describe, expect, it } from 'vitest';
import type { TrainRoute } from '../../entities/train/types';
import { createFilters, filterRoutes, priceBounds, sortRoutes } from './model';

const route = (id: string, patch: Partial<TrainRoute>): TrainRoute => ({
  id,
  trainNumber: id,
  fromCity: 'Москва',
  toCity: 'Санкт-Петербург',
  there: {
    from: { time: '00:10', city: 'Москва', station: '' },
    to: { time: '09:52', city: 'Санкт-Петербург', station: '' },
    duration: '9 : 42',
  },
  seats: [{ seatClass: 'second', count: 10, minPrice: 3000 }],
  amenities: { wifi: false, express: false, food: false },
  ...patch,
});

const cheapLate = route('a', {
  seats: [{ seatClass: 'fourth', count: 5, minPrice: 1500 }],
  there: {
    from: { time: '18:00', city: '', station: '' },
    to: { time: '23:00', city: '', station: '' },
    duration: '5 : 00',
  },
});
const coupeWifi = route('b', { amenities: { wifi: true, express: false, food: false } });

describe('фильтры направлений', () => {
  const bounds = priceBounds([cheapLate, coupeWifi]);

  it('без включённых фильтров показывает всё', () => {
    expect(filterRoutes([cheapLate, coupeWifi], createFilters(bounds))).toHaveLength(2);
  });

  it('отбирает по классу вагона и удобствам', () => {
    const filters = createFilters(bounds);
    filters.classes.second = true;
    expect(filterRoutes([cheapLate, coupeWifi], filters).map((r) => r.id)).toEqual(['b']);

    const wifiOnly = { ...createFilters(bounds), wifi: true };
    expect(filterRoutes([cheapLate, coupeWifi], wifiOnly).map((r) => r.id)).toEqual(['b']);
  });

  it('отбирает по цене и времени отправления', () => {
    const cheap = { ...createFilters(bounds), price: [1000, 2000] as const };
    expect(filterRoutes([cheapLate, coupeWifi], cheap).map((r) => r.id)).toEqual(['a']);

    const night = createFilters(bounds);
    night.there = { departure: [0, 6], arrival: [0, 24] };
    expect(filterRoutes([cheapLate, coupeWifi], night).map((r) => r.id)).toEqual(['b']);
  });

  it('сортирует по времени, цене и длительности', () => {
    expect(sortRoutes([cheapLate, coupeWifi], 'date').map((r) => r.id)).toEqual(['b', 'a']);
    expect(sortRoutes([coupeWifi, cheapLate], 'price').map((r) => r.id)).toEqual(['a', 'b']);
    expect(sortRoutes([coupeWifi, cheapLate], 'duration').map((r) => r.id)).toEqual(['a', 'b']);
  });
});
