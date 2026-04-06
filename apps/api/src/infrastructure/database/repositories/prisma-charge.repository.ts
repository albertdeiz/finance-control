import { IChargeRepository } from '../../../domain/repositories/charge.repository'
import { ChargeEntity } from '../../../domain/entities/charge.entity'
import { prisma } from '../prisma.client'

export class PrismaChargeRepository implements IChargeRepository {
  async findByMonth(year: number, month: number, userId: string) {
    const charges = await prisma.charge.findMany({
      where: {
        billingYear: year,
        billingMonth: month,
        expense: { userId },
      },
      include: {
        expense: {
          include: {
            card: { select: { name: true } },
            category: { select: { name: true, color: true } },
          },
        },
      },
      orderBy: { expense: { description: 'asc' } },
    })
    return charges.map((c) => ({
      id: c.id,
      expenseId: c.expenseId,
      amount: Number(c.amount),
      billingYear: c.billingYear,
      billingMonth: c.billingMonth,
      installmentNo: c.installmentNo,
      isPaid: c.isPaid,
      paidAt: c.paidAt,
      expense: {
        description: c.expense.description,
        type: c.expense.type,
        installmentCount: c.expense.installmentCount,
        cardId: c.expense.cardId,
        card: { name: c.expense.card.name },
        categoryId: c.expense.categoryId,
        category: c.expense.category
          ? { name: c.expense.category.name, color: c.expense.category.color }
          : null,
      },
    }))
  }

  async findByExpenseId(expenseId: string): Promise<ChargeEntity[]> {
    const charges = await prisma.charge.findMany({ where: { expenseId } })
    return charges.map(this.toEntity)
  }

  async createMany(charges: Omit<ChargeEntity, 'id'>[]): Promise<void> {
    await prisma.$transaction(
      charges.map((c) =>
        prisma.charge.upsert({
          where: {
            expenseId_billingYear_billingMonth: {
              expenseId: c.expenseId,
              billingYear: c.billingYear,
              billingMonth: c.billingMonth,
            },
          },
          update: {},
          create: {
            expenseId: c.expenseId,
            amount: c.amount,
            billingYear: c.billingYear,
            billingMonth: c.billingMonth,
            installmentNo: c.installmentNo ?? undefined,
            isPaid: c.isPaid,
            paidAt: c.paidAt ?? undefined,
          },
        })
      )
    )
  }

  async deleteByExpenseId(expenseId: string): Promise<void> {
    await prisma.charge.deleteMany({ where: { expenseId } })
  }

  async getMonthlyTotals(fromYear: number, fromMonth: number, months: number, userId: string) {
    // Build month range
    const range: { year: number; month: number }[] = []
    let y = fromYear
    let m = fromMonth
    for (let i = 0; i < months; i++) {
      range.push({ year: y, month: m })
      m++
      if (m > 12) { m = 1; y++ }
    }

    const results = await Promise.all(
      range.map(async ({ year, month }) => {
        const agg = await prisma.charge.groupBy({
          by: ['billingYear', 'billingMonth'],
          where: { billingYear: year, billingMonth: month, expense: { userId } },
          _sum: { amount: true },
        })

        const installmentsAgg = await prisma.charge.aggregate({
          where: {
            billingYear: year,
            billingMonth: month,
            expense: { type: 'INSTALLMENT', userId },
          },
          _sum: { amount: true },
        })

        const recurringAgg = await prisma.charge.aggregate({
          where: {
            billingYear: year,
            billingMonth: month,
            expense: { type: 'RECURRING', userId },
          },
          _sum: { amount: true },
        })

        return {
          year,
          month,
          total: Number(agg[0]?._sum?.amount ?? 0),
          installmentsTotal: Number(installmentsAgg._sum.amount ?? 0),
          recurringTotal: Number(recurringAgg._sum.amount ?? 0),
        }
      })
    )

    return results
  }

  private toEntity(charge: any): ChargeEntity {
    return {
      id: charge.id,
      expenseId: charge.expenseId,
      amount: Number(charge.amount),
      billingYear: charge.billingYear,
      billingMonth: charge.billingMonth,
      installmentNo: charge.installmentNo,
      isPaid: charge.isPaid,
      paidAt: charge.paidAt,
    }
  }
}
