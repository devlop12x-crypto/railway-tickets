import { seatPrice, type CoachSet, type ServiceId } from '../../entities/coach/coach';
import type { SeatClass } from '../../entities/train/types';

/** Логика выбора мест в одном направлении без вёрстки */

export interface TicketCounts {
  adults: number;
  children: number;
  /** Дети до 5 лет без своего места — едут со взрослым */
  infants: number;
}

/** Билетов с местом в одном заказе: взрослые и дети вместе */
export const MAX_TICKETS = 5;

export interface SeatRef {
  coach: string;
  seat: number;
}

export interface DirectionSelection {
  counts: TicketCounts;
  coachType?: SeatClass | undefined;
  /** Номера вагонов, схемы которых открыты */
  shown: readonly string[];
  /** Выбранные места в порядке выбора: при уменьшении билетов снимаются последние */
  seats: readonly SeatRef[];
  /** Дополнительные услуги по номеру вагона */
  services: Readonly<Record<string, readonly ServiceId[]>>;
}

export function createSelection(
  counts: TicketCounts,
  coachType?: SeatClass,
  coaches?: CoachSet,
): DirectionSelection {
  const first = coaches?.[0]?.number;
  return { counts, coachType, shown: first ? [first] : [], seats: [], services: {} };
}

export const seatsNeeded = ({ adults, children }: TicketCounts) => adults + children;

/** Сколько можно выбрать в каждом списке при остальных значениях */
export function countLimits({ adults, children }: TicketCounts): TicketCounts {
  return {
    // Без взрослого билеты не продаются
    adults: Math.max(1, MAX_TICKETS - children),
    children: MAX_TICKETS - adults,
    // На каждого взрослого — не больше одного ребёнка без места
    infants: adults,
  };
}

/** Новые количества: младенцев не больше взрослых, лишние места снимаются с конца */
export function changeCounts(state: DirectionSelection, counts: TicketCounts): DirectionSelection {
  const adults = Math.min(Math.max(counts.adults, 1), MAX_TICKETS);
  const children = Math.min(counts.children, MAX_TICKETS - adults);
  const infants = Math.min(counts.infants, adults);
  const next = { adults, children, infants };

  return { ...state, counts: next, seats: state.seats.slice(0, seatsNeeded(next)) };
}

/** Другой тип вагона: другие цены, поэтому выбор мест и услуг начинается заново */
export function changeCoachType(
  state: DirectionSelection,
  coachType: SeatClass,
  coaches: CoachSet,
): DirectionSelection {
  if (coachType === state.coachType) return state;
  return createSelection(state.counts, coachType, coaches);
}

/** Показать или скрыть схему вагона; хотя бы одна остаётся открытой */
export function toggleCoach(state: DirectionSelection, coach: string): DirectionSelection {
  if (!state.shown.includes(coach)) return { ...state, shown: [...state.shown, coach] };
  if (state.shown.length === 1) return state;
  return {
    ...state,
    shown: state.shown.filter((number) => number !== coach),
    seats: state.seats.filter((ref) => ref.coach !== coach),
  };
}

export const isSelected = (state: DirectionSelection, { coach, seat }: SeatRef) =>
  state.seats.some((ref) => ref.coach === coach && ref.seat === seat);

export type SeatToggleResult =
  { ok: true; state: DirectionSelection } | { ok: false; reason: 'limit' };

/** Клик по месту: снять отметку или выбрать, если ещё не набрано мест на все билеты */
export function toggleSeat(state: DirectionSelection, ref: SeatRef): SeatToggleResult {
  if (isSelected(state, ref)) {
    return {
      ok: true,
      state: {
        ...state,
        seats: state.seats.filter(({ coach, seat }) => coach !== ref.coach || seat !== ref.seat),
      },
    };
  }
  if (state.seats.length >= seatsNeeded(state.counts)) return { ok: false, reason: 'limit' };
  return { ok: true, state: { ...state, seats: [...state.seats, ref] } };
}

export function toggleService(
  state: DirectionSelection,
  coach: string,
  service: ServiceId,
): DirectionSelection {
  const current = state.services[coach] ?? [];
  const next = current.includes(service)
    ? current.filter((id) => id !== service)
    : [...current, service];
  return { ...state, services: { ...state.services, [coach]: next } };
}

/** Стоимость по вагону: места плюс выбранные платные услуги на каждого с местом */
export function coachTotal(
  state: DirectionSelection,
  coaches: CoachSet,
  coachNumber: string,
): number {
  const coach = coaches.find(({ number }) => number === coachNumber);
  const type = state.coachType;
  if (!coach || !type) return 0;
  const seats = state.seats.filter((ref) => ref.coach === coachNumber);
  const seatsSum = seats.reduce(
    (sum, { seat }) => sum + (seatPrice(type, coach.prices, seat) ?? 0),
    0,
  );
  const servicesSum = (state.services[coachNumber] ?? []).reduce((sum, id) => {
    const offer = coach.services[id];
    return sum + (typeof offer === 'number' ? offer : 0);
  }, 0);

  return seatsSum + servicesSum * seats.length;
}

export const isComplete = (state: DirectionSelection) =>
  state.seats.length === seatsNeeded(state.counts);
