-- RD Limpezas — schema inicial do CRM
-- Tabelas: profiles, clients, quotes, quote_items, service_orders, leads

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text not null default 'Operador',
  papel text not null default 'operador' check (papel in ('admin', 'operador')),
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null default 'empresarial' check (tipo in ('residencial','empresarial','condominio','construtora','imobiliaria','outro')),
  documento text,
  email text,
  telefone text,
  cidade text,
  endereco text,
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  numero text not null unique,
  client_id uuid not null references public.clients (id) on delete cascade,
  titulo text not null default 'Orçamento de serviços de limpeza',
  status text not null default 'rascunho' check (status in ('rascunho','enviado','aprovado','recusado','expirado')),
  validade date,
  desconto numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  observacoes text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_items (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes (id) on delete cascade,
  descricao text not null,
  quantidade numeric(10,2) not null default 1,
  unidade text not null default 'un',
  valor_unitario numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.service_orders (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  quote_id uuid references public.quotes (id) on delete set null,
  tipo_servico text not null default 'conservacao' check (tipo_servico in ('residencial','empresarial','pos_obra','condominio','fachada','estofados','caixa_agua','pesada','conservacao','terceirizado','cobertura','outro')),
  endereco text,
  data_agendada date not null,
  horario text,
  status text not null default 'agendado' check (status in ('agendado','em_andamento','concluido','cancelado')),
  equipe text,
  valor numeric(12,2),
  observacoes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text,
  telefone text,
  cidade text,
  tipo_cliente text default 'outro',
  tipo_servico text default 'outro',
  mensagem text,
  origem text default 'site',
  status text not null default 'novo' check (status in ('novo','em_contato','convertido','perdido')),
  created_at timestamptz not null default now()
);

create index if not exists idx_quotes_client on public.quotes (client_id);
create index if not exists idx_quote_items_quote on public.quote_items (quote_id);
create index if not exists idx_orders_client on public.service_orders (client_id);
create index if not exists idx_orders_date on public.service_orders (data_agendada);
create index if not exists idx_leads_status on public.leads (status);

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.service_orders enable row level security;
alter table public.leads enable row level security;

-- profiles: cada usuário vê e edita o próprio perfil
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- clientes autenticados têm acesso total
create policy "clients_all_auth" on public.clients
  for all to authenticated using (true) with check (true);

create policy "quotes_all_auth" on public.quotes
  for all to authenticated using (true) with check (true);

create policy "quote_items_all_auth" on public.quote_items
  for all to authenticated using (true) with check (true);

create policy "orders_all_auth" on public.service_orders
  for all to authenticated using (true) with check (true);

-- leads: inserção pública (formulários do site), gestão só autenticada
create policy "leads_insert_public" on public.leads
  for insert to anon, authenticated with check (true);
create policy "leads_select_auth" on public.leads
  for select to authenticated using (true);
create policy "leads_update_auth" on public.leads
  for update to authenticated using (true) with check (true);
create policy "leads_delete_auth" on public.leads
  for delete to authenticated using (true);
