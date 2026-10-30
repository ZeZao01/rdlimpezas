---
name: dgvibe-supabase
description: Integração com Supabase no DGVibe — autenticação, banco PostgreSQL, tabelas, Row Level Security (RLS) e client frontend. Use quando o app precisar de persistência na nuvem, login ou banco de dados.
---

# Supabase no DGVibe — Guia de Persistência e Segurança

Use esta skill sempre que o aplicativo precisar de persistência de dados, login de usuários ou storage.

## Regra de Ouro: Interface 100% Comercial (Zero Poluição Técnica)
- O aplicativo entregue é para o cliente final do usuário (ex.: usuário do cofre de senhas, cliente do e-commerce, operador do ERP).
- **NUNCA** exiba na tela elementos técnicos como "Supabase conectado", "Tabelas criadas", "Schema aplicado" ou chaves/tokens.
- Falhas de conexão ou rede devem exibir mensagens elegantes de produto (ex.: "Não foi possível sincronizar no momento. Tente novamente.").

## 1. Conexão do Client no Frontend

### Em Aplicações React + Vite (Padrão para Sistemas/SaaS)
Instale o SDK:
```bash
npm install @supabase/supabase-js
```

Crie o singleton do client em `src/lib/supabase.js` (ou `.ts`):
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Fallback resiliente: não derruba o app se o usuário ainda não conectou o Supabase
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
```

Grave as variáveis no arquivo `.env` do projeto para desenvolvimento local:
```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<sua-anon-key>
```

### Em Páginas Estáticas (HTML/JS)
Inclua a biblioteca via CDN antes dos seus scripts:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = window.ENV_SUPABASE_URL || 'https://<project-ref>.supabase.co';
  const SUPABASE_ANON_KEY = window.ENV_SUPABASE_ANON_KEY || '<anon-key>';
  const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
</script>
```

## 2. Padrões de Segurança no PostgreSQL (RLS Obrigatório)
Toda tabela criada no schema `public` **DEVE** ter Row Level Security (RLS) habilitado.

Exemplo de migração padrão:
```sql
-- Criação da tabela
CREATE TABLE IF NOT EXISTS public.itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  conteudo JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ativação estrita de RLS
ALTER TABLE public.itens ENABLE ROW LEVEL SECURITY;

-- Exemplo 1: Políticas para dados autenticados por usuário
CREATE POLICY "Usuário gerencia seus próprios itens"
  ON public.itens
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Exemplo 2: Políticas para dados públicos (ex: catálogo de produtos)
-- CREATE POLICY "Leitura pública" ON public.produtos FOR SELECT USING (true);
```

## 3. Execução Silenciosa de Migrações
Quando o contexto de integrações indicar **"Management API ATIVA via ferramentas internas"**:
- Execute o SQL com a ferramenta interna **`run_supabase_sql`** (parâmetro `query`). As credenciais ficam no servidor — você nunca vê nem precisa de token.
- RLS é ativado automaticamente em toda tabela pública criada; mesmo assim escreva as policies explicitamente.
- Se a ferramenta retornar erro, corrija o SQL e rode de novo. Nunca invente sucesso.
- **NÃO** use curl, Supabase CLI (`supabase`, `npx supabase`) nem psql para isso.
- Salve o histórico em `supabase/migrations/<timestamp>_<nome>.sql` no projeto para fins de documentação e controle de versão.
- **NÃO** imprima o schema SQL no chat. Confirme apenas com 1 frase amigável (ex.: "Tabelas e permissões de segurança estruturadas com sucesso.").

## 3.1 Edge Functions (backend serverless)
Use Edge Functions para lógica que não pode rodar no navegador: chamadas a APIs com chave secreta, geração de PDF, webhooks, envio de e-mail, operações com service role.

Estrutura (runtime Deno):
```
supabase/functions/
  _shared/cors.ts          # helpers compartilhados (enviados junto em todo deploy)
  pdf-report/index.ts      # uma pasta por função; o nome da pasta é o slug
```

`supabase/functions/_shared/cors.ts`:
```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};
```

`supabase/functions/pdf-report/index.ts`:
```typescript
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    // Client com o JWT do usuário logado: respeita RLS.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } },
    );
    const body = await req.json();
    // ... lógica da função ...
    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

Regras:
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` já existem como variáveis de ambiente dentro da função — nunca escreva chaves no código. Use a service role só quando precisar ignorar RLS de propósito.
- **Deploy**: chame a ferramenta interna **`deploy_supabase_function`** com `functionName` igual ao nome da pasta. Ela cria ou atualiza a função. `verifyJwt` fica `true` (padrão); use `false` apenas para webhooks públicos de terceiros.
- **NUNCA** use Supabase CLI, curl nem peça para o usuário fazer deploy pelo Dashboard — o deploy é automático pela ferramenta.
- Se o deploy falhar, leia a mensagem, corrija o código e tente de novo. Se o erro pedir reconexão, oriente o usuário a reconectar o Supabase em Integrações.
- Frontend:
  ```javascript
  const { data, error } = await supabase.functions.invoke('pdf-report', { body: { pedidoId } });
  ```

## 4. Regra Anti-Mock: Nunca Simule o Banco de Dados
- **Proibido criar mocks elaborados**: serviços fake (`mockService.js`), dados fictícios em `localStorage`, ou camadas offline de simulação de banco que depois precisam ser reescritas.
- **Fluxo correto desde a PRIMEIRA mensagem:**
  1. Crie o schema SQL real imediatamente em `supabase/migrations/001_initial_schema.sql` com todas as tabelas, RLS e índices que o app precisa.
  2. Estruture o client real `src/lib/supabase.js` e todas as queries/chamadas já apontando para as tabelas reais.
  3. **Se o contexto indicar "Management API ATIVA via ferramentas internas"**: execute o schema com `run_supabase_sql` (seção 3 acima) AGORA, antes de escrever a UI.
  4. **Se NÃO estão disponíveis**: deixe o código pronto — as queries rodam automaticamente quando o usuário clicar em **⚡ Conectar Supabase**. NÃO perca tempo e tokens construindo uma versão paralela em memória.
- A única "degradação graciosa" permitida: o app exibe um estado vazio elegante ("Nenhum registro ainda") enquanto a conexão não existe — nunca uma fake-lista de dados de exemplo que terá de ser apagada depois.

## 5. Resiliência: O que fazer se o Supabase AINDA NÃO estiver conectado
- **Nunca trave o preview.** Se o Supabase não estiver configurado no `.env` nem nas integrações ativas:
  - O app carrega normalmente com as telas, formulários e navegação completos, mas exibe estados vazios reais até a conexão ser feita.
  - Finalize sua resposta no chat com apenas UMA frase orientativa:
    *"Para persistir seus dados na nuvem com PostgreSQL, basta conectar o Supabase no botão **⚡ Conectar Supabase** no topo da tela."*
