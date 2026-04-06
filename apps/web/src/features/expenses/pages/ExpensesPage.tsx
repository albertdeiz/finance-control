import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useExpenses, useCreateExpense, useDeleteExpense } from '../hooks/useExpenses'
import { useCards } from '@/features/cards/hooks/useCards'
import { useCategories } from '@/features/categories/hooks/useCategories'
import { ExpenseForm } from '../components/ExpenseForm'
import { ExpenseItem } from '../components/ExpenseItem'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function ExpensesPage() {
  const { data: expenses, isLoading } = useExpenses()
  const { data: cards } = useCards()
  const { data: categories } = useCategories()
  const createExpense = useCreateExpense()
  const deleteExpense = useDeleteExpense()
  const [open, setOpen] = useState(false)

  if (isLoading) return <div className="text-muted-foreground text-sm">Cargando...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Gastos</h2>
          <p className="text-sm text-muted-foreground">Cuotas y gastos recurrentes</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
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
                setOpen(false)
              }}
              loading={createExpense.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {expenses?.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">No hay gastos registrados.</p>
        )}
        {expenses?.map((expense) => {
          const category = expense.categoryId
            ? categories?.find((c) => c.id === expense.categoryId) ?? null
            : null
          return (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onDelete={(id) => deleteExpense.mutate(id)}
              category={category}
            />
          )
        })}
      </div>
    </div>
  )
}
