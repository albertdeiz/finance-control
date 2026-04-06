import { api } from '@/lib/api'
import type { SimulateExpenseDTO, SimulationResult } from '@finance/types'

export const simulationApi = {
  simulate: (data: SimulateExpenseDTO) =>
    api.post<SimulationResult>('/simulation', data).then((r) => r.data),
}
