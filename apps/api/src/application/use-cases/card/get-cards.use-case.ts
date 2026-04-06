import { ICardRepository } from '../../../domain/repositories/card.repository'
import { CardEntity } from '../../../domain/entities/card.entity'

export class GetCardsUseCase {
  constructor(private cardRepo: ICardRepository) {}
  async execute(userId: string): Promise<CardEntity[]> {
    return this.cardRepo.findAllByUserId(userId)
  }
}
