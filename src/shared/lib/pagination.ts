export type PageItem = number | 'gap';

/**
 * Номера для пагинации: первая, последняя, текущая с соседями, остальное — «…».
 * 10 страниц, текущая 2 → 1 2 3 … 10 (как в «экспликации»).
 */
export function paginationRange(current: number, total: number, siblings = 1): PageItem[] {
  if (total <= 5 + siblings * 2) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);
  const items: PageItem[] = [1];

  if (start > 2) items.push('gap');
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < total - 1) items.push('gap');
  items.push(total);

  return items;
}
