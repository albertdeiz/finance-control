import { useQuery } from '@tanstack/react-query'
import { projectionApi } from '../api/projection.api'

export function useProjection(months = 12) {
  return useQuery({
    queryKey: ['projection', months],
    queryFn: () => projectionApi.getProjection(months),
  })
}

export function useMonthDetail(year: number, month: number) {
  return useQuery({
    queryKey: ['projection', year, month],
    queryFn: () => projectionApi.getMonthDetail(year, month),
  })
}
