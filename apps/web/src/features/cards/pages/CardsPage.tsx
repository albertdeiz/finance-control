import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCards, useCreateCard, useDeleteCard } from '../hooks/useCards'
import { CardForm } from '../components/CardForm'
import { CardItem } from '../components/CardItem'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export function CardsPage() {
  const { data: cards, isLoading } = useCards()
  const createCard = useCreateCard()
  const deleteCard = useDeleteCard()
  const [open, setOpen] = useState(false)

  if (isLoading) return <div className="text-muted-foreground text-sm">Cargando...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tarjetas</h2>
          <p className="text-sm text-muted-foreground">Gestiona tus tarjetas de crédito</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} />
              Agregar tarjeta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva tarjeta</DialogTitle>
            </DialogHeader>
            <CardForm
              onSubmit={async (data) => {
                await createCard.mutateAsync(data)
                setOpen(false)
              }}
              loading={createCard.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {cards?.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">
            No hay tarjetas. Agrega una para comenzar.
          </p>
        )}
        {cards?.map((card) => (
          <CardItem key={card.id} card={card} onDelete={(id) => deleteCard.mutate(id)} />
        ))}
      </div>
    </div>
  )
}
