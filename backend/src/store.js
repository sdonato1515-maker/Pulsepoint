import { EventEmitter } from 'events'
import { INTELLIGENCE_ITEMS } from './data/seed.js'
import { supabase } from './lib/supabase.js'

// ── In-memory store ───────────────────────────────────────────────────────────
// Seeded from static data on startup, then synced from Supabase if configured.
// All mutations write through to Supabase asynchronously so restarts don't lose data.

let items = INTELLIGENCE_ITEMS.map(item => ({
  ...item,
  status: 'published',
  createdAt: item.publishedDate,
  updatedAt: item.publishedDate,
}))

let _id = 1000

// ── Pub/Sub for SSE ───────────────────────────────────────────────────────────
export const storeEvents = new EventEmitter()
storeEvents.setMaxListeners(200)

function notify(type, payload) {
  storeEvents.emit('change', { type, payload, ts: Date.now() })
}

// ── Supabase mapping ──────────────────────────────────────────────────────────
function toDb(item) {
  return {
    id: item.id,
    competitor_id: item.competitorId || null,
    headline: item.headline,
    so_what: item.soWhat || null,
    source: item.source || null,
    published_date: item.publishedDate || null,
    service_line: item.serviceLine || null,
    item_type: item.itemType || null,
    geography: item.geography || null,
    status: item.status || 'draft',
    flag: item.flag || null,
    updated_at: new Date().toISOString(),
  }
}

function fromDb(row) {
  return {
    id: row.id,
    competitorId: row.competitor_id,
    headline: row.headline,
    soWhat: row.so_what,
    source: row.source,
    publishedDate: row.published_date,
    serviceLine: row.service_line,
    itemType: row.item_type,
    geography: row.geography,
    status: row.status,
    flag: row.flag,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

async function dbUpsert(item) {
  if (!supabase) return
  const { error } = await supabase.from('intelligence_items').upsert(toDb(item))
  if (error) console.error('[supabase] upsert error:', error.message)
}

async function dbDelete(id) {
  if (!supabase) return
  const { error } = await supabase.from('intelligence_items').delete().eq('id', id)
  if (error) console.error('[supabase] delete error:', error.message)
}

// ── Startup: load from Supabase ───────────────────────────────────────────────
export async function initStore() {
  if (!supabase) return

  const { data, error } = await supabase
    .from('intelligence_items')
    .select('*')
    .order('published_date', { ascending: false })

  if (error) {
    console.error('[supabase] failed to load items on startup:', error.message)
    return
  }

  if (data && data.length > 0) {
    items = data.map(fromDb)
    console.log(`[supabase] loaded ${items.length} items from database`)
  } else {
    // First run: seed the database with initial items
    console.log('[supabase] no items found — seeding database with initial data')
    const seedRows = items.map(toDb)
    const { error: seedError } = await supabase.from('intelligence_items').upsert(seedRows)
    if (seedError) console.error('[supabase] seed error:', seedError.message)
    else console.log(`[supabase] seeded ${seedRows.length} items`)
  }
}

// ── Read ──────────────────────────────────────────────────────────────────────
export function getAllItems({ status, competitorId, serviceLine, itemType, q } = {}) {
  let result = [...items]
  if (status) result = result.filter(i => i.status === status)
  if (competitorId) result = result.filter(i => i.competitorId === competitorId)
  if (serviceLine) result = result.filter(i => i.serviceLine === serviceLine)
  if (itemType) result = result.filter(i => i.itemType === itemType)
  if (q) {
    const lq = q.toLowerCase()
    result = result.filter(i =>
      i.headline.toLowerCase().includes(lq) ||
      (i.soWhat || '').toLowerCase().includes(lq) ||
      (i.serviceLine || '').toLowerCase().includes(lq)
    )
  }
  return result.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
}

export function getItem(id) {
  return items.find(i => i.id === id) || null
}

// ── Write ─────────────────────────────────────────────────────────────────────
export function addItem(data) {
  const item = {
    ...data,
    id: `item-${_id++}`,
    status: data.status || 'draft',
    publishedDate: data.publishedDate || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    flag: data.status === 'published' ? 'new' : undefined,
  }
  items.unshift(item)
  notify('add', item)
  dbUpsert(item)
  return item
}

export function updateItem(id, data) {
  const idx = items.findIndex(i => i.id === id)
  if (idx === -1) return null
  items[idx] = { ...items[idx], ...data, updatedAt: new Date().toISOString() }
  notify('update', items[idx])
  dbUpsert(items[idx])
  return items[idx]
}

export function deleteItem(id) {
  const idx = items.findIndex(i => i.id === id)
  if (idx === -1) return false
  items.splice(idx, 1)
  notify('delete', { id })
  dbDelete(id)
  return true
}

export function publishItem(id) {
  return updateItem(id, { status: 'published', flag: 'new' })
}

export function unpublishItem(id) {
  return updateItem(id, { status: 'draft', flag: undefined })
}

export function getStats() {
  return {
    total: items.length,
    published: items.filter(i => i.status === 'published').length,
    draft: items.filter(i => i.status === 'draft').length,
    addedThisWeek: items.filter(i => {
      const d = new Date(i.createdAt)
      const now = new Date()
      return (now - d) / 86400000 <= 7
    }).length,
  }
}
