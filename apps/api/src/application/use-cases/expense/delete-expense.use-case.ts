import { IExpenseRepository } from '../../../domain/repositories/expense.repository'
import { NotFoundError } from '../../../domain/errors/domain.errors'

export class DeleteExpenseUseCase {
  constructor(private expenseRepo: IExpenseRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.expenseRepo.findById(id)
    if (!existing) throw new NotFoundError('Expense', id)
    await this.expenseRepo.delete(id) // Charges deleted via cascade
  }
}
