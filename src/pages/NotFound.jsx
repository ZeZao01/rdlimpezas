import Button from '../components/ui/Button'
import { IconArrow } from '../components/ui/Icons'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-50 px-4 text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Erro 404</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
        Página não encontrada
      </h1>
      <p className="mt-4 max-w-md text-lg text-ink-500">
        O endereço que você acessou não existe ou foi movido. Que tal voltar para o início?
      </p>
      <Button as="link" to="/" size="lg" className="mt-8">
        Voltar para o início
        <IconArrow className="h-5 w-5" />
      </Button>
    </div>
  )
}
