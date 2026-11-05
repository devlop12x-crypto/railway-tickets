import { ANCHORS } from '../../shared/config/routes';
import './AboutSection.css';

export function AboutSection() {
  return (
    <section className="about" id={ANCHORS.about} aria-labelledby="about-title">
      <div className="container">
        <h2 className="section-title" id="about-title">
          О нас
        </h2>
        <div className="about__text">
          <p>
            Мы рады видеть вас! Мы работаем для Вас с 2003 года. 14 лет мы наблюдаем, как с каждым
            днем
            <br />
            все больше людей заказывают жд билеты через интернет.
          </p>
          <p>
            Сегодня можно заказать железнодорожные билеты онлайн всего в 2 клика, но стоит ли это
            делать?
            <br />
            Мы расскажем о преимуществах заказа через интернет.
          </p>
          <p className="about__accent">
            Покупать жд билеты дешево можно за 90 суток до отправления поезда.
            <br />
            Благодаря динамическому ценообразованию цена на билеты в это время самая низкая.
          </p>
        </div>
      </div>
    </section>
  );
}
