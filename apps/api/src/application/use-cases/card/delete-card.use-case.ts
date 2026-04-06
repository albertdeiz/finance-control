import { ICardRepository } from '../../../domain/repositories/card.repository'
import { NotFoundError, ForbiddenError } from '../../../domain/errors/domain.errors'

export class DeleteCardUseCase {
  constructor(private cardRepo: ICardRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const existing = await this.cardRepo.findById(id)
    if (!existing) throw new NotFoundError('Card', id)
    if (existing.userId !== userId) throw new ForbiddenError()
    await this.cardRepo.delete(id)
  }
}
