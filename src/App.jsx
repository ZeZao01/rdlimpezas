import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import SiteLayout from './components/layout/SiteLayout'
import Home from './pages/site/Home'
import Servicos from './pages/site/Servicos'
import Sobre from './pages/site/Sobre'
import OrcamentoPublico from './pages/site/Orcamento'
import Contato from './pages/site/Contato'
import Login from './pages/crm/Login'
import Dashboard from './pages/crm/Dashboard'
import Clientes from './pages/crm/Clientes'
import Orcamentos from './pages/crm/Orcamentos'
import OrcamentoForm from './pages/crm/OrcamentoForm'
import OrcamentoDetalhe from './pages/crm/OrcamentoDetalhe'
import Agenda from './pages/crm/Agenda'
import Solicitacoes from './pages/crm/Solicitacoes'
import NotFound from './pages/NotFound'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-50">
        <div className="flex items-center gap-2.5 text-ink-500">
          <svg className="h-5 w-5 animate-spin text-brand-600" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" />
            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="text-sm font-medium">Carregando…</span>
        </div>
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function SitePage({ children }) {
  return <SiteLayout>{children}</SiteLayout>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SitePage><Home /></SitePage>} />
          <Route path="/servicos" element={<SitePage><Servicos /></SitePage>} />
          <Route path="/sobre" element={<SitePage><Sobre /></SitePage>} />
          <Route path="/orcamento" element={<SitePage><OrcamentoPublico /></SitePage>} />
          <Route path="/contato" element={<SitePage><Contato /></SitePage>} />

          <Route path="/login" element={<Login />} />

          <Route path="/crm" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/crm/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
          <Route path="/crm/orcamentos" element={<ProtectedRoute><Orcamentos /></ProtectedRoute>} />
          <Route path="/crm/orcamentos/novo" element={<ProtectedRoute><OrcamentoForm /></ProtectedRoute>} />
          <Route path="/crm/orcamentos/:id" element={<ProtectedRoute><OrcamentoDetalhe /></ProtectedRoute>} />
          <Route path="/crm/orcamentos/:id/editar" element={<ProtectedRoute><OrcamentoForm /></ProtectedRoute>} />
          <Route path="/crm/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
          <Route path="/crm/solicitacoes" element={<ProtectedRoute><Solicitacoes /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
