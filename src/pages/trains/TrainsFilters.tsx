import { useId } from 'react';
import { Icon } from '../../shared/ui/Icon';
import type { IconName } from '../../shared/ui/icons';
import './TrainsFilters.css';

const OPTIONS: { id: string; label: string; icon: IconName; checked: boolean }[] = [
  { id: 'coupe', label: 'Купе', icon: 'coachCoupe', checked: true },
  { id: 'platzkart', label: 'Плацкарт', icon: 'coachPlatzkart', checked: false },
  { id: 'seat', label: 'Сидячий', icon: 'seat', checked: false },
  { id: 'lux', label: 'Люкс', icon: 'star', checked: false },
  { id: 'wifi', label: 'Wi-Fi', icon: 'wifi', checked: true },
  { id: 'express', label: 'Экспресс', icon: 'rocket', checked: false },
];

function DateField({ id, label, value }: { id: string; label: string; value: string }) {
  return (
    <div className="filters__date">
      <label className="filters__title" htmlFor={id}>
        {label}
      </label>
      <div className="filters__date-control">
        <input className="filters__date-input" id={id} type="text" defaultValue={value} />
        <Icon className="filters__date-icon" name="calendar" size={27} />
      </div>
    </div>
  );
}

interface TimeRangeProps {
  label: string;
  align: 'start' | 'end';
  /** Положение бегунков и подписей в процентах ширины шкалы */
  from: number;
  to: number;
  fromLabel: string;
  toLabel: string;
}

/** Шкала времени: подпись, дорожка с двумя бегунками, отметки. Оживёт на этапе 3 */
function TimeRange({ label, align, from, to, fromLabel, toLabel }: TimeRangeProps) {
  return (
    <div className={`time-range time-range_align_${align}`}>
      <span className="time-range__label">{label}</span>
      <div className="time-range__track" aria-hidden="true">
        <span className="time-range__fill" style={{ left: `${from}%`, width: `${to - from}%` }} />
        <span className="time-range__thumb" style={{ left: `${from}%` }} />
        <span className="time-range__thumb" style={{ left: `${to}%` }} />
      </div>
      <div className="time-range__scale">
        <span style={{ left: `${from}%` }}>{fromLabel}</span>
        <span style={{ left: `${to}%` }}>{toLabel}</span>
        <span className="time-range__max">24:00</span>
      </div>
    </div>
  );
}

interface DirectionProps {
  label: string;
  icon: 'arrowForward' | 'arrowBack';
  expanded: boolean;
}

function Direction({ label, icon, expanded }: DirectionProps) {
  return (
    <>
      <div className="filters__direction">
        <span className="filters__direction-badge">
          <Icon name={icon} size={18} />
        </span>
        <span className="filters__direction-label">{label}</span>
        <button
          className={`filters__expand${expanded ? ' filters__expand_open' : ''}`}
          type="button"
          aria-expanded={expanded}
          aria-label={`Время: ${label}`}
        >
          {!expanded && <Icon name="addBox" size={26} />}
        </button>
      </div>
      {expanded && (
        <div className="filters__times">
          <TimeRange
            label="Время отбытия"
            align="start"
            from={0}
            to={39}
            fromLabel="0:00"
            toLabel="11:00"
          />
          <TimeRange
            label="Время прибытия"
            align="end"
            from={16}
            to={50}
            fromLabel="5:00"
            toLabel="11:00"
          />
        </div>
      )}
    </>
  );
}

/**
 * Боковая панель фильтров. Этап 2 — вёрстка; переключатели нативные,
 * календарь, слайдер цены и время отправления заработают на этапе 3.
 */
interface TrainsFiltersProps {
  /** Раскрыть блоки времени «Туда» и «Обратно» (так на макете выбора мест) */
  expandedDirections?: boolean;
}

export function TrainsFilters({ expandedDirections = false }: TrainsFiltersProps) {
  const id = useId();

  return (
    <aside className="filters" aria-label="Фильтры">
      <div className="filters__section filters__section_dates">
        <DateField id={`${id}-start`} label="Дата поездки" value="30.08.2018" />
        <DateField id={`${id}-end`} label="Дата возвращения" value="09.09.2018" />
      </div>

      <ul className="filters__section filters__options">
        {OPTIONS.map(({ id: optionId, label, icon, checked }) => (
          <li key={optionId} className="filters__option">
            <Icon className="filters__option-icon" name={icon} size={24} />
            <label className="filters__option-label" htmlFor={`${id}-${optionId}`}>
              {label}
            </label>
            <input
              className="switch"
              id={`${id}-${optionId}`}
              type="checkbox"
              role="switch"
              defaultChecked={checked}
            />
          </li>
        ))}
      </ul>

      <div className="filters__section filters__price">
        <span className="filters__title">Стоимость</span>
        <div className="filters__price-limits">
          <span>от</span>
          <span>до</span>
        </div>
        <div className="price-range" aria-hidden="true">
          <span className="price-range__fill" />
          <span className="price-range__thumb price-range__thumb_min" />
          <span className="price-range__thumb price-range__thumb_max" />
        </div>
        <div className="filters__price-scale">
          <span>1920</span>
          <span className="filters__price-current">4500</span>
          <span>7000</span>
        </div>
      </div>

      <div className="filters__section">
        <Direction label="Туда" icon="arrowForward" expanded={expandedDirections} />
      </div>
      <div className="filters__section">
        <Direction label="Обратно" icon="arrowBack" expanded={expandedDirections} />
      </div>
    </aside>
  );
}
