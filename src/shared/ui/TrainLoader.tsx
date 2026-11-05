import './TrainLoader.css';

/** Три вагона и локомотив из макета «экран загрузки» */
function Train() {
  const cars = [0, 76, 152];

  return (
    <svg
      className="train-loader__train"
      viewBox="0 0 288 16"
      width="288"
      height="16"
      aria-hidden="true"
    >
      {cars.map((x) => (
        <g key={x}>
          <rect x={x} y="1" width="73" height="13" rx="2" />
          {Array.from({ length: 9 }, (_, index) => (
            <rect
              key={index}
              className="train-loader__window"
              x={x + 5 + index * 7.4}
              y="4"
              width="4"
              height="3"
            />
          ))}
          <rect x={x + 6} y="14" width="8" height="2" />
          <rect x={x + 59} y="14" width="8" height="2" />
        </g>
      ))}
      <path d="M228 14V3h34l14 5 10 4v2z" />
      <rect className="train-loader__window" x="232" y="5" width="22" height="3" />
      <rect x="232" y="14" width="10" height="2" />
      <rect x="268" y="14" width="10" height="2" />
    </svg>
  );
}

/** Анимация поиска: поезд едет по рельсу. Подпись читают скринридеры */
export function TrainLoader({ label = 'Идет поиск' }: { label?: string }) {
  return (
    <div className="train-loader" role="status" aria-live="polite">
      <p className="train-loader__label">{label}</p>
      <div className="train-loader__track">
        <Train />
      </div>
    </div>
  );
}
