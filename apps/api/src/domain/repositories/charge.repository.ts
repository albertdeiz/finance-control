import { ChargeEntity } from '../entities/charge.entity'

export interface IChargeRepository {
  findByMonth(year: number, month: number): Promise<(ChargeEntity & { expense: { description: string; type: string; installmentCount: number | null; cardId: string; card: { name: string } } })[]>
  findByExpenseId(expenseId: string): Promise<ChargeEntity[]>
  createMany(charges: Omit<ChargeEntity, 'id'>[]): Promise<void>
  deleteByExpenseId(expenseId: string): Promise<void>
  getMonthlyTotals(fromYear: number, fromMonth: number, months: number): Promise<{ year: number; month: number; total: number; installmentsTotal: number; recurringTotal: number }[]>
}
