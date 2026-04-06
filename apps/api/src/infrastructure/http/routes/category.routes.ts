import { Hono } from 'hono'
import { categoryController } from '../controllers/category.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export const categoryRoutes = new Hono()
  .use('*', authMiddleware)
  .get('/', categoryController.list)
  .post('/', categoryController.create)
  .put('/:id', categoryController.update)
  .delete('/:id', categoryController.delete)
