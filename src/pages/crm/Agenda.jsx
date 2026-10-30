import { useCallback, useEffect, useState } from 'react'
import CrmLayout from '../../components/layout/CrmLayout'
import Button from '../../components/ui/Button'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import { Alert, Badge, EmptyState, Modal, Skeleton, StatusBadge, Toast } from '../../components/ui/Feedback'
import { IconArrow, IconCalendar } from '../../components/ui/Icons'
import {
  createOrder,
  deleteOrder,
  listClients,
  listOrders,
  listQuotes,
  updateOrder,
} from '../../lib/queries'
import { formatBRL, formatDate, serviceTypeLabel, statusOrderLabel } from '../../lib/format'

const serviceTypes = [
  { value: 'residencial', label: 'Limpeza residencial' },
  { value: 'empresarial', label: 'Limpeza empresarial e comercial' },
  { value: 'terceirizado', label: 'Terceirização de limpeza' },
  { value: 'condominio', label: 'Limpeza de condomínios' },
  { value: 'pos_obra', label: 'Limpeza pesada e pós-obra' },
  { value: 'vidros', label: 'Vidros e áreas externas' },
  { value: 'outro', label: 'Outro' },
]

const emptyForm = {
  client_id: '',
  quote_id: '',
  tipo_servico: 'empresarial',
  endereco: '',
  data_agendada: '',
  horario: '08:00',
  status: 'agendado',
  equipe: '',
  valor: '',
  observacoes: '',
}

