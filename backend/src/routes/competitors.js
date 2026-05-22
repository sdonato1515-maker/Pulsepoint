import { Router } from 'express'
import { COMPETITORS, INTELLIGENCE_ITEMS } from '../data/seed.js'

const router = Router()

// GET /api/competitors
router.get('/', (req, res) => {
  const competitors = COMPETITORS.map(c => ({
    ...c,
    alertCount: INTELLIGENCE_ITEMS.filter(i => i.competitorId === c.id).length,
  }))
  res.json({ data: competitors })
})

// GET /api/competitors/:id
router.get('/:id', (req, res) => {
  const competitor = COMPETITORS.find(c => c.id === req.params.id)
  if (!competitor) return res.status(404).json({ error: 'Not found' })
  const items = INTELLIGENCE_ITEMS
    .filter(i => i.competitorId === req.params.id)
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
  res.json({ ...competitor, items, alertCount: items.length })
})

export default router
