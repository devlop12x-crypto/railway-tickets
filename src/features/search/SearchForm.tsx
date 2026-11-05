import { useId, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../shared/config/routes';
import { Icon } from '../../shared/ui/Icon';
import type { IconName } from '../../shared/ui/icons';
import './SearchForm.css';

interface SearchFormProps {
  /** hero — форма на главной, compact — горизонтальная на внутренних страницах */
  variant: 'hero' | 'compact';
  /** Идёт поиск: кнопка в нажатом состоянии и неактивна */
  loading?: boolean;
}

interface FieldProps {
  id: string;
  label: string;
  placeholder: string;
  icon?: IconName | undefined;
  iconSize: number;
}

function Field({ id, label, placeholder, icon, iconSize }: FieldProps) {
  return (
    <div className="search-form__field">
      <label className="visually-hidden" htmlFor={id}>
        {label}
      </label>
      <input
        className="search-form__input"
        id={id}
        type="text"
        placeholder={placeholder}
        autoComplete="off"
      />
      {icon && <Icon className="search-form__icon" name={icon} size={iconSize} />}
    </div>
  );
}

/**
 * Форма поиска билетов. Этап 2 — вёрстка и переход к результатам.
 * Автодополнение городов, календарь и валидация появятся на этапе 3.
 */
export function SearchForm({ variant, loading = false }: SearchFormProps) {
  const navigate = useNavigate();
  const id = useId();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void navigate(ROUTES.trains);
  };

  return (
    <form className={`search-form search-form_variant_${variant}`} onSubmit={handleSubmit}>
      <fieldset className="search-form__group">
        <legend className="search-form__legend">Направление</legend>
        <div className="search-form__row">
          <Field id={`${id}-from`} label="Откуда" placeholder="Откуда" icon="pin" iconSize={36} />
          <button className="search-form__swap" type="button" aria-label="Поменять города местами">
            <Icon name="swap" size={24} />
          </button>
          <Field id={`${id}-to`} label="Куда" placeholder="Куда" icon="pin" iconSize={36} />
        </div>
      </fieldset>

      <fieldset className="search-form__group">
        <legend className="search-form__legend">Дата</legend>
        <div className="search-form__row">
          <Field
            id={`${id}-date-start`}
            label="Дата отправления"
            placeholder="ДД/ММ/ГГ"
            icon="calendar"
            iconSize={40}
          />
          <Field
            id={`${id}-date-end`}
            label="Дата возвращения"
            placeholder="ДД/ММ/ГГ"
            icon="calendar"
            iconSize={40}
          />
        </div>
      </fieldset>

      <button
        className={`button button_variant_primary search-form__submit${loading ? ' search-form__submit_loading' : ''}`}
        type="submit"
        disabled={loading}
        aria-busy={loading}
      >
        Найти билеты
      </button>
    </form>
  );
}
