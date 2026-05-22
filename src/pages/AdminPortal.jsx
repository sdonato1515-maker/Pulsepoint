import React, { useState, useEffect, useCallback } from 'react'
import {
  apiGetAllItems, apiGetStats, apiAddItem,
  apiPublishItem, apiUnpublishItem, apiDeleteItem,
} from '../hooks/useIntelFeed.js'
import { COMPETITORS } from '../data/seed.js'
import {
  Plus, Eye, EyeOff, Trash2, RefreshCw, CheckCircle2,
  AlertCircle, Loader2, FileText, Globe, Archive, CalendarPlus,
} from 'lucide-react'

const SERVICE_LINES = [
  'Oncology', 'Cardiology', 'Orthopedics', 'Neurology', 'Women\'s Health',
  'Behavioral Health', 'Primary Care', 'Emergency Medicine', 'Surgery', 'Radiology',
]
const ITEM_TYPES = [
  'market_move', 'con_filing', 'leadership_change', 'partnership', 'payer_signal',
  'expansion', 'technology', 'financial',
]
const ITEM_TYPE_LABELS = {
  market_move: 'Market Move', con_filing: 'CON Filing', leadership_change: 'Leadership Change',
  partnership: 'Partnership', payer_signal: 'Payer Signal', expansion: 'Expansion',
  technology: 'Technology', financial: 'Financial',
}

const STATUS_BADGE = {
  published: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  draft: 'bg-slate-100 text-slate-500 border border-slate-200',
}

