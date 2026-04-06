import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { cardsApi } from '../api/cards.api'
import type { UpdateCardDTO } from '@finance/types'

export const CARDS_KEY = ['cards']

export function useCards() {
  return useQuery({ queryKey: CARDS_KEY, queryFn: cardsApi.list })
}

export function useCreateCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cardsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: CARDS_KEY }),
  })
}

export function useUpdateCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCardDTO }) => cardsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CARDS_KEY }),
  })
}

export function useDeleteCard() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cardsApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: CARDS_KEY }),
  })
}
