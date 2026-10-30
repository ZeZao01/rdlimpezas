import { useState } from 'react'
import Button from '../../components/ui/Button'
import { IconArrow, IconCheck, IconWhatsApp } from '../../components/ui/Icons'
import { services } from '../../data/site'
import { srcsetFor } from '../../lib/asset'
import { useReveal } from '../../hooks/useReveal'

function PageHeader({ eyebrow, title, description }) {
  return (
    <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-brand-50/70 to-white">
      <div className="pointer-events-none absolute inset-0 grid-noise opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <p className="text-sm font-bold uppercase tracking-wider text-brand-600">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-600">{description}</p>
      </div>
    </section>
  )
}

export default function Servicos() {
  const [active, setActive] = useState(services[0].slug)
  useReveal([active])

  return (
    <>
      <PageHeader
        eyebrow="Nossos serviços"
        title="Todos os tipos de limpeza, com padrão profissional"
        description="Atuamos com limpeza residencial, empresarial e comercial, terceirização de limpeza, condomínios, limpeza pesada e pós-obra, vidros e áreas externas — para empresas, escritórios, clínicas, lojas, condomínios e construtoras em Tubarão e região."
      />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <button
              key={service.slug}
              type="button"
              onClick={() => setActive(service.slug)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                active === service.slug
                  ? 'bg-brand-700 text-white shadow-soft'
                  : 'border border-ink-200 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-800'
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>

        {services
          .filter((service) => service.slug === active)
          .map((service) => (
            <div key={service.slug} className="mt-10 grid items-center gap-10 lg:grid-cols-2">
              <div className="animate-fade-up">
                <h2 className="text-3xl font-extrabold tracking-tight text-ink-900">{service.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-ink-600">{service.description}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 rounded-2xl border border-ink-100 bg-ink-50/60 px-4 py-3 text-sm font-medium text-ink-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-mint-400/20 text-mint-600">
                        <IconCheck className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button as="link" to="/orcamento">
                    Orçar este serviço
                    <IconArrow className="h-4 w-4" />
                  </Button>
                  <Button as="a" href="https://wa.me/5548991097803" variant="secondary">
                    <IconWhatsApp className="h-4 w-4 text-mint-500" />
                    Tirar dúvida
                  </Button>
                </div>
              </div>
              <div className="animate-fade-up overflow-hidden rounded-[2rem] shadow-soft [animation-delay:100ms]">
                <img
                  src={service.image}
                  srcSet={srcsetFor(service.image)}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  alt={service.title}
                  className="h-80 w-full object-cover lg:h-[460px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-[2rem] border border-ink-100 bg-white p-8 shadow-card sm:grid-cols-3">
          {[
            {
              title: 'Para empresas',
              description: 'Escritórios, lojas, clínicas, indústrias e áreas corporativas com planos sob medida.',
            },
            {
              title: 'Para condomínios',
              description: 'Áreas comuns sempre no padrão, com equipe fixa e relatórios de execução.',
            },
            {
              title: 'Para construtoras e imobiliárias',
              description: 'Pós-obra, entrega final e conservação de imóveis prontos para locação ou venda.',
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="text-lg font-bold text-ink-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
