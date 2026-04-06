import { Context } from 'hono'
import { PrismaCategoryRepository } from '../../database/repositories/prisma-category.repository'
import { GetCategoriesUseCase } from '../../../application/use-cases/category/get-categories.use-case'
import { CreateCategoryUseCase } from '../../../application/use-cases/category/create-category.use-case'
import { UpdateCategoryUseCase } from '../../../application/use-cases/category/update-category.use-case'
import { DeleteCategoryUseCase } from '../../../application/use-cases/category/delete-category.use-case'

const repo = new PrismaCategoryRepository()

export const categoryController = {
  async list(c: Context) {
    const userId = c.get('userId') as string
    const cats = await new GetCategoriesUseCase(repo).execute(userId)
    return c.json(cats)
  },
  async create(c: Context) {
    const userId = c.get('userId') as string
    const body = await c.req.json()
    const cat = await new CreateCategoryUseCase(repo).execute({ ...body, userId })
    return c.json(cat, 201)
  },
  async update(c: Context) {
    const userId = c.get('userId') as string
    const body = await c.req.json()
    const cat = await new UpdateCategoryUseCase(repo).execute({ id: c.req.param('id')!, userId, ...body })
    return c.json(cat)
  },
  async delete(c: Context) {
    const userId = c.get('userId') as string
    await new DeleteCategoryUseCase(repo).execute(c.req.param('id')!, userId)
    return c.json({ success: true })
  },
}
