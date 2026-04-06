import { Hono } from 'hono'
import { projectionController } from '../controllers/projection.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export const projectionRoutes = new Hono()
  .use('*', authMiddleware)
  .get('/', projectionController.getProjection)
  .get('/:year/:month', projectionController.getMonthDetail)
