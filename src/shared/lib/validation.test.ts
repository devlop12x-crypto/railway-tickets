import { describe, expect, it } from 'vitest';
import { checkName, isEmail, isPhone, maskPhone } from './validation';

describe('общие правила полей', () => {
  it('имя: кириллица, дефис и пробел между словами', () => {
    expect(checkName('Салтыков-Щедрин', ['Фамилия', 'фамилию'], 'Иванова')).toBeUndefined();
    expect(checkName('  ', ['Фамилия', 'фамилию'], 'Иванова')).toEqual({
      message: 'Укажите фамилию',
    });
    expect(checkName('Ivan', ['Имя', 'имя'], 'Анна')).toEqual({
      message: 'Имя — только русские буквы',
      example: 'Анна',
    });
  });

  it('маска телефона понимает 8, +7 и вставку со скобками', () => {
    expect(maskPhone('89161234567')).toBe('+7 916 123 45 67');
    expect(maskPhone('+7 (916) 123-45-67')).toBe('+7 916 123 45 67');
    expect(maskPhone('9161')).toBe('+7 916 1');
    expect(maskPhone('8')).toBe('+7 ');
    // Стирание префикса очищает поле
    expect(maskPhone('+7')).toBe('');
    expect(maskPhone('+7 916 123 45 678')).toBe('+7 916 123 45 67');
    expect(isPhone('+7 916 123 45 67')).toBe(true);
    expect(isPhone('+7 916 123 45')).toBe(false);
  });

  it('e-mail', () => {
    expect(isEmail('inbox@gmail.ru')).toBe(true);
    expect(isEmail('inbox@gmail')).toBe(false);
    expect(isEmail('in box@gmail.ru')).toBe(false);
  });
});
