import { Link } from 'react-router-dom'

const variants = {
  primary:
    'bg-brand-700 text-white hover:bg-brand-800 shadow-soft disabled:bg-brand-300 disabled:shadow-none',
  secondary:
    'bg-white text-brand-800 border border-ink-200 hover:border-brand-300 hover:text-brand-900 disabled:text-ink-300',
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-50 hover:text-ink-900 disabled:text-ink-300',
  dark: 'bg-ink-900 text-white hover:bg-ink-800 disabled:bg-ink-300',
  danger: 'bg-rose-500 text-white hover:bg-rose-600 disabled:bg-rose-500/50',
  mint: 'bg-mint-500 text-white hover:bg-mint-600 disabled:bg-mint-500/50',
}

const sizes = {
  sm: 'h-9 px-3.5 text-sm rounded-xl gap-1.5',
  md: 'h-11 px-5 text-sm rounded-xl gap-2',
  lg: 'h-12 px-6 text-base rounded-2xl gap-2',
}

export default function Button({
  as = 'button',
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  children,
  ...props
}) {
  const classes = [
    'inline-flex items-center justify-center font-semibold transition-all duration-200 select-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    loading || disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const content = loading ? (
    <>
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
        <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
      {children}
    </>
  ) : (
    children
  )

  if (as === 'link' && to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }
  if (as === 'a' && href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  )
}
