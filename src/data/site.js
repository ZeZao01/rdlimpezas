import { asset } from '../lib/asset'

export const services = [
  {
    slug: 'limpeza-residencial',
    title: 'Limpeza residencial',
    short: 'Casas e apartamentos impecáveis, com rotina flexível ou faxina completa.',
    description:
      'Cuidamos da sua casa com o mesmo cuidado que você teria. Trabalhamos com limpeza pesada, rotina semanal ou quinzenal, organização de ambientes e cuidados especiais com áreas molhadas, cozinhas e dormitórios.',
    items: ['Faxina completa', 'Limpeza de rotina', 'Organização de ambientes', 'Pós-mudança'],
    image: asset('/images/servico-condominio.jpg'),
    icon: 'home',
  },
  {
    slug: 'limpeza-empresarial',
    title: 'Limpeza empresarial',
    short: 'Escritórios, lojas, clínicas e indústrias com equipe fixa ou sob demanda.',
    description:
      'Ambientes profissionais limpos elevam a produtividade e a imagem da sua marca. Atuamos com equipes treinadas, produtos profissionais e horários flexíveis, incluindo períodos noturnos e fins de semana.',
    items: ['Escritórios e lojas', 'Clínicas e consultórios', 'Áreas comuns corporativas', 'Equipe fixa ou avulsa'],
    image: asset('/images/servico-empresarial.jpg'),
    icon: 'building',
  },
  {
    slug: 'pos-obra',
    title: 'Limpeza pós-obra',
    short: 'Remoção total de resíduos, poeira fina e marcas de construção.',
    description:
      'A entrega de uma obra exige acabamento impecável. Nossa equipe remove poeira de construção, respingos de tinta, resíduos de argamassa e protege revestimentos sensíveis para a entrega final ao cliente.',
    items: ['Remoção de poeira fina', 'Limpeza de revestimentos', 'Vidros e esquadrias', 'Entrega final'],
    image: asset('/images/servico-pos-obra.jpg'),
    icon: 'brush',
  },
  {
    slug: 'condominios',
    title: 'Limpeza de condomínios',
    short: 'Áreas comuns, halls, elevadores, garagens e lazer sempre bem cuidados.',
    description:
      'Síndicos e administradoras confiam na RD para a conservação diária das áreas comuns. Trabalhamos com planos mensais, equipe identificada e relatórios de execução para transparência total.',
    items: ['Halls e corredores', 'Elevadores e escadas', 'Garagens e depósitos', 'Áreas de lazer'],
    image: asset('/images/servico-condominio.jpg'),
    icon: 'building',
  },
  {
    slug: 'fachadas',
    title: 'Limpeza de fachadas',
    short: 'Higienização externa com equipamento profissional e total segurança.',
    description:
      'Fachadas limpas valorizam o imóvel e a marca. Utilizamos equipamentos de alta pressão, produtos específicos para cada revestimento e técnicas seguras para vidros, granito, acrílico e alvenaria.',
    items: ['Vidros e esquadrias', 'Granito e porcelanato', 'Acrílico e ACM', 'Lavagem de alta pressão'],
    image: asset('/images/servico-fachada.jpg'),
    icon: 'sparkle',
  },
  {
    slug: 'estofados',
    title: 'Higienização de estofados',
    short: 'Sofás, poltronas, colchões e cadeiras renovados com extração profunda.',
    description:
      'Renovamos estofados com injeção-extração profissional, removendo sujeira, ácaros e odores. Ideal para residências, escritórios, hotéis, restaurantes e ambientes com alto fluxo.',
    items: ['Sofás e poltronas', 'Colchões', 'Cadeiras e banquetas', 'Carpetes e tapetes'],
    image: asset('/images/servico-empresarial.jpg'),
    icon: 'brush',
  },
  {
    slug: 'caixas-dagua',
    title: "Limpeza de caixas d'água",
    short: 'Higienização técnica com laudo e conformidade sanitária.',
    description:
      'Realizamos a limpeza e desinfecção de caixas d’água residenciais e prediais seguindo as normas da Vigilância Sanitária, com emissão de laudo de execução para o condomínio ou empresa.',
    items: ['Limpeza mecânica', 'Desinfecção', 'Lavagem das paredes', 'Laudo de execução'],
    image: asset('/images/servico-pos-obra.jpg'),
    icon: 'shield',
  },
  {
    slug: 'conservacao',
    title: 'Conservação de ambientes',
    short: 'Manutenção contínua para manter o padrão alto todos os dias.',
    description:
      'Programas de conservação sob medida para empresas, condomínios e indústrias. Definimos frequência, checklist de execução e equipe responsável para manter o ambiente sempre no padrão.',
    items: ['Planos mensais', 'Checklist de execução', 'Equipe dedicada', 'Relatórios periódicos'],
    image: asset('/images/servico-empresarial.jpg'),
    icon: 'clock',
  },
  {
    slug: 'terceirizados',
    title: 'Serviços terceirizados',
    short: 'Profissionais preparados para atuar dentro da sua operação.',
    description:
      'Terceirize a sua limpeza com segurança: recrutamos, treinamos e supervisionamos a equipe, assumindo a gestão completa do serviço com substituição garantida e cumprimento de escala.',
    items: ['Equipe treinada', 'Gestão de escala', 'Uniformização', 'Supervisão contínua'],
    image: asset('/images/servico-fachada.jpg'),
    icon: 'users',
  },
  {
    slug: 'cobertura-folgas',
    title: 'Cobertura de folgas e atestados',
    short: 'Substituição imediata para não parar a sua operação.',
    description:
      'Quando o seu colaborador falta, a RD entra em campo. Cobrimos folgas, férias, atestados e licenças com profissionais preparados, mantendo o padrão de limpeza do seu contrato sem interrupções.',
    items: ['Substituição imediata', 'Sem burocracia', 'Mesmo padrão de qualidade', 'Atendimento de urgência'],
    image: asset('/images/hero-equipe-limpeza.jpg'),
    icon: 'truck',
  },
]

