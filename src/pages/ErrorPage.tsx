import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { ROUTES } from '../shared/config/routes';
import { PageTitle } from '../shared/ui/PageTitle';

/** Ошибка рендера страницы. Шапка и футер остаются: errorElement висит внутри RootLayout */
export function ErrorPage() {
  const error = useRouteError();
  const details = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : null;

  return (
    <main className="message-page">
      <PageTitle title="Ошибка" />
      <h1>Что-то пошло не так</h1>
      {details && <p>{details}</p>}
      <Link className="button button_variant_primary" to={ROUTES.home}>
        На главную
      </Link>
    </main>
  );
}
