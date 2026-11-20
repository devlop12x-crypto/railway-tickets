import { maskDate, parseDate, startOfDay } from '../../shared/lib/date';
import { checkName, type FieldError } from '../../shared/lib/validation';

export type { FieldError };

/** Данные пассажира, проверка и маски полей без вёрстки */

export type TicketType = 'adult' | 'child';
export type DocumentType = 'passport' | 'birth';

export interface PassengerDraft {
  type: TicketType;
  lastName: string;
  firstName: string;
  patronymic: string;
  gender: 'male' | 'female' | '';
  birthDate: string;
  limitedMobility: boolean;
  document: DocumentType;
  series: string;
  number: string;
}

export type PassengerField =
  'lastName' | 'firstName' | 'patronymic' | 'gender' | 'birthDate' | 'series' | 'number';

/** Порядок полей на карточке: в плашке показывается первая ошибка сверху */
export const FIELD_ORDER: readonly PassengerField[] = [
  'lastName',
  'firstName',
  'patronymic',
  'gender',
  'birthDate',
  'series',
  'number',
];

export type PassengerErrors = Partial<Record<PassengerField, FieldError>>;

/** Детский билет — до 10 лет, свидетельство о рождении — до 14, паспорт — с 14 */
export const CHILD_TICKET_AGE = 10;
export const PASSPORT_AGE = 14;

export function createPassenger(type: TicketType = 'adult'): PassengerDraft {
  return {
    type,
    lastName: '',
    firstName: '',
    patronymic: '',
    gender: '',
    birthDate: '',
    limitedMobility: false,
    document: type === 'adult' ? 'passport' : 'birth',
    series: '',
    number: '',
  };
}

/** Смена типа билета подставляет обычный для него документ */
export function changeTicketType(draft: PassengerDraft, type: TicketType): PassengerDraft {
  const document = type === 'adult' ? 'passport' : 'birth';
  return { ...draft, type, document, series: '', number: '' };
}

export function changeDocument(draft: PassengerDraft, document: DocumentType): PassengerDraft {
  return { ...draft, document, series: '', number: '' };
}

/** Римское число, две буквы, шесть цифр: VIII-ЫП-123456 (разделители — дефис или пробел) */
const BIRTH_CERTIFICATE = /^[IVXLC]{1,7}[- ]?[А-ЯЁ]{2}[- ]?\d{6}$/;

/** Полных лет на дату today */
export function ageOn(birth: Date, today: Date): number {
  let age = today.getFullYear() - birth.getFullYear();
  const hadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!hadBirthday) age -= 1;
  return age;
}

export function validatePassenger(draft: PassengerDraft, today = new Date()): PassengerErrors {
  const errors: PassengerErrors = {};
  const lastName = checkName(draft.lastName, ['Фамилия', 'фамилию'], 'Иванова');
  const firstName = checkName(draft.firstName, ['Имя', 'имя'], 'Анна');
  if (lastName) errors.lastName = lastName;
  if (firstName) errors.firstName = firstName;
  // Отчества может не быть, но если оно есть — по тем же правилам
  if (draft.patronymic.trim()) {
    const patronymic = checkName(draft.patronymic, ['Отчество', 'отчество'], 'Сергеевна');
    if (patronymic) errors.patronymic = patronymic;
  }
  if (!draft.gender) errors.gender = { message: 'Укажите пол' };

  const birth = parseDate(draft.birthDate);
  const age = birth ? ageOn(birth, today) : undefined;
  if (!draft.birthDate) {
    errors.birthDate = { message: 'Укажите дату рождения' };
  } else if (!birth) {
    errors.birthDate = { message: 'Дата рождения указана некорректно', example: '17.02.1985' };
  } else if (birth > startOfDay(today) || birth.getFullYear() < 1900) {
    errors.birthDate = { message: 'Такой даты рождения не может быть' };
  } else if (draft.type === 'child' && age !== undefined && age >= CHILD_TICKET_AGE) {
    errors.birthDate = {
      message: `Детский билет — для детей до ${CHILD_TICKET_AGE} лет. Выберите взрослый билет`,
    };
  }

  if (draft.document === 'passport') {
    if (!/^\d{4}$/.test(draft.series)) {
      errors.series = { message: 'Серия паспорта — 4 цифры', example: '4204' };
    }
    if (!/^\d{6}$/.test(draft.number)) {
      errors.number = { message: 'Номер паспорта — 6 цифр', example: '380694' };
    } else if (age !== undefined && age < PASSPORT_AGE) {
      errors.number = {
        message: `Паспорт выдается с ${PASSPORT_AGE} лет. Выберите свидетельство о рождении`,
      };
    }
  } else if (!BIRTH_CERTIFICATE.test(draft.number.trim())) {
    errors.number = {
      message: 'Номер свидетельства о рождении указан некорректно',
      example: 'VIII-ЫП-123456',
    };
  } else if (age !== undefined && age >= PASSPORT_AGE) {
    errors.number = {
      message: `Свидетельство о рождении — для детей до ${PASSPORT_AGE} лет. Выберите паспорт`,
    };
  }

  return errors;
}

export function firstError(errors: PassengerErrors): [PassengerField, FieldError] | undefined {
  for (const field of FIELD_ORDER) {
    const error = errors[field];
    if (error) return [field, error];
  }
  return undefined;
}

/** Маски ввода: лишние символы не попадают в поле */
export const MASKS = {
  birthDate: maskDate,
  series: (text: string) => text.replace(/\D/g, '').slice(0, 4),
  passportNumber: (text: string) => text.replace(/\D/g, '').slice(0, 6),
  /**
   * Латинские X и C в римском числе часто набирают русскими Х и С — заменяем,
   * когда число отделено от букв: без разделителя не понять, где оно кончается
   */
  certificate: (text: string) => {
    const upper = text.toUpperCase().replace(/[^IVXLCА-ЯЁ0-9 -]/g, '');
    const roman = /^[IVXLCХС]+(?=[- ])/.exec(upper)?.[0] ?? '';
    return (roman.replace(/Х/g, 'X').replace(/С/g, 'C') + upper.slice(roman.length)).slice(0, 16);
  },
};
