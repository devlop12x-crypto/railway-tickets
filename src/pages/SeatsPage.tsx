import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../shared/config/routes';
import { plural } from '../shared/lib/plural';
import { PageTitle } from '../shared/ui/PageTitle';
import { DirectionCard } from '../features/seat-selection/DirectionCard';
import {
  createSelection,
  isComplete,
  seatsNeeded,
  type DirectionSelection,
} from '../features/seat-selection/model';
import { COACHES_BY_TYPE, SEATS_TRAIN } from '../mocks/seats';
import { LastTickets } from '../features/last-tickets/LastTickets';
import { MOCK_LAST_TICKETS, MOCK_ROUTES } from '../mocks/trains';
import { useTrainFilters } from '../features/filters/useTrainFilters';
import { TrainsFilters } from '../features/filters/TrainsFilters';
import './SeatsPage.css';

const SEATS_WORDS = ['место', 'места', 'мест'] as const;

function missingText(label: string, state: DirectionSelection) {
  const left = seatsNeeded(state.counts) - state.seats.length;
  return `${label} — еще ${left} ${plural(left, SEATS_WORDS)}`;
}

/**
 * Выбор мест туда и обратно. Количество билетов на макете — 2 взрослых и ребёнок туда,
 * 2 взрослых обратно; купе «туда» открыто, как на макете «выбор мест».
 * На этапе 4 выбор уйдёт в общее состояние заказа, а «Далее» передаст его пассажирам.
 */
export function SeatsPage() {
  // На этапе 4 изменение фильтров здесь вернёт к выдаче поездов с новыми условиями
  const { filters, setFilters, bounds } = useTrainFilters(MOCK_ROUTES);
  const navigate = useNavigate();
  const [there, setThere] = useState(() =>
    createSelection({ adults: 2, children: 1, infants: 0 }, 'second', COACHES_BY_TYPE.second),
  );
  const [back, setBack] = useState(() => createSelection({ adults: 2, children: 0, infants: 0 }));

  const missing = [
    !isComplete(there) && missingText('туда', there),
    !isComplete(back) && missingText('обратно', back),
  ].filter(Boolean);

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
          coachesByType={COACHES_BY_TYPE}
          value={there}
          onChange={setThere}
        />
        <DirectionCard
          {...SEATS_TRAIN}
          direction="back"
          coachesByType={COACHES_BY_TYPE}
          value={back}
          onChange={setBack}
        />
        <div className="seats__next">
          {missing.length > 0 && (
            <p className="seats__hint" id="seats-missing">
              Выберите места: {missing.join(', ')}
            </p>
          )}
          <button
            className="button button_variant_primary seats__next-button"
            type="button"
            disabled={missing.length > 0}
            aria-describedby={missing.length > 0 ? 'seats-missing' : undefined}
            onClick={() => void navigate(ROUTES.passengers)}
          >
            Далее
          </button>
        </div>
      </section>
    </>
  );
}
