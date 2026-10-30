import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CrmLayout from '../../components/layout/CrmLayout'
import Button from '../../components/ui/Button'
import { Select } from '../../components/ui/Field'
import { Alert, EmptyState, Spinner, StatusBadge, Toast } from '../../components/ui/Feedback'
import { IconArrow, IconDoc, Logo } from '../../components/ui/Icons'
import { createOrder, getQuote, updateQuote } from '../../lib/queries'
import { formatBRL, formatDate, statusQuoteLabel } from '../../lib/format'

export default function OrcamentoDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quote, setQuote] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [status, setStatus] = useState('rascunho')

  useEffect(() => {
    async function load() {
      const { data, error: err } = await getQuote(id)
      if (err || !data) {
        setError('Não foi possível carregar o orçamento. Tente novamente mais tarde.')
      } else {
        setQuote(data)
        setStatus(data.status)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const onStatusChange = async (next) => {
    setStatus(next)
    setSaving(true)
    const { error: err } = await updateQuote(id, { status: next })
    setSaving(false)
    if (err) {
      setToast({ tone: 'error', message: 'Não foi possível atualizar o status.' })
      setStatus(quote.status)
      return
    }
    setQuote((prev) => ({ ...prev, status: next }))
    setToast({ tone: 'success', message: `Status atualizado para ${statusQuoteLabel(next)}.` })
  }

  const onSchedule = async () => {
    if (!quote?.client_id) return
    setSaving(true)
    const { error: err } = await createOrder({
      client_id: quote.client_id,
      quote_id: quote.id,
      tipo_servico: 'conservacao',
      endereco: quote.clients?.endereco || null,
      data_agendada: new Date().toISOString().slice(0, 10),
      horario: '08:00',
      status: 'agendado',
      valor: quote.total,
      observacoes: `Serviço referente ao orçamento ${quote.numero}`,
    })
    setSaving(false)
    if (err) {
      setToast({ tone: 'error', message: 'Não foi possível agendar o serviço.' })
      return
    }
    setToast({ tone: 'success', message: 'Serviço agendado na agenda.' })
    navigate('/crm/agenda')
  }

  if (loading) {
    return (
      <CrmLayout title="Orçamento">
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      </CrmLayout>
    )
  }

  if (error || !quote) {
    return (
      <CrmLayout title="Orçamento">
        <EmptyState
          icon={<IconDoc />}
          title="Orçamento não encontrado"
          description={error || 'Não foi possível localizar este registro.'}
          action={
            <Button as="link" to="/crm/orcamentos">
              Voltar para orçamentos
            </Button>
          }
        />
      </CrmLayout>
    )
  }

  return (
    <CrmLayout
      title={quote.numero}
      subtitle={quote.titulo || 'Proposta comercial'}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => window.print()} className="no-print">
            Imprimir
          </Button>
          <Button variant="secondary" size="sm" onClick={onSchedule} loading={saving} className="no-print">
            Gerar serviço
          </Button>
          <Button as="link" to={`/crm/orcamentos/${quote.id}/editar`} size="sm" className="no-print">
            Editar
            <IconArrow className="h-4 w-4" />
          </Button>
        </div>
      }
    >
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-ink-100 bg-white shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 p-6">
            <div className="flex items-center gap-3">
              <Logo className="h-12 w-12" />
              <div>
                <p className="text-lg font-extrabold text-ink-900">RD Limpezas</p>
                <p className="text-xs text-ink-500">A RD cuida pra você · Tubarão — SC</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-ink-900">{quote.numero}</p>
              <p className="text-xs text-ink-500">Emissão: {formatDate(quote.created_at)}</p>
              {quote.validade && <p className="text-xs text-ink-500">Válido até: {formatDate(quote.validade)}</p>}
            </div>
          </div>

          <div className="grid gap-6 border-b border-ink-100 p-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Cliente</p>
              <p className="mt-1.5 text-base font-bold text-ink-900">{quote.clients?.nome || '—'}</p>
              <p className="text-sm text-ink-500">{quote.clients?.documento || ''}</p>
              <p className="text-sm text-ink-500">{quote.clients?.telefone || ''}</p>
              <p className="text-sm text-ink-500">{quote.clients?.email || ''}</p>
              <p className="text-sm text-ink-500">{quote.clients?.endereco || quote.clients?.cidade || ''}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Condições</p>
              <p className="mt-1.5 text-sm text-ink-600">{quote.observacoes || 'Condições a combinar.'}</p>
            </div>
          </div>

          <div className="p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-ink-100 text-xs font-semibold uppercase tracking-wider text-ink-400">
                  <th className="py-2.5">Descrição</th>
                  <th className="py-2.5 text-center">Qtd.</th>
                  <th className="py-2.5 text-center">Un.</th>
                  <th className="py-2.5 text-right">Valor unit.</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {(quote.quote_items ?? []).map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 text-sm text-ink-900">{item.descricao}</td>
                    <td className="py-3 text-center text-sm tabular-nums text-ink-600">{item.quantidade}</td>
                    <td className="py-3 text-center text-sm text-ink-600">{item.unidade}</td>
                    <td className="py-3 text-right text-sm tabular-nums text-ink-600">{formatBRL(item.valor_unitario)}</td>
                    <td className="py-3 text-right text-sm font-semibold tabular-nums text-ink-900">
                      {formatBRL(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-6 flex justify-end">
              <dl className="w-full max-w-xs space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-500">Subtotal</dt>
                  <dd className="tabular-nums text-ink-900">{formatBRL(quote.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">Desconto</dt>
                  <dd className="tabular-nums text-ink-900">-{formatBRL(quote.desconto || 0)}</dd>
                </div>
                <div className="flex justify-between border-t border-ink-100 pt-2.5">
                  <dt className="text-base font-bold text-ink-900">Total</dt>
                  <dd className="text-xl font-extrabold tabular-nums text-brand-700">{formatBRL(quote.total)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-base font-bold text-ink-900">Status da proposta</h2>
            <div className="mt-4 flex items-center gap-3">
              <StatusBadge status={status} label={statusQuoteLabel(status)} />
            </div>
            <div className="mt-5">
              <Select value={status} onChange={(e) => onStatusChange(e.target.value)} disabled={saving}>
                <option value="rascunho">Rascunho</option>
                <option value="enviado">Enviado</option>
                <option value="aprovado">Aprovado</option>
                <option value="recusado">Recusado</option>
                <option value="expirado">Expirado</option>
              </Select>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-400">
              Ao aprovar, você pode gerar automaticamente um serviço na agenda e acompanhar a execução.
            </p>
          </div>

          <div className="rounded-2xl bg-ink-950 p-6 text-white">
            <h2 className="text-base font-bold">Próximos passos</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink-300">
              <li className="flex gap-2.5">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
                Envie a proposta ao cliente e acompanhe o retorno.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
                Ao aprovar, atualize o status e gere o serviço na agenda.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-300" />
                Imprima ou exporte a proposta para anexar ao contrato.
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </CrmLayout>
  )
}
