/* ──────────────────────────────────────────────
   pages-content.jsx — Conteúdo, Prompts
   ────────────────────────────────────────────── */

/* ─────────────────────── CONTEÚDO ─────────────────────── */
const KANBAN_COLS = ['ideia', 'rascunho', 'filmando', 'editando', 'revisao', 'agendado', 'publicado'];

function ConteudoPage() {
  const [view, setView] = useState('kanban');
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState(() => { const b = window.__presetBrand; window.__presetBrand = null; return b || 'todos'; });
  const data = window.DEMO_CONTENT;
  const filtered = data.filter(c => {
    const okS = !search || c.titulo.toLowerCase().includes(search.toLowerCase());
    const okB = brand === 'todos' || c.brand === brand;
    return okS && okB;
  });

  return (
    <div className="content" style={{ maxWidth: 1200 }}>
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Central de Conteúdo"
          subtitle={`${data.length} conteúdos · ${data.filter(c => c.status==='publicado').length} publicados`}
          action={
            <div className="row gap-2">
              <div className="row" style={{ background:'var(--bg-elevated)', borderRadius:'var(--r-md)', padding:3, gap:2 }}>
                <button onClick={() => setView('kanban')} className="btn icon"
                  style={{ padding:6, background: view==='kanban'?'var(--bg-surface)':'transparent', boxShadow: view==='kanban'?'var(--shadow-sm)':'none', color: view==='kanban'?'var(--pink-deep)':'var(--text-muted)' }}>
                  <Icon name="grid" size={15}/>
                </button>
                <button onClick={() => setView('list')} className="btn icon"
                  style={{ padding:6, background: view==='list'?'var(--bg-surface)':'transparent', boxShadow: view==='list'?'var(--shadow-sm)':'none', color: view==='list'?'var(--pink-deep)':'var(--text-muted)' }}>
                  <Icon name="list" size={15}/>
                </button>
              </div>
              <Button variant="primary"><Icon name="plus" size={14} color="white"/> Novo conteúdo</Button>
            </div>
          }
        />

        {/* Search + Brand filter */}
        <div className="col gap-3">
          <div className="row gap-2" style={{
            background:'var(--bg-surface)', border:'1px solid var(--border)',
            borderRadius:'var(--r-md)', padding:'8px 12px', maxWidth: 360,
          }}>
            <Icon name="search" size={13} color="var(--text-muted)"/>
            <input className="grow" style={{ background:'transparent', border:'none', fontSize: 13 }}
              placeholder="Buscar conteúdos..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
            {Object.entries(window.BRANDS).map(([k, b]) => (
              <button key={k} onClick={() => setBrand(k)}
                style={{
                  fontSize: 12, padding: '6px 14px', borderRadius: 999,
                  border: '1px solid',
                  background: brand === k ? `color-mix(in oklch, ${b.color} 14%, var(--bg-surface))` : 'var(--bg-surface)',
                  borderColor: brand === k ? b.color : 'var(--border)',
                  color: brand === k ? b.color : 'var(--text-muted)',
                  cursor: 'pointer', fontWeight: brand === k ? 600 : 400,
                  fontFamily: 'var(--font-body)', transition: 'all .15s',
                }}>
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:'var(--s-2)' }}>
          {KANBAN_COLS.map(st => {
            const cfg = window.STATUS_CONTEUDO[st];
            const c = data.filter(x => x.status === st).length;
            return (
              <div key={st} className="center" style={{
                padding: 'var(--s-3) var(--s-2)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)',
              }}>
                <div style={{ fontFamily:'var(--font-title)', fontSize: 20, fontWeight: 600, color: cfg.color }}>{c}</div>
                <div className="tiny muted" style={{ marginTop: 2 }}>{cfg.label}</div>
              </div>
            );
          })}
        </div>

        {view === 'kanban' ? (
          <div className="row gap-3" style={{ overflowX:'auto', paddingBottom: 'var(--s-3)', alignItems: 'flex-start' }}>
            {KANBAN_COLS.map(st => {
              const cfg = window.STATUS_CONTEUDO[st];
              const items = filtered.filter(c => c.status === st);
              return (
                <div key={st} style={{ flexShrink: 0, width: 240 }}>
                  <div className="row gap-2" style={{ marginBottom: 'var(--s-3)', padding: '0 2px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: cfg.color }}/>
                    <span className="eyebrow" style={{ color: cfg.color }}>{cfg.label}</span>
                    <span className="tiny muted" style={{ marginLeft: 'auto' }}>{items.length}</span>
                  </div>
                  <div className="col gap-2" style={{ minHeight: 100 }}>
                    {items.map(item => (
                      <Card key={item.id} hoverable>
                        <CardBody tight className="col gap-2">
                          <div className="row gap-2" style={{ alignItems: 'flex-start' }}>
                            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{window.TYPE_EMOJI[item.tipo]}</span>
                            <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>{item.titulo}</p>
                          </div>
                          <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                            {item.plataformas.slice(0,3).map(p => (
                              <span key={p} className="tiny" style={{
                                padding: '1px 7px', borderRadius: 999,
                                background: `color-mix(in oklch, ${window.PLATFORM_COLORS[p]} 16%, transparent)`,
                                color: window.PLATFORM_COLORS[p], fontWeight: 500, fontSize: 10,
                              }}>{window.PLATFORM_LABELS[p]}</span>
                            ))}
                          </div>
                          {item.data && (
                            <div className="row gap-1 tiny muted">
                              <Icon name="calendar" size={10}/>{item.data}
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="col gap-2">
            {filtered.map(item => {
              const cfg = window.STATUS_CONTEUDO[item.status];
              return (
                <Card key={item.id} hoverable>
                  <CardBody tight>
                    <div className="row gap-3">
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{window.TYPE_EMOJI[item.tipo]}</span>
                      <div className="grow">
                        <p style={{ fontSize: 13.5, fontWeight: 500 }}>{item.titulo}</p>
                        <p className="tiny muted" style={{ marginTop: 2 }}>{window.CATEGORY_LABELS[item.categoria]}</p>
                      </div>
                      <div className="row gap-3">
                        {item.data && <span className="tiny muted">{item.data}</span>}
                        <span className="tiny" style={{
                          padding: '3px 10px', borderRadius: 999,
                          background: `color-mix(in oklch, ${cfg.color} 16%, transparent)`,
                          color: cfg.color, fontWeight: 500,
                        }}>{cfg.label}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────── PROMPTS ─────────────────────── */
function PromptCard({ prompt }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(prompt.texto);
    setCopied(true);
    showToast('Prompt copiado!');
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <Card>
      <CardBody className="col gap-3">
        <div className="row between" style={{ alignItems: 'flex-start' }}>
          <div className="grow">
            <div className="row gap-2" style={{ marginBottom: 4, flexWrap: 'wrap' }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 600 }}>{prompt.titulo}</h3>
              <Badge variant="pink">{window.PROMPT_CATS[prompt.cat]}</Badge>
              <span className="tiny" style={{
                padding: '2px 8px', borderRadius: 999,
                background: `color-mix(in oklch, ${window.IA_COLORS[prompt.ia]} 18%, transparent)`,
                color: window.IA_COLORS[prompt.ia], fontWeight: 600,
              }}>{prompt.ia}</span>
            </div>
            <p className="small secondary">{prompt.desc}</p>
          </div>
          <div className="row gap-1" style={{ flexShrink: 0 }}>
            <Button variant="ghost" size="sm" className="icon" onClick={copy} title="Copiar prompt">
              <Icon name={copied ? 'check' : 'copy'} size={14} color={copied ? '#7FB68C' : undefined}/>
            </Button>
            <Button variant="ghost" size="sm" className="icon" onClick={() => setOpen(!open)}>
              <Icon name={open ? 'chev-down' : 'chev-right'} size={14}/>
            </Button>
          </div>
        </div>

        {open && (
          <div className="col gap-4" style={{ paddingTop: 'var(--s-3)', borderTop: '1px solid var(--border)' }}>
            {prompt.tool && (
              <p className="tiny muted">🛠 {prompt.tool}</p>
            )}
            {prompt.etapas.length > 0 && (
              <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                {prompt.etapas.map((etapa, i) => (
                  <span key={etapa} className="tiny" style={{
                    padding: '2px 8px', borderRadius: 999, background:'var(--bg-elevated)',
                    border: '1px solid var(--border)', color: 'var(--text-muted)',
                  }}>
                    <span style={{ color: 'var(--pink-deep)', marginRight: 4, fontWeight: 600 }}>{i+1}</span> {etapa}
                  </span>
                ))}
              </div>
            )}
            <div>
              <div className="eyebrow" style={{ marginBottom: 'var(--s-2)' }}>Prompt completo</div>
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)',
                padding: 'var(--s-4)',
                position: 'relative',
              }}>
                <pre style={{
                  fontSize: 12, fontFamily: 'ui-monospace, SF Mono, monospace',
                  color: 'var(--text-secondary)', lineHeight: 1.55,
                  whiteSpace: 'pre-wrap', margin: 0,
                }}>{prompt.texto}</pre>
                <button onClick={copy} style={{
                  position: 'absolute', top: 10, right: 10,
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  borderRadius: 6, padding: 4, cursor: 'pointer',
                  color: 'var(--text-muted)',
                }}>
                  <Icon name={copied ? 'check' : 'copy'} size={12} color={copied ? '#7FB68C' : undefined}/>
                </button>
              </div>
            </div>
            {prompt.checklist.length > 0 && (
              <div>
                <div className="eyebrow" style={{ marginBottom: 'var(--s-2)' }}>Checklist</div>
                <div className="col gap-2">
                  {prompt.checklist.map((item, i) => (
                    <div key={i} className="row gap-2">
                      <div style={{ width: 14, height: 14, borderRadius: 4, border: '1.5px solid var(--border-strong)', flexShrink: 0 }}/>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function PromptsPage() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('todos');
  const all = window.DEMO_PROMPTS;
  const filtered = all.filter(p => {
    const okS = !search || p.titulo.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
    const okC = cat === 'todos' || p.cat === cat;
    return okS && okC;
  });

  return (
    <div className="content" style={{ maxWidth: 880 }}>
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Banco de Prompts"
          subtitle="Prompts prontos com IA recomendada, checklists e etapas"
        />

        <div className="row gap-3" style={{ flexWrap: 'wrap' }}>
          <div className="row gap-2" style={{
            background:'var(--bg-surface)', border:'1px solid var(--border)',
            borderRadius:'var(--r-md)', padding:'8px 12px', flex: 1, minWidth: 220, maxWidth: 320,
          }}>
            <Icon name="search" size={13} color="var(--text-muted)"/>
            <input className="grow" style={{ background:'transparent', border:'none', fontSize: 13 }}
              placeholder="Buscar prompts..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="select" style={{ width: 'auto', minWidth: 180 }}
            value={cat} onChange={e=>setCat(e.target.value)}>
            <option value="todos">Todas categorias</option>
            {Object.entries(window.PROMPT_CATS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>

        <div className="col gap-3">
          {filtered.map(p => <PromptCard key={p.id} prompt={p}/>)}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ConteudoPage, PromptsPage });
