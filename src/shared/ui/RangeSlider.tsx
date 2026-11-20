import type { CSSProperties } from 'react';
import './RangeSlider.css';

export type Range = readonly [number, number];

interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: Range;
  onChange: (value: Range) => void;
  /** Подпись для скринридера: «Стоимость», «Время отбытия» */
  label: string;
  format?: (value: number) => string;
  /** price — толстая шкала 19px, time — тонкая 10px */
  size: 'price' | 'time';
}

const percent = (value: number, min: number, max: number) => ((value - min) / (max - min)) * 100;

/**
 * Двойной ползунок на двух нативных input[type=range]: клавиатура, тач и скринридеры
 * работают без своего кода. Над общей дорожкой ловятся только бегунки.
 */
export function RangeSlider(props: RangeSliderProps) {
  const { min, max, step = 1, value, onChange, label, format = String, size } = props;
  const [from, to] = value;
  const style = {
    '--from': `${percent(from, min, max)}%`,
    '--to': `${percent(to, min, max)}%`,
  } as CSSProperties;
  // Подпись максимума прячется, когда правый бегунок рядом с ней
  const showMax = percent(to, min, max) < 82;

  return (
    <div className={`range range_size_${size}`} style={style}>
      <div className="range__track">
        <div className="range__fill" />
        <input
          className="range__input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={from}
          aria-label={`${label}: от`}
          // Когда бегунки сошлись у правого края, левый должен лежать сверху, иначе его не сдвинуть
          style={from >= to && from > (min + max) / 2 ? { zIndex: 2 } : undefined}
          aria-valuetext={format(from)}
          onChange={(event) => onChange([Math.min(Number(event.target.value), to), to])}
        />
        <input
          className="range__input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={to}
          aria-label={`${label}: до`}
          aria-valuetext={format(to)}
          onChange={(event) => onChange([from, Math.max(Number(event.target.value), from)])}
        />
      </div>
      <div className="range__scale" aria-hidden="true">
        <span className="range__value range__value_from">{format(from)}</span>
        <span className="range__value range__value_to">{format(to)}</span>
        {showMax && <span className="range__max">{format(max)}</span>}
      </div>
    </div>
  );
}
