export function Spinner({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2.5 text-ink-500 ${className}`} role="status">
      <svg className="h-5 w-5 animate-spin text-brand-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="text-sm font-medium">Carregando…</span>
    </div>
  )
}

export function Skeleton({ className = '' }) {
  return <div className={`skeleton rounded-xl ${className}`} />
}

export function EmptyState({ icon, title, description, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/60 px-6 py-14 text-center ${className}`}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-ink-900">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function Alert({ type = 'info', title, children, className = '' }) {
  const styles = {
    info: 'border-brand-200 bg-brand-50 text-brand-900',
    success: 'border-mint-400/40 bg-mint-400/10 text-mint-600',
    warning: 'border-sun-400/50 bg-sun-400/10 text-ink-800',
    error: 'border-rose-500/30 bg-rose-500/10 text-rose-600',
  }
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles[type] || styles.info} ${className}`} role="alert">
      {title && <p className="font-semibold">{title}</p>}
      {children && <div className={title ? 'mt-0.5 opacity-90' : ''}>{children}</div>}
    </div>
  )
}

export function Badge({ tone = 'brand', children, className = '' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-800 border-brand-200',
    mint: 'bg-mint-400/10 text-mint-600 border-mint-400/30',
    sun: 'bg-sun-400/15 text-ink-800 border-sun-400/40',
    rose: 'bg-rose-500/10 text-rose-600 border-rose-500/25',
    ink: 'bg-ink-100 text-ink-600 border-ink-200',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${tones[tone] || tones.brand} ${className}`}
    >
      {children}
    </span>
  )
}

const quoteTones = {
  rascunho: 'ink',
  enviado: 'brand',
  aprovado: 'mint',
  recusado: 'rose',
  expirado: 'sun',
}

const orderTones = {
  agendado: 'brand',
  em_andamento: 'sun',
  concluido: 'mint',
  cancelado: 'rose',
}

const leadTones = {
  novo: 'brand',
  em_contato: 'sun',
  convertido: 'mint',
  perdido: 'rose',
}

export function StatusBadge({ kind = 'quote', status, label }) {
  const map = kind === 'order' ? orderTones : kind === 'lead' ? leadTones : quoteTones
  return <Badge tone={map[status] || 'ink'}>{label || status}</Badge>
}

export function StatCard({ label, value, hint, tone = 'brand', icon }) {
  const accents = {
    brand: 'from-brand-500/15 to-transparent text-brand-700',
    mint: 'from-mint-400/20 to-transparent text-mint-600',
    sun: 'from-sun-400/20 to-transparent text-sun-500',
    ink: 'from-ink-500/10 to-transparent text-ink-700',
  }
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accents[tone] || accents.brand}`} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-ink-500">{hint}</p>}
        </div>
        {icon && <div className="text-brand-600/80">{icon}</div>}
      </div>
    </div>
  )
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  if (!open) return null
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink-950/45 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={`relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white shadow-soft animate-fade-up sm:rounded-3xl ${widths[size] || widths.md}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink-100 bg-white px-6 py-5">
          <h2 className="text-lg font-bold text-ink-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700"
            aria-label="Fechar"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="sticky bottom-0 border-t border-ink-100 bg-white px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}

export function Toast({ message, tone = 'success', onClose }) {
  if (!message) return null
  const styles = {
    success: 'border-mint-400/40 bg-white text-ink-800',
    error: 'border-rose-500/40 bg-white text-ink-800',
    info: 'border-brand-300 bg-white text-ink-800',
  }
  return (
    <div className="fixed bottom-5 left-1/2 z-[100] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-fade-up">
      <div className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-soft ${styles[tone] || styles.success}`}>
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
            tone === 'error' ? 'bg-rose-500' : tone === 'info' ? 'bg-brand-600' : 'bg-mint-500'
          }`}
        >
          {tone === 'error' ? '!' : '✓'}
        </span>
        <p className="flex-1 text-sm font-medium leading-snug">{message}</p>
        <button type="button" onClick={onClose} className="text-ink-400 hover:text-ink-700" aria-label="Dispensar">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
