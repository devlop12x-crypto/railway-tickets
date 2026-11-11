import { Link } from 'react-router';
import { ROUTES } from '../shared/config/routes';
import { PageTitle } from '../shared/ui/PageTitle';
import { MOCK_TRIP_DETAILS } from './order/mock';
import { TripDetails } from './order/TripDetails';
import { PassengerCard, PassengerStub, type PassengerDraft } from './passengers/PassengerCard';

/** Пассажиры с макета: взрослая Ирина и ребёнок Кирилл, третий — свёрнут */
const PASSENGERS: PassengerDraft[] = [
  {
    type: 'adult',
    lastName: 'Мартынюк',
    firstName: 'Ирина',
    patronymic: 'Эдуардовна',
    gender: 'female',
    birthDate: '',
    limitedMobility: false,
    document: 'passport',
    series: '',
    number: '',
  },
  {
    type: 'child',
    lastName: '',
    firstName: '',
    patronymic: '',
    gender: 'male',
    birthDate: '',
    limitedMobility: false,
    document: 'birth',
    series: '',
    number: '',
  },
];

export function PassengersPage() {
  return (
    <>
      <PageTitle title="Пассажиры" />
      <TripDetails data={MOCK_TRIP_DETAILS} />
      <section aria-labelledby="passengers-title">
        <h1 className="visually-hidden" id="passengers-title">
          Пассажиры
        </h1>
        {PASSENGERS.map((passenger, index) => (
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
