import { useState, useEffect, useRef, useCallback } from 'react'
import { INTELLIGENCE_ITEMS } from '../data/seed.js'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// ── REST helpers ──────────────────────────────────────────────────────────────
export async function apiAddItem(item) {
  const res = await fetch(`${API}/intelligence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
  if (!res.ok) throw new Error('Failed to add item')
  return res.json()
}

export async function apiPublishItem(id) {
  const res = await fetch(`${API}/intelligence/${id}/publish`, { method: 'PUT' })
  if (!res.ok) throw new Error('Failed to publish')
  return res.json()
}

export async function apiUnpublishItem(id) {
  const res = await fetch(`${API}/intelligence/${id}/unpublish`, { method: 'PUT' })
  if (!res.ok) throw new Error('Failed to unpublish')
  return res.json()
}

export async function apiDeleteItem(id) {
  const res = await fetch(`${API}/intelligence/${id}`, { method: 'DELETE' })
  if (!res.ok && res.status !== 204) throw new Error('Failed to delete')
}

export async function apiGetAllItems() {
  const res = await fetch(`${API}/intelligence`)
  if (!res.ok) throw new Error('API error')
  const { data } = await res.json()
  return data
}

export async function apiGetStats() {
  const res = await fetch(`${API}/intelligence/stats`)
  if (!res.ok) throw new Error('API error')
  return res.json()
}

// ── SSE hook — receives real-time pushes from the backend ─────────────────────
export function useIntelFeed() {
  // Seed data is the immediate fallback if backend isn't running
  const [items, setItems] = useState(
    INTELLIGENCE_ITEMS.filter(() => true) // clone
  )
  const [connected, setConnected] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const esRef = useRef(null)

  const connect = useCallback(() => {
    if (esRef.current) esRef.current.close()

    try {
      const es = new EventSource(`${API}/intelligence/stream`)
      esRef.current = es

      es.addEventListener('snapshot', e => {
        try {
          const data = JSON.parse(e.data)
          setItems(data)
          setConnected(true)
          setLastUpdated(new Date())
        } catch {}
      })

      es.addEventListener('change', e => {
        try {
          const event = JSON.parse(e.data)
          setLastUpdated(new Date())

          if (event.type === 'add' && event.payload.status === 'published') {
            setItems(prev => [event.payload, ...prev])
          } else if (event.type === 'update') {
            setItems(prev => {
              const exists = prev.find(i => i.id === event.payload.id)
              if (event.payload.status === 'draft') {
                // Unpublished — remove from feed
                return prev.filter(i => i.id !== event.payload.id)
              }
              if (exists) return prev.map(i => i.id === event.payload.id ? event.payload : i)
              return [event.payload, ...prev] // newly published
            })
          } else if (event.type === 'delete') {
            setItems(prev => prev.filter(i => i.id !== event.payload.id))
          }
        } catch {}
      })

      es.onerror = () => {
        setConnected(false)
        es.close()
        esRef.current = null
        // Reconnect after 5 seconds
        setTimeout(connect, 5000)
      }
    } catch {
      setConnected(false)
    }
  }, [])

  useEffect(() => {
    connect()
    return () => { if (esRef.current) esRef.current.close() }
  }, [connect])

  return { items, connected, lastUpdated }
}
