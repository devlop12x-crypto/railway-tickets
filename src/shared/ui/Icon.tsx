import { ICONS, type IconName } from './icons';

interface IconProps {
  name: IconName;
  /** Высота в px; ширина — по пропорциям viewBox. Цвет берётся из currentColor */
  size?: number;
  className?: string | undefined;
}

/** Декоративная иконка: смысл всегда передаёт подпись рядом или aria-label у кнопки */
export function Icon({ name, size = 24, className }: IconProps) {
  const { viewBox, paths } = ICONS[name];
  // Иконки брендов не квадратные: квадратная рамка ужала бы широкие (YouTube, Google+)
  const [, , vbWidth = 1, vbHeight = 1] = viewBox.split(' ').map(Number);

  return (
    <svg
      className={className}
      width={Math.round((size * vbWidth) / vbHeight)}
      height={size}
      viewBox={viewBox}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
