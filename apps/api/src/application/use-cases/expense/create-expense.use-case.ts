import { IExpenseRepository } from '../../../domain/repositories/expense.repository'
import { IChargeRepository } from '../../../domain/repositories/charge.repository'
import { ICardRepository } from '../../../domain/repositories/card.repository'
import { ExpenseEntity, ExpenseType } from '../../../domain/entities/expense.entity'
import { NotFoundError, ValidationError, ForbiddenError } from '../../../domain/errors/domain.errors'
import { getBillingMonth, addMonths } from '../../../shared/billing'

const PROJECTION_HORIZON_MONTHS = 24

interface Input {
  userId: string
  description: string
  amount: number
  type: ExpenseType
  purchaseDate: string
  cardId: string
  categoryId?: string
  installmentCount?: number
  endDate?: string
}

export class CreateExpenseUseCase {
  constructor(
    private expenseRepo: IExpenseRepository,
    private chargeRepo: IChargeRepository,
    private cardRepo: ICardRepository
  ) {}

  async execute(input: Input): Promise<ExpenseEntity> {
    const card = await this.cardRepo.findById(input.cardId)
    if (!card) throw new NotFoundError('Card', input.cardId)
    if (card.userId !== input.userId) throw new ForbiddenError()

    if (input.type === 'INSTALLMENT' && !input.installmentCount) {
      throw new ValidationError('installmentCount is required for INSTALLMENT expenses')
    }

    const purchaseDate = new Date(input.purchaseDate)

    const expense = await this.expenseRepo.create({
      userId: input.userId,
      description: input.description,
      amount: input.amount,
      type: input.type,
      purchaseDate,
      cardId: input.cardId,
      categoryId: input.categoryId ?? null,
      installmentCount: input.installmentCount ?? null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      isActive: true,
    })

    const firstBilling = getBillingMonth(purchaseDate, card.cutoffDay)

    if (input.type === 'INSTALLMENT') {
      const count = input.installmentCount!
      const charges = Array.from({ length: count }, (_, i) => {
        const { year, month } = addMonths(firstBilling, i)
        return {
          expenseId: expense.id,
          amount: input.amount,
          billingYear: year,
          billingMonth: month,
          installmentNo: i + 1,
          isPaid: false,
          paidAt: null,
        }
      })
      await this.chargeRepo.createMany(charges)
    } else {
      // RECURRING: generate up to horizon or endDate
      const endDate = input.endDate ? new Date(input.endDate) : null
      const charges = []

      for (let i = 0; i < PROJECTION_HORIZON_MONTHS; i++) {
        const { year, month } = addMonths(firstBilling, i)

        if (endDate) {
          const chargeDate = new Date(year, month - 1, 1)
          if (chargeDate > endDate) break
        }

        charges.push({
          expenseId: expense.id,
          amount: input.amount,
          billingYear: year,
          billingMonth: month,
          installmentNo: null,
          isPaid: false,
          paidAt: null,
        })
      }

      await this.chargeRepo.createMany(charges)
    }

    return expense
  }
}
