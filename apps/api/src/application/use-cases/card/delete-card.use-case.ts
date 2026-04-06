import { ICardRepository } from '../../../domain/repositories/card.repository'
import { NotFoundError } from '../../../domain/errors/domain.errors'

export class DeleteCardUseCase {
  constructor(private cardRepo: ICardRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.cardRepo.findById(id)
    if (!existing) throw new NotFoundError('Card', id)
    await this.cardRepo.delete(id)
  }
}
