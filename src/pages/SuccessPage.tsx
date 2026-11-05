import { Link } from 'react-router';
import email from '../assets/images/success/email.png';
import conductor from '../assets/images/success/conductor.png';
import print from '../assets/images/success/print.png';
import { ROUTES } from '../shared/config/routes';
import { Icon } from '../shared/ui/Icon';
import { PageTitle } from '../shared/ui/PageTitle';
import './SuccessPage.css';

/** Шаги после покупки. Акцентная часть подписи выделена жирным, как в макете */
const NEXT_STEPS = [
  {
    id: 'email',
    image: email,
    before: 'билеты будут\nотправлены\nна ваш ',
    accent: 'e-mail',
    after: '',
  },
  {
    id: 'print',
    image: print,
    before: '',
    accent: 'распечатайте',
    after: '\nи сохраняйте билеты\nдо даты поездки',
  },
  {
    id: 'conductor',
    image: conductor,
    before: '',
    accent: 'предъявите',
    after: '\nраспечатанные\nбилеты при посадке',
  },
];

const RATING_MAX = 5;

/**
 * Благодарность за заказ. Номер, сумма и имя — пока из макета:
 * настоящие данные заказа придут на этапе 4, оценка заработает на этапе 3.
 */
export function SuccessPage() {
  return (
    <>
      <PageTitle title="Заказ оформлен" />
      <section className="page-hero success-hero">
        <div className="container">
          <h1 className="success-hero__title">Благодарим Вас за заказ!</h1>
        </div>
      </section>

      <main className="success-page">
        <article className="container success-card">
          <header className="success-card__head">
            <h2 className="success-card__number">№Заказа 285АА</h2>
            <p className="success-card__sum">
              сумма <b className="success-card__amount">7 760</b>
              <span className="success-card__currency">₽</span>
            </p>
          </header>

          <ul className="success-card__steps">
            {NEXT_STEPS.map(({ id, image, before, accent, after }) => (
              <li key={id} className="success-card__step">
                <img
                  className="success-card__step-icon"
                  src={image}
                  alt=""
                  width={131}
                  height={131}
                />
                <p className="success-card__step-text">
                  {before}
                  <b>{accent}</b>
                  {after}
                </p>
              </li>
            ))}
          </ul>

          <div className="success-card__body">
            <h3 className="success-card__name">Ирина Эдуардовна!</h3>
            <p className="success-card__text">
              Ваш заказ успешно оформлен.
              <br />В ближайшее время с вами свяжется наш оператор для подтверждения.
            </p>
            <p className="success-card__thanks">
              Благодарим Вас за оказанное доверие и желаем приятного путешествия!
            </p>
          </div>

          <footer className="success-card__footer">
            <div className="rating" role="group" aria-labelledby="rating-label">
              <span className="rating__label" id="rating-label">
                Оценить сервис
              </span>
              <div className="rating__stars">
                {Array.from({ length: RATING_MAX }, (_, index) => (
                  <button
                    key={index}
                    className="rating__star"
                    type="button"
                    aria-label={`Оценка ${index + 1} из ${RATING_MAX}`}
                  >
                    <Icon name="starOutline" size={54} />
                  </button>
                ))}
              </div>
            </div>
            <Link className="button button_variant_outline-dark" to={ROUTES.home}>
              Вернуться на главную
            </Link>
          </footer>
        </article>
      </main>
    </>
  );
}
