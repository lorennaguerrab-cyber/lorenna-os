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
    cor: '#FF78B0',
    botao: 'Escrever newsletter',
    campos: [
      { id: 'tema',     label: 'Tema da semana',             tipo: 'text',     placeholder: 'Ex: sobre deixar de agradar todo mundo', obrigatorio: true },
      { id: 'cena',     label: 'Cena real da sua semana',    tipo: 'textarea', placeholder: 'Uma situação que aconteceu e conecta ao tema...', obrigatorio: true },
      { id: 'noticias', label: 'Notícia relacionada',        tipo: 'textarea', placeholder: 'Cole link ou texto — ou clique em "Me dê sugestões"', temSugestoes: true },
      { id: 'blog',     label: 'Post do blog desta semana',  tipo: 'text',     placeholder: 'Título ou URL (opcional)' },
      { id: 'cta',      label: 'CTA final',                  tipo: 'text',     placeholder: 'Ex: Me conta: você também faz isso?', obrigatorio: true },
    ],
  },
  {
    id: 'roteiro',
    nome: 'Roteirista',
    emoji: '🎬',
    desc: 'Roteiros para reels, YouTube e UGC',
    cor: '#7FB68C',
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
    id: 'post_cliente',
    nome: 'Post de Cliente',
    emoji: '✨',
    desc: 'Captions e copies com a voz do cliente',
    cor: '#A89AC9',
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

function StudioPage() {
  const [agenteSel, setAgenteSel] = useState(null);
  const [campos, setCampos] = useState({});
  const [sugestoes, setSugestoes] = useState([]);
  const [loadingSugestoes, setLoadingSugestoes] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [resultado, setResultado] = useState('');
  const [copiado, setCopiado] = useState(false);

  const { clientes_lista, clientes_roteiro } = buildClienteLists();

  function selecionarAgente(agente) {
    setAgenteSel(agente);
    setCampos({});
    setSugestoes([]);
    setResultado('');
  }

  function setcampo(id, val) {
    setCampos(p => ({ ...p, [id]: val }));
  }

  async function pedirSugestoes() {
    const tema = campos['tema'] || '';
    if (!tema.trim()) { showToast('Preencha o tema primeiro'); return; }
    if (!window.hasClaudeKey()) { showToast('Configure a chave da API Claude primeiro'); return; }
    setLoadingSugestoes(true);
    setSugestoes([]);
    const prompt = `Sugira 5 ângulos de notícias ou artigos recentes que se conectam ao tema: "${tema}".
Para cada sugestão, escreva em uma linha: um título chamativo + traço + uma frase curta explicando a conexão.
Formato: uma sugestão por linha, numeradas de 1 a 5. Seja específico e útil.`;
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

  async function gerar() {
    if (!agenteSel) return;
    if (!window.hasClaudeKey()) { showToast('Configure a chave da API Claude primeiro'); return; }

    const obrigatorios = agenteSel.campos.filter(c => c.obrigatorio);
    for (const c of obrigatorios) {
      if (!campos[c.id]?.trim()) { showToast(`Preencha: ${c.label}`); return; }
    }

    setGerando(true);
    setResultado('');

    const detalhes = agenteSel.campos
      .filter(c => campos[c.id]?.trim())
      .map(c => `${c.label}: ${campos[c.id]}`)
      .join('\n');

    const systemPrompt = buildSystemPrompt(agenteSel, campos);
    const userMsg = agenteSel.id === 'carta'
      ? `Escreva a newsletter desta semana com estas informações:\n\n${detalhes}`
      : agenteSel.id === 'roteiro'
      ? `Crie um roteiro com estas informações:\n\n${detalhes}`
      : `Crie um post com estas informações:\n\n${detalhes}`;

    const resp = await window.callClaude(
      [{ role: 'user', content: userMsg }],
      systemPrompt,
      'claude-sonnet-4-6',
      3000,
    );

    if (resp) {
      setResultado(resp);
    } else {
      showToast('Erro ao gerar. Verifique sua chave da API.');
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

                  if (campo.tipo === 'textarea') return (
                    <div key={campo.id} className="col gap-1">
                      {labelEl}
                      <textarea className="textarea" rows={3}
                        placeholder={campo.placeholder || ''}
                        value={val}
                        onChange={e => setcampo(campo.id, e.target.value)}
                      />
                      {campo.temSugestoes && (
                        <div className="col gap-0">
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
                            onSelect={s => { setcampo(campo.id, s); setSugestoes([]); }}
                          />
                        </div>
                      )}
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
                <Button variant="primary" onClick={gerar} disabled={gerando}
                  style={{ background: gerando ? undefined : agenteSel.cor }}>
                  {gerando ? '⏳ Gerando...' : `✨ ${agenteSel.botao}`}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Result */}
        {resultado && (
          <Card style={{ borderTop: `3px solid ${agenteSel?.cor || 'var(--pink)'}` }}>
            <CardBody className="col gap-4">
              <div className="row between" style={{ alignItems: 'center' }}>
                <div>
                  <div className="eyebrow" style={{ color: agenteSel?.cor }}>Resultado</div>
                  <p className="tiny muted">Revise, ajuste e copie quando estiver pronto.</p>
                </div>
                <div className="row gap-2">
                  <Button variant="ghost" size="sm" onClick={gerar} disabled={gerando}>
                    ↺ Regenerar
                  </Button>
                  <Button variant="primary" size="sm" onClick={copiar}
                    style={{ background: copiado ? '#7FB68C' : undefined }}>
                    {copiado ? '✓ Copiado!' : '📋 Copiar'}
                  </Button>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--border)',
                padding: 'var(--s-4)',
              }}>
                <pre style={{
                  whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)',
                  fontSize: 14, lineHeight: 1.75, color: 'var(--text-primary)',
                  margin: 0,
                }}>{resultado}</pre>
              </div>

              <div className="row gap-2">
                <Button variant="ghost" size="sm" onClick={() => { setResultado(''); }}>
                  Limpar
                </Button>
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
            <p className="small muted">Selecione um agente acima para começar</p>
            {!window.hasClaudeKey() && (
              <div style={{
                padding: 'var(--s-3) var(--s-4)',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--border)',
                maxWidth: 380, textAlign: 'center',
              }}>
                <p className="tiny muted">
                  🤖 Configure sua chave da API Claude clicando no botão <strong>🤖</strong> no canto inferior direito.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

window.StudioPage = StudioPage;
