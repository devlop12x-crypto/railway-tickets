import { useState, type FormEvent } from 'react';
import { ANCHORS } from '../shared/config/routes';
import { isEmail } from '../shared/lib/validation';
import { Icon } from '../shared/ui/Icon';
import { Modal } from '../shared/ui/Modal';
import type { IconName } from '../shared/ui/icons';
import './Footer.css';

// size: у Material-иконок поле вокруг рисунка, поэтому они крупнее, чем Skype из Font Awesome
const CONTACTS: { icon: IconName; size: number; label: string; text: string; href?: string }[] = [
  {
    icon: 'phone',
    size: 38,
    label: 'Телефон',
    text: '8 (800) 000 00 00',
    href: 'tel:+78000000000',
  },
  { icon: 'email', size: 38, label: 'E-mail', text: 'inbox@mail.ru', href: 'mailto:inbox@mail.ru' },
  {
    icon: 'skype',
    size: 34,
    label: 'Skype',
    text: 'tu.train.tickets',
    href: 'skype:tu.train.tickets?chat',
  },
  { icon: 'pin', size: 38, label: 'Адрес', text: 'г. Москва\nул. Московская 27-35\n555 555' },
];

const SOCIALS: { icon: IconName; label: string; href: string }[] = [
  { icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/' },
  { icon: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { icon: 'googlePlus', label: 'Google+', href: 'https://plus.google.com/' },
  { icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/' },
  { icon: 'twitter', label: 'Twitter', href: 'https://twitter.com/' },
];

/**
 * Подписка: адрес проверяется при отправке, ошибка — под полем, успех — окном.
 * Запрос /subscribe — этап 4
 */
function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState('');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (!value) {
      setError('Укажите e-mail');
      return;
    }
    if (!isEmail(value)) {
      setError('E-mail указан некорректно, например inbox@gmail.ru');
      return;
    }
    setError('');
    setSubscribed(value);
    setEmail('');
  };

  return (
    <form className="subscribe" noValidate onSubmit={submit}>
      <label className="subscribe__label" htmlFor="subscribe-email">
        Будьте в курсе событий
      </label>
      <div className="subscribe__row">
        <input
          className={`subscribe__input${error ? ' subscribe__input_invalid' : ''}`}
          id="subscribe-email"
          type="email"
          name="email"
          placeholder="e-mail"
          autoComplete="email"
          value={email}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'subscribe-error' : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            // Ошибка уходит, как только пользователь начал исправлять
            if (error) setError('');
          }}
        />
        <button className="button button_variant_ghost subscribe__submit" type="submit">
          Отправить
        </button>
      </div>
      {error && (
        <p className="subscribe__error" id="subscribe-error">
          {error}
        </p>
      )}
      <Modal
        open={Boolean(subscribed)}
        onClose={() => setSubscribed('')}
        variant="info"
        title="Вы подписаны"
      >
        Новости и акции будут приходить на {subscribed}
      </Modal>
    </form>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__columns">
        <section
          className="footer__contacts"
          id={ANCHORS.contacts}
          aria-labelledby="footer-contacts"
        >
          <h2 className="footer__title" id="footer-contacts">
            Свяжитесь с нами
          </h2>
          <ul className="footer__contact-list">
            {CONTACTS.map(({ icon, size, label, text, href }) => (
              <li key={icon} className="footer__contact">
                <span className="footer__contact-icon">
                  <Icon name={icon} size={size} />
                </span>
                <span className="visually-hidden">{label}: </span>
                {href ? (
                  <a className="footer__contact-text footer__contact-link" href={href}>
                    {text}
                  </a>
                ) : (
                  <address className="footer__contact-text">{text}</address>
                )}
              </li>
            ))}
          </ul>
        </section>

        <div className="footer__aside">
          <section aria-labelledby="footer-subscribe">
            <h2 className="footer__title" id="footer-subscribe">
              Подписка
            </h2>
            <SubscribeForm />
          </section>

          <section className="footer__socials" aria-labelledby="footer-socials">
            <h2 className="footer__title" id="footer-socials">
              Подписывайтесь на нас
            </h2>
            <ul className="socials">
              {SOCIALS.map(({ icon, label, href }) => (
                <li key={icon}>
                  <a
                    className="socials__link"
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                  >
                    <Icon name={icon} size={36} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span className="logo">Лого</span>
          <button
            className="footer__up"
            type="button"
            aria-label="Наверх"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Icon name="arrowUp" size={28} />
          </button>
          <small className="footer__copyright">2018 WEB</small>
        </div>
      </div>
    </footer>
  );
}
