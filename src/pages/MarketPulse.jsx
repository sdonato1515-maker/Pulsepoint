import React, { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, ArrowLeft, Users, ChevronRight, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MARKET_PULSE_TOPICS } from '../data/seed.js'

const TOPIC_DETAIL = {
  'mp-1': {
    boardQuestions: [
      'What is our current post-acute cost per case, and how does home-based acute care affect our margin structure?',
      'Which payers in our market will reimburse for acute care at home, and at what rate relative to inpatient DRG payments?',
      'Do we have the care management infrastructure and remote monitoring technology to ensure clinical safety at home?',
      'How does Hospital-at-Home align with our value-based care contract performance metrics and readmission penalties?',
    ],
    readinessItems: [
      { q: 'We have an active value-based care or risk contract with at least one major payer', options: ['Yes', 'In negotiation', 'No'] },
      { q: 'We have a remote patient monitoring platform in place', options: ['Yes', 'Evaluating', 'No'] },
      { q: 'Our care management team has capacity to support home-based acute patients', options: ['Yes', 'Limited', 'No'] },
      { q: 'We have a post-acute strategy that explicitly includes the home setting', options: ['Formal strategy', 'Informal approach', 'Not yet'] },
    ],
  },
  'mp-2': {
    boardQuestions: [
      'What is the addressable high-income patient population in our geography and their demonstrated willingness to pay for premium preventive health?',
      'How does a longevity medicine program complement — or compete with — our existing executive health or concierge offerings?',
      'What are the regulatory and compliance considerations for direct-pay membership medicine in Connecticut?',
      'Can we recruit the specialist mix needed — preventive medicine, genomics, lifestyle medicine — within our existing employment model?',
    ],
    readinessItems: [
      { q: 'We have an existing executive health or concierge medicine program', options: ['Yes', 'Partial', 'No'] },
      { q: 'We have the physician recruitment pipeline for preventive and lifestyle specialists', options: ['Yes', 'Working on it', 'No'] },
      { q: 'We have direct-pay billing capability and infrastructure', options: ['Yes', 'Limited', 'No'] },
      { q: 'We have analyzed longevity medicine demand in our high-income zip codes', options: ['Formal analysis done', 'Informal review', 'Not yet'] },
    ],
  },
  'mp-3': {
    boardQuestions: [
      'With HHC, YNHH, and multiple national platforms already active in CT, what is our differentiated position on access, quality, or care model?',
      'What is our current behavioral health market share, and where specifically are we losing patients to virtual alternatives?',
      'Should we build internal virtual capability, acquire an existing platform, or partner — and what does each option cost and require operationally?',
      'How does virtual behavioral health integrate with our existing inpatient psychiatric capacity and crisis services?',
    ],
    readinessItems: [
      { q: 'We have a current-state behavioral health market share analysis', options: ['Yes — recent', 'Outdated', 'No'] },
      { q: 'We have telehealth infrastructure capable of supporting behavioral health visits', options: ['Yes', 'Partial', 'No'] },
      { q: 'We have the behavioral health clinician supply to expand virtual access', options: ['Yes', 'Limited', 'No'] },
      { q: 'We have defined our differentiation strategy in behavioral health', options: ['Yes — documented', 'In progress', 'No'] },
    ],
  },
  'mp-4': {
    boardQuestions: [
      'Given the Walmart Health exit and mixed national results, what does a successful retail health model look like at our scale and in our specific market?',
      'Do we have primary care provider supply sufficient to justify co-location investments without cannibalizing existing visits?',
      'How do we protect our existing primary care patient base from CVS MinuteClinic, Amazon Clinic, and other retail entrants already in Fairfield County?',
      'Is this primarily a brand awareness and access play, or does the financial model support a standalone positive business case?',
    ],
    readinessItems: [
      { q: 'We have analyzed the retail health competitive threat in our specific geography', options: ['Yes', 'Partially', 'No'] },
      { q: 'We have primary care provider capacity available for new access points', options: ['Yes', 'Limited', 'No'] },
      { q: 'We have an existing or prospective relationship with a retail partner', options: ['Yes', 'Exploring', 'No'] },
      { q: 'We have a current primary care access strategy', options: ['Yes — current', 'Outdated', 'No'] },
    ],
  },
}

function TrendBadge({ direction }) {
  const config = {
    up: { label: 'Trending Up', bg: '#DCFCE7', color: '#15803D', Icon: TrendingUp },
    down: { label: 'Declining', bg: '#FEE2E2', color: '#DC2626', Icon: TrendingDown },
    neutral: { label: 'Plateauing', bg: '#F1F5F9', color: '#64748B', Icon: Minus },
  }
  const { label, bg, color, Icon } = config[direction] || config.neutral
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ backgroundColor: bg, color }}
    >
      <Icon size={12} strokeWidth={2.5} />
      {label}
    </span>
  )
}

