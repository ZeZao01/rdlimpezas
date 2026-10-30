import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import {
  IconCalendar,
  IconChart,
  IconClose,
  IconDoc,
  IconMenu,
  IconUsers,
  Logo,
} from '../ui/Icons'

const nav = [
  { to: '/crm', label: 'Visão geral', icon: IconChart, end: true },
  { to: '/crm/clientes', label: 'Clientes', icon: IconUsers },
  { to: '/crm/orcamentos', label: 'Orçamentos', icon: IconDoc },
  { to: '/crm/agenda', label: 'Agenda', icon: IconCalendar },
  { to: '/crm/solicitacoes', label: 'Solicitações', icon: IconMenu },
]

export default function CrmLayout({ children, title, subtitle, actions }) {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-[72px] items-center gap-2.5 border-b border-white/5 px-6">
        <Logo className="h-9 w-9 ring-1 ring-white/25" />
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-white">RD Limpezas</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-300">Gestão interna</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5 scrollbar-thin">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-brand-500/20 text-white'
                  : 'text-ink-300 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/5 p-4">
        <div className="rounded-2xl bg-white/5 p-3.5">
          <p className="truncate text-sm font-semibold text-white">
            {profile?.nome || user?.email || 'Operador'}
          </p>
          <p className="text-xs text-ink-400">{profile?.papel === 'admin' ? 'Administrador' : 'Operador'}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-3 w-full rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-ink-200 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-white"
          >
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-ink-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-ink-950 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-ink-950 animate-fade-up">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-h-screen w-full flex-col lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-xl border border-ink-200 p-2 text-ink-700 lg:hidden"
                onClick={() => setOpen(true)}
                aria-label="Abrir menu"
              >
                <IconMenu />
              </button>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-ink-900 sm:text-xl">{title}</h1>
                {subtitle && <p className="text-xs text-ink-500 sm:text-sm">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              {actions}
              <Button as="link" to="/" variant="ghost" size="sm" className="hidden sm:inline-flex">
                Ver site
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  )
}
