import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '../../shared/config/routes';
import { renderRoute } from '../../test/renderRoute';

describe('отзывы', () => {
  it('точки переключают страницы', async () => {
    const { user } = renderRoute(ROUTES.home);
    const pager = screen.getByRole('group', { name: 'Страницы отзывов' });
    const page = (n: number) => within(pager).getByRole('button', { name: `Страница ${n}` });

    expect(page(1)).toHaveAttribute('aria-current', 'true');
    await user.click(page(3));
    expect(page(3)).toHaveAttribute('aria-current', 'true');
    expect(page(1)).not.toHaveAttribute('aria-current');
  });
});
