import { useId, useState } from 'react';
import type { SeatClass } from '../../entities/train/types';
import { compareDays, parseDate } from '../../shared/lib/date';
import { DateInput } from '../../shared/ui/DateInput';
import { Icon } from '../../shared/ui/Icon';
import type { IconName } from '../../shared/ui/icons';
import { RangeSlider, type Range } from '../../shared/ui/RangeSlider';
import { FULL_DAY, type TimeFilter, type TrainFilters } from './model';
import './TrainsFilters.css';

const CLASS_OPTIONS: { key: SeatClass; label: string; icon: IconName }[] = [
  { key: 'second', label: 'Купе', icon: 'coachCoupe' },
  { key: 'third', label: 'Плацкарт', icon: 'coachPlatzkart' },
  { key: 'fourth', label: 'Сидячий', icon: 'seat' },
  { key: 'first', label: 'Люкс', icon: 'star' },
];

const formatHour = (hour: number) => `${hour}:00`;

/** Ошибка даты в фильтре: формат, прошедший день, обратная дата раньше прямой */
export function dateError(text: string, today: Date, notBefore?: Date | null): string | undefined {
  if (!text) return undefined;
  const date = parseDate(text);
  if (!date) return 'Дата в формате ДД.ММ.ГГГГ';
  if (compareDays(date, today) < 0) return 'Эта дата уже прошла';
  if (notBefore && compareDays(date, notBefore) < 0) return 'Не раньше даты поездки';
  return undefined;
}

interface SwitchRowProps {
  id: string;
  label: string;
  icon: IconName;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SwitchRow({ id, label, icon, checked, onChange }: SwitchRowProps) {
  return (
    <li className="filters__option">
      <Icon className="filters__option-icon" name={icon} size={24} />
      <label className="filters__option-label" htmlFor={id}>
        {label}
      </label>
      <input
        className="switch"
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </li>
  );
}

interface DirectionProps {
  label: string;
  icon: 'arrowForward' | 'arrowBack';
  defaultExpanded: boolean;
  value: TimeFilter;
  onChange: (value: TimeFilter) => void;
}

/** «Туда» / «Обратно»: сворачиваемый блок с ползунками времени отбытия и прибытия */
function Direction({ label, icon, defaultExpanded, value, onChange }: DirectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const panelId = useId();

  return (
    <div className="filters__section">
      <div className="filters__direction">
        <span className="filters__direction-badge" aria-hidden="true">
          <Icon name={icon} size={18} />
        </span>
        <span className="filters__direction-label">{label}</span>
        <button
          className={`filters__expand${expanded ? ' filters__expand_open' : ''}`}
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          aria-label={`Время в пути: ${label}`}
          onClick={() => setExpanded((state) => !state)}
        >
          {!expanded && <Icon name="addBox" size={26} />}
        </button>
      </div>
      <div className="filters__times" id={panelId} hidden={!expanded}>
        <div className="filters__time">
          <span className="filters__time-label">Время отбытия</span>
          <RangeSlider
            label={`${label}, время отбытия`}
            size="time"
            min={FULL_DAY[0]}
            max={FULL_DAY[1]}
            value={value.departure}
            format={formatHour}
            onChange={(departure) => onChange({ ...value, departure })}
          />
        </div>
        <div className="filters__time filters__time_align_end">
          <span className="filters__time-label">Время прибытия</span>
          <RangeSlider
            label={`${label}, время прибытия`}
            size="time"
            min={FULL_DAY[0]}
            max={FULL_DAY[1]}
            value={value.arrival}
            format={formatHour}
            onChange={(arrival) => onChange({ ...value, arrival })}
          />
        </div>
      </div>
    </div>
  );
}

interface TrainsFiltersProps {
  value: TrainFilters;
  onChange: (value: TrainFilters) => void;
  /** Границы шкалы цены по найденным направлениям */
  priceBounds: Range;
  /** Раскрыть блоки времени «Туда» и «Обратно» (так на макете выбора мест) */
  expandedDirections?: boolean;
}

/** Боковая панель фильтров: даты, классы вагонов и удобства, цена, время туда и обратно */
export function TrainsFilters(props: TrainsFiltersProps) {
  const { value, onChange, priceBounds, expandedDirections = false } = props;
  const id = useId();
  const today = new Date();
  const patch = (next: Partial<TrainFilters>) => onChange({ ...value, ...next });
  const thereError = dateError(value.dateThere, today);
  const backError = dateError(value.dateBack, today, parseDate(value.dateThere));

  return (
    <aside className="filters" aria-label="Фильтры">
      <div className="filters__section filters__section_dates">
        {(
          [
            ['dateThere', 'Дата поездки', thereError],
            ['dateBack', 'Дата возвращения', backError],
          ] as const
        ).map(([key, label, error]) => (
          <div key={key} className="filters__date">
            <span className="filters__title" aria-hidden="true">
              {label}
            </span>
            <DateInput
              id={`${id}-${key}`}
              label={label}
              variant="filter"
              min={today}
              value={value[key]}
              invalid={Boolean(error)}
              describedBy={error ? `${id}-${key}-error` : undefined}
              onChange={(text) => patch({ [key]: text })}
            />
            {error && (
              <p className="filters__error" id={`${id}-${key}-error`} role="alert">
                {error}
              </p>
            )}
          </div>
        ))}
      </div>

      <ul className="filters__section filters__options">
        {CLASS_OPTIONS.map(({ key, label, icon }) => (
          <SwitchRow
            key={key}
            id={`${id}-${key}`}
            label={label}
            icon={icon}
            checked={value.classes[key]}
            onChange={(checked) => patch({ classes: { ...value.classes, [key]: checked } })}
          />
        ))}
        <SwitchRow
          id={`${id}-wifi`}
          label="Wi-Fi"
          icon="wifi"
          checked={value.wifi}
          onChange={(wifi) => patch({ wifi })}
        />
        <SwitchRow
          id={`${id}-express`}
          label="Экспресс"
          icon="rocket"
          checked={value.express}
          onChange={(express) => patch({ express })}
        />
      </ul>

      <div className="filters__section filters__price">
        <span className="filters__title">Стоимость</span>
        <div className="filters__price-limits" aria-hidden="true">
          <span>от</span>
          <span>до</span>
        </div>
        <RangeSlider
          label="Стоимость"
          size="price"
          min={priceBounds[0]}
          max={priceBounds[1]}
          step={10}
          value={value.price}
          onChange={(price) => patch({ price })}
        />
      </div>

      <Direction
        label="Туда"
        icon="arrowForward"
        defaultExpanded={expandedDirections}
        value={value.there}
        onChange={(there) => patch({ there })}
      />
      <Direction
        label="Обратно"
        icon="arrowBack"
        defaultExpanded={expandedDirections}
        value={value.back}
        onChange={(back) => patch({ back })}
      />
    </aside>
  );
}
