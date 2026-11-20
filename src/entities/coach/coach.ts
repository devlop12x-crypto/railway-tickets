import type { SeatClass } from '../train/types';

/** Логика вагона без вёрстки: ярусы мест и цены. Пригодится и на этапах 3–4 */

export type ServiceId = 'ac' | 'wifi' | 'linens' | 'food';
/** Услуга в вагоне: цена за пассажира, «включено в стоимость» или её нет */
export type ServiceOffer = number | 'included' | 'none';
/** Состояние значка услуги по «экспликации» плюс «нет в вагоне» */
export type ServiceState = 'off' | 'on' | 'included' | 'none';

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
  watching: number;
  services: Record<ServiceId, ServiceOffer>;
}

/** Все вагоны одного типа в поезде, по порядку от головы */
export type CoachSet = readonly CoachDetails[];

export type SeatTier = 'upper' | 'lower' | 'side' | 'single';

/** В купе и плацкарте чётные места 1–32 верхние, нечётные нижние; с 33-го — боковые */
export function seatTier(type: SeatClass, seat: number): SeatTier {
  if (type === 'first' || type === 'fourth') return 'single';
  if (type === 'third' && seat > 32) return 'side';
  return seat % 2 === 0 ? 'upper' : 'lower';
}

/** Цена места по ярусу. Нет цены — место не продаётся, а не бесплатно */
export function seatPrice(type: SeatClass, prices: CoachPrices, seat: number): number | undefined {
  const tier = seatTier(type, seat);
  return tier === 'single' ? prices.single : prices[tier];
}

export function countByTier(type: SeatClass, seats: Iterable<number>): Record<SeatTier, number> {
  const result: Record<SeatTier, number> = { upper: 0, lower: 0, side: 0, single: 0 };
  for (const seat of seats) result[seatTier(type, seat)] += 1;
  return result;
}

export function totalPrice(type: SeatClass, prices: CoachPrices, seats: Iterable<number>): number {
  let sum = 0;
  for (const seat of seats) sum += seatPrice(type, prices, seat) ?? 0;
  return sum;
}

/** Место можно выбрать, если оно свободно и у его яруса есть цена */
export function isSeatOnSale(type: SeatClass, coach: CoachDetails, seat: number): boolean {
  return coach.available.has(seat) && seatPrice(type, coach.prices, seat) !== undefined;
}
