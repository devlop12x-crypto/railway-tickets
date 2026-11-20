import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '../../shared/config/routes';
import { renderRoute } from '../../test/renderRoute';

describe('детали поездки', () => {
  it('разделы сворачиваются и разворачиваются', async () => {
    const { user } = renderRoute(ROUTES.payment);
    const panel = screen.getByRole('complementary', { name: 'Детали поездки' });
    const there = within(panel).getByRole('region', { name: 'Туда' });

    expect(within(there).getByText('№ Поезда')).toBeVisible();

    await user.click(within(there).getByRole('button', { name: 'Свернуть: Туда' }));
    expect(within(there).getByText('№ Поезда')).not.toBeVisible();

    const expand = within(there).getByRole('button', { name: 'Развернуть: Туда' });
    expect(expand).toHaveAttribute('aria-expanded', 'false');
    await user.click(expand);
    expect(within(there).getByText('№ Поезда')).toBeVisible();
  });
});
