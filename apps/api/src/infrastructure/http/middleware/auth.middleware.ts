import { createMiddleware } from 'hono/factory'
import { verifyToken } from '../../auth/jwt.service'
import { UnauthorizedError } from '../../../domain/errors/domain.errors'

type AuthVariables = { userId: string; userEmail: string }

export const authMiddleware = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError()
    }
    const token = authHeader.slice(7)
    try {
      const payload = verifyToken(token)
      c.set('userId', payload.userId)
      c.set('userEmail', payload.email)
      await next()
    } catch {
      throw new UnauthorizedError('Invalid or expired token')
    }
  }
)
