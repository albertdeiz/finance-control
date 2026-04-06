export type ExpenseType = 'INSTALLMENT' | 'RECURRING'

export interface ExpenseEntity {
  id: string
  userId: string
  description: string
  amount: number
  type: ExpenseType
  purchaseDate: Date
  cardId: string
  categoryId: string | null
  installmentCount: number | null
  endDate: Date | null
  isActive: boolean
  createdAt: Date
}
