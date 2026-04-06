export interface Card {
  id: string
  name: string
  bank: string | null
  color: string | null
  cutoffDay: number
  paymentDueDay: number
  creditLimit: number | null
  createdAt: string
}

export interface CreateCardDTO {
  name: string
  bank?: string
  color?: string
  cutoffDay: number
  paymentDueDay: number
  creditLimit?: number
}

export interface UpdateCardDTO extends Partial<CreateCardDTO> {}
