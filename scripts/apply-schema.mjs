import { readFileSync } from 'node:fs'

const token = readFileSync(new URL('../.sbp-pat', import.meta.url), 'utf8').trim()
const file = process.argv[2] || '001_initial_schema.sql'
const sql = readFileSync(new URL(`../supabase/migrations/${file}`, import.meta.url), 'utf8')
const ref = 'liowxepenimzqrztubvm'

const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: sql }),
})

const text = await res.text()
console.log(res.status, text.slice(0, 500))
