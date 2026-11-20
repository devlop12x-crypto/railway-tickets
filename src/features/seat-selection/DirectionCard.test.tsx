import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '../../shared/config/routes';
import { renderRoute } from '../../test/renderRoute';

const there = () => screen.getByRole('region', { name: 'Туда' });
const back = () => screen.getByRole('region', { name: 'Обратно' });
const coachTotal = (number: string) =>
  within(there()).getByText(`Итого по вагону ${number}:`, { exact: false }).parentElement;
const seat = (region: HTMLElement, name: string | RegExp) =>
  within(region).getByRole('button', { name });

describe('выбор мест', () => {
  it('по типу вагона показывает его схему, номера вагонов открывают другие', async () => {
    const { user } = renderRoute(ROUTES.seats);

    expect(within(there()).getByRole('group', { name: 'Схема вагона 07' })).toBeInTheDocument();

    await user.click(within(there()).getByRole('button', { name: 'Плацкарт' }));
    expect(within(there()).getByRole('group', { name: 'Схема вагона 12' })).toBeInTheDocument();
    expect(seat(there(), 'Место 33, боковое, свободно')).toBeEnabled();

    await user.click(within(there()).getByRole('button', { name: 'Вагон 10' }));
    expect(within(there()).getByRole('group', { name: 'Схема вагона 10' })).toBeInTheDocument();
    expect(within(there()).getAllByText('Боковые')).toHaveLength(2);
  });

  it('выбирает места не больше, чем билетов, и считает сумму', async () => {
    const { user } = renderRoute(ROUTES.seats);

    expect(seat(there(), 'Место 2, верхнее, занято')).toBeDisabled();
    for (const number of [1, 3, 11]) {
      await user.click(seat(there(), `Место ${number}, нижнее, свободно`));
    }
    expect(seat(there(), 'Место 11, нижнее, выбрано')).toHaveAttribute('aria-pressed', 'true');
    expect(within(there()).getByRole('status')).toHaveTextContent('Выбрано 3 из 3 мест.');
    expect(coachTotal('07')).toHaveTextContent('10 590');

    // Четвёртое место при трёх билетах не выбирается — карточка объясняет почему
    await user.click(seat(there(), 'Место 13, нижнее, свободно'));
    expect(seat(there(), 'Место 13, нижнее, свободно')).toHaveAttribute('aria-pressed', 'false');
    expect(within(there()).getByRole('status')).toHaveTextContent('снимите отметку');

    // Повторный клик снимает выбор
    await user.click(seat(there(), 'Место 1, нижнее, выбрано'));
    expect(within(there()).getByRole('status')).toHaveTextContent('Выбрано 2 из 3 мест.');
  });

  it('держит количество билетов в пределах заказа', async () => {
    const { user } = renderRoute(ROUTES.seats);
    const adults = within(there()).getByRole('combobox', { name: 'Взрослых' });
    const infants = within(there()).getByRole('combobox', { name: 'Детских «без места»' });

    for (const number of [1, 3, 11]) {
      await user.click(seat(there(), `Место ${number}, нижнее, свободно`));
    }
    await user.selectOptions(adults, '1');

    // Мест стало меньше — последнее выбранное снято
    expect(seat(there(), 'Место 11, нижнее, свободно')).toBeInTheDocument();
    expect(within(there()).getByRole('status')).toHaveTextContent('Выбрано 2 из 2 мест.');
    // Детей без места не больше, чем взрослых; всего с местом не больше 5
    expect(within(infants).getByRole('option', { name: /— 2$/ })).toBeDisabled();
    expect(within(adults).getByRole('option', { name: /— 5$/ })).toBeDisabled();
    expect(within(adults).getByRole('option', { name: /— 4$/ })).toBeEnabled();
  });

  it('платные услуги прибавляются к сумме на каждого пассажира', async () => {
    const { user } = renderRoute(ROUTES.seats);

    await user.click(seat(there(), 'Место 1, нижнее, свободно'));
    expect(coachTotal('07')).toHaveTextContent('3 530');

    const wifi = within(there()).getByRole('button', { name: /^Wi-Fi/ });
    await user.click(wifi);
    expect(wifi).toHaveAttribute('aria-pressed', 'true');
    expect(coachTotal('07')).toHaveTextContent('3 730');
    expect(
      within(there()).getByRole('button', { name: 'Кондиционер: включено в стоимость' }),
    ).toBeDisabled();
  });

  it('«Далее» доступна, когда места выбраны в обе стороны', async () => {
    const { user, router } = renderRoute(ROUTES.seats);
    const next = screen.getByRole('button', { name: 'Далее' });

    expect(next).toBeDisabled();
    expect(next).toHaveAccessibleDescription(
      'Выберите места: туда — еще 3 места, обратно — еще 2 места',
    );

    for (const number of [1, 3, 11]) {
      await user.click(seat(there(), `Место ${number}, нижнее, свободно`));
    }
    await user.click(within(back()).getByRole('button', { name: 'Сидячий' }));
    await user.click(seat(back(), 'Место 1, свободно'));
    await user.click(seat(back(), 'Место 2, свободно'));

    await user.click(next);
    expect(router.state.location.pathname).toBe(ROUTES.passengers);
  });
});
