import { useId, useState } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '../../shared/config/routes';
import { formatPrice } from '../../shared/lib/formatPrice';
import { Icon } from '../../shared/ui/Icon';
import type { IconName } from '../../shared/ui/icons';
import type { SeatClass, TripLeg } from '../trains/types';
import {
  countByTier,
  totalPrice,
  type CoachDetails,
  type CoachSet,
  type ServiceId,
  type ServiceState,
} from './coach';
import { CoachScheme } from './CoachScheme';
import './DirectionCard.css';

export interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

interface DirectionCardProps {
  direction: 'there' | 'back';
  trainNumber: string;
  origin?: string;
  fromCity: string;
  toCity: string;
  leg: TripLeg;
  durationText: string;
  passengers: PassengerCounts;
  /** Тип вагона, выбранный изначально */
  coachType?: SeatClass;
  /** Вагоны по типам: что показать после выбора типа */
  coachesByType: Partial<Record<SeatClass, CoachSet>>;
}

const COACH_TYPES: { type: SeatClass; label: string; icon: IconName; size: number }[] = [
  { type: 'fourth', label: 'Сидячий', icon: 'seat', size: 54 },
  { type: 'third', label: 'Плацкарт', icon: 'coachPlatzkart', size: 50 },
  { type: 'second', label: 'Купе', icon: 'coachCoupe', size: 50 },
  { type: 'first', label: 'Люкс', icon: 'star', size: 60 },
];

const SERVICES: { id: ServiceId; icon: IconName; label: string }[] = [
  { id: 'ac', icon: 'acUnit', label: 'Кондиционер' },
  { id: 'wifi', icon: 'wifi', label: 'Wi-Fi' },
  { id: 'linens', icon: 'bed', label: 'Бельё' },
  { id: 'food', icon: 'cup', label: 'Питание' },
];

const SERVICE_STATE_LABELS: Record<ServiceState, string> = {
  off: 'не выбрано',
  on: 'выбрано',
  included: 'включено в стоимость',
};

