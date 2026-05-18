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
  lorenna:  'var(--pink-deep)',
  papel:    'var(--pink)',
  otica:    '#5A6F9C',
  pratique: '#7FB68C',
  jornal:   '#A89AC9',
  espaco:   '#E89B4C',
};

function ChannelTag({ channel }) {
  const label = CHANNEL_LABELS[channel] || channel;
  const color = CHANNEL_COLORS[channel] || 'var(--text-muted)';
  return (
    <span style={{
      fontSize: 10, padding: '2px 7px', borderRadius: 999, fontWeight: 600,
      background: `color-mix(in oklch, ${color} 16%, transparent)`,
      color, lineHeight: 1.4, flexShrink: 0,
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
                  <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: `color-mix(in oklch, ${cfg.color} 16%, transparent)`, color: cfg.color }}>{cfg.label}</span>
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
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Plataformas</label>
              <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
                {item.plataformas.map(p => (
                  <span key={p} style={{ padding: '4px 12px', borderRadius: 999, fontSize: 13, fontWeight: 500, background: `color-mix(in oklch, ${window.PLATFORM_COLORS[p]} 16%, transparent)`, color: window.PLATFORM_COLORS[p] }}>
                    {window.PLATFORM_LABELS[p]}
                  </span>
                ))}
              </div>
            </div>

            <div className="col gap-2">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Roteiro / Conteúdo</label>
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

function ConteudoPage() {
  const [view, setView] = useState('kanban');
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('todos');
  const [selected, setSelected] = useState(null);
  const data = window.DEMO_CONTENT;
  const filtered = data.filter(c => {
    const okS = !search || c.titulo.toLowerCase().includes(search.toLowerCase());
    const okC = channel === 'todos' || c.brand === channel;
    return okS && okC;
  });

  return (
    <div className="content">
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

        {/* Search + Channel filter */}
        <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
          <div className="row gap-2" style={{
            background:'var(--bg-surface)', border:'1px solid var(--border)',
            borderRadius:'var(--r-md)', padding:'8px 12px', flex: 1, minWidth: 220, maxWidth: 320,
          }}>
            <Icon name="search" size={13} color="var(--text-muted)"/>
            <input className="grow" style={{ background:'transparent', border:'none', fontSize: 13 }}
              placeholder="Buscar conteúdos..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="select" style={{ width: 'auto', minWidth: 180 }}
            value={channel} onChange={e => setChannel(e.target.value)}>
            <option value="todos">Todos os canais</option>
            {Object.entries(CHANNEL_LABELS).map(([k, l]) => (
              <option key={k} value={k}>{l}</option>
            ))}
          </select>
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
                      <Card key={item.id} hoverable onClick={() => setSelected(item)} style={{ cursor: 'pointer' }}>
                        <CardBody tight className="col gap-2">
                          <div className="row gap-2" style={{ alignItems: 'flex-start' }}>
                            <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{window.TYPE_EMOJI[item.tipo]}</span>
                            <p style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4, flex: 1 }}>{item.titulo}</p>
                          </div>
                          <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                            {item.brand && <ChannelTag channel={item.brand}/>}
                            {item.plataformas.slice(0,2).map(p => (
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
                <Card key={item.id} hoverable onClick={() => setSelected(item)} style={{ cursor: 'pointer' }}>
                  <CardBody tight>
                    <div className="row gap-3">
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{window.TYPE_EMOJI[item.tipo]}</span>
                      <div className="grow">
                        <p style={{ fontSize: 13.5, fontWeight: 500 }}>{item.titulo}</p>
                        <div className="row gap-1" style={{ marginTop: 4, flexWrap: 'wrap' }}>
                          <p className="tiny muted">{window.CATEGORY_LABELS[item.categoria]}</p>
                          {item.brand && <ChannelTag channel={item.brand}/>}
                        </div>
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
          <div className="col gap-4" style={{ paddingTop: 'var(--s-3)', borderTop: '1px solid var(--border)' }}>
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
            )}
            {prompt.checklist && prompt.checklist.length > 0 && (
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
          color: 'var(--pink-deep)', fontSize: 13, fontWeight: 600,
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
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--pink-deep)' }}>✨ Gerar prompt automaticamente</span>
        <button onClick={() => setStep(0)} className="btn icon" style={{ color: 'var(--text-muted)', padding: 4 }}>
          <Icon name="x" size={13}/>
        </button>
      </div>
      <div className="col gap-3">
        <div className="col gap-1">
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Para que serve esse prompt?</label>
          <input
            className="input" style={{ fontSize: 13 }}
            placeholder="Ex: criar roteiro de reel sobre branding, analisar concorrentes..."
            value={respostas.finalidade}
            onChange={e => setRespostas(r => ({ ...r, finalidade: e.target.value }))}
          />
        </div>
        <div className="col gap-1">
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Qual IA será usada?</label>
          <select className="select" style={{ fontSize: 13 }}
            value={respostas.ia} onChange={e => setRespostas(r => ({ ...r, ia: e.target.value }))}>
            {IA_OPTIONS.map(ia => <option key={ia} value={ia}>{ia}</option>)}
          </select>
        </div>
        <div className="col gap-1">
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Qual formato de resultado você quer?</label>
          <input
            className="input" style={{ fontSize: 13 }}
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
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Título <span style={{ color: 'var(--pink-deep)' }}>*</span></label>
          <input
            className="input" style={{ fontSize: 13 }}
            placeholder="Nome do prompt..."
            value={newPrompt.titulo}
            onChange={e => setNewPrompt(p => ({ ...p, titulo: e.target.value }))}
          />
        </div>
        <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Descrição curta</label>
          <input
            className="input" style={{ fontSize: 13 }}
            placeholder="O que esse prompt faz..."
            value={newPrompt.desc}
            onChange={e => setNewPrompt(p => ({ ...p, desc: e.target.value }))}
          />
        </div>
        <div className="col gap-1">
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>IA recomendada</label>
          <select className="select" style={{ fontSize: 13 }}
            value={newPrompt.ia} onChange={e => setNewPrompt(p => ({ ...p, ia: e.target.value }))}>
            {IA_OPTIONS.map(ia => <option key={ia} value={ia}>{ia}</option>)}
          </select>
        </div>
        <div className="col gap-1">
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Categoria</label>
          <select className="select" style={{ fontSize: 13 }}
            value={newPrompt.cat} onChange={e => setNewPrompt(p => ({ ...p, cat: e.target.value }))}>
            {Object.entries(window.PROMPT_CATS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>
        <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Texto do prompt</label>
          <textarea
            className="input" style={{ fontSize: 13, minHeight: 180, resize: 'vertical', lineHeight: 1.55, fontFamily: 'ui-monospace, SF Mono, monospace' }}
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
