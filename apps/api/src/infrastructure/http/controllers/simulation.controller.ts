import { Context } from 'hono'
import { PrismaCardRepository } from '../../database/repositories/prisma-card.repository'
import { PrismaChargeRepository } from '../../database/repositories/prisma-charge.repository'
import { SimulateExpenseUseCase } from '../../../application/use-cases/simulation/simulate-expense.use-case'

const cardRepo = new PrismaCardRepository()
const chargeRepo = new PrismaChargeRepository()

export const simulationController = {
  async simulate(c: Context) {
    const userId = c.get('userId') as string
    const body = await c.req.json()
    const result = await new SimulateExpenseUseCase(cardRepo, chargeRepo).execute({ ...body, userId })
    return c.json(result)
  },
}
