import type { SeatClass } from '../trains/types';

/** Логика вагона без вёрстки: ярусы мест и цены. Пригодится и на этапах 3–4 */

export type ServiceState = 'off' | 'on' | 'included';
export type ServiceId = 'ac' | 'wifi' | 'linens' | 'food';

export interface CoachPrices {
  upper?: number;
  lower?: number;
  side?: number;
  /** Единая цена: люкс и сидячий */
  single?: number;
}

export interface CoachDetails {
  number: string;
  prices: CoachPrices;
  available: ReadonlySet<number>;
  selected?: ReadonlySet<number>;
  watching: number;
  services: Record<ServiceId, ServiceState>;
}

export interface CoachSet {
  /** Все вагоны этого типа в поезде */
  coachNumbers: string[];
  /** Вагоны, показанные на схеме */
  coaches: CoachDetails[];
}

export type SeatTier = 'upper' | 'lower' | 'side' | 'single';

/** В купе и плацкарте чётные места 1–32 верхние, нечётные нижние; с 33-го — боковые */
export function seatTier(type: SeatClass, seat: number): SeatTier {
  if (type === 'first' || type === 'fourth') return 'single';
  if (type === 'third' && seat > 32) return 'side';
  return seat % 2 === 0 ? 'upper' : 'lower';
}

export function seatPrice(type: SeatClass, prices: CoachPrices, seat: number): number {
  const tier = seatTier(type, seat);
  return (tier === 'single' ? prices.single : prices[tier]) ?? 0;
}

export function countByTier(type: SeatClass, seats: Iterable<number>): Record<SeatTier, number> {
  const result: Record<SeatTier, number> = { upper: 0, lower: 0, side: 0, single: 0 };
  for (const seat of seats) result[seatTier(type, seat)] += 1;
  return result;
}

export function totalPrice(type: SeatClass, prices: CoachPrices, seats: Iterable<number>): number {
  let sum = 0;
  for (const seat of seats) sum += seatPrice(type, prices, seat);
  return sum;
}
