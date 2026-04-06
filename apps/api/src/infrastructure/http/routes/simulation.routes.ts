import { Hono } from 'hono'
import { simulationController } from '../controllers/simulation.controller'

export const simulationRoutes = new Hono()
  .post('/', simulationController.simulate)
