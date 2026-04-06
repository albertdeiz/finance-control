import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expensesApi } from '../api/expenses.api'
import type { UpdateExpenseDTO } from '@finance/types'

export const EXPENSES_KEY = ['expenses']

export function useExpenses() {
  return useQuery({ queryKey: EXPENSES_KEY, queryFn: expensesApi.list })
}

export function useCreateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: expensesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXPENSES_KEY })
      qc.invalidateQueries({ queryKey: ['projection'] })
    },
  })
}

export function useUpdateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseDTO }) => expensesApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXPENSES_KEY })
      qc.invalidateQueries({ queryKey: ['projection'] })
    },
  })
}

export function useDeleteExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: expensesApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EXPENSES_KEY })
      qc.invalidateQueries({ queryKey: ['projection'] })
    },
  })
}
