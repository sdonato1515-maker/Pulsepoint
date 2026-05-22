import React from 'react'
import { Bell, Activity, FileText, Users } from 'lucide-react'

const ICON_MAP = {
  Bell,
  Activity,
  FileText,
  Users,
}

export default function StatCard({ label, value, subtitle, icon, color, bgColor }) {
  const Icon = ICON_MAP[icon] || Bell

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-shadow duration-150">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#475569]">{label}</p>
          <p className="mt-1 text-3xl font-bold text-[#1E293B] tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-[#94A3B8]">{subtitle}</p>
        </div>
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
          style={{ backgroundColor: bgColor }}
        >
          <Icon size={20} style={{ color }} strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}
