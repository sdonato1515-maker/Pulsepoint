import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

function TrendIcon({ direction }) {
  if (direction === 'up') return <TrendingUp size={14} className="text-[#059669]" />
  if (direction === 'down') return <TrendingDown size={14} className="text-[#DC2626]" />
  return <Minus size={14} className="text-[#D97706]" />
}

function getMomentumColor(score) {
  if (score >= 80) return '#059669'
  if (score >= 60) return '#0F6E56'
  if (score >= 40) return '#D97706'
  return '#DC2626'
}

function MomentumBar({ score }) {
  const color = getMomentumColor(score)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold tabular-nums" style={{ color }}>
        {score}
      </span>
    </div>
  )
}

function TopicCard({ topic }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-sm hover:shadow-md transition-shadow duration-150">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm font-semibold text-[#1E293B] leading-tight pr-2">{topic.name}</p>
        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
          <TrendIcon direction={topic.trendDirection} />
          <span className={`text-xs font-medium ${
            topic.trendDirection === 'up' ? 'text-[#059669]' :
            topic.trendDirection === 'down' ? 'text-[#DC2626]' :
            'text-[#D97706]'
          }`}>
            {topic.trendDirection === 'up' ? 'Rising' : topic.trendDirection === 'down' ? 'Cooling' : 'Plateau'}
          </span>
        </div>
      </div>

      <div className="mb-2">
        <MomentumBar score={topic.momentumScore} />
        <p className="text-xs text-[#94A3B8] mt-0.5">Momentum score</p>
      </div>

      <p className="text-xs text-[#475569] leading-relaxed">{topic.summary}</p>
    </div>
  )
}

export default function MarketPulseTrending({ topics }) {
  return (
    <div className="space-y-3">
      {topics.map(topic => (
        <TopicCard key={topic.id} topic={topic} />
      ))}
    </div>
  )
}
