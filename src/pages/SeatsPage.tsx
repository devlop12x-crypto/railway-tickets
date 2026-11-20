import { Link } from 'react-router';
import { ROUTES } from '../shared/config/routes';
import { PageTitle } from '../shared/ui/PageTitle';
import { DirectionCard } from '../features/seat-selection/DirectionCard';
import { COACHES_BY_TYPE, SEATS_TRAIN } from '../mocks/seats';
import './SeatsPage.css';
import { LastTickets } from '../features/last-tickets/LastTickets';
import { MOCK_LAST_TICKETS, MOCK_ROUTES } from '../mocks/trains';
import { useTrainFilters } from '../features/filters/useTrainFilters';
import { TrainsFilters } from '../features/filters/TrainsFilters';

/**
 * Выбор мест туда и обратно. По умолчанию — макет «выбор мест» (купе);
 * кнопки типа вагона показывают схемы плацкарта, люкса и сидячего вагона.
 */
export function SeatsPage() {
  // На этапе 4 изменение фильтров здесь вернёт к выдаче поездов с новыми условиями
  const { filters, setFilters, bounds } = useTrainFilters(MOCK_ROUTES);

  return (
    <>
      <PageTitle title="Выбор мест" />
      <div>
        <TrainsFilters
          value={filters}
          onChange={setFilters}
          priceBounds={bounds}
          expandedDirections
        />
        <LastTickets tickets={MOCK_LAST_TICKETS} />
      </div>

      <section className="seats" aria-labelledby="seats-title">
        <h1 className="seats__title" id="seats-title">
          Выбор мест
        </h1>
        <DirectionCard
          {...SEATS_TRAIN}
          direction="there"
          passengers={{ adults: 2, children: 1, infants: 0 }}
          coachType="second"
          coachesByType={COACHES_BY_TYPE}
        />
        <DirectionCard
          {...SEATS_TRAIN}
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
