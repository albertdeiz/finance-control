import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useCategories'
import { CategoryForm } from '../components/CategoryForm'
import { CategoryItem } from '../components/CategoryItem'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { Category } from '@finance/types'

export function CategoriesPage() {
  const { data: categories, isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Category | null>(null)

  if (isLoading) return <div className="text-muted-foreground text-sm">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Categories</h2>
          <p className="text-sm text-muted-foreground">Organize your expenses by category</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} />
              Add category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New category</DialogTitle>
            </DialogHeader>
            <CategoryForm
              onSubmit={async (data) => {
                await createCategory.mutateAsync(data)
                setCreateOpen(false)
              }}
              loading={createCategory.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <CategoryForm
              initial={editTarget}
              onSubmit={async (data) => {
                await updateCategory.mutateAsync({ id: editTarget.id, data })
                setEditTarget(null)
              }}
              loading={updateCategory.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {categories?.length === 0 && (
          <p className="text-muted-foreground text-sm text-center py-8">
            No categories yet. Add one to start organizing your expenses.
          </p>
        )}
        {categories?.map((cat) => (
          <CategoryItem
            key={cat.id}
            category={cat}
            onDelete={(id) => deleteCategory.mutate(id)}
            onEdit={setEditTarget}
          />
        ))}
      </div>
    </div>
  )
}
