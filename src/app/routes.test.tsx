import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '../shared/config/routes';
import { renderRoute } from '../test/renderRoute';

const heading = (name: string) => screen.getByRole('heading', { level: 1, name });

describe('маршруты', () => {
  it('проходит весь заказ от главной до благодарности', async () => {
    const { user, router } = renderRoute(ROUTES.home);

    await user.click(screen.getByRole('button', { name: 'Найти билеты' }));
    expect(heading('Выбор поезда')).toBeInTheDocument();

    const [selectSeats] = screen.getAllByRole('link', { name: 'Выбрать места' });
    if (!selectSeats) throw new Error('Нет кнопки «Выбрать места»');
    await user.click(selectSeats);
    expect(heading('Выбор мест')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Далее' }));
    expect(heading('Пассажиры')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Далее' }));
    expect(heading('Персональные данные и способ оплаты')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Купить билеты' }));
    expect(heading('Проверка заказа')).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Подтвердить' }));
    expect(heading('Благодарим Вас за заказ!')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(ROUTES.success);
  });

  it.each([
    [ROUTES.trains, 'Билеты'],
    [ROUTES.seats, 'Билеты'],
    [ROUTES.passengers, 'Пассажиры'],
    [ROUTES.payment, 'Оплата'],
    [ROUTES.confirmation, 'Проверка'],
  ])('на %s текущий шаг — «%s»', (path, label) => {
    renderRoute(path);

    const steps = screen.getByRole('navigation', { name: 'Этапы заказа' });
    const current = within(steps)
      .getAllByRole('listitem')
      .filter((item) => item.getAttribute('aria-current') === 'step');

    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent(label);
  });

  it.each([ROUTES.home, ROUTES.success])('на %s полосы шагов нет', (path) => {
    renderRoute(path);

    expect(screen.queryByRole('navigation', { name: 'Этапы заказа' })).not.toBeInTheDocument();
  });

  it('неизвестный адрес показывает 404 с шапкой и футером', () => {
    renderRoute('/no-such-page');

    expect(heading('Страница не найдена')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});

describe('меню', () => {
  it('секции главной открываются с внутренней страницы по якорю', async () => {
    const { user, router } = renderRoute(ROUTES.payment);

    await user.click(screen.getByRole('link', { name: 'Как это работает' }));

    expect(router.state.location).toMatchObject({ pathname: ROUTES.home, hash: '#how-it-works' });
    expect(document.getElementById('how-it-works')).toBeInTheDocument();
  });

  it('«Контакты» остаются на текущей странице: блок есть в футере везде', async () => {
    const { user, router } = renderRoute(ROUTES.payment);

    await user.click(screen.getByRole('link', { name: 'Контакты' }));

    expect(router.state.location).toMatchObject({ pathname: ROUTES.payment, hash: '#contacts' });
    expect(document.getElementById('contacts')).toBeInTheDocument();
  });
});

describe('экран загрузки', () => {
  it('показывает статус поиска и неактивную кнопку', () => {
    renderRoute(ROUTES.loading);

    expect(screen.getByRole('heading', { level: 1, name: 'Поиск билетов' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Идет поиск');
    expect(screen.getByRole('button', { name: 'Найти билеты' })).toBeDisabled();
  });
});
