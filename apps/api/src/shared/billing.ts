export function getBillingMonth(
  purchaseDate: Date,
  cutoffDay: number
): { year: number; month: number } {
  const day = purchaseDate.getDate()
  const month = purchaseDate.getMonth() + 1
  const year = purchaseDate.getFullYear()

  if (day > cutoffDay) {
    if (month === 12) return { year: year + 1, month: 1 }
    return { year, month: month + 1 }
  }

  return { year, month }
}

export function addMonths(
  base: { year: number; month: number },
  count: number
): { year: number; month: number } {
  let month = base.month + count
  let year = base.year
  while (month > 12) {
    month -= 12
    year++
  }
  return { year, month }
}
