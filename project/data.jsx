/* ──────────────────────────────────────────────
   data.jsx — energy configs, demo data, helpers
   ────────────────────────────────────────────── */

const ENERGY = {
  cansada:     { id: 'cansada',     label: 'Cansada',        emoji: '🌙', desc: 'Modo suave. Só o essencial.',         color: 'var(--e-cansada)',     light: true,  show_heavy: false },
  criativa:    { id: 'criativa',    label: 'Criativa',       emoji: '🌸', desc: 'Modo expansão. Criar sem limites.',   color: 'var(--e-criativa)',    light: false, show_heavy: true  },
  operacional: { id: 'operacional', label: 'Operacional',    emoji: '🪡', desc: 'Modo execução. Fazer acontecer.',     color: 'var(--e-operacional)', light: false, show_heavy: true  },
  foco:        { id: 'foco',        label: 'Foco Profundo',  emoji: '🎯', desc: 'Modo profundo. Sem distração.',        color: 'var(--e-foco)',        light: false, show_heavy: true  },
  social:      { id: 'social',      label: 'Social',         emoji: '💌', desc: 'Modo conexão. Engajar e crescer.',    color: 'var(--e-social)',      light: true,  show_heavy: false },
  maternidade: { id: 'maternidade', label: 'Maternidade',    emoji: '🎀', desc: 'Modo presença. Família primeiro.',     color: 'var(--e-maternidade)', light: true,  show_heavy: false },
  gravacao:    { id: 'gravacao',    label: 'Gravação',       emoji: '🎬', desc: 'Modo câmera. Criar em vídeo.',         color: 'var(--e-gravacao)',    light: false, show_heavy: false },
};

const ENERGY_LIST = Object.values(ENERGY);

const NAV = [
  { href: '/',             icon: 'home',     label: 'Dashboard'         },
  { href: '/captura',      icon: 'zap',      label: 'Baú de Ideias'     },
  { href: '/ideias',       icon: 'bulb',     label: 'Banco de Ideias'   },
  { href: '/tarefas',      icon: 'check',    label: 'Tarefas'           },
  { href: '/conteudo',     icon: 'doc',      label: 'Conteúdos'         },
  { href: '/prompts',      icon: 'book',     label: 'Prompts'           },
  { href: '/clientes',     icon: 'users',    label: 'Clientes'          },
  { href: '/crm',          icon: 'sparkle',  label: 'CRM Criativo'      },
  { href: '/agenda',       icon: 'calendar', label: 'Agenda'            },
  { href: '/monetizacao',  icon: 'tag',      label: 'Monetização'       },
  { href: '/financeiro',   icon: 'coin',     label: 'Financeiro'        },
  { href: '/sobre',        icon: 'flower',   label: 'Sobre'             },
  { href: '/impressos',    icon: 'print',    label: 'Impressos Úteis'   },
  { href: '/deploy',       icon: 'cog',      label: 'Como Pôr no Ar'   },
  { href: '/integracoes',  icon: 'link',     label: 'Integrações'       },
];

const CATEGORY_LABELS = {
  branding:                 'Branding',
  analise_marcas:           'Análise de Marcas',
  mulheres_incriveis:       'Mulheres Incríveis',
  livros_infantis:          'Livros Infantis',
  maternidade:              'Maternidade',
  lifestyle:                'Lifestyle',
  criatividade:             'Criatividade',
  inteligencia_artificial:  'Inteligência Artificial',
  design:                   'Design',
  marketing:                'Marketing',
  rotina:                   'Rotina',
  blogosfera:               'Blogosfera',
  bastidores:               'Bastidores Criativos',
};

const PLATFORM_LABELS = {
  instagram:  'Instagram',
  youtube:    'YouTube',
  tiktok:     'TikTok',
  blog:       'Blog',
  newsletter: 'Newsletter',
  linkedin:   'LinkedIn',
  collab:     'Collab',
  pinterest:  'Pinterest',
};

const PLATFORM_COLORS = {
  instagram:  '#E8538D',
  youtube:    '#C44878',
  tiktok:     '#2A2222',
  blog:       '#A89AC9',
  newsletter: '#E8A87C',
  linkedin:   '#5A6F9C',
  collab:     '#7FB68C',
  pinterest:  '#C44878',
};

const STATUS_IDEIA = {
  bruta:         { label: 'Bruta',         variant: 'default' },
  desenvolvendo: { label: 'Desenvolvendo', variant: 'yellow'  },
  pronta:        { label: 'Pronta',        variant: 'green'   },
  aplicada:      { label: 'Aplicada',      variant: 'pink'    },
};

const STATUS_CONTEUDO = {
  ideia:      { label: 'Ideia',      color: '#A89B97'  },
  rascunho:   { label: 'Rascunho',   color: '#E89B4C'  },
  filmando:   { label: 'Filmando',   color: '#C44878'  },
  editando:   { label: 'Editando',   color: '#A89AC9'  },
  revisao:    { label: 'Revisão',    color: '#5A6F9C'  },
  agendado:   { label: 'Agendado',   color: '#E8538D'  },
  publicado:  { label: 'Publicado',  color: '#7FB68C'  },
};

const TYPE_EMOJI = {
  reel:       '🎬',
  youtube:    '▶️',
  blog:       '✍️',
  newsletter: '💌',
  tiktok:     '🎵',
  shorts:     '⚡',
  carrossel:  '🖼',
};

/* ── Lembretes recorrentes (família) ── */
const RECURRENCES = [
  { texto: 'Tarefas escolares Mateus & Murilo', icon: '📚', hora: 'Antes das 10h30', cor: 'var(--e-maternidade)' },
  { texto: 'Brincadeira Miguel (1a10m)',         icon: '🐣', hora: 'Bloco 9h e 14h',    cor: 'var(--pink)' },
  { texto: 'Futebol Mateus & Murilo',            icon: '⚽', hora: 'Qua e Sex às 8h20',  cor: 'var(--e-operacional)' },
];

