import { readFileSync } from 'node:fs'

const token = readFileSync(new URL('../.sbp-pat', import.meta.url), 'utf8').trim()
const ref = 'liowxepenimzqrztubvm'

async function sql(query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  return res.text()
}

console.log('del tests:', await sql("delete from public.leads where nome in ('teste-do', 'teste-minimal', 'Teste de conexao')"))
console.log('drop whoami:', await sql('drop function if exists public.whoami()'))
console.log('rows:', await sql('select nome from public.leads limit 10'))
