import { Trash2, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { CategoryBadge } from '@/features/categories/components/CategoryBadge'
import type { Expense } from '@finance/types'

interface Props {
  expense: Expense
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
  category?: { name: string; color: string | null; icon: string | null } | null
}

export function ExpenseItem({ expense, onEdit, onDelete, category }: Props) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div>
        <p className="font-medium text-sm">{expense.description}</p>
        <p className="text-xs text-muted-foreground">
          {expense.type === 'INSTALLMENT'
            ? `${expense.installmentCount} cuotas de ${formatCurrency(expense.amount)}`
            : `Recurrente · ${formatCurrency(expense.amount)}/mes`}
        </p>
        {category && (
          <div className="mt-1">
            <CategoryBadge name={category.name} color={category.color} icon={category.icon} />
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-xs px-2 py-0.5 rounded-full ${expense.type === 'INSTALLMENT' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
          {expense.type === 'INSTALLMENT' ? 'Cuotas' : 'Recurrente'}
        </span>
        <Button variant="ghost" size="icon" onClick={() => onEdit(expense)}>
          <Pencil size={14} />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(expense.id)} className="text-red-500 hover:text-red-600">
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  )
}
