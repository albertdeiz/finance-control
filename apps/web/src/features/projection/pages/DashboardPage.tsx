import { useMemo } from 'react'
import { useProjection, useMonthDetail } from '../hooks/useProjection'
import { ProjectionChart } from '../components/ProjectionChart'
import { MonthRow } from '../components/MonthRow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

export function DashboardPage() {
  const { data: projection, isLoading } = useProjection(12)
  const currentMonth = projection?.[0]
  const { data: monthDetail } = useMonthDetail(currentMonth?.year ?? 0, currentMonth?.month ?? 0)

  const byCard = useMemo(() => {
    if (!monthDetail?.charges.length) return []
    const map = new Map<string, number>()
    for (const c of monthDetail.charges) {
      map.set(c.cardName, (map.get(c.cardName) ?? 0) + c.amount)
    }
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
  }, [monthDetail])

  const byCategory = useMemo(() => {
    if (!monthDetail?.charges.length) return []
    const map = new Map<string, number>()
    for (const c of monthDetail.charges) {
      const key = c.categoryName ?? 'Sin categoría'
      map.set(key, (map.get(key) ?? 0) + c.amount)
    }
    return Array.from(map.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
  }, [monthDetail])

  if (isLoading) return <div className="text-muted-foreground text-sm">Calculando proyección...</div>

  if (!projection?.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p className="text-lg font-medium">Sin datos aún</p>
        <p className="text-sm mt-1">Agrega tarjetas y gastos para ver tu proyección financiera.</p>
      </div>
    )
  }

  const maxTotal = Math.max(...projection.map((p) => p.total))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Proyección financiera</h2>
        <p className="text-sm text-muted-foreground">Próximos 12 meses</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground font-normal">Este mes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(currentMonth!.total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground font-normal">En cuotas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-indigo-600">{formatCurrency(currentMonth!.installmentsTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground font-normal">Recurrentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(currentMonth!.recurringTotal)}</p>
          </CardContent>
        </Card>
      </div>

      {(byCard.length > 0 || byCategory.length > 0) && (
        <div className="grid grid-cols-2 gap-4">
          {byCard.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Por tarjeta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {byCard.map((item) => (
                  <DistributionRow key={item.name} label={item.name} total={item.total} max={byCard[0].total} />
                ))}
              </CardContent>
            </Card>
          )}

          {byCategory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Por categoría</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {byCategory.map((item) => (
                  <DistributionRow key={item.name} label={item.name} total={item.total} max={byCategory[0].total} />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evolución mensual</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectionChart data={projection} />
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Detalle por mes</h3>
        {projection.map((p) => (
          <MonthRow key={`${p.year}-${p.month}`} data={p} isHighest={p.total === maxTotal} />
        ))}
      </div>
    </div>
  )
}

function DistributionRow({ label, total, max }: { label: string; total: number; max: number }) {
  const pct = max > 0 ? (total / max) * 100 : 0
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground truncate max-w-[60%]">{label}</span>
        <span className="font-medium tabular-nums">{formatCurrency(total)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
