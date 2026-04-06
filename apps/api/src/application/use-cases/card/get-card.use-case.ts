import { ICardRepository } from '../../../domain/repositories/card.repository'
import { CardEntity } from '../../../domain/entities/card.entity'
import { NotFoundError, ForbiddenError } from '../../../domain/errors/domain.errors'

export class GetCardUseCase {
  constructor(private cardRepo: ICardRepository) {}

  async execute(id: string, userId: string): Promise<CardEntity> {
    const card = await this.cardRepo.findById(id)
    if (!card) throw new NotFoundError('Card', id)
    if (card.userId !== userId) throw new ForbiddenError()
    return card
  }
}
