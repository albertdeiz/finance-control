import { Context } from 'hono'
import { NotFoundError, ValidationError } from '../../../domain/errors/domain.errors'

export async function errorMiddleware(err: Error, c: Context) {
  if (err instanceof NotFoundError) {
    return c.json({ error: err.message }, 404)
  }
  if (err instanceof ValidationError) {
    return c.json({ error: err.message }, 400)
  }
  console.error(err)
  return c.json({ error: 'Internal server error' }, 500)
}
