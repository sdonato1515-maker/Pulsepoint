import React, { useState, useMemo } from 'react'
import { Search, ChevronDown, X, TrendingUp, TrendingDown, Minus, Star } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'
import { COMPETITORS, CON_FILINGS, PATIENT_SENTIMENT } from '../data/seed.js'
import Badge from '../components/ui/Badge.jsx'
import SourceTag from '../components/ui/SourceTag.jsx'

const ITEM_TYPE_LABELS = {
  expansion: 'Expansion',
  regulatory: 'CON Filing',
  care_model: 'Care Model',
  payer: 'Payer Move',
  leadership: 'Leadership',
  acquisition: 'Acquisition',
  technology: 'Technology',
  partnership: 'Partnership',
  other: 'Other',
}

const GEO_LABELS = { local: 'Local (PSA)', regional: 'Regional (SSA)', national: 'National' }

const TABS = [
  { id: 'all', label: 'All Signals' },
  { id: 'con', label: 'CON Filings' },
  { id: 'leadership', label: 'Leadership' },
  { id: 'ma', label: 'M&A & Partnerships' },
  { id: 'payer', label: 'Payer Signals' },
  { id: 'sentiment', label: 'Patient Sentiment' },
]

const SERVICE_LINES = [
  'All Service Lines', 'Cardiology', 'Oncology', 'Primary Care', 'Behavioral Health',
  'Orthopedics', 'Neurology', 'Payer/Contracting', 'Value-Based Care',
  'Patient Experience', 'Academic/Research',
]

