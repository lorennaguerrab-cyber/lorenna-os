/* ──────────────────────────────────────────────
   pages-logue.jsx — Agência Logue
   ────────────────────────────────────────────── */

const { useState, useEffect } = React;

const LOGUE_CLIENTES = {
  otica:    { nome: 'Ótica Igor Giordano',     cor: '#bce1f6' },
  espaco:   { nome: 'Espaço Criar',            cor: '#f1e18d' },
  pratique: { nome: 'Pratique',                cor: '#f0bff8' },
  jornal:   { nome: 'Jornal Cidades Minerais', cor: '#ffe1bd' },
};

const LOGUE_STATUS_CFG = {
  pendente:  { label: 'Pendente',   bg: '#ffe1bd', color: '#201e1f' },
  gravando:  { label: 'Gravando',   bg: '#bce1f6', color: '#201e1f' },
  editando:  { label: 'Editando',   bg: '#f0bff8', color: '#201e1f' },
  revisao:   { label: 'Revisão',    bg: '#fec9df', color: '#201e1f' },
  entregue:  { label: 'Entregue',   bg: '#f1e18d', color: '#201e1f' },
};

const NARRACOES_DEFAULT = {
  'otica-look': `Um local. Um look. Um óculos perfeito.\nDescubra como um detalhe pode transformar toda a produção.\nVenha encontrar o seu na Ótica Igor Giordano.`,

  'otica-presentes': `Flores são lindas, mas passam.\nJá um óculos perfeito dura muito mais.\nDescubra três presentes que vão surpreender de verdade — e que ela vai usar todo dia.\nNa Ótica Igor Giordano, presente com estilo não tem erro.`,

  'espaco-aquarela': `Você já pensou em aprender aquarela com quem realmente entende da técnica?\nNo Espaço Criar, Mari e Sandra convidam você para um curso especial — com aulas semanais, em um ambiente acolhedor e criativo.\nVagas limitadas. Inscreva-se e desperte o artista que existe em você.`,

  'pratique-agradecimento': `Em novembro de 2023, a Pratique chegou à nossa cidade com duas unidades: Esplanada e Gabiroba.\nDesde então, rapidamente se tornou uma das academias mais queridas da região — top of mind entre quem busca qualidade e estrutura.\nHoje, somos milhares de alunos que já fazem parte dessa família.\nObrigado por nos receber com tanto carinho. A Pratique veio para ficar!`,

  'pratique-esplanada': `Conheça a Pratique Esplanada — uma das maiores e mais completas unidades da rede.\nEspaços amplos, diversas aulas coletivas, aplicativo próprio e acesso pelo Gympass em planos selecionados.\nVenha conhecer tudo o que temos a oferecer!`,

  'pratique-gabiroba': `Conheça a Pratique Gabiroba!\nEstrutura completa, aulas coletivas variadas, aplicativo próprio e acesso pelo Gympass.\nTudo o que você precisa para manter sua rotina de treinos perto de você.\nVenha treinar com a gente!`,

  'pratique-prime': `Apresentamos a área Prime da Pratique — um espaço novo, mais reservado e exclusivo.\nAqui, você treina apenas com personal trainer e tem acesso a equipamentos de última geração.\nNos dias sem personal agendado, você pode usar a área aeróbica Prime ou a parte superior da academia.\nUm ambiente diferenciado para quem busca resultados com mais foco e privacidade.`,

  'pratique-piscina': `Na Pratique, a natação vai além do lazer.\nOferecemos turmas de natação baby, infantil e adulto, além de hidroginástica para adultos.\nCom metodologia própria para natação infantil, dividimos as turmas de forma homogênea — com teste de nível e eventos que celebram a evolução de cada aluno.\nNossa piscina é climatizada, em ambiente fechado e aquecido, com tratamento por ozônio: mais seguro, menos tóxico, com menos produtos químicos.\nAceitamos Gympass para natação adulto, hidroginástica e natação baby.`,

  'pratique-mix': `A Pratique chegou para transformar o seu jeito de treinar.\nCom duas unidades na cidade — Esplanada e Gabiroba —, a academia oferece estrutura completa: aulas coletivas, área Prime exclusiva, piscina climatizada com metodologia própria e aplicativo para facilitar sua rotina.\nAcima do plano Fit, você treina em qualquer Pratique do Brasil. Gympass aceito em planos selecionados.\nVenha descobrir o treino ideal pra você!`,
};

