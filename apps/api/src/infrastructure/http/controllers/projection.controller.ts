import { Context } from 'hono'
import { PrismaChargeRepository } from '../../database/repositories/prisma-charge.repository'
import { GetProjectionUseCase } from '../../../application/use-cases/projection/get-projection.use-case'
import { GetMonthDetailUseCase } from '../../../application/use-cases/projection/get-month-detail.use-case'

const chargeRepo = new PrismaChargeRepository()

export const projectionController = {
  async getProjection(c: Context) {
    const userId = c.get('userId') as string
    const months = Number(c.req.query('months') ?? 12)
    const projection = await new GetProjectionUseCase(chargeRepo).execute(months, userId)
    return c.json(projection)
  },
  async getMonthDetail(c: Context) {
    const userId = c.get('userId') as string
    const year = Number(c.req.param('year'))
    const month = Number(c.req.param('month'))
    const detail = await new GetMonthDetailUseCase(chargeRepo).execute(year, month, userId)
    return c.json(detail)
  },
}
