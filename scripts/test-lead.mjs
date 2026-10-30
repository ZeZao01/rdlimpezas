import { readFileSync } from 'node:fs'

const src = readFileSync(new URL('../src/lib/supabase.js', import.meta.url), 'utf8')
const url = src.match(/https:\/\/[a-z]+\.supabase\.co/)[0]
const key = src.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/)[0]

const res = await fetch(url + '/rest/v1/rpc/submit_lead', {
  method: 'POST',
  headers: {
    apikey: key,
    Authorization: 'Bearer ' + key,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    p_lead: {
      nome: 'Teste de conexao',
      email: 'teste@exemplo.com',
      mensagem: 'Validacao do formulario do site',
      origem: 'site_contato',
    },
  }),
})

const text = await res.text()
console.log('lead rpc:', res.status, text.slice(0, 300))
