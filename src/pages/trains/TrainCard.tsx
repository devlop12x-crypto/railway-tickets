import { Link } from 'react-router';
import { ROUTES } from '../../shared/config/routes';
import { formatPrice } from '../../shared/lib/formatPrice';
import { Amenities } from '../../shared/ui/Amenities';
import { Icon } from '../../shared/ui/Icon';
import { SEAT_CLASS_LABELS, type TrainRoute, type TripLeg, type TripPoint } from './types';
import './TrainCard.css';

function Point({ point, side }: { point: TripPoint; side: 'from' | 'to' }) {
  return (
    <div className={`train-card__point train-card__point_side_${side}`}>
      <time className="train-card__time">{point.time}</time>
      <span className="train-card__city">{point.city}</span>
      <span className="train-card__station">{point.station}</span>
    </div>
  );
}

function Leg({ leg, direction }: { leg: TripLeg; direction: 'there' | 'back' }) {
  return (
    <div className="train-card__leg">
      <Point point={leg.from} side="from" />
      <div className="train-card__duration">
        <span className="train-card__duration-text">{leg.duration}</span>
        <Icon
          className={`train-card__arrow train-card__arrow_direction_${direction}`}
          name="arrowThick"
          size={20}
        />
        <span className="visually-hidden">{direction === 'there' ? 'туда' : 'обратно'}</span>
      </div>
      <Point point={leg.to} side="to" />
    </div>
  );
}

interface TrainCardProps {
  route: TrainRoute;
  /** Карточка внутри другой карточки (страница проверки): без своей рамки и тени */
  embedded?: boolean;
  /** Кнопка справа внизу; по умолчанию «Выбрать места» */
  action?: { label: string; to: string };
}

export function TrainCard({ route, embedded = false, action }: TrainCardProps) {
  const { trainNumber, origin, fromCity, toCity, trainName, there, back, seats, amenities } = route;
  const classes = ['train-card'];
  if (back) classes.push('train-card_round-trip');
  if (embedded) classes.push('train-card_embedded');

  return (
    <article className={classes.join(' ')}>
      <div className="train-card__train">
        <span className="train-card__icon">
          <Icon name="train" size={64} />
        </span>
        <h3 className="train-card__number">{trainNumber}</h3>
        <p className="train-card__route">
          {origin && <span className="train-card__origin">{origin} →</span>}
          <span>{fromCity} →</span>
          <span>{toCity}</span>
          {trainName && <span>«{trainName}»</span>}
        </p>
      </div>

      <div className="train-card__legs">
        <Leg leg={there} direction="there" />
        {back && <Leg leg={back} direction="back" />}
      </div>

      <div className="train-card__offer">
        <ul className="train-card__seats">
          {seats.map(({ seatClass, count, minPrice }) => (
            <li key={seatClass} className="train-card__seat">
              <span className="train-card__class">{SEAT_CLASS_LABELS[seatClass]}</span>
              <span className="train-card__count">{count}</span>
              <span className="train-card__from">от</span>
              <span className="train-card__price">{formatPrice(minPrice)}</span>
              <Icon className="train-card__ruble" name="ruble" size={22} />
            </li>
          ))}
        </ul>
        <Amenities className="train-card__amenities" {...amenities} />
        {action ? (
          <Link className="button button_variant_outline train-card__action" to={action.to}>
            {action.label}
          </Link>
        ) : (
          <Link className="button button_variant_primary train-card__select" to={ROUTES.seats}>
            Выбрать места
          </Link>
        )}
      </div>
    </article>
  );
}