const PROJETOS_INICIAIS = [
  // ── Ótica Igor Giordano ──────────────────────
  {
    id: 'lg1', cliente: 'otica', tipo: 'edicao',
    titulo: 'Vídeo Sabrina — 1 local, 1 look, 1 óculos',
    status: 'pendente',
    narracao: NARRACOES_DEFAULT['otica-look'],
    notas: 'Sessão com Sabrina Sanchez já gravada.',
  },
  {
    id: 'lg2', cliente: 'otica', tipo: 'edicao',
    titulo: 'Vídeo Sabrina — 3 presentes que duram mais do que flores',
    status: 'pendente',
    narracao: NARRACOES_DEFAULT['otica-presentes'],
    notas: '',
  },

  // ── Espaço Criar ─────────────────────────────
  {
    id: 'lg3', cliente: 'espaco', tipo: 'edicao',
    titulo: 'Vídeo Mari + Sandra — Convite para curso de aquarela',
    status: 'pendente',
    narracao: NARRACOES_DEFAULT['espaco-aquarela'],
    notas: 'Mari e Sandra já gravaram o convite. Montar com as cenas da aquarela.',
  },

  // ── Pratique ─────────────────────────────────
  {
    id: 'lg4', cliente: 'pratique', tipo: 'copy_narracao_edicao',
    titulo: 'Vídeo agradecimento à população',
    status: 'pendente',
    narracao: NARRACOES_DEFAULT['pratique-agradecimento'],
    notas: 'Verificar número exato de alunos com o cliente.',
  },
  {
    id: 'lg5', cliente: 'pratique', tipo: 'copy_narracao_edicao',
    titulo: 'Vídeo Pratique Esplanada — tour pela unidade',
    status: 'pendente',
    narracao: NARRACOES_DEFAULT['pratique-esplanada'],
    notas: 'Gravar: todos os espaços, aulas coletivas, ambientes. Mencionar Gympass.',
  },
  {
    id: 'lg6', cliente: 'pratique', tipo: 'copy_narracao_edicao',
    titulo: 'Vídeo Pratique Gabiroba — tour pela unidade',
    status: 'pendente',
    narracao: NARRACOES_DEFAULT['pratique-gabiroba'],
    notas: 'Mesmo formato do Esplanada. Gravar em dia diferente.',
  },
  {
    id: 'lg7', cliente: 'pratique', tipo: 'copy_narracao_edicao',
    titulo: 'Vídeo Pratique Prime — Roger falando',
    status: 'pendente',
    narracao: NARRACOES_DEFAULT['pratique-prime'],
    notas: 'Roger fala sobre a área Prime. Mostrar os equipamentos e o espaço.',
  },
  {
    id: 'lg8', cliente: 'pratique', tipo: 'copy_narracao_edicao',
    titulo: 'Vídeo Piscina + Natação — líder + cenas',
    status: 'pendente',
    narracao: NARRACOES_DEFAULT['pratique-piscina'],
    notas: 'Entrevistar o responsável pela piscina. Gravar aulas, eventos de transição de nível.',
  },
  {
    id: 'lg9', cliente: 'pratique', tipo: 'copy_narracao_edicao',
    titulo: 'Vídeo misturando tudo — apresentação geral',
    status: 'pendente',
    narracao: NARRACOES_DEFAULT['pratique-mix'],
    notas: 'Compilar o melhor de todos os outros vídeos. Narração unificada.',
  },
];

const PAGAMENTOS_INICIAIS = [
  {
    id: 'pg1',
    descricao: 'Ingred — editora de vídeos',
    destinatario: 'Ingred',
    valor: 200,
    dia: 10,
    mes: null,
    status: 'pendente',
    recorrente: true,
  },
  {
    id: 'pg2',
    descricao: 'Kamile — auxiliar de captação',
    destinatario: 'Kamile',
    valor: 50,
    dia: 10,
    mes: null,
    status: 'pendente',
    recorrente: true,
  },
];

