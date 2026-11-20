import { Link } from 'react-router';
import { ROUTES } from '../shared/config/routes';
import { formatPrice } from '../shared/lib/formatPrice';
import { Icon } from '../shared/ui/Icon';
import { PageTitle } from '../shared/ui/PageTitle';
import './ConfirmationPage.css';
import { MOCK_CONFIRM_PASSENGERS, MOCK_TRIP_DETAILS } from '../mocks/order';
import { TripDetails } from '../features/trip-details/TripDetails';
import { MOCK_ROUTES } from '../mocks/trains';
import { TrainCard } from '../entities/train/TrainCard';

const [ROUTE] = MOCK_ROUTES;

/** Проверка заказа: поезд, пассажиры и способ оплаты, у каждого блока — «Изменить» */
export function ConfirmationPage() {
  return (
    <>
      <PageTitle title="Проверка заказа" />
      <TripDetails data={MOCK_TRIP_DETAILS} />
      <section aria-labelledby="confirmation-title">
        <h1 className="visually-hidden" id="confirmation-title">
          Проверка заказа
        </h1>

        <section className="confirm-card" aria-labelledby="confirm-train">
          <h2 className="confirm-card__title" id="confirm-train">
            Поезд
          </h2>
          {ROUTE && (
            <TrainCard
              route={ROUTE}
              embedded
              headingLevel={3}
              action={{ label: 'Изменить', to: ROUTES.trains }}
            />
          )}
        </section>

        <section className="confirm-card" aria-labelledby="confirm-passengers">
          <h2 className="confirm-card__title" id="confirm-passengers">
            Пассажиры
          </h2>
          <div className="confirm-card__body">
            <ul className="confirm-passengers">
              {MOCK_CONFIRM_PASSENGERS.map(({ id, type, name, info }) => (
                <li key={id} className="confirm-passenger">
                  <span className="confirm-passenger__type">
                    <Icon className="confirm-passenger__icon" name="accountCircle" size={82} />
                    {type}
                  </span>
                  <div>
                    <p className="confirm-passenger__name">{name}</p>
                    <dl className="confirm-passenger__info">
                      {info.map(([term, value]) => (
                        <div key={term}>
                          <dt>{term}</dt>
                          <dd>{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </li>
              ))}
            </ul>
            <div className="confirm-card__aside">
              <p className="confirm-total">
                Всего
                <b>{formatPrice(MOCK_TRIP_DETAILS.total)}</b>
                <Icon className="confirm-total__ruble" name="ruble" size={24} />
              </p>
              <Link
                className="button button_variant_outline confirm-card__change"
                to={ROUTES.passengers}
              >
                Изменить
              </Link>
            </div>
          </div>
        </section>

        <section className="confirm-card" aria-labelledby="confirm-payment">
          <h2 className="confirm-card__title" id="confirm-payment">
            Способ оплаты
          </h2>
          <div className="confirm-card__body">
            <p className="confirm-payment">Наличными</p>
            <div className="confirm-card__aside">
              <Link
                className="button button_variant_outline confirm-card__change"
                to={ROUTES.payment}
              >
                Изменить
              </Link>
            </div>
          </div>
        </section>

        <div className="confirm-next">
          <Link className="button button_variant_primary confirm-next__button" to={ROUTES.success}>
            Подтвердить
          </Link>
        </div>
      </section>
    </>
  );
}
