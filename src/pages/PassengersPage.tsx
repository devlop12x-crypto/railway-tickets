import { Link } from 'react-router';
import { ROUTES } from '../shared/config/routes';
import { PageTitle } from '../shared/ui/PageTitle';
import { MOCK_TRIP_DETAILS } from '../mocks/order';
import { MOCK_PASSENGERS } from '../mocks/passengers';
import { TripDetails } from '../features/trip-details/TripDetails';
import { PassengerCard, PassengerStub } from '../features/passenger-form/PassengerCard';

export function PassengersPage() {
  return (
    <>
      <PageTitle title="Пассажиры" />
      <TripDetails data={MOCK_TRIP_DETAILS} />
      <section aria-labelledby="passengers-title">
        <h1 className="visually-hidden" id="passengers-title">
          Пассажиры
        </h1>
        {MOCK_PASSENGERS.map((passenger, index) => (
          <PassengerCard key={index} index={index + 1} passenger={passenger} />
        ))}
        <PassengerStub label="Пассажир 3" variant="collapsed" />
        <PassengerStub label="Добавить пассажира" variant="add" />
        <div className="order-next">
          {/* На макете «Далее» неактивна до заполнения формы — это валидация этапа 3 */}
          <Link className="button button_variant_primary order-next__button" to={ROUTES.payment}>
            Далее
          </Link>
        </div>
      </section>
    </>
  );
}
