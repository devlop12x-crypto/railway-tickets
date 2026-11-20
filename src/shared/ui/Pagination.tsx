import { paginationRange } from '../lib/pagination';
import { Icon } from './Icon';
import './Pagination.css';

interface PaginationProps {
  current: number;
  total: number;
  label: string;
  onChange: (page: number) => void;
}

/** Пагинация по «экспликации»: стрелки, номера и «…» для пропущенных страниц */
export function Pagination({ current, total, label, onChange }: PaginationProps) {
  if (total <= 1) return null;

  return (
    <nav className="pagination" aria-label={label}>
      <button
        className="pagination__item"
        type="button"
        aria-label="Предыдущая страница"
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
      >
        <Icon name="chevronLeft" size={44} />
      </button>
      {paginationRange(current, total).map((page, index) =>
        page === 'gap' ? (
          <span
            key={`gap-${index}`}
            className="pagination__item pagination__gap"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            className={`pagination__item${page === current ? ' pagination__item_current' : ''}`}
            type="button"
            aria-label={`Страница ${page}`}
            aria-current={page === current ? 'page' : undefined}
            onClick={() => onChange(page)}
          >
            {page}
          </button>
        ),
      )}
      <button
        className="pagination__item"
        type="button"
        aria-label="Следующая страница"
        disabled={current === total}
        onClick={() => onChange(current + 1)}
      >
        <Icon name="chevronRight" size={44} />
      </button>
    </nav>
  );
}
