/**
 * Модель карточки поезда для отображения. На этапе 4 ответ API (/routes)
 * будет приводиться к этой форме, а компоненты останутся прежними.
 */

/** Классы вагонов по API: first — люкс, second — купе, third — плацкарт, fourth — сидячий */
export type SeatClass = 'first' | 'second' | 'third' | 'fourth';

export const SEAT_CLASS_LABELS: Record<SeatClass, string> = {
  fourth: 'Сидячий',
  third: 'Плацкарт',
  second: 'Купе',
  first: 'Люкс',
};

export interface TripPoint {
  time: string;
  city: string;
  station: string;
}

export interface TripLeg {
  from: TripPoint;
  to: TripPoint;
  /** Время в пути, «9 : 42» */
  duration: string;
}

export interface TrainRoute {
  id: string;
  trainNumber: string;
  /** Откуда идёт поезд, если раньше города отправления пассажира */
  origin?: string;
  fromCity: string;
  toCity: string;
  /** Фирменное название поезда, «Мегаполис» */
  trainName?: string;
  there: TripLeg;
  back?: TripLeg;
  seats: { seatClass: SeatClass; count: number; minPrice: number }[];
  amenities: { wifi: boolean; express: boolean; food: boolean };
}

export interface LastTicket {
  id: string;
  from: { city: string; station: string };
  to: { city: string; station: string };
  minPrice: number;
}
