import type { SeatClass, TrainRoute } from '../../entities/train/types';
import type { Range } from '../../shared/ui/RangeSlider';

export interface TimeFilter {
  departure: Range;
  arrival: Range;
}

export interface TrainFilters {
  /** «ДД.ММ.ГГГГ» или пусто */
  dateThere: string;
  dateBack: string;
  /** Включённый класс — показывать только поезда с таким вагоном; все выключены — без ограничения */
  classes: Record<SeatClass, boolean>;
  wifi: boolean;
  express: boolean;
  price: Range;
  there: TimeFilter;
  back: TimeFilter;
}

export const FULL_DAY: Range = [0, 24];
export const PRICE_BOUNDS: Range = [0, 10000];

export function createFilters(price: Range = PRICE_BOUNDS): TrainFilters {
  return {
    dateThere: '',
    dateBack: '',
    classes: { first: false, second: false, third: false, fourth: false },
    wifi: false,
    express: false,
    price,
    there: { departure: FULL_DAY, arrival: FULL_DAY },
    back: { departure: FULL_DAY, arrival: FULL_DAY },
  };
}

export type SortKey = 'date' | 'price' | 'duration';

/** «09:52» → 9.87 часа */
const hours = (time: string) => {
  const [h = 0, m = 0] = time.split(':').map(Number);
  return h + m / 60;
};

/** «9 : 42» → 582 минуты */
const minutes = (duration: string) => {
  const [h = 0, m = 0] = duration.split(':').map((part) => Number(part.trim()));
  return h * 60 + m;
};

export const minPrice = (route: TrainRoute) =>
  Math.min(...route.seats.map((seat) => seat.minPrice));

const inRange = (value: number, [from, to]: Range) => value >= from && value <= to;

/**
 * Отбор направлений по фильтрам. На этапе 4 те же условия уйдут в запрос
 * /routes (have_second_class, price_from, start_departure_hour_from…), а здесь останется модель.
 */
export function filterRoutes(routes: readonly TrainRoute[], filters: TrainFilters): TrainRoute[] {
  const wanted = (Object.keys(filters.classes) as SeatClass[]).filter(
    (key) => filters.classes[key],
  );

  return routes.filter((route) => {
    if (wanted.length && !wanted.every((cls) => route.seats.some((s) => s.seatClass === cls))) {
      return false;
    }
    if (filters.wifi && !route.amenities.wifi) return false;
    if (filters.express && !route.amenities.express) return false;
    if (!inRange(minPrice(route), filters.price)) return false;
    if (!inRange(hours(route.there.from.time), filters.there.departure)) return false;
    if (!inRange(hours(route.there.to.time), filters.there.arrival)) return false;
    if (route.back) {
      if (!inRange(hours(route.back.from.time), filters.back.departure)) return false;
      if (!inRange(hours(route.back.to.time), filters.back.arrival)) return false;
    }
    return true;
  });
}

const SORTERS: Record<SortKey, (route: TrainRoute) => number> = {
  date: (route) => hours(route.there.from.time),
  price: minPrice,
  duration: (route) => minutes(route.there.duration),
};

export function sortRoutes(routes: readonly TrainRoute[], key: SortKey): TrainRoute[] {
  const value = SORTERS[key];
  return [...routes].sort((a, b) => value(a) - value(b));
}

/** Границы шкалы цены по данным: от самой дешёвой до самой дорогой минимальной цены */
export function priceBounds(routes: readonly TrainRoute[]): Range {
  const prices = routes.map(minPrice);
  if (!prices.length) return PRICE_BOUNDS;
  const all = routes.flatMap((route) => route.seats.map((seat) => seat.minPrice));
  return [Math.min(...prices), Math.max(...all)];
}
