import { ICategoryRepository } from '../../../domain/repositories/category.repository'

interface Input {
  userId: string
  name: string
  color?: string
  icon?: string
}

export class CreateCategoryUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}
  async execute(input: Input) {
    return this.categoryRepo.create({
      userId: input.userId,
      name: input.name,
      color: input.color ?? null,
      icon: input.icon ?? null,
    })
  }
}
