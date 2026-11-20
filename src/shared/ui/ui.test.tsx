import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Autocomplete } from './Autocomplete';
import { DateInput } from './DateInput';
import { InlineSelect } from './InlineSelect';
import { Modal } from './Modal';
import { RangeSlider, type Range } from './RangeSlider';

const CITIES = ['Москва', 'Мурманск', 'Санкт-Петербург'];

function CityField({ onSelect = vi.fn() }: { onSelect?: (city: string) => void }) {
  const [value, setValue] = useState('');
  const options = CITIES.filter((city) => city.toLowerCase().startsWith(value.toLowerCase()));
  return (
    <Autocomplete
      id="from"
      label="Откуда"
      value={value}
      options={value ? options : []}
      onInputChange={setValue}
      onSelect={(city) => {
        setValue(city);
        onSelect(city);
      }}
    />
  );
}

describe('автодополнение', () => {
  it('подсказывает по первым буквам и выбирает стрелками и Enter', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<CityField onSelect={onSelect} />);

    await user.type(screen.getByRole('combobox', { name: 'Откуда' }), 'м');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Москва', 'Мурманск']);

    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onSelect).toHaveBeenCalledWith('Мурманск');
    expect(screen.getByRole('combobox')).toHaveValue('Мурманск');
  });

  it('принимает серую подсказку по Tab', async () => {
    const user = userEvent.setup();
    render(<CityField />);

    await user.type(screen.getByRole('combobox'), 'мо');
    await user.keyboard('{Tab}');
    expect(screen.getByRole('combobox')).toHaveValue('Москва');
  });
});

function DateField() {
  const [value, setValue] = useState('');
  return (
    <DateInput
      id="date"
      label="Дата"
      value={value}
      onChange={setValue}
      variant="search"
      min={new Date(2018, 7, 12)}
    />
  );
}

describe('поле даты', () => {
  it('маскирует ввод', async () => {
    const user = userEvent.setup();
    render(<DateField />);

    await user.type(screen.getByLabelText('Дата'), '30082018');
    expect(screen.getByLabelText('Дата')).toHaveValue('30.08.2018');
  });

  it('выбирает день в календаре, прошедшие дни недоступны', async () => {
    const user = userEvent.setup();
    render(<DateField />);

    await user.type(screen.getByLabelText('Дата'), '01082018');
    await user.click(screen.getByRole('button', { name: 'Дата: выбрать в календаре' }));
    expect(screen.getByRole('button', { name: '11 августа 2018' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '30 августа 2018' }));
    expect(screen.getByLabelText('Дата')).toHaveValue('30.08.2018');
    expect(screen.queryByRole('button', { name: '30 августа 2018' })).not.toBeInTheDocument();
  });
});

describe('двойной ползунок', () => {
  it('не даёт левому бегунку зайти за правый', () => {
    const onChange = vi.fn<(value: Range) => void>();
    render(
      <RangeSlider
        label="Стоимость"
        size="price"
        min={1920}
        max={7000}
        value={[1920, 4500]}
        onChange={onChange}
      />,
    );

    const from = screen.getByRole('slider', { name: 'Стоимость: от' });
    // fireEvent через нативный сеттер: так React видит изменение значения
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    setter?.call(from, '6000');
    from.dispatchEvent(new Event('input', { bubbles: true }));
    expect(onChange).toHaveBeenLastCalledWith([4500, 4500]);
  });
});

describe('выбор в строке', () => {
  it('открывает список и меняет значение', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <InlineSelect
        label="сортировать по"
        value="date"
        onChange={onChange}
        options={[
          { value: 'date', label: 'времени' },
          { value: 'price', label: 'стоимости' },
        ]}
      />,
    );

    await user.click(screen.getByRole('button', { name: /времени/ }));
    await user.click(screen.getByRole('option', { name: 'стоимости' }));
    expect(onChange).toHaveBeenCalledWith('price');
  });
});

describe('модальное окно', () => {
  it('закрывается кнопкой «Понятно»', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Modal open variant="error" title="Ошибка" onClose={onClose}>
        <p>Текст</p>
      </Modal>,
    );

    await user.click(screen.getByRole('button', { name: 'Понятно' }));
    expect(onClose).toHaveBeenCalled();
  });
});
