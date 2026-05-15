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
function CapturaPage({ energy }) {
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
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

  function handleProcess() {
    if (!text.trim()) return;
    setProcessing(true);
    setResult(null);
    // simulate AI processing
    setTimeout(() => {
      const tasks = [];
      const ideas = [];
      const lower = text.toLowerCase();
      // naive heuristic for demo
      const sentences = text.split(/[\n.,;]/).map(s => s.trim()).filter(s => s.length > 8);
      sentences.forEach(s => {
        if (/preciso|tenho que|fazer|criar|escrever|entregar|enviar|gravar|agendar|responder/i.test(s)) {
          tasks.push(s.charAt(0).toUpperCase() + s.slice(1));
        } else if (/ideia|seria legal|podia|pensei|série|reel|post|frase/i.test(s)) {
          ideas.push(s.charAt(0).toUpperCase() + s.slice(1));
        }
      });
      if (tasks.length === 0 && sentences.length > 0) tasks.push(sentences[0].charAt(0).toUpperCase() + sentences[0].slice(1));
      const cats = [];
      if (/branding|marca/i.test(lower)) cats.push('branding');
      if (/cliente|pratique|óptica|espaço|jornal/i.test(lower)) cats.push('cliente');
      if (/ia|claude|chatgpt/i.test(lower)) cats.push('inteligencia_artificial');
      setResult({
        tasks, ideas, categories: cats,
        summary: sentences.length > 1 ? `${tasks.length} tarefa(s), ${ideas.length} ideia(s) — bagunça organizada.` : '',
      });
      setProcessing(false);
    }, 900);
  }

  function handleSave() {
    setHistory(prev => [{
      id: crypto.randomUUID(), raw: text, date: 'Agora',
      tarefas: result.tasks.length, ideias: result.ideas.length,
    }, ...prev]);
    showToast(`${result.tasks.length} tarefa(s) e ${result.ideas.length} ideia(s) salvas!`);
    setText('');
    setResult(null);
  }

  return (
    <div className="content" style={{ maxWidth: 880 }}>
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Baú de Ideias"
          subtitle="Joga tudo aqui. Pensamento bagunçado, ideia solta, to-do. A IA organiza."
        />

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
              onChange={e => setText(e.target.value)}
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
                <Button variant="primary" onClick={handleProcess} disabled={!text.trim() || processing}>
                  <Icon name="send" size={13} color="white"/>
                  {processing ? 'Processando…' : 'Processar com IA'}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {result && (
          <Card variant="accent" className="fade-up">
            <CardHeader>
              <div className="row between">
                <div className="row gap-2">
                  <Icon name="zap" size={16} color="var(--pink-deep)" />
                  <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 600 }}>Resultado da IA</h2>
                </div>
                <Button variant="primary" size="sm" onClick={handleSave}>
                  <Icon name="check" size={13} color="white"/> Salvar tudo
                </Button>
              </div>
              {result.summary && <p className="small secondary" style={{ marginTop: 8, fontStyle: 'italic' }}>"{result.summary}"</p>}
            </CardHeader>
            <CardBody style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-5)' }}>
              <div>
                <div className="eyebrow row gap-2" style={{ marginBottom: 'var(--s-2)' }}>
                  <span style={{ color: 'var(--pink-deep)' }}>⚡</span> {result.tasks.length} tarefa(s)
                </div>
                {result.tasks.length === 0 ? <p className="small muted">Nenhuma tarefa detectada.</p> : (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }} className="col gap-2">
                    {result.tasks.map((t, i) => (
                      <li key={i} className="row gap-2" style={{ alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--pink-deep)', fontSize: 12, marginTop: 2 }}>→</span>
                        <span style={{ fontSize: 13, lineHeight: 1.4 }}>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <div className="eyebrow row gap-2" style={{ marginBottom: 'var(--s-2)' }}>
                  <span>💡</span> {result.ideas.length} ideia(s)
                </div>
                {result.ideas.length === 0 ? <p className="small muted">Nenhuma ideia detectada.</p> : (
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }} className="col gap-2">
                    {result.ideas.map((t, i) => (
                      <li key={i} className="row gap-2" style={{ alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--e-social)', fontSize: 12, marginTop: 2 }}>→</span>
                        <span style={{ fontSize: 13, lineHeight: 1.4 }}>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardBody>
          </Card>
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
                        <p style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--text-primary)' }}>{h.raw}</p>
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
            <input className="grow" style={{ background:'transparent', border:'none', fontSize: 13 }}
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
                    <p style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.4, flex: 1 }}>{i.titulo}</p>
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
  const [filter, setFilter] = useState('ativas');
  const [energyFilter, setEnergyFilter] = useState('todas');

  const all = window.DEMO_TASKS;
  const filtered = all.filter(t => {
    const okStatus = filter === 'ativas' ? t.status !== 'concluida' : filter === 'concluidas' ? t.status === 'concluida' : true;
    const okEnergy = energyFilter === 'todas' || t.energia.includes(energyFilter);
    return okStatus && okEnergy;
  });

  const groups = [
    { key: 'urgente', label: 'Urgente',         color: '#C44878', sub: 'Faz hoje sem desculpa', dot: true  },
    { key: 'alta',    label: 'Alta prioridade', color: '#E89B4C', sub: 'Importante esta semana', dot: false },
    { key: 'media',   label: 'Média',           color: 'var(--pink)', sub: 'Quando der',          dot: false },
    { key: 'baixa',   label: 'Baixa',           color: '#7FB68C', sub: 'Sem pressa',              dot: false },
  ];

  const stats = {
    ativas:      all.filter(t => t.status !== 'concluida').length,
    concluidas:  all.filter(t => t.status === 'concluida').length,
    progresso:   all.filter(t => t.status === 'em_progresso').length,
  };

  return (
    <div className="content" style={{ maxWidth: 880 }}>
      <div className="col gap-6 fade-up">
        <PageHeader
          title="Tarefas"
          subtitle={`${stats.ativas} ativas · ${stats.progresso} em progresso · ${stats.concluidas} concluídas`}
          action={<Button variant="primary"><Icon name="plus" size={14} color="white"/> Nova tarefa</Button>}
        />

        {/* Filters — soft row */}
        <div className="row between" style={{ flexWrap: 'wrap', gap: 'var(--s-3)' }}>
          <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
            {[
              ['ativas',     'Ativas'],
              ['concluidas', 'Concluídas'],
              ['todas',      'Todas'],
            ].map(([s, l]) => (
              <button key={s} onClick={() => setFilter(s)}
                style={{
                  fontSize: 12.5, padding: '8px 16px', borderRadius: 15,
                  border: '1px solid',
                  background: filter === s ? 'var(--pink-tint)' : 'var(--white)',
                  borderColor: filter === s ? 'var(--pink-soft)' : 'var(--gray-light)',
                  color: filter === s ? 'var(--pink-deep)' : 'var(--ink-soft)',
                  cursor: 'pointer', fontWeight: filter === s ? 600 : 500,
                  fontFamily: 'var(--font-body)',
                }}>{l}</button>
            ))}
          </div>
          <select className="select" style={{ width: 'auto', padding: '8px 14px', fontSize: 12.5 }}
            value={energyFilter} onChange={e => setEnergyFilter(e.target.value)}>
            <option value="todas">Todas energias</option>
            {window.ENERGY_LIST.map(e => <option key={e.id} value={e.id}>{e.emoji} {e.label}</option>)}
          </select>
        </div>

        {/* Empty */}
        {filtered.length === 0 && (
          <div className="center" style={{ padding: 'var(--s-7) 0', color: 'var(--gray)' }}>
            <div style={{ fontSize: 38, marginBottom: 8 }}>🌸</div>
            <p className="small">Nenhuma tarefa por aqui agora. Respira.</p>
          </div>
        )}

        {/* Priority groups — vertical, generous spacing */}
        {groups.map(g => {
          const items = filtered.filter(t => t.prioridade === g.key);
          if (items.length === 0) return null;
          return (
            <section key={g.key} className="col gap-3">
              <div className="row between" style={{ borderBottom: '1px solid var(--gray-light)', paddingBottom: 'var(--s-3)' }}>
                <div className="row gap-3">
                  <span style={{
                    width: 10, height: 10, borderRadius: 999, background: g.color, marginTop: 6,
                  }} className={g.dot ? 'pulse-dot' : ''}/>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 600, color: g.color, letterSpacing: '-0.02em' }}>
                      {g.label}
                    </h3>
                    <p className="tiny muted" style={{ marginTop: 2 }}>{g.sub} · {items.length}</p>
                  </div>
                </div>
              </div>
              <div className="col gap-3">
                {items.map(t => <TaskRow key={t.id} task={t}/>)}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { CapturaPage, IdeiasPage, TarefasPage, PageHeader });
