import { createBrowserRouter } from 'react-router';
import { routes } from './routes';

// BASE_URL: '/' в разработке, '/<репозиторий>/' в сборке для GitHub Pages
export const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });
