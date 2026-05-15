/* ──────────────────────────────────────────────
   data-personal.jsx — perfil + monetização
   ────────────────────────────────────────────── */

const PROFILE = {
  nome: 'Lorenna Luiza Guerra Nunes Barbosa',
  apelido: 'Lola',
  cpf: '123.741.376-19',
  id_civil: '16.749.445-1',
  endereco: 'Rua Israel Pinheiro, 243 · CEP 35900-246 · Itabira/MG',
  whatsapp: '(31) 9 ____-____',
  email: '',
  perfil_cognitivo: 'TDAH + TEA nível 1 + altas habilidades',
  marca: {
    blog: 'Papel da Lola',
    agencia: 'Agência Logue',
    tagline: 'O papel da Lola é viver, testar e compartilhar.',
  },
  familia: [
    { nome: 'Mateus',  idade: '7 anos',     papel: 'filho (gêmeo)',  cor: 'var(--e-cansada)'  },
    { nome: 'Murilo',  idade: '7 anos',     papel: 'filho (gêmeo)',  cor: 'var(--e-operacional)' },
    { nome: 'Miguel',  idade: '1 ano e 10 meses', papel: 'caçula',  cor: 'var(--pink)' },
  ],
};

/* ── Formas de monetização ── */
const MONETIZATION_STREAMS = [
  { id: 'servicos',  nome: 'Serviços (Agência Logue)',  icon: '💼', cor: 'var(--e-operacional)',
    descricao: 'Branding, design e social media para clientes locais e remotos.',
    canais: ['Itabira Fit', 'Espaço Criar', 'Óptica Igor Giordano', 'Jornal Cidades Minerais'],
    tipo: 'Receita imediata · alto controle',
    receita_atual: 4000, meta: 6000,
  },
  { id: 'afiliados', nome: 'Afiliados',                  icon: '🛍️', cor: 'var(--pink)',
    descricao: 'Indicação de produtos via Shopee, Mercado Livre, Amazon e outros.',
    canais: ['Shopee', 'Mercado Livre', 'Amazon', 'Magazine Luiza'],
    tipo: 'Passiva · escalável · baixo esforço por venda',
    receita_atual: 0, meta: 800,
  },
  { id: 'produtos',  nome: 'Produtos digitais',          icon: '📦', cor: 'var(--e-criativa)',
    descricao: 'Templates, mini-cursos, checklists, materiais imprimíveis.',
    canais: ['Loja própria (WordPress)', 'Hotmart', 'Sympla'],
    tipo: 'Cria 1 vez, vende várias',
    receita_atual: 0, meta: 1200,
  },
  { id: 'newsletter', nome: 'Newsletter Substack',       icon: '💌', cor: 'var(--e-social)',
    descricao: 'Carta da Lola — relacionamento + futuro de assinaturas pagas.',
    canais: ['Substack'],
    tipo: 'Construir base · monetizar em 6 meses',
    receita_atual: 0, meta: 400,
  },
  { id: 'ugc',       nome: 'UGC · Collabs · Permutas',   icon: '⭐', cor: 'var(--info)',
    descricao: 'Conteúdo para marcas como creator — sem agência intermediando.',
    canais: ['Instagram', 'TikTok'],
    tipo: 'Pontual · valor médio R$ 600-1500',
    receita_atual: 0, meta: 1500,
  },
  { id: 'adsense',   nome: 'Adsense + tráfego do blog',  icon: '📊', cor: 'var(--e-cansada)',
    descricao: 'Receita passiva do volume de visitas ao Papel da Lola.',
    canais: ['Blog WordPress'],
    tipo: 'Cresce com SEO · longo prazo',
    receita_atual: 0, meta: 200,
  },
  { id: 'comunidade', nome: 'Comunidade paga (futuro)',  icon: '🤝', cor: 'var(--e-maternidade)',
    descricao: 'Telegram/Discord pago com bastidores + suporte criativo.',
    canais: ['Telegram (futuro)'],
    tipo: 'Recorrente · alta fidelização',
    receita_atual: 0, meta: 1000,
  },
];

