import { useState } from 'react'
import { asset, srcsetFor } from '../../lib/asset'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import {
  IconArrow,
  IconBrush,
  IconBuilding,
  IconCheck,
  IconClock,
  IconHome,
  IconShield,
  IconSparkle,
  IconTruck,
  IconUsers,
  IconWhatsApp,
} from '../../components/ui/Icons'
import { differentials, faq, process, services, testimonials } from '../../data/site'
import { useReveal } from '../../hooks/useReveal'

const iconMap = {
  home: IconHome,
  building: IconBuilding,
  brush: IconBrush,
  sparkle: IconSparkle,
  shield: IconShield,
  clock: IconClock,
  users: IconUsers,
  truck: IconTruck,
}

const stats = [
  { value: '4', suffix: ' anos', label: 'de atuação em Tubarão e região' },
  { value: '100%', suffix: '', label: 'de serviços com nota fiscal' },
  { value: '6', suffix: '', label: 'especialidades em limpeza profissional' },
  { value: '24h', suffix: '', label: 'para retorno de orçamentos' },
]

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-white">
      <div className="pointer-events-none absolute inset-0 grid-noise opacity-60" />
      <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-mint-400/15 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-brand-800 shadow-sm">
            <IconSparkle className="h-3.5 w-3.5" />
            Limpeza profissional em Tubarão e região
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
            Ambientes impecáveis.
            <span className="block bg-gradient-to-r from-brand-800 via-brand-600 to-brand-400 bg-clip-text text-transparent">
              A RD cuida pra você.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-600">
            Há 4 anos oferecemos soluções completas em limpeza residencial, empresarial, pós-obra e condomínios — com
            qualidade, confiança, equipe preparada e emissão de nota fiscal.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button as="link" to="/orcamento" size="lg">
              Solicitar orçamento gratuito
              <IconArrow className="h-5 w-5" />
            </Button>
            <Button as="link" to="/servicos" variant="secondary" size="lg">
              Ver serviços
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-ink-500">
            {['Nota fiscal', 'Equipe uniformizada', 'Atendimento personalizado'].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-mint-400/20 text-mint-600">
                  <IconCheck className="h-3 w-3" />
                </span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-up [animation-delay:120ms]">
          <div className="relative overflow-hidden rounded-[2rem] shadow-soft">
            <img
              src={asset('/images/hero-equipe-limpeza.jpg')}
              srcSet={srcsetFor(asset('/images/hero-equipe-limpeza.jpg'))}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Equipe da RD Limpezas em atendimento profissional"
              className="h-[380px] w-full object-cover sm:h-[480px]"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-soft backdrop-blur sm:left-8 sm:right-auto sm:max-w-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <IconShield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink-900">Garantia de qualidade</p>
                <p className="text-xs text-ink-500">Se não ficou no padrão, voltamos sem custo.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-ink-100 bg-white p-6 shadow-card sm:grid-cols-4 sm:p-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center sm:text-left">
              <p className="text-3xl font-extrabold tracking-tight text-brand-700">
                {stat.value}
                <span className="text-brand-500">{stat.suffix}</span>
              </p>
              <p className="mt-1 text-xs font-medium leading-snug text-ink-500 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="reveal flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Nossos serviços</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl lg:text-5xl">
            Soluções completas para cada tipo de ambiente
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">
            Da casa ao condomínio, dos vidros ao pós-obra: atuamos com limpeza residencial, empresarial e comercial,
            terceirização e limpeza pesada.
          </p>
        </div>
        <Button as="link" to="/servicos" variant="secondary">
          Ver todos os serviços
          <IconArrow className="h-4 w-4" />
        </Button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 6).map((service, index) => {
          const Icon = iconMap[service.icon] || IconSparkle
          return (
            <article
              key={service.slug}
              className="reveal group relative overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={service.image}
                  srcSet={srcsetFor(service.image)}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent" />
                <div className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/95 text-brand-700 shadow-card">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-ink-900">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{service.short}</p>
                <Link
                  to="/servicos"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-colors hover:text-brand-800"
                >
                  Saiba mais
                  <IconArrow className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

function DifferentialsSection() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-20 text-white">
      <div className="pointer-events-none absolute inset-0 grid-noise opacity-50" />
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-300">Por que a RD</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Qualidade, confiança e compromisso em cada atendimento
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-300">
            Trabalhamos com qualidade, confiança, compromisso e equipe preparada para atender diferentes necessidades
            com eficiência e responsabilidade.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {differentials.map((item, index) => (
            <div
              key={item.title}
              className="reveal rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-colors duration-300 hover:border-brand-400/30 hover:bg-white/[0.08]"
              style={{ transitionDelay: `${index * 70}ms` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-400/15 text-brand-300">
                <IconCheck className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-300">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="reveal mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Como funciona</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Um processo simples, do primeiro contato à garantia
        </h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {process.map((item, index) => (
          <div
            key={item.step}
            className="reveal relative rounded-3xl border border-ink-100 bg-ink-50/60 p-7"
            style={{ transitionDelay: `${index * 80}ms` }}
          >
            <span className="text-4xl font-extrabold tracking-tight text-brand-200">{item.step}</span>
            <h3 className="mt-4 text-lg font-bold text-ink-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.description}</p>
            {index < process.length - 1 && (
              <span className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-ink-100 bg-white text-brand-500 lg:flex">
                <IconArrow className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="bg-brand-50/50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Depoimentos</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Quem confia na RD recomenda
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <figure
              key={item.name}
              className="reveal rounded-3xl border border-ink-100 bg-white p-7 shadow-card"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex gap-1 text-sun-400" aria-label="Avaliação 5 de 5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.8l-5.2 2.8 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-ink-600">“{item.text}”</blockquote>
              <figcaption className="mt-5 border-t border-ink-100 pt-4">
                <p className="text-sm font-bold text-ink-900">{item.name}</p>
                <p className="text-xs text-ink-500">{item.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function CoverageSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="reveal grid items-center gap-10 rounded-[2rem] border border-ink-100 bg-white p-8 shadow-card lg:grid-cols-2 lg:p-12">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Cobertura</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900">
            Tubarão e região, com equipe própria
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-600">
            Atendemos empresas, construtoras, imobiliárias, condomínios e residências em Tubarão e cidades vizinhas.
            Nossa equipe se desloca com estrutura própria para entregar o mesmo padrão em qualquer endereço.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              'Visita técnica sem compromisso',
              'Planos mensais para empresas e condomínios',
              'Atendimento a construtoras e imobiliárias',
              'Serviços avulsos e contratos recorrentes',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-ink-600">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-400/20 text-mint-600">
                  <IconCheck className="h-3 w-3" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Button as="link" to="/contato" variant="secondary" className="mt-8">
            Falar com a equipe
            <IconArrow className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src={asset('/images/servico-fachada.jpg')}
            srcSet={srcsetFor(asset('/images/servico-fachada.jpg'))}
            sizes="(min-width: 1024px) 50vw, 100vw"
            alt="Limpeza de fachada profissional"
            className="h-80 w-full object-cover lg:h-[420px]"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-700/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="reveal text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Dúvidas frequentes</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Tudo o que você precisa saber
        </h2>
      </div>

      <div className="mt-10 space-y-3">
        {faq.map((item, index) => {
          const isOpen = openIndex === index
          return (
            <div key={item.q} className="reveal overflow-hidden rounded-2xl border border-ink-100 bg-white">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                <span className="text-base font-bold text-ink-900">{item.q}</span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isOpen ? 'bg-brand-50 text-brand-700' : 'bg-ink-50 text-ink-400'
                  }`}
                >
                  <svg
                    className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-sm leading-relaxed text-ink-600">{item.a}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-800 via-brand-700 to-brand-500">
      <div className="pointer-events-none absolute inset-0 grid-noise opacity-30" />
      <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="reveal text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Pronto para ter um ambiente impecável?
        </h2>
        <p className="reveal mx-auto mt-5 max-w-2xl text-lg text-white/85">
          Solicite um orçamento gratuito e personalizado. Retornamos em até 24 horas úteis com a proposta ideal para o
          seu espaço.
        </p>
        <div className="reveal mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button as="link" to="/orcamento" variant="dark" size="lg">
            Quero um orçamento
            <IconArrow className="h-5 w-5" />
          </Button>
          <Button as="a" href="https://wa.me/5548991097803" variant="secondary" size="lg">
            <IconWhatsApp className="h-5 w-5 text-mint-500" />
            Chamar no WhatsApp
          </Button>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  useReveal([])
  return (
    <>
      <Hero />
      <ServicesSection />
      <DifferentialsSection />
      <ProcessSection />
      <TestimonialsSection />
      <CoverageSection />
      <FaqSection />
      <CtaSection />
    </>
  )
}
