import { formatPrice } from '../../shared/lib/formatPrice';
import { Icon } from '../../shared/ui/Icon';
import './TripDetails.css';

export interface TripDetailsLeg {
  date: string;
  trainNumber: string;
  /** Маршрут поезда: откуда и куда он идёт целиком */
  trainRoute: [string, string];
  duration: string;
  from: { time: string; date: string; city: string; station: string };
  to: { time: string; date: string; city: string; station: string };
}

export interface TripDetailsData {
  there: TripDetailsLeg;
  back?: TripDetailsLeg;
  passengers: { label: string; price: number }[];
  total: number;
}

function CollapseButton({ label }: { label: string }) {
  return (
    <button className="trip-details__collapse" type="button" aria-label={label} aria-expanded />
  );
}

function Leg({ leg, direction }: { leg: TripDetailsLeg; direction: 'there' | 'back' }) {
  const title = direction === 'there' ? 'Туда' : 'Обратно';

  return (
    <section className="trip-details__section" aria-label={title}>
      <div className="trip-details__head">
        <span className="trip-details__badge">
          <Icon name={direction === 'there' ? 'arrowForward' : 'arrowBack'} size={18} />
        </span>
        <h3 className="trip-details__title">{title}</h3>
        <span className="trip-details__date">{leg.date}</span>
        <CollapseButton label={`Свернуть: ${title}`} />
      </div>

      <dl className="trip-details__train">
        <dt>№ Поезда</dt>
        <dd className="trip-details__number">{leg.trainNumber}</dd>
        <dt>Название</dt>
        <dd className="trip-details__route">
          {leg.trainRoute[0]}
          <br />
          {leg.trainRoute[1]}
        </dd>
      </dl>

      <div className="trip-details__times">
        <div className="trip-details__point">
          <time className="trip-details__time">{leg.from.time}</time>
          <span className="trip-details__day">{leg.from.date}</span>
        </div>
        <div className="trip-details__duration">
          <span>{leg.duration}</span>
          <Icon
            className={`trip-details__arrow${direction === 'back' ? ' trip-details__arrow_back' : ''}`}
            name="arrowThick"
            size={20}
          />
        </div>
        <div className="trip-details__point trip-details__point_end">
          <time className="trip-details__time">{leg.to.time}</time>
          <span className="trip-details__day">{leg.to.date}</span>
        </div>
      </div>

      <div className="trip-details__stations">
        <p>
          {leg.from.city}
          <span className="trip-details__station">{leg.from.station}</span>
        </p>
        <p className="trip-details__point_end">
          {leg.to.city}
          <span className="trip-details__station">{leg.to.station}</span>
        </p>
      </div>
    </section>
  );
}

/** Боковая панель «Детали поездки» страниц пассажиров, оплаты и проверки */
export function TripDetails({ data }: { data: TripDetailsData }) {
  return (
    <aside className="trip-details" aria-labelledby="trip-details-title">
      <h2 className="trip-details__heading" id="trip-details-title">
        Детали поездки
      </h2>
      <Leg leg={data.there} direction="there" />
      {data.back && <Leg leg={data.back} direction="back" />}

      <section className="trip-details__section" aria-label="Пассажиры">
        <div className="trip-details__head">
          <Icon className="trip-details__person" name="person" size={30} />
          <h3 className="trip-details__title">Пассажиры</h3>
          <CollapseButton label="Свернуть: Пассажиры" />
        </div>
        <ul className="trip-details__passengers">
          {data.passengers.map(({ label, price }) => (
            <li key={label}>
              {label}
              <span className="trip-details__price">
                <b>{formatPrice(price)}</b>
                <Icon className="trip-details__ruble" name="ruble" size={17} />
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="trip-details__total">
        <span>Итог</span>
        <span className="trip-details__total-sum">
          <b>{formatPrice(data.total)}</b>
          <Icon className="trip-details__total-ruble" name="ruble" size={32} />
        </span>
      </div>
    </aside>
  );
}
