import { Link } from 'react-router';
import { NAV_ITEMS, ROUTES } from '../shared/config/routes';
import './Header.css';

/** Шапка лежит поверх фото верхнего блока страницы (.page-hero) */
export function Header() {
  return (
    <header className="header">
      <div className="header__top">
        <div className="container">
          <Link className="logo header__logo" to={ROUTES.home}>
            Лого
          </Link>
        </div>
      </div>
      <nav className="header__nav" aria-label="Главное меню">
        <ul className="container header__menu">
          {NAV_ITEMS.map(({ label, anchor, scope }) => (
            <li key={anchor}>
              {/* Без pathname ссылка остаётся на текущей странице и меняет только hash */}
              <Link
                className="header__link"
                to={scope === 'home' ? { pathname: ROUTES.home, hash: anchor } : { hash: anchor }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
