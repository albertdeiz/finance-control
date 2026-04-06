import { IExpenseRepository } from '../../../domain/repositories/expense.repository'
import { IChargeRepository } from '../../../domain/repositories/charge.repository'
import { NotFoundError, ForbiddenError } from '../../../domain/errors/domain.errors'

export class GetExpenseUseCase {
  constructor(
    private expenseRepo: IExpenseRepository,
    private chargeRepo: IChargeRepository
  ) {}

  async execute(id: string, userId: string) {
    const expense = await this.expenseRepo.findById(id)
    if (!expense) throw new NotFoundError('Expense', id)
    if (expense.userId !== userId) throw new ForbiddenError()
    const charges = await this.chargeRepo.findByExpenseId(id)
    return { ...expense, charges }
  }
}
