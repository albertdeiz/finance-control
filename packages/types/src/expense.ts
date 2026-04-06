export type ExpenseType = 'INSTALLMENT' | 'RECURRING'

export interface Expense {
  id: string
  description: string
  amount: number
  type: ExpenseType
  purchaseDate: string
  cardId: string
  installmentCount: number | null
  endDate: string | null
  isActive: boolean
  createdAt: string
  categoryId: string | null
}

export interface CreateExpenseDTO {
  description: string
  amount: number
  type: ExpenseType
  purchaseDate: string
  cardId: string
  // INSTALLMENT only
  installmentCount?: number
  // RECURRING only
  endDate?: string
  categoryId?: string | null
}

export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> {}
