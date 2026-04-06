import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { getBillingMonth, addMonths } from '../src/shared/billing'

const prisma = new PrismaClient()

const PROJECTION_HORIZON = 24

async function main() {
  console.log('Seeding database...')

  // ─── User ────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'admin@finance.local' },
    update: {},
    create: { email: 'admin@finance.local', passwordHash },
  })

  console.log(`User: ${user.email} (password: admin123)`)

  // ─── Categories ──────────────────────────────────────────────────────────
  const [catSubs, catFood, catTech, catHealth] = await Promise.all([
    prisma.category.upsert({
      where: { id: 'seed-cat-subs' },
      update: {},
      create: { id: 'seed-cat-subs', userId: user.id, name: 'Suscripciones', color: '#6366f1', icon: '📺' },
    }),
    prisma.category.upsert({
      where: { id: 'seed-cat-food' },
      update: {},
      create: { id: 'seed-cat-food', userId: user.id, name: 'Alimentación', color: '#f59e0b', icon: '🍔' },
    }),
    prisma.category.upsert({
      where: { id: 'seed-cat-tech' },
      update: {},
      create: { id: 'seed-cat-tech', userId: user.id, name: 'Tecnología', color: '#10b981', icon: '💻' },
    }),
    prisma.category.upsert({
      where: { id: 'seed-cat-health' },
      update: {},
      create: { id: 'seed-cat-health', userId: user.id, name: 'Salud', color: '#ef4444', icon: '🏥' },
    }),
  ])

  console.log('Categories created.')

  // ─── Cards ───────────────────────────────────────────────────────────────
  const [cardBci, cardSantander] = await Promise.all([
    prisma.card.upsert({
      where: { id: 'seed-card-bci' },
      update: {},
      create: {
        id: 'seed-card-bci',
        userId: user.id,
        name: 'Visa BCI',
        bank: 'BCI',
        color: '#2563eb',
        cutoffDay: 5,
        paymentDueDay: 25,
      },
    }),
    prisma.card.upsert({
      where: { id: 'seed-card-santander' },
      update: {},
      create: {
        id: 'seed-card-santander',
        userId: user.id,
        name: 'Mastercard Santander',
        bank: 'Santander',
        color: '#dc2626',
        cutoffDay: 20,
        paymentDueDay: 10,
      },
    }),
  ])

  console.log('Cards created.')

  // ─── Expenses + Charges ──────────────────────────────────────────────────
  type ExpenseSeed = {
    id: string
    description: string
    amount: number
    type: 'INSTALLMENT' | 'RECURRING'
    purchaseDate: Date
    cardId: string
    categoryId: string
    installmentCount?: number
    endDate?: Date
  }

  const expenses: ExpenseSeed[] = [
    // Recurring on BCI (corte día 5)
    {
      id: 'seed-exp-netflix',
      description: 'Netflix',
      amount: 9990,
      type: 'RECURRING',
      purchaseDate: new Date('2026-01-01'),
      cardId: cardBci.id,
      categoryId: catSubs.id,
    },
    {
      id: 'seed-exp-spotify',
      description: 'Spotify',
      amount: 5990,
      type: 'RECURRING',
      purchaseDate: new Date('2026-01-01'),
      cardId: cardBci.id,
      categoryId: catSubs.id,
    },
    {
      id: 'seed-exp-gym',
      description: 'Gimnasio',
      amount: 35000,
      type: 'RECURRING',
      purchaseDate: new Date('2026-02-01'),
      cardId: cardSantander.id,
      categoryId: catHealth.id,
    },
    // Installments on BCI — compra el 8 de marzo (después del corte 5 → primera cuota abril)
    {
      id: 'seed-exp-notebook',
      description: 'MacBook Air',
      amount: 120000,
      type: 'INSTALLMENT',
      purchaseDate: new Date('2026-03-08'),
      cardId: cardBci.id,
      categoryId: catTech.id,
      installmentCount: 12,
    },
    // Installments on Santander — compra el 18 de abril (antes del corte 20 → primera cuota abril)
    {
      id: 'seed-exp-iphone',
      description: 'iPhone 16',
      amount: 75000,
      type: 'INSTALLMENT',
      purchaseDate: new Date('2026-04-18'),
      cardId: cardSantander.id,
      categoryId: catTech.id,
      installmentCount: 6,
    },
    // Short installment ending soon
    {
      id: 'seed-exp-headphones',
      description: 'Audífonos Sony',
      amount: 25000,
      type: 'INSTALLMENT',
      purchaseDate: new Date('2026-02-10'),
      cardId: cardBci.id,
      categoryId: catTech.id,
      installmentCount: 3,
    },
  ]

  for (const exp of expenses) {
    const card = exp.cardId === cardBci.id ? cardBci : cardSantander
    const cutoffDay = card.cutoffDay

    const created = await prisma.expense.upsert({
      where: { id: exp.id },
      update: {},
      create: {
        id: exp.id,
        userId: user.id,
        description: exp.description,
        amount: exp.amount,
        type: exp.type,
        purchaseDate: exp.purchaseDate,
        cardId: exp.cardId,
        categoryId: exp.categoryId,
        installmentCount: exp.installmentCount ?? null,
        endDate: exp.endDate ?? null,
        isActive: true,
      },
    })

    // Only generate charges if expense was just created (no existing charges)
    const existing = await prisma.charge.count({ where: { expenseId: created.id } })
    if (existing > 0) continue

    const firstBilling = getBillingMonth(exp.purchaseDate, cutoffDay)

    if (exp.type === 'INSTALLMENT' && exp.installmentCount) {
      const charges = Array.from({ length: exp.installmentCount }, (_, i) => {
        const { year, month } = addMonths(firstBilling, i)
        return {
          expenseId: created.id,
          amount: exp.amount,
          billingYear: year,
          billingMonth: month,
          installmentNo: i + 1,
          isPaid: false,
        }
      })
      await prisma.charge.createMany({ data: charges })
    } else {
      const endDate = exp.endDate ?? null
      const charges = []
      for (let i = 0; i < PROJECTION_HORIZON; i++) {
        const { year, month } = addMonths(firstBilling, i)
        if (endDate && new Date(year, month - 1, 1) > endDate) break
        charges.push({
          expenseId: created.id,
          amount: exp.amount,
          billingYear: year,
          billingMonth: month,
          installmentNo: null,
          isPaid: false,
        })
      }
      await prisma.charge.createMany({ data: charges })
    }

    console.log(`  ✓ ${exp.description} (${exp.type})`)
  }

  console.log('\nSeed complete.')
  console.log('─────────────────────────────────')
  console.log(`  Email:    admin@finance.local`)
  console.log(`  Password: admin123`)
  console.log('─────────────────────────────────')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
