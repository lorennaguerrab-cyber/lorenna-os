/* ──────────────────────────────────────────────
   pages-studio.jsx — Studio IA: agentes de criação de conteúdo
   ────────────────────────────────────────────── */

const LORENNA_VOZ = `Você escreve como Lorenna Guerra — criadora de conteúdo, fundadora da Agência Logue, mãe de três, mulher que pensa em voz alta e escreve como conversa.

Tom: pessoal e caloroso, como uma amiga inteligente que te faz pensar. Feminino sem ser fútil.
Linguagem: "a gente" em vez de "nós". Frases curtas. Sem rebuscamento.
Estrutura: abre com uma cena ou momento real antes de ir ao ponto. Pessoal antes de universal.
Estética: parágrafos curtos (máx 3 linhas). Títulos de seção em negrito, poéticos e inesperados — nunca genéricos.

PROIBIDO: "basicamente", "de certa forma", "é isso mesmo", "com certeza", "estratégia", "engajamento", "conteúdo de qualidade", "audiência", bullet points em newsletters, abertura com "Oie!" ou "Olá!".

Nunca soe como marketing. Nunca explique o óbvio. Confie na leitora.`;

const STUDIO_AGENTS = [
  {
    id: 'carta',
    nome: 'Carta da Lola',
    emoji: '✉️',
    desc: 'Newsletter semanal no seu tom',
    cor: '#fe7dae',
    botao: 'Escrever newsletter',
    campos: [
      { id: 'tema',     label: 'Tema da semana',             tipo: 'text',     placeholder: 'Ex: sobre deixar de agradar todo mundo', obrigatorio: true },
      { id: 'cena',     label: 'Cena real da sua semana',    tipo: 'textarea', placeholder: 'Uma situação que aconteceu e conecta ao tema...', obrigatorio: true },
      { id: 'noticias', label: 'Notícias relacionadas',       tipo: 'multi',    placeholder: 'Cole link ou texto — ou clique em "Me dê sugestões"', temSugestoes: true },
      { id: 'blog',     label: 'Posts do blog desta semana', tipo: 'multi',    placeholder: 'Título ou URL do post (opcional)' },
      { id: 'cta',      label: 'CTA final',                  tipo: 'text',     placeholder: 'Ex: Me conta: você também faz isso?', obrigatorio: true },
    ],
  },
  {
    id: 'roteiro',
    nome: 'Roteirista',
    emoji: '🎬',
    desc: 'Roteiros para reels, YouTube e UGC',
    cor: '#f1e18d',
    botao: 'Criar roteiro',
    campos: [
      { id: 'tema',    label: 'Tema / mensagem principal', tipo: 'text',     placeholder: 'Ex: por que parei de postar todo dia', obrigatorio: true },
      { id: 'formato', label: 'Formato',                   tipo: 'select',   opcoes: ['Reels 30s', 'Reels 60s', 'YouTube 5-10min', 'UGC para cliente', 'Story série (3 partes)'], obrigatorio: true },
      { id: 'origem',  label: 'Pessoal ou cliente?',       tipo: 'select',   dinamico: 'clientes_roteiro', obrigatorio: true },
      { id: 'gancho',  label: 'Gancho de abertura',        tipo: 'textarea', placeholder: 'Uma cena, provocação ou pergunta para os primeiros 3 segundos...' },
      { id: 'cta',     label: 'CTA final',                 tipo: 'text',     placeholder: 'Seguir, comentar, link na bio...' },
    ],
  },
  {
    id: 'blog',
    nome: 'Blog SEO',
    emoji: '📝',
    desc: 'Artigo completo + SEO + monetização + conteúdo relacionado',
    cor: '#bce1f6',
    botao: 'Escrever artigo completo',
    campos: [
      { id: 'tema',    label: 'Tema / palavra-chave principal', tipo: 'text',     placeholder: 'Ex: como se organizar com TDAH sendo mãe', obrigatorio: true },
      { id: 'gancho',  label: 'Ângulo pessoal (sua história)',  tipo: 'textarea', placeholder: 'Uma cena real, experiência ou perspectiva única sua que conecta ao tema...' },
      { id: 'publico', label: 'Público-alvo',                   tipo: 'text',     placeholder: 'Ex: mães neurodivergentes, criadoras de conteúdo...' },
      { id: 'produto', label: 'O que monetizar neste post?',    tipo: 'text',     placeholder: 'Ex: consultoria da Logue, link afiliado, produto digital, e-book...' },
      { id: 'nivel',   label: 'Nível do leitor',                tipo: 'select',   opcoes: ['Iniciante', 'Intermediário', 'Avançado', 'Todos os níveis'] },
    ],
  },
  {
    id: 'post_cliente',
    nome: 'Post de Cliente',
    emoji: '✨',
    desc: 'Captions e copies com a voz do cliente',
    cor: '#f0bff8',
    botao: 'Criar post',
    campos: [
      { id: 'cliente',    label: 'Cliente',                        tipo: 'select',   dinamico: 'clientes_lista', obrigatorio: true },
      { id: 'objetivo',   label: 'Objetivo do post',               tipo: 'select',   opcoes: ['Lançamento / novidade', 'Promoção / desconto', 'Conteúdo educativo', 'Bastidores', 'Depoimento / UGC', 'Evento'], obrigatorio: true },
      { id: 'midia',      label: 'Descreva a foto ou vídeo',       tipo: 'textarea', placeholder: 'Ex: produto na vitrine, luz natural, sem modelo', obrigatorio: true },
      { id: 'info',       label: 'Informação específica a destacar', tipo: 'textarea', placeholder: 'Preço, desconto, data, diferencial...' },
      { id: 'plataforma', label: 'Plataforma',                     tipo: 'select',   opcoes: ['Instagram feed', 'Reels', 'Stories', 'TikTok', 'Facebook'], obrigatorio: true },
    ],
  },
];

