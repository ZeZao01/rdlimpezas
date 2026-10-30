import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return undefined
    }

    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session ?? null)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!session?.user || !isSupabaseConfigured) {
      setProfile(null)
      return undefined
    }
    let active = true
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setProfile(data ?? { id: session.user.id, nome: session.user.email, papel: 'operador' })
      })
    return () => {
      active = false
    }
  }, [session])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      isAuthenticated: Boolean(session),
      signIn: async (email, password) => {
        if (!isSupabaseConfigured) {
          return { error: { message: 'Serviço indisponível no momento. Tente novamente mais tarde.' } }
        }
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        return { data, error }
      },
      signOut: async () => {
        if (isSupabaseConfigured) await supabase.auth.signOut()
        setSession(null)
        setProfile(null)
      },
    }),
    [session, profile, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
