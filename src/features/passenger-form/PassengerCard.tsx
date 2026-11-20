import { useId, useRef, useState, type ChangeEvent } from 'react';
import { Icon } from '../../shared/ui/Icon';
import {
  changeDocument,
  changeTicketType,
  FIELD_ORDER,
  firstError,
  MASKS,
  validatePassenger,
  type DocumentType,
  type PassengerDraft,
  type PassengerField,
  type TicketType,
} from './model';
import './PassengerCard.css';

interface PassengerCardProps {
  index: number;
  value: PassengerDraft;
  onChange: (next: PassengerDraft) => void;
  open: boolean;
  onToggle: () => void;
  /** Нет — карточку удалить нельзя: в заказе остался один пассажир */
  onRemove?: (() => void) | undefined;
  /** «Следующий пассажир»: вызывается, только когда карточка заполнена верно */
  onNext: () => void;
  /** Страница просит показать ошибки, например после попытки перейти дальше */
  forceErrors?: boolean;
}

/**
 * Карточка пассажира. Ошибка поля показывается, когда из него ушли или нажали
 * «Следующий пассажир»; плашка внизу — первая ошибка сверху или «Готово».
 */
export function PassengerCard(props: PassengerCardProps) {
  const { index, value, onChange, open, onToggle, onRemove, onNext, forceErrors } = props;
  const id = useId();
  const cardRef = useRef<HTMLElement>(null);
  const [touched, setTouched] = useState<ReadonlySet<PassengerField>>(new Set());
  const [checked, setChecked] = useState(false);
  const errors = validatePassenger(value);
  const isValid = Object.keys(errors).length === 0;
  const visible = (field: PassengerField) =>
    (checked || forceErrors || touched.has(field)) && errors[field];
  // В плашке — первая из уже показанных ошибок, чтобы не ругаться на поля, до которых не дошли
  const shownField = FIELD_ORDER.find((field) => visible(field));
  const shownError = shownField ? errors[shownField] : undefined;
  const isPassport = value.document === 'passport';
  const fieldId = (field: PassengerField) => `${id}-${field}`;
  const statusId = `${id}-status`;

  const touch = (field: PassengerField) => () => setTouched((prev) => new Set(prev).add(field));
  const set =
    <K extends keyof PassengerDraft>(key: K, mask?: (text: string) => string) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [key]: mask ? mask(event.target.value) : event.target.value });
  const invalidProps = (field: PassengerField) => ({
    'aria-invalid': visible(field) ? true : undefined,
    'aria-describedby': visible(field) ? statusId : undefined,
  });
  const inputClass = (field: PassengerField, extra = '') =>
    `input input_size_s${extra}${visible(field) ? ' input_invalid' : ''}`;

  const next = () => {
    if (isValid) {
      onNext();
      return;
    }
    setChecked(true);
    // Фокус на первое неверное поле: пользователь сразу видит, что исправлять
    const field = firstError(errors)?.[0];
    if (field)
      cardRef.current?.querySelector<HTMLElement>(`#${CSS.escape(fieldId(field))}`)?.focus();
  };

  if (!open) {
    return (
      <article className="order-card passenger passenger_collapsed" aria-labelledby={`${id}-title`}>
        <header className="order-card__head">
          <button
            className="passenger__toggle"
            type="button"
            aria-expanded={false}
            aria-label={`Развернуть: пассажир ${index}`}
            onClick={onToggle}
          />
          <h2 className="order-card__title" id={`${id}-title`}>
            Пассажир {index}
            {isValid && <span className="passenger__done"> — {value.lastName}, готово</span>}
          </h2>
          {onRemove && (
            <button
              className="passenger__remove"
              type="button"
              aria-label={`Удалить пассажира ${index}`}
              onClick={onRemove}
            >
              <Icon name="close" size={18} />
            </button>
          )}
        </header>
      </article>
    );
  }

  return (
    <article className="order-card passenger" aria-labelledby={`${id}-title`} ref={cardRef}>
      <header className="order-card__head">
        <button
          className="passenger__toggle passenger__toggle_open"
          type="button"
          aria-expanded
          aria-label={`Свернуть: пассажир ${index}`}
          onClick={onToggle}
        />
        <h2 className="order-card__title" id={`${id}-title`}>
          Пассажир {index}
        </h2>
        {onRemove && (
          <button
            className="passenger__remove"
            type="button"
            aria-label={`Удалить пассажира ${index}`}
            onClick={onRemove}
          >
            <Icon name="close" size={18} />
          </button>
        )}
      </header>

      <div className="order-card__section passenger__main">
        <label className="visually-hidden" htmlFor={`${id}-type`}>
          Тип билета
        </label>
        <select
          className="select passenger__type"
          id={`${id}-type`}
          value={value.type}
          onChange={(event) => onChange(changeTicketType(value, event.target.value as TicketType))}
        >
          <option value="adult">Взрослый</option>
          <option value="child">Детский</option>
        </select>

        <div className="passenger__names">
          {(
            [
              ['lastName', 'Фамилия', 'family-name'],
              ['firstName', 'Имя', 'given-name'],
              ['patronymic', 'Отчество', 'additional-name'],
            ] as const
          ).map(([name, label, autoComplete]) => (
            <div key={name} className="field">
              <label className="field__label" htmlFor={fieldId(name)}>
                {label}
              </label>
              <input
                className={inputClass(name)}
                id={fieldId(name)}
                autoComplete={autoComplete}
                value={value[name]}
                onChange={set(name)}
                onBlur={touch(name)}
                {...invalidProps(name)}
              />
            </div>
          ))}
        </div>

        <div className="passenger__row">
          <fieldset
            className={`field passenger__gender${visible('gender') ? ' passenger__gender_invalid' : ''}`}
            {...invalidProps('gender')}
          >
            <legend className="field__label">Пол</legend>
            <div className="gender">
              {(
                [
                  ['male', 'м', 'Мужской'],
                  ['female', 'ж', 'Женский'],
                ] as const
              ).map(([gender, letter, label], position) => (
                <label key={gender} className="gender__option">
                  <input
                    className="gender__input"
                    type="radio"
                    // Первой кнопке — id поля, чтобы фокус при ошибке попадал в группу
                    id={position === 0 ? fieldId('gender') : undefined}
                    name={`${id}-gender`}
                    value={gender}
                    checked={value.gender === gender}
                    onChange={() => onChange({ ...value, gender })}
                    onBlur={touch('gender')}
                  />
                  <span className="gender__letter" aria-hidden="true">
                    {letter}
                  </span>
                  <span className="visually-hidden">{label}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="field passenger__birth">
            <label className="field__label" htmlFor={fieldId('birthDate')}>
              Дата рождения
            </label>
            <input
              className={inputClass('birthDate')}
              id={fieldId('birthDate')}
              inputMode="numeric"
              placeholder="ДД.ММ.ГГГГ"
              value={value.birthDate}
              onChange={set('birthDate', MASKS.birthDate)}
              onBlur={touch('birthDate')}
              {...invalidProps('birthDate')}
            />
          </div>
        </div>

        <label className="checkbox passenger__mobility">
          <input
            className="checkbox__input"
            type="checkbox"
            checked={value.limitedMobility}
            onChange={(event) => onChange({ ...value, limitedMobility: event.target.checked })}
          />
          ограниченная подвижность
        </label>
      </div>

      <div
        className={`order-card__section passenger__docs${isPassport ? '' : ' passenger__docs_birth'}`}
      >
        <div className="field">
          <label className="field__label" htmlFor={`${id}-doc`}>
            Тип документа
          </label>
          <select
            className="select select_size_s"
            id={`${id}-doc`}
            value={value.document}
            onChange={(event) =>
              onChange(changeDocument(value, event.target.value as DocumentType))
            }
          >
            <option value="passport">Паспорт РФ</option>
            <option value="birth">Свидетельство о рождении</option>
          </select>
        </div>
        {isPassport && (
          <div className="field">
            <label className="field__label" htmlFor={fieldId('series')}>
              Серия
            </label>
            <input
              className={inputClass('series', ' passenger__mask')}
              id={fieldId('series')}
              inputMode="numeric"
              placeholder="_ _ _ _"
              value={value.series}
              onChange={set('series', MASKS.series)}
              onBlur={touch('series')}
              {...invalidProps('series')}
            />
          </div>
        )}
        <div className="field">
          <label className="field__label" htmlFor={fieldId('number')}>
            Номер
          </label>
          <input
            className={inputClass('number', isPassport ? ' passenger__mask' : '')}
            id={fieldId('number')}
            inputMode={isPassport ? 'numeric' : 'text'}
            placeholder={isPassport ? '_ _ _ _ _ _' : 'VIII-ЫП-123456'}
            value={value.number}
            onChange={set('number', isPassport ? MASKS.passportNumber : MASKS.certificate)}
            onBlur={touch('number')}
            {...invalidProps('number')}
          />
        </div>
      </div>

      {shownError ? (
        <footer className="order-card__footer passenger__status passenger__status_error">
          <p className="passenger__message" id={statusId} role="alert">
            <span className="passenger__status-icon" aria-hidden="true">
              <Icon name="close" size={16} />
            </span>
            <span>
              {shownError.message}
              {shownError.example && (
                <>
                  <br />
                  Пример: <b>{shownError.example}</b>
                </>
              )}
            </span>
          </p>
        </footer>
      ) : (
        <footer
          className={`order-card__footer${isValid ? ' passenger__status passenger__status_success' : ''}`}
        >
          {isValid && (
            <p className="passenger__message" role="status">
              <span className="passenger__status-icon" aria-hidden="true">
                <Icon name="check" size={18} />
              </span>
              Готово
            </p>
          )}
          <button
            className="button button_variant_outline passenger__next"
            type="button"
            onClick={next}
          >
            Следующий пассажир
          </button>
        </footer>
      )}
    </article>
  );
}

/** Кнопка «Добавить пассажира» под карточками */
export function AddPassengerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="order-card passenger-stub passenger-stub_add"
      type="button"
      onClick={onClick}
    >
      <span className="passenger-stub__label">Добавить пассажира</span>
      <Icon className="passenger-stub__plus" name="add" size={30} />
    </button>
  );
}