function buildClienteLists() {
  const clientes = (window.DEMO_CLIENTS || []).map(c => c.nome);
  return {
    clientes_lista: clientes.length ? clientes : ['Sem clientes cadastrados'],
    clientes_roteiro: ['Pessoal (Lorenna)', ...clientes],
  };
}

function buildSystemPrompt(agente, campos) {
  if (agente.id === 'carta') {
    return LORENNA_VOZ + `

Escreva uma newsletter "Carta da Lola" com 400-600 palavras.
Estrutura obrigatória:
1. Abertura com a cena da vida real (2-3 parágrafos)
2. Transição para o tema (1 parágrafo)
3. Seção com título poético em negrito — contexto/notícia
4. Reflexão pessoal (2-3 parágrafos)
5. Encerramento com o CTA de forma natural, não imperativa

Sem marcadores, sem bullets, sem numeração visível. Títulos de seção em **negrito**.`;
  }

  if (agente.id === 'roteiro') {
    const fmt = campos['formato'] || 'Reels 60s';
    const isPessoal = (campos['origem'] || '').startsWith('Pessoal');
    return `Você é uma roteirista especialista em conteúdo digital.
${isPessoal ? LORENNA_VOZ : 'Tom: direto, com personalidade, sem padrão corporativo.'}

Formato do vídeo: ${fmt}
Estrutura: use marcações claras entre colchetes como [GANCHO], [CENA 1], [NARRAÇÃO], [TEXTO NA TELA], [CTA].
Para Reels: gancho nos primeiros 3 segundos é obrigatório (visual + verbal).
Para YouTube: inclua [INTRO], [DESENVOLVIMENTO], [CONCLUSÃO].
Para UGC: tom mais natural, como se fosse uma pessoa comum falando do produto.
Seja específico nas ações de câmera e texto na tela.`;
  }

  if (agente.id === 'blog') {
    const produto = campos['produto'] || '';
    const nivel = campos['nivel'] || 'Todos os níveis';
    return `${LORENNA_VOZ}

Você é especialista em SEO, conteúdo para blog e monetização digital. Escreva para o blog "Papel da Lola".
Nível do leitor: ${nivel}

Produza TODAS as seções abaixo, separadas pelos títulos em destaque:

═══ ARTIGO SEO ═══
H1: [título com palavra-chave — máx 65 caracteres]
Meta description: [155 caracteres com CTA sutil]

[Artigo de 800-1000 palavras — introdução com cena pessoal + 3-4 seções H2 com palavras-chave relacionadas + conclusão com CTA]${produto ? `\nMenção orgânica e útil a: ${produto}` : ''}

═══ MONETIZAÇÃO DESTE POST ═══
Sugira 3 formas concretas: afiliados, produto próprio, consultoria, freebies para captura de e-mail, etc.

═══ CONTEÚDO RELACIONADO ═══
📸 Ensaio fotográfico: [conceito e referência visual]
🎬 Reels/TikTok 30s: [gancho dos primeiros 3 segundos]
📹 YouTube: [título + 3 tópicos para vídeo longo]
💌 Carta da Lola: [ângulo emocional único para a newsletter]
📌 Pinterest: [texto do pin + sugestão de board]

═══ SEQUÊNCIA DE STORIES — 6 slides ═══
Slide 1 — Gancho: [texto curto, impactante]
Slide 2 — Contexto/problema: [texto]
Slide 3 — Desenvolvimento: [texto]
Slide 4 — Dica central: [texto]
Slide 5 — Teaser do artigo: [texto]
Slide 6 — CTA: [texto + ação clara]

═══ DIVULGAÇÃO INSTAGRAM ═══
Título do post (feed/carrossel): [máx 7 palavras, impacto]
Subtítulo de apoio: [1 linha complementar]
Legenda completa:
[gancho primeira linha que para o scroll]
[2-3 parágrafos de desenvolvimento]
[CTA direto e específico]
[8-12 hashtags relevantes]`;
  }

  if (agente.id === 'post_cliente') {
    const clienteNome = campos['cliente'] || '';
    const clienteData = (window.DEMO_CLIENTS || []).find(c => c.nome === clienteNome);
    const vozCliente = clienteData?.voz_perfil || 'Tom profissional e acessível. Próximo do cliente, sem jargões. Evite excessos de emojis.';
    const plataforma = campos['plataforma'] || 'Instagram feed';
    return `Você cria posts para redes sociais da Agência Logue.
Cliente: ${clienteNome}
Tom de voz do cliente: ${vozCliente}
Plataforma: ${plataforma}

Escreva uma caption com:
1. Gancho na primeira linha (sem emojis decorativos no início)
2. Desenvolvimento em parágrafos curtos
3. CTA claro e específico
4. 5-8 hashtags relevantes no final

Evite: "Olá família!", "Novidades chegando!", "Confira nosso perfil", emojis excessivos, frases genéricas de marketing.`;
  }

  return '';
}

