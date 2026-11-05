import { Link } from 'react-router';
import { ROUTES } from '../shared/config/routes';
import { PageTitle } from '../shared/ui/PageTitle';
import { DirectionCard } from './seats/DirectionCard';
import { COACHES_BY_TYPE, SEATS_LEG } from './seats/mock';
import './seats/SeatsPage.css';
import { LastTickets } from './trains/LastTickets';
import { MOCK_LAST_TICKETS } from './trains/mock';
import { TrainsFilters } from './trains/TrainsFilters';

const TRAIN = {
  trainNumber: '116С',
  origin: 'Адлер',
  fromCity: 'Москва',
  toCity: 'Санкт-Петербург',
  leg: SEATS_LEG,
  durationText: '9 часов\n42 минуты',
};

/**
 * Выбор мест туда и обратно. По умолчанию — макет «выбор мест» (купе);
 * кнопки типа вагона показывают схемы плацкарта, люкса и сидячего вагона.
 */
export function SeatsPage() {
  return (
    <>
      <PageTitle title="Выбор мест" />
      <div>
        <TrainsFilters expandedDirections />
        <LastTickets tickets={MOCK_LAST_TICKETS} />
      </div>

      <section className="seats" aria-labelledby="seats-title">
        <h1 className="seats__title" id="seats-title">
          Выбор мест
        </h1>
        <DirectionCard
          {...TRAIN}
          direction="there"
          passengers={{ adults: 2, children: 1, infants: 0 }}
          coachType="second"
          coachesByType={COACHES_BY_TYPE}
        />
        <DirectionCard
          {...TRAIN}
          direction="back"
          passengers={{ adults: 2, children: 0, infants: 0 }}
          coachesByType={COACHES_BY_TYPE}
        />
        <div className="seats__next">
          <Link className="button button_variant_primary seats__next-button" to={ROUTES.passengers}>
            Далее
          </Link>
        </div>
      </section>
    </>
  );
}
