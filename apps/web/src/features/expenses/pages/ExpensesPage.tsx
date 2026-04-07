import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useExpenses, useCreateExpense, useUpdateExpense, useDeleteExpense } from '../hooks/useExpenses'
import { useCards } from '@/features/cards/hooks/useCards'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { ExpenseForm } from '../components/ExpenseForm'
import { ExpenseItem } from '../components/ExpenseItem'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { GroupSortBar } from '@/components/GroupSortBar'
import { formatCurrency } from '@/lib/utils'
import { sortItems, groupItems } from '@/lib/groupSort'
import type { SortDirection } from '@/lib/groupSort'
import type { Expense } from '@finance/types'

const GROUP_OPTIONS = [
  { value: 'categoryName', label: 'Categoría' },
  { value: 'typeLabel', label: 'Tipo' },
  { value: 'cardName', label: 'Tarjeta' },
]

const SORT_OPTIONS = [
  { value: 'description', label: 'Descripción' },
  { value: 'amount', label: 'Monto' },
  { value: 'purchaseDate', label: 'Fecha' },
]

export function ExpensesPage() {
  const { data: expenses, isLoading } = useExpenses()
  const { data: cards } = useCards()
  const { data: categories } = useCategories()
  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()
  const deleteExpense = useDeleteExpense()
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Expense | null>(null)
  const [groupBy, setGroupBy] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('description')
  const [direction, setDirection] = useState<SortDirection>('asc')

  const enriched = useMemo(
    () =>
      (expenses ?? []).map((e) => ({
        ...e,
        cardName: cards?.find((c) => c.id === e.cardId)?.name ?? 'Sin tarjeta',
        categoryName: categories?.find((c) => c.id === e.categoryId)?.name ?? null,
        typeLabel: e.type === 'INSTALLMENT' ? 'Cuotas' : 'Recurrente',
      })),
    [expenses, cards, categories]
  )

  const sorted = useMemo(
    () => sortItems(enriched, sortBy as keyof (typeof enriched)[0], direction),
    [enriched, sortBy, direction]
  )

  const groups = useMemo(
    () =>
      groupBy
        ? groupItems(sorted, groupBy as keyof (typeof sorted)[0])
        : [{ label: null as string | null, items: sorted }],
    [sorted, groupBy]
  )

  if (isLoading) return <div className="text-muted-foreground text-sm">Cargando...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Gastos</h2>
          <p className="text-sm text-muted-foreground">Cuotas y gastos recurrentes</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button disabled={!cards?.length}>
              <Plus size={16} />
              Agregar gasto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo gasto</DialogTitle>
            </DialogHeader>
            <ExpenseForm
              cards={cards ?? []}
              categories={categories ?? []}
              onSubmit={async (data) => {
                await createExpense.mutateAsync(data)
                setCreateOpen(false)
              }}
              loading={createExpense.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar gasto</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <ExpenseForm
              cards={cards ?? []}
              categories={categories ?? []}
              initial={editTarget}
              onSubmit={async (data) => {
                await updateExpense.mutateAsync({ id: editTarget.id, data })
                setEditTarget(null)
              }}
              loading={updateExpense.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {(expenses?.length ?? 0) > 0 && (
        <GroupSortBar
          groupOptions={GROUP_OPTIONS}
          sortOptions={SORT_OPTIONS}
          groupBy={groupBy}
          sortBy={sortBy}
          direction={direction}
          onGroupByChange={setGroupBy}
          onSortByChange={setSortBy}
          onDirectionChange={setDirection}
        />
      )}

      <div className="space-y-3">
        {expenses?.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">No hay gastos registrados.</p>
        )}
        {groups.map((group) => (
          <div key={group.label ?? '__all__'} className="space-y-2">
            {group.label !== null && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {formatCurrency(group.items.reduce((sum, e) => sum + e.amount, 0))}
                </p>
              </div>
            )}
            {group.items.map((expense) => {
              const category = expense.categoryId
                ? categories?.find((c) => c.id === expense.categoryId) ?? null
                : null
              return (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  onEdit={setEditTarget}
                  onDelete={(id) => deleteExpense.mutate(id)}
                  category={category}
                />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
