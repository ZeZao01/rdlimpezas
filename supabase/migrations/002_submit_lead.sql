-- RPC pública para o formulário de orçamento/contato do site.
-- SECURITY DEFINER evita a falha de RLS no INSERT ... RETURNING do PostgREST
-- (anon não tem policy de SELECT em leads; o RETURNING era negado).
create or replace function public.submit_lead(p_lead jsonb)
returns public.leads
language sql
security definer
set search_path = public
as $$
  insert into public.leads (nome, email, telefone, cidade, tipo_cliente, tipo_servico, mensagem, origem, status)
  values (
    nullif(p_lead->>'nome', ''),
    nullif(p_lead->>'email', ''),
    nullif(p_lead->>'telefone', ''),
    nullif(p_lead->>'cidade', ''),
    coalesce(p_lead->>'tipo_cliente', 'outro'),
    coalesce(p_lead->>'tipo_servico', 'outro'),
    nullif(p_lead->>'mensagem', ''),
    coalesce(p_lead->>'origem', 'site'),
    'novo'
  )
  returning *;
$$;

grant execute on function public.submit_lead(jsonb) to anon, authenticated;
