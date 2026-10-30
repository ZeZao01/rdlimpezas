import { useState } from 'react'
import Button from '../../components/ui/Button'
import { Field, Input, Textarea } from '../../components/ui/Field'
import { Alert, Toast } from '../../components/ui/Feedback'
import { IconArrow, IconClock, IconInstagram, IconPin, IconPhone, IconWhatsApp } from '../../components/ui/Icons'
import { createLead } from '../../lib/queries'
import { formatPhone } from '../../lib/format'
import { useReveal } from '../../hooks/useReveal'

const contactChannels = [
  {
    icon: IconWhatsApp,
    title: 'Comercial / WhatsApp',
    description: 'Orçamentos, visitas técnicas e agendamentos.',
    value: '(48) 99109-7803',
    href: 'https://wa.me/5548991097803',
    tone: 'mint',
  },
  {
    icon: IconPhone,
    title: 'Financeiro',
    description: 'Faturas, contratos e assuntos administrativos.',
    value: '(48) 9921-9434',
    href: 'tel:+554899219434',
    tone: 'brand',
  },
  {
    icon: IconInstagram,
    title: 'Instagram',
    description: 'Acompanhe nossos trabalhos e novidades.',
    value: '@rdlimpezas_',
    href: 'https://instagram.com/rdlimpezas_',
    tone: 'brand',
  },
  {
    icon: IconPin,
    title: 'Região atendida',
    description: 'Tubarão e cidades vizinhas, com equipe própria.',
    value: 'Tubarão — SC',
    href: null,
    tone: 'ink',
  },
]

export default function Contato() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', mensagem: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [serverError, setServerError] = useState('')
  useReveal([])

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setServerError('')
    const next = {}
    if (!form.nome.trim() || form.nome.trim().length < 3) next.nome = 'Informe seu nome.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Informe um e-mail válido.'
    if (!form.mensagem.trim() || form.mensagem.trim().length < 10) next.mensagem = 'Escreva uma mensagem com mais detalhes.'
    setErrors(next)
    if (Object.keys(next).length) return

    setSubmitting(true)
    const { error } = await createLead({
      nome: form.nome.trim(),
      email: form.email.trim(),
      telefone: form.telefone || null,
      tipo_cliente: 'outro',
      tipo_servico: 'outro',
      mensagem: form.mensagem.trim(),
      origem: 'site_contato',
      status: 'novo',
    })
    setSubmitting(false)

    if (error) {
      setServerError('Não foi possível enviar sua mensagem. Tente novamente mais tarde.')
      setToast({ tone: 'error', message: 'Não foi possível enviar sua mensagem.' })
      return
    }

    setToast({ tone: 'success', message: 'Mensagem enviada! Retornaremos em breve.' })
    setForm({ nome: '', email: '', telefone: '', mensagem: '' })
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-brand-50/70 to-white">
        <div className="pointer-events-none absolute inset-0 grid-noise opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Contato</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
            Fale com a RD Limpezas
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-600">
            Estamos prontos para atender empresas, construtoras, imobiliárias, condomínios e residências com
            atendimento personalizado e total transparência.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div className="space-y-5">
            <div className="grid gap-5">
              {contactChannels.map((channel) => {
                const content = (
                  <div className="flex items-start gap-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft">
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                        channel.tone === 'mint'
                          ? 'bg-mint-400/15 text-mint-600'
                          : channel.tone === 'brand'
                            ? 'bg-brand-50 text-brand-700'
                            : 'bg-ink-100 text-ink-600'
                      }`}
                    >
                      <channel.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-base font-bold text-ink-900">{channel.title}</p>
                      <p className="mt-0.5 text-sm text-ink-500">{channel.description}</p>
                      <p className="mt-2 text-sm font-semibold text-brand-700">{channel.value}</p>
                    </div>
                  </div>
                )
                return channel.href ? (
                  <a key={channel.title} href={channel.href} target={channel.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {content}
                  </a>
                ) : (
                  <div key={channel.title}>{content}</div>
                )
              })}
            </div>

            <div className="rounded-3xl bg-ink-950 p-7 text-white">
              <div className="flex items-center gap-2.5">
                <IconClock className="h-5 w-5 text-brand-300" />
                <h2 className="text-lg font-bold">Horário de atendimento</h2>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-ink-300">
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span>Segunda a sexta</span>
                  <span className="font-semibold text-white">8h às 18h</span>
                </li>
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span>Sábado</span>
                  <span className="font-semibold text-white">8h às 12h</span>
                </li>
                <li className="flex justify-between">
                  <span>Domingos e feriados</span>
                  <span className="font-semibold text-ink-400">Emergências via WhatsApp</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-[2rem] border border-ink-100 bg-white p-7 shadow-card sm:p-10">
            <h2 className="text-2xl font-bold tracking-tight text-ink-900">Envie uma mensagem</h2>
            <p className="mt-1.5 text-sm text-ink-500">
              Preencha o formulário e nossa equipe retorna em até 24 horas úteis.
            </p>

            {serverError && (
              <Alert type="error" className="mt-5">
                {serverError}
              </Alert>
            )}

            <form onSubmit={onSubmit} noValidate className="mt-7 space-y-5">
              <Field label="Nome completo" required error={errors.nome}>
                <Input value={form.nome} onChange={(e) => setField('nome', e.target.value)} placeholder="Seu nome" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="E-mail" required error={errors.email}>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="voce@email.com"
                  />
                </Field>
                <Field label="Telefone">
                  <Input
                    value={form.telefone}
                    onChange={(e) => setField('telefone', formatPhone(e.target.value))}
                    placeholder="(48) 99999-9999"
                  />
                </Field>
              </div>
              <Field label="Mensagem" required error={errors.mensagem}>
                <Textarea
                  rows={6}
                  value={form.mensagem}
                  onChange={(e) => setField('mensagem', e.target.value)}
                  placeholder="Como podemos ajudar?"
                />
              </Field>
              <Button type="submit" size="lg" loading={submitting}>
                Enviar mensagem
                <IconArrow className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </>
  )
}
