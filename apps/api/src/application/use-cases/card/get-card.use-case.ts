import { ICardRepository } from '../../../domain/repositories/card.repository'
import { CardEntity } from '../../../domain/entities/card.entity'
import { NotFoundError } from '../../../domain/errors/domain.errors'

export class GetCardUseCase {
  constructor(private cardRepo: ICardRepository) {}

  async execute(id: string): Promise<CardEntity> {
    const card = await this.cardRepo.findById(id)
    if (!card) throw new NotFoundError('Card', id)
    return card
  }
}
