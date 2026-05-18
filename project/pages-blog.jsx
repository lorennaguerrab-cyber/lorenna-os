/* ──────────────────────────────────────────────
   pages-blog.jsx — Blog · Ideias e SEO
   ────────────────────────────────────────────── */

const { useState, useEffect } = React;

const SEO_TIPS = [
  { icon: '🔍', title: 'Palavra-chave no título', desc: 'Use a keyword principal nos primeiros 60 caracteres do título do post.' },
  { icon: '🔗', title: 'Link interno por post', desc: 'Adicione pelo menos 1 link para outro post do blog em cada publicação.' },
  { icon: '📸', title: 'Alt text nas imagens', desc: 'Descreva cada imagem com palavras-chave naturais para ranquear no Google Imagens.' },
  { icon: '⏱️', title: 'Tempo de leitura ideal', desc: 'Posts entre 1.200 e 2.000 palavras performam melhor em SEO geral.' },
  { icon: '📱', title: 'Mobile first', desc: 'Mais de 70% do tráfego é mobile. Verifique como cada post aparece no celular.' },
  { icon: '🗓️', title: 'Frequência constante', desc: '2x por semana ou 1x por semana — o Google prioriza consistência acima de volume.' },
];

const GROWTH_IDEAS = [
  { emoji: '🤝', title: 'Guest posts', desc: 'Escreva para blogs parceiros e peça link de volta para o seu.' },
  { emoji: '📧', title: 'Newsletter → blog', desc: 'Converta cada newsletter em um post de blog — dobra o conteúdo sem esforço.' },
  { emoji: '♻️', title: 'Reaproveitamento', desc: 'Cada post vira: reel, carrossel, thread, e-mail, stories. Multiplique.' },
  { emoji: '💬', title: 'Responda comentários', desc: 'Comentários geram atividade no post e sinalizam engajamento para o Google.' },
  { emoji: '🔀', title: 'Atualize posts antigos', desc: 'Posts com mais de 6 meses: atualize data, dados e imagens. Sobe no ranking.' },
  { emoji: '🌐', title: 'Schema markup', desc: 'Adicione Schema JSON-LD para artigos — aumenta chances de rich snippets.' },
];

