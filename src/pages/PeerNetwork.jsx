import React, { useState } from 'react'
import { Users, CheckCircle, Clock, Plus, X, ChevronDown } from 'lucide-react'
import { PEER_CONNECTIONS } from '../data/seed.js'

const TOPICS = [
  'Hospital-at-Home',
  'Longevity Medicine / Executive Health',
  'Virtual Behavioral Health',
  'Retail Health Partnerships',
  'AI-Powered Diagnostics',
  'Direct-to-Employer Strategy',
  'Value-Based Care Contracting',
  'Service Line Expansion',
  'Orthopedics Center of Excellence',
  'Behavioral Health Integration',
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function StatusBadge({ status }) {
  if (status === 'Connected') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D]">
        <CheckCircle size={11} /> Connected
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
      <Clock size={11} /> Awaiting Response
    </span>
  )
}

function ConnectionCard({ connection }) {
  const initials = connection.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#0F6E56] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div>
              <p className="text-sm font-semibold text-[#1E293B]">{connection.name}</p>
              <p className="text-xs text-[#475569]">{connection.title} · {connection.org}</p>
            </div>
            <StatusBadge status={connection.status} />
          </div>
          <div className="mt-3 bg-[#F8FAFC] rounded-lg px-3 py-2 border border-[#E2E8F0]">
            <p className="text-xs font-medium text-[#94A3B8] mb-0.5">Topic</p>
            <p className="text-sm text-[#1E293B]">{connection.topic}</p>
          </div>
          <p className="text-xs text-[#94A3B8] mt-2">Sent {formatDate(connection.sentDate)}</p>
        </div>
      </div>
    </div>
  )
}

function NewInquiryModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ topic: '', challenge: '', context: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => { onSubmit(form); onClose() }, 1600)
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-base font-semibold text-[#1E293B]">Start a Peer Inquiry</h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">Your request will be routed to a relevant strategy contact</p>
          </div>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#475569] transition-colors">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 bg-[#DCFCE7] rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={24} className="text-[#15803D]" />
            </div>
            <h3 className="text-base font-semibold text-[#1E293B] mb-1">Inquiry Submitted</h3>
            <p className="text-sm text-[#475569]">We'll route your request and notify you when a peer responds.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Topic / Initiative *</label>
              <div className="relative">
                <select
                  required
                  value={form.topic}
                  onChange={e => setForm(f => ({ ...f, topic: e.target.value }))}
                  className="w-full pl-3 pr-8 py-2 text-sm border border-[#E2E8F0] rounded-lg text-[#1E293B] appearance-none focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
                >
                  <option value="">Select a topic…</option>
                  {TOPICS.map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">What are you trying to solve? *</label>
              <textarea
                required
                rows={3}
                value={form.challenge}
                onChange={e => setForm(f => ({ ...f, challenge: e.target.value }))}
                placeholder="Describe the strategic question or challenge you're working through…"
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg text-[#1E293B] placeholder-[#94A3B8] resize-none focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Your system context</label>
              <textarea
                rows={2}
                value={form.context}
                onChange={e => setForm(f => ({ ...f, context: e.target.value }))}
                placeholder="System size, geography, service lines, where you are in your planning process…"
                className="w-full px-3 py-2 text-sm border border-[#E2E8F0] rounded-lg text-[#1E293B] placeholder-[#94A3B8] resize-none focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56]"
              />
            </div>

            <div className="bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] px-4 py-3">
              <p className="text-xs text-[#475569]">
                <span className="font-semibold text-[#1E293B]">How this works: </span>
                Your inquiry is matched with a strategy contact at a health system with relevant experience.
                Connections are professional and structured. Typical response time: 3–5 business days.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 text-sm font-medium text-[#475569] border border-[#E2E8F0] rounded-lg hover:bg-[#F8FAFC] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 text-sm font-medium text-white bg-[#0F6E56] rounded-lg hover:bg-[#0D5E49] transition-colors"
              >
                Submit Inquiry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function PeerNetwork() {
  const [connections, setConnections] = useState(PEER_CONNECTIONS)
  const [showModal, setShowModal] = useState(false)

  function handleNewConnection(form) {
    setConnections(prev => [{
      id: `peer-${Date.now()}`,
      name: 'Pending Match',
      title: 'Strategy Contact',
      org: 'To be matched',
      topic: form.topic,
      sentDate: new Date().toISOString().split('T')[0],
      status: 'Awaiting Response',
    }, ...prev])
  }

  const active = connections.filter(c => c.status === 'Connected')
  const pending = connections.filter(c => c.status !== 'Connected')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight">Peer Network</h1>
          <p className="text-sm text-[#94A3B8] mt-0.5">Structured peer connections — not a social feed</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F6E56] text-white text-sm font-medium rounded-lg hover:bg-[#0D5E49] transition-colors shadow-sm"
        >
          <Plus size={15} /> New Inquiry
        </button>
      </div>

      <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] flex items-center justify-center flex-shrink-0">
            <Users size={15} className="text-[#0F6E56]" />
          </div>
          <p className="text-sm text-[#475569] leading-relaxed">
            <span className="font-semibold text-[#1E293B]">How Peer Connections Work: </span>
            Submit a structured inquiry describing what you're exploring. PulsePoint routes your request to the
            strategy contact at a featured system with relevant experience. No cold outreach — every connection is
            warm and purpose-driven.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Inquiries', value: connections.length },
          { label: 'Active Connections', value: active.length },
          { label: 'Awaiting Response', value: pending.length },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-[#1E293B]">{stat.value}</div>
            <div className="text-xs text-[#94A3B8] mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {active.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#1E293B] mb-3">Active Connections</h2>
          <div className="space-y-3">
            {active.map(c => <ConnectionCard key={c.id} connection={c} />)}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[#1E293B] mb-3">Pending Inquiries</h2>
          <div className="space-y-3">
            {pending.map(c => <ConnectionCard key={c.id} connection={c} />)}
          </div>
        </div>
      )}

      {showModal && (
        <NewInquiryModal
          onClose={() => setShowModal(false)}
          onSubmit={handleNewConnection}
        />
      )}
    </div>
  )
}
