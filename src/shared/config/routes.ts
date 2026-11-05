/** Адреса страниц. Все пути — в одном месте: роутер, ссылки и сборка берут их отсюда */
export const ROUTES = {
  home: '/',
  trains: '/trains',
  seats: '/seats',
  passengers: '/passengers',
  payment: '/payment',
  confirmation: '/confirmation',
  success: '/success',
  /** Экран загрузки поиска; на этапе 4 он будет показываться во время запроса направлений */
  loading: '/loading',
} as const;

/** id секций для якорных ссылок меню */
export const ANCHORS = {
  about: 'about',
  howItWorks: 'how-it-works',
  reviews: 'reviews',
  contacts: 'contacts',
} as const;

type Anchor = (typeof ANCHORS)[keyof typeof ANCHORS];

export interface NavItem {
  label: string;
  anchor: Anchor;
  /**
   * home — секция есть только на главной: ссылка ведёт на /#anchor с любой страницы.
   * page — блок есть на каждой странице (контакты в футере): ссылка остаётся на текущей.
   */
  scope: 'home' | 'page';
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'О нас', anchor: ANCHORS.about, scope: 'home' },
  { label: 'Как это работает', anchor: ANCHORS.howItWorks, scope: 'home' },
  { label: 'Отзывы', anchor: ANCHORS.reviews, scope: 'home' },
  { label: 'Контакты', anchor: ANCHORS.contacts, scope: 'page' },
];
