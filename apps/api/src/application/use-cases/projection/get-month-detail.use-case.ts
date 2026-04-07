import { IChargeRepository } from '../../../domain/repositories/charge.repository'
import { MonthDetail } from '@finance/types'

interface ChargeDetail {
  id: string
  amount: number
  expenseId: string
  description: string
  type: string
  installmentNo: number | null
  installmentCount: number | null
  cardId: string
  cardName: string
  categoryId: string | null
  categoryName: string | null
  categoryColor: string | null
  isPaid: boolean
}

export class GetMonthDetailUseCase {
  constructor(private chargeRepo: IChargeRepository) {}

  async execute(year: number, month: number, userId: string): Promise<MonthDetail & { charges: ChargeDetail[] }> {
    const [charges, completedLastMonth] = await Promise.all([
      this.chargeRepo.findByMonth(year, month, userId),
      this.chargeRepo.findCompletedInPreviousMonth(year, month, userId),
    ])

    const total = charges.reduce((sum, c) => sum + c.amount, 0)

    return {
      year,
      month,
      total,
      charges: charges.map((c) => ({
        id: c.id,
        amount: c.amount,
        expenseId: c.expenseId,
        description: c.expense.description,
        type: c.expense.type as any,
        installmentNo: c.installmentNo,
        installmentCount: c.expense.installmentCount,
        cardId: c.expense.cardId,
        cardName: c.expense.card.name,
        categoryId: c.expense.categoryId,
        categoryName: c.expense.category?.name ?? null,
        categoryColor: c.expense.category?.color ?? null,
        isPaid: c.isPaid,
      })),
      completedLastMonth,
    }
  }
}
