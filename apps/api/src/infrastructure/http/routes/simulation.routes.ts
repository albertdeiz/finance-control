import { Hono } from 'hono'
import { simulationController } from '../controllers/simulation.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export const simulationRoutes = new Hono()
  .use('*', authMiddleware)
  .post('/', simulationController.simulate)
