import { SearchForm } from '../features/search/SearchForm';
import './OrderHero.css';

interface OrderHeroProps {
  /** Экран загрузки: шапка ниже, кнопка поиска в нажатом состоянии */
  loading?: boolean;
}

/** Шапка страниц заказа и экрана загрузки: фото и горизонтальная форма поиска */
export function OrderHero({ loading = false }: OrderHeroProps) {
  return (
    <section
      className={`page-hero order-hero${loading ? ' order-hero_loading' : ''}`}
      aria-label="Поиск билетов"
    >
      <div className="container">
        <SearchForm variant="compact" loading={loading} />
      </div>
    </section>
  );
}
