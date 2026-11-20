import { useId, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { maskPhone, type FieldError } from '../../shared/lib/validation';
import {
  PAYMENT_FIELDS,
  validatePayment,
  type PaymentField,
  type PaymentMethod,
  type PaymentValues,
} from './model';
import './PaymentForm.css';

interface PaymentFormProps {
  /** id формы: кнопка «Купить билеты» стоит вне карточки и отправляет её через form= */
  id: string;
  value: PaymentValues;
  onChange: (next: PaymentValues) => void;
  /** Вызывается, только когда всё заполнено верно */
  onSubmit: (values: PaymentValues) => void;
}

const PERSON = [
  ['lastName', 'Фамилия', 'family-name'],
  ['firstName', 'Имя', 'given-name'],
  ['patronymic', 'Отчество', 'additional-name'],
] as const;

const ONLINE_SYSTEMS = ['Банковской картой', 'PayPal', 'Visa QIWI Wallet'];

function ErrorText({ id, error }: { id: string; error: FieldError }) {
  return (
    <p className="payment-form__error" id={id}>
      {error.message}
      {error.example && (
        <>
          . Пример: <b>{error.example}</b>
        </>
      )}
    </p>
  );
}

/**
 * Персональные данные покупателя и способ оплаты.
 * Ошибка поля видна после ухода из него или после попытки купить.
 */
export function PaymentForm({ id, value, onChange, onSubmit }: PaymentFormProps) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [touched, setTouched] = useState<ReadonlySet<PaymentField>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const errors = validatePayment(value);
  const shown = (field: PaymentField) =>
    submitted || touched.has(field) ? errors[field] : undefined;
  const fieldId = (field: PaymentField) => `${uid}-${field}`;
  const errorId = (field: PaymentField) => `${uid}-${field}-error`;

  const touch = (field: PaymentField) => () => setTouched((prev) => new Set(prev).add(field));
  const set =
    (field: Exclude<PaymentField, 'method'>, mask?: (text: string) => string) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [field]: mask ? mask(event.target.value) : event.target.value });
  const a11y = (field: PaymentField) => ({
    'aria-invalid': shown(field) ? true : undefined,
    'aria-describedby': shown(field) ? errorId(field) : undefined,
  });
  const inputClass = (field: PaymentField) => `input${shown(field) ? ' input_invalid' : ''}`;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    const first = PAYMENT_FIELDS.find((field) => errors[field]);
    if (!first) {
      onSubmit(value);
      return;
    }
    formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(first))}`)?.focus();
  };

  const textField = (
    field: 'phone' | 'email',
    label: string,
    props: { type: string; autoComplete: string; placeholder: string; inputMode?: 'tel' },
    mask?: (text: string) => string,
  ) => {
    const error = shown(field);
    return (
      <div className="field payment__contact">
        <label className="field__label field__label_strong" htmlFor={fieldId(field)}>
          {label}
        </label>
        <input
          className={inputClass(field)}
          id={fieldId(field)}
          {...props}
          value={value[field]}
          onChange={set(field, mask)}
          onBlur={touch(field)}
          {...a11y(field)}
        />
        {error && <ErrorText id={errorId(field)} error={error} />}
      </div>
    );
  };

  const methodError = shown('method');

  return (
    <form className="order-card payment-form" id={id} ref={formRef} noValidate onSubmit={submit}>
      <header className="order-card__head order-card__head_plain">
        <h2 className="order-card__title">Персональные данные</h2>
      </header>
      <div className="order-card__section payment__personal">
        <div className="payment__names">
          {PERSON.map(([field, label, autoComplete]) => {
            const error = shown(field);
            return (
              <div key={field} className="field">
                <label className="field__label field__label_strong" htmlFor={fieldId(field)}>
                  {label}
                </label>
                <input
                  className={inputClass(field)}
                  id={fieldId(field)}
                  autoComplete={autoComplete}
                  value={value[field]}
                  onChange={set(field)}
                  onBlur={touch(field)}
                  {...a11y(field)}
                />
                {error && <ErrorText id={errorId(field)} error={error} />}
              </div>
            );
          })}
        </div>
        {textField(
          'phone',
          'Контактный телефон',
          { type: 'tel', autoComplete: 'tel', placeholder: '+7 ___ ___ __ __', inputMode: 'tel' },
          maskPhone,
        )}
        {textField('email', 'E-mail', {
          type: 'email',
          autoComplete: 'email',
          placeholder: 'inbox@gmail.ru',
        })}
      </div>

      <header className="order-card__head order-card__head_plain payment__method-head">
        <h2 className="order-card__title">Способ оплаты</h2>
      </header>
      <fieldset
        className="payment__fieldset"
        aria-describedby={methodError ? errorId('method') : undefined}
      >
        <legend className="visually-hidden">Способ оплаты</legend>
        {(
          [
            ['online', 'Онлайн'],
            ['cash', 'Наличными'],
          ] as const
        ).map(([method, label]) => (
          <div key={method} className={`order-card__section payment__${method}`}>
            <label
              className={`checkbox payment__method${value.method === method ? ' payment__method_checked' : ''}`}
            >
              <input
                className="checkbox__input"
                type="radio"
                // Первой кнопке — id поля, чтобы фокус при ошибке попадал в группу
                id={method === 'online' ? fieldId('method') : undefined}
                name={`${uid}-method`}
                value={method}
                checked={value.method === method}
                onChange={() => onChange({ ...value, method: method as PaymentMethod })}
              />
              {label}
            </label>
            {method === 'online' && (
              <ul className="payment__systems">
                {ONLINE_SYSTEMS.map((system) => (
                  <li key={system}>{system}</li>
                ))}
              </ul>
            )}
            {method === 'cash' && methodError && (
              <div className="payment__method-error">
                <ErrorText id={errorId('method')} error={methodError} />
              </div>
            )}
          </div>
        ))}
      </fieldset>
    </form>
  );
}
