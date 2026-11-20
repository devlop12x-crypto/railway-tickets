import { useState } from 'react';
import { TrainCard } from '../entities/train/TrainCard';
import { filterRoutes, sortRoutes, type SortKey } from '../features/filters/model';
import { TrainsFilters } from '../features/filters/TrainsFilters';
import { useTrainFilters } from '../features/filters/useTrainFilters';
import { LastTickets } from '../features/last-tickets/LastTickets';
import { MOCK_LAST_TICKETS, MOCK_ROUTES } from '../mocks/trains';
import { InlineSelect, type SelectOption } from '../shared/ui/InlineSelect';
import { PageTitle } from '../shared/ui/PageTitle';
import { Pagination } from '../shared/ui/Pagination';
import './TrainsPage.css';

const PAGE_SIZES = [5, 10, 20] as const;

const SORT_OPTIONS: readonly SelectOption<SortKey>[] = [
  { value: 'date', label: 'времени' },
  { value: 'price', label: 'стоимости' },
  { value: 'duration', label: 'длительности' },
];

/**
 * Выбор поезда: фильтры и последние билеты слева, направления справа.
 * Сейчас фильтры, сортировка и страницы работают над данными макета;
 * на этапе 4 те же значения станут параметрами запроса /routes.
 */
export function TrainsPage() {
  const { filters, setFilters, bounds } = useTrainFilters(MOCK_ROUTES);
  const [sort, setSort] = useState<SortKey>('date');
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);

  const found = sortRoutes(filterRoutes(MOCK_ROUTES, filters), sort);
  const pages = Math.max(1, Math.ceil(found.length / pageSize));
  // Фильтр мог сократить выдачу — не оставаться на несуществующей странице
  const current = Math.min(page, pages);
  const visible = found.slice((current - 1) * pageSize, current * pageSize);

  return (
    <>
      <PageTitle title="Выбор поезда" />
      <div>
        <TrainsFilters
          value={filters}
          priceBounds={bounds}
          onChange={(next) => {
            setFilters(next);
            setPage(1);
          }}
        />
        <LastTickets tickets={MOCK_LAST_TICKETS} />
      </div>

      <section className="trains" aria-labelledby="trains-title">
        <h1 className="visually-hidden" id="trains-title">
          Выбор поезда
        </h1>
        <div className="trains__toolbar">
          <span aria-live="polite">найдено {found.length}</span>
          <span className="trains__sort">
            <InlineSelect
              label="сортировать по"
              value={sort}
              options={SORT_OPTIONS}
              onChange={(next) => {
                setSort(next);
                setPage(1);
              }}
            />
          </span>
          <span className="trains__limit" role="group" aria-label="Показывать по">
            показывать по:
            {PAGE_SIZES.map((size) => (
              <button
                key={size}
                className={`trains__size${size === pageSize ? ' trains__size_current' : ''}`}
                type="button"
                aria-pressed={size === pageSize}
                onClick={() => {
                  setPageSize(size);
                  setPage(1);
                }}
              >
                {size}
              </button>
            ))}
          </span>
        </div>

        {visible.length > 0 ? (
          <ul className="trains__list" aria-label="Поезда">
            {visible.map((route) => (
              <li key={route.id}>
                <TrainCard route={route} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="trains__empty">
            По таким условиям поездов нет. Ослабьте фильтры: включите больше классов вагонов или
            расширьте цену и время.
          </p>
        )}

        <div className="trains__pagination">
          <Pagination
            current={current}
            total={pages}
            label="Страницы результатов"
            onChange={(next) => {
              setPage(next);
              document.getElementById('trains-title')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </section>
    </>
  );
}
