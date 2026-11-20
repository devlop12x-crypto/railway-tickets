import { useId } from 'react';
import { Icon } from '../../shared/ui/Icon';
import './PassengerCard.css';

export interface PassengerDraft {
  type: 'adult' | 'child';
  lastName: string;
  firstName: string;
  patronymic: string;
  gender: 'male' | 'female';
  birthDate: string;
  limitedMobility: boolean;
  document: 'passport' | 'birth';
  series: string;
  number: string;
}

interface PassengerCardProps {
  index: number;
  passenger: PassengerDraft;
}

/**
 * Карточка пассажира. Этап 2 — вёрстка с нативными полями;
 * маски, валидация и плашки ошибки/успеха — этап 3.
 */
export function PassengerCard({ index, passenger }: PassengerCardProps) {
  const id = useId();
  const isPassport = passenger.document === 'passport';

  return (
    <article className="order-card passenger" aria-labelledby={`${id}-title`}>
      <header className="order-card__head">
        <button
          className="passenger__toggle passenger__toggle_open"
          type="button"
          aria-expanded
          aria-label={`Свернуть: пассажир ${index}`}
        />
        <h2 className="order-card__title" id={`${id}-title`}>
          Пассажир {index}
        </h2>
        <button
          className="passenger__remove"
          type="button"
          aria-label={`Удалить пассажира ${index}`}
        >
          <Icon name="close" size={18} />
        </button>
      </header>

      <div className="order-card__section passenger__main">
        <label className="visually-hidden" htmlFor={`${id}-type`}>
          Тип билета
        </label>
        <select className="select passenger__type" id={`${id}-type`} defaultValue={passenger.type}>
          <option value="adult">Взрослый</option>
          <option value="child">Детский</option>
        </select>

        <div className="passenger__names">
          {(
            [
              ['lastName', 'Фамилия', passenger.lastName],
              ['firstName', 'Имя', passenger.firstName],
              ['patronymic', 'Отчество', passenger.patronymic],
            ] as const
          ).map(([name, label, value]) => (
            <div key={name} className="field">
              <label className="field__label" htmlFor={`${id}-${name}`}>
                {label}
              </label>
              <input className="input" id={`${id}-${name}`} name={name} defaultValue={value} />
            </div>
          ))}
        </div>

        <div className="passenger__row">
          <fieldset className="field passenger__gender">
            <legend className="field__label">Пол</legend>
            <div className="gender">
              {(
                [
                  ['male', 'м', 'Мужской'],
                  ['female', 'ж', 'Женский'],
                ] as const
              ).map(([value, letter, label]) => (
                <label key={value} className="gender__option">
                  <input
                    className="gender__input"
                    type="radio"
                    name={`${id}-gender`}
                    value={value}
                    defaultChecked={passenger.gender === value}
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
            <label className="field__label" htmlFor={`${id}-birth`}>
              Дата рождения
            </label>
            <input
              className="input input_size_s"
              id={`${id}-birth`}
              placeholder="ДД/ММ/ГГ"
              defaultValue={passenger.birthDate}
            />
          </div>
        </div>

        <label className="checkbox passenger__mobility">
          <input
            className="checkbox__input"
            type="checkbox"
            defaultChecked={passenger.limitedMobility}
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
            defaultValue={passenger.document}
          >
            <option value="passport">Паспорт РФ</option>
            <option value="birth">Свидетельство о рождении</option>
          </select>
        </div>
        {isPassport && (
          <div className="field">
            <label className="field__label" htmlFor={`${id}-series`}>
              Серия
            </label>
            <input
              className="input input_size_s passenger__mask"
              id={`${id}-series`}
              placeholder="_ _ _ _"
              defaultValue={passenger.series}
            />
          </div>
        )}
        <div className="field">
          <label className="field__label" htmlFor={`${id}-number`}>
            Номер
          </label>
          <input
            className={`input input_size_s${isPassport ? ' passenger__mask' : ''}`}
            id={`${id}-number`}
            placeholder={isPassport ? '_ _ _ _ _ _' : '12 символов'}
            defaultValue={passenger.number}
          />
        </div>
      </div>

      <footer className="order-card__footer">
        <button className="button button_variant_outline passenger__next" type="button">
          Следующий пассажир
        </button>
      </footer>
    </article>
  );
}

/** Свёрнутая карточка: «Пассажир 3» или «Добавить пассажира» */
export function PassengerStub({ label, variant }: { label: string; variant: 'collapsed' | 'add' }) {
  return (
    <button className={`order-card passenger-stub passenger-stub_${variant}`} type="button">
      {variant === 'collapsed' && <span className="passenger__toggle" aria-hidden="true" />}
      <span className="passenger-stub__label">{label}</span>
      {variant === 'add' && <Icon className="passenger-stub__plus" name="add" size={30} />}
    </button>
  );
}
