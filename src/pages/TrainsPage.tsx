import { PageTitle } from '../shared/ui/PageTitle';
import { Pagination } from '../shared/ui/Pagination';
import { LastTickets } from './trains/LastTickets';
import { MOCK_LAST_TICKETS, MOCK_ROUTES, MOCK_TOTAL_COUNT } from './trains/mock';
import { TrainCard } from './trains/TrainCard';
import { TrainsFilters } from './trains/TrainsFilters';
import './trains/TrainsPage.css';

const PAGE_SIZES = [5, 10, 20];

/**
 * Выбор поезда: фильтры и последние билеты слева, направления справа.
 * Сортировка, размер страницы и пагинация оживут на этапах 3–4.
 */
export function TrainsPage() {
  return (
    <>
      <PageTitle title="Выбор поезда" />
      <div>
        <TrainsFilters />
        <LastTickets tickets={MOCK_LAST_TICKETS} />
      </div>

      <section className="trains" aria-labelledby="trains-title">
        <h1 className="visually-hidden" id="trains-title">
          Выбор поезда
        </h1>
        <div className="trains__toolbar">
          <span>найдено {MOCK_TOTAL_COUNT}</span>
          <span className="trains__sort">
            сортировать по: <b className="trains__value">времени</b>
          </span>
          <span className="trains__limit">
            показывать по:
            {PAGE_SIZES.map((size, index) => (
              <button
                key={size}
                className={`trains__size${index === 0 ? ' trains__value' : ''}`}
                type="button"
                aria-pressed={index === 0}
              >
                {size}
              </button>
            ))}
          </span>
        </div>

        <ul className="trains__list">
          {MOCK_ROUTES.map((route) => (
            <li key={route.id}>
              <TrainCard route={route} />
            </li>
          ))}
        </ul>

        <div className="trains__pagination">
          <Pagination current={1} total={3} label="Страницы результатов" />
        </div>
      </section>
    </>
  );
}
