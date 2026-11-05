import type { CSSProperties } from 'react';
import { Icon } from '../../shared/ui/Icon';
import type { SeatClass } from '../trains/types';
import { seatTier } from './coach';
import './CoachScheme.css';

interface CoachSchemeProps {
  type: SeatClass;
  coachNumber: string;
  available: ReadonlySet<number>;
  selected?: ReadonlySet<number> | undefined;
}

const COMPARTMENTS = 8;
const TIER_LABELS = { upper: 'верхнее', lower: 'нижнее', side: 'боковое', single: '' } as const;

interface SeatProps {
  type: SeatClass;
  number: number;
  available: ReadonlySet<number>;
  selected?: ReadonlySet<number> | undefined;
  style?: CSSProperties;
}

function Seat({ type, number, available, selected, style }: SeatProps) {
  const isFree = available.has(number);
  const isSelected = selected?.has(number) ?? false;
  const tier = TIER_LABELS[seatTier(type, number)];
  const status = isSelected ? 'выбрано' : isFree ? 'свободно' : 'занято';
  const state = isSelected
    ? ' coach-scheme__seat_selected'
    : isFree
      ? ''
      : ' coach-scheme__seat_taken';

  return (
    <button
      className={`coach-scheme__seat${state}`}
      type="button"
      style={style}
      disabled={!isFree && !isSelected}
      aria-pressed={isSelected}
      aria-label={`Место ${number}${tier ? `, ${tier}` : ''}, ${status}`}
    >
      {number}
    </button>
  );
}

type SeatsProps = Omit<SeatProps, 'number' | 'style'>;

/** Купе, плацкарт и люкс: 8 отсеков по две полки */
function Compartments(props: SeatsProps) {
  const isLux = props.type === 'first';

  return (
    <div className="coach-scheme__compartments">
      {Array.from({ length: COMPARTMENTS }, (_, index) => {
        // В люксе полка одна, места 2k+1 и 2k+2; в купе и плацкарте — по два яруса
        const benches = isLux
          ? [[index * 2 + 1], [index * 2 + 2]]
          : [
              [index * 4 + 2, index * 4 + 1],
              [index * 4 + 4, index * 4 + 3],
            ];

        return (
          <div key={index} className="coach-scheme__compartment">
            {benches.map((seats) => (
              <div
                key={seats[0]}
                className={`coach-scheme__bench${isLux ? ' coach-scheme__bench_single' : ''}`}
              >
                {seats.map((seat) => (
                  <Seat key={seat} number={seat} {...props} />
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/** Коридор: в плацкарте в нём боковые места 33–48, в купе и люксе — пусто */
function Corridor(props: SeatsProps) {
  return (
    <div className="coach-scheme__corridor">
      {Array.from({ length: COMPARTMENTS }, (_, index) => (
        <div key={index} className="coach-scheme__corridor-cell">
          {props.type === 'third' &&
            [33 + index * 2, 34 + index * 2].map((seat) => (
              <Seat key={seat} number={seat} {...props} />
            ))}
        </div>
      ))}
    </div>
  );
}

/** Сидячий вагон: 16 рядов, сверху места 1–32, снизу 33–62 */
function SeatedHall(props: SeatsProps) {
  const seats: { number: number; row: number; column: number }[] = [];

  for (let column = 1; column <= 16; column += 1) {
    seats.push({ number: column * 2, row: 1, column }, { number: column * 2 - 1, row: 2, column });
    if (column === 1) seats.push({ number: 33, row: 5, column });
    else if (column === 16) seats.push({ number: 62, row: 5, column });
    else
      seats.push(
        { number: 30 + column * 2, row: 4, column },
        { number: 31 + column * 2, row: 5, column },
      );
  }

  return (
    <div className="coach-scheme__hall">
      {seats.map(({ number, row, column }) => (
        <Seat
          key={number}
          number={number}
          style={{ gridRow: row, gridColumn: column }}
          {...props}
        />
      ))}
    </div>
  );
}

/**
 * Схема вагона по типу: купе, плацкарт, люкс или сидячий.
 * Этап 2 — вёрстка; выбор мест подключится на этапе 3, данные о местах — на этапе 4.
 */
export function CoachScheme({ type, coachNumber, available, selected }: CoachSchemeProps) {
  const seatsProps = { type, available, selected };

  return (
    <div className="coach-scheme" role="group" aria-label={`Схема вагона ${coachNumber}`}>
      <span className="coach-scheme__number">{coachNumber}</span>
      <div className="coach-scheme__body">
        <div className="coach-scheme__end coach-scheme__end_start" aria-hidden="true">
          <Icon className="coach-scheme__wc" name="wc" size={22} />
          <Icon className="coach-scheme__conductor" name="person" size={26} />
        </div>

        {type === 'fourth' ? (
          <SeatedHall {...seatsProps} />
        ) : (
          <>
            <Compartments {...seatsProps} />
            <Corridor {...seatsProps} />
          </>
        )}

        <div className="coach-scheme__end coach-scheme__end_finish" aria-hidden="true">
          <Icon className="coach-scheme__wc" name="wc" size={22} />
          <Icon className="coach-scheme__smoke" name="smokeFree" size={20} />
          <Icon className="coach-scheme__trash" name="trash" size={16} />
        </div>
      </div>
    </div>
  );
}
