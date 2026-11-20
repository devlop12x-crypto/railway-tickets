import { describe, expect, it } from 'vitest';
import {
  ageOn,
  changeTicketType,
  createPassenger,
  firstError,
  MASKS,
  validatePassenger,
  type PassengerDraft,
} from './model';

const TODAY = new Date(2026, 10, 20);

const adult: PassengerDraft = {
  ...createPassenger('adult'),
  lastName: 'Мартынюк',
  firstName: 'Ирина',
  patronymic: 'Эдуардовна',
  gender: 'female',
  birthDate: '17.02.1985',
  series: '4204',
  number: '380694',
};

const child: PassengerDraft = {
  ...createPassenger('child'),
  lastName: 'Мартынюк',
  firstName: 'Кирилл',
  gender: 'male',
  birthDate: '25.01.2020',
  number: 'VIII-ЫП-123456',
};

describe('проверка пассажира', () => {
  it('принимает заполненные карточки с макета', () => {
    expect(validatePassenger(adult, TODAY)).toEqual({});
    expect(validatePassenger({ ...child, number: 'VIII УН 256319' }, TODAY)).toEqual({});
  });

  it('пустая карточка: первая ошибка — фамилия, отчество необязательно', () => {
    const errors = validatePassenger(createPassenger(), TODAY);
    expect(firstError(errors)?.[0]).toBe('lastName');
    expect(errors.patronymic).toBeUndefined();
    expect(Object.keys(errors)).toEqual([
      'lastName',
      'firstName',
      'gender',
      'birthDate',
      'series',
      'number',
    ]);
  });

  it('имена — русскими буквами, через дефис или пробел', () => {
    expect(validatePassenger({ ...adult, lastName: 'Салтыков-Щедрин' }, TODAY)).toEqual({});
    expect(validatePassenger({ ...adult, firstName: 'Irina' }, TODAY).firstName?.example).toBe(
      'Анна',
    );
    expect(validatePassenger({ ...adult, lastName: 'Иванов1' }, TODAY).lastName).toBeDefined();
  });

  it('проверяет дату рождения и возраст для билета и документа', () => {
    const date = (birthDate: string, draft = adult) =>
      validatePassenger({ ...draft, birthDate }, TODAY).birthDate?.message;
    expect(date('31.02.1985')).toBe('Дата рождения указана некорректно');
    expect(date('01.01.2030')).toBe('Такой даты рождения не может быть');
    expect(date('25.01.2006', child)).toMatch(/^Детский билет/);
    // 10 лет исполнилось вчера — уже взрослый билет; исполнится завтра — ещё детский
    expect(date('19.11.2016', child)).toMatch(/^Детский билет/);
    expect(date('21.11.2016', child)).toBeUndefined();

    expect(validatePassenger({ ...adult, birthDate: '01.01.2015' }, TODAY).number?.message).toMatch(
      /^Паспорт выдается с 14 лет/,
    );
    expect(
      validatePassenger({ ...child, type: 'adult', birthDate: '01.01.2000' }, TODAY).number
        ?.message,
    ).toMatch(/^Свидетельство о рождении — для детей до 14 лет/);
  });

  it('паспорт — 4 и 6 цифр, свидетельство — как VIII-ЫП-123456', () => {
    const errors = validatePassenger({ ...adult, series: '420', number: '38069' }, TODAY);
    expect(errors.series?.example).toBe('4204');
    expect(errors.number?.example).toBe('380694');
    expect(validatePassenger({ ...child, number: '000000' }, TODAY).number).toEqual({
      message: 'Номер свидетельства о рождении указан некорректно',
      example: 'VIII-ЫП-123456',
    });
  });

  it('считает полные годы', () => {
    expect(ageOn(new Date(2000, 10, 21), TODAY)).toBe(25);
    expect(ageOn(new Date(2000, 10, 20), TODAY)).toBe(26);
  });

  it('смена типа билета подставляет документ и очищает номер', () => {
    const next = changeTicketType(adult, 'child');
    expect(next).toMatchObject({ type: 'child', document: 'birth', series: '', number: '' });
  });
});

describe('маски', () => {
  it('оставляют только допустимые символы', () => {
    expect(MASKS.birthDate('17021985')).toBe('17.02.1985');
    expect(MASKS.series('42 04a5')).toBe('4204');
    expect(MASKS.passportNumber('380-6941')).toBe('380694');
    expect(MASKS.certificate('viii-ып-123456')).toBe('VIII-ЫП-123456');
    // Русские Х и С в римском числе становятся латинскими
    expect(MASKS.certificate('ХIV СХ 123456')).toBe('XIV СХ 123456');
  });
});
