import { describe, expect, it } from 'vitest';
import { plural } from './plural';

const SEATS = ['место', 'места', 'мест'] as const;

describe('plural', () => {
  it('выбирает форму по правилам русского языка', () => {
    expect([1, 2, 5, 11, 21, 22, 25].map((n) => plural(n, SEATS))).toEqual([
      'место',
      'места',
      'мест',
      'мест',
      'место',
      'места',
      'мест',
    ]);
  });
});
