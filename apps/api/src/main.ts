import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { cardRoutes } from './infrastructure/http/routes/card.routes'
import { expenseRoutes } from './infrastructure/http/routes/expense.routes'
import { projectionRoutes } from './infrastructure/http/routes/projection.routes'
import { simulationRoutes } from './infrastructure/http/routes/simulation.routes'
import { NotFoundError, ValidationError } from './domain/errors/domain.errors'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

app.route('/cards', cardRoutes)
app.route('/expenses', expenseRoutes)
app.route('/projection', projectionRoutes)
app.route('/simulation', simulationRoutes)

app.onError((err, c) => {
  if (err instanceof NotFoundError) return c.json({ error: err.message }, 404)
  if (err instanceof ValidationError) return c.json({ error: err.message }, 400)
  console.error(err)
  return c.json({ error: 'Internal server error' }, 500)
})

const port = Number(process.env.PORT ?? 3000)
console.log(`API running on port ${port}`)

serve({ fetch: app.fetch, port })
