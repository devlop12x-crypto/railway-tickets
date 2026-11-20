/** Общие правила полей форм заказа */

export interface FieldError {
  message: string;
  /** Образец правильного значения — на макете выделен жирным */
  example?: string;
}

/** Кириллица, слова через пробел или дефис: «Салтыков-Щедрин», «Анна Мария» */
const NAME = /^[А-ЯЁа-яё]+(?:[ -][А-ЯЁа-яё]+)*$/;

/** label — [«Фамилия», «фамилию»]: подпись поля и форма для «Укажите …» */
export function checkName(
  value: string,
  [name, accusative]: readonly [string, string],
  example: string,
): FieldError | undefined {
  const text = value.trim();
  if (!text) return { message: `Укажите ${accusative}` };
  if (!NAME.test(text)) return { message: `${name} — только русские буквы`, example };
  return undefined;
}

/** Достаточная проверка адреса: что-то@домен.зона, без пробелов */
export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

/**
 * Маска телефона «+7 916 123 45 67». Первую 8 или 7 считаем кодом страны,
 * поэтому подходят и «89161234567», и вставка «+7 (916) 123-45-67»
 */
export function maskPhone(text: string): string {
  const raw = text.trim();
  if (!raw) return '';
  let digits = raw.replace(/\D/g, '');
  if (raw.startsWith('+')) digits = digits.replace(/^7/, '');
  else if (/^[78]/.test(digits)) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  // «+7» без цифр после стирания — поле пустеет, а не застревает на префиксе
  if (!digits) return raw.startsWith('+7') && raw.length <= 2 ? '' : '+7 ';

  const groups = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 8), digits.slice(8)];
  return `+7 ${groups.filter(Boolean).join(' ')}`;
}

export const isPhone = (value: string) => /^\+7 \d{3} \d{3} \d{2} \d{2}$/.test(value);