const ITEM_TYPES = [
  'All Types', 'Expansion', 'CON Filing', 'Care Model', 'Payer Move',
  'Leadership', 'Acquisition', 'Technology', 'Partnership',
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function getCompetitor(id) {
  return COMPETITORS.find(c => c.id === id)
}

// ─── Intel item card ──────────────────────────────────────────────────────────

function IntelItem({ item }) {
  const competitor = getCompetitor(item.competitorId)
  return (
    <div
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 hover:shadow-md transition-shadow"
      style={{ borderLeft: `4px solid ${competitor?.color || '#E2E8F0'}` }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge bgColor={competitor?.bgColor} textColor={competitor?.textColor}>
            {competitor?.shortName}
          </Badge>
          {item.serviceLine && (
            <Badge bgColor="#F8FAFC" textColor="#475569">{item.serviceLine}</Badge>
          )}
          <Badge bgColor="#F0FDF4" textColor="#16A34A">
            {ITEM_TYPE_LABELS[item.itemType] || item.itemType}
          </Badge>
          {item.geographyLevel && (
            <Badge bgColor="#F1F5F9" textColor="#64748B">{GEO_LABELS[item.geographyLevel]}</Badge>
          )}
          {item.flag === 'monitoring' && (
            <Badge bgColor="#FEF3C7" textColor="#D97706">Monitoring</Badge>
          )}
        </div>
        <span className="text-xs text-[#94A3B8] whitespace-nowrap flex-shrink-0">
          {formatDate(item.publishedDate)}
        </span>
      </div>
      <p className="text-sm font-semibold text-[#1E293B] leading-snug mb-3">{item.headline}</p>
      <div className="border-l-2 border-[#0F6E56] pl-3 mb-3">
        <p className="text-sm italic text-[#475569] leading-relaxed">{item.soWhat}</p>
      </div>
      <SourceTag source={item.source} date={item.publishedDate} url={item.sourceUrl} />
    </div>
  )
}

// ─── CON Filings tab ─────────────────────────────────────────────────────────

const STATUS_COLORS = {
  'Under Review': { bg: '#FEF3C7', color: '#D97706' },
  'Public Comment': { bg: '#EFF6FF', color: '#1D4ED8' },
  'Pending': { bg: '#F1F5F9', color: '#475569' },
  'Approved': { bg: '#DCFCE7', color: '#15803D' },
  'Denied': { bg: '#FEE2E2', color: '#DC2626' },
}

function ConFilingsTab() {
  const { intelligenceItems } = useData()
  const conItems = intelligenceItems.filter(i => i.itemType === 'regulatory')

  return (
    <div className="space-y-4">
      <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-4">
        <p className="text-sm text-[#92400E]">
          <span className="font-semibold">Certificate of Need (CON) filings</span> require state approval before
          a health system can add beds, services, or capital equipment above a threshold.
          Monitor these as early signals of competitor capacity strategy.
        </p>
      </div>

      {/* CON Filing cards */}
      <div className="space-y-3">
        {CON_FILINGS.map(filing => {
          const competitor = getCompetitor(filing.competitorId)
          const statusStyle = STATUS_COLORS[filing.status] || STATUS_COLORS['Pending']
          return (
            <div
              key={filing.id}
              className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5"
              style={{ borderLeft: `4px solid ${competitor?.color || '#E2E8F0'}` }}
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge bgColor={competitor?.bgColor} textColor={competitor?.textColor}>
                    {competitor?.shortName}
                  </Badge>
                  <Badge bgColor="#F1F5F9" textColor="#475569">{filing.state} OHCA</Badge>
                  <span
                    className="px-2 py-0.5 rounded-md text-xs font-semibold"
                    style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                  >
                    {filing.status}
                  </span>
                </div>
                <span className="text-xs text-[#94A3B8] whitespace-nowrap">Filed {formatDate(filing.filedDate)}</span>
              </div>
              <p className="text-sm font-semibold text-[#1E293B] mb-0.5">{filing.facility}</p>
              <p className="text-sm text-[#475569]">
                {filing.serviceLine}{filing.beds ? ` · ${filing.beds}-bed expansion` : ' · New facility'}
              </p>
            </div>
          )
        })}

        {/* CON items from intel feed */}
        {conItems.map(item => <IntelItem key={item.id} item={item} />)}
      </div>
    </div>
  )
}

// ─── Leadership tab ───────────────────────────────────────────────────────────

function LeadershipTab() {
  const { intelligenceItems } = useData()
  const items = intelligenceItems.filter(i => i.itemType === 'leadership')
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))

  return (
    <div className="space-y-3">
      <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
        <p className="text-sm text-[#475569]">
          <span className="font-semibold text-[#1E293B]">Leadership change tracker. </span>
          New C-suite and VP-level hires are leading indicators of strategic shifts.
          A CFO from a major academic medical center signals margin focus; a new CMO from Cleveland Clinic
          signals quality investment.
        </p>
      </div>
      {items.map(item => <IntelItem key={item.id} item={item} />)}
    </div>
  )
}

// ─── M&A tab ──────────────────────────────────────────────────────────────────

function MATab() {
  const { intelligenceItems } = useData()
  const items = intelligenceItems
    .filter(i => i.itemType === 'acquisition' || i.itemType === 'partnership')
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))

  return (
    <div className="space-y-3">
      <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
        <p className="text-sm text-[#475569]">
          <span className="font-semibold text-[#1E293B]">M&A and partnership signals. </span>
          Acquisitions expand geographic footprint and service line depth.
          Partnerships signal strategic priorities and emerging payer relationships.
        </p>
      </div>
      {items.map(item => <IntelItem key={item.id} item={item} />)}
    </div>
  )
}

// ─── Payer Signals tab ────────────────────────────────────────────────────────

function PayerTab() {
  const { intelligenceItems } = useData()
  const items = intelligenceItems
    .filter(i => i.itemType === 'payer')
    .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))

  return (
    <div className="space-y-3">
      <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
        <p className="text-sm text-[#475569]">
          <span className="font-semibold text-[#1E293B]">Payer and contracting signals. </span>
          New network inclusions and direct-to-employer contracts change patient flow and competitive positioning.
          Monitor for Anthem, Cigna, Aetna, and self-insured employer moves in your geography.
        </p>
      </div>
      {items.map(item => <IntelItem key={item.id} item={item} />)}
    </div>
  )
}

