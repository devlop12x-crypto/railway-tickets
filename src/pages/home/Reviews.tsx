import { useState } from 'react';
import ekaterina from '../../assets/images/reviews/ekaterina.jpg';
import evgeniy from '../../assets/images/reviews/evgeniy.jpg';
import { ANCHORS } from '../../shared/config/routes';
import './Reviews.css';

const DESIGN_REVIEWS = [
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

/** Страниц в слайдере по макету — 5, а отзывов на макете два: до источника данных повторяем их */
const PAGES = 5;
const PER_PAGE = 2;
const REVIEWS = Array.from({ length: PAGES * PER_PAGE }, (_, index) => {
  const review = DESIGN_REVIEWS[index % DESIGN_REVIEWS.length]!;
  return { ...review, key: `${review.id}-${index}` };
});

export function Reviews() {
  const [page, setPage] = useState(0);
  const visible = REVIEWS.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <section className="reviews" id={ANCHORS.reviews} aria-labelledby="reviews-title">
      <div className="container">
        <h2 className="section-title" id="reviews-title">
          Отзывы
        </h2>
        <ul className="reviews__list" aria-live="polite">
          {visible.map(({ key, name, photo, text }) => (
            <li key={key} className="review">
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
              className={`reviews__dot${index === page ? ' reviews__dot_active' : ''}`}
              type="button"
              aria-label={`Страница ${index + 1}`}
              aria-current={index === page ? 'true' : undefined}
              onClick={() => setPage(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
