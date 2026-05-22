import React from 'react'
import { Activity, Lightbulb, Users, FileText, BookOpen } from 'lucide-react'

const SECTION_ICONS = {
  activity: Activity,
  lightbulb: Lightbulb,
  users: Users,
  'file-text': FileText,
}

export default function DigestPreview({ digest }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] flex items-center justify-center">
          <BookOpen size={16} className="text-[#0F6E56]" />
        </div>
        <div>
          <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wide">Weekly Digest</p>
          <p className="text-sm font-semibold text-[#1E293B]">Week of {digest.weekOf}</p>
        </div>
      </div>

      <div className="space-y-2">
        {digest.sections.map((section, idx) => {
          const Icon = SECTION_ICONS[section.icon] || FileText
          return (
            <div
              key={idx}
              className="flex items-center justify-between py-2 border-b border-[#F1F5F9] last:border-0"
            >
              <div className="flex items-center gap-2">
                <Icon size={14} className="text-[#94A3B8]" />
                <span className="text-sm text-[#475569]">{section.title}</span>
              </div>
              <span className="text-xs font-semibold text-[#0F6E56] bg-[#E6F4F1] px-2 py-0.5 rounded-full">
                {section.itemCount}
              </span>
            </div>
          )
        })}
      </div>

      <button className="w-full mt-2 bg-[#0F6E56] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#0A5240] transition-colors duration-150">
        Read Full Digest
      </button>
    </div>
  )
}
