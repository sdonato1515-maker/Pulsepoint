import { Router } from 'express'
import { MARKET_PULSE_TOPICS } from '../data/seed.js'

const router = Router()

// GET /api/market-pulse
router.get('/', (req, res) => {
  const sorted = [...MARKET_PULSE_TOPICS].sort((a, b) => b.momentumScore - a.momentumScore)
  res.json({ data: sorted })
})

// GET /api/market-pulse/:id
router.get('/:id', (req, res) => {
  const topic = MARKET_PULSE_TOPICS.find(t => t.id === req.params.id)
  if (!topic) return res.status(404).json({ error: 'Not found' })
  res.json(topic)
})

export default router
