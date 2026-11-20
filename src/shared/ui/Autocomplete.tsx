import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import './Autocomplete.css';

interface AutocompleteProps {
  id: string;
  label: string;
  value: string;
  /** Ввод текста: родитель подбирает подсказки (сейчас из списка, на этапе 4 — запросом к API) */
  onInputChange: (value: string) => void;
  /** Выбор подсказки */
  onSelect: (option: string) => void;
  options: readonly string[];
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string | undefined;
  className?: string;
  children?: ReactNode;
}

/**
 * Поле с подсказками по шаблону combobox из WAI-ARIA: стрелки двигают по списку,
 * Enter выбирает, Escape закрывает. Как в макете, первая подходящая подсказка
 * дописывается в поле серым; Tab или стрелка вправо её принимают.
 */
export function Autocomplete(props: AutocompleteProps) {
  const { id, label, value, onInputChange, onSelect, options, placeholder, invalid, describedBy } =
    props;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const visible = open && options.length > 0;
  const [first] = options;
  const ghost =
    value && first && first.toLowerCase().startsWith(value.toLowerCase()) && first !== value
      ? first.slice(value.length)
      : '';

  const choose = (option: string) => {
    onSelect(option);
    setOpen(false);
    setActive(-1);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(index + 1, options.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && visible && active >= 0) {
      event.preventDefault();
      const option = options[active];
      if (option) choose(option);
    } else if (event.key === 'Escape') {
      setOpen(false);
    } else if ((event.key === 'Tab' || event.key === 'ArrowRight') && ghost && first) {
      // Принять подсказку; Tab при этом не уводит фокус, чтобы было видно результат
      event.preventDefault();
      choose(first);
    }
  };

  return (
    <div className={`autocomplete ${props.className ?? ''}`}>
      <label className="visually-hidden" htmlFor={id}>
        {label}
      </label>
      <div className="autocomplete__control">
        {ghost && (
          <span className="autocomplete__ghost" aria-hidden="true">
            <span className="autocomplete__typed">{value}</span>
            {ghost}
          </span>
        )}
        <input
          className="autocomplete__input"
          id={id}
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          aria-expanded={visible}
          aria-controls={listId}
          aria-autocomplete="both"
          aria-activedescendant={visible && active >= 0 ? `${listId}-${active}` : undefined}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          onChange={(event) => {
            onInputChange(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
        />
        {props.children}
      </div>
      <ul
        className="autocomplete__list"
        id={listId}
        role="listbox"
        aria-label={label}
        hidden={!visible}
      >
        {options.map((option, index) => (
          <li
            key={option}
            id={`${listId}-${index}`}
            className={`autocomplete__option${index === active ? ' autocomplete__option_active' : ''}`}
            role="option"
            aria-selected={index === active}
            // mousedown, а не click: иначе поле теряет фокус и список закрывается раньше выбора
            onMouseDown={(event) => {
              event.preventDefault();
              choose(option);
            }}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}
