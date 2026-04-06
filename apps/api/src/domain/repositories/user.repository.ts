import { UserEntity } from '../entities/user.entity'

export interface IUserRepository {
  findByEmail(email: string): Promise<UserEntity | null>
  findById(id: string): Promise<UserEntity | null>
  create(data: { email: string; passwordHash: string }): Promise<UserEntity>
}
