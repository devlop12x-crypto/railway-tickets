import { describe, expect, it } from 'vitest';
import type { CoachSet } from '../../entities/coach/coach';
import {
  changeCoachType,
  changeCounts,
  coachTotal,
  countLimits,
  createSelection,
  isComplete,
  toggleCoach,
  toggleSeat,
  toggleService,
  type DirectionSelection,
} from './model';

const COACHES: CoachSet = [
  {
    number: '12',
    prices: { upper: 2020, lower: 3030 },
    available: new Set([17, 18, 19, 20]),
    watching: 0,
    services: { ac: 'included', wifi: 'none', linens: 150, food: 'none' },
  },
  {
    number: '10',
    prices: { upper: 2020, lower: 3030 },
    available: new Set([1, 2]),
    watching: 0,
    services: { ac: 'included', wifi: 'none', linens: 150, food: 'none' },
  },
];

const start = (adults = 2, children = 1, infants = 0) =>
  createSelection({ adults, children, infants }, 'third', COACHES);

function pick(state: DirectionSelection, coach: string, seat: number) {
  const result = toggleSeat(state, { coach, seat });
  if (!result.ok) throw new Error(`Место ${seat} не выбрано`);
  return result.state;
}

describe('выбор мест: количество билетов', () => {
  it('держит не больше 5 мест на заказ и ребёнка без места на каждого взрослого', () => {
    expect(countLimits({ adults: 2, children: 1, infants: 0 })).toEqual({
      adults: 4,
      children: 3,
      infants: 2,
    });
    const state = changeCounts(start(), { adults: 1, children: 9, infants: 3 });
    expect(state.counts).toEqual({ adults: 1, children: 4, infants: 1 });
  });

  it('без взрослого заказ невозможен', () => {
    expect(changeCounts(start(), { adults: 0, children: 1, infants: 0 }).counts.adults).toBe(1);
  });

  it('при уменьшении билетов снимает последние выбранные места', () => {
    let state = start();
    state = pick(pick(pick(state, '12', 17), '12', 18), '12', 19);
    state = changeCounts(state, { adults: 2, children: 0, infants: 0 });
    expect(state.seats).toEqual([
      { coach: '12', seat: 17 },
      { coach: '12', seat: 18 },
    ]);
  });
});

describe('выбор мест: места и сумма', () => {
  it('не даёт выбрать мест больше, чем билетов, и снимает отметку повторным кликом', () => {
    let state = start(1, 1);
    state = pick(pick(state, '12', 17), '10', 2);
    expect(isComplete(state)).toBe(true);
    expect(toggleSeat(state, { coach: '12', seat: 18 })).toEqual({ ok: false, reason: 'limit' });

    state = pick(state, '12', 17);
    expect(state.seats).toEqual([{ coach: '10', seat: 2 }]);
    expect(isComplete(state)).toBe(false);
  });

  it('считает места и платные услуги на каждого пассажира с местом, как на макете', () => {
    let state = pick(pick(pick(start(), '12', 17), '12', 18), '12', 19);
    expect(coachTotal(state, COACHES, '12')).toBe(8080);

    state = toggleService(state, '12', 'linens');
    expect(coachTotal(state, COACHES, '12')).toBe(8080 + 150 * 3);
    expect(coachTotal(toggleService(state, '12', 'linens'), COACHES, '12')).toBe(8080);
  });

  it('смена типа вагона сбрасывает выбор, скрытие вагона снимает его места', () => {
    let state = toggleCoach(pick(start(), '12', 17), '10');
    state = pick(state, '10', 1);
    expect(toggleCoach(state, '10').seats).toEqual([{ coach: '12', seat: 17 }]);
    // Последнюю открытую схему скрыть нельзя
    expect(toggleCoach(createSelection(state.counts, 'third', COACHES), '12').shown).toEqual([
      '12',
    ]);

    const other = changeCoachType(state, 'second', COACHES);
    expect(other.seats).toEqual([]);
    expect(other.counts).toEqual(state.counts);
  });
});
