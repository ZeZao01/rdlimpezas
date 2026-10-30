import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Button from '../ui/Button'
import { IconArrow, IconClose, IconInstagram, IconMenu, IconPhone, IconWhatsApp, LogoFull } from '../ui/Icons'

const navLinks = [
  { to: '/', label: 'Início' },
  { to: '/servicos', label: 'Serviços' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/orcamento', label: 'Orçamento' },
  { to: '/contato', label: 'Contato' },
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 shadow-card backdrop-blur-xl' : 'bg-white/70 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label="RD Limpezas — início">
          <LogoFull />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-800' : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Button as="a" href="https://wa.me/5548991097803" variant="secondary" size="sm">
            <IconWhatsApp className="h-4 w-4 text-mint-500" />
            WhatsApp
          </Button>
          <Button as="link" to="/orcamento" size="sm">
            Solicitar orçamento
            <IconArrow className="h-4 w-4" />
          </Button>
        </div>

        <button
          type="button"
          className="rounded-xl border border-ink-200 p-2.5 text-ink-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <IconClose /> : <IconMenu />}
        </button>
      </div>

      {open && (
        <div className="animate-fade-in border-t border-ink-100 bg-white lg:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-3 text-base font-semibold ${
                    isActive ? 'bg-brand-50 text-brand-800' : 'text-ink-700 hover:bg-ink-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button as="a" href="https://wa.me/5548991097803" variant="secondary">
                WhatsApp
              </Button>
              <Button as="link" to="/orcamento">
                Orçamento
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-ink-200">
      <div className="pointer-events-none absolute inset-0 grid-noise opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <LogoFull light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              Soluções completas em limpeza para empresas, condomínios, construtoras, imobiliárias e residências em
              Tubarão e região. Emissão de nota fiscal e atendimento personalizado.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['Residencial', 'Empresarial', 'Pós-obra', 'Condomínios'].map((t) => (
                <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-ink-300">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Navegação</h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-ink-400 transition-colors hover:text-brand-300">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/login" className="text-sm text-ink-400 transition-colors hover:text-brand-300">
                  Acesso interno
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Serviços</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-400">
              <li>Limpeza residencial</li>
              <li>Limpeza empresarial e comercial</li>
              <li>Terceirização de limpeza</li>
              <li>Limpeza de condomínios</li>
              <li>Limpeza pesada e pós-obra</li>
              <li>Vidros e áreas externas</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Contato</h3>
            <ul className="mt-4 space-y-3 text-sm text-ink-400">
              <li>
                <a href="https://wa.me/5548991097803" className="inline-flex items-center gap-2 transition-colors hover:text-brand-300">
                  <IconWhatsApp className="h-4 w-4 text-mint-400" />
                  Comercial: (48) 99109-7803
                </a>
              </li>
              <li>
                <a href="tel:+554899219434" className="inline-flex items-center gap-2 transition-colors hover:text-brand-300">
                  <IconPhone className="h-4 w-4 text-brand-300" />
                  Financeiro: (48) 9921-9434
                </a>
              </li>
              <li>
                <a href="https://instagram.com/rdlimpezas_" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-brand-300">
                  <IconInstagram className="h-4 w-4 text-brand-300" />
                  @rdlimpezas_
                </a>
              </li>
              <li>Tubarão — SC e região</li>
            </ul>
            <Button as="link" to="/orcamento" variant="mint" size="sm" className="mt-5">
              Pedir orçamento gratuito
            </Button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} RD Limpezas. Todos os direitos reservados.
          </p>
          <p className="text-xs font-medium text-ink-400">RD Limpezas — A RD cuida pra você.</p>
        </div>
      </div>
    </footer>
  )
}

export default function SiteLayout({ children }) {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer />
    </div>
  )
}
