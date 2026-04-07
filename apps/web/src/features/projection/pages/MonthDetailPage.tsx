import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { useMonthDetail } from '../hooks/useProjection'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatMonth } from '@/lib/utils'
import { CategoryBadge } from '@/features/categories/components/CategoryBadge'
import { GroupSortBar } from '@/components/GroupSortBar'
import { sortItems, groupItems } from '@/lib/groupSort'
import type { SortDirection } from '@/lib/groupSort'

const GROUP_OPTIONS = [
  { value: 'categoryName', label: 'Categoría' },
  { value: 'typeLabel', label: 'Tipo' },
  { value: 'cardName', label: 'Tarjeta' },
]

const SORT_OPTIONS = [
  { value: 'description', label: 'Descripción' },
  { value: 'amount', label: 'Monto' },
]

export function MonthDetailPage() {
  const { year, month } = useParams<{ year: string; month: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useMonthDetail(Number(year), Number(month))
  const [groupBy, setGroupBy] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('description')
  const [direction, setDirection] = useState<SortDirection>('asc')

  const enrichedCharges = useMemo(
    () =>
      (data?.charges ?? []).map((c) => ({
        ...c,
        typeLabel: c.type === 'INSTALLMENT' ? 'Cuotas' : 'Recurrente',
      })),
    [data?.charges]
  )

  const sorted = useMemo(
    () => sortItems(enrichedCharges, sortBy as keyof (typeof enrichedCharges)[0], direction),
    [enrichedCharges, sortBy, direction]
  )

  const groups = useMemo(
    () =>
      groupBy
        ? groupItems(sorted, groupBy as keyof (typeof sorted)[0])
        : [{ label: null as string | null, items: sorted }],
    [sorted, groupBy]
  )

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

      {data.charges.length > 0 && (
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
        {groups.map((group) => (
          <div key={group.label ?? '__all__'} className="space-y-2">
            {group.label !== null && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {formatCurrency(group.items.reduce((sum, c) => sum + c.amount, 0))}
                </p>
              </div>
            )}
            {group.items.map((charge) => (
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
