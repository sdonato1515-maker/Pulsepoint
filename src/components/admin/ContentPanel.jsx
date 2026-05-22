import React, { useState } from 'react'
import { X, Plus, Trash2, CheckCircle, RotateCcw, ChevronDown } from 'lucide-react'
import { useData } from '../../context/DataContext.jsx'

const COMPETITORS_LIST = [
  { id: 'ynhh', label: 'Yale New Haven Health (YNHH)' },
  { id: 'hhc', label: 'Hartford HealthCare (HHC)' },
  { id: 'northwell', label: 'Northwell Health' },
]

const SERVICE_LINES = [
  'Cardiology', 'Oncology', 'Primary Care', 'Behavioral Health', 'Orthopedics',
  'Neurology', 'Payer/Contracting', 'Value-Based Care', 'Patient Experience',
  'Academic/Research', 'Executive Health',
]

const ITEM_TYPES = [
  { value: 'expansion', label: 'Expansion' },
  { value: 'regulatory', label: 'CON Filing' },
  { value: 'care_model', label: 'Care Model' },
  { value: 'payer', label: 'Payer Move' },
  { value: 'leadership', label: 'Leadership Change' },
  { value: 'acquisition', label: 'Acquisition / M&A' },
  { value: 'technology', label: 'Technology / Digital' },
  { value: 'partnership', label: 'Partnership' },
]

const GEO_LEVELS = [
  { value: 'local', label: 'Local — Primary Service Area (PSA)' },
  { value: 'regional', label: 'Regional — Secondary Service Area (SSA)' },
  { value: 'national', label: 'National' },
]