/* ── Tarefas demo ── */
const DEMO_TASKS = [
  {
    id: 't1', titulo: 'Criar roteiro do reel sobre branding feminino',
    desc: 'Reel de 60s sobre como construir uma marca com voz autoral',
    status: 'pendente', prioridade: 'alta', energia: ['criativa'],
    categoria: 'conteudo', recorrente: false,
    micro: [
      { id: 'm1', desc: 'Definir gancho principal', done: true, min: 5 },
      { id: 'm2', desc: 'Escrever script de 60s',    done: false, min: 15 },
      { id: 'm3', desc: 'Revisar e ajustar ritmo',   done: false, min: 10 },
    ],
  },
  {
    id: 't2', titulo: 'Entregar posts semana Pratique',
    status: 'em_progresso', prioridade: 'urgente', energia: ['operacional'],
    categoria: 'cliente', cliente: 'Pratique', recorrente: true,
    micro: [
      { id: 'm4', desc: 'Criar artes no Canva',              done: true,  min: 20 },
      { id: 'm5', desc: 'Escrever legendas',                 done: false, min: 15 },
      { id: 'm6', desc: 'Agendar no Meta Business Suite',    done: false, min: 10 },
    ],
  },
  {
    id: 't3', titulo: 'Escrever newsletter semanal (Carta da Lola)',
    status: 'pendente', prioridade: 'alta', energia: ['criativa', 'foco'],
    categoria: 'conteudo', recorrente: true,
    micro: [
      { id: 'm7',  desc: 'Definir tema e cena da semana',    done: false, min: 5 },
      { id: 'm8',  desc: 'Escrever rascunho com Claude',     done: false, min: 20 },
      { id: 'm9',  desc: 'Revisar e adicionar toque pessoal',done: false, min: 15 },
      { id: 'm10', desc: 'Programar envio no Substack',      done: false, min: 5 },
    ],
  },
  {
    id: 't4', titulo: 'Responder e-mails e DMs pendentes',
    status: 'pendente', prioridade: 'media',
    energia: ['operacional', 'social', 'cansada'],
    categoria: 'admin', recorrente: false, micro: [],
  },
  {
    id: 't5', titulo: 'Post para o blog Papel da Lola',
    status: 'pendente', prioridade: 'media', energia: ['criativa', 'foco'],
    categoria: 'conteudo', recorrente: false,
    micro: [
      { id: 'm11', desc: 'Escolher tema com potencial SEO',  done: false, min: 10 },
      { id: 'm12', desc: 'Estruturar o artigo',              done: false, min: 10 },
      { id: 'm13', desc: 'Escrever com apoio do Claude',     done: false, min: 30 },
      { id: 'm14', desc: 'Otimizar SEO e publicar',          done: false, min: 15 },
    ],
  },
  {
    id: 't6', titulo: 'Campanha Dia dos Namorados — Ótica Igor Giordano',
    status: 'em_progresso', prioridade: 'urgente', energia: ['operacional', 'criativa'],
    categoria: 'cliente', cliente: 'Ótica Igor Giordano', recorrente: false,
    micro: [
      { id: 'm15', desc: 'Criar 3 peças visuais no Canva',   done: true,  min: 45 },
      { id: 'm16', desc: 'Escrever legendas para cada peça', done: false, min: 20 },
      { id: 'm17', desc: 'Enviar para aprovação do Igor',    done: false, min: 5 },
      { id: 'm18', desc: 'Agendar publicação',               done: false, min: 10 },
    ],
  },
  {
    id: 't7', titulo: 'Gravar reel bastidores — rotina criativa',
    status: 'pendente', prioridade: 'alta', energia: ['gravacao', 'criativa'],
    categoria: 'conteudo', recorrente: false,
    micro: [
      { id: 'm19', desc: 'Separar roupa e montar cenário',   done: false, min: 15 },
      { id: 'm20', desc: 'Pegar tripé e testar enquadramento',done: false, min: 10 },
      { id: 'm21', desc: 'Gravar hook + desenvolvimento',    done: false, min: 20 },
      { id: 'm22', desc: 'Editar no CapCut',                 done: false, min: 30 },
      { id: 'm23', desc: 'Escrever legenda e hashtags',      done: false, min: 10 },
    ],
  },
  {
    id: 't8', titulo: 'Roteiro e edição vídeo Jornal Cidades Minerais',
    status: 'em_progresso', prioridade: 'urgente', energia: ['foco', 'operacional'],
    categoria: 'cliente', cliente: 'Jornal Cidades Minerais', recorrente: true,
    micro: [
      { id: 'm24', desc: 'Escrever roteiro da plenária',     done: true,  min: 30 },
      { id: 'm25', desc: 'Fazer entrevista (terça 14h)',      done: false, min: 60 },
      { id: 'm26', desc: 'Editar vídeo semanal',             done: false, min: 90 },
      { id: 'm27', desc: 'Enviar para aprovação do Marcos',  done: false, min: 5 },
    ],
  },
  {
    id: 't9', titulo: 'Criar carrossel sobre IA para criadoras',
    status: 'pendente', prioridade: 'media', energia: ['criativa', 'foco'],
    categoria: 'conteudo', recorrente: false,
    micro: [
      { id: 'm28', desc: 'Definir 7 ferramentas com uso real',done: false, min: 15 },
      { id: 'm29', desc: 'Criar design no Canva (8 slides)',  done: false, min: 40 },
      { id: 'm30', desc: 'Escrever legenda LinkedIn',         done: false, min: 10 },
    ],
  },
  {
    id: 't10', titulo: 'Organizar banco de hooks e CTAs',
    status: 'pendente', prioridade: 'baixa', energia: ['operacional', 'cansada'],
    categoria: 'admin', recorrente: false,
    micro: [
      { id: 'm31', desc: 'Listar hooks que mais performaram', done: false, min: 20 },
      { id: 'm32', desc: 'Categorizar por formato e nicho',   done: false, min: 15 },
      { id: 'm33', desc: 'Adicionar ao banco no sistema',     done: false, min: 10 },
    ],
  },
];

/* ── Ideias demo ── */
const DEMO_IDEAS = [
  { id: 'i1', titulo: '"Domingo é o único dia em que tenho 47 ideias criativas e zero energia pra executar."',
    desc: 'Frase perfeita pra reel de bastidores. Alta ressonância com criadoras.',
    categoria: 'bastidores', plataformas: ['instagram', 'tiktok'], status: 'pronta',
    tags: ['humor', 'relatable', 'bastidores'], conexoes: 2 },

  { id: 'i2', titulo: 'Série "Mulheres que viraram marca" — análise de posicionamento',
    desc: 'Episódio 1: Luisa Sonza. Ep. 2: Kylie Jenner. Ep. 3: Anitta.',
    categoria: 'mulheres_incriveis', plataformas: ['youtube', 'blog', 'newsletter'], status: 'desenvolvendo',
    tags: ['série', 'branding', 'mulheres'], conexoes: 1 },

  { id: 'i3', titulo: 'Por que a Duolingo domina o TikTok (e o que você pode copiar)',
    desc: 'Análise profunda da estratégia. Tom irreverente + consistência radical.',
    categoria: 'analise_marcas', plataformas: ['blog', 'youtube', 'newsletter'], status: 'bruta',
    tags: ['análise', 'tiktok', 'branding'], conexoes: 0 },

  { id: 'i4', titulo: 'Ferramentas de IA que uso todo dia (sem exagero)',
    desc: 'Claude, Canva AI, Whisper, ChatGPT. Como uso cada um na prática criativa.',
    categoria: 'inteligencia_artificial', plataformas: ['instagram', 'youtube', 'blog'], status: 'pronta',
    tags: ['IA', 'ferramentas', 'produtividade'], conexoes: 0 },

  { id: 'i5', titulo: 'Como me organizo sendo mãe, criadora e dona de agência',
    desc: 'O método real — sem glamour, sem mentira. TDAH + 3 filhos + clientes.',
    categoria: 'maternidade', plataformas: ['instagram', 'blog', 'newsletter'], status: 'desenvolvendo',
    tags: ['maternidade', 'rotina', 'autoral'], conexoes: 3 },

  { id: 'i6', titulo: 'Anatomia visual de um livro infantil que vende',
    desc: 'Capa, paleta, virada de página, tipografia. Estrutura editorial em carrossel.',
    categoria: 'livros_infantis', plataformas: ['instagram', 'pinterest'], status: 'bruta',
    tags: ['livros', 'visual', 'editorial'], conexoes: 0 },

  { id: 'i7', titulo: 'Como crescer no Pinterest sem postar todo dia',
    desc: 'Estratégia de conteúdo perene. Pinterest como motor de tráfego passivo pro blog.',
    categoria: 'marketing', plataformas: ['blog', 'pinterest', 'newsletter'], status: 'pronta',
    tags: ['pinterest', 'tráfego', 'passivo'], conexoes: 2 },

  { id: 'i8', titulo: 'LinkedIn pra criativas: como falar de criatividade em ambiente corporativo',
    desc: 'Adaptação de tom sem perder a voz. Cases reais de posicionamento híbrido.',
    categoria: 'marketing', plataformas: ['linkedin', 'blog'], status: 'bruta',
    tags: ['linkedin', 'branding', 'personal'], conexoes: 0 },

  { id: 'i9', titulo: 'O que ninguém fala sobre impulsionamento de posts',
    desc: 'Diferença entre boost e campanha. Quando vale impulsionar e quando é desperdício.',
    categoria: 'marketing', plataformas: ['instagram', 'youtube'], status: 'desenvolvendo',
    tags: ['impulsionamento', 'ads', 'marketing'], conexoes: 1 },

  { id: 'i10', titulo: 'Design pra quem não é designer — os fundamentos reais',
    desc: 'Tipografia, hierarquia visual, cor. Sem blá-blá teórico: o que usa no dia a dia.',
    categoria: 'design', plataformas: ['instagram', 'blog', 'youtube'], status: 'bruta',
    tags: ['design', 'educação', 'fundamentos'], conexoes: 0 },

  { id: 'i11', titulo: 'Produtividade neurodivergente: o que funciona pra mim (TDAH + TEA)',
    desc: 'Sistemas reais. O que testei e parei de usar. O que ficou. Sem romantizar.',
    categoria: 'criatividade', plataformas: ['blog', 'newsletter', 'youtube'], status: 'pronta',
    tags: ['TDAH', 'produtividade', 'neurodivergente'], conexoes: 4 },

  { id: 'i12', titulo: 'Storytelling pra marcas pequenas: a estrutura que sempre funciona',
    desc: 'Problema + tensão + virada + solução. Como aplicar em qualquer post.',
    categoria: 'marketing', plataformas: ['instagram', 'linkedin', 'blog'], status: 'bruta',
    tags: ['storytelling', 'branding', 'escrita'], conexoes: 0 },
];

/* ── Brands ── */
const BRANDS = {
  todos:       { label: 'Todos',               color: 'var(--ink)'       },
  lorenna:     { label: '@lorennagn',           color: 'var(--pink-deep)' },
  papel:       { label: 'Papel da Lola',        color: 'var(--pink)'      },
  otica:       { label: 'Ótica Igor Giordano',  color: '#5A6F9C'          },
  espaco:      { label: 'Espaço Criar',         color: '#E89B4C'          },
  pratique:    { label: 'Pratique',             color: '#7FB68C'          },
  jornal:      { label: 'Cidades e Minerais',   color: '#A89AC9'          },
  agencia:     { label: 'Agência Logue',        color: '#E8538D'          },
};

