import { Context } from 'hono'
import { PrismaCardRepository } from '../../database/repositories/prisma-card.repository'
import { CreateCardUseCase } from '../../../application/use-cases/card/create-card.use-case'
import { GetCardsUseCase } from '../../../application/use-cases/card/get-cards.use-case'
import { GetCardUseCase } from '../../../application/use-cases/card/get-card.use-case'
import { UpdateCardUseCase } from '../../../application/use-cases/card/update-card.use-case'
import { DeleteCardUseCase } from '../../../application/use-cases/card/delete-card.use-case'

const repo = new PrismaCardRepository()

export const cardController = {
  async list(c: Context) {
    const userId = c.get('userId') as string
    const cards = await new GetCardsUseCase(repo).execute(userId)
    return c.json(cards)
  },
  async get(c: Context) {
    const userId = c.get('userId') as string
    const card = await new GetCardUseCase(repo).execute(c.req.param('id')!, userId)
    return c.json(card)
  },
  async create(c: Context) {
    const userId = c.get('userId') as string
    const body = await c.req.json()
    const card = await new CreateCardUseCase(repo).execute({ ...body, userId })
    return c.json(card, 201)
  },
  async update(c: Context) {
    const userId = c.get('userId') as string
    const body = await c.req.json()
    const card = await new UpdateCardUseCase(repo).execute({ id: c.req.param('id'), userId, ...body })
    return c.json(card)
  },
  async delete(c: Context) {
    const userId = c.get('userId') as string
    await new DeleteCardUseCase(repo).execute(c.req.param('id')!, userId)
    return c.json({ success: true })
  },
}
