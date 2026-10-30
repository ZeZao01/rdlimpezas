import { supabase, isSupabaseConfigured } from './supabase'

function notConfigured() {
  const err = new Error('Não foi possível carregar os registros. Tente novamente mais tarde.')
  err.code = 'not_configured'
  return Promise.resolve({ data: null, error: err })
}

function guard() {
  if (!isSupabaseConfigured || !supabase) return notConfigured()
  return null
}

/* ------------------------------- Leads ------------------------------- */

export async function createLead(payload) {
  if (!isSupabaseConfigured || !supabase) {
    return { data: null, error: { message: 'Não foi possível enviar sua solicitação. Tente novamente mais tarde.' } }
  }
  const { data, error } = await supabase.rpc('submit_lead', { p_lead: payload })
  return { data, error }
}

export async function listLeads() {
  const blocked = guard()
  if (blocked) return blocked
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function updateLead(id, patch) {
  const blocked = guard()
  if (blocked) return blocked
  const { data, error } = await supabase.from('leads').update(patch).eq('id', id).select().single()
  return { data, error }
}

/* ------------------------------ Clientes ----------------------------- */

export async function listClients(search = '') {
  const blocked = guard()
  if (blocked) return blocked
  let query = supabase.from('clients').select('*').order('nome', { ascending: true })
  if (search) {
    query = query.or(`nome.ilike.%${search}%,email.ilike.%${search}%,documento.ilike.%${search}%,telefone.ilike.%${search}%`)
  }
  const { data, error } = await query
  return { data, error }
}

export async function createClient(payload) {
  const blocked = guard()
  if (blocked) return blocked
  const { data, error } = await supabase.from('clients').insert(payload).select().single()
  return { data, error }
}

export async function updateClient(id, patch) {
  const blocked = guard()
  if (blocked) return blocked
  const { data, error } = await supabase.from('clients').update(patch).eq('id', id).select().single()
  return { data, error }
}

export async function deleteClient(id) {
  const blocked = guard()
  if (blocked) return blocked
  const { error } = await supabase.from('clients').delete().eq('id', id)
  return { data: null, error }
}

/* ----------------------------- Orçamentos ---------------------------- */

export async function listQuotes() {
  const blocked = guard()
  if (blocked) return blocked
  const { data, error } = await supabase
    .from('quotes')
    .select('*, clients(id, nome, telefone, cidade), quote_items(*)')
    .order('created_at', { ascending: false })
  return { data, error }
}

export async function getQuote(id) {
  const blocked = guard()
  if (blocked) return blocked
  const { data, error } = await supabase
    .from('quotes')
    .select('*, clients(id, nome, telefone, cidade, email, documento, endereco), quote_items(*)')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function createQuote({ quote, items }) {
  const blocked = guard()
  if (blocked) return blocked
  const { data: created, error } = await supabase.from('quotes').insert(quote).select().single()
  if (error) return { data: null, error }
  if (items?.length) {
    const rows = items.map((item) => ({ ...item, quote_id: created.id }))
    const { error: itemsError } = await supabase.from('quote_items').insert(rows)
    if (itemsError) return { data: null, error: itemsError }
  }
  return getQuote(created.id)
}

export async function updateQuote(id, patch) {
  const blocked = guard()
  if (blocked) return blocked
  const { error } = await supabase.from('quotes').update(patch).eq('id', id)
  if (error) return { data: null, error }
  return getQuote(id)
}

export async function replaceQuoteItems(quoteId, items) {
  const blocked = guard()
  if (blocked) return blocked
  const { error: delError } = await supabase.from('quote_items').delete().eq('quote_id', quoteId)
  if (delError) return { data: null, error: delError }
  if (items?.length) {
    const rows = items.map((item) => ({ ...item, quote_id: quoteId }))
    const { error } = await supabase.from('quote_items').insert(rows)
    if (error) return { data: null, error }
  }
  return { data: true, error: null }
}

export async function deleteQuote(id) {
  const blocked = guard()
  if (blocked) return blocked
  const { error } = await supabase.from('quotes').delete().eq('id', id)
  return { data: null, error }
}

export async function nextQuoteNumber() {
  const blocked = guard()
  if (blocked) return { data: null, error: blocked.error }
  const year = new Date().getFullYear()
  const { data, error } = await supabase
    .from('quotes')
    .select('numero')
    .like('numero', `ORC-${year}-%`)
    .order('numero', { ascending: false })
    .limit(1)
  if (error) return { data: null, error }
  const last = data?.[0]?.numero
  const seq = last ? Number(last.split('-')[2]) + 1 : 1
  return { data: `ORC-${year}-${String(seq).padStart(4, '0')}`, error: null }
}

/* --------------------------- Ordens de serviço ----------------------- */

export async function listOrders() {
  const blocked = guard()
  if (blocked) return blocked
  const { data, error } = await supabase
    .from('service_orders')
    .select('*, clients(id, nome, telefone, cidade), quotes(id, numero)')
    .order('data_agendada', { ascending: true })
  return { data, error }
}

export async function createOrder(payload) {
  const blocked = guard()
  if (blocked) return blocked
  const { data, error } = await supabase.from('service_orders').insert(payload).select('*, clients(id, nome), quotes(id, numero)').single()
  return { data, error }
}

export async function updateOrder(id, patch) {
  const blocked = guard()
  if (blocked) return blocked
  const { data, error } = await supabase
    .from('service_orders')
    .update(patch)
    .eq('id', id)
    .select('*, clients(id, nome), quotes(id, numero)')
    .single()
  return { data, error }
}

export async function deleteOrder(id) {
  const blocked = guard()
  if (blocked) return blocked
  const { error } = await supabase.from('service_orders').delete().eq('id', id)
  return { data: null, error }
}

/* ------------------------------ Dashboard ---------------------------- */

export async function getDashboardSummary() {
  const blocked = guard()
  if (blocked) return blocked

  const [clients, quotes, orders, leads] = await Promise.all([
    supabase.from('clients').select('id, created_at'),
    supabase.from('quotes').select('id, status, total, created_at, valor_aprovado:total'),
    supabase.from('service_orders').select('id, status, data_agendada, valor'),
    supabase.from('leads').select('id, status, created_at'),
  ])

  if (clients.error || quotes.error || orders.error || leads.error) {
    return { data: null, error: clients.error || quotes.error || orders.error || leads.error }
  }

  return {
    data: {
      clients: clients.data ?? [],
      quotes: quotes.data ?? [],
      orders: orders.data ?? [],
      leads: leads.data ?? [],
    },
    error: null,
  }
}