function StatsBar({ stats, loading }) {
  const cards = [
    { label: 'Total Signals', value: stats?.total ?? '—', icon: FileText, color: 'text-slate-600', bg: 'bg-slate-100' },
    { label: 'Published', value: stats?.published ?? '—', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Draft', value: stats?.draft ?? '—', icon: Archive, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'Added This Week', value: stats?.addedThisWeek ?? '—', icon: CalendarPlus, color: 'text-[#0F6E56]', bg: 'bg-teal-100' },
  ]
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map(c => (
        <div key={c.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${c.bg}`}>
            <c.icon size={16} className={c.color} />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800 tabular-nums leading-tight">
              {loading ? <Loader2 size={16} className="animate-spin text-slate-400" /> : c.value}
            </p>
            <p className="text-xs text-slate-500 leading-tight">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

const EMPTY_FORM = {
  competitorId: '', headline: '', soWhat: '', serviceLine: '',
  itemType: 'market_move', geography: 'Stamford, CT', source: '',
  publishedDate: new Date().toISOString().split('T')[0], status: 'published',
}

function AddSignalForm({ onSuccess, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function set(k, v) { setForm(prev => ({ ...prev, [k]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.headline.trim()) { setError('Headline is required'); return }
    setSaving(true)
    setError(null)
    try {
      await apiAddItem(form)
      onSuccess()
    } catch {
      setError('Failed to save — is the backend running?')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/30 focus:border-[#0F6E56]'
  const labelCls = 'block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1'

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
      <h3 className="text-sm font-bold text-slate-800 mb-4">New Intelligence Signal</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelCls}>Competitor</label>
          <select className={inputCls} value={form.competitorId} onChange={e => set('competitorId', e.target.value)}>
            <option value="">Select competitor…</option>
            {COMPETITORS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Signal Type</label>
          <select className={inputCls} value={form.itemType} onChange={e => set('itemType', e.target.value)}>
            {ITEM_TYPES.map(t => <option key={t} value={t}>{ITEM_TYPE_LABELS[t]}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className={labelCls}>Headline *</label>
        <input
          className={inputCls} type="text"
          placeholder="What happened? (e.g. YNHH opens urgent care in Darien)"
          value={form.headline} onChange={e => set('headline', e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className={labelCls}>So What (Strategic Implication)</label>
        <textarea
          className={`${inputCls} resize-none`} rows={3}
          placeholder="What does this mean for Stamford Health? What action should leaders consider?"
          value={form.soWhat} onChange={e => set('soWhat', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className={labelCls}>Service Line</label>
          <select className={inputCls} value={form.serviceLine} onChange={e => set('serviceLine', e.target.value)}>
            <option value="">— None —</option>
            {SERVICE_LINES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Geography</label>
          <input className={inputCls} type="text" value={form.geography} onChange={e => set('geography', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Date</label>
          <input className={inputCls} type="date" value={form.publishedDate} onChange={e => set('publishedDate', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className={labelCls}>Source / URL</label>
          <input className={inputCls} type="text" placeholder="Hartford Courant, press release…" value={form.source} onChange={e => set('source', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Publish Status</label>
          <select className={inputCls} value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="published">Publish immediately (live to all users)</option>
            <option value="draft">Save as draft</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          <AlertCircle size={14} />{error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit" disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F6E56] text-white text-sm font-semibold rounded-lg hover:bg-[#0a5843] disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          {saving ? 'Saving…' : form.status === 'published' ? 'Publish Signal' : 'Save Draft'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  )
}

function ItemRow({ item, onAction }) {
  const [acting, setActing] = useState(null)
  const competitor = COMPETITORS.find(c => c.id === item.competitorId)

  async function handle(action) {
    setActing(action)
    try {
      if (action === 'publish') await apiPublishItem(item.id)
      else if (action === 'unpublish') await apiUnpublishItem(item.id)
      else if (action === 'delete') {
        if (!window.confirm('Delete this signal permanently?')) { setActing(null); return }
        await apiDeleteItem(item.id)
      }
      onAction()
    } catch {
      alert('Action failed — is the backend running?')
    } finally {
      setActing(null)
    }
  }

  const isActing = (a) => acting === a

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
      <td className="px-4 py-3 max-w-xs">
        <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-2">{item.headline}</p>
        {item.soWhat && (
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{item.soWhat}</p>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        {competitor
          ? <span className="text-xs font-semibold text-slate-600 bg-slate-100 rounded-md px-2 py-0.5">{competitor.shortName || competitor.name}</span>
          : <span className="text-xs text-slate-400">—</span>
        }
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="text-xs text-slate-500">{ITEM_TYPE_LABELS[item.itemType] || item.itemType || '—'}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[item.status] || STATUS_BADGE.draft}`}>
          {item.status === 'published' ? 'Published' : 'Draft'}
        </span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-400 tabular-nums">
        {item.publishedDate || '—'}
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1">
          {item.status === 'published' ? (
            <button
              onClick={() => handle('unpublish')} disabled={!!acting}
              title="Unpublish (move to draft)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-40 transition-colors"
            >
              {isActing('unpublish') ? <Loader2 size={14} className="animate-spin" /> : <EyeOff size={14} />}
            </button>
          ) : (
            <button
              onClick={() => handle('publish')} disabled={!!acting}
              title="Publish (go live)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-40 transition-colors"
            >
              {isActing('publish') ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
            </button>
          )}
          <button
            onClick={() => handle('delete')} disabled={!!acting}
            title="Delete permanently"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
          >
            {isActing('delete') ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminPortal() {
  const [items, setItems] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [successMsg, setSuccessMsg] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [data, s] = await Promise.all([apiGetAllItems(), apiGetStats()])
      setItems(data)
      setStats(s)
    } catch {
      setError('Could not connect to backend. Make sure the server is running on port 3001.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  function showSuccess(msg) {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  async function handleFormSuccess() {
    setShowForm(false)
    await refresh()
    showSuccess('Signal saved and live on the dashboard.')
  }

  const filtered = filterStatus === 'all' ? items : items.filter(i => i.status === filterStatus)

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Content Hub</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage intelligence signals published to the executive dashboard</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F6E56] text-white text-sm font-semibold rounded-lg hover:bg-[#0a5843] transition-colors"
          >
            <Plus size={15} />
            Add New Signal
          </button>
        </div>
      </div>

      {/* Stats */}
      <StatsBar stats={stats} loading={loading && !stats} />

      {/* Success toast */}
      {successMsg && (
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-5 text-sm font-medium">
          <CheckCircle2 size={15} />{successMsg}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 text-sm">
          <AlertCircle size={15} />{error}
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <AddSignalForm
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {/* Table filter bar */}
        <div className="flex items-center gap-1 px-4 py-3 border-b border-slate-100">
          {['all', 'published', 'draft'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                filterStatus === s
                  ? 'bg-[#0F6E56] text-white'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {s === 'all' ? `All (${items.length})` : `${s.charAt(0).toUpperCase() + s.slice(1)} (${items.filter(i => i.status === s).length})`}
            </button>
          ))}
        </div>

        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-slate-400 gap-2">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Loading signals…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm">No signals found.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Signal</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Competitor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <ItemRow key={item.id} item={item} onAction={refresh} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
