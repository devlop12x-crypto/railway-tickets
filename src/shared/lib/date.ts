/** Даты без времени: всё сравнивается по дню, в локальной зоне пользователя */

export const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
] as const;

const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
] as const;

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** −1, 0, 1 — сравнение по дню */
export function compareDays(a: Date, b: Date): number {
  return Math.sign(startOfDay(a).getTime() - startOfDay(b).getTime());
}

export function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

const pad = (value: number) => String(value).padStart(2, '0');

/** 30.08.2018 */
export function formatDate(date: Date): string {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

/** «30 августа 2018» — для подписей скринридеру */
export function formatDateLong(date: Date): string {
  return `${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`;
}

/** 2018-08-30 — формат API */
export function formatIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * «ДД.ММ.ГГГГ» (разделитель — точка, слеш или дефис) → дата.
 * Несуществующие даты вроде 31.02 не проходят: Date их «переносит», а мы сверяем обратно.
 */
export function parseDate(text: string): Date | null {
  const match = /^(\d{2})[./-](\d{2})[./-](\d{4})$/.exec(text.trim());
  if (!match) return null;

  const [, day, month, year] = match.map(Number) as [number, number, number, number];
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
    ? date
    : null;
}

/** Маска ввода: оставляет цифры и расставляет точки — «30082018» → «30.08.2018» */
export function maskDate(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)];
  return parts.filter(Boolean).join('.');
}

export interface CalendarDay {
  date: Date;
  /** День соседнего месяца, показанный для заполнения недели */
  outside: boolean;
}

/** Сетка месяца по неделям с понедельника: 5–6 строк по 7 дней */
export function monthGrid(month: Date): CalendarDay[][] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  // getDay(): 0 — воскресенье; переводим в 0 — понедельник
  const offset = (first.getDay() + 6) % 7;
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - offset);
  const weeks: CalendarDay[][] = [];

  for (let cursor = start; ;) {
    const week: CalendarDay[] = [];
    for (let i = 0; i < 7; i += 1) {
      week.push({ date: cursor, outside: cursor.getMonth() !== month.getMonth() });
      cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
    }
    weeks.push(week);
    if (cursor.getMonth() !== month.getMonth()) break;
  }

  return weeks;
}
