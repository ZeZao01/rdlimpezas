export function formatBRL(value) {
  const n = Number(value || 0)
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(date) {
  if (!date) return '—'
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDateTime(date) {
  if (!date) return '—'
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatPhone(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) => {
        if (!a) return ''
        if (!b) return `(${a}`
        if (!c) return `(${a}) ${b}`
        return `(${a}) ${b}-${c}`
      })
  }
  return digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3')
}

export function statusQuoteLabel(status) {
  return (
    {
      rascunho: 'Rascunho',
      enviado: 'Enviado',
      aprovado: 'Aprovado',
      recusado: 'Recusado',
      expirado: 'Expirado',
    }[status] || status
  )
}

export function statusOrderLabel(status) {
  return (
    {
      agendado: 'Agendado',
      em_andamento: 'Em andamento',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
    }[status] || status
  )
}

export function statusLeadLabel(status) {
  return (
    {
      novo: 'Novo',
      em_contato: 'Em contato',
      convertido: 'Convertido',
      perdido: 'Perdido',
    }[status] || status
  )
}

export function serviceTypeLabel(type) {
  return (
    {
      residencial: 'Limpeza residencial',
      empresarial: 'Limpeza empresarial e comercial',
      terceirizado: 'Terceirização de limpeza',
      condominio: 'Limpeza de condomínios',
      pos_obra: 'Limpeza pesada e pós-obra',
      vidros: 'Vidros e áreas externas',
      outro: 'Outro',
    }[type] || type
  )
}
