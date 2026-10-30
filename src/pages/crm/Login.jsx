import { useEffect, useState } from 'react'
import { asset, srcsetFor } from '../../lib/asset'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'
import { Alert } from '../../components/ui/Feedback'
import { IconArrow, IconShield, LogoFull } from '../../components/ui/Icons'

export default function Login() {
  const { signIn, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/crm', { replace: true })
  }, [isAuthenticated, navigate])

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Informe e-mail e senha para continuar.')
      return
    }
    setLoading(true)
    const { error: signInError } = await signIn(email, password)
    setLoading(false)
    if (signInError) {
      setError('Não foi possível entrar. Verifique suas credenciais e tente novamente.')
      return
    }
    navigate('/crm')
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      <div className="relative hidden w-1/2 overflow-hidden bg-ink-950 lg:block">
        <img
          src={asset('/images/hero-equipe-limpeza.jpg')}
          srcSet={srcsetFor(asset('/images/hero-equipe-limpeza.jpg'))}
          sizes="50vw"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-ink-950 via-ink-950/80 to-brand-800/40" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <LogoFull light />
          <div>
            <h2 className="max-w-md text-4xl font-extrabold leading-tight tracking-tight text-white">
              Gestão completa da operação da RD Limpezas
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-300">
              Clientes, orçamentos, agenda e solicitações em um só lugar — com controle total da sua equipe e dos seus
              contratos.
            </p>
            <div className="mt-8 flex items-center gap-2.5 text-sm font-medium text-brand-200">
              <IconShield className="h-5 w-5" />
              Acesso restrito à equipe interna
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden">
            <LogoFull />
          </div>
          <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-ink-900 lg:mt-0">Acesso interno</h1>
          <p className="mt-2 text-sm text-ink-500">
            Entre com as credenciais da sua conta para acessar o painel de gestão.
          </p>

          {error && (
            <Alert type="error" className="mt-6">
              {error}
            </Alert>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <Field label="E-mail" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@rdlimpezas.com.br"
                autoComplete="email"
              />
            </Field>
            <Field label="Senha" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Field>
            <Button type="submit" size="lg" loading={loading} className="w-full">
              Entrar no painel
              <IconArrow className="h-5 w-5" />
            </Button>
          </form>

          <p className="mt-8 text-xs leading-relaxed text-ink-400">
            Problemas para acessar? Fale com o administrador da conta para redefinir sua senha.
          </p>
        </div>
      </div>
    </div>
  )
}