// ─── Patient Sentiment tab ────────────────────────────────────────────────────

function RatingBar({ value }) {
  const pct = (value / 5) * 100
  const color = value >= 4.5 ? '#0F6E56' : value >= 4.0 ? '#D97706' : '#DC2626'
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-lg font-bold w-8 text-right" style={{ color }}>{value.toFixed(1)}</span>
    </div>
  )
}

function SentimentCard({ item }) {
  const competitor = getCompetitor(item.competitorId)
  const TrendIcon = item.trend === 'up' ? TrendingUp : item.trend === 'down' ? TrendingDown : Minus
  const trendColor = item.trend === 'up' ? '#059669' : item.trend === 'down' ? '#DC2626' : '#94A3B8'
  const changeSign = item.change > 0 ? '+' : ''

  return (
    <div
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5"
      style={{ borderLeft: `4px solid ${competitor?.color || '#E2E8F0'}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge bgColor={competitor?.bgColor} textColor={competitor?.textColor}>
              {competitor?.shortName}
            </Badge>
            <Badge bgColor="#F1F5F9" textColor="#475569">{item.platform}</Badge>
          </div>
          <p className="text-xs text-[#94A3B8]">{item.reviewCount.toLocaleString()} reviews · {item.period}</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: trendColor }}>
          <TrendIcon size={16} strokeWidth={2.5} />
          <span>{changeSign}{item.change.toFixed(1)}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-[#475569] font-medium">Overall Rating</span>
          <span className="text-xs text-[#94A3B8]">vs. {item.previousRating.toFixed(1)} last quarter</span>
        </div>
        <RatingBar value={item.currentRating} />
        <div className="flex mt-1.5">
          {[1, 2, 3, 4, 5].map(n => (
            <Star
              key={n}
              size={13}
              className={n <= Math.round(item.currentRating) ? 'text-[#F59E0B]' : 'text-[#E2E8F0]'}
              fill={n <= Math.round(item.currentRating) ? '#F59E0B' : '#E2E8F0'}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#F0FDF4] rounded-lg p-3">
          <p className="text-xs font-semibold text-[#15803D] mb-1.5">Patients praise</p>
          <ul className="space-y-0.5">
            {item.topPositiveThemes.map(t => (
              <li key={t} className="text-xs text-[#166534]">· {t}</li>
            ))}
          </ul>
        </div>
        <div className="bg-[#FFF7ED] rounded-lg p-3">
          <p className="text-xs font-semibold text-[#C2410C] mb-1.5">Patients flag</p>
          <ul className="space-y-0.5">
            {item.topNegativeThemes.map(t => (
              <li key={t} className="text-xs text-[#9A3412]">· {t}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-l-2 border-[#0F6E56] pl-3">
        <p className="text-sm italic text-[#475569] leading-relaxed">{item.soWhat}</p>
      </div>
    </div>
  )
}

function SentimentTab() {
  return (
    <div className="space-y-3">
      <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
        <p className="text-sm text-[#475569]">
          <span className="font-semibold text-[#1E293B]">Patient sentiment tracker. </span>
          Aggregate Healthgrades and Google review trends for competitor systems — updated quarterly.
          Rating trajectory often precedes volume shifts by 6–12 months.
        </p>
      </div>
      {PATIENT_SENTIMENT.map(item => <SentimentCard key={item.id} item={item} />)}
    </div>
  )
}

// ─── All Signals tab ──────────────────────────────────────────────────────────

function AllSignalsTab() {
  const { intelligenceItems } = useData()
  const [search, setSearch] = useState('')
  const [selectedCompetitor, setSelectedCompetitor] = useState('all')
  const [selectedServiceLine, setSelectedServiceLine] = useState('All Service Lines')
  const [selectedType, setSelectedType] = useState('All Types')

  const isFiltered = search || selectedCompetitor !== 'all' ||
    selectedServiceLine !== 'All Service Lines' || selectedType !== 'All Types'

  const filtered = useMemo(() => {
    return intelligenceItems
      .filter(item => {
        if (selectedCompetitor !== 'all' && item.competitorId !== selectedCompetitor) return false
        if (selectedServiceLine !== 'All Service Lines' && item.serviceLine !== selectedServiceLine) return false
        if (selectedType !== 'All Types') {
          const label = ITEM_TYPE_LABELS[item.itemType] || item.itemType
          if (label !== selectedType) return false
        }
        if (search) {
          const q = search.toLowerCase()
          return (
            item.headline.toLowerCase().includes(q) ||
            item.soWhat.toLowerCase().includes(q) ||
            (item.serviceLine || '').toLowerCase().includes(q) ||
            getCompetitor(item.competitorId)?.name.toLowerCase().includes(q)
          )
        }
        return true
      })
      .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
  }, [search, selectedCompetitor, selectedServiceLine, selectedType])

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search headlines, implications, service lines…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCompetitor('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCompetitor === 'all'
                ? 'bg-[#0F6E56] text-white'
                : 'bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] hover:bg-[#E6F4F1]'
            }`}
          >
            All Competitors
          </button>
          {COMPETITORS.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCompetitor(selectedCompetitor === c.id ? 'all' : c.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={
                selectedCompetitor === c.id
                  ? { backgroundColor: c.color, color: '#fff' }
                  : { backgroundColor: c.bgColor, color: c.textColor }
              }
            >
              {c.shortName}
            </button>
          ))}
          <div className="h-4 w-px bg-[#E2E8F0] mx-1" />
          <div className="relative">
            <select
              value={selectedServiceLine}
              onChange={e => setSelectedServiceLine(e.target.value)}
              className="pl-3 pr-7 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#475569] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56] cursor-pointer"
            >
              {SERVICE_LINES.map(sl => <option key={sl}>{sl}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="pl-3 pr-7 py-1.5 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[#475569] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56] cursor-pointer"
            >
              {ITEM_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
          </div>
          {isFiltered && (
            <button
              onClick={() => { setSearch(''); setSelectedCompetitor('all'); setSelectedServiceLine('All Service Lines'); setSelectedType('All Types') }}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-[#94A3B8] hover:text-[#475569]"
            >
              <X size={11} /> Clear
            </button>
          )}
          <span className="ml-auto text-xs text-[#94A3B8]">
            {filtered.length} of {intelligenceItems.length} items
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-12 text-center">
            <p className="text-sm text-[#94A3B8]">No items match your filters.</p>
            <button
              onClick={() => { setSearch(''); setSelectedCompetitor('all'); setSelectedServiceLine('All Service Lines'); setSelectedType('All Types') }}
              className="mt-3 text-sm text-[#0F6E56] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filtered.map(item => <IntelItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntelligenceFeed() {
  const { intelligenceItems } = useData()
  const [activeTab, setActiveTab] = useState('all')

  const TAB_COUNTS = {
    all: intelligenceItems.length,
    con: intelligenceItems.filter(i => i.itemType === 'regulatory').length + CON_FILINGS.length,
    leadership: intelligenceItems.filter(i => i.itemType === 'leadership').length,
    ma: intelligenceItems.filter(i => i.itemType === 'acquisition' || i.itemType === 'partnership').length,
    payer: intelligenceItems.filter(i => i.itemType === 'payer').length,
    sentiment: PATIENT_SENTIMENT.length,
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">Intelligence Feed</h1>
        <p className="text-sm text-[#94A3B8] mt-0.5">
          Competitor and market intelligence — Lower Fairfield County, CT
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-1.5 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#0F6E56] text-white shadow-sm'
                : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B]'
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#94A3B8]'
              }`}
            >
              {TAB_COUNTS[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'all' && <AllSignalsTab />}
      {activeTab === 'con' && <ConFilingsTab />}
      {activeTab === 'leadership' && <LeadershipTab />}
      {activeTab === 'ma' && <MATab />}
      {activeTab === 'payer' && <PayerTab />}
      {activeTab === 'sentiment' && <SentimentTab />}
    </div>
  )
}
