import { api } from '@/lib/api'
import type { Card, CreateCardDTO, UpdateCardDTO } from '@finance/types'

export const cardsApi = {
  list: () => api.get<Card[]>('/cards').then((r) => r.data),
  get: (id: string) => api.get<Card>(`/cards/${id}`).then((r) => r.data),
  create: (data: CreateCardDTO) => api.post<Card>('/cards', data).then((r) => r.data),
  update: (id: string, data: UpdateCardDTO) => api.put<Card>(`/cards/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/cards/${id}`),
}
