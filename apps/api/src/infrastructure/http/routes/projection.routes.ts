import { Hono } from 'hono'
import { projectionController } from '../controllers/projection.controller'

export const projectionRoutes = new Hono()
  .get('/', projectionController.getProjection)
  .get('/:year/:month', projectionController.getMonthDetail)
