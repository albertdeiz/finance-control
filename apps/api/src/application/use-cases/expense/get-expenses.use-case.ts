import { IExpenseRepository } from '../../../domain/repositories/expense.repository'
import { ExpenseEntity } from '../../../domain/entities/expense.entity'

export class GetExpensesUseCase {
  constructor(private expenseRepo: IExpenseRepository) {}
  async execute(): Promise<ExpenseEntity[]> {
    return this.expenseRepo.findAll()
  }
}
