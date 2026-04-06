import { Context } from 'hono'
import { PrismaCardRepository } from '../../database/repositories/prisma-card.repository'
import { PrismaExpenseRepository } from '../../database/repositories/prisma-expense.repository'
import { PrismaChargeRepository } from '../../database/repositories/prisma-charge.repository'
import { CreateExpenseUseCase } from '../../../application/use-cases/expense/create-expense.use-case'
import { GetExpensesUseCase } from '../../../application/use-cases/expense/get-expenses.use-case'
import { GetExpenseUseCase } from '../../../application/use-cases/expense/get-expense.use-case'
import { UpdateExpenseUseCase } from '../../../application/use-cases/expense/update-expense.use-case'
import { DeleteExpenseUseCase } from '../../../application/use-cases/expense/delete-expense.use-case'

const cardRepo = new PrismaCardRepository()
const expenseRepo = new PrismaExpenseRepository()
const chargeRepo = new PrismaChargeRepository()

export const expenseController = {
  async list(c: Context) {
    const expenses = await new GetExpensesUseCase(expenseRepo).execute()
    return c.json(expenses)
  },
  async get(c: Context) {
    const expense = await new GetExpenseUseCase(expenseRepo, chargeRepo).execute(c.req.param('id'))
    return c.json(expense)
  },
  async create(c: Context) {
    const body = await c.req.json()
    const expense = await new CreateExpenseUseCase(expenseRepo, chargeRepo, cardRepo).execute(body)
    return c.json(expense, 201)
  },
  async update(c: Context) {
    const body = await c.req.json()
    const expense = await new UpdateExpenseUseCase(expenseRepo, chargeRepo, cardRepo).execute({ id: c.req.param('id'), ...body })
    return c.json(expense)
  },
  async delete(c: Context) {
    await new DeleteExpenseUseCase(expenseRepo).execute(c.req.param('id'))
    return c.json({ success: true })
  },
}