/* ── Pool de ideias-relâmpago para monetizar HOJE ── */
/* O gerador escolhe 3 baseado no dia da semana / categoria */
const MONETIZATION_IDEAS_POOL = [
  /* PAPELARIA */
  { cat: 'papelaria',  desc: 'Story com kit de canetas coloridas pra planner: "as 5 cores que eu uso pra dividir minha semana"',
    plataforma: 'Shopee', tempo: '15 min', dificuldade: 'baixa' },
  { cat: 'papelaria',  desc: 'Reel "anatomia da minha mesa criativa" mostrando 3-4 produtos com links de afiliado',
    plataforma: 'Shopee + ML', tempo: '40 min', dificuldade: 'média' },
  { cat: 'papelaria',  desc: 'Carrossel com 5 cadernos lindos de até R$ 50 (com links na bio)',
    plataforma: 'Mercado Livre', tempo: '25 min', dificuldade: 'baixa' },

  /* MAKE */
  { cat: 'make',       desc: 'Story rápido com batom que tô usando essa semana + link Shopee/ML',
    plataforma: 'Shopee', tempo: '5 min', dificuldade: 'baixa' },
  { cat: 'make',       desc: '"5 produtos de farmácia que ninguém te conta" — carrossel com afiliado',
    plataforma: 'Shopee', tempo: '30 min', dificuldade: 'média' },
  { cat: 'make',       desc: 'Reel "GRWM mãe corrida de 3 minutos" com 3-4 produtos linkáveis',
    plataforma: 'Shopee + ML', tempo: '45 min', dificuldade: 'média' },

  /* MODA */
  { cat: 'moda',       desc: 'Story com look do dia + link da saia/peça-chave',
    plataforma: 'Shopee', tempo: '5 min', dificuldade: 'baixa' },
  { cat: 'moda',       desc: 'Conjunto fitness pra ir pra academia — story + link',
    plataforma: 'Shopee', tempo: '5 min', dificuldade: 'baixa' },
  { cat: 'moda',       desc: '"3 saias longas até R$ 80 que eu salvaria" — carrossel',
    plataforma: 'Mercado Livre', tempo: '20 min', dificuldade: 'baixa' },

  /* ELETRÔNICOS */
  { cat: 'eletronico', desc: 'Indicar o tripé/ring light que você usa pra gravar — story com link',
    plataforma: 'Shopee', tempo: '5 min', dificuldade: 'baixa' },
  { cat: 'eletronico', desc: 'Reel "tudo que eu uso pra trabalhar de casa" com 5-6 links',
    plataforma: 'Shopee + ML', tempo: '40 min', dificuldade: 'média' },
  { cat: 'eletronico', desc: 'Indicar fone de ouvido que você usa pra editar áudio',
    plataforma: 'Shopee', tempo: '5 min', dificuldade: 'baixa' },

  /* CASA */
  { cat: 'casa',       desc: 'Story com organizadores baratos do dia-a-dia (banheiro, mesa)',
    plataforma: 'Shopee', tempo: '10 min', dificuldade: 'baixa' },
  { cat: 'casa',       desc: 'Carrossel "5 itens de casa por menos de R$ 30 que mudam o ambiente"',
    plataforma: 'Mercado Livre', tempo: '25 min', dificuldade: 'média' },

  /* LIVROS */
  { cat: 'livros',     desc: 'Story de um livro que você tá lendo + link na bio',
    plataforma: 'Amazon', tempo: '5 min', dificuldade: 'baixa' },
  { cat: 'livros',     desc: 'Reel "livros infantis que valem cada centavo" pros pais — Mateus & Murilo',
    plataforma: 'Amazon', tempo: '30 min', dificuldade: 'média' },
  { cat: 'livros',     desc: '"3 livros sobre branding que mudaram meu olhar" — carrossel com afiliado',
    plataforma: 'Amazon', tempo: '25 min', dificuldade: 'baixa' },

  /* SAPATOS */
  { cat: 'sapato',     desc: 'Tênis confortável que você usa pra correr atrás dos meninos + link',
    plataforma: 'Shopee', tempo: '5 min', dificuldade: 'baixa' },
  { cat: 'sapato',     desc: 'Sandália que tá no pé essa semana — story rápido',
    plataforma: 'Shopee', tempo: '5 min', dificuldade: 'baixa' },

  /* INFANTIL */
  { cat: 'infantil',   desc: 'Brinquedo educativo do Miguel + link Shopee',
    plataforma: 'Shopee', tempo: '10 min', dificuldade: 'baixa' },
  { cat: 'infantil',   desc: 'Material escolar pros gêmeos com link',
    plataforma: 'Mercado Livre', tempo: '15 min', dificuldade: 'baixa' },
  { cat: 'infantil',   desc: 'Reel "como organizo a mochila dos gêmeos" — produtos linkáveis',
    plataforma: 'Shopee + ML', tempo: '35 min', dificuldade: 'média' },

  /* CONTEÚDO/PRODUTO PRÓPRIO */
  { cat: 'proprio',    desc: 'Postar um story divulgando seu template / mini-curso na loja própria',
    plataforma: 'Loja própria', tempo: '5 min', dificuldade: 'baixa' },
  { cat: 'proprio',    desc: 'Reel mostrando como você usa seu próprio planner imprimível',
    plataforma: 'Loja própria', tempo: '20 min', dificuldade: 'baixa' },
  { cat: 'proprio',    desc: 'Carta da Lola sobre um tema + CTA pro template grátis (lista)',
    plataforma: 'Substack', tempo: '40 min', dificuldade: 'média' },

  /* UGC PROSPECÇÃO */
  { cat: 'ugc',        desc: 'Mandar DM pra 3 marcas pequenas com proposta de UGC simples',
    plataforma: 'Instagram DM', tempo: '20 min', dificuldade: 'média' },
  { cat: 'ugc',        desc: 'Atualizar seu mediakit no Canva e mandar pro inbox de uma marca',
    plataforma: 'E-mail', tempo: '30 min', dificuldade: 'média' },
];

