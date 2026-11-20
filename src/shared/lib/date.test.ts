import { describe, expect, it } from 'vitest';
import { compareDays, formatDate, maskDate, monthGrid, parseDate } from './date';

describe('даты', () => {
  it('разбирает ДД.ММ.ГГГГ и отбрасывает несуществующие даты', () => {
    expect(parseDate('30.08.2018')).toEqual(new Date(2018, 7, 30));
    expect(parseDate('30/08/2018')).toEqual(new Date(2018, 7, 30));
    expect(parseDate('31.02.2018')).toBeNull();
    expect(parseDate('3.8.2018')).toBeNull();
  });

  it('форматирует обратно и маскирует ввод', () => {
    expect(formatDate(new Date(2018, 7, 3))).toBe('03.08.2018');
    expect(maskDate('30082018')).toBe('30.08.2018');
    expect(maskDate('30a0')).toBe('30.0');
  });

  it('сравнивает по дню, без учёта времени', () => {
    expect(compareDays(new Date(2018, 7, 30, 23), new Date(2018, 7, 30, 1))).toBe(0);
    expect(compareDays(new Date(2018, 7, 29), new Date(2018, 7, 30))).toBe(-1);
  });

  it('строит сетку месяца с понедельника, как на макете (август 2018)', () => {
    const weeks = monthGrid(new Date(2018, 7, 1));
    const days = weeks.map((week) => week.map(({ date }) => date.getDate()));

    expect(days[0]).toEqual([30, 31, 1, 2, 3, 4, 5]);
    expect(days.at(-1)).toEqual([27, 28, 29, 30, 31, 1, 2]);
    expect(weeks[0]?.[0]?.outside).toBe(true);
  });
});
