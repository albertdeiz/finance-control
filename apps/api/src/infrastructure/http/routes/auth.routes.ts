import { Hono } from 'hono'
import { authController } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export const authRoutes = new Hono()
  .post('/register', authController.register)
  .post('/login', authController.login)
  .get('/me', authMiddleware, authController.me)
