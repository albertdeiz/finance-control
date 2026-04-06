import { ICategoryRepository } from '../../../domain/repositories/category.repository'
import { CategoryEntity } from '../../../domain/entities/category.entity'
import { prisma } from '../prisma.client'

export class PrismaCategoryRepository implements ICategoryRepository {
  async findAllByUserId(userId: string): Promise<CategoryEntity[]> {
    const cats = await prisma.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    })
    return cats.map(this.toEntity)
  }

  async findById(id: string): Promise<CategoryEntity | null> {
    const cat = await prisma.category.findUnique({ where: { id } })
    return cat ? this.toEntity(cat) : null
  }

  async create(data: Omit<CategoryEntity, 'id' | 'createdAt'>): Promise<CategoryEntity> {
    const cat = await prisma.category.create({
      data: {
        userId: data.userId,
        name: data.name,
        color: data.color ?? undefined,
        icon: data.icon ?? undefined,
      },
    })
    return this.toEntity(cat)
  }

  async update(id: string, data: Partial<Omit<CategoryEntity, 'id' | 'userId' | 'createdAt'>>): Promise<CategoryEntity> {
    const cat = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        color: data.color,
        icon: data.icon,
      },
    })
    return this.toEntity(cat)
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } })
  }

  private toEntity(cat: any): CategoryEntity {
    return {
      id: cat.id,
      userId: cat.userId,
      name: cat.name,
      color: cat.color,
      icon: cat.icon,
      createdAt: cat.createdAt,
    }
  }
}
