import { useId, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ROUTES } from '../../shared/config/routes';
import { Autocomplete } from '../../shared/ui/Autocomplete';
import { DateInput } from '../../shared/ui/DateInput';
import { Icon } from '../../shared/ui/Icon';
import {
  fromSearchParams,
  toSearchParams,
  validateSearch,
  type CityValue,
  type SearchErrors,
  type SearchValues,
} from './model';
import { useCitySuggestions } from './useCitySuggestions';
import './SearchForm.css';

interface SearchFormProps {
  /** hero — форма на главной, compact — горизонтальная на внутренних страницах */
  variant: 'hero' | 'compact';
  /** Идёт поиск: кнопка в нажатом состоянии и неактивна */
  loading?: boolean;
}

interface CityFieldProps {
  id: string;
  label: string;
  value: CityValue;
  onChange: (value: CityValue) => void;
  error: string | undefined;
}

function CityField({ id, label, value, onChange, error }: CityFieldProps) {
  // Подсказки нужны, пока город не выбран: после выбора список не открываем
  const options = useCitySuggestions(value.text, value.city === null);
  const errorId = `${id}-error`;

  return (
    <div className="search-form__field">
      <Autocomplete
        id={id}
        label={label}
        placeholder={label}
        value={value.text}
        options={options}
        invalid={Boolean(error)}
        describedBy={error ? errorId : undefined}
        onInputChange={(text) => {
          // Набранное целиком совпало с подсказкой — город выбран и без клика
          const exact = options.find((city) => city.toLowerCase() === text.trim().toLowerCase());
          onChange({ text, city: exact ?? null });
        }}
        onSelect={(city) => onChange({ text: city, city })}
      >
        <Icon className="search-form__icon" name="pin" size={36} />
      </Autocomplete>
      <FieldError id={errorId} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message: string | undefined }) {
  return message ? (
    <p className="search-form__error" id={id} role="alert">
      {message}
    </p>
  ) : null;
}

/**
 * Форма поиска билетов: города с подсказками, смена местами, даты с календарём.
 * Ошибки показываются после первой попытки отправки и дальше обновляются на ходу.
 * Параметры уходят в адрес страницы, поэтому шапка внутренних страниц их помнит.
 */
export function SearchForm({ variant, loading = false }: SearchFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState<SearchValues>(() => fromSearchParams(searchParams));
  const [submitted, setSubmitted] = useState(false);
  const id = useId();
  const today = new Date();
  const errors: SearchErrors = submitted ? validateSearch(values, today) : {};

  const patch = (next: Partial<SearchValues>) => setValues((current) => ({ ...current, ...next }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(validateSearch(values, today)).length > 0) return;
    void navigate({ pathname: ROUTES.trains, search: toSearchParams(values).toString() });
  };

  const dateError = (key: 'dateThere' | 'dateBack') =>
    errors[key] ? `${id}-${key}-error` : undefined;

  return (
    <form
      className={`search-form search-form_variant_${variant}`}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Поиск билетов"
    >
      <fieldset className="search-form__group">
        <legend className="search-form__legend">Направление</legend>
        <div className="search-form__row">
          <CityField
            id={`${id}-from`}
            label="Откуда"
            value={values.from}
            error={errors.from}
            onChange={(from) => patch({ from })}
          />
          <button
            className="search-form__swap"
            type="button"
            aria-label="Поменять города местами"
            onClick={() => patch({ from: values.to, to: values.from })}
          >
            <Icon name="swap" size={24} />
          </button>
          <CityField
            id={`${id}-to`}
            label="Куда"
            value={values.to}
            error={errors.to}
            onChange={(to) => patch({ to })}
          />
        </div>
      </fieldset>

      <fieldset className="search-form__group">
        <legend className="search-form__legend">Дата</legend>
        <div className="search-form__row">
          <div className="search-form__field">
            <DateInput
              id={`${id}-dateThere`}
              label="Дата отправления"
              placeholder="ДД.ММ.ГГГГ"
              variant="search"
              min={today}
              value={values.dateThere}
              invalid={Boolean(errors.dateThere)}
              describedBy={dateError('dateThere')}
              onChange={(dateThere) => patch({ dateThere })}
            />
            <FieldError id={`${id}-dateThere-error`} message={errors.dateThere} />
          </div>
          <div className="search-form__field">
            <DateInput
              id={`${id}-dateBack`}
              label="Дата возвращения"
              placeholder="ДД.ММ.ГГГГ"
              variant="search"
              min={today}
              value={values.dateBack}
              invalid={Boolean(errors.dateBack)}
              describedBy={dateError('dateBack')}
              onChange={(dateBack) => patch({ dateBack })}
            />
            <FieldError id={`${id}-dateBack-error`} message={errors.dateBack} />
          </div>
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
