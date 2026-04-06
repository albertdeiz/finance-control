import { IChargeRepository } from '../../../domain/repositories/charge.repository'
import { MonthlyProjection } from '@finance/types'

export class GetProjectionUseCase {
  constructor(private chargeRepo: IChargeRepository) {}

  async execute(months: number = 12, userId: string): Promise<MonthlyProjection[]> {
    const now = new Date()
    const totals = await this.chargeRepo.getMonthlyTotals(now.getFullYear(), now.getMonth() + 1, months, userId)

    return totals.map((t, i) => ({
      year: t.year,
      month: t.month,
      total: t.total,
      installmentsTotal: t.installmentsTotal,
      recurringTotal: t.recurringTotal,
      deltaFromPrevious: i === 0 ? null : t.total - totals[i - 1].total,
      deltaReasons: [], // populated in detail endpoint
    }))
  }
}
