import { Outlet } from 'react-router';
import { SearchForm } from '../features/search/SearchForm';
import { OrderSteps } from './OrderSteps';
import { useOrderStep } from './useOrderStep';
import './OrderLayout.css';

/** Страницы заказа: шапка с горизонтальной формой поиска, полоса шагов, две колонки */
export function OrderLayout() {
  const step = useOrderStep();

  return (
    <>
      <section className="page-hero order-hero" aria-label="Поиск билетов">
        <div className="container">
          <SearchForm variant="compact" />
        </div>
      </section>
      {step && <OrderSteps current={step} />}
      <main className="order-page">
        <div className="container order-page__grid">
          <Outlet />
        </div>
      </main>
    </>
  );
}
