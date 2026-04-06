import { api } from '@/lib/api'
import type { MonthlyProjection, MonthDetail } from '@finance/types'

export const projectionApi = {
  getProjection: (months = 12) =>
    api.get<MonthlyProjection[]>('/projection', { params: { months } }).then((r) => r.data),
  getMonthDetail: (year: number, month: number) =>
    api.get<MonthDetail>(`/projection/${year}/${month}`).then((r) => r.data),
}
