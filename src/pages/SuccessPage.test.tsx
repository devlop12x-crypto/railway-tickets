import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '../shared/config/routes';
import { renderRoute } from '../test/renderRoute';

describe('оценка сервиса', () => {
  it('клик ставит оценку и благодарит', async () => {
    const { user } = renderRoute(ROUTES.success);

    await user.click(screen.getByRole('button', { name: 'Оценка 4 из 5' }));

    expect(screen.getByRole('button', { name: 'Оценка 4 из 5' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('status')).toHaveTextContent('Спасибо за оценку!');
  });
});
