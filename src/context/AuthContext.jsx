import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

const DEMO_EMAIL = 'schen@stamfordhealth.org'
const DEMO_PASSWORD = 'demo2026'
const DEMO_USER = {
  id: 'demo-user',
  email: DEMO_EMAIL,
  name: 'Dr. Sarah Chen',
  title: 'VP Strategy & Business Development',
  org: 'Stamford Health',
  role: 'admin',
  avatar: null,
}

function mapUser(supabaseUser) {
  if (!supabaseUser) return null
  const meta = supabaseUser.user_metadata || {}
  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    name: meta.name || supabaseUser.email,
    title: meta.title || 'Strategy Team',
    org: meta.org || 'Stamford Health',
    role: meta.role || 'viewer',
    avatar: meta.avatar_url || null,
  }
}

const SUPABASE_CONFIGURED = !!(
  import.meta.env.VITE_SUPABASE_URL &&
  !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!SUPABASE_CONFIGURED) {
      // Check if demo session was previously saved
      const saved = sessionStorage.getItem('pp_demo_auth')
      if (saved) {
        setUser(DEMO_USER)
        setIsAuthenticated(true)
      }
      setIsLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(mapUser(session?.user ?? null))
      setIsAuthenticated(!!session)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUser(session?.user ?? null))
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    if (!SUPABASE_CONFIGURED) {
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        sessionStorage.setItem('pp_demo_auth', '1')
        setUser(DEMO_USER)
        setIsAuthenticated(true)
        return
      }
      throw new Error('Invalid credentials')
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const logout = async () => {
    if (!SUPABASE_CONFIGURED) {
      sessionStorage.removeItem('pp_demo_auth')
      setUser(null)
      setIsAuthenticated(false)
      return
    }
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
