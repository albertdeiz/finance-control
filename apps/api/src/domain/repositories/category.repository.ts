import { CategoryEntity } from '../entities/category.entity'

export interface ICategoryRepository {
  findAllByUserId(userId: string): Promise<CategoryEntity[]>
  findById(id: string): Promise<CategoryEntity | null>
  create(data: Omit<CategoryEntity, 'id' | 'createdAt'>): Promise<CategoryEntity>
  update(id: string, data: Partial<Omit<CategoryEntity, 'id' | 'userId' | 'createdAt'>>): Promise<CategoryEntity>
  delete(id: string): Promise<void>
}
