import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useMonthDetail } from '../hooks/useProjection'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatMonth } from '@/lib/utils'
import { CategoryBadge } from '@/features/categories/components/CategoryBadge'

export function MonthDetailPage() {
  const { year, month } = useParams<{ year: string; month: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useMonthDetail(Number(year), Number(month))

  if (isLoading) return <div className="text-muted-foreground text-sm">Cargando...</div>
  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
        </Button>
        <div>
          <h2 className="text-xl font-semibold capitalize">{formatMonth(data.year, data.month)}</h2>
          <p className="text-sm text-muted-foreground">Total: {formatCurrency(data.total)}</p>
        </div>
      </div>

      <div className="space-y-2">
        {data.charges.map((charge) => (
          <div key={charge.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
            <div>
              <p className="font-medium text-sm">{charge.description}</p>
              <p className="text-xs text-muted-foreground">
                {charge.cardName}
                {charge.installmentNo && charge.installmentCount
                  ? ` · Cuota ${charge.installmentNo}/${charge.installmentCount}`
                  : ' · Recurrente'}
              </p>
              {charge.categoryName && (
                <div className="mt-1">
                  <CategoryBadge
                    name={charge.categoryName}
                    color={charge.categoryColor}
                    icon={null}
                  />
                </div>
              )}
            </div>
            <span className="font-semibold text-sm">{formatCurrency(charge.amount)}</span>
          </div>
        ))}
      </div>

      {(data.completedLastMonth?.length ?? 0) > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-500" />
            Terminaron el mes anterior
          </h3>
          {(data.completedLastMonth ?? []).map((expense) => (
            <div key={expense.expenseId} className="flex items-center justify-between p-4 rounded-lg border border-dashed bg-muted/40 opacity-70">
              <div>
                <p className="font-medium text-sm line-through text-muted-foreground">{expense.description}</p>
                <p className="text-xs text-muted-foreground">
                  {expense.cardName}
                  {expense.type === 'INSTALLMENT' && expense.installmentCount
                    ? ` · ${expense.installmentCount} cuotas`
                    : ' · Recurrente'}
                </p>
                {expense.categoryName && (
                  <div className="mt-1">
                    <CategoryBadge
                      name={expense.categoryName}
                      color={expense.categoryColor}
                      icon={null}
                    />
                  </div>
                )}
              </div>
              <span className="text-sm text-muted-foreground line-through">{formatCurrency(expense.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
