// Глобальные стили — первыми: стили компонентов идут после них и могут их уточнять
// Roboto из npm, без внешнего CDN. Только кириллица и латиница
import '@fontsource/roboto/cyrillic-100.css';
import '@fontsource/roboto/latin-100.css';
import '@fontsource/roboto/cyrillic-300.css';
import '@fontsource/roboto/latin-300.css';
import '@fontsource/roboto/cyrillic-300-italic.css';
import '@fontsource/roboto/latin-300-italic.css';
import '@fontsource/roboto/cyrillic-400.css';
import '@fontsource/roboto/latin-400.css';
import '@fontsource/roboto/cyrillic-500.css';
import '@fontsource/roboto/latin-500.css';
import '@fontsource/roboto/cyrillic-700.css';
import '@fontsource/roboto/latin-700.css';
import '@fontsource/roboto/cyrillic-900.css';
import '@fontsource/roboto/latin-900.css';
import './index.css';
import './shared/ui/button.css';
import './shared/ui/form.css';
import './shared/ui/order-card.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { router } from './app/router';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Не найден корневой элемент #root');
}

createRoot(container).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