function MomentumBar({ score }) {
  const color = score >= 75 ? '#0F6E56' : score >= 50 ? '#D97706' : '#DC2626'
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-[#475569]">Market Momentum</span>
        <span className="text-base font-bold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
        <div className="h-1.5 rounded-full" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}

function ReadinessItem({ item }) {
  const [selected, setSelected] = useState(null)
  return (
    <div className="py-3 border-b border-[#F1F5F9] last:border-0">
      <p className="text-xs text-[#475569] leading-relaxed mb-2">{item.q}</p>
      <div className="flex flex-wrap gap-1.5">
        {item.options.map((opt, i) => (
          <button
            key={opt}
            onClick={() => setSelected(i)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors border ${
              selected === i
                ? 'bg-[#0F6E56] text-white border-[#0F6E56]'
                : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#0F6E56] hover:text-[#0F6E56]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

function TopicCard({ topic, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5 text-left hover:shadow-md hover:border-[#0F6E56]/40 transition-all group w-full"
    >
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-[#1E293B] group-hover:text-[#0F6E56] transition-colors mb-1.5">
            {topic.name}
          </h3>
          <TrendBadge direction={topic.trendDirection} />
        </div>
        <ChevronRight size={18} className="text-[#CBD5E1] group-hover:text-[#0F6E56] transition-colors flex-shrink-0 mt-0.5" />
      </div>
      <MomentumBar score={topic.momentumScore} />
      <p className="text-xs text-[#475569] mt-3 leading-relaxed line-clamp-2">{topic.summary}</p>
      <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
        <p className="text-xs text-[#94A3B8]">
          <span className="font-medium text-[#475569]">Peer activity: </span>
          {topic.peerActivity}
        </p>
      </div>
    </button>
  )
}

function TopicDetail({ topic, onBack }) {
  const detail = TOPIC_DETAIL[topic.id] || { boardQuestions: [], readinessItems: [] }
  const scoreColor = topic.momentumScore >= 75 ? '#0F6E56' : topic.momentumScore >= 50 ? '#D97706' : '#DC2626'

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-[#475569] hover:text-[#0F6E56] transition-colors mb-4"
        >
          <ArrowLeft size={15} /> Back to all topics
        </button>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">{topic.name}</h1>
          <TrendBadge direction={topic.trendDirection} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: main content */}
        <div className="col-span-2 space-y-5">
          {/* Momentum */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-6">
            <h2 className="text-sm font-semibold text-[#1E293B] mb-5">Market Momentum</h2>
            <div className="flex items-center gap-8 mb-5">
              <div className="text-center flex-shrink-0">
                <div className="text-5xl font-bold leading-none" style={{ color: scoreColor }}>
                  {topic.momentumScore}
                </div>
                <div className="text-xs text-[#94A3B8] mt-1.5">out of 100</div>
              </div>
              <div className="flex-1">
                <div className="h-3 rounded-full bg-[#F1F5F9] overflow-hidden mb-2">
                  <div
                    className="h-3 rounded-full"
                    style={{ width: `${topic.momentumScore}%`, backgroundColor: scoreColor }}
                  />
                </div>
                <div className="flex justify-between text-xs text-[#94A3B8]">
                  <span>Nascent</span>
                  <span>Maturing</span>
                  <span>Saturated</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed">{topic.summary}</p>
          </div>

          {/* Peer Activity */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-[#E6F4F1] flex items-center justify-center">
                <Users size={13} className="text-[#0F6E56]" />
              </div>
              <h2 className="text-sm font-semibold text-[#1E293B]">What Peer Systems Are Doing</h2>
            </div>
            <p className="text-sm text-[#475569] leading-relaxed">{topic.peerActivity}</p>
          </div>

          {/* Board Questions */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-[#FEF3C7] flex items-center justify-center">
                <Lightbulb size={13} className="text-[#D97706]" />
              </div>
              <h2 className="text-sm font-semibold text-[#1E293B]">Questions Your Board Will Ask</h2>
            </div>
            <div className="space-y-3">
              {detail.boardQuestions.map((q, i) => (
                <div key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#E6F4F1] text-[#0F6E56] text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-[#475569] leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: readiness + CTA */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
            <h2 className="text-sm font-semibold text-[#1E293B] mb-0.5">Readiness Check</h2>
            <p className="text-xs text-[#94A3B8] mb-4">Rate your organization honestly before bringing this forward</p>
            {detail.readinessItems.map((item, i) => (
              <ReadinessItem key={i} item={item} />
            ))}
          </div>

          <div className="bg-[#E6F4F1] rounded-xl border border-[#0F6E56]/20 p-5">
            <h2 className="text-sm font-semibold text-[#0F6E56] mb-1.5">Talk to a Peer</h2>
            <p className="text-xs text-[#475569] leading-relaxed mb-4">
              Connect with a strategy leader at a system that has already explored or implemented this initiative.
            </p>
            <Link
              to="/peer-network"
              className="block w-full text-center bg-[#0F6E56] text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-[#0D5E49] transition-colors"
            >
              Find a Peer Connection
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MarketPulse() {
  const [selectedTopic, setSelectedTopic] = useState(null)

  if (selectedTopic) {
    return <TopicDetail topic={selectedTopic} onBack={() => setSelectedTopic(null)} />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">Market Pulse</h1>
        <p className="text-sm text-[#94A3B8] mt-0.5">Strategic initiative momentum — explore before committing</p>
      </div>

      <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
        <p className="text-sm text-[#475569]">
          <span className="font-semibold text-[#1E293B]">How to use Market Pulse: </span>
          Select a topic to explore its market momentum, understand what peer systems are already doing, and get
          the board questions you need to answer before bringing an initiative forward.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {MARKET_PULSE_TOPICS.map(topic => (
          <TopicCard key={topic.id} topic={topic} onClick={() => setSelectedTopic(topic)} />
        ))}
      </div>
    </div>
  )
}
