import { Icon } from './Icon';
import './Amenities.css';

interface AmenitiesProps {
  wifi: boolean;
  express: boolean;
  food: boolean;
  className?: string;
}

/** Значки удобств поезда: Wi-Fi, экспресс, питание */
export function Amenities({ wifi, express, food, className = '' }: AmenitiesProps) {
  const items = [
    { on: wifi, icon: 'wifi', label: 'Wi-Fi' },
    { on: express, icon: 'rocket', label: 'Экспресс' },
    { on: food, icon: 'cup', label: 'Питание' },
  ] as const;

  return (
    <ul className={`amenities ${className}`} aria-label="Удобства">
      {items
        .filter(({ on }) => on)
        .map(({ icon, label }) => (
          <li key={icon} className="amenities__item" title={label}>
            <Icon name={icon} size={22} />
            <span className="visually-hidden">{label}</span>
          </li>
        ))}
    </ul>
  );
}
