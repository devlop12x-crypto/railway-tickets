import { OrderHero } from '../layout/OrderHero';
import { PageTitle } from '../shared/ui/PageTitle';
import { TrainLoader } from '../shared/ui/TrainLoader';
import './LoadingPage.css';

/**
 * Экран загрузки по макету: короткая шапка с формой поиска и анимация на тёмном фоне.
 * Сейчас открывается по адресу /loading; на этапе 4 его покажет поиск направлений.
 */
export function LoadingPage() {
  return (
    <>
      <PageTitle title="Идет поиск" />
      <OrderHero loading />
      <main className="loading-page">
        <h1 className="visually-hidden">Поиск билетов</h1>
        <TrainLoader />
      </main>
    </>
  );
}
