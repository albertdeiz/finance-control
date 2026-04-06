import { IUserRepository } from '../../../domain/repositories/user.repository'
import { UserEntity } from '../../../domain/entities/user.entity'
import { prisma } from '../prisma.client'

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    return user ? this.toEntity(user) : null
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await prisma.user.findUnique({ where: { id } })
    return user ? this.toEntity(user) : null
  }

  async create(data: { email: string; passwordHash: string }): Promise<UserEntity> {
    const user = await prisma.user.create({ data })
    return this.toEntity(user)
  }

  private toEntity(user: any): UserEntity {
    return {
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    }
  }
}