function SugestoesList({ sugestoes, onSelect }) {
  if (!sugestoes.length) return null;
  return (
    <div style={{
      marginTop: 8,
      padding: 'var(--s-3)',
      background: 'var(--bg-elevated)',
      borderRadius: 'var(--r-md)',
      border: '1px solid var(--border)',
    }}>
      <p className="tiny muted" style={{ marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>
        Sugestões — clique para usar
      </p>
      <div className="col gap-1">
        {sugestoes.map((s, i) => s.trim() && (
          <button key={i} onClick={() => onSelect(s.trim())}
            style={{
              textAlign: 'left', padding: '7px 10px',
              borderRadius: 'var(--r-md)', border: '1px solid transparent',
              background: 'var(--white)', cursor: 'pointer',
              fontSize: 13, color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)', lineHeight: 1.5,
              transition: 'all .1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--pink-tint)'; e.currentTarget.style.borderColor = 'var(--pink-soft)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--white)'; e.currentTarget.style.borderColor = 'transparent'; }}
          >{s}</button>
        ))}
      </div>
    </div>
  );
}

const PROMPT_CAT_COLORS = {
  conteudo:   '#fe7dae',
  roteiro:    '#f1e18d',
  blog:       '#bce1f6',
  newsletter: '#fec9df',
  branding:   '#f0bff8',
  cliente:    '#ffe1bd',
  ugc:        '#f0bff8',
  design:     '#f1e18d',
  pesquisa:   '#bce1f6',
  estrategia: '#ffe1bd',
};

function PromptsBancoTab() {
  const [sel, setSel] = useState(null);
  const [copiado, setCopiado] = useState(false);
  const prompts = window.DEMO_PROMPTS || [];
  const cats = window.PROMPT_CATS || {};
  const iaColors = window.IA_COLORS || {};

  function copiarPrompt(texto) {
    navigator.clipboard.writeText(texto).then(() => {
      setCopiado(true);
      showToast('Prompt copiado!');
      setTimeout(() => setCopiado(false), 2000);
    });
  }

  if (sel) {
    const cor = PROMPT_CAT_COLORS[sel.cat] || '#fe7dae';
    return (
      <div className="col gap-4 fade-up">
        <div className="row gap-3" style={{ alignItems: 'center' }}>
          <button onClick={() => setSel(null)} style={{
            padding: '6px 14px', borderRadius: 'var(--r-md)',
            border: '1px solid var(--border)', background: 'var(--bg-elevated)',
            cursor: 'pointer', fontSize: 14, fontFamily: 'var(--font-body)', color: 'var(--text-secondary)',
          }}>← Voltar</button>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: cor, color: '#201e1f' }}>
              {cats[sel.cat] || sel.cat}
            </span>
          </div>
        </div>

        <Card style={{ borderTop: `3px solid ${cor}` }}>
          <CardBody className="col gap-4">
            <div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>{sel.titulo}</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>{sel.desc}</p>
            </div>

            {/* Checklist */}
            {sel.checklist && (
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Como usar</div>
                <div className="col gap-2">
                  {sel.checklist.map((item, i) => (
                    <div key={i} className="row gap-3" style={{ padding: '8px 12px', background: `color-mix(in oklch, ${cor} 10%, var(--bg-elevated))`, borderRadius: 'var(--r-md)' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: cor, flexShrink: 0 }}>{i + 1}</span>
                      <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prompt text */}
            <div>
              <div className="row between" style={{ marginBottom: 8, alignItems: 'center' }}>
                <div className="eyebrow">Prompt completo</div>
                <Button variant="primary" size="sm" onClick={() => copiarPrompt(sel.texto)}
                  style={{ background: copiado ? '#f1e18d' : cor, color: '#201e1f' }}>
                  {copiado ? '✓ Copiado!' : '📋 Copiar prompt'}
                </Button>
              </div>
              <div style={{
                background: 'var(--bg-elevated)', borderRadius: 'var(--r-md)',
                border: '1px solid var(--border)', padding: 'var(--s-4)',
              }}>
                <pre style={{
                  whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)',
                  fontSize: 14, lineHeight: 1.7, color: 'var(--text-primary)', margin: 0,
                }}>{sel.texto}</pre>
              </div>
            </div>

            {/* AI tool */}
            {sel.tool && (
              <div style={{ padding: '10px 14px', background: `color-mix(in oklch, ${cor} 10%, var(--bg-surface))`, borderRadius: 'var(--r-md)', border: `1px solid color-mix(in oklch, ${cor} 25%, transparent)` }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginRight: 8 }}>Ferramentas:</span>
                <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>{sel.tool}</span>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="col gap-4">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--s-3)' }}>
        {prompts.map(p => {
          const cor = PROMPT_CAT_COLORS[p.cat] || '#fe7dae';
          return (
            <div key={p.id}
              onClick={() => setSel(p)}
              style={{
                padding: 'var(--s-4)', borderRadius: 'var(--r-xl)',
                background: 'var(--bg-surface)',
                border: '1.5px solid var(--border)',
                cursor: 'pointer', transition: 'all .15s',
                borderTop: `4px solid ${cor}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = cor; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.borderTopColor = cor; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div className="row between" style={{ marginBottom: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: cor, color: '#201e1f' }}>
                  {cats[p.cat] || p.cat}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{p.tool?.split(' + ')[0]}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: 15, fontWeight: 600, lineHeight: 1.35, marginBottom: 8, color: 'var(--text-primary)' }}>
                {p.titulo}
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{p.desc}</p>
              {p.etapas && (
                <div className="row gap-2" style={{ marginTop: 12, flexWrap: 'wrap' }}>
                  {p.etapas.map((et, i) => (
                    <span key={i} style={{ fontSize: 13, padding: '2px 8px', borderRadius: 999, background: `color-mix(in oklch, ${cor} 15%, var(--bg-elevated))`, color: 'var(--text-secondary)' }}>
                      {et}
                    </span>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 12, fontSize: 14, color: cor, fontWeight: 600 }}>Ver prompt completo →</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const FERRAMENTAS_IA = [
  {
    cat: 'Suas ferramentas Pro',
    cor: '#fe7dae',
    emoji: '⭐',
    tools: [
      { nome: 'Claude Pro', desc: 'IA principal do Córtex Lola — agentes, roteiros, newsletter, blog. Você já tem!', pro: true, destaque: true },
      { nome: 'Canva Pro', desc: 'Design com fundo mágico, resize automático, Brand Kit, mais de 100M de assets. Você já tem!', pro: true, destaque: true },
      { nome: 'Supabase', desc: 'Banco de dados do Córtex Lola — salva suas informações com segurança. Ativo no sistema.', pro: true },
      { nome: 'GitHub Pages', desc: 'Hospedagem gratuita do Córtex Lola — lorennaguerrab-cyber.github.io/lorenna-os', pro: true },
    ],
  },
  {
    cat: 'Texto e escrita',
    cor: '#fec9df',
    emoji: '✍️',
    tools: [
      { nome: 'Claude (via Agentes)', desc: 'Use os Agentes aqui no Studio IA — Carta da Lola, Roteirista, Blog SEO, Post de Cliente', pro: true, destaque: true },
      { nome: 'ChatGPT', desc: 'Versatilidade para textos gerais, pesquisa e brainstorming', gratuito: true },
      { nome: 'Gemini', desc: 'Google — bom para pesquisa com contexto atual', gratuito: true },
      { nome: 'Perplexity', desc: 'Pesquisa com fontes citadas — ótimo para contextualizar pautas', gratuito: true },
    ],
  },
  {
    cat: 'Imagens e design',
    cor: '#f0bff8',
    emoji: '🎨',
    tools: [
      { nome: 'Canva Pro (Magic Studio)', desc: 'Magic Write, Magic Eraser, Background Remover, resize automático — tudo no seu Canva Pro', pro: true, destaque: true },
      { nome: 'Ideogram', desc: 'Geração de imagens com texto legível — ótimo para posts com copy', gratuito: true },
      { nome: 'Adobe Firefly', desc: 'Geração de imagens e preenchimento generativo', gratuito: true },
      { nome: 'Remove.bg', desc: 'Remove fundo de imagens em segundos', gratuito: true },
    ],
  },
  {
    cat: 'Vídeo e edição',
    cor: '#bce1f6',
    emoji: '🎬',
    tools: [
      { nome: 'CapCut', desc: 'Edição de vídeo com IA — legendas automáticas, voz, efeitos. Ideal para Reels', gratuito: true, destaque: true },
      { nome: 'DaVinci Resolve', desc: 'Edição profissional de vídeo — totalmente gratuito', gratuito: true },
      { nome: 'Clipe', desc: 'App BR para edição rápida de reels com templates', gratuito: true },
      { nome: 'RunwayML', desc: 'Geração e edição de vídeo com IA', gratuito: false },
    ],
  },
  {
    cat: 'Voz e narração',
    cor: '#ffe1bd',
    emoji: '🎙️',
    tools: [
      { nome: 'Adobe Podcast (Enhance)', desc: 'Melhora qualidade do áudio automaticamente — gratuito e incrível', gratuito: true, destaque: true },
      { nome: 'Whisper (OpenAI)', desc: 'Transcrição de áudio/vídeo para texto — precisíssimo', gratuito: true },
      { nome: 'Otter.ai', desc: 'Transcrição em tempo real de reuniões e entrevistas', gratuito: true },
      { nome: 'ElevenLabs', desc: 'Geração de voz com IA — clone de voz', gratuito: false },
    ],
  },
  {
    cat: 'Fotos e estética',
    cor: '#fec9df',
    emoji: '📸',
    tools: [
      { nome: 'Lightroom (mobile)', desc: 'Edição profissional com IA — ajuste automático, máscaras de assunto', gratuito: true, destaque: true },
      { nome: 'Snapseed', desc: 'Edição avançada no celular — gratuito e poderoso', gratuito: true },
      { nome: 'Remini', desc: 'Melhora qualidade de fotos com IA', gratuito: true },
    ],
  },
  {
    cat: 'SEO e pesquisa',
    cor: '#f1e18d',
    emoji: '🔍',
    tools: [
      { nome: 'Google Search Console', desc: 'Ver palavras-chave reais que geram tráfego pro Papel da Lola', gratuito: true, destaque: true },
      { nome: 'Ubersuggest', desc: 'Pesquisa de palavras-chave — plano free limitado', gratuito: true },
      { nome: 'AnswerThePublic', desc: 'Perguntas que as pessoas fazem sobre um tema', gratuito: true },
      { nome: 'Google Trends', desc: 'Tendências de busca em tempo real', gratuito: true },
    ],
  },
  {
    cat: 'Bancos de imagens grátis',
    cor: '#f1e18d',
    emoji: '🖼️',
    tools: [
      { nome: 'Unsplash', desc: 'Fotos de alta qualidade — gratuitas para uso comercial', gratuito: true, destaque: true },
      { nome: 'Pexels', desc: 'Fotos e vídeos gratuitos de alta qualidade', gratuito: true },
      { nome: 'Freepik', desc: 'Vetores, ícones e fotos — free com atribuição', gratuito: true },
      { nome: 'Storyset', desc: 'Ilustrações customizáveis gratuitas', gratuito: true },
    ],
  },
];

function FerramentasIATab() {
  return (
    <div className="col gap-5">
      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Suas ferramentas organizadas por categoria — começando pelo que você já tem contratado.
      </p>
      {FERRAMENTAS_IA.map(grupo => (
        <div key={grupo.cat}>
          <div className="row gap-2" style={{ marginBottom: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 22 }}>{grupo.emoji}</span>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 700 }}>{grupo.cat}</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--s-3)' }}>
            {grupo.tools.map(t => (
              <div key={t.nome} style={{
                padding: 'var(--s-3) var(--s-4)',
                borderRadius: 'var(--r-md)',
                background: t.destaque
                  ? `color-mix(in oklch, ${grupo.cor} 20%, var(--bg-surface))`
                  : 'var(--bg-elevated)',
                border: `1.5px solid ${t.destaque ? grupo.cor : 'var(--border)'}`,
              }}>
                <div className="row between" style={{ marginBottom: 6, alignItems: 'center', gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.2 }}>{t.nome}</div>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 999, flexShrink: 0,
                    background: t.pro ? '#fe7dae' : t.gratuito ? '#f1e18d' : '#ffe1bd',
                    color: '#201e1f',
                  }}>{t.pro ? '✓ Você tem' : t.gratuito ? 'Grátis' : 'Pago'}</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, lineHeight: 1.45 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function StudioPage() {
  const [tab, setTab] = useState('agentes');
  const [agenteSel, setAgenteSel] = useState(null);
  const [campos, setCampos] = useState({});
  const [multiListas, setMultiListas] = useState({});
  const [sugestoes, setSugestoes] = useState([]);
  const [loadingSugestoes, setLoadingSugestoes] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [resultado, setResultado] = useState('');
  const [copiado, setCopiado] = useState(false);
  const [modoClaudeAi, setModoClaudeAi] = useState(false);

  const { clientes_lista, clientes_roteiro } = buildClienteLists();

  function selecionarAgente(agente) {
    setAgenteSel(agente);
    setCampos({});
    setMultiListas({});
    setSugestoes([]);
    setResultado('');
  }

  useEffect(() => {
    if (window.STUDIO_AUTOAGENTE) {
      const agente = STUDIO_AGENTS.find(a => a.id === window.STUDIO_AUTOAGENTE);
      if (agente) selecionarAgente(agente);
      window.STUDIO_AUTOAGENTE = null;
    }
  }, []);

  function setcampo(id, val) {
    setCampos(p => ({ ...p, [id]: val }));
  }

  function setMultiItem(id, idx, val) {
    setMultiListas(p => {
      const arr = [...(p[id] || [''])];
      arr[idx] = val;
      return { ...p, [id]: arr };
    });
  }

  function addMultiItem(id) {
    setMultiListas(p => ({ ...p, [id]: [...(p[id] || ['']), ''] }));
  }

  function removeMultiItem(id, idx) {
    setMultiListas(p => {
      const arr = (p[id] || ['']).filter((_, i) => i !== idx);
      return { ...p, [id]: arr.length ? arr : [''] };
    });
  }

  async function pedirSugestoes() {
    const tema = campos['tema'] || '';
    if (!tema.trim()) { showToast('Preencha o tema primeiro'); return; }
    const prompt = `Sugira 5 ângulos de notícias ou artigos recentes que se conectam ao tema: "${tema}".
Para cada sugestão, escreva em uma linha: um título chamativo + traço + uma frase curta explicando a conexão.
Formato: uma sugestão por linha, numeradas de 1 a 5. Seja específico e útil.`;
    if (!window.hasClaudeKey()) {
      try { await navigator.clipboard.writeText(prompt); } catch {}
      window.open('https://claude.ai/new', '_blank');
      showToast('Prompt copiado! Cole no Claude.ai que abriu 👆');
      return;
    }
    setLoadingSugestoes(true);
    setSugestoes([]);
    const resp = await window.callClaude(
      [{ role: 'user', content: prompt }],
      'Você sugere ângulos de notícias para newsletters. Seja direto e útil. Responda em português.',
      'claude-haiku-4-5-20251001',
      600,
    );
    if (resp) {
      setSugestoes(resp.split('\n').filter(l => l.trim().length > 3));
    } else {
      showToast('Erro ao buscar sugestões.');
    }
    setLoadingSugestoes(false);
  }

  function adicionarSugestaoAoMulti(id, texto) {
    setMultiListas(p => {
      const arr = p[id] || [''];
      const novaArr = arr[arr.length - 1]?.trim()
        ? [...arr, texto]
        : [...arr.slice(0, -1), texto];
      return { ...p, [id]: novaArr };
    });
    setSugestoes([]);
  }

  function montarDetalhes() {
    return agenteSel.campos
      .map(c => {
        if (c.tipo === 'multi') {
          const itens = (multiListas[c.id] || []).filter(s => s.trim());
          if (!itens.length) return null;
          return itens.length === 1
            ? `${c.label}: ${itens[0]}`
            : `${c.label}:\n${itens.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
        }
        return campos[c.id]?.trim() ? `${c.label}: ${campos[c.id]}` : null;
      })
      .filter(Boolean)
      .join('\n');
  }

  function montarUserMsg(detalhes) {
    if (agenteSel.id === 'carta')   return `Escreva a newsletter desta semana com estas informações:\n\n${detalhes}`;
    if (agenteSel.id === 'roteiro') return `Crie um roteiro com estas informações:\n\n${detalhes}`;
    if (agenteSel.id === 'blog')    return `Escreva o artigo completo com estas informações:\n\n${detalhes}`;
    return `Crie o conteúdo com estas informações:\n\n${detalhes}`;
  }

  async function gerar() {
    if (!agenteSel) return;

    const obrigatorios = agenteSel.campos.filter(c => c.obrigatorio);
    for (const c of obrigatorios) {
      if (c.tipo === 'multi') {
        const itens = (multiListas[c.id] || ['']).filter(s => s.trim());
        if (!itens.length) { showToast(`Preencha: ${c.label}`); return; }
      } else if (!campos[c.id]?.trim()) {
        showToast(`Preencha: ${c.label}`); return;
      }
    }

    const detalhes = montarDetalhes();
    const systemPrompt = buildSystemPrompt(agenteSel, campos);
    const userMsg = montarUserMsg(detalhes);

    /* ── Sem chave API: abre Claude.ai com o prompt pronto ── */
    if (!window.hasClaudeKey()) {
      const promptCompleto = `${systemPrompt}\n\n---\n\n${userMsg}`;
      try { await navigator.clipboard.writeText(promptCompleto); } catch {}
      window.open('https://claude.ai/new', '_blank');
      setResultado(promptCompleto);
      setModoClaudeAi(true);
      showToast('✅ Prompt copiado! Cole no Claude.ai que abriu agora.');
      return;
    }

    /* ── Com chave API: gera direto aqui ── */
    setGerando(true);
    setResultado('');
    setModoClaudeAi(false);

    const resp = await window.callClaude(
      [{ role: 'user', content: userMsg }],
      systemPrompt,
      'claude-sonnet-4-6',
      3000,
    );

    if (resp) {
      setResultado(resp);
    } else {
      showToast('Erro ao gerar. Verifique sua conexão.');
    }
    setGerando(false);
  }

  function copiar() {
    navigator.clipboard.writeText(resultado).then(() => {
      setCopiado(true);
      showToast('Copiado!');
      setTimeout(() => setCopiado(false), 2500);
    });
  }

  function resolverOpcoes(campo) {
    if (campo.dinamico === 'clientes_lista') return clientes_lista;
    if (campo.dinamico === 'clientes_roteiro') return clientes_roteiro;
    return campo.opcoes || [];
  }

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Studio IA"
          subtitle="Agentes que criam conteúdo com a sua voz"
        />

        {/* Tab bar */}
        <div className="row gap-2" style={{ borderBottom: '2px solid var(--border)', paddingBottom: 0 }}>
          {[
            { id: 'agentes',     label: '🤖 Agentes IA'     },
            { id: 'prompts',     label: '📋 Banco de Prompts' },
            { id: 'ferramentas', label: '✨ Ferramentas'      },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '10px 18px',
                border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                fontSize: 14.5, fontWeight: tab === t.id ? 700 : 500,
                color: tab === t.id ? 'var(--pink-deep)' : 'var(--text-muted)',
                borderBottom: tab === t.id ? '2px solid var(--pink)' : '2px solid transparent',
                marginBottom: -2,
                transition: 'all .15s',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'agentes' && (<React.Fragment>

        {/* Agent cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 'var(--s-3)' }}>
          {STUDIO_AGENTS.map(agente => {
            const ativo = agenteSel?.id === agente.id;
            return (
              <button key={agente.id} onClick={() => selecionarAgente(agente)}
                style={{
                  padding: 'var(--s-4)',
                  borderRadius: 'var(--r-xl)',
                  border: `2px solid ${ativo ? agente.cor : 'var(--border)'}`,
                  background: ativo
                    ? `color-mix(in oklch, ${agente.cor} 10%, var(--white))`
                    : 'var(--bg-surface)',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'all .15s', fontFamily: 'var(--font-body)',
                }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{agente.emoji}</div>
                <div style={{
                  fontFamily: 'var(--font-title)', fontSize: 15, fontWeight: 600,
                  color: ativo ? agente.cor : 'var(--text-primary)',
                }}>{agente.nome}</div>
                <div className="tiny muted" style={{ marginTop: 4 }}>{agente.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Interview form */}
        {agenteSel && (
          <Card>
            <CardBody className="col gap-4">
              <div className="row gap-3" style={{ alignItems: 'center' }}>
                <span style={{
                  fontSize: 26, width: 44, height: 44,
                  background: `color-mix(in oklch, ${agenteSel.cor} 15%, var(--white))`,
                  borderRadius: 'var(--r-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{agenteSel.emoji}</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 600 }}>
                    {agenteSel.nome}
                  </h3>
                  <p className="tiny muted">{agenteSel.desc}</p>
                </div>
              </div>

              <div className="col gap-4">
                {agenteSel.campos.map(campo => {
                  const opcoes = resolverOpcoes(campo);
                  const val = campos[campo.id] || '';
                  const labelEl = (
                    <label style={{
                      fontSize: 13, fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '.05em', color: 'var(--text-secondary)',
                    }}>
                      {campo.label}
                      {campo.obrigatorio && <span style={{ color: agenteSel.cor, marginLeft: 3 }}>*</span>}
                    </label>
                  );

                  if (campo.tipo === 'select') return (
                    <div key={campo.id} className="col gap-1">
                      {labelEl}
                      <select className="select" value={val}
                        onChange={e => setcampo(campo.id, e.target.value)}>
                        <option value="">Selecionar...</option>
                        {opcoes.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                  );

                  if (campo.tipo === 'multi') {
                    const itens = multiListas[campo.id] || [''];
                    return (
                      <div key={campo.id} className="col gap-1">
                        {labelEl}
                        <div className="col gap-2">
                          {itens.map((item, idx) => (
                            <div key={idx} className="row gap-2" style={{ alignItems: 'flex-start' }}>
                              <textarea className="textarea" rows={2}
                                placeholder={campo.placeholder || ''}
                                value={item}
                                onChange={e => setMultiItem(campo.id, idx, e.target.value)}
                                style={{ flex: 1, minHeight: 52 }}
                              />
                              {itens.length > 1 && (
                                <button onClick={() => removeMultiItem(campo.id, idx)}
                                  style={{
                                    flexShrink: 0, width: 28, height: 28, marginTop: 4,
                                    borderRadius: 'var(--r-md)', border: '1px solid var(--border)',
                                    background: 'var(--bg-elevated)', cursor: 'pointer',
                                    fontSize: 14, color: 'var(--text-muted)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  }}>×</button>
                              )}
                            </div>
                          ))}
                          <button onClick={() => addMultiItem(campo.id)}
                            style={{
                              alignSelf: 'flex-start',
                              padding: '4px 12px', borderRadius: 'var(--r-md)',
                              border: `1.5px solid ${agenteSel.cor}`,
                              background: 'transparent',
                              color: agenteSel.cor,
                              fontSize: 13, fontWeight: 600, cursor: 'pointer',
                              fontFamily: 'var(--font-body)',
                            }}>
                            + Adicionar mais
                          </button>
                        </div>
                        {campo.temSugestoes && (
                          <div className="col gap-0" style={{ marginTop: 4 }}>
                            <button onClick={pedirSugestoes} disabled={loadingSugestoes}
                              style={{
                                alignSelf: 'flex-start',
                                padding: '5px 14px', borderRadius: 'var(--r-md)',
                                border: `1.5px solid ${agenteSel.cor}`,
                                background: `color-mix(in oklch, ${agenteSel.cor} 10%, var(--white))`,
                                color: agenteSel.cor,
                                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                fontFamily: 'var(--font-body)',
                                opacity: loadingSugestoes ? 0.6 : 1,
                              }}>
                              {loadingSugestoes ? '⏳ Buscando...' : '✨ Me dê sugestões'}
                            </button>
                            <SugestoesList
                              sugestoes={sugestoes}
                              onSelect={s => adicionarSugestaoAoMulti(campo.id, s)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (campo.tipo === 'textarea') return (
                    <div key={campo.id} className="col gap-1">
                      {labelEl}
                      <textarea className="textarea" rows={3}
                        placeholder={campo.placeholder || ''}
                        value={val}
                        onChange={e => setcampo(campo.id, e.target.value)}
                      />
                    </div>
                  );

                  return (
                    <div key={campo.id} className="col gap-1">
                      {labelEl}
                      <input className="input"
                        placeholder={campo.placeholder || ''}
                        value={val}
                        onChange={e => setcampo(campo.id, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--s-4)' }}>
                <div className="row gap-3" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button variant="primary" onClick={gerar} disabled={gerando}
                    style={{ background: gerando ? undefined : agenteSel.cor, color: '#201e1f' }}>
                    {gerando ? '⏳ Gerando...' : window.hasClaudeKey() ? `✨ ${agenteSel.botao}` : `✨ Gerar no Claude.ai`}
                  </Button>
                  {!window.hasClaudeKey() && (
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Abre o Claude.ai com o prompt pronto para colar
                    </span>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Result */}
        {resultado && (
          <Card style={{ borderTop: `3px solid ${agenteSel?.cor || 'var(--pink)'}` }}>
            <CardBody className="col gap-4">

              {/* Banner modo Claude.ai */}
              {modoClaudeAi && (
                <div style={{
                  padding: '14px 16px', borderRadius: 'var(--r-md)',
                  background: 'color-mix(in oklch, #f1e18d 20%, var(--bg-surface))',
                  border: '1.5px solid #f1e18d',
                  display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                }}>
                  <span style={{ fontSize: 22 }}>📋</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#201e1f' }}>Prompt pronto — já copiado!</div>
                    <div style={{ fontSize: 14, color: '#201e1f', opacity: 0.7, marginTop: 2 }}>
                      Cole no Claude.ai (Ctrl+V) e clique em enviar.
                    </div>
                  </div>
                  <button onClick={() => window.open('https://claude.ai/new', '_blank')}
                    style={{
                      padding: '8px 18px', borderRadius: 999, border: '2px solid #201e1f',
                      background: '#201e1f', color: '#fffcfa', fontSize: 14, fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'var(--font-body)', flexShrink: 0,
                    }}>
                    Abrir Claude.ai ↗
                  </button>
                </div>
              )}

              <div className="row between" style={{ alignItems: 'center' }}>
                <div>
                  <div className="eyebrow" style={{ color: agenteSel?.cor }}>
                    {modoClaudeAi ? 'Prompt gerado' : 'Resultado'}
                  </div>
                  <p className="tiny muted">
                    {modoClaudeAi ? 'Prompt completo pronto para colar no Claude.ai.' : 'Revise, ajuste e copie quando estiver pronto.'}
                  </p>
                </div>
                <div className="row gap-2">
                  {!modoClaudeAi && (
                    <Button variant="ghost" size="sm" onClick={gerar} disabled={gerando}>
                      ↺ Regenerar
                    </Button>
                  )}
                  <Button variant="primary" size="sm" onClick={copiar}
                    style={{ background: copiado ? '#f1e18d' : undefined, color: copiado ? '#201e1f' : undefined }}>
                    {copiado ? '✓ Copiado!' : '📋 Copiar'}
                  </Button>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--border)',
                padding: 'var(--s-4)',
                maxHeight: modoClaudeAi ? 260 : 'none',
                overflow: modoClaudeAi ? 'auto' : 'visible',
              }}>
                <pre style={{
                  whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)',
                  fontSize: 14, lineHeight: 1.75, color: 'var(--text-primary)',
                  margin: 0,
                }}>{resultado}</pre>
              </div>

              <div className="row gap-2">
                <Button variant="ghost" size="sm" onClick={() => { setResultado(''); setModoClaudeAi(false); }}>
                  Limpar
                </Button>
                {modoClaudeAi && (
                  <Button variant="ghost" size="sm" onClick={gerar}>
                    ↺ Montar novamente
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Empty state */}
        {!agenteSel && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 'var(--s-3)', padding: 'var(--s-7) 0',
            color: 'var(--text-muted)',
          }}>
            <span style={{ fontSize: 42 }}>✨</span>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-secondary)' }}>Selecione um agente acima para começar</p>
            <div style={{
              padding: 'var(--s-3) var(--s-4)',
              background: 'color-mix(in oklch, #f1e18d 15%, var(--bg-surface))',
              borderRadius: 'var(--r-md)',
              border: '1px solid #f1e18d',
              maxWidth: 400, textAlign: 'center',
            }}>
              <p style={{ fontSize: 14, color: '#201e1f', lineHeight: 1.6 }}>
                {window.hasClaudeKey()
                  ? '✨ IA integrada ativa — conteúdo gerado direto aqui.'
                  : '✨ Modo Claude.ai — preencha o formulário e clique em Gerar. O prompt abre direto no Claude.ai pronto para usar.'}
              </p>
            </div>
          </div>
        )}

        </React.Fragment>)}

        {/* PROMPTS TAB */}
        {tab === 'prompts' && (
          <PromptsBancoTab />
        )}

        {/* FERRAMENTAS TAB */}
        {tab === 'ferramentas' && (
          <FerramentasIATab />
        )}
      </div>
    </div>
  );
}

window.StudioPage = StudioPage;
