import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '../shared/config/routes';
import { renderRoute } from '../test/renderRoute';

describe('подписка в подвале', () => {
  it('проверяет адрес и сообщает об успехе окном', async () => {
    const { user } = renderRoute(ROUTES.home);
    const email = screen.getByLabelText('Будьте в курсе событий');
    const send = screen.getByRole('button', { name: 'Отправить' });

    await user.click(send);
    expect(email).toHaveAccessibleDescription('Укажите e-mail');

    await user.type(email, 'inbox@gmail');
    // Начал исправлять — ошибка ушла
    expect(email).not.toHaveAttribute('aria-invalid');
    await user.click(send);
    expect(email).toHaveAttribute('aria-invalid', 'true');

    await user.type(email, '.ru');
    await user.click(send);
    expect(screen.getByRole('dialog', { name: 'Вы подписаны' })).toHaveTextContent(
      'inbox@gmail.ru',
    );
    expect(email).toHaveValue('');

    await user.click(screen.getByRole('button', { name: 'Понятно' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
