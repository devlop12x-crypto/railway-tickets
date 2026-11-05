import { describe, expect, it } from 'vitest';
import { countByTier, seatTier, totalPrice } from './coach';

describe('логика вагона', () => {
  it('определяет ярус места по типу вагона', () => {
    expect(seatTier('second', 18)).toBe('upper');
    expect(seatTier('second', 17)).toBe('lower');
    expect(seatTier('third', 34)).toBe('side');
    expect(seatTier('first', 3)).toBe('single');
  });

  it('считает места по ярусам', () => {
    expect(countByTier('third', [1, 2, 3, 40])).toEqual({ upper: 1, lower: 2, side: 1, single: 0 });
  });

  it('суммирует стоимость выбранных мест, как на макете (8 080 и 5 760)', () => {
    expect(totalPrice('third', { upper: 2020, lower: 3030 }, [17, 18, 19])).toBe(8080);
    expect(totalPrice('fourth', { single: 1920 }, [11, 12, 14])).toBe(5760);
  });
});
