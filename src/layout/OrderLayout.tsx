import { Outlet } from 'react-router';
import { OrderHero } from './OrderHero';
import { OrderSteps } from './OrderSteps';
import { useOrderStep } from './useOrderStep';
import './OrderLayout.css';

/** Страницы заказа: шапка с горизонтальной формой поиска, полоса шагов, две колонки */
export function OrderLayout() {
  const step = useOrderStep();

  return (
    <>
      <OrderHero />
      {step && <OrderSteps current={step} />}
      <main className="order-page">
        <div className="container order-page__grid">
          <Outlet />
        </div>
      </main>
    </>
  );
}
