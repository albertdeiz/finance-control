import { Hono } from 'hono'
import { expenseController } from '../controllers/expense.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export const expenseRoutes = new Hono()
  .use('*', authMiddleware)
  .get('/', expenseController.list)
  .get('/:id', expenseController.get)
  .post('/', expenseController.create)
  .put('/:id', expenseController.update)
  .delete('/:id', expenseController.delete)