/* ── CRM Categories ── */
const CRM_CATEGORIES = {
  cliente_agencia: 'Clientes Agência Logue',
  marca_ugc:       'Marcas UGC',
  influencer:      'Influencers',
  freelancer:      'Freelancers',
  leitor_blog:     'Leitores do Blog',
  seguidor:        'Seguidores',
  networking:      'Networking',
};

/* ── Conteúdo demo ── */
const DEMO_CONTENT = [
  /* @lorennagn / Papel da Lola */
  { id: 'c1', titulo: 'Como organizo minha semana sendo mãe e criadora', tipo: 'blog',
    plataformas: ['blog', 'newsletter'], status: 'publicado', categoria: 'rotina',
    brand: 'papel', data: 'Há 7 dias' },
  { id: 'c2', titulo: 'Por que sua marca precisa de uma voz única', tipo: 'reel',
    plataformas: ['instagram', 'tiktok'], status: 'editando', categoria: 'branding',
    brand: 'lorenna', data: 'Em 2 dias' },
  { id: 'c3', titulo: '5 ferramentas de IA que mudaram minha produtividade', tipo: 'newsletter',
    plataformas: ['newsletter'], status: 'rascunho', categoria: 'inteligencia_artificial',
    brand: 'papel', data: 'Em 3 dias' },
  { id: 'c4', titulo: 'Análise de marca: Duolingo e o poder do caos controlado', tipo: 'youtube',
    plataformas: ['youtube', 'blog'], status: 'ideia', categoria: 'analise_marcas',
    brand: 'papel', data: '' },
  { id: 'c5', titulo: 'Mulheres Incríveis — Ep. 01: Luisa Sonza como marca', tipo: 'youtube',
    plataformas: ['youtube'], status: 'rascunho', categoria: 'mulheres_incriveis',
    brand: 'papel', data: 'Em 5 dias' },
  { id: 'c6', titulo: 'Minha rotina de criação de conteúdo (bastidores reais)', tipo: 'reel',
    plataformas: ['instagram'], status: 'agendado', categoria: 'bastidores',
    brand: 'lorenna', data: 'Em 1 dia' },
  { id: 'c7', titulo: '7 erros de branding que destroem marcas pequenas', tipo: 'carrossel',
    plataformas: ['instagram', 'linkedin'], status: 'revisao', categoria: 'branding',
    brand: 'lorenna', data: 'Em 4 dias' },
  { id: 'c8', titulo: 'Anatomia visual de "O Pequeno Príncipe"', tipo: 'carrossel',
    plataformas: ['instagram', 'pinterest'], status: 'ideia', categoria: 'livros_infantis',
    brand: 'papel', data: '' },
  { id: 'c9', titulo: 'O que é branding de verdade? (desmistificando)', tipo: 'reel',
    plataformas: ['instagram', 'tiktok'], status: 'ideia', categoria: 'branding',
    brand: 'lorenna', data: '' },
  { id: 'c10', titulo: 'Como usar o Pinterest pra crescer um blog em 2025', tipo: 'blog',
    plataformas: ['blog', 'pinterest'], status: 'rascunho', categoria: 'marketing',
    brand: 'papel', data: 'Em 6 dias' },
  { id: 'c11', titulo: 'LinkedIn pra criadoras: por onde começar sem se perder', tipo: 'carrossel',
    plataformas: ['linkedin', 'instagram'], status: 'ideia', categoria: 'marketing',
    brand: 'lorenna', data: '' },
  { id: 'c12', titulo: 'IA no dia a dia criativo: o que uso e como', tipo: 'reel',
    plataformas: ['instagram', 'tiktok'], status: 'publicado', categoria: 'inteligencia_artificial',
    brand: 'lorenna', data: 'Há 3 dias' },
  { id: 'c13', titulo: 'Como criar hooks que param o scroll (exemplos reais)', tipo: 'carrossel',
    plataformas: ['instagram'], status: 'editando', categoria: 'marketing',
    brand: 'lorenna', data: 'Em 2 dias' },
  { id: 'c14', titulo: 'Design para pequenas marcas: o básico que funciona', tipo: 'blog',
    plataformas: ['blog', 'pinterest'], status: 'rascunho', categoria: 'design',
    brand: 'papel', data: 'Em 7 dias' },

  /* Ótica Igor Giordano */
  { id: 'c20', titulo: 'Campanha Dia dos Namorados — 3 peças visuais', tipo: 'carrossel',
    plataformas: ['instagram'], status: 'em_progresso', categoria: 'marketing',
    brand: 'otica', data: 'Em 17 dias' },
  { id: 'c21', titulo: 'Reel: receita digital em 1 minuto (novidade)', tipo: 'reel',
    plataformas: ['instagram'], status: 'ideia', categoria: 'marketing',
    brand: 'otica', data: '' },
  { id: 'c22', titulo: 'Sessão de fotos Ray-Ban — produto em destaque', tipo: 'carrossel',
    plataformas: ['instagram'], status: 'pendente', categoria: 'marketing',
    brand: 'otica', data: 'Em 3 dias' },

  /* Espaço Criar */
  { id: 'c30', titulo: 'Stories da semana — rotina das crianças', tipo: 'reel',
    plataformas: ['instagram'], status: 'em_progresso', categoria: 'lifestyle',
    brand: 'espaco', data: 'Em 1 dia' },
  { id: 'c31', titulo: 'Calendário editorial de junho — Espaço Criar', tipo: 'carrossel',
    plataformas: ['instagram'], status: 'ideia', categoria: 'rotina',
    brand: 'espaco', data: 'Em 10 dias' },
  { id: 'c32', titulo: 'Anatomia de uma atividade pedagógica — carrossel', tipo: 'carrossel',
    plataformas: ['instagram'], status: 'ideia', categoria: 'design',
    brand: 'espaco', data: '' },

  /* Pratique */
  { id: 'c40', titulo: 'Post agradecimento premiação — estático', tipo: 'carrossel',
    plataformas: ['instagram'], status: 'em_progresso', categoria: 'marketing',
    brand: 'pratique', data: 'Em 2 dias' },
  { id: 'c41', titulo: 'Vídeo: unidade Esplanada (tour)', tipo: 'reel',
    plataformas: ['instagram'], status: 'ideia', categoria: 'marketing',
    brand: 'pratique', data: 'Em 5 dias' },
  { id: 'c42', titulo: 'Reel piscina + prime — lifestyle academia', tipo: 'reel',
    plataformas: ['instagram'], status: 'ideia', categoria: 'lifestyle',
    brand: 'pratique', data: '' },

  /* Jornal Cidades e Minerais */
  { id: 'c50', titulo: 'Vídeo: plenária da mineração (roteiro e edição)', tipo: 'youtube',
    plataformas: ['youtube'], status: 'em_progresso', categoria: 'blogosfera',
    brand: 'jornal', data: 'Em 3 dias' },
  { id: 'c51', titulo: 'Snippet 60s: entrevista para reels do jornal', tipo: 'reel',
    plataformas: ['instagram'], status: 'ideia', categoria: 'bastidores',
    brand: 'jornal', data: '' },
];

