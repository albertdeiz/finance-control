import { ICardRepository } from '../../../domain/repositories/card.repository'
import { IChargeRepository } from '../../../domain/repositories/charge.repository'
import { NotFoundError, ValidationError } from '../../../domain/errors/domain.errors'
import { getBillingMonth, addMonths } from '../../../shared/billing'
import { SimulationResult, MonthlyProjection } from '@finance/types'

const PROJECTION_HORIZON_MONTHS = 12
const SIMULATION_HORIZON_MONTHS = 24

interface Input {
  description: string
  amount: number
  type: 'INSTALLMENT' | 'RECURRING'
  purchaseDate: string
  cardId: string
  installmentCount?: number
  endDate?: string
}

export class SimulateExpenseUseCase {
  constructor(
    private cardRepo: ICardRepository,
    private chargeRepo: IChargeRepository
  ) {}

  async execute(input: Input): Promise<SimulationResult> {
    const card = await this.cardRepo.findById(input.cardId)
    if (!card) throw new NotFoundError('Card', input.cardId)

    if (input.type === 'INSTALLMENT' && !input.installmentCount) {
      throw new ValidationError('installmentCount is required for INSTALLMENT simulation')
    }

    const now = new Date()
    const baseline = await this.chargeRepo.getMonthlyTotals(
      now.getFullYear(),
      now.getMonth() + 1,
      PROJECTION_HORIZON_MONTHS
    )

    // Build simulated charges map
    const simulatedByMonth = new Map<string, number>()
    const purchaseDate = new Date(input.purchaseDate)
    const firstBilling = getBillingMonth(purchaseDate, card.cutoffDay)

    if (input.type === 'INSTALLMENT') {
      const count = input.installmentCount!
      for (let i = 0; i < count; i++) {
        const { year, month } = addMonths(firstBilling, i)
        const key = `${year}-${month}`
        simulatedByMonth.set(key, (simulatedByMonth.get(key) ?? 0) + input.amount)
      }
    } else {
      const endDate = input.endDate ? new Date(input.endDate) : null
      for (let i = 0; i < SIMULATION_HORIZON_MONTHS; i++) {
        const { year, month } = addMonths(firstBilling, i)
        if (endDate && new Date(year, month - 1, 1) > endDate) break
        const key = `${year}-${month}`
        simulatedByMonth.set(key, (simulatedByMonth.get(key) ?? 0) + input.amount)
      }
    }

    const baselineProjections: MonthlyProjection[] = baseline.map((t, i) => ({
      year: t.year,
      month: t.month,
      total: t.total,
      installmentsTotal: t.installmentsTotal,
      recurringTotal: t.recurringTotal,
      deltaFromPrevious: i === 0 ? null : t.total - baseline[i - 1].total,
      deltaReasons: [],
    }))

    const withNewExpense: MonthlyProjection[] = baseline.map((t, i) => {
      const key = `${t.year}-${t.month}`
      const extra = simulatedByMonth.get(key) ?? 0
      return {
        year: t.year,
        month: t.month,
        total: t.total + extra,
        installmentsTotal: input.type === 'INSTALLMENT' ? t.installmentsTotal + extra : t.installmentsTotal,
        recurringTotal: input.type === 'RECURRING' ? t.recurringTotal + extra : t.recurringTotal,
        deltaFromPrevious: i === 0 ? null : (t.total + extra) - (baseline[i - 1].total + (simulatedByMonth.get(`${baseline[i-1].year}-${baseline[i-1].month}`) ?? 0)),
        deltaReasons: [],
      }
    })

    const impact = baseline.map((t) => {
      const key = `${t.year}-${t.month}`
      return {
        year: t.year,
        month: t.month,
        delta: simulatedByMonth.get(key) ?? 0,
      }
    }).filter((i) => i.delta !== 0)

    return { baseline: baselineProjections, withNewExpense, impact }
  }
}
