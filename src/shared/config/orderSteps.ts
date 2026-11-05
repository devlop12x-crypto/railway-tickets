/** Шаги полосы прогресса «Билеты — Пассажиры — Оплата — Проверка» */
export const ORDER_STEPS = ['Билеты', 'Пассажиры', 'Оплата', 'Проверка'] as const;

/** Номер шага, начиная с 1 */
export type OrderStep = 1 | 2 | 3 | 4;

/** handle маршрута: страница сама сообщает, какой шаг заказа она представляет */
export interface RouteHandle {
  step?: OrderStep;
}
