const SITE_NAME = 'Заказ ж/д билетов';

interface PageTitleProps {
  /** Без значения — только название сайта (главная) */
  title?: string;
}

/** React 19 поднимает <title> в <head> сам */
export function PageTitle({ title }: PageTitleProps) {
  return <title>{title ? `${title} — ${SITE_NAME}` : SITE_NAME}</title>;
}
