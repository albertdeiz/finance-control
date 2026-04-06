import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Card } from '@finance/types'

interface Props {
  card: Card
  onDelete: (id: string) => void
}

export function CardItem({ card, onDelete }: Props) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: card.color ?? '#6366f1' }} />
        <div>
          <p className="font-medium text-sm">{card.name}</p>
          {card.bank && <p className="text-xs text-muted-foreground">{card.bank}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span>Corte: día {card.cutoffDay}</span>
        <span>Pago: día {card.paymentDueDay}</span>
        <Button variant="ghost" size="icon" onClick={() => onDelete(card.id)} className="text-red-500 hover:text-red-600">
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  )
}
