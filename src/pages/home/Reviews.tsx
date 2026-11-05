import ekaterina from '../../assets/images/reviews/ekaterina.jpg';
import evgeniy from '../../assets/images/reviews/evgeniy.jpg';
import { ANCHORS } from '../../shared/config/routes';
import './Reviews.css';

const REVIEWS = [
  {
    id: 'ekaterina',
    name: 'Екатерина Вальнова',
    photo: ekaterina,
    text: 'Доброжелательные подсказки\nна всех этапах помогут правильно заполнить поля и без затруднений купить авиа или ж/д билет, даже если вы заказываете онлайн билет впервые.',
  },
  {
    id: 'evgeniy',
    name: 'Евгений Стрыкало',
    photo: evgeniy,
    text: 'СМС-сопровождение до посадки\nСразу после оплаты ж/д билетов\nи за 3 часа до отправления мы пришлем вам\nСМС-напоминание о поездке.',
  },
];

/** Страниц в слайдере отзывов по макету. Переключение — на этапе 3 */
const PAGES = 5;

export function Reviews() {
  return (
    <section className="reviews" id={ANCHORS.reviews} aria-labelledby="reviews-title">
      <div className="container">
        <h2 className="section-title" id="reviews-title">
          Отзывы
        </h2>
        <ul className="reviews__list">
          {REVIEWS.map(({ id, name, photo, text }) => (
            <li key={id} className="review">
              <img className="review__photo" src={photo} alt="" width={206} height={206} />
              <div>
                <h3 className="review__name">{name}</h3>
                <blockquote className="review__text">{text}</blockquote>
              </div>
            </li>
          ))}
        </ul>
        <div className="reviews__pager" role="group" aria-label="Страницы отзывов">
          {Array.from({ length: PAGES }, (_, index) => (
            <button
              key={index}
              className={`reviews__dot${index === 0 ? ' reviews__dot_active' : ''}`}
              type="button"
              aria-label={`Страница ${index + 1}`}
              aria-current={index === 0 ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
