import { Router } from 'express'
import {
  getAllItems, getItem, addItem, updateItem, deleteItem,
  publishItem, unpublishItem, getStats, storeEvents,
} from '../store.js'
import { COMPETITORS } from '../data/seed.js'

const router = Router()

function withCompetitor(item) {
  return { ...item, competitor: COMPETITORS.find(c => c.id === item.competitorId) || null }
}

// GET /api/intelligence/stats
router.get('/stats', (req, res) => {
  res.json(getStats())
})

// GET /api/intelligence/stream  — Server-Sent Events for real-time push
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.flushHeaders()

  // Initial snapshot
  res.write(`event: snapshot\ndata: ${JSON.stringify(getAllItems({ status: 'published' }))}\n\n`)

  // Push changes as they happen
  function onChangeOccurred(event) {
    res.write(`event: change\ndata: ${JSON.stringify(event)}\n\n`)
  }
  storeEvents.on('change', onChangeOccurred)

  // Keep-alive ping every 25s
  const ping = setInterval(() => res.write(': ping\n\n'), 25000)

  req.on('close', () => {
    clearInterval(ping)
    storeEvents.off('change', onChangeOccurred)
  })
})

// GET /api/intelligence
router.get('/', (req, res) => {
  const { status, competitorId, serviceLine, itemType, q, limit = 100, offset = 0 } = req.query
  const all = getAllItems({ status, competitorId, serviceLine, itemType, q })
  const paginated = all.slice(Number(offset), Number(offset) + Number(limit))
  res.json({ data: paginated.map(withCompetitor), total: all.length })
})

// GET /api/intelligence/:id
router.get('/:id', (req, res) => {
  const item = getItem(req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(withCompetitor(item))
})

// POST /api/intelligence
router.post('/', (req, res) => {
  const item = addItem(req.body)
  res.status(201).json(withCompetitor(item))
})

// PUT /api/intelligence/:id
router.put('/:id', (req, res) => {
  const item = updateItem(req.params.id, req.body)
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(withCompetitor(item))
})

// PUT /api/intelligence/:id/publish
router.put('/:id/publish', (req, res) => {
  const item = publishItem(req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(withCompetitor(item))
})

// PUT /api/intelligence/:id/unpublish
router.put('/:id/unpublish', (req, res) => {
  const item = unpublishItem(req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  res.json(withCompetitor(item))
})

// DELETE /api/intelligence/:id
router.delete('/:id', (req, res) => {
  const ok = deleteItem(req.params.id)
  if (!ok) return res.status(404).json({ error: 'Not found' })
  res.status(204).end()
})

export default router
