import { ICategoryRepository } from '../../../domain/repositories/category.repository'

export class GetCategoriesUseCase {
  constructor(private categoryRepo: ICategoryRepository) {}
  async execute(userId: string) {
    return this.categoryRepo.findAllByUserId(userId)
  }
}
