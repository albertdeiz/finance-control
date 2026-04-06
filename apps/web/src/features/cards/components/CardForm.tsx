import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Card, CreateCardDTO } from '@finance/types'

interface Props {
  initial?: Partial<Card>
  onSubmit: (data: CreateCardDTO) => void
  loading?: boolean
}

export function CardForm({ initial, onSubmit, loading }: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    bank: initial?.bank ?? '',
    color: initial?.color ?? '#6366f1',
    cutoffDay: initial?.cutoffDay ?? 5,
    paymentDueDay: initial?.paymentDueDay ?? 25,
    creditLimit: initial?.creditLimit ?? '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      name: form.name,
      bank: form.bank || undefined,
      color: form.color || undefined,
      cutoffDay: Number(form.cutoffDay),
      paymentDueDay: Number(form.paymentDueDay),
      creditLimit: form.creditLimit ? Number(form.creditLimit) : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="bank">Banco</Label>
        <Input id="bank" value={form.bank} onChange={(e) => setForm({ ...form, bank: e.target.value })} placeholder="Opcional" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="cutoffDay">Día de corte</Label>
          <Input id="cutoffDay" type="number" min={1} max={28} value={form.cutoffDay} onChange={(e) => setForm({ ...form, cutoffDay: Number(e.target.value) })} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="paymentDueDay">Día de pago</Label>
          <Input id="paymentDueDay" type="number" min={1} max={28} value={form.paymentDueDay} onChange={(e) => setForm({ ...form, paymentDueDay: Number(e.target.value) })} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="creditLimit">Límite (opcional)</Label>
          <Input id="creditLimit" type="number" value={form.creditLimit} onChange={(e) => setForm({ ...form, creditLimit: e.target.value })} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="color">Color</Label>
          <Input id="color" type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-9 px-2 py-1" />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  )
}
