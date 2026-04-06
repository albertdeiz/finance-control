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
    const cards = await new GetCardsUseCase(repo).execute()
    return c.json(cards)
  },
  async get(c: Context) {
    const card = await new GetCardUseCase(repo).execute(c.req.param('id'))
    return c.json(card)
  },
  async create(c: Context) {
    const body = await c.req.json()
    const card = await new CreateCardUseCase(repo).execute(body)
    return c.json(card, 201)
  },
  async update(c: Context) {
    const body = await c.req.json()
    const card = await new UpdateCardUseCase(repo).execute({ id: c.req.param('id'), ...body })
    return c.json(card)
  },
  async delete(c: Context) {
    await new DeleteCardUseCase(repo).execute(c.req.param('id'))
    return c.json({ success: true })
  },
}
