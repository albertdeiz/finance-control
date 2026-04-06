export interface Category {
  id: string
  userId: string
  name: string
  color: string | null
  icon: string | null
  createdAt: string
}

export interface CreateCategoryDTO {
  name: string
  color?: string
  icon?: string
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {}