export const differentials = [
  {
    title: 'Equipe preparada e uniformizada',
    description:
      'Profissionais treinados, identificados e supervisionados. Trabalhamos com seleção rigorosa e treinamento contínuo de técnicas e segurança.',
  },
  {
    title: 'Qualidade comprovada',
    description:
      'Checklists de execução, inspeções de qualidade e feedback aberto. Se algo não ficou no padrão, voltamos e resolvemos.',
  },
  {
    title: 'Confiança e responsabilidade',
    description:
      'Empresa com 4 anos de atuação em Tubarão e região, com clientes recorrentes em condomínios, empresas e construtoras.',
  },
  {
    title: 'Nota fiscal e formalização',
    description:
      'Emissão de nota fiscal para todos os serviços, com contratos, planilhas de orçamento e total transparência.',
  },
  {
    title: 'Atendimento personalizado',
    description:
      'Cada cliente tem uma necessidade diferente. Montamos planos sob medida para rotina, frequência, horários e tipo de serviço.',
  },
  {
    title: 'Cobertura de folgas e atestados',
    description:
      'Garantimos a substituição de colaboradores para que a sua operação nunca pare por falta de equipe.',
  },
]

export const process = [
  {
    step: '01',
    title: 'Contato e diagnóstico',
    description: 'Você nos conta o que precisa. Conversamos por WhatsApp, telefone ou visita técnica gratuita.',
  },
  {
    step: '02',
    title: 'Orçamento personalizado',
    description: 'Montamos uma proposta clara com escopo, frequência, prazo e valor — sem surpresas.',
  },
  {
    step: '03',
    title: 'Execução com padrão',
    description: 'Nossa equipe executa o serviço com checklist, produtos profissionais e supervisão.',
  },
  {
    step: '04',
    title: 'Inspeção e garantia',
    description: 'Fazemos a vistoria final com você. Se precisar de ajuste, retornamos sem custo adicional.',
  },
]

export const testimonials = [
  {
    name: 'Condomínio Residencial Jardim',
    role: 'Síndica profissional — Tubarão',
    text: 'A RD assumiu as áreas comuns do nosso condomínio e a diferença foi imediata. Equipe pontual, organizada e muito atenciosa com os moradores.',
  },
  {
    name: 'Construtora Vale Sul',
    role: 'Coordenadora de entregas',
    text: 'Trabalhamos com a RD em todas as entregas de pós-obra. O acabamento é impecável e eles cumprem o prazo mesmo em obras grandes.',
  },
  {
    name: 'Clínica Bem Estar',
    role: 'Administradora',
    text: 'Precisávamos de limpeza diária com padrão de higienização clínica. A RD montou o plano, treinou a equipe e hoje temos total tranquilidade.',
  },
]

export const faq = [
  {
    q: 'Quais tipos de limpeza a RD Limpezas executa?',
    a: 'Atuamos com todos os tipos de limpeza: residencial, empresarial, pós-obra, condomínios, limpezas pesadas, fachadas, estofados, caixas d’água, conservação de ambientes, limpeza interna e externa, além de serviços terceirizados e cobertura de folgas e atestados.',
  },
  {
    q: 'Vocês emitem nota fiscal?',
    a: 'Sim. Emitimos nota fiscal para todos os serviços, o que facilita a formalização para empresas, construtoras, imobiliárias e condomínios.',
  },
  {
    q: 'Quais regiões vocês atendem?',
    a: 'Atendemos Tubarão e toda a região, com equipe própria para deslocamento. Para outras localidades, consulte disponibilidade pelo WhatsApp.',
  },
  {
    q: 'Como funciona o orçamento?',
    a: 'O orçamento é gratuito e personalizado. Você pode solicitar pelo site, WhatsApp ou telefone. Em até 24 horas úteis retornamos com a proposta detalhada.',
  },
  {
    q: 'Vocês atendem com urgência ou cobertura de atestados?',
    a: 'Sim. Temos equipe de prontidão para cobertura de folgas, férias e atestados, mantendo o padrão do serviço sem interromper a sua rotina.',
  },
  {
    q: 'Posso contratar apenas um serviço avulso?',
    a: 'Claro. Trabalhamos com serviços pontuais (como faxina ou pós-obra) e também com planos mensais de conservação e limpeza recorrente.',
  },
]
