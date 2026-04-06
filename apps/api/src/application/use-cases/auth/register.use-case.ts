import bcrypt from 'bcryptjs'
import { IUserRepository } from '../../../domain/repositories/user.repository'
import { ValidationError } from '../../../domain/errors/domain.errors'
import { signToken } from '../../../infrastructure/auth/jwt.service'

interface Input {
  email: string
  password: string
}

interface Output {
  token: string
  user: { id: string; email: string }
}

export class RegisterUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(input: Input): Promise<Output> {
    const existing = await this.userRepo.findByEmail(input.email)
    if (existing) throw new ValidationError('Email already registered')

    const passwordHash = await bcrypt.hash(input.password, 10)
    const user = await this.userRepo.create({ email: input.email, passwordHash })
    const token = signToken({ userId: user.id, email: user.email })

    return { token, user: { id: user.id, email: user.email } }
  }
}
