import { useId } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '../shared/config/routes';
import { PageTitle } from '../shared/ui/PageTitle';
import { MOCK_TRIP_DETAILS } from './order/mock';
import { TripDetails } from './order/TripDetails';
import './payment/PaymentPage.css';

const PERSON = [
  ['lastName', 'Фамилия', 'Мартынюк'],
  ['firstName', 'Имя', 'Ирина'],
  ['patronymic', 'Отчество', 'Эдуардовна'],
] as const;

const ONLINE_SYSTEMS = ['Банковской картой', 'PayPal', 'Visa QIWI Wallet'];

/** Персональные данные покупателя и способ оплаты. Валидация — этап 3 */
export function PaymentPage() {
  const id = useId();

  return (
    <>
      <PageTitle title="Оплата" />
      <TripDetails data={MOCK_TRIP_DETAILS} />
      <section className="payment" aria-labelledby="payment-title">
        <h1 className="visually-hidden" id="payment-title">
          Персональные данные и способ оплаты
        </h1>
        <form className="order-card" onSubmit={(event) => event.preventDefault()}>
          <header className="order-card__head order-card__head_plain">
            <h2 className="order-card__title">Персональные данные</h2>
          </header>
          <div className="order-card__section payment__personal">
            <div className="payment__names">
              {PERSON.map(([name, label, value]) => (
                <div key={name} className="field">
                  <label className="field__label field__label_strong" htmlFor={`${id}-${name}`}>
                    {label}
                  </label>
                  <input className="input" id={`${id}-${name}`} name={name} defaultValue={value} />
                </div>
              ))}
            </div>
            <div className="field payment__contact">
              <label className="field__label field__label_strong" htmlFor={`${id}-phone`}>
                Контактный телефон
              </label>
              <input
                className="input"
                id={`${id}-phone`}
                type="tel"
                autoComplete="tel"
                placeholder="+7 ___ ___ __ __"
              />
            </div>
            <div className="field payment__contact">
              <label className="field__label field__label_strong" htmlFor={`${id}-email`}>
                E-mail
              </label>
              <input
                className="input"
                id={`${id}-email`}
                type="email"
                autoComplete="email"
                placeholder="inbox@gmail.ru"
              />
            </div>
          </div>

          <header className="order-card__head order-card__head_plain payment__method-head">
            <h2 className="order-card__title">Способ оплаты</h2>
          </header>
          <fieldset className="payment__fieldset">
            <legend className="visually-hidden">Способ оплаты</legend>
            <div className="order-card__section payment__online">
              <label className="checkbox payment__method">
                <input className="checkbox__input" type="radio" name="payment" value="online" />
                Онлайн
              </label>
              <ul className="payment__systems">
                {ONLINE_SYSTEMS.map((system) => (
                  <li key={system}>{system}</li>
                ))}
              </ul>
            </div>
            <div className="order-card__section payment__cash">
              <label className="checkbox payment__method">
                <input className="checkbox__input" type="radio" name="payment" value="cash" />
                Наличными
              </label>
            </div>
          </fieldset>
        </form>

        <div className="order-next">
          <Link
            className="button button_variant_primary order-next__button"
            to={ROUTES.confirmation}
          >
            Купить билеты
          </Link>
        </div>
      </section>
    </>
  );
}
