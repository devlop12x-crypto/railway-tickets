import { SearchForm } from '../features/search/SearchForm';
import { PageTitle } from '../shared/ui/PageTitle';
import { TrainLoader } from '../shared/ui/TrainLoader';
import '../layout/OrderLayout.css';
import './loading/LoadingPage.css';

/**
 * Экран загрузки по макету: короткая шапка с формой поиска и анимация на тёмном фоне.
 * Сейчас открывается по адресу /loading; на этапе 4 его покажет поиск направлений.
 */
export function LoadingPage() {
  return (
    <>
      <PageTitle title="Идет поиск" />
      <section className="page-hero order-hero loading-hero" aria-label="Поиск билетов">
        <div className="container">
          <SearchForm variant="compact" loading />
        </div>
      </section>
      <main className="loading-page">
        <h1 className="visually-hidden">Поиск билетов</h1>
        <TrainLoader />
      </main>
    </>
  );
}