/* ── Clientes (Agência Logue) ── */
const DEMO_CLIENTS = [
  {
    id: 'cl1', nome: 'Pratique (Itabira Fit)', setor: 'Fitness · Academia',
    cor: 'var(--e-operacional)', receita: 1200, custo_cog: 2, alinhamento: 4, esforco: 3, satisfacao: 4, pendentes: 5,
    inicio: 'Mai 2026', contato: 'Acad. Itabira Fit', whatsapp: '(31) 98818-3496',
    cnpj: '47.239.490/0001-47',
    endereco: 'Av. Mauro Ribeiro Lage, 1010 · Esplanada da Estação · Itabira/MG',
    pacote: '6 entregas (1 estático + 5 vídeos/carrosséis) · contrato pontual',
    contrato: { valor: 1200, prazo: '30 dias úteis', ajustes: '1 rodada por peça', assinado: '11/05/2026' },
    pagamento: { dia: 11, forma: 'PIX', status_mes: 'pago', historico: [
      { mes: 'Mai/2026', status: 'pago',     valor: 1200, data: '11/05/2026' },
    ]},
    proximas: [
      'Agendar dia de captação (set de Esplanada + Gabiroba)',
      'Roteirizar vídeo Prime',
      'Aprovar referências com cliente',
    ],
    tarefas: [
      { id: 'it1', titulo: 'Post 1 — Estático: agradecimento pela premiação', status: 'em_progresso', deadline: '15/05', prioridade: 'alta' },
      { id: 'it2', titulo: 'Post 2 — Carrossel ou Vídeo: unidade Esplanada',  status: 'pendente',    deadline: '20/05', prioridade: 'media' },
      { id: 'it3', titulo: 'Post 3 — Carrossel ou Vídeo: unidade Gabiroba',   status: 'pendente',    deadline: '22/05', prioridade: 'media' },
      { id: 'it4', titulo: 'Post 4 — Vídeo: unidade Prime',                    status: 'pendente',    deadline: '27/05', prioridade: 'media' },
      { id: 'it5', titulo: 'Post 5 — Vídeo: piscina',                          status: 'pendente',    deadline: '30/05', prioridade: 'baixa' },
      { id: 'it6', titulo: 'Post 6 — Sequência: mix das três unidades',        status: 'pendente',    deadline: '03/06', prioridade: 'baixa' },
    ],
    arquivos: [
      { nome: 'Contrato Itabira Fit (assinado).pdf', tipo: 'pdf',  size: '218 KB', data: '11/05/2026' },
      { nome: 'Logo Itabira Fit (vetor).svg',         tipo: 'svg',  size: '34 KB',  data: '11/05/2026' },
      { nome: 'Briefing pré-captação.md',             tipo: 'doc',  size: '8 KB',   data: '12/05/2026' },
      { nome: 'Moodboard Esplanada.png',              tipo: 'img',  size: '1.2 MB', data: '12/05/2026' },
    ],
    insights: [
      { titulo: 'Premiação como gancho de autoridade',
        custo: 'Custo zero',
        ideia: 'Transformar o post de agradecimento em série de 3 stories com depoimentos de alunos. Custo zero, sensação de comunidade, e dá conteúdo orgânico pelas próximas 2 semanas.' },
      { titulo: 'Sequência das unidades como mini-tour',
        custo: 'Apenas tempo de edição',
        ideia: 'Fechar o pack com um reel-tour de 30s que mostra "uma manhã rodando as 3 unidades". Eleva a percepção de marca de academia local para rede.' },
      { titulo: 'Hashtag de bairro + geotag em Itabira',
        custo: 'Custo zero',
        ideia: 'Geotagar cada unidade com o bairro (Esplanada / Gabiroba / Prime) e criar #ItabiraFit + #BairroEsplanada etc. Aumenta alcance local sem ads.' },
    ],
  },

  {
    id: 'cl2', nome: 'Espaço Criar', setor: 'Educação infantil',
    cor: 'var(--e-cansada)', receita: 600, custo_cog: 1, alinhamento: 5, esforco: 2, satisfacao: 5, pendentes: 2,
    inicio: 'Jan 2026', contato: 'Mariana (sócia)', whatsapp: '(31) 9 7777-5678',
    pacote: '8 posts/mês · stories da semana · 1 reel',
    contrato: { valor: 600, prazo: 'Mensal recorrente', ajustes: '1 rodada por peça', assinado: '02/01/2026' },
    pagamento: { dia: 5, forma: 'PIX', status_mes: 'pendente', historico: [
      { mes: 'Abr/2026', status: 'pago',     valor: 600, data: '05/04/2026' },
      { mes: 'Mar/2026', status: 'pago',     valor: 600, data: '07/03/2026' },
      { mes: 'Fev/2026', status: 'pago',     valor: 600, data: '06/02/2026' },
      { mes: 'Jan/2026', status: 'pago',     valor: 600, data: '08/01/2026' },
    ]},
    proximas: [
      'Entregar calendário editorial de junho',
      'Criar stories da semana',
    ],
    tarefas: [
      { id: 'ec1', titulo: 'Stories da semana — rotina das crianças', status: 'em_progresso', deadline: '14/05', prioridade: 'media' },
      { id: 'ec2', titulo: 'Calendário editorial de junho',           status: 'pendente',    deadline: '25/05', prioridade: 'alta'  },
    ],
    arquivos: [
      { nome: 'Manual de marca Espaço Criar.pdf', tipo: 'pdf', size: '4.1 MB', data: '02/01/2026' },
      { nome: 'Fotos atividades — abril.zip',     tipo: 'zip', size: '38 MB',  data: '02/05/2026' },
    ],
    insights: [
      { titulo: 'Carrossel "anatomia de uma atividade"',
        custo: 'Custo zero',
        ideia: 'Pegar 1 atividade que fizeram e desmontar em 5 slides: objetivo pedagógico, materiais, fotos, fala da educadora, resultado. Posiciona o Espaço como referência técnica, não só fofo.' },
      { titulo: 'Newsletter mensal pros pais',
        custo: 'R$ 0 (Substack/Beehiiv free)',
        ideia: 'Carta curta no final do mês: 3 momentos da turma + 1 indicação de livro. Cria sensação de pertencimento e justifica a mensalidade.' },
    ],
  },

  {
    id: 'cl3', nome: 'Óptica Igor Giordano', setor: 'Óptica · Varejo',
    cor: 'var(--info)', receita: 1200, custo_cog: 2, alinhamento: 3, esforco: 3, satisfacao: 4, pendentes: 3,
    inicio: 'Set 2025', contato: 'Igor (proprietário)', whatsapp: '(31) 9 6666-2345',
    pacote: '12 posts/mês · stories diários · 2 reels · 1 influencer/dia',
    contrato: { valor: 1200, prazo: 'Mensal recorrente', ajustes: '1 rodada por peça', assinado: '12/09/2025' },
    pagamento: { dia: 10, forma: 'PIX', status_mes: 'pendente', historico: [
      { mes: 'Abr/2026', status: 'pago',     valor: 1200, data: '10/04/2026' },
      { mes: 'Mar/2026', status: 'pago',     valor: 1200, data: '11/03/2026' },
      { mes: 'Fev/2026', status: 'atrasado', valor: 1200, data: '18/02/2026' },
    ]},
    influencers: [
      { dia: 'segunda', nome: '', vazio: true },
      { dia: 'terça',   nome: 'Sabrina Sachez',  ig: '@sabrinasachez',  status: 'confirmada', tipo: 'Try-on de armações' },
      { dia: 'quarta',  nome: 'Waltencir',        ig: '@waltencir',      status: 'confirmada', tipo: 'Recebido + review' },
      { dia: 'quinta',  nome: 'Thais Lage',       ig: '@thaislage',      status: 'confirmada', tipo: 'Story sequência' },
      { dia: 'sexta',   nome: '', vazio: true },
      { dia: 'sábado',  nome: '', vazio: true },
    ],
    proximas: [
      'Criar campanha dia dos namorados',
      'Fotos de produto — agendar',
      'Reel de Receita digital (novidade)',
    ],
    tarefas: [
      { id: 'og1', titulo: 'Campanha Dia dos Namorados — 3 peças', status: 'em_progresso', deadline: '01/06', prioridade: 'urgente' },
      { id: 'og2', titulo: 'Sessão de fotos de produto (Ray-Ban)', status: 'pendente',    deadline: '18/05', prioridade: 'alta'    },
      { id: 'og3', titulo: 'Reel: receita digital em 1 minuto',     status: 'pendente',    deadline: '24/05', prioridade: 'media'   },
    ],
    arquivos: [
      { nome: 'Catálogo armações outono 2026.pdf', tipo: 'pdf', size: '12 MB',  data: '04/04/2026' },
      { nome: 'Logo Óptica (variações).zip',       tipo: 'zip', size: '2.4 MB', data: '12/09/2025' },
    ],
    insights: [
      { titulo: 'Trend "antes e depois" com cliente real',
        custo: 'Custo zero',
        ideia: 'Cliente entra com armação antiga, sai com a nova. Reel de 20s. Igor pode roteirizar 1 vez por semana e captação é em 5min.' },
      { titulo: 'Parceria com optometrista local',
        custo: 'Custo zero (troca de exposição)',
        ideia: 'Conteúdo educativo a 4 mãos: "como entender sua receita". Aumenta autoridade técnica da ótica e ainda gera lead pro parceiro.' },
      { titulo: 'Vitrine ao vivo no story',
        custo: 'Apenas tempo',
        ideia: 'Toda segunda 9h: 5 armações novas em story com preço. Cria expectativa semanal e gera DM direto.' },
    ],
  },

  {
    id: 'cl4', nome: 'Jornal Cidades Minerais', setor: 'Mídia · Jornalismo',
    cor: 'var(--e-foco)', receita: 1000, custo_cog: 5, alinhamento: 1, esforco: 5, satisfacao: 2, pendentes: 4,
    inicio: 'Nov 2024', contato: 'Marcos (editor-chefe)', whatsapp: '(31) 9 5555-9012',
    pacote: 'Vídeo semanal · cobertura de pauta · social',
    contrato: { valor: 1000, prazo: 'Mensal recorrente', ajustes: '1 rodada por peça', assinado: '04/11/2024' },
    pagamento: { dia: 15, forma: 'Transferência', status_mes: 'atrasado', historico: [
      { mes: 'Abr/2026', status: 'pago',     valor: 1000, data: '22/04/2026' },
      { mes: 'Mar/2026', status: 'atrasado', valor: 1000, data: '28/03/2026' },
      { mes: 'Fev/2026', status: 'pago',     valor: 1000, data: '17/02/2026' },
    ]},
    proximas: [
      'Escrever roteiro plenária mineração',
      'Gravar entrevista — terça',
      'Editar vídeo semanal',
      'Enviar para aprovação',
    ],
    tarefas: [
      { id: 'jc1', titulo: 'Roteiro: plenária da mineração',        status: 'em_progresso', deadline: '13/05', prioridade: 'urgente' },
      { id: 'jc2', titulo: 'Gravar entrevista (terça às 14h)',      status: 'pendente',    deadline: '14/05', prioridade: 'urgente' },
      { id: 'jc3', titulo: 'Editar vídeo semanal',                  status: 'pendente',    deadline: '16/05', prioridade: 'alta'    },
      { id: 'jc4', titulo: 'Aprovação Marcos — janela 48h',         status: 'pendente',    deadline: '18/05', prioridade: 'alta'    },
    ],
    arquivos: [
      { nome: 'Pauta semanal #19.docx',     tipo: 'doc', size: '120 KB', data: '08/05/2026' },
      { nome: 'Brutos entrevista plenária', tipo: 'mov', size: '2.1 GB', data: '08/05/2026' },
    ],
    insights: [
      { titulo: 'Renegociar escopo (alerta vermelho)',
        custo: 'Renegociação',
        ideia: 'Custo cognitivo 5/5 + alinhamento 1/5 + 2 atrasos em 3 meses. Esse cliente está sangrando energia. Propor: subir pra R$ 1.500 OU reduzir entregas pela metade. Sem isso vira gargalo do mês inteiro.' },
      { titulo: 'Mini-podcast em vídeo',
        custo: 'Custo zero',
        ideia: 'Aproveitar entrevistas já feitas e cortar em snippets de 60s pro Reels do jornal. Mais alcance sem nova captação.' },
    ],
  },
];

