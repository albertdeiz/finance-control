import { ICategoryRepository } from '../../../domain/repositories/category.repository'
import { NotFoundError, ForbiddenError } from '../../../domain/errors/domain.errors'

export class DeleteCategoryUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const cat = await this.categoryRepo.findById(id)
    if (!cat) throw new NotFoundError('Category', id)
    if (cat.userId !== userId) throw new ForbiddenError()
    await this.categoryRepo.delete(id)
  }
}
