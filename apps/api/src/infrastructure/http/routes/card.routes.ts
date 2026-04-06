import { Hono } from 'hono'
import { cardController } from '../controllers/card.controller'

export const cardRoutes = new Hono()
  .get('/', cardController.list)
  .get('/:id', cardController.get)
  .post('/', cardController.create)
  .put('/:id', cardController.update)
  .delete('/:id', cardController.delete)