/* ── CRM demo ── */
const DEMO_CRM = [
  { id: 'crm1', nome: 'Reserva', tipo: 'marca', categoria: 'marca_ugc', status: 'potencial', plataforma: 'instagram',
    proposta: 'UGC de moda feminina — coleção inverno 2026', valor: 800, proxima: 'Enviar proposta personalizada',
    followup: 'em 2 dias', notas: 'Estética alinhada. Alta chance de fechar.' },
  { id: 'crm2', nome: 'Mari Gonzalez', tipo: 'influencer', categoria: 'influencer', status: 'em_contato', plataforma: 'instagram',
    proposta: 'Collab série "Mulheres que viraram marca"', proxima: 'Responder DM com proposta de formato',
    followup: 'amanhã', notas: '300k seguidores. Nicho comportamento e carreira.' },
  { id: 'crm3', nome: 'iFood', tipo: 'marca', categoria: 'marca_ugc', status: 'negociando', plataforma: 'instagram',
    proposta: 'UGC campanha "Mãe que pede iFood"', valor: 1500, proxima: 'Alinhar briefing criativo com o time',
    followup: '', notas: 'Contato via e-mail. Segunda reunião agendada.' },
  { id: 'crm4', nome: 'Paolla Gisele', tipo: 'collab', categoria: 'networking', status: 'fechado', plataforma: 'instagram',
    proposta: 'Collab conteúdo planejamento conjunto', valor: 600, proxima: 'Entregar conteúdo até dia 20',
    followup: '', notas: 'Collab confirmado. Conteúdo em produção.' },
  { id: 'crm5', nome: 'Granado', tipo: 'marca', categoria: 'marca_ugc', status: 'potencial', plataforma: 'instagram',
    proposta: 'UGC linha bebê — relato de mãe real', proxima: 'Escrever primeiro contato',
    followup: 'em 4 dias', notas: 'Estética nostálgica casa muito com Papel da Lola.' },
  { id: 'crm6', nome: 'Tatá Werneck', tipo: 'collab', categoria: 'influencer', status: 'em_contato', plataforma: 'instagram',
    proposta: 'Quadro "Mulheres que viraram marca"', proxima: 'Aguardar resposta — follow-up sexta',
    followup: 'em 3 dias', notas: 'Demonstrou interesse em DM. Agente pediu proposta.' },
  { id: 'crm7', nome: 'Café Santa Clara', tipo: 'marca', categoria: 'marca_ugc', status: 'potencial', plataforma: 'instagram',
    proposta: 'UGC lifestyle — rotina criativa com café', proxima: 'Montar proposta de UGC',
    followup: 'em 5 dias', notas: 'Produto que uso no dia a dia. Autenticidade garantida.' },
  { id: 'crm8', nome: 'Ana Beatriz Design', tipo: 'collab', categoria: 'freelancer', status: 'em_contato', plataforma: 'instagram',
    proposta: 'Parceria: design editorial para ebooks', proxima: 'Alinhar valores e formato',
    followup: 'em 2 dias', notas: 'Freelancer de qualidade. Pode entrar como parceira em projetos maiores.' },
  { id: 'crm9', nome: 'Leitora: Juliana Costa', tipo: 'networking', categoria: 'leitor_blog', status: 'potencial', plataforma: 'instagram',
    proposta: 'Potencial cliente de consultoria de marca pessoal', proxima: 'Continuar conversa nos comentários',
    followup: 'em 1 semana', notas: 'Empreendedora local. Segue e comenta sempre. Alta afinidade.' },
  { id: 'crm10', nome: 'Shopee Creators', tipo: 'marca', categoria: 'marca_ugc', status: 'potencial', plataforma: 'instagram',
    proposta: 'Programa de afiliados + UGC produtos casa e papelaria', proxima: 'Cadastrar no programa de criadores',
    followup: 'em 1 semana', notas: 'Bom potencial de renda passiva via link de afiliado.' },
];

