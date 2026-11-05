import { Link } from 'react-router';
import { ROUTES } from '../shared/config/routes';
import { PageTitle } from '../shared/ui/PageTitle';

export function NotFoundPage() {
  return (
    <main className="message-page">
      <PageTitle title="Страница не найдена" />
      <h1>Страница не найдена</h1>
      <Link className="button button_variant_primary" to={ROUTES.home}>
        На главную
      </Link>
    </main>
  );
}