/** Сведения о вагоне, схема и сумма за выбранные места */
function Coach({ type, coach }: { type: SeatClass; coach: CoachDetails }) {
  const counts = countByTier(type, coach.available);
  // Строки «ярус — свободно — цена»; у люкса и сидячего ярусов нет, только общая цена
  const tiers: { label: string; count: number; price: number | undefined }[] =
    type === 'second' || type === 'third'
      ? [
          { label: 'Верхние', count: counts.upper, price: coach.prices.upper },
          { label: 'Нижние', count: counts.lower, price: coach.prices.lower },
        ]
      : [];
  if (type === 'third') {
    tiers.push({ label: 'Боковые', count: counts.side, price: coach.prices.side });
  }
  const prices = tiers.length > 0 ? tiers.map(({ price }) => price) : [coach.prices.single];
  const total = coach.selected ? totalPrice(type, coach.prices, coach.selected) : 0;

  return (
    <div className="coach-block">
      <div className="coach">
        <div className="coach__badge">
          <span className="coach__number">{coach.number}</span>
          вагон
        </div>
        <div className="coach__column">
          <p className="coach__caption">
            Места <b className="coach__caption-value">{coach.available.size}</b>
          </p>
          {tiers.map(({ label, count }) => (
            <p key={label} className="coach__row">
              {label} <b>{count}</b>
            </p>
          ))}
        </div>
        <div className="coach__column">
          <p className="coach__caption">Стоимость</p>
          {prices.map((price, index) => (
            <p key={index} className="coach__row coach__price">
              <b>{formatPrice(price ?? 0)}</b>
              <Icon className="coach__ruble" name="ruble" size={20} />
            </p>
          ))}
        </div>
        <div className="coach__column">
          <p className="coach__caption">
            Обслуживание <span className="coach__company">ФПК</span>
          </p>
          <ul className="coach__services">
            {SERVICES.map(({ id: serviceId, icon, label }) => {
              const state = coach.services[serviceId];

              return (
                <li
                  key={serviceId}
                  className={`coach__service coach__service_state_${state}`}
                  title={label}
                >
                  <Icon name={icon} size={22} />
                  <span className="visually-hidden">
                    {label}: {SERVICE_STATE_LABELS[state]}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="coach__watching">{coach.watching} человек выбирают места в этом поезде</p>
        </div>
      </div>

      <div className="direction__scheme">
        <CoachScheme
          type={type}
          coachNumber={coach.number}
          available={coach.available}
          selected={coach.selected}
        />
      </div>

      {total > 0 && (
        <p className="coach-block__total">
          <span className="visually-hidden">Итого: </span>
          <b>{formatPrice(total)}</b>
          <Icon className="coach__ruble" name="ruble" size={20} />
        </p>
      )}
    </div>
  );
}

const MAX_PASSENGERS = 5;

function CountSelect({ id, label, value }: { id: string; label: string; value: number }) {
  return (
    <>
      <label className="visually-hidden" htmlFor={id}>
        {label}
      </label>
      <select className="tickets__select" id={id} defaultValue={value}>
        {Array.from({ length: MAX_PASSENGERS + 1 }, (_, count) => (
          <option key={count} value={count}>
            {label} — {count}
          </option>
        ))}
      </select>
    </>
  );
}

/** Выбор мест в одном направлении: поезд, количество билетов, тип вагона, схема */
export function DirectionCard(props: DirectionCardProps) {
  const { direction, trainNumber, origin, fromCity, toCity, leg, durationText, passengers } = props;
  const { coachesByType } = props;
  const id = useId();
  // Этап 2: переключение типа вагона показывает его схему; данные — с макета
  const [coachType, setCoachType] = useState(props.coachType);
  const coachSet = coachType ? coachesByType[coachType] : undefined;
  const shownNumbers = new Set(coachSet?.coaches.map(({ number }) => number));
  const title = direction === 'there' ? 'Туда' : 'Обратно';

  return (
    <section className={`direction direction_${direction}`} aria-labelledby={`${id}-title`}>
      <h2 className="visually-hidden" id={`${id}-title`}>
        {title}
      </h2>
      <div className="direction__head">
        <span className="direction__badge" aria-hidden="true">
          <Icon
            className={direction === 'back' ? 'direction__badge-icon_back' : undefined}
            name="arrowThick"
            size={20}
          />
        </span>
        <Link className="button button_variant_outline-dark direction__change" to={ROUTES.trains}>
          Выбрать другой поезд
        </Link>
      </div>

      <div className="direction__train">
        <div className="direction__train-info">
          <span className="direction__train-icon">
            <Icon name="train" size={22} />
          </span>
          <div>
            <h3 className="direction__train-number">{trainNumber}</h3>
            <p className="direction__train-route">
              {origin && <span className="direction__train-origin">{origin} →</span>}
              <span>{fromCity} →</span>
              <span>{toCity}</span>
            </p>
          </div>
        </div>
        <div className="direction__times">
          <div className="direction__point">
            <time className="direction__time">{leg.from.time}</time>
            <span className="direction__city">{leg.from.city}</span>
            <span className="direction__station">{leg.from.station}</span>
          </div>
          <Icon
            className={`direction__arrow${direction === 'back' ? ' direction__arrow_back' : ''}`}
            name="arrowThick"
            size={20}
          />
          <div className="direction__point">
            <time className="direction__time">{leg.to.time}</time>
            <span className="direction__city">{leg.to.city}</span>
            <span className="direction__station">{leg.to.station}</span>
          </div>
        </div>
        <div className="direction__duration">
          <Icon className="direction__clock" name="clock" size={36} />
          <span>{durationText}</span>
        </div>
      </div>

      <h3 className="direction__title">Количество билетов</h3>
      <div className="tickets">
        <div className="tickets__group tickets__group_state_filled">
          <CountSelect id={`${id}-adults`} label="Взрослых" value={passengers.adults} />
          <p className="tickets__hint tickets__hint_strong">
            Можно добавить еще {MAX_PASSENGERS - passengers.adults} пассажиров
          </p>
        </div>
        <div
          className={`tickets__group${passengers.children > 0 ? ' tickets__group_state_focused' : ''}`}
        >
          <CountSelect id={`${id}-children`} label="Детских" value={passengers.children} />
          {passengers.children > 0 && (
            <p className="tickets__hint">
              Можно добавить еще 3 детей до 10 лет.Свое место в вагоне, как у взрослых, но дешевле в
              среднем на 50-65%
            </p>
          )}
        </div>
        <div className="tickets__group">
          <CountSelect
            id={`${id}-infants`}
            label="Детских «без места»"
            value={passengers.infants}
          />
        </div>
      </div>

      <h3 className="direction__title direction__title_divided">Тип вагона</h3>
      <div className="coach-types" role="group" aria-label="Тип вагона">
        {COACH_TYPES.map(({ type, label, icon, size }) => {
          const state = !coachType ? 'idle' : type === coachType ? 'active' : 'muted';

          return (
            <button
              key={type}
              className={`coach-types__item coach-types__item_state_${state}`}
              type="button"
              aria-pressed={type === coachType}
              onClick={() => setCoachType(type)}
            >
              <span className="coach-types__icon">
                <Icon name={icon} size={size} />
              </span>
              {label}
            </button>
          );
        })}
      </div>

      {coachType && coachSet && (
        <>
          <div className="coaches-bar">
            <span className="coaches-bar__list">
              Вагоны
              {coachSet.coachNumbers.map((number) => (
                <button
                  key={number}
                  className={`coaches-bar__number${shownNumbers.has(number) ? ' coaches-bar__number_current' : ''}`}
                  type="button"
                  aria-pressed={shownNumbers.has(number)}
                >
                  {number}
                </button>
              ))}
            </span>
            <span className="coaches-bar__note">Нумерация вагонов начинается с головы поезда</span>
          </div>

          {coachSet.coaches.map((coach) => (
            <Coach key={coach.number} type={coachType} coach={coach} />
          ))}
        </>
      )}
    </section>
  );
}
