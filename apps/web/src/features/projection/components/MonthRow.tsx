import { useNavigate } from 'react-router-dom'
import { ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import { formatCurrency, formatMonth } from '@/lib/utils'
import type { MonthlyProjection } from '@finance/types'

interface Props {
  data: MonthlyProjection
  isHighest: boolean
}

export function MonthRow({ data, isHighest }: Props) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/projection/${data.year}/${data.month}`)}
      className="w-full flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted transition-colors text-left"
    >
      <div className="flex items-center gap-3">
        <div className="w-1 h-8 rounded-full" style={{ backgroundColor: isHighest ? '#ef4444' : '#6366f1' }} />
        <div>
          <p className="font-medium text-sm capitalize">{formatMonth(data.year, data.month)}</p>
          <p className="text-xs text-muted-foreground">
            Cuotas {formatCurrency(data.installmentsTotal)} · Recurrentes {formatCurrency(data.recurringTotal)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-semibold">{formatCurrency(data.total)}</p>
          {data.deltaFromPrevious !== null && (
            <p className={`text-xs flex items-center gap-1 justify-end ${data.deltaFromPrevious < 0 ? 'text-green-600' : data.deltaFromPrevious > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
              {data.deltaFromPrevious < 0 ? <TrendingDown size={12} /> : data.deltaFromPrevious > 0 ? <TrendingUp size={12} /> : null}
              {data.deltaFromPrevious !== 0 ? formatCurrency(Math.abs(data.deltaFromPrevious)) : 'Sin cambios'}
            </p>
          )}
        </div>
        <ChevronRight size={16} className="text-muted-foreground" />
      </div>
    </button>
  )
}
