import { ORDER_STEPS, type OrderStep } from '../shared/config/orderSteps';
import './OrderSteps.css';

interface OrderStepsProps {
  current: OrderStep;
}

/** Полоса прогресса заказа. Пройденные и текущий шаги — оранжевые, текущий со стрелкой */
export function OrderSteps({ current }: OrderStepsProps) {
  return (
    <nav className="order-steps" aria-label="Этапы заказа">
      <ol className="order-steps__list">
        {ORDER_STEPS.map((label, index) => {
          const step = index + 1;
          const state = step < current ? 'done' : step === current ? 'current' : 'upcoming';

          return (
            <li
              key={label}
              className={`order-steps__item order-steps__item_state_${state}`}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <span className="order-steps__number">{step}</span>
              <span className="order-steps__label">{label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
