import { useState } from 'react';
import {
  addMonths,
  compareDays,
  formatDateLong,
  isSameDay,
  monthGrid,
  MONTHS,
  startOfDay,
} from '../lib/date';
import './Calendar.css';

interface CalendarProps {
  value: Date | null;
  onSelect: (date: Date) => void;
  /** Раньше этой даты выбрать нельзя (по умолчанию — без ограничения) */
  min?: Date | undefined;
}

/**
 * Календарь по «экспликации»: месяц со стрелками, неделя с понедельника,
 * воскресенья жирные, прошедшие дни недоступны, выбранный — в оранжевой рамке.
 */
export function Calendar({ value, onSelect, min }: CalendarProps) {
  const [month, setMonth] = useState(() => addMonths(value ?? min ?? new Date(), 0));
  const today = startOfDay(new Date());
  // Листать в прошлое до месяца с минимальной датой
  const canGoBack = !min || compareDays(addMonths(month, -1), addMonths(min, 0)) >= 0;
  const showYear = month.getFullYear() !== today.getFullYear();

  return (
    <div className="calendar">
      <div className="calendar__head">
        <button
          className="calendar__nav calendar__nav_prev"
          type="button"
          aria-label="Предыдущий месяц"
          disabled={!canGoBack}
          onClick={() => setMonth((current) => addMonths(current, -1))}
        />
        <span className="calendar__month" aria-live="polite">
          {MONTHS[month.getMonth()]}
          {showYear && ` ${month.getFullYear()}`}
        </span>
        <button
          className="calendar__nav calendar__nav_next"
          type="button"
          aria-label="Следующий месяц"
          onClick={() => setMonth((current) => addMonths(current, 1))}
        />
      </div>

      <table className="calendar__grid">
        <thead className="visually-hidden">
          <tr>
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
              <th key={day} scope="col">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {monthGrid(month).map((week) => (
            <tr key={week[0]?.date.toISOString()}>
              {week.map(({ date, outside }) => {
                const disabled = outside || (min !== undefined && compareDays(date, min) < 0);
                const selected = value !== null && isSameDay(date, value);
                const classes = ['calendar__day'];
                if (outside) classes.push('calendar__day_outside');
                else if (disabled) classes.push('calendar__day_past');
                if (selected) classes.push('calendar__day_selected');
                if (date.getDay() === 0) classes.push('calendar__day_sunday');

                return (
                  <td key={date.toISOString()}>
                    <button
                      className={classes.join(' ')}
                      type="button"
                      disabled={disabled}
                      aria-pressed={selected}
                      aria-label={formatDateLong(date)}
                      aria-current={isSameDay(date, today) ? 'date' : undefined}
                      onClick={() => onSelect(date)}
                    >
                      {date.getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
