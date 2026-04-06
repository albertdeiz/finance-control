import { api } from '@/lib/api'
import type { Expense, CreateExpenseDTO, UpdateExpenseDTO } from '@finance/types'

export const expensesApi = {
  list: () => api.get<Expense[]>('/expenses').then((r) => r.data),
  get: (id: string) => api.get<Expense>(`/expenses/${id}`).then((r) => r.data),
  create: (data: CreateExpenseDTO) => api.post<Expense>('/expenses', data).then((r) => r.data),
  update: (id: string, data: UpdateExpenseDTO) => api.put<Expense>(`/expenses/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
}
