import { IChargeRepository } from '../../../domain/repositories/charge.repository'
import { MonthDetail } from '@finance/types'

export class GetMonthDetailUseCase {
  constructor(private chargeRepo: IChargeRepository) {}

  async execute(year: number, month: number): Promise<MonthDetail> {
    const charges = await this.chargeRepo.findByMonth(year, month)

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
        isPaid: c.isPaid,
      })),
    }
  }
}
