import { useCallback, useEffect, useState } from 'react'
import CrmLayout from '../../components/layout/CrmLayout'
import Button from '../../components/ui/Button'
import { Select } from '../../components/ui/Field'
import { Alert, Badge, EmptyState, Skeleton, StatusBadge, Toast } from '../../components/ui/Feedback'
import { IconUsers } from '../../components/ui/Icons'
import { createClient, listLeads, updateLead } from '../../lib/queries'
import { formatDate, serviceTypeLabel, statusLeadLabel } from '../../lib/format'

const tipoMap = {
  residencial: 'residencial',
  empresarial: 'empresarial',
  condominio: 'condominio',
  pos_obra: 'outro',
  vidros: 'outro',
  terceirizado: 'empresarial',
  outro: 'outro',
}

export default function Solicitacoes() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error: err } = await listLeads()
    if (err) {
      setError('Não foi possível carregar os registros. Tente novamente mais tarde.')
    } else {
      setError('')
      setLeads(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const onStatusChange = async (lead, status) => {
    setBusyId(lead.id)
    const { error: err } = await updateLead(lead.id, { status })
    setBusyId(null)
    if (err) {
      setToast({ tone: 'error', message: 'Não foi possível atualizar a solicitação.' })
      return
    }
    setToast({ tone: 'success', message: 'Solicitação atualizada.' })
    load()
  }

  const onConvert = async (lead) => {
    setBusyId(lead.id)
    const { error: err } = await createClient({
      nome: lead.nome,
      tipo: tipoMap[lead.tipo_cliente] || 'outro',
      email: lead.email,
      telefone: lead.telefone,
      cidade: lead.cidade,
      observacoes: `Convertido da solicitação do site (${serviceTypeLabel(lead.tipo_servico)}): ${lead.mensagem ?? ''}`,
    })
    if (!err) await updateLead(lead.id, { status: 'convertido' })
    setBusyId(null)
    if (err) {
      setToast({ tone: 'error', message: 'Não foi possível converter o contato.' })
      return
    }
    setToast({ tone: 'success', message: 'Contato convertido em cliente!' })
    load()
  }

  return (
    <CrmLayout title="Solicitações do site" subtitle="Pedidos de orçamento e contatos recebidos">
      {error && (
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <EmptyState
          icon={<IconUsers />}
          title="Nenhuma solicitação recebida"
          description="Quando alguém pedir orçamento pelo site, os contatos aparecem aqui para você acompanhar."
          action={
            <Button as="link" to="/" variant="secondary">
              Ver site
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <article key={lead.id} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-bold text-ink-900">{lead.nome}</h2>
                    <Badge tone="brand">{serviceTypeLabel(lead.tipo_servico)}</Badge>
                    <StatusBadge kind="lead" status={lead.status} label={statusLeadLabel(lead.status)} />
                  </div>
                  <p className="mt-1 text-sm text-ink-500">
                    {lead.telefone || 'Sem telefone'} · {lead.email || 'Sem e-mail'}
                    {lead.cidade ? ` · ${lead.cidade}` : ''} · {formatDate(lead.created_at)}
                  </p>
                  <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-600">{lead.mensagem}</p>
                </div>
                <div className="flex flex-col items-stretch gap-2 sm:min-w-[190px]">
                  <Select
                    value={lead.status}
                    onChange={(e) => onStatusChange(lead, e.target.value)}
                    disabled={busyId === lead.id}
                  >
                    <option value="novo">Novo</option>
                    <option value="em_contato">Em contato</option>
                    <option value="convertido">Convertido</option>
                    <option value="perdido">Perdido</option>
                  </Select>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onConvert(lead)}
                    loading={busyId === lead.id && lead.status !== 'convertido'}
                    disabled={lead.status === 'convertido'}
                  >
                    {lead.status === 'convertido' ? 'Já convertido' : 'Virar cliente'}
                  </Button>
                  {lead.telefone && (
                    <Button as="a" href={`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`} variant="mint" size="sm">
                      WhatsApp
                    </Button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </CrmLayout>
  )
}
