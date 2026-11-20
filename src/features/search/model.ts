import { compareDays, formatIsoDate, parseDate } from '../../shared/lib/date';

/** Город в форме: что набрано и какой город из подсказок выбран */
export interface CityValue {
  text: string;
  city: string | null;
}

export interface SearchValues {
  from: CityValue;
  to: CityValue;
  /** «ДД.ММ.ГГГГ» или пусто */
  dateThere: string;
  dateBack: string;
}

export type SearchErrors = Partial<Record<keyof SearchValues, string>>;

export const EMPTY_CITY: CityValue = { text: '', city: null };

function validateCity(value: CityValue, emptyMessage: string): string | undefined {
  if (!value.text.trim()) return emptyMessage;
  if (!value.city) return 'Выберите город из списка';
  return undefined;
}

function validateDate(text: string, today: Date): Date | string | null {
  if (!text) return null;
  const date = parseDate(text);
  if (!date) return 'Дата в формате ДД.ММ.ГГГГ';
  if (compareDays(date, today) < 0) return 'Эта дата уже прошла';
  return date;
}

/** Проверка формы поиска. Даты необязательны: API ищет и без них */
export function validateSearch(values: SearchValues, today = new Date()): SearchErrors {
  const errors: SearchErrors = {};

  const from = validateCity(values.from, 'Укажите город отправления');
  const to = validateCity(values.to, 'Укажите город прибытия');
  if (from) errors.from = from;
  if (to) errors.to = to;
  if (!from && !to && values.from.city === values.to.city) {
    errors.to = 'Города отправления и прибытия совпадают';
  }

  const there = validateDate(values.dateThere, today);
  const back = validateDate(values.dateBack, today);
  if (typeof there === 'string') errors.dateThere = there;
  if (typeof back === 'string') errors.dateBack = back;
  if (there instanceof Date && back instanceof Date && compareDays(back, there) < 0) {
    errors.dateBack = 'Обратно — не раньше, чем туда';
  }

  return errors;
}

/** Параметры поиска в адресе страницы: переживают перезагрузку и попадают в шапку */
export function toSearchParams(values: SearchValues): URLSearchParams {
  const params = new URLSearchParams();
  if (values.from.city) params.set('from', values.from.city);
  if (values.to.city) params.set('to', values.to.city);

  const there = parseDate(values.dateThere);
  const back = parseDate(values.dateBack);
  if (there) params.set('date_start', formatIsoDate(there));
  if (back) params.set('date_end', formatIsoDate(back));

  return params;
}

const fromIso = (value: string | null) => {
  const match = value && /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}.${match[2]}.${match[1]}` : '';
};

export function fromSearchParams(params: URLSearchParams): SearchValues {
  const city = (name: string): CityValue => {
    const value = params.get(name);
    return value ? { text: value, city: value } : EMPTY_CITY;
  };

  return {
    from: city('from'),
    to: city('to'),
    dateThere: fromIso(params.get('date_start')),
    dateBack: fromIso(params.get('date_end')),
  };
}
