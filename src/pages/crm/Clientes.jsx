import { useCallback, useEffect, useState } from 'react'
import CrmLayout from '../../components/layout/CrmLayout'
import Button from '../../components/ui/Button'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import { Alert, Badge, EmptyState, Modal, Skeleton, Spinner, Toast } from '../../components/ui/Feedback'
import { IconArrow, IconUsers } from '../../components/ui/Icons'
import { createClient, deleteClient, listClients, updateClient } from '../../lib/queries'
import { formatPhone, serviceTypeLabel } from '../../lib/format'

const tipoOptions = [
  { value: 'residencial', label: 'Residencial' },
  { value: 'empresarial', label: 'Empresarial' },
  { value: 'condominio', label: 'Condomínio' },
  { value: 'construtora', label: 'Construtora' },
  { value: 'imobiliaria', label: 'Imobiliária' },
  { value: 'outro', label: 'Outro' },
]

const tipoBadge = {
  residencial: 'ink',
  empresarial: 'brand',
  condominio: 'mint',
  construtora: 'sun',
  imobiliaria: 'brand',
  outro: 'ink',
}

const emptyForm = {
  nome: '',
  tipo: 'empresarial',
  documento: '',
  email: '',
  telefone: '',
  cidade: 'Tubarão',
  endereco: '',
  observacoes: '',
}

export default function Clientes() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const load = useCallback(async (term = '') => {
    setLoading(true)
    const { data, error: err } = await listClients(term)
    if (err) {
      setError('Não foi possível carregar os registros. Tente novamente mais tarde.')
    } else {
      setError('')
      setClients(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => load(search), 300)
    return () => clearTimeout(t)
  }, [search, load])

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setFormErrors({})
    setModalOpen(true)
  }

  const openEdit = (client) => {
    setEditing(client)
    setForm({
      nome: client.nome || '',
      tipo: client.tipo || 'empresarial',
      documento: client.documento || '',
      email: client.email || '',
      telefone: client.telefone || '',
      cidade: client.cidade || '',
      endereco: client.endereco || '',
      observacoes: client.observacoes || '',
    })
    setFormErrors({})
    setModalOpen(true)
  }

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setFormErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const onSave = async () => {
    const errors = {}
    if (!form.nome.trim() || form.nome.trim().length < 2) errors.nome = 'Informe o nome do cliente.'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'E-mail inválido.'
    setFormErrors(errors)
    if (Object.keys(errors).length) return

    setSaving(true)
    const payload = {
      nome: form.nome.trim(),
      tipo: form.tipo,
      documento: form.documento.trim() || null,
      email: form.email.trim() || null,
      telefone: form.telefone.trim() || null,
      cidade: form.cidade.trim() || null,
      endereco: form.endereco.trim() || null,
      observacoes: form.observacoes.trim() || null,
    }
    const { error: err } = editing ? await updateClient(editing.id, payload) : await createClient(payload)
    setSaving(false)

    if (err) {
      setToast({ tone: 'error', message: 'Não foi possível salvar o cliente.' })
      return
    }
    setModalOpen(false)
    setToast({ tone: 'success', message: editing ? 'Cliente atualizado.' : 'Cliente cadastrado.' })
    load(search)
  }

  const onDelete = async (client) => {
    if (!window.confirm(`Remover o cliente "${client.nome}"? Esta ação não pode ser desfeita.`)) return
    setDeleting(client.id)
    const { error: err } = await deleteClient(client.id)
    setDeleting(null)
    if (err) {
      setToast({ tone: 'error', message: 'Não foi possível remover o cliente.' })
      return
    }
    setToast({ tone: 'success', message: 'Cliente removido.' })
    load(search)
  }

  return (
    <CrmLayout
      title="Clientes"
      subtitle={`${clients.length} cliente${clients.length === 1 ? '' : 's'} na base`}
      actions={
        <Button size="sm" onClick={openNew}>
          Novo cliente
          <IconArrow className="h-4 w-4" />
        </Button>
      }
    >
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      <div className="mb-6 max-w-md">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome, e-mail, telefone ou documento…"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <EmptyState
          icon={<IconUsers />}
          title={search ? 'Nenhum cliente encontrado' : 'Sua base de clientes está vazia'}
          description={
            search
              ? 'Tente ajustar a busca ou cadastre um novo cliente.'
              : 'Cadastre o seu primeiro cliente para começar a criar orçamentos e agendar serviços.'
          }
          action={
            <Button onClick={openNew}>
              Cadastrar cliente
              <IconArrow className="h-4 w-4" />
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/70 text-xs font-semibold uppercase tracking-wider text-ink-500">
                  <th className="px-6 py-3.5">Cliente</th>
                  <th className="px-4 py-3.5">Tipo</th>
                  <th className="px-4 py-3.5">Contato</th>
                  <th className="px-4 py-3.5">Cidade</th>
                  <th className="px-6 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {clients.map((client) => (
                  <tr key={client.id} className="transition-colors hover:bg-ink-50/60">
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-ink-900">{client.nome}</p>
                      {client.documento && <p className="text-xs text-ink-400">{client.documento}</p>}
                    </td>
                    <td className="px-4 py-4">
                      <Badge tone={tipoBadge[client.tipo] || 'ink'}>{serviceTypeLabel(client.tipo)}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-ink-700">{client.telefone || '—'}</p>
                      <p className="text-xs text-ink-400">{client.email || '—'}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-ink-600">{client.cidade || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(client)}>
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-rose-600 hover:bg-rose-500/10 hover:text-rose-600"
                          onClick={() => onDelete(client)}
                          loading={deleting === client.id}
                        >
                          Remover
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar cliente' : 'Novo cliente'}
        size="md"
        footer={
          <div className="flex justify-end gap-2.5">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={onSave} loading={saving}>
              {editing ? 'Salvar alterações' : 'Cadastrar cliente'}
            </Button>
          </div>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nome / Razão social" required error={formErrors.nome} className="sm:col-span-2">
            <Input value={form.nome} onChange={(e) => setField('nome', e.target.value)} placeholder="Nome do cliente" />
          </Field>
          <Field label="Tipo de cliente">
            <Select value={form.tipo} onChange={(e) => setField('tipo', e.target.value)}>
              {tipoOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="CPF / CNPJ">
            <Input value={form.documento} onChange={(e) => setField('documento', e.target.value)} placeholder="000.000.000-00" />
          </Field>
          <Field label="Telefone" error={formErrors.telefone}>
            <Input
              value={form.telefone}
              onChange={(e) => setField('telefone', formatPhone(e.target.value))}
              placeholder="(48) 99999-9999"
            />
          </Field>
          <Field label="E-mail" error={formErrors.email}>
            <Input value={form.email} onChange={(e) => setField('email', e.target.value)} placeholder="cliente@email.com" />
          </Field>
          <Field label="Cidade">
            <Input value={form.cidade} onChange={(e) => setField('cidade', e.target.value)} placeholder="Tubarão" />
          </Field>
          <Field label="Endereço">
            <Input value={form.endereco} onChange={(e) => setField('endereco', e.target.value)} placeholder="Rua, número, bairro" />
          </Field>
          <Field label="Observações" className="sm:col-span-2">
            <Textarea
              rows={3}
              value={form.observacoes}
              onChange={(e) => setField('observacoes', e.target.value)}
              placeholder="Informações importantes sobre este cliente…"
            />
          </Field>
        </div>
      </Modal>

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </CrmLayout>
  )
}
