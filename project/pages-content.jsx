/* ──────────────────────────────────────────────
   pages-content.jsx — Conteúdo, Prompts
   ────────────────────────────────────────────── */

/* ─────────────────────── CONTEÚDO ─────────────────────── */
const KANBAN_COLS = ['ideia', 'rascunho', 'filmando', 'editando', 'revisao', 'agendado', 'publicado'];

const CHANNEL_LABELS = {
  lorenna:  'Lorenna',
  papel:    'Papel da Lola',
  otica:    'Ótica Igor',
  pratique: 'Pratique',
  jornal:   'Jornal',
  espaco:   'Espaço Criar',
};

const CHANNEL_COLORS = {
  lorenna:  '#fe7dae',
  papel:    '#fec9df',
  otica:    '#bce1f6',
  pratique: '#f0bff8',
  jornal:   '#ffe1bd',
  espaco:   '#f1e18d',
};

const STATUS_DISPLAY = {
  ideia:     { label: 'Ideia',      color: '#bce1f6', emoji: '💡' },
  rascunho:  { label: 'Rascunho',   color: '#f1e18d', emoji: '✍️' },
  filmando:  { label: 'Filmando',   color: '#fe7dae', emoji: '🎬' },
  editando:  { label: 'Editando',   color: '#f0bff8', emoji: '✂️' },
  revisao:   { label: 'Revisão',    color: '#ffe1bd', emoji: '👁' },
  agendado:  { label: 'Agendado',   color: '#fec9df', emoji: '📅' },
  publicado: { label: 'Publicado',  color: '#f1e18d', emoji: '✅' },
};

function ChannelTag({ channel }) {
  const label = CHANNEL_LABELS[channel] || channel;
  const color = CHANNEL_COLORS[channel] || '#fec9df';
  return (
    <span style={{
      fontSize: 13, padding: '2px 9px', borderRadius: 999, fontWeight: 600,
      background: color, color: '#201e1f',
    }}>{label}</span>
  );
}

