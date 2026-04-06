import { ICardRepository } from '../../../domain/repositories/card.repository'
import { CardEntity } from '../../../domain/entities/card.entity'

interface Input {
  name: string
  bank?: string
  color?: string
  cutoffDay: number
  paymentDueDay: number
  creditLimit?: number
}

export class CreateCardUseCase {
  constructor(private cardRepo: ICardRepository) {}

  async execute(input: Input): Promise<CardEntity> {
    return this.cardRepo.create({
      name: input.name,
      bank: input.bank ?? null,
      color: input.color ?? null,
      cutoffDay: input.cutoffDay,
      paymentDueDay: input.paymentDueDay,
      creditLimit: input.creditLimit ?? null,
    })
  }
}
