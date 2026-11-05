const formatter = new Intl.NumberFormat('ru-RU');

/** 1920 → «1 920» (с неразрывным пробелом) */
export function formatPrice(value: number): string {
  return formatter.format(value);
}