function ConteudoModal({ item, onClose }) {
  const cfg = window.STATUS_CONTEUDO[item.status];
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(43,34,34,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: 'var(--s-6) var(--s-4)', overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(720px, 95vw)', background: 'var(--white)',
        borderRadius: 'var(--r-xl)', border: '1px solid var(--gray-light)',
        overflow: 'hidden',
      }}>
        <div style={{ height: 4, background: cfg.color }}/>
        <div style={{ padding: 'var(--s-5)' }}>
          <div className="row between" style={{ marginBottom: 'var(--s-4)' }}>
            <div className="row gap-2">
              <span style={{ fontSize: 22 }}>{window.TYPE_EMOJI[item.tipo]}</span>
              <div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 700 }}>{item.titulo}</h2>
                <div className="row gap-2" style={{ marginTop: 6, flexWrap: 'wrap' }}>
                  <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: 14, fontWeight: 600, background: `color-mix(in oklch, ${cfg.color} 16%, transparent)`, color: cfg.color }}>{cfg.label}</span>
                  {item.brand && <ChannelTag channel={item.brand}/>}
                  {item.data && <span className="tiny muted">{item.data}</span>}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="icon" onClick={onClose}>
              <Icon name="x" size={15}/>
            </Button>
          </div>

          <div className="col gap-4">
            <div className="col gap-2">
              <label style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Plataformas</label>
              <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
                {item.plataformas.map(p => (
                  <span key={p} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 14, fontWeight: 500, background: `color-mix(in oklch, ${window.PLATFORM_COLORS[p]} 16%, transparent)`, color: window.PLATFORM_COLORS[p] }}>
                    {window.PLATFORM_LABELS[p]}
                  </span>
                ))}
              </div>
            </div>

            <div className="col gap-2">
              <label style={{ fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Roteiro / Conteúdo</label>
              <textarea
                style={{
                  width: '100%', minHeight: 220, padding: '14px 16px',
                  fontSize: 15, lineHeight: 1.7, color: 'var(--ink)',
                  background: 'var(--offwhite)', border: '1.5px solid var(--pink-soft)',
                  borderRadius: 15, resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'var(--font-body)',
                }}
                placeholder="Escreva o roteiro, legenda, script ou anotações desse conteúdo…"
                onFocus={e => e.target.style.borderColor = 'var(--pink)'}
                onBlur={e => e.target.style.borderColor = 'var(--pink-soft)'}
              />
            </div>

            <div className="row gap-2">
              <Button variant="primary" onClick={() => { showToast('Conteúdo salvo!'); onClose(); }}>
                <Icon name="check" size={13} color="white"/> Salvar
              </Button>
              <Button variant="ghost" onClick={onClose}>Fechar</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Inline brain-dump widget (Baú de Ideias) ── */
function CapturaBrainDump({ energy }) {
  const [text, setText] = useState('');
  const [processando, setProcessando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const e = window.ENERGY[energy] || window.ENERGY.criativa;

  async function processar() {
    if (!text.trim()) return;
    setProcessando(true); setResultado(null);
    if (window.hasClaudeKey && window.hasClaudeKey()) {
      const resp = await window.callClaude([{ role: 'user', content: `Ideia capturada: "${text}"\n\nGere sugestões criativas em JSON exato:\n{"conteudo":[{"tipo":"Reel 30s","desc":"...","icon":"🎬"}],"tarefa":[{"desc":"...","min":15}],"monetizacao":[{"desc":"...","potencial":"R$ X-Y"}],"ideia":[{"desc":"..."}]}\n3-5 itens por array. Responda APENAS o JSON.` }],
        'Assistente criativa para Lorenna: criadora de conteúdo e dona da Agência Logue.', 'claude-haiku-4-5-20251001');
      if (resp) {
        try { const j = resp.match(/\{[\s\S]*\}/)?.[0]; if (j) { setResultado(JSON.parse(j)); setProcessando(false); return; } } catch {}
      }
    }
    setTimeout(() => {
      setResultado({
        conteudo: [
          { tipo: 'Reel (30s)', desc: `Versão rápida da ideia`, icon: '🎬' },
          { tipo: 'Carrossel', desc: `Passo a passo em slides`, icon: '🖼' },
          { tipo: 'Story sequência', desc: `5-7 stories narrativos`, icon: '📱' },
        ],
        tarefa: [{ desc: 'Escrever roteiro', min: 20 }, { desc: 'Gravar', min: 45 }, { desc: 'Editar', min: 60 }],
        monetizacao: [{ desc: 'Mini-curso sobre o tema', potencial: 'R$ 97-197' }],
        ideia: [{ desc: 'Série de conteúdo sobre o tema' }, { desc: 'Fazer ao vivo' }],
      });
      setProcessando(false);
    }, 700);
  }

  if (processando) return (
    <div className="center col gap-2" style={{ padding: 'var(--s-7)' }}>
      <div style={{ fontSize: 28 }}>✨</div>
      <p className="small muted">Processando sua ideia...</p>
    </div>
  );

  if (resultado) return (
    <div className="col gap-4 fade-up">
      <div className="row between">
        <div className="row gap-2"><span style={{ fontSize: 18 }}>✨</span><h3 style={{ fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 600 }}>Sugestões geradas</h3></div>
        <Button variant="ghost" size="sm" onClick={() => { setText(''); setResultado(null); }}>
          <Icon name="plus" size={13}/> Nova ideia
        </Button>
      </div>
      {/* Formatos */}
      <Card variant="elevated"><CardHeader><span>🎬 Formatos de conteúdo</span></CardHeader>
        <CardBody><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {resultado.conteudo.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'color-mix(in oklch, #fec9df 30%, white)', flex: '1 1 160px' }}>
              <span style={{ fontSize: 16 }}>{c.icon}</span>
              <div><div style={{ fontSize: 14, fontWeight: 600, color: '#201e1f' }}>{c.tipo}</div><div className="tiny muted">{c.desc}</div></div>
            </div>
          ))}
        </div></CardBody>
      </Card>
      {/* Tarefas */}
      {resultado.tarefa.length > 0 && <Card variant="elevated"><CardHeader><span>⚡ Tarefas sugeridas</span></CardHeader>
        <CardBody><ul style={{ margin: 0, padding: 0, listStyle: 'none' }} className="col gap-2">
          {resultado.tarefa.map((t, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--offwhite)' }}>
              <div className="row gap-2"><span style={{ color: 'var(--pink-deep)', fontSize: 14 }}>→</span><span style={{ fontSize: 14 }}>{t.desc}</span></div>
              <Badge variant="pink">{t.min} min</Badge>
            </li>
          ))}
        </ul></CardBody>
      </Card>}
      {/* Monetização */}
      {resultado.monetizacao.length > 0 && <Card variant="elevated"><CardHeader><span>💰 Oportunidades</span></CardHeader>
        <CardBody><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--s-3)' }}>
          {resultado.monetizacao.map((m, i) => (
            <div key={i} style={{ padding: '12px 14px', borderRadius: 'var(--r-md)', background: 'color-mix(in oklch, #f1e18d 35%, white)' }} className="col gap-1">
              <span style={{ fontSize: 14, fontWeight: 500, color: '#201e1f' }}>{m.desc}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#201e1f' }}>{m.potencial}</span>
            </div>
          ))}
        </div></CardBody>
      </Card>}
    </div>
  );

  return (
    <div className="col gap-4">
      <Card variant="elevated" style={{ overflow: 'hidden' }}>
        <div style={{ height: 3, background: e.color }}/>
        <CardBody className="col gap-3">
          <div className="row gap-2">
            <span style={{ fontSize: 15 }}>{e.emoji}</span>
            <span className="small secondary">Modo {e.label} — {e.desc}</span>
          </div>
          <textarea className="textarea" value={text} onChange={ev => setText(ev.target.value)}
            placeholder={`Joga tudo aqui — ideia solta, pensamento bagunçado, to-do, referência…\n\n"Preciso criar o roteiro do reel de branding, mas antes disso tenho que entregar os posts da academia..."`}
            style={{ minHeight: 180 }}
            onKeyDown={ev => { if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') processar(); }}
          />
          <div className="row between">
            <span className="tiny muted">⌘ + Enter para processar</span>
            <Button variant="primary" onClick={processar} disabled={!text.trim()}>
              <Icon name="send" size={13} color="white"/> Processar com IA
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

/* ── Inline refs tab ── */
function RefsTab() {
  const [refs, setRefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lorenna_referencias') || '[]'); } catch { return []; }
  });
  const [form, setForm] = useState({ titulo: '', url: '', tipo: 'post', nota: '' });
  const [adding, setAdding] = useState(false);

  const REF_TIPOS_LOCAL = {
    perfil: { label: 'Perfil', emoji: '👤', color: '#fe7dae' },
    video:  { label: 'Vídeo',  emoji: '🎬', color: '#fec9df' },
    post:   { label: 'Post',   emoji: '📱', color: '#f0bff8' },
    blog:   { label: 'Blog',   emoji: '✍️', color: '#bce1f6' },
    design: { label: 'Design', emoji: '🎨', color: '#f1e18d' },
    marca:  { label: 'Marca',  emoji: '⭐', color: '#ffe1bd' },
    outro:  { label: 'Outro',  emoji: '📌', color: '#fec9df' },
  };

  function salvar() {
    if (!form.titulo.trim()) return;
    const next = [{ ...form, id: Date.now() }, ...refs];
    setRefs(next);
    localStorage.setItem('lorenna_referencias', JSON.stringify(next));
    setForm({ titulo: '', url: '', tipo: 'post', nota: '' });
    setAdding(false);
    showToast('Referência salva!');
  }

  function deletar(id) {
    const next = refs.filter(r => r.id !== id);
    setRefs(next);
    localStorage.setItem('lorenna_referencias', JSON.stringify(next));
  }

  return (
    <div className="col gap-4">
      <div className="row between">
        <p className="small muted">{refs.length} referências salvas</p>
        <Button variant="primary" size="sm" onClick={() => setAdding(v => !v)}>
          <Icon name="plus" size={13} color="white"/> Adicionar referência
        </Button>
      </div>

      {adding && (
        <Card variant="elevated"><CardBody className="col gap-3">
          <h3 style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-title)' }}>Nova referência</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
            <div className="col gap-1" style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#201e1f' }}>Nome / título</label>
              <input className="input" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} placeholder="Ex: Conta da Nubank, reel do NuBank..." />
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 600, color: '#201e1f' }}>Tipo</label>
              <select className="select" value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))}>
                {Object.entries(REF_TIPOS_LOCAL).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
              </select>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 600, color: '#201e1f' }}>URL (opcional)</label>
              <input className="input" value={form.url} onChange={e => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="col gap-1" style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: '#201e1f' }}>O que me atraiu?</label>
              <textarea className="textarea" rows={2} value={form.nota} onChange={e => setForm(p => ({ ...p, nota: e.target.value }))} placeholder="O que você quer aprender ou adaptar..." />
            </div>
          </div>
          <div className="row gap-2">
            <Button variant="primary" onClick={salvar} disabled={!form.titulo.trim()}>Salvar</Button>
            <Button variant="ghost" onClick={() => setAdding(false)}>Cancelar</Button>
          </div>
        </CardBody></Card>
      )}

      {refs.length === 0 && !adding && (
        <div className="center col gap-2" style={{ padding: 'var(--s-7)' }}>
          <div style={{ fontSize: 32 }}>🔖</div>
          <p className="small muted">Nenhuma referência ainda. Adicione perfis, posts e marcas que te inspiram.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--s-3)' }}>
        {refs.map(r => {
          const t = REF_TIPOS_LOCAL[r.tipo] || REF_TIPOS_LOCAL.outro;
          return (
            <Card key={r.id} hoverable>
              <CardBody className="col gap-3">
                <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 'var(--r-md)', background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {t.emoji}
                  </div>
                  <div className="grow">
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#201e1f' }}>{r.titulo}</div>
                    <div style={{ fontSize: 13, color: '#201e1f', opacity: 0.6, marginTop: 2 }}>{t.label}</div>
                  </div>
                  <button onClick={() => deletar(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4 }}>
                    <Icon name="x" size={13} color="#201e1f"/>
                  </button>
                </div>
                {r.nota && <p style={{ fontSize: 13, color: '#201e1f', opacity: 0.7, lineHeight: 1.5 }}>{r.nota}</p>}
                {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--pink-deep)', textDecoration: 'none', fontWeight: 500 }}>↗ Abrir link</a>}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ConteudoPage({ energy }) {
  const [tab, setTab] = useState('kanban');
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('todos');
  const [selected, setSelected] = useState(null);
  const data = window.DEMO_CONTENT;
  const filtered = data.filter(c => {
    const okS = !search || c.titulo.toLowerCase().includes(search.toLowerCase());
    const okC = channel === 'todos' || c.brand === channel;
    return okS && okC;
  });

  const TABS = [
    { key: 'kanban', label: 'Kanban'       },
    { key: 'lista',  label: 'Lista'         },
    { key: 'bau',    label: 'Baú de Ideias' },
    { key: 'refs',   label: 'Referências'   },
  ];

  return (
    <div className="content">
      <div className="col gap-4 fade-up">
        <PageHeader
          title="Central de Conteúdo"
          subtitle={`${data.length} conteúdos · pipeline e criação em um lugar`}
          action={<Button variant="primary"><Icon name="plus" size={14} color="white"/> Novo conteúdo</Button>}
        />

        {/* Stats strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 'var(--s-2)' }}>
          {KANBAN_COLS.map(st => {
            const d = STATUS_DISPLAY[st];
            const c = data.filter(x => x.status === st).length;
            return (
              <button key={st} onClick={() => setTab('kanban')} style={{
                background: `color-mix(in oklch, ${d.color} 50%, white)`,
                borderRadius: 'var(--r-md)', padding: '10px 6px',
                textAlign: 'center', cursor: 'pointer', border: 'none',
              }}>
                <div style={{ fontSize: 20, fontWeight: 500, fontFamily: 'var(--font-title)', color: '#201e1f', lineHeight: 1.1 }}>{c}</div>
                <div style={{ fontSize: 12, color: '#201e1f', opacity: 0.7, marginTop: 2 }}>{d.label}</div>
              </button>
            );
          })}
        </div>

        {/* Tab bar */}
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 999, padding: 3, display: 'flex', gap: 2, alignSelf: 'flex-start' }}>
          {TABS.map(({ key, label }) => (
            <button key={key} onClick={() => setTab(key)} style={{
              fontSize: 14, padding: '7px 18px', borderRadius: 999, border: 'none',
              background: tab === key ? '#201e1f' : 'transparent',
              color: tab === key ? '#fffcfa' : 'var(--text-secondary)',
              cursor: 'pointer', fontWeight: tab === key ? 500 : 400,
              fontFamily: 'var(--font-body)', transition: 'all .15s',
            }}>{label}</button>
          ))}
        </div>

        {/* Search + channel chips (kanban / lista only) */}
        {(tab === 'kanban' || tab === 'lista') && (
          <div className="col gap-2">
            <div className="row gap-2" style={{ background: 'var(--offwhite)', borderRadius: 'var(--r-md)', padding: '8px 12px' }}>
              <Icon name="search" size={13} color="var(--text-muted)"/>
              <input className="grow" style={{ background: 'transparent', border: 'none', fontSize: 14 }}
                placeholder="Buscar conteúdos..." value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[['todos', 'Todos'], ...Object.entries(CHANNEL_LABELS)].map(([k, l]) => (
                <button key={k} onClick={() => setChannel(k)} style={{
                  fontSize: 13, padding: '5px 13px', borderRadius: 999, border: 'none',
                  background: channel === k ? (CHANNEL_COLORS[k] || '#fe7dae') : 'var(--bg-elevated)',
                  color: '#201e1f', cursor: 'pointer', fontWeight: channel === k ? 500 : 400,
                  fontFamily: 'var(--font-body)', transition: 'all .15s',
                }}>{l}</button>
              ))}
            </div>
          </div>
        )}

        {/* KANBAN */}
        {tab === 'kanban' && (
          <div className="row gap-3" style={{ overflowX: 'auto', paddingBottom: 'var(--s-3)', alignItems: 'flex-start' }}>
            {KANBAN_COLS.map(st => {
              const d = STATUS_DISPLAY[st];
              const items = filtered.filter(c => c.status === st);
              return (
                <div key={st} style={{ flexShrink: 0, width: 240 }}>
                  <div style={{
                    background: `color-mix(in oklch, ${d.color} 45%, white)`,
                    borderRadius: 'var(--r-md)', padding: '8px 12px',
                    marginBottom: 'var(--s-3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div className="row gap-2">
                      <span style={{ fontSize: 14 }}>{d.emoji}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: '#201e1f' }}>{d.label}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#201e1f', background: d.color, padding: '1px 8px', borderRadius: 999 }}>{items.length}</span>
                  </div>
                  <div className="col gap-2" style={{ minHeight: 80 }}>
                    {items.map(item => (
                      <Card key={item.id} hoverable onClick={() => setSelected(item)} style={{ cursor: 'pointer' }}>
                        <CardBody tight className="col gap-2">
                          <p style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.4, color: '#201e1f' }}>{item.titulo}</p>
                          <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                            {item.brand && <ChannelTag channel={item.brand}/>}
                          </div>
                          {item.data && <div className="tiny muted row gap-1"><Icon name="calendar" size={10}/>{item.data}</div>}
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* LISTA */}
        {tab === 'lista' && (
          <div className="col gap-2">
            {filtered.map(item => {
              const d = STATUS_DISPLAY[item.status];
              return (
                <Card key={item.id} hoverable onClick={() => setSelected(item)} style={{ cursor: 'pointer' }}>
                  <CardBody tight>
                    <div className="row gap-3">
                      <div className="grow">
                        <p style={{ fontSize: 14.5, fontWeight: 500, color: '#201e1f' }}>{item.titulo}</p>
                        <div className="row gap-1" style={{ marginTop: 4, flexWrap: 'wrap' }}>
                          {item.brand && <ChannelTag channel={item.brand}/>}
                        </div>
                      </div>
                      <div className="row gap-2" style={{ alignItems: 'center' }}>
                        {item.data && <span className="tiny muted">{item.data}</span>}
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#201e1f', padding: '3px 10px', borderRadius: 999, background: d.color, whiteSpace: 'nowrap' }}>
                          {d.emoji} {d.label}
                        </span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {/* BAÚ DE IDEIAS */}
        {tab === 'bau' && <CapturaBrainDump energy={energy || 'criativa'} />}

        {/* REFERÊNCIAS */}
        {tab === 'refs' && <RefsTab />}

        {selected && <ConteudoModal item={selected} onClose={() => setSelected(null)}/>}
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
  const iaColor = window.IA_COLORS[prompt.ia] || window.IA_COLORS[prompt.ia?.toLowerCase()] || '#999';
  const iaLabel = prompt.ia ? (prompt.ia.charAt(0).toUpperCase() + prompt.ia.slice(1)) : '';
  return (
    <Card>
      <CardBody className="col gap-3">
        {/* Collapsed header — title + badges + actions only */}
        <div className="row between" style={{ alignItems: 'center' }}>
          <div className="row gap-2" style={{ flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 15, fontWeight: 600 }}>{prompt.titulo}</h3>
            <span className="tiny" style={{
              padding: '2px 8px', borderRadius: 999,
              background: `color-mix(in oklch, ${iaColor} 18%, transparent)`,
              color: iaColor, fontWeight: 600,
            }}>{iaLabel}</span>
            <Badge variant="pink">{window.PROMPT_CATS[prompt.cat]}</Badge>
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
          <div className="col gap-4" style={{ paddingTop: 'var(--s-3)' }}>
            {prompt.desc && (
              <p className="small secondary">{prompt.desc}</p>
            )}
            {prompt.tool && (
              <p className="tiny muted">🛠 {prompt.tool}</p>
            )}
            {prompt.etapas && prompt.etapas.length > 0 && (
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
            {prompt.texto && (
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
                    fontSize: 14, fontFamily: 'ui-monospace, SF Mono, monospace',
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
            )}
            {prompt.checklist && prompt.checklist.length > 0 && (
              <div>
                <div className="eyebrow" style={{ marginBottom: 'var(--s-2)' }}>Checklist</div>
                <div className="col gap-2">
                  {prompt.checklist.map((item, i) => (
                    <div key={i} className="row gap-2">
                      <div style={{ width: 14, height: 14, borderRadius: 4, border: '1.5px solid var(--border-strong)', flexShrink: 0 }}/>
                      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{item}</span>
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

const IA_OPTIONS = ['ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'Perplexity'];

function GerarPromptFlow({ onFill }) {
  const [step, setStep] = useState(0); // 0 = hidden, 1 = questions, 2 = done
  const [respostas, setRespostas] = useState({ finalidade: '', ia: 'ChatGPT', formato: '' });

  function gerar() {
    const template = `Você é um especialista em ${respostas.finalidade}.

OBJETIVO:
Ajude-me com: ${respostas.finalidade}

IA UTILIZADA: ${respostas.ia}

FORMATO DE SAÍDA ESPERADO:
${respostas.formato}

INSTRUÇÕES:
1. Analise cuidadosamente o contexto fornecido
2. Responda de forma estruturada e objetiva
3. Use linguagem clara e direta
4. Adapte o tom conforme o contexto

CONTEXTO:
[Preencha aqui o contexto específico]

ENTREGUE:
${respostas.formato ? `- Resultado no formato: ${respostas.formato}` : '- Resultado completo e detalhado'}
- Explicação breve das escolhas feitas`;
    onFill(template);
    setStep(0);
    setRespostas({ finalidade: '', ia: 'ChatGPT', formato: '' });
  }

  if (step === 0) {
    return (
      <button
        onClick={() => setStep(1)}
        style={{
          background: 'linear-gradient(135deg, color-mix(in oklch, var(--pink-deep) 14%, var(--bg-surface)), color-mix(in oklch, var(--pink) 8%, var(--bg-surface)))',
          border: '1px solid color-mix(in oklch, var(--pink-deep) 30%, var(--border))',
          borderRadius: 'var(--r-md)', padding: '8px 14px', cursor: 'pointer',
          color: 'var(--pink-deep)', fontSize: 14, fontWeight: 600,
          fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        ✨ Gerar prompt automaticamente
      </button>
    );
  }

  return (
    <div className="col gap-3" style={{
      background: 'color-mix(in oklch, var(--pink-deep) 6%, var(--bg-surface))',
      border: '1px solid color-mix(in oklch, var(--pink-deep) 25%, var(--border))',
      borderRadius: 'var(--r-md)', padding: 'var(--s-4)',
    }}>
      <div className="row between">
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--pink-deep)' }}>✨ Gerar prompt automaticamente</span>
        <button onClick={() => setStep(0)} className="btn icon" style={{ color: 'var(--text-muted)', padding: 4 }}>
          <Icon name="x" size={13}/>
        </button>
      </div>
      <div className="col gap-3">
        <div className="col gap-1">
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Para que serve esse prompt?</label>
          <input
            className="input" style={{ fontSize: 14 }}
            placeholder="Ex: criar roteiro de reel sobre branding, analisar concorrentes..."
            value={respostas.finalidade}
            onChange={e => setRespostas(r => ({ ...r, finalidade: e.target.value }))}
          />
        </div>
        <div className="col gap-1">
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Qual IA será usada?</label>
          <select className="select" style={{ fontSize: 14 }}
            value={respostas.ia} onChange={e => setRespostas(r => ({ ...r, ia: e.target.value }))}>
            {IA_OPTIONS.map(ia => <option key={ia} value={ia}>{ia}</option>)}
          </select>
        </div>
        <div className="col gap-1">
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Qual formato de resultado você quer?</label>
          <input
            className="input" style={{ fontSize: 14 }}
            placeholder="Ex: lista numerada, carrossel de 8 slides, texto corrido de 300 palavras..."
            value={respostas.formato}
            onChange={e => setRespostas(r => ({ ...r, formato: e.target.value }))}
          />
        </div>
        <div className="row gap-2">
          <Button variant="primary" size="sm"
            onClick={gerar}
            disabled={!respostas.finalidade.trim()}
          >
            Gerar
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setStep(0)}>Cancelar</Button>
        </div>
      </div>
    </div>
  );
}

function NovoPromptForm({ onSave, onCancel }) {
  const [newPrompt, setNewPrompt] = useState({
    titulo: '', desc: '', ia: 'ChatGPT', cat: 'conteudo', texto: '',
  });

  function salvar() {
    if (!newPrompt.titulo.trim()) return;
    const id = 'custom-' + Date.now();
    onSave({
      id,
      titulo: newPrompt.titulo,
      desc: newPrompt.desc,
      ia: newPrompt.ia.toLowerCase(),
      cat: newPrompt.cat,
      texto: newPrompt.texto,
      etapas: [],
      checklist: [],
      tool: null,
    });
  }

  return (
    <div className="col gap-4" style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-lg)',
      padding: 'var(--s-5)',
    }}>
      <div className="row between" style={{ alignItems: 'center' }}>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 600 }}>Novo Prompt</h3>
        <button onClick={onCancel} className="btn icon" style={{ color: 'var(--text-muted)' }}>
          <Icon name="x" size={15}/>
        </button>
      </div>

      <GerarPromptFlow onFill={texto => setNewPrompt(p => ({ ...p, texto }))}/>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
        <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Título <span style={{ color: 'var(--pink-deep)' }}>*</span></label>
          <input
            className="input" style={{ fontSize: 14 }}
            placeholder="Nome do prompt..."
            value={newPrompt.titulo}
            onChange={e => setNewPrompt(p => ({ ...p, titulo: e.target.value }))}
          />
        </div>
        <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Descrição curta</label>
          <input
            className="input" style={{ fontSize: 14 }}
            placeholder="O que esse prompt faz..."
            value={newPrompt.desc}
            onChange={e => setNewPrompt(p => ({ ...p, desc: e.target.value }))}
          />
        </div>
        <div className="col gap-1">
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>IA recomendada</label>
          <select className="select" style={{ fontSize: 14 }}
            value={newPrompt.ia} onChange={e => setNewPrompt(p => ({ ...p, ia: e.target.value }))}>
            {IA_OPTIONS.map(ia => <option key={ia} value={ia}>{ia}</option>)}
          </select>
        </div>
        <div className="col gap-1">
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Categoria</label>
          <select className="select" style={{ fontSize: 14 }}
            value={newPrompt.cat} onChange={e => setNewPrompt(p => ({ ...p, cat: e.target.value }))}>
            {Object.entries(window.PROMPT_CATS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>Texto do prompt</label>
          <textarea
            className="input" style={{ fontSize: 14, minHeight: 180, resize: 'vertical', lineHeight: 1.55, fontFamily: 'ui-monospace, SF Mono, monospace' }}
            placeholder="Cole ou escreva o prompt aqui..."
            value={newPrompt.texto}
            onChange={e => setNewPrompt(p => ({ ...p, texto: e.target.value }))}
          />
        </div>
      </div>

      <div className="row gap-2">
        <Button variant="primary" onClick={salvar} disabled={!newPrompt.titulo.trim()}>
          <Icon name="plus" size={14} color="white"/> Salvar prompt
        </Button>
        <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  );
}

function PromptsPage() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [prompts, setPrompts] = useState(window.DEMO_PROMPTS);

  const filtered = prompts.filter(p => {
    const okS = !search || p.titulo.toLowerCase().includes(search.toLowerCase()) || (p.desc && p.desc.toLowerCase().includes(search.toLowerCase()));
    const okC = cat === 'todos' || p.cat === cat;
    return okS && okC;
  });

  function handleSave(prompt) {
    setPrompts(prev => [prompt, ...prev]);
    setShowForm(false);
    showToast('Prompt salvo!');
  }

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Banco de Prompts"
          subtitle="Prompts prontos com IA recomendada, checklists e etapas"
          action={
            <Button variant="primary" onClick={() => setShowForm(s => !s)}>
              <Icon name="plus" size={14} color="white"/> Novo Prompt
            </Button>
          }
        />

        {showForm && (
          <NovoPromptForm
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        )}

        <div className="row gap-3" style={{ flexWrap: 'wrap' }}>
          <div className="row gap-2" style={{
            background:'var(--bg-surface)', border:'1px solid var(--border)',
            borderRadius:'var(--r-md)', padding:'8px 12px', flex: 1, minWidth: 220, maxWidth: 320,
          }}>
            <Icon name="search" size={13} color="var(--text-muted)"/>
            <input className="grow" style={{ background:'transparent', border:'none', fontSize: 14 }}
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
