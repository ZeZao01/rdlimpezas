import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CrmLayout from '../../components/layout/CrmLayout'
import Button from '../../components/ui/Button'
import {
  Alert,
  Badge,
  EmptyState,
  Skeleton,
  StatCard,
  StatusBadge,
} from '../../components/ui/Feedback'
import {
  IconArrow,
  IconChart,
  IconDoc,
  IconUsers,
} from '../../components/ui/Icons'
import { getDashboardSummary, listLeads, listOrders, listQuotes } from '../../lib/queries'
import { formatBRL, formatDate, statusQuoteLabel, serviceTypeLabel } from '../../lib/format'

const MONTHS_PT = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function lastSixMonths() {
  const now = new Date()
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return { key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTHS_PT[d.getMonth()], year: d.getFullYear() }
  })
}

function MonthlyQuotesChart({ quotes }) {
  const months = lastSixMonths()
  const data = months.map((m) => {
    const count = quotes.filter((q) => {
      const d = new Date(q.created_at)
      return d.getFullYear() === m.year && d.getMonth() === Number(m.key.split('-')[1])
    }).length
    return { ...m, count }
  })
  const max = Math.max(...data.map((d) => d.count), 1)
  const [hover, setHover] = useState(null)

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-ink-900">Orçamentos criados por mês</h3>
          <p className="mt-1 text-xs text-ink-500">Últimos 6 meses · contagem de propostas</p>
        </div>
      </div>

      <div className="mt-6">
        <svg viewBox="0 0 480 180" className="h-44 w-full" role="img" aria-label="Gráfico de colunas de orçamentos criados por mês">
          {[0.25, 0.5, 0.75, 1].map((t) => (
            <line key={t} x1="32" x2="470" y1={140 - t * 110} y2={140 - t * 110} stroke="#e2e8f0" strokeWidth="1" />
          ))}
          <line x1="32" x2="470" y1="140" y2="140" stroke="#cbd5e1" strokeWidth="1.5" />

          {data.map((d, i) => {
            const slot = 438 / data.length
            const barW = Math.min(slot - 14, 46)
            const x = 32 + i * slot + (slot - barW) / 2
            const h = (d.count / max) * 110
            const y = 140 - h
            return (
              <g key={d.key} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
                <rect x={x - 6} y={30} width={barW + 12} height={112} fill="transparent" />
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={Math.max(h, 2)}
                  rx="4"
                  fill="#1d4ed8"
                  opacity={hover === null || hover === i ? 1 : 0.45}
                  style={{ transition: 'opacity 150ms ease' }}
                />
                <text x={x + barW / 2} y={y - 8} textAnchor="middle" fontSize="11" fontWeight="600" fill="#334155">
                  {d.count}
                </text>
                <text x={x + barW / 2} y={158} textAnchor="middle" fontSize="11" fill="#64748b">
                  {d.label}
                </text>
                {hover === i && (
                  <g>
                    <rect
                      x={Math.min(Math.max(x + barW / 2 - 52, 32), 366)}
                      y="6"
                      width="104"
                      height="26"
                      rx="6"
                      fill="#0f172a"
                    />
                    <text
                      x={Math.min(Math.max(x + barW / 2, 84), 418)}
                      y="23"
                      textAnchor="middle"
                      fontSize="11"
                      fill="#ffffff"
                    >
                      {d.count} orçamento{d.count === 1 ? '' : 's'}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

function StatusMeters({ quotes }) {
  const groups = useMemo(() => {
    const statuses = ['rascunho', 'enviado', 'aprovado', 'recusado', 'expirado']
    const total = quotes.length || 1
    return statuses.map((status) => {
      const count = quotes.filter((q) => q.status === status).length
      return { status, count, pct: Math.round((count / total) * 100) }
    })
  }, [quotes])

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
      <h3 className="text-base font-bold text-ink-900">Funil de orçamentos</h3>
      <p className="mt-1 text-xs text-ink-500">Distribuição atual por status</p>
      <div className="mt-5 space-y-4">
        {groups.map((g) => (
          <div key={g.status}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-ink-700">{statusQuoteLabel(g.status)}</span>
              <span className="font-semibold tabular-nums text-ink-900">
                {g.count} <span className="font-normal text-ink-400">({g.pct}%)</span>
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100">
              <div
                className="h-full rounded-full bg-brand-700 transition-all duration-500"
                style={{ width: `${g.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState(null)
  const [recentQuotes, setRecentQuotes] = useState([])
  const [upcoming, setUpcoming] = useState([])
  const [recentLeads, setRecentLeads] = useState([])

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      const [sumRes, quotesRes, ordersRes, leadsRes] = await Promise.all([
        getDashboardSummary(),
        listQuotes(),
        listOrders(),
        listLeads(),
      ])
      if (!active) return
      if (sumRes.error) {
        setError('Não foi possível carregar os registros. Tente novamente mais tarde.')
        setLoading(false)
        return
      }
      setSummary(sumRes.data)
      setRecentQuotes((quotesRes.data ?? []).slice(0, 5))
      setUpcoming(
        (ordersRes.data ?? [])
          .filter((o) => o.status === 'agendado' || o.status === 'em_andamento')
          .slice(0, 5)
      )
      setRecentLeads((leadsRes.data ?? []).filter((l) => l.status === 'novo' || l.status === 'em_contato').slice(0, 5))
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const kpis = useMemo(() => {
    if (!summary) return []
    const approved = summary.quotes.filter((q) => q.status === 'aprovado')
    const decided = summary.quotes.filter((q) => q.status === 'aprovado' || q.status === 'recusado')
    const conversion = decided.length ? Math.round((approved.length / decided.length) * 100) : 0
    const revenue = approved.reduce((acc, q) => acc + Number(q.total || 0), 0)
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)
    const quotesThisMonth = summary.quotes.filter((q) => new Date(q.created_at) >= monthStart).length
    return [
      { label: 'Clientes cadastrados', value: String(summary.clients.length), hint: 'Base ativa de clientes', tone: 'brand', icon: <IconUsers /> },
      { label: 'Orçamentos no mês', value: String(quotesThisMonth), hint: 'Propostas criadas este mês', tone: 'ink', icon: <IconDoc /> },
      { label: 'Taxa de conversão', value: `${conversion}%`, hint: 'Aprovados sobre decididos', tone: 'mint', icon: <IconChart /> },
      { label: 'Receita aprovada', value: formatBRL(revenue), hint: 'Soma dos orçamentos aprovados', tone: 'sun', icon: <IconChart /> },
    ]
  }, [summary])

  return (
    <CrmLayout
      title="Visão geral"
      subtitle="Acompanhe a operação da RD Limpezas em tempo real"
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

      {loading ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <StatCard key={kpi.label} {...kpi} />
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <MonthlyQuotesChart quotes={summary?.quotes ?? []} />
            <StatusMeters quotes={summary?.quotes ?? []} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-ink-100 bg-white shadow-card">
              <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
                <h3 className="text-base font-bold text-ink-900">Orçamentos recentes</h3>
                <Link to="/crm/orcamentos" className="text-xs font-semibold text-brand-700 hover:text-brand-800">
                  Ver todos
                </Link>
              </div>
              {recentQuotes.length === 0 ? (
                <EmptyState
                  className="m-4"
                  icon={<IconDoc />}
                  title="Nenhum orçamento ainda"
                  description="Crie a primeira proposta para começar a acompanhar suas negociações."
                  action={
                    <Button as="link" to="/crm/orcamentos/novo" size="sm">
                      Criar orçamento
                    </Button>
                  }
                />
              ) : (
                <ul className="divide-y divide-ink-100">
                  {recentQuotes.map((q) => (
                    <li key={q.id}>
                      <Link
                        to={`/crm/orcamentos/${q.id}`}
                        className="flex items-center justify-between gap-4 px-6 py-3.5 transition-colors hover:bg-ink-50"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink-900">{q.clients?.nome || 'Cliente'}</p>
                          <p className="text-xs text-ink-500">
                            {q.numero} · {formatDate(q.created_at)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold tabular-nums text-ink-900">{formatBRL(q.total)}</span>
                          <StatusBadge status={q.status} />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-ink-100 bg-white shadow-card">
              <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
                <h3 className="text-base font-bold text-ink-900">Próximos serviços</h3>
                <Link to="/crm/agenda" className="text-xs font-semibold text-brand-700 hover:text-brand-800">
                  Ver agenda
                </Link>
              </div>
              {upcoming.length === 0 ? (
                <EmptyState
                  className="m-4"
                  icon={<IconDoc />}
                  title="Agenda livre"
                  description="Nenhum serviço agendado no momento. Registre um atendimento para organizar a equipe."
                  action={
                    <Button as="link" to="/crm/agenda" size="sm">
                      Abrir agenda
                    </Button>
                  }
                />
              ) : (
                <ul className="divide-y divide-ink-100">
                  {upcoming.map((o) => (
                    <li key={o.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink-900">{o.clients?.nome || 'Cliente'}</p>
                        <p className="text-xs text-ink-500">
                          {serviceTypeLabel(o.tipo_servico)} · {formatDate(o.data_agendada)}
                          {o.horario ? ` às ${o.horario}` : ''}
                        </p>
                      </div>
                      <StatusBadge kind="order" status={o.status} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <section className="rounded-2xl border border-ink-100 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
              <h3 className="text-base font-bold text-ink-900">Solicitações recebidas pelo site</h3>
              <Link to="/crm/solicitacoes" className="text-xs font-semibold text-brand-700 hover:text-brand-800">
                Ver todas
              </Link>
            </div>
            {recentLeads.length === 0 ? (
              <EmptyState
                className="m-4"
                icon={<IconUsers />}
                title="Nenhuma solicitação pendente"
                description="Quando alguém pedir orçamento pelo site, o contato aparece aqui."
              />
            ) : (
              <ul className="divide-y divide-ink-100">
                {recentLeads.map((lead) => (
                  <li key={lead.id} className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-900">{lead.nome}</p>
                      <p className="text-xs text-ink-500">
                        {serviceTypeLabel(lead.tipo_servico)} · {formatDate(lead.created_at)}
                      </p>
                    </div>
                    <StatusBadge kind="lead" status={lead.status} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </CrmLayout>
  )
}
