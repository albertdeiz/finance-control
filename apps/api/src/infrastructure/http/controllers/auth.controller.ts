import { Context } from 'hono'
import { PrismaUserRepository } from '../../database/repositories/prisma-user.repository'
import { RegisterUseCase } from '../../../application/use-cases/auth/register.use-case'
import { LoginUseCase } from '../../../application/use-cases/auth/login.use-case'
import { GetMeUseCase } from '../../../application/use-cases/auth/get-me.use-case'

const userRepo = new PrismaUserRepository()

export const authController = {
  async register(c: Context) {
    const body = await c.req.json()
    const result = await new RegisterUseCase(userRepo).execute(body)
    return c.json(result, 201)
  },
  async login(c: Context) {
    const body = await c.req.json()
    const result = await new LoginUseCase(userRepo).execute(body)
    return c.json(result)
  },
  async me(c: Context) {
    const userId = c.get('userId') as string
    const result = await new GetMeUseCase(userRepo).execute(userId)
    return c.json(result)
  },
}
