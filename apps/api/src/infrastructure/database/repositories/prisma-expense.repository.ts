import { IExpenseRepository } from '../../../domain/repositories/expense.repository'
import { ExpenseEntity } from '../../../domain/entities/expense.entity'
import { prisma } from '../prisma.client'

export class PrismaExpenseRepository implements IExpenseRepository {
  async findAllByUserId(userId: string): Promise<ExpenseEntity[]> {
    const expenses = await prisma.expense.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return expenses.map(this.toEntity)
  }

  async findById(id: string): Promise<ExpenseEntity | null> {
    const expense = await prisma.expense.findUnique({ where: { id } })
    return expense ? this.toEntity(expense) : null
  }

  async create(data: Omit<ExpenseEntity, 'id' | 'createdAt'>): Promise<ExpenseEntity> {
    const expense = await prisma.expense.create({
      data: {
        userId: data.userId,
        description: data.description,
        amount: data.amount,
        type: data.type,
        purchaseDate: data.purchaseDate,
        cardId: data.cardId,
        categoryId: data.categoryId ?? undefined,
        installmentCount: data.installmentCount ?? undefined,
        endDate: data.endDate ?? undefined,
        isActive: data.isActive,
      },
    })
    return this.toEntity(expense)
  }

  async update(id: string, data: Partial<Omit<ExpenseEntity, 'id' | 'createdAt'>>): Promise<ExpenseEntity> {
    const expense = await prisma.expense.update({
      where: { id },
      data: {
        description: data.description,
        amount: data.amount !== undefined ? data.amount : undefined,
        type: data.type,
        purchaseDate: data.purchaseDate,
        cardId: data.cardId,
        categoryId: data.categoryId,
        installmentCount: data.installmentCount,
        endDate: data.endDate,
        isActive: data.isActive,
      },
    })
    return this.toEntity(expense)
  }

  async delete(id: string): Promise<void> {
    await prisma.expense.delete({ where: { id } })
  }

  private toEntity(expense: any): ExpenseEntity {
    return {
      id: expense.id,
      userId: expense.userId,
      description: expense.description,
      amount: Number(expense.amount),
      type: expense.type,
      purchaseDate: expense.purchaseDate,
      cardId: expense.cardId,
      categoryId: expense.categoryId,
      installmentCount: expense.installmentCount,
      endDate: expense.endDate,
      isActive: expense.isActive,
      createdAt: expense.createdAt,
    }
  }
}
