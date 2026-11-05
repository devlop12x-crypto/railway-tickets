import type { RouteObject } from 'react-router';
import { OrderLayout } from '../layout/OrderLayout';
import { RootLayout } from '../layout/RootLayout';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { ErrorPage } from '../pages/ErrorPage';
import { HomePage } from '../pages/HomePage';
import { LoadingPage } from '../pages/LoadingPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { PassengersPage } from '../pages/PassengersPage';
import { PaymentPage } from '../pages/PaymentPage';
import { SeatsPage } from '../pages/SeatsPage';
import { SuccessPage } from '../pages/SuccessPage';
import { TrainsPage } from '../pages/TrainsPage';
import type { OrderStep, RouteHandle } from '../shared/config/orderSteps';
import { ROUTES } from '../shared/config/routes';

const step = (value: OrderStep): RouteHandle => ({ step: value });

/** Дерево маршрутов. Отдельно от роутера, чтобы тесты собирали его на memory-истории */
export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        // Беспутевой маршрут с errorElement: при ошибке страницы шапка и футер остаются
        errorElement: <ErrorPage />,
        children: [
          { path: ROUTES.home, element: <HomePage /> },
          {
            element: <OrderLayout />,
            children: [
              { path: ROUTES.trains, element: <TrainsPage />, handle: step(1) },
              { path: ROUTES.seats, element: <SeatsPage />, handle: step(1) },
              { path: ROUTES.passengers, element: <PassengersPage />, handle: step(2) },
              { path: ROUTES.payment, element: <PaymentPage />, handle: step(3) },
              { path: ROUTES.confirmation, element: <ConfirmationPage />, handle: step(4) },
            ],
          },
          { path: ROUTES.success, element: <SuccessPage /> },
          { path: ROUTES.loading, element: <LoadingPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
];
