import { checkName, isEmail, isPhone, type FieldError } from '../../shared/lib/validation';

/** Покупатель и способ оплаты: значения и проверка без вёрстки */

export type PaymentMethod = 'online' | 'cash';

export interface PaymentValues {
  lastName: string;
  firstName: string;
  patronymic: string;
  phone: string;
  email: string;
  method: PaymentMethod | '';
}

export type PaymentField = keyof PaymentValues;
export type PaymentErrors = Partial<Record<PaymentField, FieldError>>;

/** Порядок полей на форме: фокус при ошибке — на первое сверху */
export const PAYMENT_FIELDS: readonly PaymentField[] = [
  'lastName',
  'firstName',
  'patronymic',
  'phone',
  'email',
  'method',
];

export function validatePayment(values: PaymentValues): PaymentErrors {
  const errors: PaymentErrors = {};
  const lastName = checkName(values.lastName, ['Фамилия', 'фамилию'], 'Иванова');
  const firstName = checkName(values.firstName, ['Имя', 'имя'], 'Анна');
  if (lastName) errors.lastName = lastName;
  if (firstName) errors.firstName = firstName;
  if (values.patronymic.trim()) {
    const patronymic = checkName(values.patronymic, ['Отчество', 'отчество'], 'Сергеевна');
    if (patronymic) errors.patronymic = patronymic;
  }

  if (!values.phone) errors.phone = { message: 'Укажите телефон' };
  else if (!isPhone(values.phone)) {
    errors.phone = { message: 'Телефон — 10 цифр после +7', example: '+7 916 123 45 67' };
  }

  if (!values.email.trim()) errors.email = { message: 'Укажите e-mail' };
  else if (!isEmail(values.email)) {
    errors.email = { message: 'E-mail указан некорректно', example: 'inbox@gmail.ru' };
  }

  if (!values.method) errors.method = { message: 'Выберите способ оплаты' };
  return errors;
}
