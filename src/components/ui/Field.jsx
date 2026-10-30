export function Field({ label, hint, error, required, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink-700">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  )
}

const baseInput =
  'w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-400 ' +
  'transition-colors duration-150 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ' +
  'disabled:bg-ink-50 disabled:text-ink-400'

export function Input({ className = '', ...props }) {
  return <input className={`${baseInput} h-11 ${className}`} {...props} />
}

export function Textarea({ className = '', rows = 4, ...props }) {
  return <textarea rows={rows} className={`${baseInput} py-2.5 leading-relaxed ${className}`} {...props} />
}

export function Select({ className = '', children, ...props }) {
  return (
    <select className={`${baseInput} h-11 appearance-none bg-no-repeat pr-9 ${className}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundPosition: 'right 0.75rem center',
      }}
      {...props}
    >
      {children}
    </select>
  )
}
