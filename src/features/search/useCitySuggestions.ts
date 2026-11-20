import { useEffect, useState } from 'react';
import { searchCities } from '../../api/cities';

const DEBOUNCE_MS = 200;

/**
 * Подсказки для введённого текста. Запрос уходит после паузы в наборе,
 * а ответ на устаревший текст отбрасывается — важно, когда источником станет сеть.
 */
export function useCitySuggestions(query: string, enabled: boolean): string[] {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!enabled || !query.trim()) return undefined;

    let stale = false;
    const timer = setTimeout(() => {
      void searchCities(query).then((result) => {
        if (!stale) setOptions(result);
      });
    }, DEBOUNCE_MS);

    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [query, enabled]);

  return enabled && query.trim() ? options : [];
}
