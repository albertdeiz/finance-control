import { IExpenseRepository } from '../../../domain/repositories/expense.repository'
import { IChargeRepository } from '../../../domain/repositories/charge.repository'
import { ICardRepository } from '../../../domain/repositories/card.repository'
import { ExpenseEntity } from '../../../domain/entities/expense.entity'
import { NotFoundError, ForbiddenError } from '../../../domain/errors/domain.errors'
import { getBillingMonth, addMonths } from '../../../shared/billing'

interface Input {
  id: string
  userId: string
  description?: string
  amount?: number
  type?: 'INSTALLMENT' | 'RECURRING'
  purchaseDate?: string
  cardId?: string
  categoryId?: string
  installmentCount?: number
  endDate?: string
}

export class UpdateExpenseUseCase {
  constructor(
    private expenseRepo: IExpenseRepository,
    private chargeRepo: IChargeRepository,
    private cardRepo: ICardRepository
  ) {}

  async execute(input: Input): Promise<ExpenseEntity> {
    const existing = await this.expenseRepo.findById(input.id)
    if (!existing) throw new NotFoundError('Expense', input.id)
    if (existing.userId !== input.userId) throw new ForbiddenError()

    const updated = await this.expenseRepo.update(input.id, {
      description: input.description,
      amount: input.amount,
      type: input.type,
      purchaseDate: input.purchaseDate ? new Date(input.purchaseDate) : undefined,
      cardId: input.cardId,
      categoryId: input.categoryId,
      installmentCount: input.installmentCount,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
    })

    // Regenerate charges if anything billing-related changed
    const billingFields = ['amount', 'type', 'purchaseDate', 'cardId', 'installmentCount', 'endDate']
    const hasBillingChange = billingFields.some((f) => (input as any)[f] !== undefined)

    if (hasBillingChange) {
      await this.chargeRepo.deleteByExpenseId(input.id)

      const card = await this.cardRepo.findById(updated.cardId)
      if (!card) throw new NotFoundError('Card', updated.cardId)

      const purchaseDate = updated.purchaseDate
      const firstBilling = getBillingMonth(purchaseDate, card.cutoffDay)
      const HORIZON = 24

      if (updated.type === 'INSTALLMENT' && updated.installmentCount) {
        const charges = Array.from({ length: updated.installmentCount }, (_, i) => {
          const { year, month } = addMonths(firstBilling, i)
          return { expenseId: updated.id, amount: updated.amount, billingYear: year, billingMonth: month, installmentNo: i + 1, isPaid: false, paidAt: null }
        })
        await this.chargeRepo.createMany(charges)
      } else if (updated.type === 'RECURRING') {
        const endDate = updated.endDate
        const charges = []
        for (let i = 0; i < HORIZON; i++) {
          const { year, month } = addMonths(firstBilling, i)
          if (endDate && new Date(year, month - 1, 1) > endDate) break
          charges.push({ expenseId: updated.id, amount: updated.amount, billingYear: year, billingMonth: month, installmentNo: null, isPaid: false, paidAt: null })
        }
        await this.chargeRepo.createMany(charges)
      }
    }

    return updated
  }
}