/* ── Prompts — baseados nos pilares Papel da Lola ── */
const DEMO_PROMPTS = [
  { id: 'p1', titulo: 'Análise estratégica de marca — estilo Papel da Lola',
    cat: 'branding', desc: 'Disseca uma marca com olhar de diretora criativa. Output pronto pra virar carrossel ou vídeo.',
    ia: 'claude', tool: 'Claude + Perplexity (pesquisa)',
    etapas: ['Pesquisa', 'Análise', 'Insights', 'Roteiro'],
    checklist: [
      'Pesquisar a marca: site, redes, manchetes recentes',
      'Coletar 5 prints de presença digital',
      'Rodar o prompt no Claude',
      'Marcar 3 insights mais fortes pra virar conteúdo',
      'Transformar em carrossel ou roteiro de vídeo',
    ],
    texto: `Você é uma estrategista de marca brasileira com visão de diretora criativa.
Sua referência é o trabalho da Papel da Lola — análise sofística, com afeto e linguagem autônica.

Faça uma análise profunda de: [NOME DA MARCA]

Estrutura obrigatória:

1. POSICIONAMENTO REAL
   - O que essa marca diz que é?
   - O que ela mostra ser de verdade?
   - Onde os dois batem? Onde não?

2. IDENTIDADE VISUAL
   - Paleta + tipografia + texturas
   - O que essa estética fala antes da palavra?
   - Emoções que transmite

3. PRESENÇA DIGITAL
   - Tom de voz (3 adjetivos)
   - Formatos que dominam vs. abandonam
   - Consistência

4. O QUE ME ENCANTA (3 pontos específicos)

5. O QUE EU TROCARIA (3 sugestões honestas)

6. INSIGHT TRANSFERÍVEL
   - Uma coisa que qualquer marca pequena pode aplicar amanhã

Tom: inteligente, afetuosa, direta. Sem jargão.
Idioma: pt-BR.`,
  },

  { id: 'p2', titulo: 'Série "Mulheres que viraram marca" — roteiro do episódio',
    cat: 'roteiro', desc: 'Roteiro pra vídeo de 8-12min ou carrossel de 10 slides sobre uma mulher de referência.',
    ia: 'claude', tool: 'Claude + Notion (banco de mulheres)',
    etapas: ['Pesquisa', 'História', 'Análise', 'Gancho', 'Roteiro'],
    checklist: [
      'Listar 3 momentos-chave dela',
      'Encontrar a virada de chave',
      'Conectar com o público da Papel da Lola',
      'Validar a linguagem (sem clichê de empreendedorismo)',
      'Gravar ou editar em carrossel',
    ],
    texto: `Você é roteirista da série "Mulheres que viraram marca" do canal Papel da Lola.
Público: mulheres 25-40 anos, criativas, mães e não-mães, interessadas em branding com profundidade.

Mulher escolhida: [NOME]

Estrutura do episódio:

GANCHO (0-15s)
[Fato pouco contado sobre ela que para o scroll]

QUEM ELA É ANTES DE TUDO
[3 parágrafos. Não começar pela carreira.]

A VIRADA
[O momento específico em que ela deixou de ser "pessoa que faz X" e virou marca]

A ESTRATÉGIA INVISÍVEL
[O que ela faz que ninguém comenta: roupas, fala, escolha de palco, estética]

3 LIÇÕES TRANSFERÍVEIS
[Para qualquer mulher construíndo marca própria]

FECHAMENTO
[Pergunta pra comércio]

Tom: admirativa sem ser bajuladora. Crítica sem ser ranzinza.
Idioma: pt-BR. Tamanho: [carrossel 10 slides / vídeo 10min].`,
  },

  { id: 'p3', titulo: 'Newsletter semanal — Carta da Lola',
    cat: 'newsletter', desc: 'Carta semanal íntima e estratégica. Abertura alta, vibe diaristica.',
    ia: 'claude', tool: 'Claude + Beehiiv/Substack',
    etapas: ['Tema da semana', 'Abertura', 'Corpo', 'PS', 'Envio'],
    checklist: [
      'Escolher o tema (uma observação real da semana)',
      'Escrever a abertura íntima primeiro',
      'Conectar com a referência da semana (marca, livro, ideia)',
      'Revisar tom: nem motivacional, nem ranzinza',
      'Programar terapia segunda 8h',
    ],
    texto: `Você escreve a newsletter semanal "Carta da Lola" — newsletter íntima da Papel da Lola.
Público: 2.300 assinantes engajados. Abertura média histórica: 48%.

Tema da semana: [TEMA]
Uma coisa real que aconteceu comigo: [ACONTECIMENTO]
Reflexão que essa coisa abriu: [REFLEXÃO]

Estrutura obrigatória:

3 OPÇÕES DE ASSUNTO (curto, sem clickbait):
1.
2.
3.

ABERTURA ("Oi,")
[2-3 parágrafos. Começar pela cena concreta, não pela ideia.]

CORPO
[Desenvolvimento da reflexão + exemplo concreto + uma referência (marca, livro, autor, frase)]

FECHAMENTO
[Não motivacional. Pergunta aberta que abre conversa.]

PS
[Algo pessoal e inesperado: livro lendo, música, mood]

Tom: íntimo, inteligente, sem jargão de coaching.
Tamanho: 450-650 palavras.
Idioma: pt-BR.`,
  },

  { id: 'p4', titulo: 'Carrossel de análise visual de livro infantil',
    cat: 'design', desc: 'Anatomia editorial de um livro infantil: capa, tipografia, paleta, virada de página.',
    ia: 'claude', tool: 'Claude + ChatGPT (visão) + Canva',
    etapas: ['Seleção', 'Foto', 'Análise', 'Carrossel'],
    checklist: [
      'Escolher livro com identidade visual forte',
      'Fotografar páginas-chave (4-6 fotos)',
      'Rodar análise visual',
      'Estruturar carrossel de 8-10 slides',
      'Postar no @papeldalola',
    ],
    texto: `Você é designer editorial e análise livros infantis pra Papel da Lola.
Público: mães criativas, designers, professoras, ilustradoras.

Livro analisado: [TÍTULO] — [AUTOR/ILUSTRADOR]
Editora: [EDITORA]

Estrutura do carrossel (8-10 slides):

SLIDE 1 — CAPA + UMA FRASE QUE PARA O SCROLL
SLIDE 2 — POR QUE ESSE LIVRO IMPORTA
SLIDE 3 — PALETA: 3 cores que dominam + por que
SLIDE 4 — TIPOGRAFIA: fonte do título, corpo, decisões editoriais
SLIDE 5 — RITMO VISUAL: como as páginas conversam
SLIDE 6 — MOMENTO DE VIRADA: a página mais bonita
SLIDE 7 — O QUE EU APRENDO PRA DESIGN GERAL
SLIDE 8 — PRA QUEM INDICO
SLIDE 9 — ONDE COMPRAR (sem afiliado se não for)

Tom: técnico mas afetuoso. Falar de design como quem fala de família.
Idioma: pt-BR.`,
  },

  { id: 'p5', titulo: 'Pauta de Reel — Bastidores da criadora-mãe',
    cat: 'roteiro', desc: 'Reel de 45-60s sobre rotina criativa + maternidade. Sem glamour, com humor.',
    ia: 'claude', tool: 'Claude + CapCut',
    etapas: ['Cena real', 'Gancho', 'Roteiro', 'Gravação', 'Legenda'],
    checklist: [
      'Anotar a cena real do dia',
      'Validar: "isso fala com mãe criativa?"',
      'Escolher 3 opções de gancho',
      'Gravar em fundo neutro',
      'Postar entre 19h-21h',
    ],
    texto: `Você cria reels da Papel da Lola.
Público: mães criativas (25-40 anos), criadoras, donas de pequenos negócios criativos.
Tom da marca: humor inteligente, vulnerabilidade controlada, beleza no caos.

Cena real que vivi essa semana: [DESCREVER]
O que essa cena revelou: [REFLEXÃO]

Formato: reel de [45/60]s

GANCHO (0-3s) — 3 opções:
1.
2.
3.

DESENVOLVIMENTO (4-40s):
[Fala em tópicos curtos. Pode ter b-roll de mim trabalhando, dos meninos, da mesa, do livro, etc.]

VIRADA (40-50s):
[Onde o reel sai do "é difícil" pro "e mesmo assim…"]

FECHAMENTO (50-60s):
[Frase que cabe em print + CTA suave]

LEGENDA (200-300 caracteres):
[Estende o reel com uma reflexão, sem repetir o roteiro]

HASHTAGS (8-12): mix de nicho + amplas

Regras:
- Não usar "meu amor", "minha gente", "galera"
- Não terminar com pergunta clichê ("e você?")
- Não romantizar o caos`,
  },

  { id: 'p6', titulo: 'IA como copiloto criativo (não como atalho)',
    cat: 'estrategia', desc: 'Fluxo pra usar IA mantendo voz autoral. Anti-slop.',
    ia: 'claude', tool: 'Claude + Notion (banco de voz)',
    etapas: ['Voz', 'Brief', 'Co-criação', 'Refino', 'Toque final'],
    checklist: [
      'Atualizar banco de voz (textos já escritos que amo)',
      'Brief específico antes de pedir',
      'Sempre 3 versões, nunca a primeira',
      'Reescrever 30% à mão',
      'Ler em voz alta antes de publicar',
    ],
    texto: `Você é minha copiloto criativa. Não me dê texto pronto — me dê opções que eu refino.

MINHA VOZ (Papel da Lola):
- Frases curtas misturadas com algumas longas com ritmo
- Sem jargão corporativo ("mindset", "empoderar", "hack", "jornada")
- Sem clichê de criador ("meu amor", "galera", "minha gente")
- Vulnerabilidade controlada — abre mas não derrama
- Humor seco — nunca exclamativo demais
- Referências culturais reais (livros, filmes, marcas específicas)
- Metáforas de papelaria, doméstico, infantil quando couber

O QUE PRECISO AGORA:
[descrever peça]

FORMATO:
[reel/post/blog/newsletter/legenda]

ME ENTREGUE:
1. Três versões bem diferentes entre si
2. Para cada uma, marque o que é "meu" e o que você inventou
3. Liste 3 frases-chiclete que deveríamos remover (clichê ou IA-óbvio)
4. Sugira 1 referência cultural que pode entrar

NÃO FAÇA:
- Emoji enfileirado
- Listas com bullets quando o ritmo pede parágrafo
- Adjetivo triplo ("único, especial, transformador")
- Metáfora de jornada/caminho`,
  },

  { id: 'p7', titulo: 'Proposta comercial — social media local',
    cat: 'cliente', desc: 'Proposta editorial pra cliente da região (academia, varejo, serviço). Modelo Papel da Lola.',
    ia: 'claude', tool: 'Claude + Canva (template visual)',
    etapas: ['Diagnóstico', 'Estratégia', 'Pacote', 'Valor', 'Apresentação'],
    checklist: [
      'Visitar redes do cliente',
      'Listar 3 pontos fortes e 3 oportunidades',
      'Definir pacote: posts + stories + reels',
      'Calcular valor por hora real',
      'Mandar em PDF + apresentar por vídeo',
    ],
    texto: `Você é estrategista de conteúdo da Papel da Lola e está montando proposta pra:

CLIENTE: [NOME + SEGMENTO + CIDADE]
REDES ATUAIS: [LINKS]
ORCAMENTO PROVÁVEL: R$ [VALOR]/mês

Estrutura da proposta (PDF de 8-10 páginas):

PÁG 1 — CAPA: nome do cliente, mês, "Papel da Lola apresenta"

PÁG 2 — ONDE VOCÊS ESTÃO
[Diagnóstico honesto em 4 tópicos. Não dourar.]

PÁG 3 — ONDE VOCÊS PODEM CHEGAR
[3 objetivos concretos pra 6 meses]

PÁG 4 — NOSSA ESTRATÉGIA
[3 pilares de conteúdo específicos pro negócio. Não genérico.]

PÁG 5 — PACOTE MENSAL
[Entregáveis claros: X posts + Y stories + Z reels + relatório]

PÁG 6 — NOSSO PROCESSO
[Como trabalhamos: briefing > pauta > aprovação > entrega > relatório]

PÁG 7 — INVESTIMENTO
[Três opções: enxuto / completo / premium. Sempre três.]

PÁG 8 — POR QUE A GENTE
[3 motivos específicos. Nada de "somos apaixonados".]

PÁG 9 — PRÓXIMO PASSO
[CTA direto: "se você topar, mando contrato em 24h"]

Tom: profissional sem ser engessado. Confiante sem ser arrogante.`,
  },

  { id: 'p8', titulo: 'Plano semanal adaptativo (TDAH + AHSD)',
    cat: 'estrategia', desc: 'Plano da semana que respeita energia variada, hiperfoco e drenagem.',
    ia: 'claude', tool: 'Claude + Lorenna OS',
    etapas: ['Dump', 'Diagnóstico', 'Plano', 'Revisão', 'Execução'],
    checklist: [
      'Dump mental de tudo (sem filtro)',
      'Marcar urgente vs importante',
      'Identificar horário de pico criativo',
      'Reservar 30% de buffer pra imprevistos',
      'Revisão diária às 13h',
    ],
    texto: `Você é minha copiloto executiva pra produtividade adaptativa.
Perfil: TDAH + TEA nível 1 + altas habilidades.
Negócio: agência (Logue) + criadora de conteúdo autoral + mãe do Mateus & Murilo (7) e do Miguel (1a10m).

INPUT DA SEMANA:
- Energia base atual: [nível/modo]
- Horários fixos imexiveis: [LISTAR]
- Tarefas urgentes (com prazo): [LISTAR]
- Tarefas importantes sem prazo: [LISTAR]
- O que está me drenando: [DESCREVER]
- O que está me energizando: [DESCREVER]

ME ENTREGUE:

1. DIAGNÓSTICO RÁPIDO (3 linhas)
   - Qual é o gargalo real essa semana?

2. CORTES SUGERIDOS
   - O que eu posso NÃO fazer essa semana?
   - O que pode virar a semana que vem sem custo?

3. PLANO DIA-A-DIA
   Segunda — Modo [X]
     manhã: [1-2 microações]
     tarde (13h-17h pico): [1 tarefa pesada quebrada em micro]
     noite: livre
   [Repetir pra cada dia]

4. ÂNCORAS COGNITIVAS
   - 1 ritual de começo de dia (5min)
   - 1 ritual de fechamento (5min)

5. PLANO B
   - Se eu acordar exausta: [protocolo]
   - Se entrar em hiperfoco: [como sair sem culpa]

NÃO FAÇA:
- Não sobrecarregue
- Não use linguagem de produtividade tóxica
- Não ignore que tem uma criança no meio disso`,
  },

  { id: 'p9', titulo: 'Briefing de cliente — onboarding express',
    cat: 'cliente', desc: 'Roteiro de 20 perguntas pra extrair tudo de um cliente novo em 1 reunião.',
    ia: 'claude', tool: 'Claude + Google Forms + Notion',
    etapas: ['Pergunta', 'Reunião', 'Síntese', 'Persona', 'Pilares'],
    checklist: [
      'Enviar pré-briefing antes da reunião',
      'Reunião de 60min gravada (com permissão)',
      'Resumir em uma página do Notion',
      'Validar pilares de conteúdo com cliente',
      'Marcar próxima reunião quinzenal',
    ],
    texto: `Você é estrategista de marca da Papel da Lola fazendo onboarding de um cliente novo.
Objetivo: extrair em 60min tudo que precisa pra montar 3 meses de conteúdo.

Cliente: [NOME + SEGMENTO]

Gere as 20 perguntas certas em 4 blocos:

BLOCO 1 — O NEGÓCIO (5 perguntas)
O que vocês vendem de verdade (não o produto, o que muda na vida de quem compra)?
Quem é o cliente ideal (não demográfico — contexto e dor)?
[…]

BLOCO 2 — A MARCA (5 perguntas)
3 marcas que vocês admiram e por quê
3 marcas com que vocês NÃO querem se parecer
[…]

BLOCO 3 — O CONTEÚDO (5 perguntas)
Maior sucesso de conteúdo até hoje? (anexá-lo)
Maior fracasso?
[…]

BLOCO 4 — O OPERACIONAL (5 perguntas)
Quem aprova final?
Quanto tempo entre pedido e liberação?
[…]

Para cada pergunta, escreva também:
- O que essa pergunta revela
- Sinal vermelho se a resposta vier "de placa"
- Pergunta de follow-up`,
  },

  { id: 'p10', titulo: 'Reescrita autoral — destilação de texto bruto',
    cat: 'conteudo', desc: 'Pega audio transcrito ou despejo mental e devolve texto com sua voz.',
    ia: 'claude', tool: 'Claude + Whisper (transcrição)',
    etapas: ['Transcrição', 'Destilação', 'Voz', 'Forma', 'Acabamento'],
    checklist: [
      'Transcrever áudio com Whisper',
      'Limpar metadados ("hmm", repetições)',
      'Rodar prompt',
      'Comparar com voz original',
      'Acabamento manual',
    ],
    texto: `Você recebe um texto cru, transcrito de áudio ou escrito de cabeça. Sua missão é destilá-lo na voz de Lorenna / Papel da Lola.

TEXTO BRUTO:
[colar]

DESTINO:
[reel / legenda / post de blog / newsletter / story]

FAÇA:
1. Identifique a ideia central em 1 frase
2. Identifique 2-3 imagens concretas no texto
3. Identifique o ritmo natural (curto-curto-longo? sempre-longo?)
4. Reescreva mantendo a voz, removendo:
   - Repetições
   - Hesitações de fala
   - Adjetivos genericos
   - Cliches
5. Devolva 2 versões:
   A) Fiel — mantém o máximo do original
   B) Solta — estiliza pra ficar publicavel

PRESERVE SEMPRE:
- Metáforas específicas (mesmo que estranhas)
- Palavras que ela usa muito ("acervo", "papel", "isso aqui…")
- Quebras de linha que dao ritmo

REMOVA SEMPRE:
- "Tipo", "sabe", "então"
- Adjetivo + adjetivo + adjetivo
- Pergunta retórica que repete o que acabou de dizer`,
  },
];

