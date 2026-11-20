import { useState } from 'react';
import { useSearchParams } from 'react-router';
import type { TrainRoute } from '../../entities/train/types';
import { fromSearchParams } from '../search/model';
import { createFilters, priceBounds, type TrainFilters } from './model';

/** Состояние фильтров страницы: даты берутся из поиска в адресе, шкала цены — из данных */
export function useTrainFilters(routes: readonly TrainRoute[]) {
  const [searchParams] = useSearchParams();
  const bounds = priceBounds(routes);
  const [filters, setFilters] = useState<TrainFilters>(() => {
    const { dateThere, dateBack } = fromSearchParams(searchParams);
    return { ...createFilters(bounds), dateThere, dateBack };
  });

  return { filters, setFilters, bounds };
}
