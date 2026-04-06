import { CardEntity } from '../entities/card.entity'

export interface ICardRepository {
  findAllByUserId(userId: string): Promise<CardEntity[]>
  findById(id: string): Promise<CardEntity | null>
  create(data: Omit<CardEntity, 'id' | 'createdAt'>): Promise<CardEntity>
  update(id: string, data: Partial<Omit<CardEntity, 'id' | 'createdAt'>>): Promise<CardEntity>
  delete(id: string): Promise<void>
}
