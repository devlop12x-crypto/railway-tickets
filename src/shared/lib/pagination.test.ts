import { describe, expect, it } from 'vitest';
import { paginationRange } from './pagination';

describe('пагинация', () => {
  it('показывает все страницы, если их немного', () => {
    expect(paginationRange(1, 3)).toEqual([1, 2, 3]);
  });

  it('сворачивает середину в «…»', () => {
    expect(paginationRange(2, 10)).toEqual([1, 2, 3, 'gap', 10]);
    expect(paginationRange(6, 10)).toEqual([1, 'gap', 5, 6, 7, 'gap', 10]);
    expect(paginationRange(10, 10)).toEqual([1, 'gap', 9, 10]);
  });
});