const BLANK_FORM = {
  competitorId: 'ynhh',
  headline: '',
  soWhat: '',
  source: '',
  serviceLine: 'Primary Care',
  itemType: 'expansion',
  geographyLevel: 'local',
  publishedDate: new Date().toISOString().split('T')[0],
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#475569] mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full pl-3 pr-8 py-2 text-sm border border-[#E2E8F0] rounded-lg text-[#1E293B] appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
        >
          {options.map(o => (
            <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
      </div>
    </div>
  )
}

// ── Add Signal tab ─────────────────────────────────────────────────────────────
function AddSignalTab() {
  const { addIntelItem } = useData()
  const [form, setForm] = useState(BLANK_FORM)
  const [success, setSuccess] = useState(false)

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.headline.trim() || !form.soWhat.trim()) return
    addIntelItem(form)
    setSuccess(true)
    setForm(BLANK_FORM)
    setTimeout(() => setSuccess(false), 2500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Competitor *"
        value={form.competitorId}
        onChange={v => set('competitorId', v)}
        options={COMPETITORS_LIST}
      />

      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5">Headline *</label>
        <input
          type="text"
          required
          value={form.headline}
          onChange={e => set('headline', e.target.value)}
          placeholder="What did they do? Be specific."
          className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5">
          Strategic Implication — "So what?" *
        </label>
        <textarea
          required
          rows={3}
          value={form.soWhat}
          onChange={e => set('soWhat', e.target.value)}
          placeholder="Why does this matter to Stamford Health? One to two sentences."
          className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg text-[#1E293B] placeholder-[#94A3B8] resize-none focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select label="Service Line" value={form.serviceLine} onChange={v => set('serviceLine', v)} options={SERVICE_LINES} />
        <Select label="Signal Type" value={form.itemType} onChange={v => set('itemType', v)} options={ITEM_TYPES} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select label="Geography" value={form.geographyLevel} onChange={v => set('geographyLevel', v)} options={GEO_LEVELS} />
        <div>
          <label className="block text-xs font-semibold text-[#475569] mb-1.5">Date</label>
          <input
            type="date"
            value={form.publishedDate}
            onChange={e => set('publishedDate', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#475569] mb-1.5">Source</label>
        <input
          type="text"
          value={form.source}
          onChange={e => set('source', e.target.value)}
          placeholder="e.g. Hartford Business Journal, Press Release"
          className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
        />
      </div>

      {success && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-[#DCFCE7] border border-[#BBF7D0] rounded-lg">
          <CheckCircle size={15} className="text-[#15803D]" />
          <span className="text-sm font-medium text-[#15803D]">Signal added — visible on dashboard and feed.</span>
        </div>
      )}

      <button
        type="submit"
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0F6E56] text-white text-sm font-semibold rounded-lg hover:bg-[#0D5E49] transition-colors"
      >
        <Plus size={15} /> Add to Dashboard
      </button>
    </form>
  )
}

// ── Dashboard Stats tab ────────────────────────────────────────────────────────
function StatsTab() {
  const { dashboardStats, situationReport, updateStat, updateSituationReport } = useData()
  const [saved, setSaved] = useState(false)
  const [situation, setSituation] = useState(situationReport.text)

  function handleSave() {
    updateSituationReport(situation)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Stat counters */}
      <div>
        <h3 className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-3">Alert Counters</h3>
        <div className="space-y-3">
          {dashboardStats.map(stat => (
            <div key={stat.label} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: stat.color }} />
                <span className="text-sm text-[#1E293B]">{stat.label}</span>
              </div>
              <input
                type="number"
                min="0"
                max="999"
                value={stat.value}
                onChange={e => updateStat(stat.label, e.target.value)}
                className="w-20 px-2 py-1.5 text-sm text-center border border-[#E2E8F0] rounded-lg font-bold text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-[#94A3B8] mt-2">Changes update the dashboard immediately.</p>
      </div>

      {/* Situation report */}
      <div>
        <h3 className="text-xs font-semibold text-[#475569] uppercase tracking-wide mb-3">Situation Report Banner</h3>
        <textarea
          rows={5}
          value={situation}
          onChange={e => setSituation(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg text-[#1E293B] resize-none focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
        />
        <div className="flex items-center justify-between mt-2">
          {saved ? (
            <span className="text-xs text-[#15803D] font-medium flex items-center gap-1">
              <CheckCircle size={12} /> Saved
            </span>
          ) : (
            <span className="text-xs text-[#94A3B8]">Shown at the top of the dashboard</span>
          )}
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-[#0F6E56] text-white text-xs font-semibold rounded-lg hover:bg-[#0D5E49] transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Content Library tab ────────────────────────────────────────────────────────
function LibraryTab() {
  const { intelligenceItems, deleteIntelItem, competitors, resetToSeed } = useData()
  const customItems = intelligenceItems.filter(i => i.id.startsWith('custom-'))

  function getCompetitor(id) { return competitors.find(c => c.id === id) }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#475569]">
          <span className="font-semibold text-[#1E293B]">{customItems.length}</span> custom signals added
        </p>
        <button
          onClick={() => { if (window.confirm('Reset all custom signals and stats to seed data?')) resetToSeed() }}
          className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#DC2626] transition-colors"
        >
          <RotateCcw size={12} /> Reset to seed
        </button>
      </div>

      {customItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-[#94A3B8]">No custom signals yet.</p>
          <p className="text-xs text-[#CBD5E1] mt-1">Add one from the "Add Signal" tab.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {customItems.map(item => {
            const competitor = getCompetitor(item.competitorId)
            return (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC]"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: competitor?.color }}
                    >
                      {competitor?.shortName}
                    </span>
                    <span className="text-xs text-[#94A3B8]">{item.publishedDate}</span>
                  </div>
                  <p className="text-xs text-[#1E293B] leading-snug line-clamp-2">{item.headline}</p>
                </div>
                <button
                  onClick={() => deleteIntelItem(item.id)}
                  className="text-[#CBD5E1] hover:text-[#DC2626] transition-colors flex-shrink-0 mt-0.5"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main panel ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'add', label: 'Add Signal' },
  { id: 'stats', label: 'Dashboard Stats' },
  { id: 'library', label: 'My Signals' },
]

export default function ContentPanel({ onClose }) {
  const [activeTab, setActiveTab] = useState('add')

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[460px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] flex-shrink-0">
          <div>
            <h2 className="text-sm font-bold text-[#1E293B]">Update Dashboard</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">Changes are live and saved automatically</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#94A3B8] hover:bg-[#F8FAFC] hover:text-[#475569] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-[#E2E8F0] flex-shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#0F6E56] text-[#0F6E56]'
                  : 'border-transparent text-[#94A3B8] hover:text-[#475569]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'add' && <AddSignalTab />}
          {activeTab === 'stats' && <StatsTab />}
          {activeTab === 'library' && <LibraryTab />}
        </div>
      </div>
    </>
  )
}
