import { useCallback, useId, useRef, useState, type ChangeEvent } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import { formatDate, maskDate, parseDate } from '../lib/date';
import { Calendar } from './Calendar';
import { Icon } from './Icon';
import './DateInput.css';

interface DateInputProps {
  id: string;
  label: string;
  /** Текст поля «ДД.ММ.ГГГГ»: форма хранит строку и сама решает, валидна ли она */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: Date | undefined;
  invalid?: boolean;
  describedBy?: string | undefined;
  /** search — поле шапки, filter — поле боковой панели */
  variant: 'search' | 'filter';
}

/** Поле даты: ввод по маске или выбор в календаре (открывается кнопкой и по фокусу) */
export function DateInput(props: DateInputProps) {
  const { id, label, value, onChange, placeholder, min, invalid, describedBy, variant } = props;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const popupId = useId();
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(rootRef, close, open);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(maskDate(event.target.value));
  };

  return (
    <div className={`date-input date-input_variant_${variant}`} ref={rootRef}>
      <label className="visually-hidden" htmlFor={id}>
        {label}
      </label>
      <input
        className="date-input__field"
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={handleInput}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />
      <button
        className="date-input__toggle"
        type="button"
        aria-label={`${label}: выбрать в календаре`}
        aria-expanded={open}
        aria-controls={popupId}
        onClick={() => setOpen((current) => !current)}
      >
        <Icon name="calendar" size={variant === 'search' ? 40 : 27} />
      </button>
      {open && (
        <div className="date-input__popup" id={popupId}>
          <Calendar
            value={parseDate(value)}
            min={min}
            onSelect={(date) => {
              onChange(formatDate(date));
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
