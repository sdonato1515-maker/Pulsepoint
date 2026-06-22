import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useIntelFeed } from '../hooks/useIntelFeed.js'
import {
  INTELLIGENCE_ITEMS,
  MARKET_PULSE_TOPICS,
  DASHBOARD_STATS,
  COMPETITORS,
  CON_FILINGS,
  WATCHLIST,
  WEEKLY_DIGEST,
  PATIENT_SENTIMENT,
  INNOVATION_ITEMS,
} from '../data/seed.js'

// ── localStorage helper ───────────────────────────────────────────────────────
function useLocalStorage(key, seed) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : seed
    } catch {
      return seed
    }
  })
  const set = useCallback(updater => {
    setValue(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      try { localStorage.setItem(key, JSON.stringify(next)) } catch {}
      return next
    })
  }, [key])
  return [value, set]
}

const SEED_VERSION = '2'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  if (localStorage.getItem('pp_seed_version') !== SEED_VERSION) {
    localStorage.removeItem('pp_intel')
    localStorage.removeItem('pp_pulse')
    localStorage.removeItem('pp_stats')
    localStorage.removeItem('pp_situation')
    localStorage.setItem('pp_seed_version', SEED_VERSION)
  }

  const { items: liveItems, connected } = useIntelFeed()
  const [intelligenceItems, setIntelligenceItems] = useLocalStorage('pp_intel', INTELLIGENCE_ITEMS)

  // When backend is connected, live SSE items take precedence
  useEffect(() => {
    if (connected && liveItems.length > 0) {
      setIntelligenceItems(liveItems)
    }
  }, [liveItems, connected])
  const [marketPulseTopics, setMarketPulseTopics] = useLocalStorage('pp_pulse', MARKET_PULSE_TOPICS)
  const [dashboardStats, setDashboardStats] = useLocalStorage('pp_stats', DASHBOARD_STATS)
  const [situationReport, setSituationReport] = useLocalStorage('pp_situation', {
    text: "Oncology competition intensifying across Fairfield County — Greenwich Hospital broke ground on Smilow Cancer, St. Vincent's received $15M for oncology renovations, and HHC secured first-in-nation MSK partnership. Stamford Health's $275M campus transformation with new Bennett Cancer Center is critical to maintaining position.",
    updatedAt: '2026-05-19',
  })
  const [competitors] = useState(COMPETITORS)
  const [conFilings] = useState(CON_FILINGS)
  const [watchlist] = useState(WATCHLIST)
  const [weeklyDigest] = useState(WEEKLY_DIGEST)
  const [patientSentiment] = useState(PATIENT_SENTIMENT)
  const [innovationItems] = useState(INNOVATION_ITEMS)


  // ── Intelligence mutations ─────────────────────────────────────────────────
  function addIntelItem(item) {
    const newItem = {
      ...item,
      id: `custom-${Date.now()}`,
      publishedDate: item.publishedDate || new Date().toISOString().split('T')[0],
      flag: 'new',
    }
    setIntelligenceItems(prev => [newItem, ...prev])
    // Bump relevant stat
    setDashboardStats(prev =>
      prev.map(s => s.label === 'New Alerts' ? { ...s, value: s.value + 1 } : s)
    )
  }

  function deleteIntelItem(id) {
    setIntelligenceItems(prev => prev.filter(i => i.id !== id))
  }

  // ── Stat mutations ─────────────────────────────────────────────────────────
  function updateStat(label, value) {
    setDashboardStats(prev => prev.map(s => s.label === label ? { ...s, value: Number(value) } : s))
  }

  // ── Situation report mutation ──────────────────────────────────────────────
  function updateSituationReport(text) {
    setSituationReport({
      text,
      updatedAt: new Date().toISOString().split('T')[0],
    })
  }

  // ── Reset ─────────────────────────────────────────────────────────────────
  function resetToSeed() {
    setIntelligenceItems(INTELLIGENCE_ITEMS)
    setMarketPulseTopics(MARKET_PULSE_TOPICS)
    setDashboardStats(DASHBOARD_STATS)
    setSituationReport({
      text: "Oncology competition intensifying across Fairfield County — Greenwich Hospital broke ground on Smilow Cancer, St. Vincent's received $15M for oncology renovations, and HHC secured first-in-nation MSK partnership. Stamford Health's $275M campus transformation with new Bennett Cancer Center is critical to maintaining position.",
      updatedAt: '2026-05-19',
    })
  }

  return (
    <DataContext.Provider value={{
      // Data
      intelligenceItems, marketPulseTopics, dashboardStats, situationReport,
      competitors, conFilings, watchlist, weeklyDigest, patientSentiment,
      innovationItems,
      // Live status
      backendConnected: connected,
      // Mutations
      addIntelItem, deleteIntelItem, updateStat, updateSituationReport, resetToSeed,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
