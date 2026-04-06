import { Hono } from 'hono'
import { cardController } from '../controllers/card.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export const cardRoutes = new Hono()
  .use('*', authMiddleware)
  .get('/', cardController.list)
  .get('/:id', cardController.get)
  .post('/', cardController.create)
  .put('/:id', cardController.update)
  .delete('/:id', cardController.delete)