const MONETIZATION_CATS = {
  papelaria:  { label: 'Papelaria',     emoji: '✏️' },
  make:       { label: 'Make',          emoji: '💄' },
  moda:       { label: 'Moda',          emoji: '👗' },
  eletronico: { label: 'Eletrônicos',   emoji: '🎧' },
  casa:       { label: 'Casa',          emoji: '🪴' },
  livros:     { label: 'Livros',        emoji: '📚' },
  sapato:     { label: 'Sapatos',       emoji: '👟' },
  infantil:   { label: 'Infantil',      emoji: '🧸' },
  proprio:    { label: 'Produto próprio', emoji: '✨' },
  ugc:        { label: 'UGC / Marcas',  emoji: '🤝' },
};

/* ── Agenda mock (Google Calendar style) ── */
const AGENDA_EVENTS = [
  { id: 'ev1', titulo: 'Captação Itabira Fit · Esplanada', start: '2026-05-15T10:00', end: '2026-05-15T12:00', tipo: 'cliente', cor: 'var(--e-operacional)' },
  { id: 'ev2', titulo: 'Reunião pauta Espaço Criar',        start: '2026-05-14T15:00', end: '2026-05-14T16:00', tipo: 'cliente', cor: 'var(--e-cansada)' },
  { id: 'ev3', titulo: 'Entrevista Jornal CM · plenária',   start: '2026-05-14T14:00', end: '2026-05-14T15:00', tipo: 'cliente', cor: 'var(--e-foco)' },
  { id: 'ev4', titulo: 'Influencer Óptica · Sabrina Sachez', start: '2026-05-12T11:00', end: '2026-05-12T12:00', tipo: 'cliente', cor: 'var(--info)' },
  { id: 'ev5', titulo: 'Influencer Óptica · Waltencir',      start: '2026-05-13T11:00', end: '2026-05-13T12:00', tipo: 'cliente', cor: 'var(--info)' },
  { id: 'ev6', titulo: 'Influencer Óptica · Thais Lage',     start: '2026-05-14T11:00', end: '2026-05-14T12:00', tipo: 'cliente', cor: 'var(--info)' },
  { id: 'ev7', titulo: 'Bloco criativo · Carta da Lola',    start: '2026-05-15T14:00', end: '2026-05-15T16:00', tipo: 'autoral', cor: 'var(--pink)' },
  { id: 'ev8', titulo: 'Buscar Mateus & Murilo na escola',  start: '2026-05-13T17:30', end: '2026-05-13T18:00', tipo: 'familia', cor: 'var(--e-maternidade)' },
  { id: 'ev9', titulo: 'Pediatra Miguel',                    start: '2026-05-16T09:00', end: '2026-05-16T10:00', tipo: 'familia', cor: 'var(--e-maternidade)' },
];

