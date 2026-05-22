import { Router } from 'express'
import { INNOVATION_ITEMS } from '../data/seed.js'

const router = Router()

// GET /api/innovation
// Query params: serviceLine, initiativeType
router.get('/', (req, res) => {
  const { serviceLine, initiativeType } = req.query
  let items = [...INNOVATION_ITEMS]
  if (serviceLine) items = items.filter(i => i.serviceLine === serviceLine)
  if (initiativeType) items = items.filter(i => i.initiativeType === initiativeType)
  items.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
  res.json({ data: items, total: items.length })
})

export default router
