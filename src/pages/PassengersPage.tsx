import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MAX_TICKETS } from '../shared/config/order';
import { ROUTES } from '../shared/config/routes';
import { PageTitle } from '../shared/ui/PageTitle';
import { MOCK_TRIP_DETAILS } from '../mocks/order';
import { MOCK_PASSENGERS } from '../mocks/passengers';
import { TripDetails } from '../features/trip-details/TripDetails';
import { AddPassengerButton, PassengerCard } from '../features/passenger-form/PassengerCard';
import {
  createPassenger,
  validatePassenger,
  type PassengerDraft,
} from '../features/passenger-form/model';

interface PassengerEntry {
  /** Постоянный ключ: номер «Пассажир N» меняется при удалении, а состояние карточки — нет */
  key: number;
  draft: PassengerDraft;
  open: boolean;
}

let nextKey = 0;
const entry = (draft: PassengerDraft, open: boolean): PassengerEntry => ({
  key: (nextKey += 1),
  draft,
  open,
});

/**
 * Пассажиры. На макете две карточки открыты, третья свёрнута.
 * На этапе 4 список соберётся из количества билетов, выбранного на прошлом шаге.
 */
export function PassengersPage() {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState(() =>
    MOCK_PASSENGERS.map((draft, index) => entry(draft, index < 2)),
  );

  const update = (key: number, patch: Partial<PassengerEntry>) =>
    setPassengers((list) => list.map((item) => (item.key === key ? { ...item, ...patch } : item)));

  /** Заполненную карточку свернуть и открыть следующую */
  const goNext = (key: number) =>
    setPassengers((list) => {
      const position = list.findIndex((item) => item.key === key);
      return list.map((item, index) => {
        if (index === position) return { ...item, open: false };
        if (index === position + 1) return { ...item, open: true };
        return item;
      });
    });

  const unfinished = passengers
    .map((item, index) => ({
      index: index + 1,
      valid: !Object.keys(validatePassenger(item.draft)).length,
    }))
    .filter(({ valid }) => !valid)
    .map(({ index }) => `пассажир ${index}`);

  return (
    <>
      <PageTitle title="Пассажиры" />
      <TripDetails data={MOCK_TRIP_DETAILS} />
      <section aria-labelledby="passengers-title">
        <h1 className="visually-hidden" id="passengers-title">
          Пассажиры
        </h1>
        {passengers.map((item, index) => (
          <PassengerCard
            key={item.key}
            index={index + 1}
            value={item.draft}
            open={item.open}
            onChange={(draft) => update(item.key, { draft })}
            onToggle={() => update(item.key, { open: !item.open })}
            onRemove={
              passengers.length > 1
                ? () => setPassengers((list) => list.filter(({ key }) => key !== item.key))
                : undefined
            }
            onNext={() => goNext(item.key)}
          />
        ))}
        {passengers.length < MAX_TICKETS && (
          <AddPassengerButton
            onClick={() =>
              setPassengers((list) => [
                ...list.map((item) => ({ ...item, open: false })),
                entry(createPassenger(), true),
              ])
            }
          />
        )}
        <div className="order-next">
          {unfinished.length > 0 && (
            <p className="order-next__hint" id="passengers-missing">
              Заполните данные: {unfinished.join(', ')}
            </p>
          )}
          <button
            className="button button_variant_primary order-next__button"
            type="button"
            disabled={unfinished.length > 0}
            aria-describedby={unfinished.length > 0 ? 'passengers-missing' : undefined}
            onClick={() => void navigate(ROUTES.payment)}
          >
            Далее
          </button>
        </div>
      </section>
    </>
  );
}