const PROMPT_CATS = {
  conteudo:    'Conteúdo',
  roteiro:     'Roteiro',
  blog:        'Blog',
  newsletter:  'Newsletter',
  branding:    'Branding',
  cliente:     'Cliente',
  ugc:         'UGC',
  design:      'Design',
  pesquisa:    'Pesquisa',
  estrategia:  'Estratégia',
};

const IA_COLORS = {
  claude:     '#E8538D',
  chatgpt:    '#7FB68C',
  gemini:     '#A89AC9',
  perplexity: '#E89B4C',
};

/* ── Mapa mental ── estrutura real Papel da Lola */
const MAP_NODES = [
  /* CENTRO — a marca */
  { id: 'core', label: 'Papel da Lola', x: 480, y: 290, type: 'core' },

  /* CLUSTERS — 4 domínios */
  { id: 'cluster-pilares',   label: 'Pilares de conteúdo', x:  60, y:  40, type: 'cluster' },
  { id: 'cluster-clientes',  label: 'Clientes',            x: 760, y:  40, type: 'cluster' },
  { id: 'cluster-formatos',  label: 'Formatos',            x:  60, y: 510, type: 'cluster' },
  { id: 'cluster-sistema',   label: 'Sistema operacional', x: 760, y: 510, type: 'cluster' },

  /* PILARES (6) */
  { id: 'p-branding',  label: 'Análise de marcas',    x:  40, y: 120, parent: 'cluster-pilares', type: 'pilar' },
  { id: 'p-mulheres',  label: 'Mulheres incríveis',   x: 200, y: 175, parent: 'cluster-pilares', type: 'pilar' },
  { id: 'p-livros',    label: 'Livros infantis',      x:  40, y: 240, parent: 'cluster-pilares', type: 'pilar' },
  { id: 'p-mae',       label: 'Maternidade criativa', x: 220, y: 290, parent: 'cluster-pilares', type: 'pilar' },
  { id: 'p-ia',        label: 'IA com afeto',         x:  40, y: 350, parent: 'cluster-pilares', type: 'pilar' },
  { id: 'p-bastidor',  label: 'Bastidores criativos', x: 200, y: 410, parent: 'cluster-pilares', type: 'pilar' },

  /* CLIENTES (4) */
  { id: 'c-pratique',  label: 'Academia Itabira Fit',      x: 800, y: 120, parent: 'cluster-clientes', type: 'client' },
  { id: 'c-criar',     label: 'Espaço Criar',              x: 960, y: 175, parent: 'cluster-clientes', type: 'client' },
  { id: 'c-otica',     label: 'Óptica Igor Giordano',      x: 780, y: 230, parent: 'cluster-clientes', type: 'client' },
  { id: 'c-jornal',    label: 'Jornal Cidades Minerais',   x: 950, y: 290, parent: 'cluster-clientes', type: 'client-warn' },
  { id: 'c-prospect',  label: 'Prospecção (Reserva, iFood)',x: 800, y: 360, parent: 'cluster-clientes', type: 'prospect' },

  /* FORMATOS (5) */
  { id: 'f-reel',      label: 'Reels @papeldalola',   x:  40, y: 590, parent: 'cluster-formatos', type: 'format' },
  { id: 'f-carrossel', label: 'Carrosséis IG',        x: 220, y: 590, parent: 'cluster-formatos', type: 'format' },
  { id: 'f-yt',        label: 'YouTube (série)',      x:  40, y: 660, parent: 'cluster-formatos', type: 'format' },
  { id: 'f-news',      label: 'Carta da Lola',        x: 220, y: 660, parent: 'cluster-formatos', type: 'format' },
  { id: 'f-blog',      label: 'Blog Papel da Lola',   x: 130, y: 730, parent: 'cluster-formatos', type: 'format' },

  /* SISTEMA (5) */
  { id: 's-os',        label: 'Lorenna OS',           x: 800, y: 590, parent: 'cluster-sistema', type: 'system-core' },
  { id: 's-notion',    label: 'Notion (criativo)',    x: 970, y: 600, parent: 'cluster-sistema', type: 'system' },
  { id: 's-supabase',  label: 'Supabase (invisível)', x: 970, y: 670, parent: 'cluster-sistema', type: 'system' },
  { id: 's-claude',    label: 'Claude (copiloto)',    x: 800, y: 670, parent: 'cluster-sistema', type: 'system' },
  { id: 's-davi',      label: 'Davi (rotina familiar)',x: 880, y: 740, parent: 'cluster-sistema', type: 'pessoal' },
];

