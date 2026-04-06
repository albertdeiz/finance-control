import { CreateExpenseDTO } from './expense'
import { MonthlyProjection } from './projection'

export interface SimulateExpenseDTO extends CreateExpenseDTO {}

export interface SimulationResult {
  baseline: MonthlyProjection[]
  withNewExpense: MonthlyProjection[]
  impact: MonthImpact[]
}

export interface MonthImpact {
  year: number
  month: number
  delta: number
}
