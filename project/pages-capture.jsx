/* ──────────────────────────────────────────────
   pages-capture.jsx — Captura mental, Ideias, Tarefas
   ────────────────────────────────────────────── */

function PageHeader({ title, subtitle, action }) {
  return (
    <div className="row between" style={{ alignItems: 'flex-start', marginBottom: 'var(--s-5)' }}>
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ─────────────────────── CAPTURA ─────────────────────── */
function gerarSugestoes(texto) {
  // Simple keyword-based suggestion engine (no real AI needed)
  const t = texto.toLowerCase();

  // Detect topic
  const isSistema = /sistema|organiz|método|process|rotina|produtividade/i.test(t);
  const isNegocio = /cliente|agência|trabalho|serviço|venda|preço/i.test(t);
  const isConteudo = /video|vídeo|reel|post|content|conteudo|gravar/i.test(t);

  const sugestoes = {
    conteudo: [],
    tarefa: [],
    monetizacao: [],
    ideia: [],
  };

  // Always generate content formats
  sugestoes.conteudo = [
    { tipo: 'Reel (30s)', desc: `Versão rápida: "${texto.slice(0, 40)}..."`, icon: '🎬' },
    { tipo: 'Vídeo longo (YouTube)', desc: `Tutorial detalhado sobre o tema`, icon: '▶️' },
    { tipo: 'Carrossel', desc: `Passo a passo em slides`, icon: '🖼' },
    { tipo: 'Story com texto', desc: `Sequência de 5-7 stories`, icon: '📱' },
    { tipo: 'Newsletter', desc: `E-mail aprofundado sobre o assunto`, icon: '💌' },
  ];

  if (isSistema || isConteudo) {
    sugestoes.tarefa = [
      { desc: 'Escrever roteiro do vídeo', min: 30 },
      { desc: 'Gravar b-roll mostrando o sistema', min: 45 },
      { desc: 'Editar versão curta (Reel)', min: 60 },
    ];
    sugestoes.monetizacao = [
      { desc: 'Mentorias 1:1 usando esse sistema', potencial: 'R$ 200-500/sessão' },
      { desc: 'Mini-curso sobre o método', potencial: 'R$ 97-197' },
      { desc: 'Template para download', potencial: 'R$ 27-47' },
    ];
  }

  if (isNegocio) {
    sugestoes.monetizacao.push(
      { desc: 'Proposta de serviço baseada nisso', potencial: 'Varia' }
    );
  }

  sugestoes.ideia = [
    { desc: `Série de conteúdo sobre ${texto.slice(0, 30)}...` },
    { desc: 'Comparar antes e depois' },
    { desc: 'Fazer ao vivo / live' },
  ];

  return sugestoes;
}

function CapturaPage({ energy }) {
  const [text, setText] = useState('');
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [history, setHistory] = useState([
    {
      id: 'h1', raw: 'preciso lembrar de pedir o boleto da igor giordano, e ainda tenho que escrever a newsletter dessa semana - quem sabe sobre IA?', date: 'Há 2 dias',
      tarefas: 2, ideias: 1,
    },
    {
      id: 'h2', raw: 'domingo, 47 ideias, zero energia. boa pra um reel.', date: 'Há 5 dias',
      tarefas: 0, ideias: 1,
    },
  ]);
  const e = window.ENERGY[energy];

  async function handleProcess() {
    if (!text.trim()) return;
    setProcessando(true);
    setResultado(null);
    if (window.DB && window.DB.saveCaptura) window.DB.saveCaptura(text, energy);

    if (window.hasClaudeKey && window.hasClaudeKey()) {
      const resp = await window.callClaude([{
        role: 'user',
        content: `Ideia capturada: "${text}"\n\nGere sugestões criativas em JSON com esta estrutura exata:\n{"conteudo":[{"tipo":"Reel 30s","desc":"...","icon":"🎬"},...],"tarefa":[{"desc":"...","min":15},...],"monetizacao":[{"desc":"...","potencial":"R$ X-Y"},...],"ideia":[{"desc":"..."},...]}\n\nCada array deve ter 3-5 itens relevantes para uma criadora de conteúdo e dona de agência. Responda APENAS o JSON válido.`,
      }],
      'Você é uma assistente criativa para Lorenna, criadora de conteúdo e dona da Agência Logue. Gere sugestões práticas e acionáveis.',
      'claude-haiku-4-5-20251001');

      if (resp) {
        try {
          const jsonStr = resp.match(/\{[\s\S]*\}/)?.[0];
          if (jsonStr) {
            setResultado(JSON.parse(jsonStr));
            setProcessando(false);
            return;
          }
        } catch {}
      }
    }

    setTimeout(() => {
      setResultado(gerarSugestoes(text));
      setProcessando(false);
    }, 800);
  }

  function handleNova() {
    setText('');
    setResultado(null);
    setProcessando(false);
  }

  function handleSalvarIdeias() {
    setHistory(prev => [{
      id: crypto.randomUUID(), raw: text, date: 'Agora',
      tarefas: resultado.tarefa.length, ideias: resultado.ideia.length,
    }, ...prev]);
    showToast('Ideias salvas no Banco de Ideias!');
  }

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Baú de Ideias"
          subtitle="Joga tudo aqui. Pensamento bagunçado, ideia solta, to-do. A IA organiza."
        />

        {!resultado && !processando && (
          <Card variant="elevated" style={{ overflow: 'hidden' }}>
            <div style={{ height: 3, background: e.color }}/>
            <CardBody className="col gap-3">
              <div className="row gap-2">
                <span style={{ fontSize: 15 }}>{e.emoji}</span>
                <span className="small secondary">Modo {e.label} — {e.desc}</span>
              </div>
              <textarea
                className="textarea"
                value={text}
                onChange={ev => setText(ev.target.value)}
                placeholder={`Pode começar de qualquer forma…\n\n"Preciso criar o roteiro do reel de branding, mas antes disso tenho que entregar os posts da academia essa semana. Ah, tive uma ideia incrível sobre análise de marcas no TikTok…"`}
                style={{ minHeight: 200 }}
                onKeyDown={ev => {
                  if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') handleProcess();
                }}
              />
              <div className="row between">
                <Button variant="ghost" size="sm" disabled style={{ opacity: 0.5 }}>
                  <Icon name="mic" size={13}/> Áudio (em breve)
                </Button>
                <div className="row gap-3">
                  <span className="tiny muted">⌘ + Enter</span>
                  <Button variant="primary" onClick={handleProcess} disabled={!text.trim()}>
                    <Icon name="send" size={13} color="white"/>
                    Processar com IA
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {processando && (
          <Card variant="elevated">
            <CardBody>
              <div className="center col gap-2" style={{ padding: 'var(--s-6)' }}>
                <div style={{ fontSize: 28 }}>✨</div>
                <p className="small muted">Processando sua ideia...</p>
              </div>
            </CardBody>
          </Card>
        )}

        {resultado && (
          <div className="col gap-4 fade-up">
            {/* Header with actions */}
            <div className="row between" style={{ alignItems: 'center' }}>
              <div className="row gap-2">
                <span style={{ fontSize: 18 }}>✨</span>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 600, margin: 0 }}>
                  Sugestões geradas
                </h2>
              </div>
              <div className="row gap-2">
                <Button variant="ghost" size="sm" onClick={handleNova}>
                  <Icon name="plus" size={13}/> Capturar nova ideia
                </Button>
                <Button variant="primary" size="sm" onClick={handleSalvarIdeias}>
                  <Icon name="check" size={13} color="white"/> Salvar ideias
                </Button>
              </div>
            </div>

            {/* Formatos de conteúdo */}
            <Card variant="elevated">
              <CardHeader>
                <div className="row gap-2">
                  <span>🎬</span>
                  <span className="eyebrow" style={{ color: 'var(--pink-deep)' }}>Formatos de conteúdo</span>
                </div>
              </CardHeader>
              <CardBody>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
                  {resultado.conteudo.map((c, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 14px', borderRadius: 'var(--r-md)',
                      background: 'var(--pink-tint)', border: '1px solid var(--pink-soft)',
                      flex: '1 1 180px',
                    }}>
                      <span style={{ fontSize: 16 }}>{c.icon}</span>
                      <div>
                        <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--pink-deep)' }}>{c.tipo}</div>
                        <div className="tiny muted" style={{ marginTop: 2 }}>{c.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Tarefas sugeridas */}
            {resultado.tarefa.length > 0 && (
              <Card variant="elevated">
                <CardHeader>
                  <div className="row gap-2">
                    <span>⚡</span>
                    <span className="eyebrow" style={{ color: 'var(--pink-deep)' }}>Tarefas sugeridas</span>
                  </div>
                </CardHeader>
                <CardBody>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }} className="col gap-2">
                    {resultado.tarefa.map((t, i) => (
                      <li key={i} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderRadius: 'var(--r-md)',
                        background: 'var(--bg-surface)', border: '1px solid var(--border)',
                      }}>
                        <div className="row gap-2">
                          <span style={{ color: 'var(--pink-deep)', fontSize: 14 }}>→</span>
                          <span style={{ fontSize: 14 }}>{t.desc}</span>
                        </div>
                        <Badge variant="pink">{t.min} min</Badge>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            )}

            {/* Oportunidades de monetização */}
            {resultado.monetizacao.length > 0 && (
              <Card variant="elevated">
                <CardHeader>
                  <div className="row gap-2">
                    <span>💰</span>
                    <span className="eyebrow" style={{ color: 'var(--pink-deep)' }}>Oportunidades de monetização</span>
                  </div>
                </CardHeader>
                <CardBody>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--s-3)' }}>
                    {resultado.monetizacao.map((m, i) => (
                      <div key={i} style={{
                        padding: '12px 14px', borderRadius: 'var(--r-md)',
                        background: 'var(--bg-surface)', border: '1px solid var(--border)',
                      }} className="col gap-1">
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{m.desc}</span>
                        <span style={{ fontSize: 14, color: 'var(--pink-deep)', fontWeight: 600 }}>{m.potencial}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Mais ideias relacionadas */}
            <Card variant="elevated">
              <CardHeader>
                <div className="row gap-2">
                  <span>💡</span>
                  <span className="eyebrow" style={{ color: 'var(--pink-deep)' }}>Mais ideias relacionadas</span>
                </div>
              </CardHeader>
              <CardBody>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }} className="col gap-2">
                  {resultado.ideia.map((id, i) => (
                    <li key={i} className="row gap-2" style={{ alignItems: 'flex-start', padding: '6px 0' }}>
                      <span style={{ color: 'var(--e-social)', fontSize: 14, marginTop: 3 }}>→</span>
                      <span style={{ fontSize: 14, lineHeight: 1.4 }}>{id.desc}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        )}

        {history.length > 0 && (
          <div>
            <div className="row gap-2" style={{ marginBottom: 'var(--s-3)' }}>
              <Icon name="archive" size={13} color="var(--text-muted)" />
              <span className="eyebrow">Histórico de capturas</span>
            </div>
            <div className="col gap-2">
              {history.map(h => (
                <Card key={h.id} hoverable>
                  <CardBody tight>
                    <div className="row between" style={{ alignItems: 'flex-start' }}>
                      <div className="grow">
                        <p style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--text-primary)' }}>{h.raw}</p>
                        <div className="row gap-2" style={{ marginTop: 6 }}>
                          {h.tarefas > 0 && <Badge variant="pink">{h.tarefas} tarefa{h.tarefas>1?'s':''}</Badge>}
                          {h.ideias > 0 && <Badge variant="yellow">{h.ideias} ideia{h.ideias>1?'s':''}</Badge>}
                        </div>
                      </div>
                      <span className="tiny muted" style={{ flexShrink: 0 }}>{h.date}</span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────── IDEIAS ─────────────────────── */
function IdeiasPage() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('todas');
  const [st, setSt] = useState('todos');

  const all = window.DEMO_IDEAS;
  const filtered = all.filter(i => {
    const okS = !search || i.titulo.toLowerCase().includes(search.toLowerCase());
    const okC = cat === 'todas' || i.categoria === cat;
    const okSt = st === 'todos' || i.status === st;
    return okS && okC && okSt;
  });

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Acervo de Conteúdo"
          subtitle={`${all.length} ideias guardadas · ${all.filter(i => i.status === 'pronta').length} prontas pra usar`}
          action={<Button variant="primary"><Icon name="plus" size={14} color="white"/> Nova ideia</Button>}
        />

        {/* Filters */}
        <div className="row gap-3" style={{ flexWrap: 'wrap' }}>
          <div className="row gap-2" style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--r-md)', padding: '8px 12px',
            flex: 1, minWidth: 220, maxWidth: 320,
          }}>
            <Icon name="search" size={13} color="var(--text-muted)" />
            <input className="grow" style={{ background:'transparent', border:'none', fontSize: 14 }}
              placeholder="Buscar ideias..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="select" style={{ width: 'auto', minWidth: 180 }} value={cat} onChange={e => setCat(e.target.value)}>
            <option value="todas">Todas categorias</option>
            {Object.entries(window.CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select className="select" style={{ width: 'auto', minWidth: 160 }} value={st} onChange={e => setSt(e.target.value)}>
            <option value="todos">Todos status</option>
            {Object.entries(window.STATUS_IDEIA).map(([v, l]) => <option key={v} value={v}>{l.label}</option>)}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--s-3)' }}>
          {filtered.map(i => {
            const cfg = window.STATUS_IDEIA[i.status];
            return (
              <Card key={i.id} hoverable>
                <CardBody className="col gap-3">
                  <div className="row between" style={{ alignItems: 'flex-start' }}>
                    <p style={{ fontSize: 14.5, fontWeight: 500, lineHeight: 1.4, flex: 1 }}>{i.titulo}</p>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>
                  {i.desc && <p className="small secondary" style={{ lineHeight: 1.5 }}>{i.desc}</p>}
                  <div className="row between" style={{ flexWrap: 'wrap', gap: 4 }}>
                    <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                      <Badge>{window.CATEGORY_LABELS[i.categoria]}</Badge>
                      {i.plataformas.map(p => (
                        <span key={p} className="tiny" style={{
                          padding: '2px 8px', borderRadius: 999,
                          background: `color-mix(in oklch, ${window.PLATFORM_COLORS[p]} 16%, transparent)`,
                          color: window.PLATFORM_COLORS[p], fontWeight: 500,
                        }}>{window.PLATFORM_LABELS[p]}</span>
                      ))}
                    </div>
                    {i.conexoes > 0 && <span className="tiny muted">{i.conexoes} conexão{i.conexoes>1?'ões':''}</span>}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="center" style={{ padding: 'var(--s-7) 0' }}>
            <Icon name="bulb" size={32} color="var(--text-muted)"/>
            <p className="muted small" style={{ marginTop: 8 }}>Nenhuma ideia bate com esses filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────── TAREFAS ─────────────────────── */
function TarefasPage() {
  const [filter, setFilter] = useState('todas');
  const [clientFilter, setClientFilter] = useState('todos');
  const [deletedIds, setDeletedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lorenna_deleted_tasks') || '[]'); } catch { return []; }
  });

  const todayIdx = (new Date().getDay() + 6) % 7; // 0=Seg…6=Dom
  const DIAS_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const DIAS_COLORS = ['#fec9df', '#f0bff8', '#bce1f6', '#f1e18d', '#ffe1bd', '#fe7dae', '#fec9df'];

  function deleteTask(id) {
    const next = [...deletedIds, id];
    setDeletedIds(next);
    localStorage.setItem('lorenna_deleted_tasks', JSON.stringify(next));
    showToast('Tarefa removida');
  }

  const all = window.DEMO_TASKS.filter(t => !deletedIds.includes(t.id));

  const countUrgente  = all.filter(t => t.prioridade === 'urgente' && t.status !== 'concluida').length;
  const countHoje     = all.filter(t => t.status !== 'concluida' && (t.diario || (t.diasDaSemana && t.diasDaSemana.includes(todayIdx)))).length;
  const countProgresso = all.filter(t => t.status === 'em_progresso').length;

  const filtered = all.filter(t => {
    let okFilter = true;
    if      (filter === 'hoje')      okFilter = t.diario || (t.diasDaSemana && t.diasDaSemana.includes(todayIdx));
    else if (filter === 'urgente')   okFilter = t.prioridade === 'urgente' && t.status !== 'concluida';
    else if (filter === 'semana')    okFilter = (t.recorrente || (t.diasDaSemana && t.diasDaSemana.length > 0)) && t.status !== 'concluida';
    else if (filter === 'progresso') okFilter = t.status === 'em_progresso';
    else if (filter === 'concluidas') okFilter = t.status === 'concluida';
    else                             okFilter = t.status !== 'concluida';

    let okCliente = true;
    if      (clientFilter === 'pessoal') okCliente = !t.cliente;
    else if (clientFilter !== 'todos')   okCliente = t.cliente === clientFilter;

    return okFilter && okCliente;
  });

  const STATUS_FILTERS = [
    { key: 'todas',      label: 'Todas ativas'    },
    { key: 'hoje',       label: '📅 Hoje'          },
    { key: 'urgente',    label: '🔴 Urgente'       },
    { key: 'semana',     label: 'Esta semana'     },
    { key: 'progresso',  label: '⚡ Em andamento'  },
    { key: 'concluidas', label: '✓ Concluídas'    },
  ];

  const CLIENTES = [
    { key: 'todos',                   label: 'Todos'        },
    { key: 'Pratique',                label: 'Pratique'     },
    { key: 'Jornal Cidades Minerais', label: 'Jornal CM'    },
    { key: 'Ótica Igor Giordano',     label: 'Ótica Igor'   },
    { key: 'Espaço Criar',            label: 'Espaço Criar' },
    { key: 'pessoal',                 label: 'Pessoal'      },
  ];

  const GROUPS = [
    { key: 'urgente', label: 'Urgente',          color: '#fe7dae', sub: 'Faz hoje, sem desculpa'  },
    { key: 'alta',    label: 'Alta prioridade',  color: '#ffe1bd', sub: 'Importante esta semana'  },
    { key: 'media',   label: 'Média',            color: '#bce1f6', sub: 'Quando der espaço'       },
    { key: 'baixa',   label: 'Baixa',            color: '#f1e18d', sub: 'Sem pressa'              },
  ];

  const STAT_CHIPS = [
    { label: 'Urgentes',     count: countUrgente,   color: '#fe7dae', filterKey: 'urgente'  },
    { label: 'Hoje',         count: countHoje,      color: '#bce1f6', filterKey: 'hoje'     },
    { label: 'Em andamento', count: countProgresso, color: '#f1e18d', filterKey: 'progresso'},
  ];

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Tarefas"
          subtitle="Gerencie suas entregas com clareza"
          action={<Button variant="primary"><Icon name="plus" size={14} color="white"/> Nova tarefa</Button>}
        />

        {/* Stats strip — clickable */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s-3)' }}>
          {STAT_CHIPS.map(s => (
            <button key={s.label} onClick={() => setFilter(s.filterKey)} style={{
              background: filter === s.filterKey ? '#201e1f' : s.color,
              borderRadius: 'var(--r-lg)', padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: 12,
              border: 'none', cursor: 'pointer', textAlign: 'left',
              transition: 'all .15s',
              outline: filter === s.filterKey ? `3px solid ${s.color}` : 'none',
            }}>
              <div>
                <div style={{ fontSize: 28, fontFamily: 'var(--font-title)', fontWeight: 800, color: filter === s.filterKey ? s.color : '#201e1f', lineHeight: 1 }}>{s.count}</div>
                <div style={{ fontSize: 14, color: filter === s.filterKey ? '#fffcfa' : '#201e1f', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Filter chips */}
        <div className="col gap-2">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {STATUS_FILTERS.map(({ key, label }) => (
              <button key={key} onClick={() => setFilter(key)} style={{
                fontSize: 14, padding: '8px 18px', borderRadius: 999,
                border: '1.5px solid',
                background: filter === key ? '#201e1f' : 'var(--white)',
                borderColor: filter === key ? '#201e1f' : 'var(--gray-light)',
                color: filter === key ? '#fffcfa' : '#201e1f',
                cursor: 'pointer', fontWeight: filter === key ? 700 : 500,
                fontFamily: 'var(--font-body)', transition: 'all .15s',
              }}>{label}</button>
            ))}
          </div>

          {/* Client chips */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {CLIENTES.map(({ key, label }) => (
              <button key={key} onClick={() => setClientFilter(key)} style={{
                fontSize: 13, padding: '5px 13px', borderRadius: 999,
                border: '1.5px solid',
                background: clientFilter === key ? '#fe7dae' : 'var(--bg-surface)',
                borderColor: clientFilter === key ? '#fe7dae' : 'var(--gray-light)',
                color: '#201e1f',
                cursor: 'pointer', fontWeight: clientFilter === key ? 700 : 400,
                fontFamily: 'var(--font-body)', transition: 'all .15s',
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="center col gap-2" style={{ padding: 'var(--s-7) 0' }}>
            <div style={{ fontSize: 38 }}>🌸</div>
            <p className="small muted">Nenhuma tarefa com esses filtros. Respira.</p>
          </div>
        )}

        {/* Priority groups */}
        {GROUPS.map(g => {
          const items = filtered.filter(t => t.prioridade === g.key);
          if (items.length === 0) return null;
          return (
            <section key={g.key} className="col gap-3">
              {/* Group header */}
              <div style={{
                background: `color-mix(in oklch, ${g.color} 40%, white)`,
                borderRadius: 'var(--r-md)',
                padding: '10px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderLeft: `4px solid ${g.color}`,
              }}>
                <div className="row gap-2" style={{ alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 700, color: '#201e1f' }}>{g.label}</span>
                  <span style={{ fontSize: 13, color: '#201e1f', opacity: 0.6 }}>· {g.sub}</span>
                </div>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: '#201e1f',
                  background: `color-mix(in oklch, ${g.color} 65%, white)`,
                  padding: '3px 10px', borderRadius: 999,
                }}>{items.length} tarefa{items.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Task cards with metadata */}
              <div className="col gap-4" style={{ paddingLeft: 4 }}>
                {items.map(t => (
                  <div key={t.id} className="col gap-1">
                    {/* Metadata bar */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, paddingLeft: 4, alignItems: 'center' }}>
                      {t.diario && (
                        <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, background: '#fec9df', color: '#201e1f', fontWeight: 600 }}>📅 Diário</span>
                      )}
                      {(t.diasDaSemana || []).map(d => (
                        <span key={d} style={{
                          fontSize: 12, padding: '2px 8px', borderRadius: 999,
                          background: d === todayIdx ? '#201e1f' : DIAS_COLORS[d],
                          color: d === todayIdx ? '#fffcfa' : '#201e1f',
                          fontWeight: d === todayIdx ? 700 : 500,
                        }}>{d === todayIdx ? '● ' : ''}{DIAS_LABELS[d]}</span>
                      ))}
                      {(t.energia || []).map(e => {
                        const ec = window.ENERGY[e];
                        return ec ? (
                          <span key={e} style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, background: 'var(--bg-surface)', color: '#201e1f', border: '1px solid var(--border)' }}>
                            {ec.emoji} {ec.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <TaskRow task={t} onDelete={deleteTask} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { CapturaPage, IdeiasPage, TarefasPage, PageHeader });
