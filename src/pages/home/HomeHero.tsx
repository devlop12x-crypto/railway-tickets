import { SearchForm } from '../../features/search/SearchForm';
import './HomeHero.css';

export function HomeHero() {
  return (
    <section className="page-hero home-hero" aria-label="Поиск билетов">
      <div className="container home-hero__inner">
        <h1 className="home-hero__title">
          Вся жизнь - <b className="home-hero__accent">путешествие!</b>
        </h1>
        <SearchForm variant="hero" />
      </div>
    </section>
  );
}
