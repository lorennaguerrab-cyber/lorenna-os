/* ──────────────────────────────────────────────
   pages-materiais.jsx — Acervo pessoal de mídia
   ────────────────────────────────────────────── */

const { useState } = React;

function MateriaisPage() {
  const [tab, setTab] = useState('fotos');
  const [view, setView] = useState('grid');

  const MATERIAIS = {
    fotos: [
      { id: 'f1', nome: 'Ensaio março 2026', tipo: 'foto', tags: ['ensaio', 'pessoal'], thumb: null, data: 'Mar 2026' },
      { id: 'f2', nome: 'Making of Pratique', tipo: 'foto', tags: ['cliente', 'pratique'], thumb: null, data: 'Abr 2026' },
      { id: 'f3', nome: 'Selfies stories', tipo: 'foto', tags: ['stories', 'pessoal'], thumb: null, data: 'Mai 2026' },
    ],
    videos: [
      { id: 'v1', nome: 'Bastidores escritório', tipo: 'video', tags: ['broll', 'escritório'], thumb: null, data: 'Abr 2026', dur: '0:32' },
      { id: 'v2', nome: 'Vlog rotina CEO', tipo: 'video', tags: ['vlog', 'lorenna'], thumb: null, data: 'Mai 2026', dur: '2:15' },
    ],
    docs: [
      { id: 'doc1', nome: 'Proposta padrão Logue', tipo: 'doc', tags: ['template', 'agência'], data: 'Jan 2026' },
      { id: 'doc2', nome: 'Contrato social media', tipo: 'doc', tags: ['template', 'contrato'], data: 'Fev 2026' },
    ],
    broll: [
      { id: 'b1', desc: 'Mãos digitando no notebook — janela ao fundo', gravado: false, tags: ['trabalho', 'ambiente'] },
      { id: 'b2', desc: 'Café sendo servido — close na xícara', gravado: true, tags: ['lifestyle', 'rotina'] },
      { id: 'b3', desc: 'Folheando caderno de anotações', gravado: false, tags: ['planejamento', 'criativo'] },
      { id: 'b4', desc: 'Vista do escritório — câmera lenta', gravado: false, tags: ['ambiente', 'tranquilo'] },
      { id: 'b5', desc: 'Meninos brincando no jardim', gravado: true, tags: ['família', 'maternidade'] },
      { id: 'b6', desc: 'Planner aberto com caneta', gravado: false, tags: ['organização', 'rotina'] },
    ],
  };

  const [broll, setBroll] = useState(MATERIAIS.broll);
  const [showAddBroll, setShowAddBroll] = useState(false);
  const [newBroll, setNewBroll] = useState('');

  const TABS = [
    { id: 'fotos',   label: 'Fotos',       icon: 'flower' },
    { id: 'videos',  label: 'Vídeos',      icon: 'play'   },
    { id: 'docs',    label: 'Documentos',  icon: 'doc'    },
    { id: 'broll',   label: 'B-Roll',      icon: 'grid'   },
  ];

  const TYPE_ICON = { foto: 'flower', video: 'play', doc: 'doc' };

  function toggleGravado(id) {
    setBroll(prev => prev.map(b => b.id === id ? { ...b, gravado: !b.gravado } : b));
  }

  function addBroll() {
    if (!newBroll.trim()) return;
    setBroll(prev => [...prev, { id: 'b' + Date.now(), desc: newBroll.trim(), gravado: false, tags: [] }]);
    setNewBroll('');
    setShowAddBroll(false);
    showToast('B-roll adicionado!');
  }

  const currentItems = tab !== 'broll' ? MATERIAIS[tab] : [];
  const gravados = broll.filter(b => b.gravado).length;
  const pendentes = broll.filter(b => !b.gravado);
  const done = broll.filter(b => b.gravado);
  const brollOrdered = [...pendentes, ...done];

  return (
    <div className="content" style={{ maxWidth: 1100 }}>
      <div className="col gap-5 fade-up">

        {/* Header */}
        <div className="row between" style={{ alignItems: 'flex-start', marginBottom: 'var(--s-5)' }}>
          <div>
            <h1 className="page-title">Materiais</h1>
            <p className="page-subtitle">Seu acervo pessoal</p>
          </div>
          <div className="row gap-2">
            {tab !== 'broll' && (
              <div className="row" style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--r-md)', padding: 3, gap: 2 }}>
                <button onClick={() => setView('grid')} className="btn icon"
                  style={{ padding: 6, background: view === 'grid' ? 'var(--bg-surface)' : 'transparent', boxShadow: view === 'grid' ? 'var(--shadow-sm)' : 'none', color: view === 'grid' ? 'var(--pink-deep)' : 'var(--text-muted)' }}>
                  <Icon name="grid" size={15}/>
                </button>
                <button onClick={() => setView('list')} className="btn icon"
                  style={{ padding: 6, background: view === 'list' ? 'var(--bg-surface)' : 'transparent', boxShadow: view === 'list' ? 'var(--shadow-sm)' : 'none', color: view === 'list' ? 'var(--pink-deep)' : 'var(--text-muted)' }}>
                  <Icon name="list" size={15}/>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="row" style={{ borderBottom: '1px solid var(--border)', gap: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '14px 18px',
                background: 'transparent',
                border: 'none',
                borderBottom: tab === t.id ? '2px solid var(--pink)' : '2px solid transparent',
                color: tab === t.id ? 'var(--pink-deep)' : 'var(--text-muted)',
                fontWeight: tab === t.id ? 600 : 500,
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                marginBottom: -1,
                display: 'flex', alignItems: 'center', gap: 7,
                whiteSpace: 'nowrap',
                transition: 'color .15s',
              }}>
              <Icon name={t.icon} size={13}/> {t.label}
            </button>
          ))}
        </div>

        {/* Fotos / Vídeos / Docs */}
        {tab !== 'broll' && (
          <div className="col gap-4">
            <div className="row between">
              <span className="tiny muted">{currentItems.length} {tab === 'fotos' ? 'fotos' : tab === 'videos' ? 'vídeos' : 'documentos'}</span>
              <Button variant="primary" size="sm" onClick={() => showToast('Em breve: upload de arquivos')}>
                <Icon name="plus" size={13} color="white"/> Adicionar
              </Button>
            </div>

            {view === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'var(--s-4)' }}>
                {currentItems.map(item => (
                  <Card key={item.id} hoverable>
                    <CardBody className="col gap-3">
                      {/* Thumbnail placeholder */}
                      <div style={{ aspectRatio: '16/9', background: 'var(--bg-elevated)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={TYPE_ICON[item.tipo] || 'doc'} size={24} color="var(--text-muted)"/>
                      </div>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{item.nome}</p>
                        {item.dur && (
                          <span className="tiny muted" style={{ marginTop: 2, display: 'block' }}>{item.dur}</span>
                        )}
                      </div>
                      <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
                        {item.tags.map(tag => (
                          <span key={tag} className="tiny" style={{
                            padding: '2px 9px', borderRadius: 999,
                            background: 'var(--pink-tint)', color: 'var(--pink-deep)',
                            fontWeight: 500, fontSize: 11,
                          }}>{tag}</span>
                        ))}
                      </div>
                      <div className="row gap-1 tiny muted">
                        <Icon name="calendar" size={11}/> {item.data}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="col gap-2">
                {currentItems.map(item => (
                  <Card key={item.id} hoverable>
                    <CardBody tight>
                      <div className="row gap-3">
                        <div style={{
                          width: 40, height: 40, borderRadius: 'var(--r-sm)',
                          background: 'var(--pink-tint)', border: '1px solid var(--pink-soft)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Icon name={TYPE_ICON[item.tipo] || 'doc'} size={17} color="var(--pink-deep)"/>
                        </div>
                        <div className="grow">
                          <p style={{ fontSize: 13.5, fontWeight: 500 }}>{item.nome}</p>
                          <div className="row gap-1" style={{ marginTop: 4, flexWrap: 'wrap' }}>
                            {item.tags.map(tag => (
                              <span key={tag} className="tiny" style={{
                                padding: '1px 8px', borderRadius: 999,
                                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                                color: 'var(--text-muted)', fontSize: 11,
                              }}>{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="col" style={{ alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                          <span className="tiny muted">{item.data}</span>
                          {item.dur && <span className="tiny muted">{item.dur}</span>}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* B-Roll tab */}
        {tab === 'broll' && (
          <div className="col gap-4">
            <div className="row between" style={{ alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Lista de B-Roll para gravar</h2>
                <p className="small muted" style={{ marginTop: 4 }}>Grave esses clipes e adicione ao seu acervo</p>
              </div>
              <div className="row gap-3" style={{ alignItems: 'center' }}>
                <span className="tiny" style={{
                  padding: '6px 14px', borderRadius: 999,
                  background: gravados === broll.length && broll.length > 0 ? 'var(--bg-elevated)' : 'var(--pink-tint)',
                  color: gravados === broll.length && broll.length > 0 ? 'var(--text-muted)' : 'var(--pink-deep)',
                  fontWeight: 600, border: '1px solid var(--pink-soft)',
                }}>
                  {gravados} de {broll.length} gravados
                </span>
                <Button variant="primary" size="sm" onClick={() => setShowAddBroll(s => !s)}>
                  <Icon name="plus" size={13} color="white"/> Novo b-roll
                </Button>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 5, background: 'var(--bg-elevated)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                width: `${broll.length > 0 ? (gravados / broll.length) * 100 : 0}%`,
                height: '100%',
                background: 'var(--pink)',
                transition: 'width .3s var(--easing)',
              }}/>
            </div>

            {/* Inline add form */}
            {showAddBroll && (
              <Card variant="accent">
                <CardBody className="col gap-3">
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--pink-deep)' }}>Novo clipe para gravar</p>
                  <textarea
                    className="textarea"
                    rows={2}
                    placeholder="Descreva o clipe — ex: Mãos digitando no notebook com luz natural..."
                    value={newBroll}
                    onChange={e => setNewBroll(e.target.value)}
                    onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') addBroll(); }}
                    autoFocus
                  />
                  <div className="row gap-2">
                    <Button variant="primary" size="sm" onClick={addBroll} disabled={!newBroll.trim()}>
                      Adicionar
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { setShowAddBroll(false); setNewBroll(''); }}>
                      Cancelar
                    </Button>
                    <span className="tiny muted" style={{ marginLeft: 'auto' }}>⌘ + Enter</span>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* B-roll list */}
            <div className="col gap-2">
              {brollOrdered.map(item => (
                <Card key={item.id} style={{ opacity: item.gravado ? 0.6 : 1, transition: 'opacity .2s' }}>
                  <CardBody tight>
                    <div className="row gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleGravado(item.id)}
                        style={{
                          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                          border: `2px solid ${item.gravado ? 'var(--success)' : 'var(--border-strong)'}`,
                          background: item.gravado ? 'var(--success)' : 'transparent',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all .15s',
                        }}>
                        {item.gravado && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 6l3 3 5-5"/>
                          </svg>
                        )}
                      </button>

                      <div className="grow">
                        <p style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          textDecoration: item.gravado ? 'line-through' : 'none',
                          color: item.gravado ? 'var(--text-muted)' : 'var(--text-primary)',
                          transition: 'color .15s',
                        }}>{item.desc}</p>
                        {item.tags.length > 0 && (
                          <div className="row gap-1" style={{ marginTop: 5, flexWrap: 'wrap' }}>
                            {item.tags.map(tag => (
                              <span key={tag} className="tiny" style={{
                                padding: '1px 8px', borderRadius: 999,
                                background: item.gravado ? 'var(--bg-elevated)' : 'var(--pink-tint)',
                                color: item.gravado ? 'var(--text-muted)' : 'var(--pink-deep)',
                                fontSize: 11, fontWeight: 500,
                              }}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {item.gravado && (
                        <span className="tiny" style={{ color: 'var(--success)', fontWeight: 600, flexShrink: 0 }}>✓ Gravado</span>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Google Drive section */}
        <div style={{ padding: 'var(--s-5)', background: 'var(--pink-tint)', border: '1px solid var(--pink-soft)', borderRadius: 'var(--r-md)' }}>
          <div className="row gap-3">
            <div style={{ fontSize: 24 }}>💾</div>
            <div className="grow">
              <div style={{ fontWeight: 600, fontSize: 14 }}>Google Drive</div>
              <p className="tiny muted" style={{ marginTop: 2 }}>Conecte sua conta para sincronizar fotos, vídeos e documentos automaticamente.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => showToast('Vá em Integrações para conectar o Google Drive')}>Conectar</Button>
          </div>
        </div>

      </div>
    </div>
  );
}

window.MateriaisPage = MateriaisPage;
