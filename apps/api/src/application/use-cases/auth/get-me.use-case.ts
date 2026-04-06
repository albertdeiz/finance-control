import { IUserRepository } from '../../../domain/repositories/user.repository'
import { NotFoundError } from '../../../domain/errors/domain.errors'

export class GetMeUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId)
    if (!user) throw new NotFoundError('User', userId)
    return { id: user.id, email: user.email, createdAt: user.createdAt }
  }
}
