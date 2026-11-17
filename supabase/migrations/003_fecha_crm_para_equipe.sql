-- 003: o CRM passa a ser só da equipe da RD.
--
-- Problema (auditoria HolyNex de 17/11/2026): as regras antigas liberavam TODOS os dados
-- (clientes, orçamentos, ordens de serviço, solicitações) para qualquer usuário logado,
-- e o cadastro aberto do Supabase está ligado. Qualquer pessoa podia criar uma conta com a
-- chave pública do site e ler ou apagar os dados dos clientes. A regra profiles_insert_own
-- ainda deixava essa pessoa se cadastrar como 'admin'.
--
-- ANTES DE RODAR:
--   1. No painel do Supabase: Authentication > Users. Confira se todos os usuários listados
--      são da equipe da RD. Apague quem não for. Esta migração dá acesso a todos os que existirem.
--   2. No painel: Authentication > Sign In / Providers > Email: desligue "Allow new users to sign up".
--   3. Rode este arquivo no SQL Editor.
-- Depois disso, novos membros da equipe são convidados pelo painel (Invite user) e ganham
-- uma linha em public.profiles criada por um admin.

begin;

-- 1. Quem já existe hoje vira equipe (cria o perfil que faltava).
insert into public.profiles (id, nome, papel)
select u.id, coalesce(u.raw_user_meta_data->>'nome', split_part(u.email, '@', 1)), 'operador'
from auth.users u
on conflict (id) do nothing;

-- 2. "É da equipe" = tem perfil. Função com security definer para não depender da RLS de profiles.
create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid());
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.papel = 'admin');
$$;

revoke all on function public.is_staff() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;

-- 3. Perfis: ninguém cria o próprio perfil nem troca o próprio papel.
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_select_own" on public.profiles;

create policy "profiles_select_staff" on public.profiles
  for select to authenticated using (public.is_staff());
create policy "profiles_admin_manage" on public.profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- 4. Dados do CRM: só equipe.
drop policy if exists "clients_all_auth" on public.clients;
drop policy if exists "quotes_all_auth" on public.quotes;
drop policy if exists "quote_items_all_auth" on public.quote_items;
drop policy if exists "orders_all_auth" on public.service_orders;
drop policy if exists "leads_select_auth" on public.leads;
drop policy if exists "leads_update_auth" on public.leads;
drop policy if exists "leads_delete_auth" on public.leads;

create policy "clients_staff" on public.clients
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "quotes_staff" on public.quotes
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "quote_items_staff" on public.quote_items
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "orders_staff" on public.service_orders
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "leads_select_staff" on public.leads
  for select to authenticated using (public.is_staff());
create policy "leads_update_staff" on public.leads
  for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "leads_delete_staff" on public.leads
  for delete to authenticated using (public.is_staff());

-- O formulário do site continua igual: insert público em leads e a função submit_lead.

commit;
