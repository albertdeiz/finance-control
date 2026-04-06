import bcrypt from 'bcryptjs'
import { IUserRepository } from '../../../domain/repositories/user.repository'
import { UnauthorizedError } from '../../../domain/errors/domain.errors'
import { signToken } from '../../../infrastructure/auth/jwt.service'

interface Input {
  email: string
  password: string
}

interface Output {
  token: string
  user: { id: string; email: string }
}

export class LoginUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.userRepo.findByEmail(input.email)
    if (!user) throw new UnauthorizedError('Invalid credentials')

    const valid = await bcrypt.compare(input.password, user.passwordHash)
    if (!valid) throw new UnauthorizedError('Invalid credentials')

    const token = signToken({ userId: user.id, email: user.email })
    return { token, user: { id: user.id, email: user.email } }
  }
}
