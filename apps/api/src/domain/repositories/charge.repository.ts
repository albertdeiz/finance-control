import { ChargeEntity } from '../entities/charge.entity'

export interface IChargeRepository {
  findByMonth(year: number, month: number, userId: string): Promise<(ChargeEntity & { expense: { description: string; type: string; installmentCount: number | null; cardId: string; card: { name: string }; categoryId: string | null; category: { name: string; color: string | null } | null } })[]>
  findByExpenseId(expenseId: string): Promise<ChargeEntity[]>
  createMany(charges: Omit<ChargeEntity, 'id'>[]): Promise<void>
  deleteByExpenseId(expenseId: string): Promise<void>
  getMonthlyTotals(fromYear: number, fromMonth: number, months: number, userId: string): Promise<{ year: number; month: number; total: number; installmentsTotal: number; recurringTotal: number }[]>
  findCompletedInPreviousMonth(year: number, month: number, userId: string): Promise<{ expenseId: string; description: string; amount: number; type: string; cardName: string; installmentCount: number | null; categoryName: string | null; categoryColor: string | null }[]>
}
