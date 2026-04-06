export interface CardEntity {
  id: string
  name: string
  bank: string | null
  color: string | null
  cutoffDay: number
  paymentDueDay: number
  creditLimit: number | null
  createdAt: Date
}
