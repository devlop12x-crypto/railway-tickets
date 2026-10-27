import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// globals в Vitest выключены, поэтому автоочистка Testing Library не срабатывает сама
afterEach(() => {
  cleanup();
});
