import { ICardRepository } from '../../../domain/repositories/card.repository'
import { CardEntity } from '../../../domain/entities/card.entity'
import { prisma } from '../prisma.client'

export class PrismaCardRepository implements ICardRepository {
  async findAll(): Promise<CardEntity[]> {
    const cards = await prisma.card.findMany({ orderBy: { createdAt: 'asc' } })
    return cards.map(this.toEntity)
  }

  async findById(id: string): Promise<CardEntity | null> {
    const card = await prisma.card.findUnique({ where: { id } })
    return card ? this.toEntity(card) : null
  }

  async create(data: Omit<CardEntity, 'id' | 'createdAt'>): Promise<CardEntity> {
    const card = await prisma.card.create({
      data: {
        name: data.name,
        bank: data.bank,
        color: data.color,
        cutoffDay: data.cutoffDay,
        paymentDueDay: data.paymentDueDay,
        creditLimit: data.creditLimit ?? undefined,
      },
    })
    return this.toEntity(card)
  }

  async update(id: string, data: Partial<Omit<CardEntity, 'id' | 'createdAt'>>): Promise<CardEntity> {
    const card = await prisma.card.update({
      where: { id },
      data: {
        name: data.name,
        bank: data.bank,
        color: data.color,
        cutoffDay: data.cutoffDay,
        paymentDueDay: data.paymentDueDay,
        creditLimit: data.creditLimit ?? undefined,
      },
    })
    return this.toEntity(card)
  }

  async delete(id: string): Promise<void> {
    await prisma.card.delete({ where: { id } })
  }

  private toEntity(card: any): CardEntity {
    return {
      id: card.id,
      name: card.name,
      bank: card.bank,
      color: card.color,
      cutoffDay: card.cutoffDay,
      paymentDueDay: card.paymentDueDay,
      creditLimit: card.creditLimit ? Number(card.creditLimit) : null,
      createdAt: card.createdAt,
    }
  }
}
