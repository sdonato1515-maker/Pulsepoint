import { Router } from 'express'
import { INTELLIGENCE_ITEMS, INNOVATION_ITEMS, COMPETITORS } from '../data/seed.js'

const router = Router()

// GET /api/digest/latest
router.get('/latest', (req, res) => {
  const weekOf = '2026-05-19'

  const marketMoves = INTELLIGENCE_ITEMS
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
    .slice(0, 5)
    .map(item => ({
      ...item,
      competitor: COMPETITORS.find(c => c.id === item.competitorId),
    }))

  const innovationSpotlight = INNOVATION_ITEMS.slice(0, 3)

  const leadershipChanges = INTELLIGENCE_ITEMS
    .filter(i => i.itemType === 'leadership')
    .map(item => ({ ...item, competitor: COMPETITORS.find(c => c.id === item.competitorId) }))

  const regulatorySignals = INTELLIGENCE_ITEMS
    .filter(i => i.itemType === 'regulatory')
    .map(item => ({ ...item, competitor: COMPETITORS.find(c => c.id === item.competitorId) }))

  res.json({
    weekOf,
    sections: {
      marketMoves,
      innovationSpotlight,
      leadershipChanges,
      regulatorySignals,
    },
    meta: {
      totalItems: marketMoves.length + innovationSpotlight.length + leadershipChanges.length + regulatorySignals.length,
      generatedAt: new Date().toISOString(),
    },
  })
})

export default router
