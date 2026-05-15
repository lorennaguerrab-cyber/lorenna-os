/* ──────────────────────────────────────────────
   pages-referencias.jsx — Acervo de Referências
   ────────────────────────────────────────────── */

const { useState, useEffect } = React;

const REF_TIPOS = {
  perfil:    { label: 'Perfil',      color: '#E8538D', emoji: '👤' },
  video:     { label: 'Vídeo',       color: '#C44878', emoji: '🎬' },
  post:      { label: 'Post',        color: '#FF78B0', emoji: '📱' },
  blog:      { label: 'Blog/Artigo', color: '#A89AC9', emoji: '✍️' },
  design:    { label: 'Design',      color: '#5A6F9C', emoji: '🎨' },
  marca:     { label: 'Marca',       color: '#E8A87C', emoji: '⭐' },
  outro:     { label: 'Outro',       color: '#908F8E', emoji: '📌' },
};

const STORAGE_KEY = 'lorenna_referencias';

function loadRefs() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveRefs(refs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(refs));
}

function RefCard({ ref: r, onDelete }) {
  const [open, setOpen] = useState(false);
  const tipo = REF_TIPOS[r.tipo] || REF_TIPOS.outro;

  return (
    <Card hoverable>
      <CardBody tight>
        <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--r-md)', flexShrink: 0,
            background: `color-mix(in oklch, ${tipo.color} 15%, var(--bg-elevated))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>{tipo.emoji}</div>

          <div className="grow" style={{ minWidth: 0 }}>
            <div className="row gap-2" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{r.titulo}</span>
              <span className="tiny" style={{
                padding: '2px 8px', borderRadius: 999,
                background: `color-mix(in oklch, ${tipo.color} 14%, transparent)`,
                color: tipo.color, fontWeight: 600,
              }}>{tipo.label}</span>
            </div>
            {r.url && (
              <a href={r.url} target="_blank" rel="noopener" className="tiny muted" style={{
                display: 'block', marginTop: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                color: 'var(--pink-deep)',
              }}>{r.url}</a>
            )}
            {r.nota && (
              <p className="small muted" style={{ marginTop: 4, lineHeight: 1.5 }}>
                {open ? r.nota : r.nota.slice(0, 80) + (r.nota.length > 80 ? '...' : '')}
              </p>
            )}
            {r.nota && r.nota.length > 80 && (
              <button onClick={() => setOpen(!open)} className="tiny" style={{
                color: 'var(--pink-deep)', background: 'none', border: 'none',
                padding: 0, cursor: 'pointer', marginTop: 2,
              }}>{open ? 'Ver menos' : 'Ver mais'}</button>
            )}
            <div className="tiny muted" style={{ marginTop: 4 }}>{r.data}</div>
          </div>

          <div className="row gap-1" style={{ flexShrink: 0 }}>
            {r.url && (
              <a href={r.url} target="_blank" rel="noopener">
                <Button variant="ghost" size="sm" className="icon" title="Abrir link">
                  <Icon name="arrow" size={13}/>
                </Button>
              </a>
            )}
            <Button variant="ghost" size="sm" className="icon" onClick={() => onDelete(r.id)} title="Remover">
              <Icon name="x" size={13}/>
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function ReferenciasPage() {
  const [refs, setRefs] = useState(() => loadRefs());
  const [filtro, setFiltro] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [analise, setAnalise] = useState(null);
  const [analisando, setAnalisando] = useState(false);
  const [form, setForm] = useState({ titulo: '', url: '', tipo: 'perfil', nota: '' });

  const filtered = filtro === 'todos' ? refs : refs.filter(r => r.tipo === filtro);

  function addRef() {
    if (!form.titulo.trim()) { showToast('Adicione um título'); return; }
    const nova = {
      id: crypto.randomUUID(),
      titulo: form.titulo.trim(),
      url: form.url.trim(),
      tipo: form.tipo,
      nota: form.nota.trim(),
      data: new Date().toLocaleDateString('pt-BR'),
    };
    const novas = [nova, ...refs];
    setRefs(novas);
    saveRefs(novas);
    setForm({ titulo: '', url: '', tipo: 'perfil', nota: '' });
    setShowForm(false);
    showToast('Referência salva!');
  }

  function deleteRef(id) {
    const novas = refs.filter(r => r.id !== id);
    setRefs(novas);
    saveRefs(novas);
    showToast('Removida.');
  }

  async function analisarPadroes() {
    if (refs.length < 3) { showToast('Adicione pelo menos 3 referências para analisar'); return; }
    if (!window.hasClaudeKey || !window.hasClaudeKey()) {
      showToast('Configure sua chave Claude primeiro (botão ✨ no canto)');
      return;
    }
    setAnalisando(true);
    setAnalise(null);

    const lista = refs.map(r =>
      `Tipo: ${REF_TIPOS[r.tipo]?.label || r.tipo} | Título: ${r.titulo}${r.url ? ` | URL: ${r.url}` : ''}${r.nota ? ` | Nota: ${r.nota}` : ''}`
    ).join('\n');

    const resp = await window.callClaude([{
      role: 'user',
      content: `Aqui estão minhas ${refs.length} referências salvas:\n\n${lista}\n\nAnalise o que esses conteúdos têm em comum. Identifique:\n1. Estética ou estilo visual predominante\n2. Temas e assuntos que me atraem\n3. Formato de conteúdo que mais salvo\n4. Padrão de marcas/criadores que admiro\n5. O que isso diz sobre o conteúdo que eu deveria criar\n6. 3 sugestões concretas baseadas nessas referências`,
    }],
    'Você é uma consultora criativa e de marketing para Lorenna, criadora de conteúdo. Seja direta, perspicaz e prática. Foque em insights acionáveis.',
    'claude-sonnet-4-6');

    setAnalisando(false);
    if (resp) setAnalise(resp);
    else showToast('Erro ao analisar. Tente novamente.');
  }

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Referências"
          subtitle={`${refs.length} referências salvas`}
          action={
            <div className="row gap-2">
              <Button variant="ghost" onClick={analisarPadroes} disabled={analisando}>
                {analisando ? '✨ Analisando...' : '✨ Analisar padrões'}
              </Button>
              <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                <Icon name="plus" size={14} color="white"/> Adicionar
              </Button>
            </div>
          }
        />

        {/* Form */}
        {showForm && (
          <Card>
            <CardBody className="col gap-4">
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 600 }}>Nova referência</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
                <div className="col gap-1">
                  <label className="tiny" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text-secondary)' }}>Título *</label>
                  <input className="input" placeholder="Nome do perfil, título do post..." value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})}/>
                </div>
                <div className="col gap-1">
                  <label className="tiny" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text-secondary)' }}>Tipo</label>
                  <select className="select" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                    {Object.entries(REF_TIPOS).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="col gap-1">
                <label className="tiny" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text-secondary)' }}>Link (opcional)</label>
                <input className="input" placeholder="https://..." value={form.url} onChange={e => setForm({...form, url: e.target.value})}/>
              </div>
              <div className="col gap-1">
                <label className="tiny" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', color: 'var(--text-secondary)' }}>O que te inspirou nessa referência?</label>
                <textarea className="textarea" placeholder="O que te chamou atenção? Estética, texto, formato, vibe..." value={form.nota} onChange={e => setForm({...form, nota: e.target.value})} style={{ minHeight: 80 }}/>
              </div>
              <div className="row gap-2">
                <Button variant="primary" onClick={addRef}>Salvar referência</Button>
                <Button variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* AI Analysis */}
        {analise && (
          <Card>
            <CardBody className="col gap-3">
              <div className="row between">
                <div className="row gap-2">
                  <span style={{ fontSize: 20 }}>✨</span>
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 600 }}>Padrões identificados pela IA</h3>
                </div>
                <div className="row gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(analise); showToast('Copiado!'); }}>
                    <Icon name="copy" size={13}/>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setAnalise(null)}>
                    <Icon name="x" size={13}/>
                  </Button>
                </div>
              </div>
              <div style={{
                padding: 'var(--s-4)',
                background: 'color-mix(in oklch, var(--pink) 6%, var(--bg-elevated))',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--pink-soft)',
                fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)',
              }}>{analise}</div>
            </CardBody>
          </Card>
        )}

        {/* Filters */}
        <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
          <button onClick={() => setFiltro('todos')} style={{
            fontSize: 13, padding: '6px 14px', borderRadius: 999,
            border: '1px solid', cursor: 'pointer', fontFamily: 'var(--font-body)',
            background: filtro === 'todos' ? 'var(--pink-tint)' : 'var(--bg-surface)',
            borderColor: filtro === 'todos' ? 'var(--pink)' : 'var(--border)',
            color: filtro === 'todos' ? 'var(--pink-deep)' : 'var(--text-muted)',
            fontWeight: filtro === 'todos' ? 600 : 400,
          }}>Todos ({refs.length})</button>
          {Object.entries(REF_TIPOS).map(([k, v]) => {
            const count = refs.filter(r => r.tipo === k).length;
            if (count === 0) return null;
            return (
              <button key={k} onClick={() => setFiltro(k)} style={{
                fontSize: 13, padding: '6px 14px', borderRadius: 999,
                border: '1px solid', cursor: 'pointer', fontFamily: 'var(--font-body)',
                background: filtro === k ? `color-mix(in oklch, ${v.color} 14%, var(--bg-surface))` : 'var(--bg-surface)',
                borderColor: filtro === k ? v.color : 'var(--border)',
                color: filtro === k ? v.color : 'var(--text-muted)',
                fontWeight: filtro === k ? 600 : 400,
              }}>{v.emoji} {v.label} ({count})</button>
            );
          })}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="center col gap-3" style={{ padding: 'var(--s-8) 0' }}>
            <span style={{ fontSize: 40 }}>📌</span>
            <p className="muted">Nenhuma referência ainda. Adicione perfis, vídeos, posts que te inspiram!</p>
          </div>
        ) : (
          <div className="col gap-3">
            {filtered.map(r => <RefCard key={r.id} ref={r} onDelete={deleteRef}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

window.ReferenciasPage = ReferenciasPage;
