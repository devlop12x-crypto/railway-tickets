import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base не зашит: при деплое workflow передаёт --base=/<имя-репозитория>/,
// поэтому переименование репозитория не ломает пути к ассетам.
export default defineConfig({
  plugins: [react()],
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
