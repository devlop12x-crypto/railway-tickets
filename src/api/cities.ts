import { MOCK_CITIES } from '../mocks/cities';

const MAX_RESULTS = 10;
/** Крупные узлы — первыми в подсказках, как «Москва» на «Мо» в макете */
const POPULAR = ['Москва', 'Санкт-Петербург'];
const rank = (city: string) => {
  const index = POPULAR.indexOf(city);
  return index === -1 ? POPULAR.length : index;
};

/**
 * Подсказки городов. Сейчас ищет в локальном списке, на этапе 4 станет запросом
 * GET /routes/cities?name=… — сигнатура уже асинхронная, как у API (первые 10 совпадений).
 */
export async function searchCities(query: string): Promise<string[]> {
  const needle = query.trim().toLowerCase().replaceAll('ё', 'е');
  if (!needle) return [];

  return MOCK_CITIES.filter((city) => city.toLowerCase().replaceAll('ё', 'е').startsWith(needle))
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, MAX_RESULTS);
}