export default function Agenda() {
  const [orders, setOrders] = useState([])
  const [clients, setClients] = useState([])
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const [ordersRes, clientsRes, quotesRes] = await Promise.all([listOrders(), listClients(), listQuotes()])
    if (ordersRes.error) {
      setError('Não foi possível carregar os registros. Tente novamente mais tarde.')
    } else {
      setError('')
      setOrders(ordersRes.data ?? [])
    }
    setClients(clientsRes.data ?? [])
    setQuotes(quotesRes.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (order) => {
    setEditing(order)
    setForm({
      client_id: order.client_id ?? '',
      quote_id: order.quote_id ?? '',
      tipo_servico: order.tipo_servico ?? 'empresarial',
      endereco: order.endereco ?? '',
      data_agendada: order.data_agendada ? String(order.data_agendada).slice(0, 10) : '',
      horario: order.horario ?? '08:00',
      status: order.status ?? 'agendado',
      equipe: order.equipe ?? '',
      valor: order.valor ?? '',
      observacoes: order.observacoes ?? '',
    })
    setModalOpen(true)
  }

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSave = async () => {
    if (!form.client_id || !form.data_agendada) {
      setToast({ tone: 'error', message: 'Informe o cliente e a data do serviço.' })
      return
    }
    setSaving(true)
    const payload = {
      client_id: form.client_id,
      quote_id: form.quote_id || null,
      tipo_servico: form.tipo_servico,
      endereco: form.endereco.trim() || null,
      data_agendada: form.data_agendada,
      horario: form.horario || null,
      status: form.status,
      equipe: form.equipe.trim() || null,
      valor: form.valor === '' ? null : Number(form.valor),
      observacoes: form.observacoes.trim() || null,
    }
    const { error: err } = editing ? await updateOrder(editing.id, payload) : await createOrder(payload)
    setSaving(false)
    if (err) {
      setToast({ tone: 'error', message: 'Não foi possível salvar o serviço.' })
      return
    }
    setModalOpen(false)
    setToast({ tone: 'success', message: editing ? 'Serviço atualizado.' : 'Serviço agendado.' })
    load()
  }

  const onDelete = async (order) => {
    if (!window.confirm('Remover este serviço da agenda?')) return
    const { error: err } = await deleteOrder(order.id)
    if (err) {
      setToast({ tone: 'error', message: 'Não foi possível remover o serviço.' })
      return
    }
    setToast({ tone: 'success', message: 'Serviço removido.' })
    load()
  }

  const filtered = orders.filter((o) => filter === 'todos' || o.status === filter)

  return (
    <CrmLayout
      title="Agenda de serviços"
      subtitle="Ordens de serviço e execução da equipe"
      actions={
        <Button size="sm" onClick={openNew}>
          Agendar serviço
          <IconArrow className="h-4 w-4" />
        </Button>
      }
    >
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { value: 'todos', label: 'Todos' },
          { value: 'agendado', label: 'Agendados' },
          { value: 'em_andamento', label: 'Em andamento' },
          { value: 'concluido', label: 'Concluídos' },
          { value: 'cancelado', label: 'Cancelados' },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setFilter(opt.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === opt.value
                ? 'bg-brand-700 text-white'
                : 'border border-ink-200 bg-white text-ink-600 hover:border-brand-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[88px]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<IconCalendar />}
          title={filter === 'todos' ? 'Nenhum serviço agendado' : 'Nenhum serviço neste status'}
          description="Organize a rotina da equipe agendando o próximo atendimento."
          action={
            <Button onClick={openNew}>
              Agendar serviço
              <IconArrow className="h-4 w-4" />
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <article
              key={order.id}
              className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-50 text-brand-800">
                  <span className="text-[10px] font-semibold uppercase">
                    {new Date(`${order.data_agendada}T12:00:00`).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                  </span>
                  <span className="text-lg font-extrabold leading-none">
                    {new Date(`${order.data_agendada}T12:00:00`).getDate()}
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-ink-900">{order.clients?.nome || 'Cliente'}</h3>
                    <Badge tone="brand">{serviceTypeLabel(order.tipo_servico)}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-ink-500">
                    {formatDate(order.data_agendada)}
                    {order.horario ? ` às ${order.horario}` : ''} · {order.equipe || 'Equipe a definir'}
                  </p>
                  {order.endereco && <p className="text-xs text-ink-400">{order.endereco}</p>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums text-ink-900">
                    {order.valor != null ? formatBRL(order.valor) : '—'}
                  </p>
                  <StatusBadge kind="order" status={order.status} label={statusOrderLabel(order.status)} />
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => openEdit(order)}>
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:bg-rose-500/10 hover:text-rose-600"
                    onClick={() => onDelete(order)}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar serviço' : 'Agendar serviço'}
        size="md"
        footer={
          <div className="flex justify-end gap-2.5">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={onSave} loading={saving}>
              {editing ? 'Salvar alterações' : 'Agendar'}
            </Button>
          </div>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Cliente" required className="sm:col-span-2">
            <Select value={form.client_id} onChange={(e) => setField('client_id', e.target.value)}>
              <option value="">Selecione…</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tipo de serviço">
            <Select value={form.tipo_servico} onChange={(e) => setField('tipo_servico', e.target.value)}>
              {serviceTypes.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setField('status', e.target.value)}>
              <option value="agendado">Agendado</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </Select>
          </Field>
          <Field label="Data" required>
            <Input type="date" value={form.data_agendada} onChange={(e) => setField('data_agendada', e.target.value)} />
          </Field>
          <Field label="Horário">
            <Input type="time" value={form.horario} onChange={(e) => setField('horario', e.target.value)} />
          </Field>
          <Field label="Equipe responsável">
            <Input value={form.equipe} onChange={(e) => setField('equipe', e.target.value)} placeholder="Ex.: Equipe A" />
          </Field>
          <Field label="Valor do serviço">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.valor}
              onChange={(e) => setField('valor', e.target.value)}
              placeholder="0,00"
            />
          </Field>
          <Field label="Endereço" className="sm:col-span-2">
            <Input value={form.endereco} onChange={(e) => setField('endereco', e.target.value)} placeholder="Local da execução" />
          </Field>
          <Field label="Orçamento vinculado" className="sm:col-span-2">
            <Select value={form.quote_id} onChange={(e) => setField('quote_id', e.target.value)}>
              <option value="">Sem vínculo</option>
              {quotes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.numero} — {q.clients?.nome || 'Cliente'}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Observações" className="sm:col-span-2">
            <Textarea
              rows={3}
              value={form.observacoes}
              onChange={(e) => setField('observacoes', e.target.value)}
              placeholder="Instruções especiais, materiais, acessos…"
            />
          </Field>
        </div>
      </Modal>

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </CrmLayout>
  )
}