function loadLogue() {
  try {
    const p = localStorage.getItem('lorenna_logue_projetos');
    const pg = localStorage.getItem('lorenna_logue_pagamentos');
    return {
      projetos:   p  ? JSON.parse(p)  : PROJETOS_INICIAIS,
      pagamentos: pg ? JSON.parse(pg) : PAGAMENTOS_INICIAIS,
    };
  } catch {
    return { projetos: PROJETOS_INICIAIS, pagamentos: PAGAMENTOS_INICIAIS };
  }
}

function saveLogue(projetos, pagamentos) {
  localStorage.setItem('lorenna_logue_projetos', JSON.stringify(projetos));
  localStorage.setItem('lorenna_logue_pagamentos', JSON.stringify(pagamentos));
  // Expose globally so FinanceiroPage and AgendaPage can read
  window.LOGUE_DATA = { projetos, pagamentos };
}

// Initialize global on first load
const _lougeInit = loadLogue();
window.LOGUE_DATA = _lougeInit;

/* ── Status badge ─────────────────────────────── */
function LStatusBadge({ status, onChange }) {
  const statuses = Object.keys(LOGUE_STATUS_CFG);
  const cfg = LOGUE_STATUS_CFG[status] || LOGUE_STATUS_CFG.pendente;
  function next() {
    if (!onChange) return;
    const idx = statuses.indexOf(status);
    onChange(statuses[(idx + 1) % statuses.length]);
  }
  return (
    <span onClick={next} style={{
      padding: '3px 12px', borderRadius: 999, fontSize: 13, fontWeight: 500,
      background: cfg.bg, color: cfg.color,
      cursor: onChange ? 'pointer' : 'default', userSelect: 'none', flexShrink: 0,
    }} title={onChange ? 'Clique para avançar status' : undefined}>
      {cfg.label}
    </span>
  );
}

