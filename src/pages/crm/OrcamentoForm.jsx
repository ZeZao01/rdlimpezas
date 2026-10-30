import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CrmLayout from '../../components/layout/CrmLayout'
import Button from '../../components/ui/Button'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import { Alert, Spinner, Toast } from '../../components/ui/Feedback'
import { IconArrow } from '../../components/ui/Icons'
import {
  createQuote,
  getQuote,
  listClients,
  nextQuoteNumber,
  replaceQuoteItems,
  updateQuote,
} from '../../lib/queries'
import { formatBRL } from '../../lib/format'

const emptyItem = () => ({ descricao: '', quantidade: 1, unidade: 'un', valor_unitario: 0 })

export default function OrcamentoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [loading, setLoading] = useState(isEdit)
  const [clients, setClients] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)

  const [clientId, setClientId] = useState('')
  const [numero, setNumero] = useState('')
  const [titulo, setTitulo] = useState('')
  const [status, setStatus] = useState('rascunho')
  const [validade, setValidade] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [desconto, setDesconto] = useState(0)
  const [items, setItems] = useState([emptyItem()])

  useEffect(() => {
    async function init() {
      const { data: clientList, error: clientErr } = await listClients()
      if (!clientErr) setClients(clientList ?? [])

      if (isEdit) {
        const { data: quote, error: quoteErr } = await getQuote(id)
        if (quoteErr || !quote) {
          setError('Não foi possível carregar o orçamento. Tente novamente mais tarde.')
          setLoading(false)
          return
        }
        setClientId(quote.client_id ?? '')
        setNumero(quote.numero ?? '')
        setTitulo(quote.titulo ?? '')
        setStatus(quote.status ?? 'rascunho')
        setValidade(quote.validade ? String(quote.validade).slice(0, 10) : '')
        setObservacoes(quote.observacoes ?? '')
        setDesconto(Number(quote.desconto || 0))
        setItems(
          (quote.quote_items ?? []).map((item) => ({
            id: item.id,
            descricao: item.descricao ?? '',
            quantidade: Number(item.quantidade || 1),
            unidade: item.unidade || 'un',
            valor_unitario: Number(item.valor_unitario || 0),
          }))
        )
      } else {
        const { data: seq } = await nextQuoteNumber()
        if (seq) setNumero(seq)
        else setNumero(`ORC-${new Date().getFullYear()}-0001`)
      }
      setLoading(false)
    }
    init()
  }, [id, isEdit])

  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc, item) => acc + Number(item.quantidade || 0) * Number(item.valor_unitario || 0),
        0
      ),
    [items]
  )
  const total = Math.max(subtotal - Number(desconto || 0), 0)

  const setItem = (index, patch) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  const onSave = async () => {
    if (!clientId) {
      setToast({ tone: 'error', message: 'Selecione um cliente para continuar.' })
      return
    }
    const validItems = items.filter((item) => item.descricao.trim() && Number(item.quantidade) > 0)
    if (!validItems.length) {
      setToast({ tone: 'error', message: 'Adicione ao menos um item válido ao orçamento.' })
      return
    }

    setSaving(true)
    const quotePayload = {
      client_id: clientId,
      numero: numero || `ORC-${new Date().getFullYear()}-0001`,
      titulo: titulo.trim() || 'Orçamento de serviços de limpeza',
      status,
      validade: validade || null,
      desconto: Number(desconto || 0),
      subtotal,
      total,
      observacoes: observacoes.trim() || null,
    }
    const itemRows = validItems.map((item) => ({
      descricao: item.descricao.trim(),
      quantidade: Number(item.quantidade),
      unidade: item.unidade || 'un',
      valor_unitario: Number(item.valor_unitario || 0),
      total: Number(item.quantidade) * Number(item.valor_unitario || 0),
    }))

    let result
    if (isEdit) {
      await updateQuote(id, quotePayload)
      result = await replaceQuoteItems(id, itemRows)
    } else {
      result = await createQuote({ quote: quotePayload, items: itemRows })
    }
    setSaving(false)

    if (result.error) {
      setToast({ tone: 'error', message: 'Não foi possível salvar o orçamento.' })
      return
    }
    const savedId = isEdit ? id : result.data?.id
    setToast({ tone: 'success', message: 'Orçamento salvo com sucesso!' })
    navigate(savedId ? `/crm/orcamentos/${savedId}` : '/crm/orcamentos')
  }

  if (loading) {
    return (
      <CrmLayout title={isEdit ? 'Editando orçamento' : 'Novo orçamento'}>
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      </CrmLayout>
    )
  }

  return (
    <CrmLayout
      title={isEdit ? 'Editando orçamento' : 'Novo orçamento'}
      subtitle={numero}
      actions={
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/crm/orcamentos')}>
            Cancelar
          </Button>
          <Button size="sm" onClick={onSave} loading={saving}>
            Salvar orçamento
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
        <div className="space-y-6">
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-base font-bold text-ink-900">Dados do orçamento</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Cliente" required className="sm:col-span-2">
                <Select value={clientId} onChange={(e) => setClientId(e.target.value)}>
                  <option value="">Selecione um cliente…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Título">
                <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Limpeza mensal de escritório" />
              </Field>
              <Field label="Status">
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="rascunho">Rascunho</option>
                  <option value="enviado">Enviado</option>
                  <option value="aprovado">Aprovado</option>
                  <option value="recusado">Recusado</option>
                  <option value="expirado">Expirado</option>
                </Select>
              </Field>
              <Field label="Validade da proposta">
                <Input type="date" value={validade} onChange={(e) => setValidade(e.target.value)} />
              </Field>
              <Field label="Observações" className="sm:col-span-2">
                <Textarea
                  rows={3}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Condições de pagamento, prazo de execução, garantias…"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-ink-900">Itens do orçamento</h2>
              <Button variant="secondary" size="sm" onClick={() => setItems((prev) => [...prev, emptyItem()])}>
                + Adicionar item
              </Button>
            </div>

            <div className="mt-5 space-y-4">
              {items.map((item, index) => (
                <div key={index} className="rounded-2xl border border-ink-100 bg-ink-50/50 p-4">
                  <div className="grid gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-5">
                      <Field label="Descrição">
                        <Input
                          value={item.descricao}
                          onChange={(e) => setItem(index, { descricao: e.target.value })}
                          placeholder="Ex.: Limpeza de áreas comuns"
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Qtd.">
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          value={item.quantidade}
                          onChange={(e) => setItem(index, { quantidade: e.target.value })}
                        />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Unidade">
                        <Select value={item.unidade} onChange={(e) => setItem(index, { unidade: e.target.value })}>
                          <option value="un">un</option>
                          <option value="m²">m²</option>
                          <option value="h">h</option>
                          <option value="visita">visita</option>
                          <option value="mes">mês</option>
                        </Select>
                      </Field>
                    </div>
                    <div className="sm:col-span-3">
                      <Field label="Valor unitário">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.valor_unitario}
                          onChange={(e) => setItem(index, { valor_unitario: e.target.value })}
                        />
                      </Field>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-sm text-ink-500">
                      Subtotal do item:{' '}
                      <strong className="text-ink-900">
                        {formatBRL(Number(item.quantidade || 0) * Number(item.valor_unitario || 0))}
                      </strong>
                    </p>
                    {items.length > 1 && (
                      <button
                        type="button"
                        className="text-xs font-semibold text-rose-600 hover:underline"
                        onClick={() => setItems((prev) => prev.filter((_, i) => i !== index))}
                      >
                        Remover item
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-base font-bold text-ink-900">Resumo</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Subtotal</dt>
                <dd className="font-semibold tabular-nums text-ink-900">{formatBRL(subtotal)}</dd>
              </div>
              <div>
                <label className="flex items-center justify-between gap-3">
                  <span className="text-ink-500">Desconto (R$)</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={desconto}
                    onChange={(e) => setDesconto(e.target.value)}
                    className="h-9 w-28 text-right"
                  />
                </label>
              </div>
              <div className="flex justify-between border-t border-ink-100 pt-3">
                <dt className="text-base font-bold text-ink-900">Total</dt>
                <dd className="text-xl font-extrabold tabular-nums text-brand-700">{formatBRL(total)}</dd>
              </div>
            </dl>
            <Button className="mt-6 w-full" onClick={onSave} loading={saving}>
              Salvar orçamento
              <IconArrow className="h-4 w-4" />
            </Button>
            <p className="mt-3 text-xs leading-relaxed text-ink-400">
              Após salvar, você pode alterar o status, imprimir a proposta e registrar o serviço na agenda.
            </p>
          </div>
        </aside>
      </div>

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </CrmLayout>
  )
}
