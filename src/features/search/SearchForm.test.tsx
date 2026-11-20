import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '../../shared/config/routes';
import { renderRoute } from '../../test/renderRoute';

const form = () => screen.getByRole('form', { name: 'Поиск билетов' });

describe('поиск билетов', () => {
  it('не уходит с пустой формой и показывает ошибки', async () => {
    const { user, router } = renderRoute(ROUTES.home);

    await user.click(within(form()).getByRole('button', { name: 'Найти билеты' }));

    expect(router.state.location.pathname).toBe(ROUTES.home);
    expect(within(form()).getByText('Укажите город отправления')).toBeInTheDocument();
    expect(within(form()).getByRole('combobox', { name: 'Откуда' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  });

  it('выбирает города из подсказок, меняет их местами и передаёт в адрес', async () => {
    const { user, router } = renderRoute(ROUTES.home);
    const from = within(form()).getByRole('combobox', { name: 'Откуда' });
    const to = within(form()).getByRole('combobox', { name: 'Куда' });

    await user.type(from, 'моск');
    await user.click(await screen.findByRole('option', { name: 'Москва' }));
    await user.type(to, 'санкт');
    await user.click(await screen.findByRole('option', { name: 'Санкт-Петербург' }));
    await user.click(within(form()).getByRole('button', { name: 'Поменять города местами' }));

    expect(from).toHaveValue('Санкт-Петербург');
    expect(to).toHaveValue('Москва');

    await user.click(within(form()).getByRole('button', { name: 'Найти билеты' }));
    expect(router.state.location.pathname).toBe(ROUTES.trains);
    expect(new URLSearchParams(router.state.location.search).get('from')).toBe('Санкт-Петербург');
  });

  it('шапка внутренних страниц заполнена из адреса', () => {
    renderRoute(`${ROUTES.trains}?from=Москва&to=Казань&date_start=2030-03-01`);

    expect(within(form()).getByRole('combobox', { name: 'Откуда' })).toHaveValue('Москва');
    expect(within(form()).getByRole('combobox', { name: 'Куда' })).toHaveValue('Казань');
    expect(within(form()).getByLabelText('Дата отправления')).toHaveValue('01.03.2030');
  });

  it('не принимает обратную дату раньше прямой', async () => {
    const { user } = renderRoute(
      `${ROUTES.trains}?from=Москва&to=Казань&date_start=2030-03-10&date_end=2030-03-01`,
    );

    await user.click(within(form()).getByRole('button', { name: 'Найти билеты' }));
    expect(within(form()).getByText('Обратно — не раньше, чем туда')).toBeInTheDocument();
  });
});
