import { describe, expect, it } from 'vitest';
import {
  EMPTY_CITY,
  fromSearchParams,
  toSearchParams,
  validateSearch,
  type SearchValues,
} from './model';

const TODAY = new Date(2018, 7, 20);
const moscow = { text: 'Москва', city: 'Москва' };
const spb = { text: 'Санкт-Петербург', city: 'Санкт-Петербург' };
const values = (patch: Partial<SearchValues>): SearchValues => ({
  from: moscow,
  to: spb,
  dateThere: '',
  dateBack: '',
  ...patch,
});

describe('проверка формы поиска', () => {
  it('принимает два разных города без дат', () => {
    expect(validateSearch(values({}), TODAY)).toEqual({});
  });

  it('требует выбрать города из списка', () => {
    expect(
      validateSearch(values({ from: EMPTY_CITY, to: { text: 'Мос', city: null } }), TODAY),
    ).toEqual({
      from: 'Укажите город отправления',
      to: 'Выберите город из списка',
    });
  });

  it('не пускает одинаковые города', () => {
    expect(validateSearch(values({ to: moscow }), TODAY).to).toBe(
      'Города отправления и прибытия совпадают',
    );
  });

  it('проверяет формат и порядок дат', () => {
    expect(validateSearch(values({ dateThere: '31.02.2018' }), TODAY).dateThere).toBe(
      'Дата в формате ДД.ММ.ГГГГ',
    );
    expect(validateSearch(values({ dateThere: '19.08.2018' }), TODAY).dateThere).toBe(
      'Эта дата уже прошла',
    );
    expect(
      validateSearch(values({ dateThere: '30.08.2018', dateBack: '25.08.2018' }), TODAY).dateBack,
    ).toBe('Обратно — не раньше, чем туда');
  });

  it('переносит параметры в адрес и обратно', () => {
    const params = toSearchParams(values({ dateThere: '30.08.2018', dateBack: '09.09.2018' }));
    expect(params.toString()).toBe(
      'from=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0&to=%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3&date_start=2018-08-30&date_end=2018-09-09',
    );
    expect(fromSearchParams(params)).toEqual(
      values({ dateThere: '30.08.2018', dateBack: '09.09.2018' }),
    );
  });
});
