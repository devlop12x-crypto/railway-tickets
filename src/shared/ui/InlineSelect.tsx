import { useCallback, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useClickOutside } from '../hooks/useClickOutside';
import './InlineSelect.css';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface InlineSelectProps<T extends string> {
  label: string;
  value: T;
  options: readonly SelectOption<T>[];
  onChange: (value: T) => void;
}

/**
 * Выбор в строке текста — «сортировать по: времени» из макета.
 * Кнопка раскрывает список (listbox), стрелки и Enter работают с клавиатуры.
 */
export function InlineSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: InlineSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(rootRef, close, open);
  const current = options.find((option) => option.value === value) ?? options[0];

  const toggle = () => {
    setActive(
      Math.max(
        0,
        options.findIndex((option) => option.value === value),
      ),
    );
    setOpen((state) => !state);
    // Фокус в список, чтобы стрелки работали сразу
    requestAnimationFrame(() => listRef.current?.focus());
  };

  const choose = (option: SelectOption<T>) => {
    onChange(option.value);
    setOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setActive((index) => (index + step + options.length) % options.length);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const option = options[active];
      if (option) choose(option);
    }
  };

  return (
    <span className="inline-select" ref={rootRef}>
      <span id={`${id}-label`}>{label}:</span>
      <button
        className="inline-select__button"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}-button`}
        id={`${id}-button`}
        onClick={toggle}
      >
        {current?.label}
      </button>
      {open && (
        <ul
          className="inline-select__list"
          role="listbox"
          tabIndex={-1}
          ref={listRef}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={handleKeyDown}
        >
          {options.map((option, index) => (
            // Клавиатуру обрабатывает сам listbox через aria-activedescendant
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
              key={option.value}
              id={`${id}-${index}`}
              className={`inline-select__option${index === active ? ' inline-select__option_active' : ''}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => choose(option)}
              onMouseEnter={() => setActive(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </span>
  );
}
