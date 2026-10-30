import { asset } from '../lib/asset'

export const services = [
  {
    slug: 'limpeza-residencial',
    title: 'Limpeza residencial',
    short: 'Deixe seu lar ainda mais especial.',
    description:
      'Cuidamos da sua casa com rotina flexível ou faxina completa, para você ter mais tempo para o que realmente importa. Trabalhamos com limpeza pesada, organização de ambientes e cuidados especiais com cozinhas, áreas molhadas e dormitórios.',
    items: ['Faxina completa', 'Limpeza de rotina', 'Organização de ambientes', 'Pós-mudança'],
    image: asset('/images/servico-condominio.jpg'),
    icon: 'home',
  },
  {
    slug: 'limpeza-empresarial',
    title: 'Limpeza empresarial e comercial',
    short: 'Ambientes limpos para mais produtividade.',
    description:
      'Ambientes profissionais limpos elevam a produtividade e a imagem da sua marca. Atendemos empresas, escritórios, clínicas e lojas com equipes treinadas, produtos profissionais e horários flexíveis.',
    items: ['Empresas e escritórios', 'Clínicas e consultórios', 'Lojas e estabelecimentos', 'Equipe fixa ou avulsa'],
    image: asset('/images/servico-empresarial.jpg'),
    icon: 'building',
  },
  {
    slug: 'terceirizacao',
    title: 'Terceirização de limpeza',
    short: 'Sua empresa cuida do negócio. A RD cuida do ambiente.',
    description:
      'Terceirize a sua limpeza com segurança: avaliamos o ambiente, definimos a rotina, organizamos a equipe e acompanhamos a execução. Reduza a carga operacional e ganhe flexibilidade com um parceiro de confiança.',
    items: ['Avaliamos o ambiente', 'Definimos a rotina', 'Organizamos a equipe', 'Acompanhamos'],
    image: asset('/images/hero-equipe-limpeza.jpg'),
    icon: 'users',
  },
  {
    slug: 'condominios',
    title: 'Limpeza de condomínios',
    short: 'Áreas comuns sempre bem cuidadas.',
    description:
      'Síndicos e administradoras confiam na RD para a conservação diária das áreas comuns. Trabalhamos com planos mensais, equipe identificada e relatórios de execução para transparência total.',
    items: ['Halls e corredores', 'Elevadores e escadas', 'Garagens e depósitos', 'Áreas de lazer'],
    image: asset('/images/servico-condominio.jpg'),
    icon: 'building',
  },
  {
    slug: 'pesada-pos-obra',
    title: 'Limpeza pesada e pós-obra',
    short: 'Do acabamento à entrega final.',
    description:
      'A entrega de uma obra exige acabamento impecável. Nossa equipe remove poeira de construção, respingos de tinta e resíduos de argamassa, protege revestimentos sensíveis e deixa o espaço pronto para uso.',
    items: ['Remoção de poeira fina', 'Limpeza de revestimentos', 'Limpeza pesada', 'Entrega final'],
    image: asset('/images/servico-pos-obra.jpg'),
    icon: 'brush',
  },
  {
    slug: 'vidros-areas-externas',
    title: 'Limpeza de vidros e áreas externas',
    short: 'Mais brilho e segurança para seu espaço.',
    description:
      'Vidros, esquadrias e fachadas limpas valorizam o imóvel e a marca. Utilizamos equipamentos de alta pressão, produtos específicos para cada revestimento e técnicas seguras para cada altura.',
    items: ['Vidros e esquadrias', 'Fachadas', 'Áreas externas', 'Lavagem de alta pressão'],
    image: asset('/images/servico-fachada.jpg'),
    icon: 'sparkle',
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
    title: 'Pontualidade',
    description:
      'Chegamos na hora combinada e cumprimos a rotina acordada. Respeito pelo seu tempo e pelo seu ambiente faz parte do nosso padrão.',
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
    a: 'Atuamos com limpeza residencial, empresarial e comercial, terceirização de limpeza, condomínios, limpeza pesada e pós-obra e limpeza de vidros e áreas externas.',
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
    q: 'Vocês atendem empresas, clínicas e construtoras?',
    a: 'Sim. Atendemos empresas, escritórios, clínicas, lojas, condomínios e construtoras, inclusive com terceirização de limpeza: avaliamos o ambiente, definimos a rotina, organizamos a equipe e acompanhamos a execução.',
  },
  {
    q: 'Posso contratar apenas um serviço avulso?',
    a: 'Claro. Trabalhamos com serviços pontuais (como faxina ou pós-obra) e também com planos mensais de conservação e limpeza recorrente.',
  },
]
