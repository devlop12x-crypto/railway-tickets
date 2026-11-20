import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '../../shared/config/routes';
import { renderRoute } from '../../test/renderRoute';

const buy = () => screen.getByRole('button', { name: 'Купить билеты' });

describe('оплата', () => {
  it('без телефона, почты и способа оплаты не покупает и показывает ошибки', async () => {
    const { user, router } = renderRoute(ROUTES.payment);

    await user.click(buy());

    expect(router.state.location.pathname).toBe(ROUTES.payment);
    const phone = screen.getByLabelText('Контактный телефон');
    expect(phone).toHaveFocus();
    expect(phone).toHaveAccessibleDescription('Укажите телефон');
    expect(screen.getByLabelText('E-mail')).toHaveAccessibleDescription('Укажите e-mail');
    expect(screen.getByRole('group', { name: 'Способ оплаты' })).toHaveAccessibleDescription(
      'Выберите способ оплаты',
    );
  });

  it('маска телефона, проверка почты после ухода из поля', async () => {
    const { user } = renderRoute(ROUTES.payment);
    const phone = screen.getByLabelText('Контактный телефон');
    const email = screen.getByLabelText('E-mail');

    await user.type(phone, '89161234567');
    expect(phone).toHaveValue('+7 916 123 45 67');

    await user.type(email, 'inbox@gmail');
    expect(email).not.toHaveAttribute('aria-invalid');
    await user.tab();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription('E-mail указан некорректно. Пример: inbox@gmail.ru');
  });

  it('заполненная форма ведёт к проверке заказа', async () => {
    const { user, router } = renderRoute(ROUTES.payment);

    await user.type(screen.getByLabelText('Контактный телефон'), '9161234567');
    await user.type(screen.getByLabelText('E-mail'), 'inbox@gmail.ru');
    await user.click(screen.getByRole('radio', { name: 'Наличными' }));
    await user.click(buy());

    expect(router.state.location.pathname).toBe(ROUTES.confirmation);
  });
});
