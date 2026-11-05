import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { spaFallback } from './build/spaFallback.ts';
import { ROUTES } from './src/shared/config/routes.ts';

/** Страницы с постоянным адресом: /trains → trains.html. Главная — сам index.html */
const STATIC_PAGES = Object.values(ROUTES)
  .filter((path) => path !== '/')
  .map((path) => path.slice(1));

// base не зашит: при деплое workflow передаёт --base=/<имя-репозитория>/,
// поэтому переименование репозитория не ломает пути к ассетам.
export default defineConfig({
  plugins: [react(), spaFallback(STATIC_PAGES)],
  build: {
    rolldownOptions: {
      output: {
        // Библиотеки — отдельным чанком: они меняются реже кода приложения,
        // и после деплоя браузер берёт их из кэша
        codeSplitting: {
          groups: [{ name: 'vendor', test: /node_modules/ }],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
});