const MAP_EDGES = [
  /* core → clusters */
  { from: 'core', to: 'cluster-pilares' },
  { from: 'core', to: 'cluster-clientes' },
  { from: 'core', to: 'cluster-formatos' },
  { from: 'core', to: 'cluster-sistema' },

  /* pilares → formatos (qual pilar vira qual formato) */
  { from: 'p-branding',  to: 'f-carrossel' },
  { from: 'p-branding',  to: 'f-yt' },
  { from: 'p-mulheres',  to: 'f-yt' },
  { from: 'p-mulheres',  to: 'f-blog' },
  { from: 'p-livros',    to: 'f-carrossel' },
  { from: 'p-livros',    to: 'f-blog' },
  { from: 'p-mae',       to: 'f-reel' },
  { from: 'p-mae',       to: 'f-news' },
  { from: 'p-ia',        to: 'f-news' },
  { from: 'p-ia',        to: 'f-blog' },
  { from: 'p-bastidor',  to: 'f-reel' },

  /* clientes → formatos (entregáveis) */
  { from: 'c-pratique',  to: 'f-reel' },
  { from: 'c-pratique',  to: 'f-carrossel' },
  { from: 'c-criar',     to: 'f-carrossel' },
  { from: 'c-otica',     to: 'f-reel' },
  { from: 'c-jornal',    to: 'f-yt' },

  /* sistema sustenta tudo */
  { from: 's-os',        to: 'core' },
  { from: 's-claude',    to: 'p-ia' },
  { from: 's-claude',    to: 'f-news' },
  { from: 's-claude',    to: 'f-blog' },
  { from: 's-notion',    to: 'cluster-pilares' },
  { from: 's-supabase',  to: 'cluster-clientes' },
  { from: 's-davi',      to: 'p-mae' },
  { from: 's-davi',      to: 'p-bastidor' },
];

/* ── Rotinas (manhã / trabalho / noite) ── */
const ROUTINES = [
  {
    id: 'manha', titulo: 'Rotina da Manhã · Papel da Lola CEO', icone: '🌅', horario: 'Início do dia',
    cor: 'var(--pink)',
    prompt: `Use a skill papel-da-lola-ceo. Hoje é {{data}}.
Considere as metas mensais de tráfego e renda do blog e Instagram.
Me entregue:
— 1 prioridade principal de hoje
— 3 tarefas de maior impacto
— 1 oportunidade de conteúdo ideal
— 1 oportunidade rápida de monetização
— 1 coisa para ignorar
— 3 tarefas super rápidas que posso fazer pra aumentar minha lista de tarefas feitas no dia

Use meu Notion E MINHA AGENDA DO GOOGLE para adicionar o que for necessário da sessão MY TASKS e nas abas Pautas do blog e Calendário editorial, preenchendo todos os campos.

Use LOLA AGENDA EXECUTIVA.

Revise agenda de hoje. Mostre horários livres. Sugira melhor bloco para conteúdo. Avise compromissos importantes.

VOCÊ TEM PERMISSÃO PARA ACESSAR MEU NOTION.`,
    passos: [
      { id: 'r1', desc: 'Rodar o prompt CEO da Lola no Claude',         min: 3 },
      { id: 'r2', desc: 'Definir prioridade principal',                  min: 1 },
      { id: 'r3', desc: 'Mateus e Murilo — organizar pra escola',         min: 30 },
      { id: 'r4', desc: 'Miguel — café + presença',                       min: 20 },
      { id: 'r5', desc: 'Sentar na mesa · abrir Lorenna OS',              min: 5 },
      { id: 'r6', desc: 'Captura mental do dia',                         min: 5 },
    ],
  },
  {
    id: 'inicio-trabalho', titulo: 'Início do trabalho', icone: '🧠', horario: 'Pós café',
    cor: 'var(--e-criativa)',
    passos: [
      { id: 'rt1', desc: 'Conferir foco do dia no OS',                    min: 2 },
      { id: 'rt2', desc: 'Definir energia atual (sem julgar)',            min: 1 },
      { id: 'rt3', desc: 'Atacar a tarefa-âncora antes do e-mail',        min: 50 },
    ],
  },
  {
    id: 'fim-trabalho', titulo: 'Fechamento do dia', icone: '🌙', horario: 'Antes de buscar os meninos',
    cor: 'var(--e-cansada)',
    passos: [
      { id: 'rf1', desc: 'Revisar o que foi feito (sem cobrar)',          min: 5 },
      { id: 'rf2', desc: 'Capturar pendências pra amanhã',                min: 5 },
      { id: 'rf3', desc: 'Fechar abas — ritual simbólico',                min: 2 },
    ],
  },
];

Object.assign(window, {
  ENERGY, ENERGY_LIST, NAV,
  CATEGORY_LABELS, PLATFORM_LABELS, PLATFORM_COLORS,
  STATUS_IDEIA, STATUS_CONTEUDO, TYPE_EMOJI,
  RECURRENCES, DEMO_TASKS, DEMO_IDEAS, DEMO_CONTENT,
  DEMO_CLIENTS, DEMO_CRM, DEMO_PROMPTS, PROMPT_CATS, IA_COLORS,
  MAP_NODES, MAP_EDGES, ROUTINES,
  BRANDS, CRM_CATEGORIES,
});
