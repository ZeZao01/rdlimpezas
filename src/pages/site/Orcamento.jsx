import { useState } from 'react'
import Button from '../../components/ui/Button'
import { Field, Input, Select, Textarea } from '../../components/ui/Field'
import { Alert, Toast } from '../../components/ui/Feedback'
import { IconArrow, IconCheck, IconClock, IconDoc, IconShield } from '../../components/ui/Icons'
import { createLead } from '../../lib/queries'
import { formatPhone } from '../../lib/format'
import { useReveal } from '../../hooks/useReveal'

const serviceOptions = [
  { value: 'residencial', label: 'Limpeza residencial' },
  { value: 'empresarial', label: 'Limpeza empresarial e comercial' },
  { value: 'terceirizado', label: 'Terceirização de limpeza' },
  { value: 'condominio', label: 'Limpeza de condomínios' },
  { value: 'pos_obra', label: 'Limpeza pesada e pós-obra' },
  { value: 'vidros', label: 'Vidros e áreas externas' },
  { value: 'outro', label: 'Outro serviço' },
]

const clientTypes = [
  { value: 'residencial', label: 'Residência' },
  { value: 'empresarial', label: 'Empresa / Escritório' },
  { value: 'condominio', label: 'Condomínio' },
  { value: 'construtora', label: 'Construtora' },
  { value: 'imobiliaria', label: 'Imobiliária' },
  { value: 'outro', label: 'Outro' },
]

const benefits = [
  { icon: IconClock, title: 'Retorno em até 24h', description: 'Analisamos sua solicitação e respondemos com agilidade.' },
  { icon: IconDoc, title: 'Proposta detalhada', description: 'Escopo, frequência, prazo e valor claros, sem surpresas.' },
  { icon: IconShield, title: 'Sem compromisso', description: 'O orçamento é gratuito e você decide com calma.' },
]

const initialForm = {
  nome: '',
  email: '',
  telefone: '',
  cidade: '',
  tipo_cliente: 'residencial',
  tipo_servico: 'residencial',
  mensagem: '',
}

export default function Orcamento() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [toast, setToast] = useState(null)
  const [serverError, setServerError] = useState('')
  useReveal([])

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.nome.trim() || form.nome.trim().length < 3) next.nome = 'Informe seu nome completo.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Informe um e-mail válido.'
    if (form.telefone.replace(/\D/g, '').length < 10) next.telefone = 'Informe um telefone com DDD.'
    if (!form.mensagem.trim() || form.mensagem.trim().length < 10) next.mensagem = 'Descreva brevemente o que você precisa.'
    return next
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setServerError('')
    const nextErrors = validate()
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    setSubmitting(true)
    const { error } = await createLead({
      nome: form.nome.trim(),
      email: form.email.trim(),
      telefone: form.telefone,
      cidade: form.cidade.trim() || null,
      tipo_cliente: form.tipo_cliente,
      tipo_servico: form.tipo_servico,
      mensagem: form.mensagem.trim(),
      origem: 'site_orcamento',
      status: 'novo',
    })
    setSubmitting(false)

    if (error) {
      setServerError('Não foi possível enviar sua solicitação. Tente novamente mais tarde.')
      setToast({ tone: 'error', message: 'Não foi possível enviar sua solicitação.' })
      return
    }

    setSuccess(true)
    setToast({ tone: 'success', message: 'Solicitação enviada com sucesso!' })
    setForm(initialForm)
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-brand-50/70 to-white">
        <div className="pointer-events-none absolute inset-0 grid-noise opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Orçamento gratuito</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Solicite sua proposta personalizada
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-600">
            Preencha os dados abaixo e nossa equipe entra em contato com uma proposta sob medida para o seu ambiente.
            Atendemos empresas, construtoras, imobiliárias, condomínios e residências.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] border border-ink-100 bg-white p-7 shadow-card sm:p-10">
            {success && (
              <div className="mb-8 animate-fade-up rounded-2xl border border-mint-400/40 bg-mint-400/10 p-6">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-mint-500 text-white">
                    <IconCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-ink-900">Solicitação enviada com sucesso!</h2>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600">
                      Recebemos o seu pedido de orçamento. Nossa equipe entra em contato em até 24 horas úteis. Se
                      preferir agilizar, chame a gente no WhatsApp.
                    </p>
                    <Button
                      as="link"
                      to="/"
                      variant="secondary"
                      size="sm"
                      className="mt-4"
                    >
                      Voltar para o início
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!success && (
              <form onSubmit={onSubmit} noValidate>
                <h2 className="text-2xl font-bold tracking-tight text-ink-900">Conte um pouco sobre o serviço</h2>
                <p className="mt-1.5 text-sm text-ink-500">Campos marcados com * são obrigatórios.</p>

                {serverError && (
                  <Alert type="error" className="mt-5">
                    {serverError}
                  </Alert>
                )}

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <Field label="Nome completo" required error={errors.nome}>
                    <Input
                      value={form.nome}
                      onChange={(e) => setField('nome', e.target.value)}
                      placeholder="Como podemos te chamar?"
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="E-mail" required error={errors.email}>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      placeholder="voce@email.com"
                      autoComplete="email"
                    />
                  </Field>
                  <Field label="Telefone / WhatsApp" required error={errors.telefone}>
                    <Input
                      value={form.telefone}
                      onChange={(e) => setField('telefone', formatPhone(e.target.value))}
                      placeholder="(48) 99999-9999"
                      autoComplete="tel"
                    />
                  </Field>
                  <Field label="Cidade">
                    <Input
                      value={form.cidade}
                      onChange={(e) => setField('cidade', e.target.value)}
                      placeholder="Tubarão, SC"
                    />
                  </Field>
                  <Field label="Tipo de cliente">
                    <Select value={form.tipo_cliente} onChange={(e) => setField('tipo_cliente', e.target.value)}>
                      {clientTypes.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Serviço desejado">
                    <Select value={form.tipo_servico} onChange={(e) => setField('tipo_servico', e.target.value)}>
                      {serviceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field
                    label="Descreva o que você precisa"
                    required
                    error={errors.mensagem}
                    hint="Ex.: limpeza semanal de escritório com 200m², ou faxina completa de apartamento."
                    className="sm:col-span-2"
                  >
                    <Textarea
                      rows={5}
                      value={form.mensagem}
                      onChange={(e) => setField('mensagem', e.target.value)}
                      placeholder="Conte sobre o ambiente, frequência desejada, prazo e qualquer detalhe importante…"
                    />
                  </Field>
                </div>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Button type="submit" size="lg" loading={submitting}>
                    Enviar solicitação
                    <IconArrow className="h-5 w-5" />
                  </Button>
                  <p className="text-xs text-ink-400">Resposta em até 24 horas úteis · Sem compromisso</p>
                </div>
              </form>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] bg-ink-950 p-8 text-white">
              <h2 className="text-xl font-bold">Por que solicitar um orçamento?</h2>
              <div className="mt-6 space-y-6">
                {benefits.map((item) => (
                  <div key={item.title} className="flex gap-3.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-brand-300">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-300">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-ink-100 bg-white p-7 shadow-card">
              <h3 className="text-lg font-bold text-ink-900">Prefere falar agora?</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">
                Chame nossa equipe no WhatsApp para um atendimento imediato e visita técnica sem compromisso.
              </p>
              <Button as="a" href="https://wa.me/5548991097803" variant="mint" className="mt-5 w-full">
                Chamar no WhatsApp
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <Toast
        message={toast?.message}
        tone={toast?.tone}
        onClose={() => setToast(null)}
      />
    </>
  )
}
