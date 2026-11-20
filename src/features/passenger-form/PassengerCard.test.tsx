import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ROUTES } from '../../shared/config/routes';
import { renderRoute } from '../../test/renderRoute';

const card = (index: number) =>
  screen.getByRole('article', { name: new RegExp(`^Пассажир ${index}`) });
const next = () => screen.getByRole('button', { name: 'Далее' });

describe('пассажиры', () => {
  it('заполненная карточка — «Готово», ошибка — плашка с примером', async () => {
    const { user } = renderRoute(ROUTES.passengers);

    expect(within(card(1)).getByRole('status')).toHaveTextContent('Готово');

    const number = within(card(2)).getByLabelText('Номер');
    await user.type(number, '000000');
    await user.tab();

    expect(number).toHaveAttribute('aria-invalid', 'true');
    expect(within(card(2)).getByRole('alert')).toHaveTextContent(
      'Номер свидетельства о рождении указан некорректноПример: VIII-ЫП-123456',
    );
    expect(number).toHaveAccessibleDescription(/указан некорректно/);

    await user.clear(number);
    // Маска: латиница в верхний регистр, лишние символы не проходят
    await user.type(number, 'viii-ып-123456!');
    expect(number).toHaveValue('VIII-ЫП-123456');
    expect(within(card(2)).getByRole('status')).toHaveTextContent('Готово');
  });

  it('«Следующий пассажир» с ошибками показывает первую и ставит на неё фокус', async () => {
    const { user } = renderRoute(ROUTES.passengers);

    await user.click(within(card(3)).getByRole('button', { name: 'Развернуть: пассажир 3' }));
    await user.click(within(card(3)).getByRole('button', { name: 'Следующий пассажир' }));

    expect(within(card(3)).getByRole('alert')).toHaveTextContent('Укажите фамилию');
    expect(within(card(3)).getByLabelText('Фамилия')).toHaveFocus();

    await user.type(within(card(3)).getByLabelText('Фамилия'), 'Smith');
    expect(within(card(3)).getByRole('alert')).toHaveTextContent('Фамилия — только русские буквы');
  });

  it('маски даты и паспорта, проверка возраста для детского билета', async () => {
    const { user } = renderRoute(ROUTES.passengers);
    const birth = within(card(2)).getByLabelText('Дата рождения');

    await user.clear(birth);
    await user.type(birth, '25012006');
    expect(birth).toHaveValue('25.01.2006');
    await user.tab();
    expect(within(card(2)).getByRole('alert')).toHaveTextContent(
      /^Детский билет — для детей до 10 лет/,
    );

    // Взрослый билет подставляет паспорт: серия и номер — только цифры
    await user.selectOptions(within(card(2)).getByLabelText('Тип билета'), 'adult');
    const series = within(card(2)).getByLabelText('Серия');
    await user.type(series, '42a04 5');
    expect(series).toHaveValue('4204');
  });

  it('добавляет и удаляет пассажиров; «Далее» ждёт, пока все заполнены', async () => {
    const { user } = renderRoute(ROUTES.passengers);

    expect(next()).toBeDisabled();
    expect(next()).toHaveAccessibleDescription('Заполните данные: пассажир 2, пассажир 3');

    await user.click(screen.getByRole('button', { name: 'Добавить пассажира' }));
    expect(screen.getAllByRole('article')).toHaveLength(4);
    // Новая карточка открыта, остальные свёрнуты
    expect(within(card(4)).getByLabelText('Фамилия')).toBeInTheDocument();
    expect(within(card(1)).queryByLabelText('Фамилия')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Удалить пассажира 4' }));
    await user.click(screen.getByRole('button', { name: 'Удалить пассажира 3' }));
    await user.click(within(card(2)).getByRole('button', { name: 'Развернуть: пассажир 2' }));
    await user.type(within(card(2)).getByLabelText('Номер'), 'VIII УН 256319');

    expect(next()).toBeEnabled();
  });
});