function BlogPostCard({ post, onOpen }) {
  const cfg = window.STATUS_CONTEUDO?.[post.status] || { label: post.status, color: 'var(--pink)' };
  return (
    <Card hoverable onClick={onOpen} style={{ cursor: 'pointer' }}>
      <CardBody className="col gap-3">
        <div className="row between" style={{ alignItems: 'flex-start', gap: 8 }}>
          <p style={{ fontFamily: 'var(--font-title)', fontSize: 15, fontWeight: 600, lineHeight: 1.35, flex: 1 }}>
            {post.titulo}
          </p>
          <span style={{
            padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, flexShrink: 0,
            background: `color-mix(in oklch, ${cfg.color} 16%, transparent)`,
            color: cfg.color,
          }}>{cfg.label}</span>
        </div>
        <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
          {post.categoria && (
            <span className="tiny" style={{
              padding: '2px 8px', borderRadius: 999,
              background: 'var(--bg-elevated)', color: 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}>{window.CATEGORY_LABELS?.[post.categoria] || post.categoria}</span>
          )}
          {post.data && (
            <span className="tiny muted">{post.data}</span>
          )}
          {(post.plataformas || []).map(p => (
            <span key={p} className="tiny" style={{
              padding: '2px 8px', borderRadius: 999,
              background: `color-mix(in oklch, ${window.PLATFORM_COLORS?.[p] || '#999'} 14%, transparent)`,
              color: window.PLATFORM_COLORS?.[p] || '#999', fontWeight: 500,
            }}>{window.PLATFORM_LABELS?.[p] || p}</span>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function BlogPostModal({ post, onClose, onSave }) {
  const [titulo, setTitulo] = useState(post?.titulo || '');
  const [roteiro, setRoteiro] = useState(post?.roteiro || '');
  const [keywords, setKeywords] = useState(post?.keywords || '');
  const [gerando, setGerando] = useState(false);
  const [seoAnalise, setSeoAnalise] = useState('');
  const isNew = !post?.id;

  async function gerarIdeiaSEO() {
    if (!window.hasClaudeKey?.()) {
      showToast('Configure sua chave Claude para usar IA');
      return;
    }
    setGerando(true);
    const resp = await window.callClaude([{
      role: 'user',
      content: `Título do post: "${titulo}"\nPalavras-chave: "${keywords}"\n\nGere:\n1. Um título SEO otimizado (máx 60 chars)\n2. Meta description (máx 155 chars)\n3. 5 subtítulos H2 para estruturar o post\n4. 3 palavras-chave LSI relacionadas\n\nFormate como texto corrido e direto ao ponto.`,
    }], 'Você é especialista em SEO e marketing de conteúdo para criadores brasileiros.', 'claude-haiku-4-5-20251001');
    if (resp) setSeoAnalise(resp);
    setGerando(false);
  }

  function salvar() {
    onSave({ titulo, roteiro, keywords });
    onClose();
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(43,34,34,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: 'var(--s-6) var(--s-4)', overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(760px, 96vw)', background: 'var(--white)',
        borderRadius: 'var(--r-xl)', border: '1px solid var(--gray-light)',
        overflow: 'hidden',
      }}>
        <div style={{ height: 4, background: 'var(--pink)' }}/>
        <div style={{ padding: 'var(--s-5)' }}>
          <div className="row between" style={{ marginBottom: 'var(--s-4)' }}>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 700 }}>
              {isNew ? 'Novo post de blog' : 'Editar post'}
            </h2>
            <Button variant="ghost" size="sm" className="icon" onClick={onClose}>
              <Icon name="x" size={15}/>
            </Button>
          </div>

          <div className="col gap-4">
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Título do post</label>
              <input className="input" style={{ fontSize: 15, fontWeight: 500 }}
                placeholder="Escreva um título que desperta curiosidade..."
                value={titulo} onChange={e => setTitulo(e.target.value)}/>
            </div>

            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Palavras-chave</label>
              <input className="input" style={{ fontSize: 14 }}
                placeholder="Ex: organização TDAH, sistema de produtividade, criador de conteúdo..."
                value={keywords} onChange={e => setKeywords(e.target.value)}/>
            </div>

            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Roteiro / Rascunho</label>
              <textarea
                style={{
                  width: '100%', minHeight: 200, padding: '14px 16px',
                  fontSize: 14, lineHeight: 1.7, color: 'var(--ink)',
                  background: 'var(--offwhite)', border: '1.5px solid var(--pink-soft)',
                  borderRadius: 15, resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'var(--font-body)',
                }}
                placeholder="Escreva a estrutura, pontos principais, ou o rascunho completo..."
                value={roteiro}
                onChange={e => setRoteiro(e.target.value)}
                onFocus={e => e.target.style.borderColor = 'var(--pink)'}
                onBlur={e => e.target.style.borderColor = 'var(--pink-soft)'}
              />
            </div>

            {titulo && (
              <button onClick={gerarIdeiaSEO} disabled={gerando}
                style={{
                  padding: '10px 16px', borderRadius: 'var(--r-md)', cursor: 'pointer',
                  background: 'linear-gradient(135deg, color-mix(in oklch, var(--pink-deep) 12%, var(--bg-surface)), color-mix(in oklch, var(--pink) 7%, var(--bg-surface)))',
                  border: '1px solid color-mix(in oklch, var(--pink-deep) 28%, var(--border))',
                  color: 'var(--pink-deep)', fontSize: 13, fontWeight: 600,
                  fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6,
                  opacity: gerando ? 0.6 : 1,
                }}>
                {gerando ? '✨ Gerando...' : '✨ Gerar análise SEO com IA'}
              </button>
            )}

            {seoAnalise && (
              <div style={{
                padding: 'var(--s-4)', background: 'color-mix(in oklch, var(--pink-deep) 5%, var(--bg-surface))',
                border: '1px solid color-mix(in oklch, var(--pink-deep) 20%, var(--border))',
                borderRadius: 'var(--r-md)',
              }}>
                <div className="eyebrow" style={{ color: 'var(--pink-deep)', marginBottom: 'var(--s-2)' }}>✨ Análise SEO</div>
                <pre style={{ fontSize: 13, fontFamily: 'var(--font-body)', lineHeight: 1.65, whiteSpace: 'pre-wrap', color: 'var(--ink-soft)', margin: 0 }}>
                  {seoAnalise}
                </pre>
              </div>
            )}

            <div className="row gap-2">
              <Button variant="primary" onClick={salvar}>
                <Icon name="check" size={13} color="white"/> Salvar post
              </Button>
              <Button variant="ghost" onClick={onClose}>Fechar</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogPage() {
  const allContent = window.DEMO_CONTENT || [];
  const blogPosts = allContent.filter(c =>
    c.tipo === 'blog' ||
    c.categoria === 'blogosfera' ||
    (c.plataformas || []).includes('blog')
  );

  const [custom, setCustom] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lorenna_blog_posts') || '[]'); } catch { return []; }
  });
  const [selected, setSelected] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [tab, setTab] = useState('posts');
  const [search, setSearch] = useState('');

  const allPosts = [...custom, ...blogPosts];
  const filtered = allPosts.filter(p =>
    !search || p.titulo.toLowerCase().includes(search.toLowerCase())
  );

  const byStatus = {
    ideia:     filtered.filter(p => p.status === 'ideia'     || !p.status),
    rascunho:  filtered.filter(p => p.status === 'rascunho'),
    revisao:   filtered.filter(p => p.status === 'revisao'   || p.status === 'editando'),
    publicado: filtered.filter(p => p.status === 'publicado' || p.status === 'agendado'),
  };

  function saveNew({ titulo, roteiro, keywords }) {
    if (!titulo.trim()) return;
    const post = {
      id: 'blog-' + Date.now(),
      titulo, roteiro, keywords,
      status: 'ideia',
      tipo: 'blog',
      plataformas: ['blog'],
      created_at: new Date().toISOString(),
    };
    const next = [post, ...custom];
    setCustom(next);
    localStorage.setItem('lorenna_blog_posts', JSON.stringify(next));
    showToast('Post criado!');
  }

  const tabs = [
    { id: 'posts',  label: 'Posts' },
    { id: 'seo',    label: 'SEO & Crescimento' },
  ];

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Blog"
          subtitle={`${allPosts.length} posts · ${byStatus.publicado.length} publicados`}
          action={
            <Button variant="primary" onClick={() => setShowNew(true)}>
              <Icon name="plus" size={14} color="white"/> Novo post
            </Button>
          }
        />

        {/* Tabs */}
        <div className="row" style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--r-md)', padding: 3, gap: 2, width: 'fit-content' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '7px 16px', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 500,
                background: tab === t.id ? 'var(--bg-surface)' : 'transparent',
                boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
                color: tab === t.id ? 'var(--pink-deep)' : 'var(--text-muted)',
                cursor: 'pointer', border: 'none', fontFamily: 'var(--font-body)',
                transition: 'all .15s',
              }}>{t.label}</button>
          ))}
        </div>

        {tab === 'posts' && (
          <>
            {/* Search */}
            <div className="row gap-2" style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)', padding: '8px 12px', maxWidth: 360,
            }}>
              <Icon name="search" size={13} color="var(--text-muted)"/>
              <input className="grow" style={{ background: 'transparent', border: 'none', fontSize: 13 }}
                placeholder="Buscar posts..." value={search} onChange={e => setSearch(e.target.value)}/>
            </div>

            {/* Status overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--s-2)' }}>
              {[
                { key: 'ideia', label: 'Ideias', color: '#A89AC9' },
                { key: 'rascunho', label: 'Rascunho', color: '#E89B4C' },
                { key: 'revisao', label: 'Revisão', color: 'var(--pink)' },
                { key: 'publicado', label: 'Publicado', color: '#7FB68C' },
              ].map(s => (
                <div key={s.key} className="center col gap-1" style={{
                  padding: 'var(--s-3)', background: 'var(--bg-surface)',
                  border: '1px solid var(--border)', borderRadius: 'var(--r-md)',
                }}>
                  <span style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 600, color: s.color }}>
                    {byStatus[s.key].length}
                  </span>
                  <span className="tiny muted">{s.label}</span>
                </div>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="center col gap-3" style={{ padding: 'var(--s-7) 0' }}>
                <span style={{ fontSize: 36 }}>✍️</span>
                <p className="small muted">Nenhum post de blog ainda.</p>
                <Button variant="primary" onClick={() => setShowNew(true)}>
                  <Icon name="plus" size={13} color="white"/> Criar primeiro post
                </Button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--s-3)' }}>
                {filtered.map(post => (
                  <BlogPostCard key={post.id} post={post} onOpen={() => setSelected(post)}/>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'seo' && (
          <div className="col gap-6">
            <div className="col gap-3">
              <div className="eyebrow">Boas práticas de SEO</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--s-3)' }}>
                {SEO_TIPS.map((tip, i) => (
                  <Card key={i}>
                    <CardBody className="row gap-3">
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{tip.icon}</span>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>{tip.title}</p>
                        <p className="small secondary" style={{ lineHeight: 1.55 }}>{tip.desc}</p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>

            <div className="col gap-3">
              <div className="eyebrow">Estratégias de crescimento</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--s-3)' }}>
                {GROWTH_IDEAS.map((idea, i) => (
                  <Card key={i}>
                    <CardBody className="row gap-3">
                      <span style={{ fontSize: 22, flexShrink: 0 }}>{idea.emoji}</span>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 4 }}>{idea.title}</p>
                        <p className="small secondary" style={{ lineHeight: 1.55 }}>{idea.desc}</p>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>

            <Card style={{ background: 'var(--pink-tint)', borderColor: 'var(--pink-soft)' }}>
              <CardBody>
                <div className="row gap-3" style={{ flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 600, marginBottom: 6 }}>
                      ✨ Gerar pauta de blog com IA
                    </h3>
                    <p className="small secondary" style={{ lineHeight: 1.55 }}>
                      Abra um novo post e use o botão "Gerar análise SEO" para receber sugestões de estrutura, meta description e palavras-chave para qualquer tema.
                    </p>
                  </div>
                  <Button variant="primary" onClick={() => { setTab('posts'); setShowNew(true); }}>
                    <Icon name="plus" size={13} color="white"/> Criar post com IA
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        {selected && (
          <BlogPostModal
            post={selected}
            onClose={() => setSelected(null)}
            onSave={() => showToast('Post atualizado!')}
          />
        )}

        {showNew && (
          <BlogPostModal
            post={null}
            onClose={() => setShowNew(false)}
            onSave={saveNew}
          />
        )}
      </div>
    </div>
  );
}

window.BlogPage = BlogPage;
