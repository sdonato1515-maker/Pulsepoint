import React, { useState } from 'react'
import { Zap, Eye, EyeOff, TrendingUp, Radar, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const DEMO_EMAIL = 'schen@stamfordhealth.org'
const DEMO_PASSWORD = 'demo2026'

export default function Login() {
  const { login, isLoading } = useAuth()
  const [email, setEmail] = useState(DEMO_EMAIL)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
    } catch {
      setError('Unable to sign in. Please check your credentials.')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12"
        style={{ backgroundColor: '#0F6E56' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none tracking-tight">PulsePoint</p>
            <p className="text-white/50 text-xs leading-none mt-0.5">Healthcare Intelligence</p>
          </div>
        </div>

        {/* Hero copy */}
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight tracking-tight mb-4">
            Strategy intelligence built for health system executives.
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            Know what your competitors are doing before your board asks.
          </p>

          {/* Feature bullets */}
          <div className="space-y-5">
            {[
              {
                icon: Radar,
                title: 'Real-time competitor monitoring',
                desc: 'Track every move YNHH, Hartford HealthCare, and Northwell make in your market.',
              },
              {
                icon: TrendingUp,
                title: 'Market Pulse scoring',
                desc: 'Know which initiatives have momentum and which ones to wait on.',
              },
              {
                icon: Users,
                title: 'Peer strategy network',
                desc: 'Structured connections with strategy executives at non-competing systems.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon size={17} className="text-white/80" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{title}</p>
                  <p className="text-white/60 text-sm leading-relaxed mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-white/30 text-xs">
          © 2026 PulsePoint · Confidential demo — Stamford CT market
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#0F6E56] rounded-lg flex items-center justify-center">
              <Zap size={17} className="text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg text-[#1E293B]">PulsePoint</span>
          </div>

          <h2 className="text-2xl font-bold text-[#1E293B] tracking-tight mb-1">Sign in</h2>
          <p className="text-sm text-[#94A3B8] mb-8">Access your market intelligence dashboard</p>

          {/* Demo notice */}
          <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg px-4 py-3 mb-6">
            <p className="text-xs font-semibold text-[#92400E] mb-0.5">Demo mode</p>
            <p className="text-xs text-[#92400E]/80">Credentials are pre-filled. Click Sign In to proceed.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-[#E2E8F0] rounded-lg text-[#1E293B] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-10 text-sm border border-[#E2E8F0] rounded-lg text-[#1E293B] bg-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#0F6E56]/20 focus:border-[#0F6E56] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-[#0F6E56] text-white text-sm font-semibold rounded-lg hover:bg-[#0D5E49] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Signing in…' : 'Sign in to PulsePoint'}
            </button>
          </form>

          <p className="text-xs text-[#CBD5E1] text-center mt-8">
            Stamford Health · Confidential
          </p>
        </div>
      </div>
    </div>
  )
}
