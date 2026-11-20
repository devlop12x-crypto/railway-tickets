import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../shared/config/routes';
import { PageTitle } from '../shared/ui/PageTitle';
import { MOCK_TRIP_DETAILS } from '../mocks/order';
import { TripDetails } from '../features/trip-details/TripDetails';
import { PaymentForm } from '../features/payment/PaymentForm';
import type { PaymentValues } from '../features/payment/model';
import './PaymentPage.css';

const FORM_ID = 'payment-form';

/** Покупатель с макета — Ирина; телефон, почту и способ оплаты вводит пользователь */
const INITIAL: PaymentValues = {
  lastName: 'Мартынюк',
  firstName: 'Ирина',
  patronymic: 'Эдуардовна',
  phone: '',
  email: '',
  method: '',
};

/** Персональные данные покупателя и способ оплаты. На этапе 4 значения уйдут в заказ */
export function PaymentPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL);

  return (
    <>
      <PageTitle title="Оплата" />
      <TripDetails data={MOCK_TRIP_DETAILS} />
      <section className="payment" aria-labelledby="payment-title">
        <h1 className="visually-hidden" id="payment-title">
          Персональные данные и способ оплаты
        </h1>
        <PaymentForm
          id={FORM_ID}
          value={values}
          onChange={setValues}
          onSubmit={() => void navigate(ROUTES.confirmation)}
        />
        <div className="order-next">
          <button
            className="button button_variant_primary order-next__button"
            type="submit"
            form={FORM_ID}
          >
            Купить билеты
          </button>
        </div>
      </section>
    </>
  );
}