/* ── ProjetoCard ────────────────────────────────── */
function ProjetoCard({ projeto, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [editNota, setEditNota] = useState(false);
  const [nota, setNota] = useState(projeto.notas || '');
  const [copiedNarr, setCopiedNarr] = useState(false);
  const cliente = LOGUE_CLIENTES[projeto.cliente] || { nome: projeto.cliente, cor: '#fec9df' };
  const tipoLabel = { edicao: 'Edição', copy_narracao_edicao: 'Copy + Narração + Edição' }[projeto.tipo] || projeto.tipo;

  function copyNarracao() {
    navigator.clipboard.writeText(projeto.narracao || '');
    setCopiedNarr(true);
    showToast('Narração copiada!');
    setTimeout(() => setCopiedNarr(false), 2000);
  }

  function saveNota() {
    onUpdate({ ...projeto, notas: nota });
    setEditNota(false);
  }

  return (
    <div style={{ background: 'var(--white)', borderRadius: 14, overflow: 'hidden' }}>
      {/* Top strip */}
      <div style={{ height: 3, background: cliente.cor }} />

      <div style={{ padding: '14px 16px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 500, color: '#201e1f', lineHeight: 1.35, marginBottom: 5 }}>
              {projeto.titulo}
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: 13, padding: '2px 10px', borderRadius: 999, background: cliente.cor, color: '#201e1f', fontWeight: 500 }}>
                {cliente.nome}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{tipoLabel}</span>
            </div>
          </div>
          <LStatusBadge status={projeto.status} onChange={s => onUpdate({ ...projeto, status: s })} />
        </div>

        {/* Bottom row: expand toggle + mark complete */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginTop: 2 }}>
          <button onClick={() => setOpen(!open)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
            fontSize: 13, color: 'var(--pink-deep)', fontFamily: 'var(--font-body)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Icon name={open ? 'chev-down' : 'chev-right'} size={12} />
            {open ? 'Fechar' : 'Ver narração e notas'}
          </button>

          {projeto.status !== 'entregue' ? (
            <button onClick={() => { onUpdate({ ...projeto, status: 'entregue' }); showToast('Marcado como entregue!'); }} style={{
              background: '#201e1f', border: 'none', cursor: 'pointer', padding: '5px 12px',
              fontSize: 13, color: '#fffcfa', fontFamily: 'var(--font-body)', fontWeight: 500,
              borderRadius: 999, display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Icon name="check" size={12} color="#fffcfa" /> Marcar como entregue
            </button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: '#7FB68C', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Icon name="check" size={12} color="#7FB68C" /> Entregue
              </span>
              <button onClick={() => onUpdate({ ...projeto, status: 'pendente' })} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-body)',
              }}>
                Reabrir
              </button>
            </div>
          )}
        </div>

        {open && (
          <div className="col gap-3" style={{ marginTop: 12 }}>
            {/* Narração */}
            {projeto.narracao && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 6 }}>Texto para narração</div>
                <div style={{ background: 'var(--offwhite)', borderRadius: 10, padding: '12px 14px', fontSize: 14, lineHeight: 1.7, color: '#201e1f', whiteSpace: 'pre-wrap' }}>
                  {projeto.narracao}
                </div>
                <button onClick={copyNarracao} style={{
                  marginTop: 6, background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: copiedNarr ? '#7FB68C' : 'var(--pink-deep)', fontFamily: 'var(--font-body)',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <Icon name={copiedNarr ? 'check' : 'copy'} size={12} />
                  {copiedNarr ? 'Copiado!' : 'Copiar narração'}
                </button>
              </div>
            )}

            {/* Notas */}
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 6 }}>Notas internas</div>
              {editNota ? (
                <div className="col gap-2">
                  <textarea
                    value={nota} onChange={e => setNota(e.target.value)}
                    style={{ width: '100%', minHeight: 80, padding: '10px 12px', fontSize: 14, borderRadius: 10, border: 'none', outline: 'none', background: 'var(--offwhite)', fontFamily: 'var(--font-body)', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                  <div className="row gap-2">
                    <Button variant="primary" size="sm" onClick={saveNota}>Salvar</Button>
                    <Button variant="ghost" size="sm" onClick={() => { setEditNota(false); setNota(projeto.notas || ''); }}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <div onClick={() => setEditNota(true)} style={{
                  background: 'var(--offwhite)', borderRadius: 10, padding: '10px 12px',
                  fontSize: 14, color: nota ? '#201e1f' : 'var(--text-muted)', cursor: 'text',
                  lineHeight: 1.5, minHeight: 36,
                }}>
                  {nota || 'Clique para adicionar notas...'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── PagamentoRow ──────────────────────────────── */
function PagamentoRow({ pag, onToggle }) {
  const isPago = pag.status === 'pago';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: 'var(--white)', borderRadius: 12 }}>
      <div style={{
        width: 20, height: 20, borderRadius: 999, flexShrink: 0, cursor: 'pointer',
        background: isPago ? '#7FB68C' : 'transparent',
        outline: `2px solid ${isPago ? '#7FB68C' : 'rgba(32,30,31,0.2)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }} onClick={onToggle}>
        {isPago && <Icon name="check" size={11} color="white" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#201e1f', textDecoration: isPago ? 'line-through' : 'none', opacity: isPago ? 0.5 : 1 }}>
          {pag.descricao}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
          Dia {pag.dia} de cada mês {pag.recorrente ? '· recorrente' : ''}
        </div>
      </div>
      <div style={{ fontSize: 16, fontWeight: 500, fontFamily: 'var(--font-title)', color: isPago ? 'var(--text-muted)' : '#C0392B', flexShrink: 0 }}>
        R$ {pag.valor}
      </div>
    </div>
  );
}

/* ── LoguePage ─────────────────────────────────── */
function LoguePage() {
  const [tab, setTab] = useState('projetos');
  const [data, setData] = useState(() => loadLogue());
  const [clientFilter, setClientFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('pendentes');
  const [showNewPag, setShowNewPag] = useState(false);
  const [newPag, setNewPag] = useState({ descricao: '', destinatario: '', valor: '', dia: '', recorrente: true });

  // Sync to window whenever data changes
  useEffect(() => {
    window.LOGUE_DATA = data;
  }, [data]);

  function updateProjeto(updated) {
    const next = { ...data, projetos: data.projetos.map(p => p.id === updated.id ? updated : p) };
    setData(next);
    saveLogue(next.projetos, next.pagamentos);
  }

  function togglePagamento(id) {
    const next = {
      ...data,
      pagamentos: data.pagamentos.map(p => p.id === id ? { ...p, status: p.status === 'pago' ? 'pendente' : 'pago' } : p),
    };
    setData(next);
    saveLogue(next.projetos, next.pagamentos);
  }

  function addPagamento() {
    if (!newPag.descricao || !newPag.valor) { showToast('Preencha descrição e valor'); return; }
    const pg = { ...newPag, id: 'pg' + Date.now(), valor: parseFloat(newPag.valor), dia: parseInt(newPag.dia) || 1, status: 'pendente' };
    const next = { ...data, pagamentos: [...data.pagamentos, pg] };
    setData(next);
    saveLogue(next.projetos, next.pagamentos);
    setNewPag({ descricao: '', destinatario: '', valor: '', dia: '', recorrente: true });
    setShowNewPag(false);
    showToast('Pagamento adicionado!');
  }

  // Filtered projects
  const projetos = data.projetos.filter(p => {
    const okCliente = clientFilter === 'todos' || p.cliente === clientFilter;
    const okStatus = statusFilter === 'todos' || (statusFilter === 'pendentes' ? p.status !== 'entregue' : p.status === 'entregue');
    return okCliente && okStatus;
  });

  // Stats
  const emAberto = data.projetos.filter(p => p.status !== 'entregue').length;
  const totalPagsMes = data.pagamentos.reduce((s, p) => s + p.valor, 0);
  const pendentePags = data.pagamentos.filter(p => p.status === 'pendente').length;
  const proximoDia = Math.min(...data.pagamentos.filter(p => p.status === 'pendente').map(p => p.dia));

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        {/* Header com logo da Logue */}
        <div style={{
          background: '#201e1f',
          borderRadius: 'var(--r-xl)',
          padding: 'var(--s-5) var(--s-6)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          <span style={{
            position: 'absolute', right: -40, top: -40,
            width: 180, height: 180, borderRadius: 999,
            background: 'radial-gradient(circle, rgba(254,125,174,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}/>
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, marginBottom: 6 }}>
              <span style={{
                fontFamily: 'Syne, sans-serif', fontSize: 42, fontWeight: 800,
                color: '#fffcfa', letterSpacing: '-0.03em', lineHeight: 1,
              }}>logue</span>
              <span style={{
                width: 13, height: 13, borderRadius: 999, flexShrink: 0,
                background: 'radial-gradient(circle at 35% 30%, #fec9df, #d966aa)',
                display: 'inline-block', marginBottom: 6, marginLeft: 2,
              }}/>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,252,250,0.5)', fontStyle: 'italic', margin: 0, letterSpacing: '0.01em' }}>agência digital · projetos, entregas e equipe</p>
          </div>
          {tab === 'pagamentos' && (
            <Button variant="primary" onClick={() => setShowNewPag(true)}>
              <Icon name="plus" size={14} color="white"/> Novo pagamento
            </Button>
          )}
        </div>

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s-3)' }}>
          <Card>
            <CardBody>
              <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 6 }}>Em aberto</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: 34, fontWeight: 500, lineHeight: 1, color: '#201e1f' }}>{emAberto}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>vídeos pendentes</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 6 }}>Equipe — mês</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: 34, fontWeight: 500, lineHeight: 1, color: '#201e1f' }}>R$ {totalPagsMes}</div>
              <div style={{ fontSize: 13, color: pendentePags > 0 ? '#C0392B' : 'var(--text-muted)', marginTop: 4 }}>
                {pendentePags > 0 ? `${pendentePags} pendente${pendentePags > 1 ? 's' : ''} · dia ${proximoDia}` : 'Todos pagos'}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 6 }}>Clientes ativos</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: 34, fontWeight: 500, lineHeight: 1, color: '#201e1f' }}>{Object.keys(LOGUE_CLIENTES).length}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Ótica · Pratique · Espaço · Jornal</div>
            </CardBody>
          </Card>
        </div>

        {/* Tabs */}
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 999, padding: 3, display: 'inline-flex', gap: 2 }}>
          {[{ id: 'projetos', label: 'Projetos' }, { id: 'pagamentos', label: 'Equipe & Pagamentos' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? '#201e1f' : 'transparent',
              borderRadius: 999, color: tab === t.id ? '#fffcfa' : 'var(--text-secondary)',
              fontWeight: tab === t.id ? 500 : 400, padding: '7px 20px',
              fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all .15s',
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── PROJETOS ── */}
        {tab === 'projetos' && (
          <div className="col gap-4">
            {/* Filters */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {[['todos', 'Todos'], ...Object.entries(LOGUE_CLIENTES).map(([k, v]) => [k, v.nome])].map(([k, l]) => (
                <button key={k} onClick={() => setClientFilter(k)} style={{
                  fontSize: 13, padding: '5px 13px', borderRadius: 999, border: 'none',
                  background: clientFilter === k ? '#201e1f' : 'var(--bg-elevated)',
                  color: clientFilter === k ? '#fffcfa' : 'var(--text-secondary)',
                  cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 400,
                }}>{l}</button>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                {[['pendentes', 'Em aberto'], ['entregues', 'Entregues'], ['todos', 'Todos']].map(([k, l]) => (
                  <button key={k} onClick={() => setStatusFilter(k)} style={{
                    fontSize: 13, padding: '5px 13px', borderRadius: 999, border: 'none',
                    background: statusFilter === k ? 'var(--pink-tint)' : 'transparent',
                    color: statusFilter === k ? 'var(--pink-deep)' : 'var(--text-muted)',
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}>{l}</button>
                ))}
              </div>
            </div>

            {/* Project groups by client */}
            {Object.entries(LOGUE_CLIENTES).map(([key, cliente]) => {
              const items = projetos.filter(p => p.cliente === key);
              if (items.length === 0) return null;
              return (
                <div key={key} className="col gap-2">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 999, background: cliente.cor, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>{cliente.nome}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{items.length} {items.length === 1 ? 'projeto' : 'projetos'}</span>
                  </div>
                  <div className="col gap-2">
                    {items.map(p => <ProjetoCard key={p.id} projeto={p} onUpdate={updateProjeto} />)}
                  </div>
                </div>
              );
            })}

            {projetos.length === 0 && (
              <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                Nenhum projeto nesse filtro.
              </div>
            )}
          </div>
        )}

        {/* ── EQUIPE & PAGAMENTOS ── */}
        {tab === 'pagamentos' && (
          <div className="col gap-4">
            <Card>
              <CardBody>
                <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 14 }}>
                  Colaboradores — pagamentos mensais
                </div>
                <div className="col gap-2">
                  {data.pagamentos.map(p => (
                    <PagamentoRow key={p.id} pag={p} onToggle={() => togglePagamento(p.id)} />
                  ))}
                </div>

                <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--offwhite)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Total mensal equipe</span>
                    <span style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 500 }}>R$ {totalPagsMes}</span>
                  </div>
                  {pendentePags > 0 && (
                    <div style={{ fontSize: 13, color: '#C0392B', marginTop: 4 }}>
                      Lembrete: {pendentePags} pagamento{pendentePags > 1 ? 's' : ''} no dia {proximoDia}
                    </div>
                  )}
                </div>

                {/* New payment form */}
                {showNewPag && (
                  <div className="col gap-3" style={{ marginTop: 16, padding: '16px', background: 'var(--offwhite)', borderRadius: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>Novo pagamento</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-2)' }}>
                      <Field label="Descrição">
                        <input className="input" placeholder="Ex: Ingred — editora" value={newPag.descricao} onChange={e => setNewPag(p => ({ ...p, descricao: e.target.value }))} />
                      </Field>
                      <Field label="Destinatário">
                        <input className="input" placeholder="Nome" value={newPag.destinatario} onChange={e => setNewPag(p => ({ ...p, destinatario: e.target.value }))} />
                      </Field>
                      <Field label="Valor (R$)">
                        <input className="input" type="number" placeholder="200" value={newPag.valor} onChange={e => setNewPag(p => ({ ...p, valor: e.target.value }))} />
                      </Field>
                      <Field label="Dia do mês">
                        <input className="input" type="number" placeholder="10" min="1" max="31" value={newPag.dia} onChange={e => setNewPag(p => ({ ...p, dia: e.target.value }))} />
                      </Field>
                    </div>
                    <div className="row gap-2">
                      <Button variant="primary" onClick={addPagamento}>Salvar</Button>
                      <Button variant="ghost" onClick={() => setShowNewPag(false)}>Cancelar</Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>

            <div style={{ fontSize: 13, color: 'var(--text-muted)', padding: '0 4px' }}>
              Os pagamentos aparecem automaticamente na Agenda e no Financeiro no dia correspondente.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.LoguePage = LoguePage;
window.LOGUE_CLIENTES = LOGUE_CLIENTES;
