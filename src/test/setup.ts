import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom не умеет прокрутку, а ScrollRestoration вызывает её на каждом переходе
// (перегрузки scrollTo не выражаются через vi.fn, поэтому — через stubGlobal)
vi.stubGlobal('scrollTo', vi.fn());
Element.prototype.scrollIntoView = vi.fn();

// В jsdom у <dialog> нет showModal/close — достаточно переключать атрибут open
HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
};

// globals в Vitest выключены, поэтому автоочистка Testing Library не срабатывает сама
afterEach(() => {
  cleanup();
});
