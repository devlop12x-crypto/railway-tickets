import { Outlet, ScrollRestoration } from 'react-router';
import { Footer } from './Footer';
import { Header } from './Header';

/**
 * Общий каркас страниц. ScrollRestoration возвращает позицию при «Назад»,
 * на новой странице прокручивает к началу, а при наличии hash — к элементу
 * с этим id: так работают якорные ссылки меню, в том числе с других страниц.
 */
export function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </>
  );
}
