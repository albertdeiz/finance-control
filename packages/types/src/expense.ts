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
}

export interface UpdateExpenseDTO extends Partial<CreateExpenseDTO> {}
