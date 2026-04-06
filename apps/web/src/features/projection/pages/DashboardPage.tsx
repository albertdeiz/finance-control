import { useProjection } from '../hooks/useProjection'
import { ProjectionChart } from '../components/ProjectionChart'
import { MonthRow } from '../components/MonthRow'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

export function DashboardPage() {
  const { data: projection, isLoading } = useProjection(12)

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
  const currentMonth = projection[0]

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
            <p className="text-2xl font-bold">{formatCurrency(currentMonth.total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground font-normal">En cuotas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-indigo-600">{formatCurrency(currentMonth.installmentsTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground font-normal">Recurrentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(currentMonth.recurringTotal)}</p>
          </CardContent>
        </Card>
      </div>

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
