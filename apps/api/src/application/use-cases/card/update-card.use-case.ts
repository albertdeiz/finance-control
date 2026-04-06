import { ICardRepository } from '../../../domain/repositories/card.repository'
import { CardEntity } from '../../../domain/entities/card.entity'
import { NotFoundError, ForbiddenError } from '../../../domain/errors/domain.errors'

interface Input {
  id: string
  userId: string
  name?: string
  bank?: string
  color?: string
  cutoffDay?: number
  paymentDueDay?: number
  creditLimit?: number
}

export class UpdateCardUseCase {
  constructor(private cardRepo: ICardRepository) {}

  async execute(input: Input): Promise<CardEntity> {
    const existing = await this.cardRepo.findById(input.id)
    if (!existing) throw new NotFoundError('Card', input.id)
    if (existing.userId !== input.userId) throw new ForbiddenError()
    return this.cardRepo.update(input.id, {
      name: input.name,
      bank: input.bank,
      color: input.color,
      cutoffDay: input.cutoffDay,
      paymentDueDay: input.paymentDueDay,
      creditLimit: input.creditLimit ?? null,
    })
  }
}
