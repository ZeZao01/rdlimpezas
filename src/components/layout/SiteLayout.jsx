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

// Título e descrição por página (antes todas tinham o mesmo título, ruim para o Google).
const PAGE_META = {
  '/': {
    title: 'RD Limpezas | Limpeza profissional em Tubarão e região',
    description:
      'Limpeza residencial, empresarial, pós-obra, condomínios, vidros e terceirização em Tubarão, Laguna, Capivari de Baixo e região. Orçamento gratuito.',
  },
  '/servicos': {
    title: 'Serviços de limpeza em Tubarão | RD Limpezas',
    description:
      'Limpeza residencial, empresarial e comercial, terceirização, condomínios, pós-obra, vidros e áreas externas em Tubarão e região.',
  },
  '/sobre': {
    title: 'Sobre a RD Limpezas | Limpeza e conservação em Tubarão',
    description: 'Conheça a RD Limpezas: equipe preparada, trabalhos realizados e atendimento em Tubarão e região.',
  },
  '/orcamento': {
    title: 'Orçamento de limpeza gratuito | RD Limpezas',
    description: 'Peça seu orçamento de limpeza sem compromisso. Atendemos empresas, condomínios, construtoras e residências.',
  },
  '/contato': {
    title: 'Contato e WhatsApp | RD Limpezas Tubarão',
    description: 'Fale com a RD Limpezas pelo WhatsApp, telefone ou Instagram. Centro de Tubarão, SC.',
  },
}

function setMeta(name, content) {
  let tag = document.querySelector(`meta[name="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/5548991097803?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20quero%20um%20or%C3%A7amento."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a RD Limpezas no WhatsApp"
      className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E]"
      style={{
        right: 'calc(1.25rem + env(safe-area-inset-right, 0px))',
        bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.53 1.74 6.5L3 29l6.68-1.75A12.95 12.95 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.67c-2 0-3.95-.54-5.65-1.56l-.4-.24-3.97 1.04 1.06-3.86-.26-.4A10.63 10.63 0 0 1 5.37 16c0-5.88 4.79-10.66 10.67-10.66S26.7 10.12 26.7 16s-4.79 10.67-10.66 10.67Zm5.85-7.98c-.32-.16-1.9-.94-2.19-1.04-.3-.11-.51-.16-.72.16-.21.32-.83 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.58-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.53-.54-.72-.55h-.62c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66s1.15 3.09 1.31 3.3c.16.21 2.26 3.45 5.47 4.84.76.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  )
}

export default function SiteLayout({ children }) {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    const meta = PAGE_META[pathname] ?? PAGE_META['/']
    document.title = meta.title
    setMeta('description', meta.description)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px]">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
