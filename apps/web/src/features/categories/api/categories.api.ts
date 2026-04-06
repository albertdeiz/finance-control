import { api } from '@/lib/api'
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '@finance/types'

export const categoriesApi = {
  list: () => api.get<Category[]>('/categories').then((r) => r.data),
  create: (data: CreateCategoryDTO) => api.post<Category>('/categories', data).then((r) => r.data),
  update: (id: string, data: UpdateCategoryDTO) => api.put<Category>(`/categories/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/categories/${id}`),
}
