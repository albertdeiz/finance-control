import { ExpenseType } from './expense'

export interface MonthlyProjection {
  year: number
  month: number
  total: number
  installmentsTotal: number
  recurringTotal: number
  deltaFromPrevious: number | null
  deltaReasons: DeltaReason[]
}

export interface DeltaReason {
  description: string
  amount: number
  type: 'starts' | 'ends'
}

export interface MonthDetail {
  year: number
  month: number
  total: number
  charges: ChargeDetail[]
}

export interface ChargeDetail {
  id: string
  amount: number
  expenseId: string
  description: string
  type: ExpenseType
  installmentNo: number | null
  installmentCount: number | null
  cardId: string
  cardName: string
  isPaid: boolean
  categoryId: string | null
  categoryName: string | null
  categoryColor: string | null
}
