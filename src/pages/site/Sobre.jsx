import Button from '../../components/ui/Button'
import { asset, srcsetFor } from '../../lib/asset'
import { IconArrow, IconCheck, IconShield, IconSparkle, IconUsers, IconWhatsApp } from '../../components/ui/Icons'
import { differentials, process } from '../../data/site'
import { useReveal } from '../../hooks/useReveal'

const values = [
  {
    icon: IconSparkle,
    title: 'Qualidade',
    description: 'Padrão de execução alto em cada detalhe, com checklists, inspeção final e garantia do serviço.',
  },
  {
    icon: IconShield,
    title: 'Confiança',
    description: 'Equipe selecionada, uniformizada e responsável. Seus ambientes e pertences tratados com respeito.',
  },
  {
    icon: IconUsers,
    title: 'Compromisso',
    description: 'Cumprimos prazos, escalas e acordos. A sua operação não pode parar — e nós garantimos isso.',
  },
]

export default function Sobre() {
  useReveal([])

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink-100 bg-gradient-to-b from-brand-50/70 to-white">
        <div className="pointer-events-none absolute inset-0 grid-noise opacity-50" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="animate-fade-up">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Sobre a RD Limpezas</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              4 anos cuidando do que é importante para você
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-600">
              A RD Limpezas atua há 4 anos em Tubarão e região oferecendo soluções completas em limpeza residencial,
              empresarial, pós-obra e condomínios. Trabalhamos com qualidade, confiança, compromisso e equipe preparada
              para atender diferentes necessidades com eficiência e responsabilidade.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">
              Atuamos com limpeza residencial, empresarial e comercial, terceirização de limpeza, condomínios, limpeza
              pesada e pós-obra, vidros e áreas externas — sempre com equipe qualificada, produtos e equipamentos
              adequados e compromisso com os prazos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as="link" to="/orcamento">
                Falar com a RD
                <IconArrow className="h-4 w-4" />
              </Button>
              <Button as="link" to="/servicos" variant="secondary">
                Conhecer os serviços
              </Button>
            </div>
          </div>
          <div className="animate-fade-up overflow-hidden rounded-[2rem] shadow-soft [animation-delay:120ms]">
            <img
              src={asset('/images/sobre-equipe.jpg')}
              srcSet={srcsetFor(asset('/images/sobre-equipe.jpg'))}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Equipe da RD Limpezas"
              className="h-96 w-full object-cover lg:h-[520px]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Nossos valores</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            O que nos move todos os dias
          </h2>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="reveal rounded-3xl border border-ink-100 bg-white p-8 shadow-card"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-ink-900">{value.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-300">Nossos diferenciais</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Por que empresas e condomínios escolhem a RD
            </h2>
          </div>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {differentials.map((item, index) => (
              <div key={item.title} className="reveal flex gap-4" style={{ transitionDelay: `${index * 60}ms` }}>
                <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-400/15 text-brand-300">
                  <IconCheck className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Nosso processo</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Compromisso do primeiro contato ao pós-serviço
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((item, index) => (
            <div
              key={item.step}
              className="reveal rounded-3xl border border-ink-100 bg-ink-50/60 p-7"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <span className="text-4xl font-extrabold tracking-tight text-brand-200">{item.step}</span>
              <h3 className="mt-4 text-lg font-bold text-ink-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="reveal flex flex-col items-center gap-6 rounded-[2rem] bg-gradient-to-br from-brand-800 to-brand-500 px-8 py-14 text-center">
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white">
            Vamos cuidar do seu ambiente juntos?
          </h2>
          <p className="max-w-xl text-white/85">
            Solicite um orçamento sem compromisso e descubra como a RD Limpezas pode elevar o padrão do seu espaço.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button as="link" to="/orcamento" variant="dark">
              Solicitar orçamento
              <IconArrow className="h-4 w-4" />
            </Button>
            <Button as="a" href="https://wa.me/5548991097803" variant="secondary">
              <IconWhatsApp className="h-4 w-4 text-mint-500" />
              WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
