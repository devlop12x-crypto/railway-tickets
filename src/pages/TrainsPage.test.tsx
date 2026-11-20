import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createFilters, filterRoutes, minPrice, priceBounds } from '../features/filters/model';
import { MOCK_ROUTES } from '../mocks/trains';
import { ROUTES } from '../shared/config/routes';
import { renderRoute } from '../test/renderRoute';

const results = () => screen.getByRole('region', { name: 'Выбор поезда' });
/** Карточки поездов — только прямые пункты списка, без вложенных списков мест */
const cards = () => [...within(results()).getByRole('list', { name: 'Поезда' }).children];
const pages = () => screen.getByRole('navigation', { name: 'Страницы результатов' });

describe('выбор поезда', () => {
  it('показывает выдачу по 5 и переключает размер страницы и страницы', async () => {
    const { user } = renderRoute(ROUTES.trains);

    expect(within(results()).getByText(`найдено ${MOCK_ROUTES.length}`)).toBeInTheDocument();
    expect(cards()).toHaveLength(5);

    await user.click(within(pages()).getByRole('button', { name: 'Страница 2' }));
    expect(within(pages()).getByRole('button', { name: 'Страница 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    const limit = screen.getByRole('group', { name: 'Показывать по' });
    await user.click(within(limit).getByRole('button', { name: '10' }));
    expect(within(limit).getByRole('button', { name: '10' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(cards()).toHaveLength(10);
    // Смена размера возвращает на первую страницу
    expect(within(pages()).getByRole('button', { name: 'Страница 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('сортирует по стоимости', async () => {
    const { user } = renderRoute(ROUTES.trains);
    const cheapest = Math.min(...MOCK_ROUTES.map(minPrice));

    await user.click(screen.getByRole('button', { name: /сортировать по/ }));
    await user.click(screen.getByRole('option', { name: 'стоимости' }));

    expect(screen.getByRole('button', { name: /сортировать по/ })).toHaveTextContent('стоимости');
    expect(cards()[0]).toHaveTextContent(cheapest.toLocaleString('ru-RU').replace(/\s/g, ' '));
  });

  it('фильтрует по типу вагона и сообщает, когда поездов нет', async () => {
    const { user } = renderRoute(ROUTES.trains);
    const filters = screen.getByRole('complementary', { name: 'Фильтры' });
    const base = createFilters(priceBounds(MOCK_ROUTES));
    const withFirst = filterRoutes(MOCK_ROUTES, {
      ...base,
      classes: { ...base.classes, first: true },
    });

    await user.click(within(filters).getByRole('switch', { name: 'Люкс' }));
    expect(within(results()).getByText(`найдено ${withFirst.length}`)).toBeInTheDocument();

    for (const name of ['Купе', 'Плацкарт', 'Сидячий', 'Wi-Fi', 'Экспресс']) {
      await user.click(within(filters).getByRole('switch', { name }));
    }
    const strict = filterRoutes(MOCK_ROUTES, {
      ...base,
      classes: { first: true, second: true, third: true, fourth: true },
      wifi: true,
      express: true,
    });
    expect(within(results()).getByText(`найдено ${strict.length}`)).toBeInTheDocument();
    if (strict.length === 0) {
      expect(within(results()).getByText(/поездов нет/)).toBeInTheDocument();
    }
  });
});
