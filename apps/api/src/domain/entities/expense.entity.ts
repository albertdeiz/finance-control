export type ExpenseType = 'INSTALLMENT' | 'RECURRING'

export interface ExpenseEntity {
  id: string
  description: string
  amount: number
  type: ExpenseType
  purchaseDate: Date
  cardId: string
  installmentCount: number | null
  endDate: Date | null
  isActive: boolean
  createdAt: Date
}
