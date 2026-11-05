import { formatPrice } from '../../shared/lib/formatPrice';
import { Amenities } from '../../shared/ui/Amenities';
import { Icon } from '../../shared/ui/Icon';
import type { LastTicket } from './types';
import './LastTickets.css';

export function LastTickets({ tickets }: { tickets: LastTicket[] }) {
  return (
    <section className="last-tickets" aria-labelledby="last-tickets-title">
      <h2 className="last-tickets__title" id="last-tickets-title">
        Последние билеты
      </h2>
      <ul className="last-tickets__list">
        {tickets.map(({ id, from, to, minPrice }) => (
          <li key={id} className="last-ticket">
            <div className="last-ticket__route">
              <div>
                <p className="last-ticket__city">{from.city}</p>
                <p className="last-ticket__station">{from.station}</p>
              </div>
              <div className="last-ticket__to">
                <p className="last-ticket__city">{to.city}</p>
                <p className="last-ticket__station">{to.station}</p>
              </div>
            </div>
            <div className="last-ticket__bottom">
              <Amenities className="last-ticket__amenities" wifi express food />
              <p className="last-ticket__price">
                <span className="last-ticket__from">от</span>
                <b className="last-ticket__amount">{formatPrice(minPrice)}</b>
                <Icon className="last-ticket__ruble" name="ruble" size={28} />
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
