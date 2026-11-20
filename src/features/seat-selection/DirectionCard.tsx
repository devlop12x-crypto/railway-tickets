import { useId, useState } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '../../shared/config/routes';
import { formatPrice } from '../../shared/lib/formatPrice';
import { plural } from '../../shared/lib/plural';
import { Icon } from '../../shared/ui/Icon';
import type { IconName } from '../../shared/ui/icons';
import type { SeatClass, TripLeg } from '../../entities/train/types';
import {
  countByTier,
  isSeatOnSale,
  type CoachDetails,
  type CoachSet,
  type ServiceId,
  type ServiceState,
} from '../../entities/coach/coach';
import { CoachScheme } from '../../entities/coach/CoachScheme';
import {
  changeCoachType,
  changeCounts,
  coachTotal,
  countLimits,
  MAX_TICKETS,
  seatsNeeded,
  toggleCoach,
  toggleSeat,
  toggleService,
  type DirectionSelection,
  type TicketCounts,
} from './model';
import './DirectionCard.css';

interface DirectionCardProps {
  direction: 'there' | 'back';
  trainNumber: string;
  origin?: string;
  fromCity: string;
  toCity: string;
  leg: TripLeg;
  durationText: string;
  /** Все вагоны поезда по типам */
  coachesByType: Readonly<Record<SeatClass, CoachSet>>;
  value: DirectionSelection;
  onChange: (next: DirectionSelection) => void;
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

interface CoachProps {
  type: SeatClass;
  coach: CoachDetails;
  selection: DirectionSelection;
  total: number;
  onSeat: (seat: number) => void;
  onService: (service: ServiceId) => void;
}

/** Сведения о вагоне, услуги, схема и сумма за выбранные в нём места */
function Coach({ type, coach, selection, total, onSeat, onService }: CoachProps) {
  const onSale = [...coach.available].filter((seat) => isSeatOnSale(type, coach, seat));
  const counts = countByTier(type, onSale);
  const chosenServices = selection.services[coach.number] ?? [];
  const selected = new Set(
    selection.seats.filter((ref) => ref.coach === coach.number).map(({ seat }) => seat),
  );
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

  return (
    <div className="coach-block">
      <div className="coach">
        <div className="coach__badge">
          <span className="coach__number">{coach.number}</span>
          вагон
        </div>
        <div className="coach__column">
          <p className="coach__caption">
            Места <b className="coach__caption-value">{onSale.length}</b>
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
              {price === undefined ? (
                <b>нет в продаже</b>
              ) : (
                <>
                  <b>{formatPrice(price)}</b>
                  <Icon className="coach__ruble" name="ruble" size={20} />
                </>
              )}
            </p>
          ))}
        </div>
        <div className="coach__column">
          <p className="coach__caption">
            Обслуживание <span className="coach__company">ФПК</span>
          </p>
          <ul className="coach__services">
            {SERVICES.map(({ id: serviceId, icon, label }) => {
              const offer = coach.services[serviceId];
              const isOn = chosenServices.includes(serviceId);
              const state: ServiceState = typeof offer === 'number' ? (isOn ? 'on' : 'off') : offer;
              const description =
                offer === 'included'
                  ? 'включено в стоимость'
                  : offer === 'none'
                    ? 'нет в вагоне'
                    : `${formatPrice(offer)} ₽ за пассажира`;

              return (
                <li key={serviceId}>
                  <button
                    className={`coach__service coach__service_state_${state}`}
                    type="button"
                    title={`${label}: ${description}`}
                    aria-label={`${label}: ${description}`}
                    aria-pressed={typeof offer === 'number' ? isOn : undefined}
                    disabled={typeof offer !== 'number'}
                    onClick={() => onService(serviceId)}
                  >
                    <Icon name={icon} size={22} />
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="coach__watching">{coach.watching} человек выбирают места в этом поезде</p>
        </div>
      </div>

      <div className="direction__scheme">
        <CoachScheme type={type} coach={coach} selected={selected} onToggle={onSeat} />
      </div>

      {total > 0 && (
        <p className="coach-block__total">
          <span className="visually-hidden">Итого по вагону {coach.number}: </span>
          <b>{formatPrice(total)}</b>
          <Icon className="coach__ruble" name="ruble" size={20} />
        </p>
      )}
    </div>
  );
}

interface CountSelectProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

/** Список количества: все значения видны, недоступные при текущем заказе — выключены */
function CountSelect({ id, label, value, min, max, onChange }: CountSelectProps) {
  return (
    <>
      <label className="visually-hidden" htmlFor={id}>
        {label}
      </label>
      <select
        className="tickets__select"
        id={id}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {Array.from({ length: MAX_TICKETS + 1 }, (_, count) => (
          <option key={count} value={count} disabled={count < min || count > max}>
            {label} — {count}
          </option>
        ))}
      </select>
    </>
  );
}

/** Выбор мест в одном направлении: поезд, количество билетов, тип вагона, схемы */
export function DirectionCard(props: DirectionCardProps) {
  const { direction, trainNumber, origin, fromCity, toCity, leg, durationText } = props;
  const { coachesByType, value, onChange } = props;
  const id = useId();
  // Подсказка про лимит живёт только в карточке: родителю она не нужна
  const [limitHit, setLimitHit] = useState(false);
  const { counts, coachType } = value;
  const coaches = coachType ? coachesByType[coachType] : undefined;
  const limits = countLimits(counts);
  const needed = seatsNeeded(counts);
  const left = MAX_TICKETS - needed;
  const title = direction === 'there' ? 'Туда' : 'Обратно';

  const update = (next: DirectionSelection) => {
    setLimitHit(false);
    onChange(next);
  };
  const setCount = (key: keyof TicketCounts) => (count: number) =>
    update(changeCounts(value, { ...counts, [key]: count }));

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
          <CountSelect
            id={`${id}-adults`}
            label="Взрослых"
            value={counts.adults}
            min={1}
            max={limits.adults}
            onChange={setCount('adults')}
          />
          <p className="tickets__hint tickets__hint_strong">
            {left > 0
              ? `Можно добавить еще ${left} ${plural(left, ['пассажира', 'пассажира', 'пассажиров'])}`
              : `В одном заказе не больше ${MAX_TICKETS} билетов с местом`}
          </p>
        </div>
        <div
          className={`tickets__group${counts.children > 0 ? ' tickets__group_state_filled' : ''}`}
        >
          <CountSelect
            id={`${id}-children`}
            label="Детских"
            value={counts.children}
            min={0}
            max={limits.children}
            onChange={setCount('children')}
          />
          <p className="tickets__hint">
            {left > 0 &&
              `Можно добавить еще ${left} ${plural(left, ['ребенка', 'детей', 'детей'])} до 10 лет. `}
            Свое место в вагоне, как у взрослых, но дешевле в среднем на 50-65%
          </p>
        </div>
        <div
          className={`tickets__group${counts.infants > 0 ? ' tickets__group_state_filled' : ''}`}
        >
          <CountSelect
            id={`${id}-infants`}
            label="Детских «без места»"
            value={counts.infants}
            min={0}
            max={limits.infants}
            onChange={setCount('infants')}
          />
          <p className="tickets__hint">
            Дети до 5 лет едут вместе со взрослым — не больше одного на каждого взрослого
          </p>
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
              onClick={() => update(changeCoachType(value, type, coachesByType[type]))}
            >
              <span className="coach-types__icon">
                <Icon name={icon} size={size} />
              </span>
              {label}
            </button>
          );
        })}
      </div>

      {coachType && coaches && (
        <>
          <div className="coaches-bar">
            <span className="coaches-bar__list" role="group" aria-label="Вагоны">
              Вагоны
              {coaches
                .map(({ number }) => number)
                .sort()
                .map((number) => {
                  const isShown = value.shown.includes(number);

                  return (
                    <button
                      key={number}
                      className={`coaches-bar__number${isShown ? ' coaches-bar__number_current' : ''}`}
                      type="button"
                      aria-label={`Вагон ${number}`}
                      aria-pressed={isShown}
                      onClick={() => update(toggleCoach(value, number))}
                    >
                      {number}
                    </button>
                  );
                })}
            </span>
            <span className="coaches-bar__note">Нумерация вагонов начинается с головы поезда</span>
          </div>

          <p
            className={`direction__status${limitHit ? ' direction__status_warning' : ''}`}
            role="status"
          >
            Выбрано {value.seats.length} из {needed} {plural(needed, ['места', 'мест', 'мест'])}.
            {limitHit &&
              ' Места на все билеты уже выбраны: снимите отметку с другого места или добавьте билет.'}
          </p>

          {value.shown.map((number) => {
            const coach = coaches.find((item) => item.number === number);
            if (!coach) return null;

            return (
              <Coach
                key={number}
                type={coachType}
                coach={coach}
                selection={value}
                total={coachTotal(value, coaches, number)}
                onSeat={(seat) => {
                  const result = toggleSeat(value, { coach: number, seat });
                  if (result.ok) update(result.state);
                  else setLimitHit(true);
                }}
                onService={(service) => update(toggleService(value, number, service))}
              />
            );
          })}
        </>
      )}
    </section>
  );
}
