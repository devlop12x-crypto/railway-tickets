import { useMatches } from 'react-router';
import type { OrderStep, RouteHandle } from '../shared/config/orderSteps';

/** Шаг заказа текущей страницы из handle самого глубокого маршрута, где он задан */
export function useOrderStep(): OrderStep | undefined {
  const matches = useMatches();

  for (let i = matches.length - 1; i >= 0; i -= 1) {
    const handle = matches[i]?.handle as RouteHandle | undefined;
    if (handle?.step) return handle.step;
  }

  return undefined;
}
