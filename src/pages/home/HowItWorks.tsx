import { Link } from 'react-router';
import { ANCHORS } from '../../shared/config/routes';
import { Icon } from '../../shared/ui/Icon';
import type { IconName } from '../../shared/ui/icons';
import './HowItWorks.css';

const FEATURES: { icon: IconName; text: string }[] = [
  { icon: 'desktop', text: 'Удобный заказ\nна сайте' },
  { icon: 'building', text: 'Нет необходимости\nехать в офис' },
  { icon: 'globe', text: 'Огромный выбор\nнаправлений' },
];

export function HowItWorks() {
  return (
    <section className="how" id={ANCHORS.howItWorks} aria-labelledby="how-title">
      <div className="container">
        <div className="how__head">
          <h2 className="section-title" id="how-title">
            Как это работает
          </h2>
          {/* Подробности о заказе — в блоке «О нас» */}
          <Link className="button button_variant_ghost how__more" to={{ hash: ANCHORS.about }}>
            Узнать больше
          </Link>
        </div>
        <ul className="how__list">
          {FEATURES.map(({ icon, text }) => (
            <li key={icon} className="how__item">
              <span className="how__icon">
                <Icon name={icon} size={80} />
              </span>
              <p className="how__text">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