const AGENDA_TYPES = {
  cliente:   { label: 'Cliente',   cor: 'var(--e-operacional)' },
  autoral:   { label: 'Autoral',   cor: 'var(--pink)' },
  familia:   { label: 'Família',   cor: 'var(--e-maternidade)' },
  pessoal:   { label: 'Pessoal',   cor: 'var(--e-cansada)' },
  saude:     { label: 'Saúde',     cor: 'var(--e-operacional)' },
};

/* ── Mini-teste de energia (4 perguntas) ── */
const ENERGY_QUIZ = [
  {
    pergunta: 'Como tá seu corpo agora?',
    opcoes: [
      { label: 'Pesado, com sono',      energias: ['cansada', 'maternidade'] },
      { label: 'Equilibrado, ok',        energias: ['operacional', 'social']  },
      { label: 'Acelerado, agitado',     energias: ['criativa', 'foco']       },
      { label: 'Animado, com vontade',   energias: ['criativa', 'gravacao']   },
    ],
  },
  {
    pergunta: 'O que você consegue fazer sem se forçar?',
    opcoes: [
      { label: 'Só coisa leve, automática',  energias: ['cansada', 'maternidade'] },
      { label: 'Coisas operacionais (e-mail, organizar)', energias: ['operacional', 'social'] },
      { label: 'Pensar, escrever, criar',     energias: ['criativa', 'foco']        },
      { label: 'Aparecer, gravar, falar',     energias: ['gravacao', 'social']      },
    ],
  },
  {
    pergunta: 'Sua cabeça agora está mais…',
    opcoes: [
      { label: 'Lenta, com névoa',           energias: ['cansada']        },
      { label: 'Pulando entre 47 ideias',    energias: ['criativa']       },
      { label: 'Querendo terminar coisa',    energias: ['operacional', 'foco'] },
      { label: 'Querendo conversar/conectar', energias: ['social']        },
      { label: 'Querendo cuidar de gente',   energias: ['maternidade']    },
    ],
  },
  {
    pergunta: 'Se você pudesse escolher só 1 coisa pra fazer agora…',
    opcoes: [
      { label: 'Deitar 30 minutos',          energias: ['cansada']       },
      { label: 'Riscar coisa da lista',      energias: ['operacional']   },
      { label: 'Escrever um texto longo',    energias: ['foco']          },
      { label: 'Gravar reel novo',           energias: ['gravacao']      },
      { label: 'Pintar/criar livremente',    energias: ['criativa']      },
      { label: 'Tomar café com alguém',      energias: ['social']        },
      { label: 'Ficar com Miguel',           energias: ['maternidade']   },
    ],
  },
];

/* ── Outras ideias úteis que sugiro (apresento no Sobre/Settings) ── */
const FEATURE_SUGGESTIONS = [
  { titulo: 'Aba Financeiro',
    desc: 'Controle de entradas (mês a mês), saídas, projeção pra mês seguinte e exportação pra contadora.' },
  { titulo: 'Gerador de recibo',
    desc: 'A partir dos dados do cliente, gera PDF pronto pra mandar no fim do mês.' },
  { titulo: 'Banco de hashtags por cliente',
    desc: 'Cada cliente tem seu próprio set + horários ótimos de postagem.' },
  { titulo: 'Documento "Minha voz"',
    desc: 'Antologia automática dos seus textos preferidos pra alimentar o Claude — anti-slop garantido.' },
  { titulo: 'Lembretes de aniversário',
    desc: 'Clientes + família + influencers. Não dá pra esquecer Mateus, Murilo e Miguel.' },
  { titulo: 'Espaço de anotações de terapia',
    desc: 'Privado, encriptado. Exportável em PDF antes da sessão.' },
  { titulo: 'Backup auto pro Google Drive',
    desc: 'Cópia de tudo (capturas, ideias, tarefas) toda sexta às 18h.' },
  { titulo: 'Filtro "Mãe-dia"',
    desc: 'Dia que você tá com os 3 meninos: o OS só mostra tarefas que cabem em janelas de 15 min.' },
];

Object.assign(window, {
  PROFILE,
  MONETIZATION_STREAMS, MONETIZATION_IDEAS_POOL, MONETIZATION_CATS,
  AGENDA_EVENTS, AGENDA_TYPES,
  ENERGY_QUIZ, FEATURE_SUGGESTIONS,
});
