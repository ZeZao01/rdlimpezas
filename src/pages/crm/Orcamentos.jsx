import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CrmLayout from '../../components/layout/CrmLayout'
import Button from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Field'
import { Alert, EmptyState, Skeleton, StatusBadge } from '../../components/ui/Feedback'
import { IconArrow, IconDoc } from '../../components/ui/Icons'
import { listQuotes } from '../../lib/queries'
import { formatBRL, formatDate, statusQuoteLabel } from '../../lib/format'

export default function Orcamentos() {
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      const { data, error: err } = await listQuotes()
      if (!active) return
      if (err) {
        setError('Não foi possível carregar os registros. Tente novamente mais tarde.')
      } else {
        setError('')
        setQuotes(data ?? [])
      }
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const filtered = quotes.filter((q) => {
    const matchesStatus = statusFilter === 'todos' || q.status === statusFilter
    const term = search.toLowerCase()
    const matchesSearch =
      !term ||
      q.numero?.toLowerCase().includes(term) ||
      q.titulo?.toLowerCase().includes(term) ||
      q.clients?.nome?.toLowerCase().includes(term)
    return matchesStatus && matchesSearch
  })

  const totals = filtered.reduce(
    (acc, q) => {
      acc.total += Number(q.total || 0)
      if (q.status === 'aprovado') acc.aprovado += Number(q.total || 0)
      return acc
    },
    { total: 0, aprovado: 0 }
  )

  return (
    <CrmLayout
      title="Orçamentos"
      subtitle="Propostas comerciais e orçamentos"
      actions={
        <Button as="link" to="/crm/orcamentos/novo" size="sm">
          Novo orçamento
          <IconArrow className="h-4 w-4" />
        </Button>
      }
    >
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por número, título ou cliente…"
          />
        </div>
        <div className="w-full sm:max-w-[220px]">
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="todos">Todos os status</option>
            <option value="rascunho">Rascunho</option>
            <option value="enviado">Enviado</option>
            <option value="aprovado">Aprovado</option>
            <option value="recusado">Recusado</option>
            <option value="expirado">Expirado</option>
          </Select>
        </div>
        {!loading && (
          <div className="flex items-center gap-4 text-sm text-ink-500 sm:ml-auto">
            <span>
              Total: <strong className="text-ink-900">{formatBRL(totals.total)}</strong>
            </span>
            <span>
              Aprovado: <strong className="text-mint-600">{formatBRL(totals.aprovado)}</strong>
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[72px]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<IconDoc />}
          title={search || statusFilter !== 'todos' ? 'Nenhum orçamento encontrado' : 'Nenhum orçamento criado'}
          description={
            search || statusFilter !== 'todos'
              ? 'Ajuste os filtros para ver outros resultados.'
              : 'Crie sua primeira proposta comercial para começar a acompanhar suas negociações.'
          }
          action={
            <Button as="link" to="/crm/orcamentos/novo">
              Criar orçamento
              <IconArrow className="h-4 w-4" />
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/70 text-xs font-semibold uppercase tracking-wider text-ink-500">
                  <th className="px-6 py-3.5">Número</th>
                  <th className="px-4 py-3.5">Cliente</th>
                  <th className="px-4 py-3.5">Título</th>
                  <th className="px-4 py-3.5">Emissão</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {filtered.map((q) => (
                  <tr key={q.id} className="transition-colors hover:bg-ink-50/60">
                    <td className="px-6 py-4">
                      <Link to={`/crm/orcamentos/${q.id}`} className="text-sm font-semibold text-brand-700 hover:underline">
                        {q.numero}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm text-ink-900">{q.clients?.nome || '—'}</td>
                    <td className="px-4 py-4 text-sm text-ink-600">{q.titulo || '—'}</td>
                    <td className="px-4 py-4 text-sm text-ink-500">{formatDate(q.created_at)}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={q.status} label={statusQuoteLabel(q.status)} />
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-semibold tabular-nums text-ink-900">
                      {formatBRL(q.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </CrmLayout>
  )
}
