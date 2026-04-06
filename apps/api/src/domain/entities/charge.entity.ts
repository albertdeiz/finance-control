export interface ChargeEntity {
  id: string
  expenseId: string
  amount: number
  billingYear: number
  billingMonth: number
  installmentNo: number | null
  isPaid: boolean
  paidAt: Date | null
}
