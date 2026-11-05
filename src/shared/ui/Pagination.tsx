import { Icon } from './Icon';
import './Pagination.css';

interface PaginationProps {
  current: number;
  total: number;
  label: string;
}

/** Пагинация по макету. Переключение страниц подключается на этапе 4 */
export function Pagination({ current, total, label }: PaginationProps) {
  return (
    <nav className="pagination" aria-label={label}>
      <button className="pagination__item" type="button" aria-label="Предыдущая страница">
        <Icon name="chevronLeft" size={44} />
      </button>
      {Array.from({ length: total }, (_, index) => {
        const page = index + 1;
        const isCurrent = page === current;

        return (
          <button
            key={page}
            className={`pagination__item${isCurrent ? ' pagination__item_current' : ''}`}
            type="button"
            aria-current={isCurrent ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}
      <button className="pagination__item" type="button" aria-label="Следующая страница">
        <Icon name="chevronRight" size={44} />
      </button>
    </nav>
  );
}
