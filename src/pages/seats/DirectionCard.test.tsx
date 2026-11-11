import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '../../shared/config/routes';
import { renderRoute } from '../../test/renderRoute';

describe('выбор мест', () => {
  it('по типу вагона показывает его схему', async () => {
    const { user } = renderRoute(ROUTES.seats);
    const there = screen.getByRole('region', { name: 'Туда' });

    expect(within(there).getByRole('group', { name: 'Схема вагона 07' })).toBeInTheDocument();

    await user.click(within(there).getByRole('button', { name: 'Плацкарт' }));

    // В плацкарте на макете два вагона и боковые места
    expect(within(there).getByRole('group', { name: 'Схема вагона 12' })).toBeInTheDocument();
    expect(within(there).getByRole('group', { name: 'Схема вагона 10' })).toBeInTheDocument();
    expect(
      within(there).getByRole('button', { name: 'Место 33, боковое, свободно' }),
    ).toBeEnabled();
    // Строки ярусов сходятся с общим числом мест: у обоих вагонов есть «Боковые»
    expect(within(there).getAllByText('Боковые')).toHaveLength(2);
  });

  it('занятые места недоступны, выбранные отмечены', async () => {
    const { user } = renderRoute(ROUTES.seats);
    const there = screen.getByRole('region', { name: 'Туда' });

    expect(within(there).getByRole('button', { name: 'Место 2, верхнее, занято' })).toBeDisabled();

    await user.click(within(there).getByRole('button', { name: 'Сидячий' }));

    expect(within(there).getByRole('button', { name: 'Место 12, выбрано' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(within(there).getByText('5 760')).toBeInTheDocument();
  });
});
