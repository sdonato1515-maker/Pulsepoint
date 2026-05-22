import React, { useRef } from 'react'
import { Printer, Activity, Lightbulb, Users, FileText, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { INTELLIGENCE_ITEMS, INNOVATION_ITEMS, COMPETITORS } from '../data/seed.js'

const WEEK_OF = 'May 19, 2026'
const PUBLISHED = 'Monday, May 19, 2026 · 6:00 AM'

// Pull digest content from seed data
const MARKET_MOVES = INTELLIGENCE_ITEMS
  .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
  .slice(0, 5)

const INNOVATION_SPOTLIGHT = INNOVATION_ITEMS.slice(0, 3)

const LEADERSHIP_CHANGES = INTELLIGENCE_ITEMS.filter(i => i.itemType === 'leadership')

const REGULATORY_SIGNALS = INTELLIGENCE_ITEMS.filter(i => i.itemType === 'regulatory')

function getCompetitor(id) {
  return COMPETITORS.find(c => c.id === id)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function SectionHeader({ icon: Icon, title, count, color = '#0F6E56' }) {
  return (
    <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-[#0F6E56]">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <Icon size={16} style={{ color }} />
      </div>
      <h2 className="text-base font-bold text-[#1E293B]">{title}</h2>
      <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569]">
        {count} items
      </span>
    </div>
  )
}

function DigestIntelItem({ item }) {
  const competitor = getCompetitor(item.competitorId)
  return (
    <div className="py-4 border-b border-[#F1F5F9] last:border-0">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-md"
          style={{ backgroundColor: competitor?.bgColor, color: competitor?.textColor }}
        >
          {competitor?.shortName}
        </span>
        {item.serviceLine && (
          <span className="text-xs text-[#94A3B8]">{item.serviceLine}</span>
        )}
      </div>
      <p className="text-sm font-semibold text-[#1E293B] leading-snug mb-1.5">{item.headline}</p>
      <div className="border-l-2 border-[#0F6E56] pl-2.5 mb-1.5">
        <p className="text-xs italic text-[#475569] leading-relaxed">{item.soWhat}</p>
      </div>
      <p className="text-xs text-[#94A3B8]">{item.source} · {formatDate(item.publishedDate)}</p>
    </div>
  )
}

function DigestInnovationItem({ item }) {
  return (
    <div className="py-4 border-b border-[#F1F5F9] last:border-0">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#1E293B] text-white">
          {item.systemName}
        </span>
        <span className="text-xs text-[#94A3B8]">{item.serviceLine}</span>
      </div>
      <p className="text-sm font-semibold text-[#1E293B] leading-snug mb-1">{item.headline}</p>
      {item.outcomes && (
        <p className="text-xs text-[#059669] font-medium mb-1.5">{item.outcomes}</p>
      )}
      <p className="text-xs text-[#94A3B8]">{formatDate(item.publishedDate)}</p>
    </div>
  )
}

function DigestLeadershipItem({ item }) {
  const competitor = getCompetitor(item.competitorId)
  return (
    <div className="py-4 border-b border-[#F1F5F9] last:border-0">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-md"
          style={{ backgroundColor: competitor?.bgColor, color: competitor?.textColor }}
        >
          {competitor?.shortName}
        </span>
      </div>
      <p className="text-sm font-semibold text-[#1E293B] leading-snug mb-1.5">{item.headline}</p>
      <div className="border-l-2 border-[#0F6E56] pl-2.5 mb-1.5">
        <p className="text-xs italic text-[#475569]">{item.soWhat}</p>
      </div>
      <p className="text-xs text-[#94A3B8]">{item.source} · {formatDate(item.publishedDate)}</p>
    </div>
  )
}

function DigestRegulatoryItem({ item }) {
  const competitor = getCompetitor(item.competitorId)
  return (
    <div className="py-4 border-b border-[#F1F5F9] last:border-0">
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-md"
          style={{ backgroundColor: competitor?.bgColor, color: competitor?.textColor }}
        >
          {competitor?.shortName}
        </span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#D97706]">CON Filing</span>
      </div>
      <p className="text-sm font-semibold text-[#1E293B] leading-snug mb-1.5">{item.headline}</p>
      <div className="border-l-2 border-[#0F6E56] pl-2.5 mb-1.5">
        <p className="text-xs italic text-[#475569]">{item.soWhat}</p>
      </div>
      <p className="text-xs text-[#94A3B8]">{item.source} · {formatDate(item.publishedDate)}</p>
    </div>
  )
}

export default function Digest() {
  const printRef = useRef(null)

  function handlePrint() {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Page header (screen only) */}
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">Weekly Digest</h1>
          <p className="text-sm text-[#94A3B8] mt-0.5">Your curated executive briefing — Week of {WEEK_OF}</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] text-[#475569] text-sm font-medium rounded-lg hover:bg-[#F8FAFC] transition-colors shadow-sm"
        >
          <Printer size={15} />
          Export / Print
        </button>
      </div>

      {/* Digest document */}
      <div ref={printRef} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden print:shadow-none print:border-0">
        {/* Digest header */}
        <div className="px-8 py-6 border-b border-[#E2E8F0]" style={{ backgroundColor: '#0F6E56' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-1">Stamford Health</p>
              <h1 className="text-2xl font-bold text-white tracking-tight">Market Intelligence Digest</h1>
              <p className="text-white/70 text-sm mt-1">Week of {WEEK_OF}</p>
            </div>
            <div className="text-right">
              <p className="text-white/50 text-xs">PulsePoint</p>
              <p className="text-white/50 text-xs mt-0.5">{PUBLISHED}</p>
            </div>
          </div>
        </div>

        {/* TOC strip */}
        <div className="flex items-center gap-6 px-8 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] text-xs text-[#475569]">
          <span className="flex items-center gap-1.5 font-medium">
            <Activity size={12} className="text-[#0F6E56]" /> Market Moves ({MARKET_MOVES.length})
          </span>
          <span className="text-[#CBD5E1]">·</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Lightbulb size={12} className="text-[#D97706]" /> Innovation Spotlight ({INNOVATION_SPOTLIGHT.length})
          </span>
          <span className="text-[#CBD5E1]">·</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Users size={12} className="text-[#7C3AED]" /> Leadership Changes ({LEADERSHIP_CHANGES.length})
          </span>
          <span className="text-[#CBD5E1]">·</span>
          <span className="flex items-center gap-1.5 font-medium">
            <FileText size={12} className="text-[#D97706]" /> Regulatory Signals ({REGULATORY_SIGNALS.length})
          </span>
        </div>

        {/* Editor's Note */}
        <div className="px-8 py-5 border-b border-[#F1F5F9] bg-[#FAFFFE]">
          <p className="text-xs font-semibold text-[#0F6E56] uppercase tracking-wide mb-2">Editor's Note</p>
          <p className="text-sm text-[#475569] leading-relaxed">
            This week's top story is Northwell Health's accelerating CT market entry — first employer contract
            (Indeed.com, 2,400 Stamford employees), Greenwich hub scheduled for Q4 2026, and three urgent care
            sites announced in Darien, Westport, and New Canaan. Combined with YNHH's cardiovascular expansion
            in Greenwich, your lower Fairfield County competitive intensity is rising sharply. Recommend scheduling
            a market response session with your strategy team this week.
          </p>
        </div>

        {/* Content sections */}
        <div className="px-8 py-6 space-y-8">
          {/* Section 1: Market Moves */}
          <section>
            <SectionHeader icon={Activity} title="Market Moves This Week" count={MARKET_MOVES.length} />
            {MARKET_MOVES.map(item => <DigestIntelItem key={item.id} item={item} />)}
            <Link
              to="/intelligence"
              className="print:hidden inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[#0F6E56] hover:underline"
            >
              View full intelligence feed <ArrowRight size={12} />
            </Link>
          </section>

          {/* Section 2: Innovation */}
          <section>
            <SectionHeader icon={Lightbulb} title="National Innovation Spotlight" count={INNOVATION_SPOTLIGHT.length} color="#D97706" />
            {INNOVATION_SPOTLIGHT.map(item => <DigestInnovationItem key={item.id} item={item} />)}
            <Link
              to="/innovation"
              className="print:hidden inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[#0F6E56] hover:underline"
            >
              View full innovation feed <ArrowRight size={12} />
            </Link>
          </section>

          {/* Section 3: Leadership */}
          <section>
            <SectionHeader icon={Users} title="Leadership Changes" count={LEADERSHIP_CHANGES.length} color="#7C3AED" />
            {LEADERSHIP_CHANGES.map(item => <DigestLeadershipItem key={item.id} item={item} />)}
          </section>

          {/* Section 4: Regulatory */}
          <section>
            <SectionHeader icon={FileText} title="Regulatory Signals" count={REGULATORY_SIGNALS.length} color="#D97706" />
            {REGULATORY_SIGNALS.map(item => <DigestRegulatoryItem key={item.id} item={item} />)}
          </section>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <p className="text-xs text-[#94A3B8] text-center">
            PulsePoint · Stamford Health · Confidential — for internal strategic use only ·{' '}
            <span className="font-medium">pulsepoint.health</span>
          </p>
        </div>
      </div>
    </div>
  )
}
