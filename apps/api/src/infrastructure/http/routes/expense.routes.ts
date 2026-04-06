import { Hono } from 'hono'
import { expenseController } from '../controllers/expense.controller'

export const expenseRoutes = new Hono()
  .get('/', expenseController.list)
  .get('/:id', expenseController.get)
  .post('/', expenseController.create)
  .put('/:id', expenseController.update)
  .delete('/:id', expenseController.delete)
