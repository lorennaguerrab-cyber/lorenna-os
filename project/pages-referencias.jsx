/* ──────────────────────────────────────────────
   pages-referencias.jsx — Acervo de Referências
   ────────────────────────────────────────────── */

const { useState } = React;

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

function RefCard({ item: r, onDelete }) {
  const [open, setOpen] = useState(false);
  const [analise, setAnalise] = useState(null);
  const [analisando, setAnalisando] = useState(false);
  const tipo = REF_TIPOS[r.tipo] || REF_TIPOS.outro;

  async function analisarEsta() {
    if (!window.hasClaudeKey || !window.hasClaudeKey()) {
      showToast('Configure sua chave Claude primeiro (botão ✨ no canto)');
      return;
    }
    setAnalisando(true);
    setAnalise(null);

    const contexto = `Referência: "${r.titulo}"
Tipo: ${tipo.label}
${r.url ? `URL: ${r.url}` : ''}
${r.nota ? `O que me atraiu: ${r.nota}` : ''}`;

    const resp = await window.callClaude([{
      role: 'user',
      content: `${contexto}

Analise essa referência que salvei e me ajude a extrair valor criativo dela:

1. **O que posso aprender**: principais características que a tornam boa/relevante
2. **Elementos adaptáveis**: o que posso incorporar no meu estilo próprio (sem copiar)
3. **Ideias de conteúdo**: 3 ideias concretas inspiradas nessa referência que funcionam para meu nicho (branding, criatividade, maternidade, lifestyle)
4. **Gancho criativo**: um ângulo ou abordagem diferente que eu poderia usar

Seja direta e prática. Foque em como posso USAR essa inspiração, não apenas descrever ela.`,
    }],
    'Você é uma consultora criativa para Lorenna, criadora de conteúdo focada em branding, design e vida criativa. Seu objetivo é ajudá-la a transformar referências em conteúdo autêntico e original, nunca copiar.',
    'claude-sonnet-4-6');

    setAnalisando(false);
    if (resp) setAnalise(resp);
    else showToast('Erro ao analisar. Tente novamente.');
  }

  return (
    <Card>
      <CardBody tight>
        <div className="col gap-3">
          <div className="row gap-3" style={{ alignItems: 'flex-start' }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--r-md)', flexShrink: 0,
              background: `color-mix(in oklch, ${tipo.color} 18%, var(--bg-elevated))`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>{tipo.emoji}</div>

            <div className="grow" style={{ minWidth: 0 }}>
              <div className="row gap-2" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--ink)' }}>{r.titulo}</span>
                <span style={{
                  fontSize: 14, padding: '2px 8px', borderRadius: 999,
                  background: `color-mix(in oklch, ${tipo.color} 14%, transparent)`,
                  color: tipo.color, fontWeight: 600,
                }}>{tipo.label}</span>
              </div>
              {r.url && (
                <a href={r.url} target="_blank" rel="noopener" style={{
                  display: 'block', marginTop: 3, fontSize: 14,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  color: 'var(--pink-deep)',
                }}>{r.url}</a>
              )}
              {r.nota && (
                <p style={{ marginTop: 6, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-soft)' }}>
                  {open ? r.nota : r.nota.slice(0, 100) + (r.nota.length > 100 ? '…' : '')}
                  {r.nota.length > 100 && (
                    <button onClick={() => setOpen(!open)} style={{
                      color: 'var(--pink-deep)', background: 'none', border: 'none',
                      padding: '0 4px', cursor: 'pointer', fontSize: 14,
                    }}>{open ? 'menos' : 'mais'}</button>
                  )}
                </p>
              )}
              <div style={{ fontSize: 14, color: 'var(--gray)', marginTop: 4 }}>{r.data}</div>
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

          {/* Analyze button */}
          {!analise && (
            <Button variant="ghost" size="sm" onClick={analisarEsta} disabled={analisando}
              style={{ alignSelf: 'flex-start', color: 'var(--pink-deep)', fontSize: 14 }}>
              {analisando ? '✨ Analisando…' : '✨ Analisar esta referência'}
            </Button>
          )}

          {/* Analysis result */}
          {analise && (
            <div style={{
              padding: 'var(--s-3) var(--s-4)',
              background: 'color-mix(in oklch, var(--pink) 5%, var(--bg-elevated))',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--pink-soft)',
              fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)',
              whiteSpace: 'pre-wrap',
            }}>
              <div className="row between" style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--pink-deep)' }}>✨ Análise da IA</span>
                <div className="row gap-1">
                  <Button variant="ghost" size="sm" className="icon" onClick={() => { navigator.clipboard.writeText(analise); showToast('Copiado!'); }}>
                    <Icon name="copy" size={12}/>
                  </Button>
                  <Button variant="ghost" size="sm" className="icon" onClick={() => setAnalise(null)}>
                    <Icon name="x" size={12}/>
                  </Button>
                </div>
              </div>
              {analise}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function ReferenciasPage() {
  const [refs, setRefs] = useState(() => loadRefs());
  const [filtro, setFiltro] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [analiseGeral, setAnaliseGeral] = useState(null);
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
    if (refs.length < 2) { showToast('Adicione pelo menos 2 referências para analisar padrões'); return; }
    if (!window.hasClaudeKey || !window.hasClaudeKey()) {
      showToast('Configure sua chave Claude primeiro (botão ✨ no canto)');
      return;
    }
    setAnalisando(true);
    setAnaliseGeral(null);

    const lista = refs.map(r =>
      `Tipo: ${REF_TIPOS[r.tipo]?.label || r.tipo} | Título: ${r.titulo}${r.url ? ` | URL: ${r.url}` : ''}${r.nota ? ` | Nota: ${r.nota}` : ''}`
    ).join('\n');

    const resp = await window.callClaude([{
      role: 'user',
      content: `Aqui estão minhas ${refs.length} referências salvas:\n\n${lista}\n\nAnalise os padrões entre todas elas:\n1. Estética e estilo visual predominante\n2. Temas recorrentes que me atraem\n3. Formatos de conteúdo favoritos\n4. Padrão de marcas/criadores que admiro\n5. O que isso revela sobre o conteúdo que devo criar\n6. 3 sugestões concretas baseadas nesses padrões`,
    }],
    'Você é uma consultora criativa para Lorenna. Seja direta e perspicaz.',
    'claude-sonnet-4-6');

    setAnalisando(false);
    if (resp) setAnaliseGeral(resp);
    else showToast('Erro ao analisar. Tente novamente.');
  }

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Referências"
          subtitle={`${refs.length} referência${refs.length !== 1 ? 's' : ''} salva${refs.length !== 1 ? 's' : ''}`}
          action={
            <div className="row gap-2">
              {refs.length >= 2 && (
                <Button variant="ghost" onClick={analisarPadroes} disabled={analisando}>
                  {analisando ? '✨ Analisando…' : '✨ Padrões gerais'}
                </Button>
              )}
              <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                <Icon name="plus" size={14} color="white"/> Adicionar
              </Button>
            </div>
          }
        />

        {/* Add form */}
        {showForm && (
          <Card>
            <CardBody className="col gap-4">
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 600 }}>Nova referência</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
                <div className="col gap-1">
                  <label style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-secondary)' }}>Título *</label>
                  <input className="input" placeholder="Nome do perfil, título do post…" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})}
                    onKeyDown={e => e.key === 'Enter' && addRef()}/>
                </div>
                <div className="col gap-1">
                  <label style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-secondary)' }}>Tipo</label>
                  <select className="select" value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})}>
                    {Object.entries(REF_TIPOS).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="col gap-1">
                <label style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-secondary)' }}>Link (opcional)</label>
                <input className="input" placeholder="https://…" value={form.url} onChange={e => setForm({...form, url: e.target.value})}/>
              </div>
              <div className="col gap-1">
                <label style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-secondary)' }}>O que te inspirou nessa referência?</label>
                <textarea className="textarea" placeholder="Estética, texto, formato, vibe, o que te chamou atenção…" value={form.nota}
                  onChange={e => setForm({...form, nota: e.target.value})} style={{ minHeight: 80 }}/>
              </div>
              <div className="row gap-2">
                <Button variant="primary" onClick={addRef}>Salvar referência</Button>
                <Button variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* General analysis */}
        {analiseGeral && (
          <Card>
            <CardBody className="col gap-3">
              <div className="row between">
                <div className="row gap-2">
                  <span style={{ fontSize: 20 }}>✨</span>
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 600 }}>Padrões das suas referências</h3>
                </div>
                <div className="row gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(analiseGeral); showToast('Copiado!'); }}>
                    <Icon name="copy" size={13}/>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setAnaliseGeral(null)}>
                    <Icon name="x" size={13}/>
                  </Button>
                </div>
              </div>
              <div style={{
                padding: 'var(--s-4)',
                background: 'color-mix(in oklch, var(--pink) 5%, var(--bg-elevated))',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--pink-soft)',
                fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)',
                whiteSpace: 'pre-wrap',
              }}>{analiseGeral}</div>
            </CardBody>
          </Card>
        )}

        {/* Type filters */}
        {refs.length > 0 && (
          <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
            <button onClick={() => setFiltro('todos')} style={{
              fontSize: 14, padding: '6px 14px', borderRadius: 999,
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
                  fontSize: 14, padding: '6px 14px', borderRadius: 999,
                  border: '1px solid', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  background: filtro === k ? `color-mix(in oklch, ${v.color} 14%, var(--bg-surface))` : 'var(--bg-surface)',
                  borderColor: filtro === k ? v.color : 'var(--border)',
                  color: filtro === k ? v.color : 'var(--text-muted)',
                  fontWeight: filtro === k ? 600 : 400,
                }}>{v.emoji} {v.label} ({count})</button>
              );
            })}
          </div>
        )}

        {/* List */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--s-8) 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📌</div>
            <p style={{ color: 'var(--gray)', fontSize: 15 }}>Nenhuma referência ainda.</p>
            <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: 4 }}>Adicione perfis, vídeos, posts que te inspiram!</p>
            <Button variant="primary" onClick={() => setShowForm(true)} style={{ marginTop: 16 }}>
              <Icon name="plus" size={14} color="white"/> Adicionar primeira referência
            </Button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--s-3)' }}>
            {filtered.map(r => <RefCard key={r.id} item={r} onDelete={deleteRef}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

window.ReferenciasPage = ReferenciasPage;
