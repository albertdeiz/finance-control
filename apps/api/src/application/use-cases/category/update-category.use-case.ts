import { ICategoryRepository } from '../../../domain/repositories/category.repository'
import { NotFoundError, ForbiddenError } from '../../../domain/errors/domain.errors'

interface Input {
  id: string
  userId: string
  name?: string
  color?: string
  icon?: string
}

export class UpdateCategoryUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(input: Input) {
    const cat = await this.categoryRepo.findById(input.id)
    if (!cat) throw new NotFoundError('Category', input.id)
    if (cat.userId !== input.userId) throw new ForbiddenError()
    return this.categoryRepo.update(input.id, {
      name: input.name,
      color: input.color,
      icon: input.icon,
    })
  }
}
