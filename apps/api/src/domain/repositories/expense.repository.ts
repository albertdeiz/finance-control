import { ExpenseEntity } from '../entities/expense.entity'

export interface IExpenseRepository {
  findAllByUserId(userId: string): Promise<ExpenseEntity[]>
  findById(id: string): Promise<ExpenseEntity | null>
  create(data: Omit<ExpenseEntity, 'id' | 'createdAt'>): Promise<ExpenseEntity>
  update(id: string, data: Partial<Omit<ExpenseEntity, 'id' | 'createdAt'>>): Promise<ExpenseEntity>
  delete(id: string): Promise<void>
}
