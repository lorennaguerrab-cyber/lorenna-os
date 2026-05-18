/* ──────────────────────────────────────────────
   pages-business.jsx — Clientes, CRM, Mapa Mental
   ────────────────────────────────────────────── */

/* ─────────────────────── CLIENTES ─────────────────────── */
const CLIENT_BRAND_MAP = {
  'Ótica Igor Giordano': 'otica',
  'Pratique': 'pratique',
  'Cidades e Minerais': 'jornal',
  'Espaço Criar': 'espaco',
  'Agência Logue': 'agencia',
};
function Metric({ label, icon, valueLabel, valueColor, children }) {
  return (
    <div>
      <div className="row between" style={{ marginBottom: 8 }}>
        <span className="tiny muted row gap-1" style={{ textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 500 }}>
          <Icon name={icon} size={11}/> {label}
        </span>
        <span className="tiny" style={{ color: valueColor, fontWeight: 600 }}>{valueLabel}</span>
      </div>
      {children}
    </div>
  );
}

function ClientCard({ client, onOpen }) {
  const roi = client.receita / Math.max(1, client.esforco * client.custo_cog);
  const roiLabel = roi > 200 ? 'Excelente' : roi > 100 ? 'Bom' : roi > 50 ? 'Regular' : 'Atenção';
  const roiColor = roi > 200 ? '#7FB68C' : roi > 100 ? 'var(--pink)' : roi > 50 ? '#E89B4C' : '#C44878';

  return (
    <Card hoverable onClick={onOpen}>
      <div style={{ height: 4, background: client.cor }}/>
      <CardBody className="col gap-4">
        <div className="row between" style={{ alignItems: 'flex-start' }}>
          <div className="row gap-3">
            <div style={{
              width: 44, height: 44, borderRadius: 15,
              background: `color-mix(in oklch, ${client.cor} 22%, transparent)`,
              color: client.cor,
              display:'flex', alignItems:'center', justifyContent:'center',
              fontFamily:'var(--font-title)', fontSize: 19, fontWeight: 700,
            }}>{client.nome[0]}</div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{client.nome}</h3>
              <p className="tiny muted" style={{ marginTop: 3 }}>{client.setor}</p>
            </div>
          </div>
          {client.pendentes > 0 && (
            <span className="tiny" style={{
              padding: '4px 10px', borderRadius: 999, fontWeight: 600,
              background: `color-mix(in oklch, ${client.cor} 18%, transparent)`,
              color: client.cor, flexShrink: 0,
            }}>{client.pendentes}</span>
          )}
        </div>

        <div className="row between" style={{ alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-title)', fontWeight: 600, fontSize: 22, letterSpacing: '-0.02em' }}>
            R$ {client.receita.toLocaleString('pt-BR')}
            <span className="tiny muted" style={{ fontFamily: 'var(--font-body)', fontWeight: 400, marginLeft: 4 }}>/mês</span>
          </span>
          <span className="tiny" style={{ color: roiColor, fontWeight: 600 }}>ROI {roiLabel}</span>
        </div>
      </CardBody>
    </Card>
  );
}

function ClientConteudo({ client, setRoute }) {
  const brandKey = CLIENT_BRAND_MAP[client.nome];
  const brand = brandKey ? window.BRANDS[brandKey] : null;
  const contentItems = window.DEMO_CONTENT.filter(c => c.brand === brandKey).slice(0, 4);

  return (
    <div className="col gap-5">
      <div>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 19, fontWeight: 600 }}>
          Conteúdos — {client.nome}
        </h3>
        <p className="small muted" style={{ marginTop: 6 }}>
          {brand ? `Marca: ${brand.label}` : 'Conteúdos associados a este cliente'}
        </p>
      </div>

      {contentItems.length > 0 && (
        <div className="col gap-2">
          {contentItems.map(c => {
            const cfg = window.STATUS_CONTEUDO[c.status];
            return (
              <div key={c.id} style={{
                padding: '12px 16px', background: 'var(--offwhite)',
                border: '1px solid var(--gray-light)', borderRadius: 15,
                display: 'flex', gap: 12, alignItems: 'center',
              }}>
                <span style={{ fontSize: 18 }}>{window.TYPE_EMOJI[c.tipo]}</span>
                <div className="grow">
                  <p style={{ fontSize: 14.5, fontWeight: 500 }}>{c.titulo}</p>
                  <p className="tiny muted" style={{ marginTop: 2 }}>{c.data || '—'}</p>
                </div>
                <span className="tiny" style={{
                  padding: '3px 10px', borderRadius: 999,
                  background: `color-mix(in oklch, ${cfg.color} 16%, transparent)`,
                  color: cfg.color, fontWeight: 500, flexShrink: 0,
                }}>{cfg.label}</span>
              </div>
            );
          })}
        </div>
      )}

      <Button variant="primary" onClick={() => {
        if (brandKey) window.__presetBrand = brandKey;
        setRoute && setRoute('/conteudo');
      }}>
        <Icon name="arrow" size={14} color="white"/>
        Ver todos os conteúdos desta marca →
      </Button>
    </div>
  );
}

/* ── Client Detail (full page) ── */
function ClientDetail({ client, onClose, setRoute }) {
  const [tab, setTab] = useState('overview');
  const cogLabel = client.custo_cog >= 5 ? 'Crítico' : client.custo_cog >= 4 ? 'Alto' : client.custo_cog >= 3 ? 'Médio' : 'Baixo';
  const cogColor = client.custo_cog >= 5 ? '#C44878' : client.custo_cog >= 4 ? '#E89B4C' : 'var(--pink)';

  useEffect(() => {
    function onKey(ev) { if (ev.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const TABS = [
    { id: 'overview',   label: 'Visão geral'   },
    { id: 'tarefas',    label: 'Tarefas'       },
    { id: 'arquivos',   label: 'Arquivos'      },
    { id: 'insights',   label: 'Insights'      },
    { id: 'conteudo',   label: 'Conteúdos'     },
    { id: 'pedido',     label: 'Pedir post'    },
    { id: 'onboarding', label: 'Onboarding'    },
  ];

  return (
    <div className="content fade-up" style={{ maxWidth: 1400 }}>
      <div className="col gap-6">
        {/* Back button */}
        <div>
          <button
            onClick={onClose}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'transparent', border: 'none', cursor: 'pointer',
              color: 'var(--ink-soft)', fontSize: 14.5, fontFamily: 'var(--font-body)',
              fontWeight: 500, padding: '6px 0',
            }}>
            <Icon name="arrow" size={13} style={{ transform: 'rotate(180deg)' }}/>
            Voltar para Clientes
          </button>
        </div>

        {/* Color bar + Header */}
        <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--white)', border: '1px solid var(--gray-light)' }}>
          <div style={{ height: 5, background: client.cor }}/>
          <div style={{ padding: 'var(--s-5)', borderBottom: '1px solid var(--gray-light)' }}>
            <div className="row gap-3" style={{ alignItems: 'flex-start', marginBottom: 'var(--s-3)' }}>
              <div style={{
                width: 60, height: 60, borderRadius: 15,
                background: `color-mix(in oklch, ${client.cor} 22%, transparent)`,
                color: client.cor,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'var(--font-title)', fontSize: 26, fontWeight: 700, flexShrink: 0,
              }}>{client.nome[0]}</div>
              <div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 24, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1 }}>{client.nome}</h2>
                <p className="small muted" style={{ marginTop: 4 }}>{client.setor} · desde {client.inicio}</p>
              </div>
            </div>

            {/* Quick info chips */}
            <div className="row gap-2" style={{ flexWrap: 'wrap', marginTop: 'var(--s-3)' }}>
              <Chip icon="users">{client.contato}</Chip>
              <Chip icon="msg">{client.whatsapp}</Chip>
              <Chip>{client.pacote}</Chip>
            </div>
          </div>

          {/* Tabs */}
          <div className="row" style={{ padding: '0 var(--s-5)', borderBottom: '1px solid var(--gray-light)', gap: 4, overflowX: 'auto' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  padding: '16px 14px',
                  background: 'transparent',
                  border: 'none',
                  color: tab === t.id ? 'var(--pink-deep)' : 'var(--gray)',
                  fontWeight: tab === t.id ? 600 : 500,
                  fontSize: 14,
                  fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  borderBottom: tab === t.id ? '2px solid var(--pink)' : '2px solid transparent',
                  marginBottom: -1,
                  whiteSpace: 'nowrap',
                }}>{t.label}</button>
            ))}
          </div>

          <div style={{ padding: 'var(--s-5)' }}>
            {tab === 'overview' && <ClientOverview client={client} cogLabel={cogLabel} cogColor={cogColor}/>}
            {tab === 'tarefas' && <ClientTarefas client={client}/>}
            {tab === 'arquivos' && <ClientArquivos client={client}/>}
            {tab === 'insights' && <ClientInsights client={client}/>}
            {tab === 'conteudo' && <ClientConteudo client={client} setRoute={setRoute}/>}
            {tab === 'pedido' && <FormPedidoPost client={client} onSent={onClose}/>}
            {tab === 'onboarding' && <FormOnboarding client={client} onSent={onClose}/>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ icon, children }) {
  return (
    <span className="row gap-2 tiny" style={{
      padding: '6px 12px', background: 'var(--offwhite)',
      border: '1px solid var(--gray-light)', borderRadius: 999,
      color: 'var(--ink-soft)',
    }}>
      {icon && <Icon name={icon} size={11} color="var(--gray)"/>}
      {children}
    </span>
  );
}

function ClientOverview({ client, cogLabel, cogColor }) {
  return (
    <div className="col gap-5">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4) var(--s-5)' }}>
        <Metric label="Carga cognitiva" icon="brain" valueLabel={cogLabel} valueColor={cogColor}>
          <ScoreBar value={client.custo_cog} color={cogColor}/>
        </Metric>
        <Metric label="Esforço" icon="zap" valueLabel={`${client.esforco}/5`} valueColor="#E89B4C">
          <ScoreBar value={client.esforco} color="#E89B4C"/>
        </Metric>
        <Metric label="Alinhamento" icon="heart" valueLabel={`${client.alinhamento}/5`} valueColor="var(--pink)">
          <ScoreBar value={client.alinhamento} color="var(--pink)"/>
        </Metric>
        <Metric label="Satisfação" icon="flower" valueLabel={`${client.satisfacao}/5`} valueColor="#7FB68C">
          <ScoreBar value={client.satisfacao} color="#7FB68C"/>
        </Metric>
      </div>

      {client.custo_cog >= 4 && (
        <div className="row gap-3" style={{
          padding: 'var(--s-4)',
          background: '#FBEAEA',
          border: '1px solid #F0CECE',
          borderRadius: 15,
          alignItems: 'flex-start',
        }}>
          <Icon name="alert" size={16} color="#A04F4F" style={{ flexShrink:0, marginTop:2 }}/>
          <p style={{ fontSize: 14, color: '#7A3939', lineHeight: 1.5 }}>
            Custo cognitivo muito alto. Veja em <strong>Insights</strong> a sugestão de renegociação.
          </p>
        </div>
      )}

      {client.contrato && (
        <div>
          <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>Contrato</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--s-3)' }}>
            <ContractField label="Valor mensal" value={`R$ ${client.contrato.valor.toLocaleString('pt-BR')}`}/>
            <ContractField label="Prazo" value={client.contrato.prazo}/>
            <ContractField label="Ajustes inclusos" value={client.contrato.ajustes}/>
            <ContractField label="Assinado em" value={client.contrato.assinado}/>
          </div>
        </div>
      )}

      <div>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>Próximas ações</div>
        <div className="col gap-2">
          {client.proximas.map((a, i) => (
            <div key={i} className="row gap-3" style={{ padding: '12px 16px', background: 'var(--offwhite)', borderRadius: 15 }}>
              <div style={{ width: 16, height: 16, borderRadius: 5, border: '1.5px solid var(--gray)', flexShrink: 0 }}/>
              <span style={{ fontSize: 14.5, color: 'var(--ink-soft)' }}>{a}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContractField({ label, value }) {
  return (
    <div style={{ padding: 'var(--s-3)', background: 'var(--offwhite)', borderRadius: 15 }}>
      <div className="tiny muted" style={{ textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 500 }}>{label}</div>
      <div className="small" style={{ marginTop: 4, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function ClientTarefas({ client }) {
  if (!client.tarefas || client.tarefas.length === 0) {
    return <Empty icon="check" text="Nenhuma tarefa cadastrada ainda."/>;
  }
  return (
    <div className="col gap-3">
      <div className="row between">
        <div className="eyebrow">Tarefas do cliente · {client.tarefas.length}</div>
        <Button size="sm" variant="primary"><Icon name="plus" size={12} color="white"/> Nova tarefa</Button>
      </div>
      <div className="col gap-2">
        {client.tarefas.map(t => {
          const prioColor = { urgente: '#C44878', alta: '#E89B4C', media: 'var(--pink)', baixa: '#7FB68C' }[t.prioridade];
          const stColor = t.status === 'em_progresso' ? 'var(--pink)' : t.status === 'concluida' ? '#7FB68C' : 'var(--gray)';
          const stLabel = t.status === 'em_progresso' ? 'Em progresso' : t.status === 'concluida' ? 'Concluída' : 'Pendente';
          return (
            <div key={t.id} className="row gap-3" style={{
              padding: '14px 16px', background: 'var(--offwhite)',
              border: '1px solid var(--gray-light)', borderRadius: 15,
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 999,
                border: `1.5px solid ${prioColor}`, flexShrink: 0,
              }}/>
              <div className="grow">
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>{t.titulo}</div>
                <div className="row gap-3 tiny muted" style={{ marginTop: 4 }}>
                  <span>Prazo: <strong style={{ color: 'var(--ink-soft)' }}>{t.deadline}</strong></span>
                  <span style={{ color: stColor, fontWeight: 600 }}>● {stLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const FILE_ICONS = { pdf: '📄', svg: '🎨', doc: '📝', img: '🖼️', zip: '🗂️', mov: '🎬' };

function ClientArquivos({ client }) {
  if (!client.arquivos || client.arquivos.length === 0) {
    return <Empty icon="archive" text="Nenhum arquivo enviado ainda."/>;
  }
  return (
    <div className="col gap-3">
      <div className="row between">
        <div className="eyebrow">Arquivos · {client.arquivos.length}</div>
        <Button size="sm" variant="secondary"><Icon name="plus" size={12}/> Enviar arquivo</Button>
      </div>
      <div className="col gap-2">
        {client.arquivos.map((f, i) => (
          <div key={i} className="row gap-3" style={{
            padding: '12px 16px', background: 'var(--offwhite)',
            border: '1px solid var(--gray-light)', borderRadius: 15,
            cursor: 'pointer',
          }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{FILE_ICONS[f.tipo] || '📎'}</span>
            <div className="grow">
              <div style={{ fontSize: 14.5, fontWeight: 500 }}>{f.nome}</div>
              <div className="tiny muted">{f.size} · {f.data}</div>
            </div>
            <button className="btn ghost icon" title="Baixar">
              <Icon name="arrow" size={14} style={{ transform: 'rotate(90deg)' }}/>
            </button>
          </div>
        ))}
      </div>
      <div style={{
        padding: 'var(--s-4)', background: 'var(--offwhite)',
        border: '1.5px dashed var(--gray)', borderRadius: 15,
        textAlign: 'center', color: 'var(--gray)', cursor: 'pointer',
      }}>
        <div style={{ fontSize: 22, marginBottom: 4 }}>📎</div>
        <div className="small">Arraste arquivos aqui ou clique pra enviar</div>
      </div>
    </div>
  );
}

function ClientInsights({ client }) {
  if (!client.insights || client.insights.length === 0) {
    return <Empty icon="bulb" text="Nenhum insight registrado ainda."/>;
  }
  return (
    <div className="col gap-4">
      <div>
        <div className="row gap-2" style={{ marginBottom: 6 }}>
          <Icon name="sparkle" size={14} color="var(--pink-deep)"/>
          <span className="eyebrow" style={{ color: 'var(--pink-deep)' }}>Agência Logue · ideias de baixo custo</span>
        </div>
        <p className="small muted" style={{ maxWidth: 480 }}>
          Sugestões pra valorizar a marca do cliente sem aumentar escopo — vire entregas-surpresa que justificam reajuste.
        </p>
      </div>
      <div className="col gap-3">
        {client.insights.map((i, idx) => (
          <Card key={idx} variant="accent">
            <CardBody className="col gap-3">
              <div className="row between" style={{ alignItems: 'flex-start' }}>
                <h4 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 600, letterSpacing: '-0.02em' }}>{i.titulo}</h4>
                <Badge variant="pink">{i.custo}</Badge>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink-soft)' }}>{i.ideia}</p>
              <div className="row gap-2">
                <Button size="sm" variant="primary" onClick={() => showToast('Insight virou tarefa!')}>
                  <Icon name="plus" size={12} color="white"/> Virar tarefa
                </Button>
                <Button size="sm" variant="ghost" onClick={() => showToast('Compartilhado com o cliente!')}>
                  <Icon name="send" size={12}/> Mandar pro cliente
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Empty({ icon, text }) {
  return (
    <div className="center" style={{ padding: 'var(--s-7) 0', color: 'var(--gray)' }}>
      <Icon name={icon} size={32} color="var(--gray)"/>
      <p className="small" style={{ marginTop: 12 }}>{text}</p>
    </div>
  );
}

function Field({ label, hint, children, span = 1 }) {
  return (
    <label className="col" style={{ gap: 8, gridColumn: `span ${span}` }}>
      <span className="tiny" style={{ fontWeight: 500, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</span>
      {children}
      {hint && <span className="tiny muted">{hint}</span>}
    </label>
  );
}

function FormPedidoPost({ client, onSent }) {
  const [form, setForm] = useState({ tipo: 'post', tema: '', objetivo: 'vender', deadline: '', referencias: '', obs: '' });
  function submit() {
    if (!form.tema.trim()) { showToast('Preencha o tema do post'); return; }
    showToast(`Pedido enviado pra ${client.nome}!`);
    onSent && onSent();
  }
  return (
    <div className="col gap-5">
      <div>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 19, fontWeight: 600 }}>Novo pedido de conteúdo</h3>
        <p className="small muted" style={{ marginTop: 6 }}>
          Brief que vira tarefa no Córtex Lola + página no Notion.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }}>
        <Field label="Tipo de entrega">
          <select className="select" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
            <option value="post">Post estático</option>
            <option value="carrossel">Carrossel</option>
            <option value="reel">Reel</option>
            <option value="story">Stories</option>
            <option value="campanha">Campanha (mix)</option>
          </select>
        </Field>
        <Field label="Objetivo">
          <select className="select" value={form.objetivo} onChange={e => setForm({ ...form, objetivo: e.target.value })}>
            <option value="vender">Vender / converter</option>
            <option value="engajar">Engajar comunidade</option>
            <option value="educar">Educar sobre produto</option>
            <option value="posicionar">Posicionar marca</option>
            <option value="data">Data comemorativa</option>
          </select>
        </Field>
        <Field label="Tema central" span={2} hint="O que esse post precisa fazer ficar claro?">
          <input className="input" placeholder="Ex: agradecimento pela premiação Itabira Fit"
            value={form.tema} onChange={e => setForm({ ...form, tema: e.target.value })}/>
        </Field>
        <Field label="Prazo">
          <input className="input" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}/>
        </Field>
        <Field label="Aprovar com">
          <input className="input" defaultValue={client.contato}/>
        </Field>
        <Field label="Referências" span={2} hint="Links, prints, posts antigos.">
          <textarea className="textarea" rows={3} placeholder="https://instagram.com/p/..."
            value={form.referencias} onChange={e => setForm({ ...form, referencias: e.target.value })}/>
        </Field>
        <Field label="Observações" span={2}>
          <textarea className="textarea" rows={2}
            value={form.obs} onChange={e => setForm({ ...form, obs: e.target.value })}/>
        </Field>
      </div>

      <div className="row between" style={{ paddingTop: 'var(--s-3)', borderTop: '1px solid var(--gray-light)' }}>
        <span className="tiny muted">Salva como tarefa + brief no Notion</span>
        <div className="row gap-2">
          <Button variant="ghost" onClick={onSent}>Cancelar</Button>
          <Button variant="primary" onClick={submit}><Icon name="send" size={13} color="white"/> Disparar brief</Button>
        </div>
      </div>
    </div>
  );
}

function FormOnboarding({ client, onSent }) {
  const [form, setForm] = useState({ publico: '', tom: '', evitar: '', concorrentes: '', kpi: '', acessos: '' });
  function submit() {
    showToast(`Onboarding de ${client.nome} salvo!`);
    onSent && onSent();
  }
  return (
    <div className="col gap-5">
      <div>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 19, fontWeight: 600 }}>Onboarding — {client.nome}</h3>
        <p className="small muted" style={{ marginTop: 6 }}>
          Briefing inicial que orienta 3 meses de conteúdo. Preencher junto com o cliente.
        </p>
      </div>

      <div className="col gap-4">
        <Field label="Quem é o público ideal" hint="Não demográfico. Contexto e dor real.">
          <textarea className="textarea" rows={3} placeholder="Ex: mulher 28-45, já tentou academia 3 vezes e desistiu..."
            value={form.publico} onChange={e => setForm({ ...form, publico: e.target.value })}/>
        </Field>
        <Field label="Tom da marca" hint="3 adjetivos + uma marca de referência">
          <input className="input" placeholder="Acolhedora, técnica, com humor."
            value={form.tom} onChange={e => setForm({ ...form, tom: e.target.value })}/>
        </Field>
        <Field label="O que evitar a todo custo">
          <textarea className="textarea" rows={2} placeholder="Ex: nada de antes-e-depois, sem #emagrecimento..."
            value={form.evitar} onChange={e => setForm({ ...form, evitar: e.target.value })}/>
        </Field>
        <Field label="Concorrentes admirados (e por quê)">
          <textarea className="textarea" rows={2}
            value={form.concorrentes} onChange={e => setForm({ ...form, concorrentes: e.target.value })}/>
        </Field>
        <Field label="KPI principal (90 dias)">
          <select className="select" value={form.kpi} onChange={e => setForm({ ...form, kpi: e.target.value })}>
            <option value="">Selecione…</option>
            <option value="seguidores">Crescimento de seguidores</option>
            <option value="engajamento">Engajamento (salvos + compart.)</option>
            <option value="leads">Leads / DMs qualificadas</option>
            <option value="vendas">Vendas diretas</option>
            <option value="posicionamento">Posicionamento (autoridade)</option>
          </select>
        </Field>
        <Field label="Acessos enviados?">
          <select className="select" value={form.acessos} onChange={e => setForm({ ...form, acessos: e.target.value })}>
            <option value="">Selecione…</option>
            <option value="tudo">Tudo ok</option>
            <option value="parcial">Parcial — falta algo</option>
            <option value="nada">Nada ainda — cobrar</option>
          </select>
        </Field>
      </div>

      <div className="row between" style={{ paddingTop: 'var(--s-3)', borderTop: '1px solid var(--gray-light)' }}>
        <span className="tiny muted">Gera página no Notion + 3 pilares sugeridos pela IA</span>
        <div className="row gap-2">
          <Button variant="ghost" onClick={onSent}>Cancelar</Button>
          <Button variant="primary" onClick={submit}><Icon name="check" size={13} color="white"/> Salvar onboarding</Button>
        </div>
      </div>
    </div>
  );
}

function ClientesPage({ setRoute }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = selectedId ? window.DEMO_CLIENTS.find(c => c.id === selectedId) : null;

  if (selected) {
    return <ClientDetail client={selected} onClose={() => setSelectedId(null)} setRoute={setRoute}/>;
  }

  const total = window.DEMO_CLIENTS.reduce((s, c) => s + c.receita, 0);
  const meta = 6000;
  const pendentes = window.DEMO_CLIENTS.reduce((s, c) => s + c.pendentes, 0);

  return (
    <div className="content">
      <div className="col gap-6 fade-up">
        <PageHeader title="Clientes" subtitle="Agência Logue · receita ativa, entregas e onboarding em um lugar"/>

        <Card>
          <CardBody style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s-5)' }}>
            <div>
              <div className="eyebrow">Receita mensal recorrente</div>
              <div className="row gap-3" style={{ alignItems: 'baseline', marginTop: 6 }}>
                <span style={{ fontFamily: 'var(--font-title)', fontSize: 34, fontWeight: 600, letterSpacing: '-0.025em' }}>R$ {total.toLocaleString('pt-BR')}</span>
                <span className="tiny muted">de R$ {meta.toLocaleString('pt-BR')} · {Math.round((total/meta)*100)}%</span>
              </div>
              <div style={{ marginTop: 10, height: 6, background: 'var(--gray-light)', borderRadius: 999, overflow: 'hidden', width: 280 }}>
                <div style={{ width: `${Math.min((total/meta)*100,100)}%`, height: '100%', background: 'var(--pink)' }}/>
              </div>
            </div>
            <div className="row gap-6">
              <div>
                <div className="eyebrow">Clientes</div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 26, fontWeight: 600, marginTop: 6 }}>{window.DEMO_CLIENTS.length}</div>
              </div>
              <div>
                <div className="eyebrow">Entregas pendentes</div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 26, fontWeight: 600, marginTop: 6, color: 'var(--pink-deep)' }}>{pendentes}</div>
              </div>
            </div>
            <Button variant="primary"><Icon name="plus" size={14} color="white"/> Novo cliente</Button>
          </CardBody>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 'var(--s-4)' }}>
          {window.DEMO_CLIENTS.map(c => <ClientCard key={c.id} client={c} onOpen={() => setSelectedId(c.id)}/>)}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── CRM ─────────────────────── */
const CRM_NEW_STATUS = {
  potencial:     { label: 'Potencial',     bg: 'var(--pink-soft)',  color: 'var(--pink-deep)' },
  contato_feito: { label: 'Contato feito', bg: '#F5DDD0',           color: '#B05A2A' },
  proposta:      { label: 'Proposta',      bg: '#EAE6F5',           color: '#5B4A8A' },
  fechado:       { label: 'Fechado',       bg: '#D8EEE0',           color: '#2E6B42' },
  perdido:       { label: 'Perdido',       bg: '#E8E7E7',           color: '#5A5958' },
};

const CRM_TABS = [
  { id: 'agencia', label: 'Agência', desc: 'Potenciais clientes para agência' },
  { id: 'ugc',     label: 'UGC / Publis', desc: 'Marcas para UGC e publis' },
  { id: 'rede',    label: 'Rede', desc: 'Influencers, freelas, parceiros' },
];

const DEMO_CONTACTS_WITH_TIPO = (window.DEMO_CRM || []).map((c, i) => ({
  ...c,
  tipo: ['agencia', 'ugc', 'rede'][i % 3],
  status: c.status === 'em_contato' ? 'contato_feito' : c.status === 'negociando' ? 'proposta' : c.status === 'arquivado' ? 'perdido' : (c.status || 'potencial'),
  nota: c.notas || c.proposta || '',
  empresa: c.plataforma || '',
  phone: c.whatsapp || '',
}));

function CRMStatusBadge({ status }) {
  const cfg = CRM_NEW_STATUS[status] || CRM_NEW_STATUS.potencial;
  return (
    <span style={{
      padding: '3px 11px', borderRadius: 999, fontSize: 14, fontWeight: 600,
      background: cfg.bg, color: cfg.color, flexShrink: 0,
    }}>{cfg.label}</span>
  );
}

const EMPTY_FORM = { nome: '', empresa: '', tipo: 'agencia', status: 'potencial', nota: '', phone: '' };

function CRMPage() {
  const [contacts, setContacts] = useState(DEMO_CONTACTS_WITH_TIPO);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('agencia');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const searchLower = search.toLowerCase();
  const filtered = contacts.filter(c => {
    if (c.tipo !== activeTab) return false;
    if (!search) return true;
    return (
      c.nome.toLowerCase().includes(searchLower) ||
      (c.empresa || '').toLowerCase().includes(searchLower) ||
      (c.nota || '').toLowerCase().includes(searchLower)
    );
  });

  function openNew() {
    setForm({ ...EMPTY_FORM, tipo: activeTab });
    setEditId(null);
    setShowForm(true);
  }

  function openEdit(c) {
    setForm({ nome: c.nome, empresa: c.empresa || '', tipo: c.tipo, status: c.status, nota: c.nota || '', phone: c.phone || '' });
    setEditId(c.id);
    setShowForm(true);
  }

  function saveForm() {
    if (!form.nome.trim()) { showToast('Preencha o nome'); return; }
    if (editId) {
      setContacts(prev => prev.map(c => c.id === editId ? { ...c, ...form } : c));
      showToast('Contato atualizado!');
    } else {
      const newContact = { ...form, id: Date.now() };
      setContacts(prev => [...prev, newContact]);
      showToast('Contato adicionado!');
    }
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  }

  function cancelForm() {
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  }

  const tabCounts = CRM_TABS.reduce((acc, t) => {
    acc[t.id] = contacts.filter(c => c.tipo === t.id).length;
    return acc;
  }, {});

  return (
    <div className="content">
      <div className="col gap-6 fade-up">
        <PageHeader
          title="CRM"
          subtitle="Agência, UGC e rede — contatos organizados por contexto"
          action={<Button variant="primary" onClick={openNew}><Icon name="plus" size={14} color="white"/> Novo contato</Button>}
        />

        {/* Search bar */}
        <div className="row gap-2" style={{
          background: 'var(--white)', border: '1px solid var(--gray-light)',
          borderRadius: 15, padding: '10px 16px', maxWidth: 400,
        }}>
          <Icon name="search" size={14} color="var(--gray)"/>
          <input className="grow" style={{ background: 'transparent', fontSize: 14 }}
            placeholder="Buscar contatos..." value={search} onChange={e => setSearch(e.target.value)}/>
          {search && (
            <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--gray)', lineHeight: 1 }}>
              <Icon name="x" size={12}/>
            </button>
          )}
        </div>

        {/* Inline form */}
        {showForm && (
          <Card variant="accent">
            <CardBody className="col gap-4">
              <div className="eyebrow">{editId ? 'Editar contato' : 'Novo contato'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
                <Field label="Nome">
                  <input className="input" placeholder="Nome do contato"
                    value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })}/>
                </Field>
                <Field label="Empresa / Canal">
                  <input className="input" placeholder="Empresa ou canal"
                    value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })}/>
                </Field>
                <Field label="Tipo">
                  <select className="select" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                    <option value="agencia">Agência</option>
                    <option value="ugc">UGC / Publis</option>
                    <option value="rede">Rede</option>
                  </select>
                </Field>
                <Field label="Status">
                  <select className="select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    {Object.entries(CRM_NEW_STATUS).map(([k, cfg]) => (
                      <option key={k} value={k}>{cfg.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="WhatsApp (só números)">
                  <input className="input" placeholder="11999999999"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}/>
                </Field>
                <Field label="Nota" span={2}>
                  <textarea className="textarea" rows={2} placeholder="Contexto, proposta, observações..."
                    value={form.nota} onChange={e => setForm({ ...form, nota: e.target.value })}/>
                </Field>
              </div>
              <div className="row gap-2" style={{ paddingTop: 'var(--s-2)', borderTop: '1px solid var(--gray-light)' }}>
                <Button variant="primary" onClick={saveForm}><Icon name="check" size={13} color="white"/> Salvar</Button>
                <Button variant="ghost" onClick={cancelForm}>Cancelar</Button>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Tabs */}
        <div>
          <div className="row" style={{ borderBottom: '1px solid var(--gray-light)', gap: 4 }}>
            {CRM_TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '14px 18px',
                  background: 'transparent', border: 'none',
                  color: activeTab === t.id ? 'var(--pink-deep)' : 'var(--gray)',
                  fontWeight: activeTab === t.id ? 600 : 500,
                  fontSize: 14.5, fontFamily: 'var(--font-body)',
                  cursor: 'pointer',
                  borderBottom: activeTab === t.id ? '2px solid var(--pink)' : '2px solid transparent',
                  marginBottom: -1, whiteSpace: 'nowrap',
                }}>
                {t.label}
                <span style={{
                  marginLeft: 8, fontSize: 14, fontWeight: 600,
                  padding: '2px 7px', borderRadius: 999,
                  background: activeTab === t.id ? 'var(--pink-soft)' : 'var(--gray-light)',
                  color: activeTab === t.id ? 'var(--pink-deep)' : 'var(--gray)',
                }}>{tabCounts[t.id]}</span>
              </button>
            ))}
          </div>

          <div style={{ paddingTop: 'var(--s-5)' }}>
            {filtered.length === 0 ? (
              <Empty icon="users" text={search ? 'Nenhum contato encontrado para esta busca.' : 'Nenhum contato nesta categoria ainda.'}/>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--s-3)' }}>
                {filtered.map(c => (
                  <Card key={c.id} hoverable>
                    <CardBody className="col gap-3">
                      <div className="row between" style={{ alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 600, fontFamily: 'var(--font-title)', letterSpacing: '-0.01em' }}>{c.nome}</p>
                          {c.empresa && <p className="tiny muted" style={{ marginTop: 2 }}>{c.empresa}</p>}
                        </div>
                        <CRMStatusBadge status={c.status}/>
                      </div>

                      {c.nota && (
                        <p className="small" style={{ color: 'var(--ink-soft)', lineHeight: 1.55, fontStyle: 'italic' }}>
                          {c.nota.length > 120 ? c.nota.slice(0, 120) + '…' : c.nota}
                        </p>
                      )}

                      <div className="row gap-2" style={{ flexWrap: 'wrap', marginTop: 'var(--s-1)' }}>
                        <Button size="sm" variant="secondary" onClick={() => openEdit(c)}>Editar</Button>
                        {c.phone && (
                          <a href={`https://wa.me/55${c.phone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                            style={{ textDecoration: 'none' }}>
                            <Button size="sm" variant="ghost">
                              <Icon name="msg" size={12}/> WhatsApp
                            </Button>
                          </a>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────── MAPA MENTAL ─────────────────────── */
function MapaPage() {
  const [scale, setScale] = useState(1);
  const [hover, setHover] = useState(null);

  const colorFor = (type) => ({
    core:         'var(--pink-deep)',
    cluster:      'var(--pink)',
    pilar:        'var(--pink)',
    client:       'var(--e-operacional)',
    'client-warn':'var(--e-foco)',
    prospect:     'var(--e-cansada)',
    format:       'var(--e-social)',
    'system-core':'var(--pink-deep)',
    system:       'var(--e-cansada)',
    pessoal:      'var(--e-maternidade)',
  }[type] || 'var(--pink)');

  const VIEW_W = 1180, VIEW_H = 820;

  return (
    <div className="content" style={{ maxWidth: 1280 }}>
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Mapa Mental"
          subtitle="Estrutura real do projeto Papel da Lola · pilares × formatos × clientes × sistema"
          action={
            <div className="row gap-2">
              <Button variant="outline" size="sm" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>−</Button>
              <span className="small muted" style={{ minWidth: 44, textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
              <Button variant="outline" size="sm" onClick={() => setScale(s => Math.min(1.4, s + 0.1))}>+</Button>
            </div>
          }
        />

        <Card style={{ overflow: 'hidden' }}>
          <div style={{ padding: 0, position: 'relative', background: 'var(--offwhite)', overflow: 'auto', height: 680 }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle, #D9CDC0 1px, transparent 1px)',
              backgroundSize: '24px 24px', opacity: 0.3, pointerEvents: 'none',
            }}/>
            <div style={{
              width: VIEW_W, height: VIEW_H,
              transform: `scale(${scale})`, transformOrigin: 'top left',
              position: 'relative',
            }}>
              <svg width={VIEW_W} height={VIEW_H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {window.MAP_EDGES.map((e, i) => {
                  const a = window.MAP_NODES.find(n => n.id === e.from);
                  const b = window.MAP_NODES.find(n => n.id === e.to);
                  if (!a || !b) return null;
                  const ax = a.x + 70, ay = a.y + 18;
                  const bx = b.x + 70, by = b.y + 18;
                  const isHovered = hover && (hover === a.id || hover === b.id);
                  return (
                    <path key={i}
                      d={`M ${ax} ${ay} Q ${(ax + bx)/2} ${(ay + by)/2 + 30}, ${bx} ${by}`}
                      stroke={isHovered ? 'var(--pink)' : 'var(--gray)'}
                      strokeWidth={isHovered ? 1.8 : 1}
                      strokeDasharray={isHovered ? '0' : '3 4'}
                      fill="none"
                      opacity={isHovered ? 1 : 0.35}
                    />
                  );
                })}
              </svg>

              {window.MAP_NODES.map(n => {
                const c = colorFor(n.type);
                const isCore    = n.type === 'core';
                const isCluster = n.type === 'cluster';
                const isPrimary = isCore || isCluster;

                return (
                  <div key={n.id}
                    onMouseEnter={() => setHover(n.id)}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      position: 'absolute',
                      left: n.x, top: n.y,
                      padding: isCore ? '12px 22px' : isCluster ? '8px 16px' : '6px 14px',
                      borderRadius: isPrimary ? 999 : 15,
                      background: isPrimary ? c : 'var(--white)',
                      color: isPrimary ? 'var(--white)' : 'var(--ink)',
                      border: isPrimary ? 'none' : `1.5px solid ${c}`,
                      fontFamily: isPrimary ? 'var(--font-title)' : 'var(--font-body)',
                      fontWeight: isPrimary ? 700 : 500,
                      fontSize: isCore ? 16 : isCluster ? 14 : 14,
                      letterSpacing: isPrimary ? '0.01em' : 'normal',
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      transition: 'transform 0.2s var(--easing)',
                      transform: hover === n.id ? 'scale(1.08)' : 'scale(1)',
                      zIndex: hover === n.id ? 5 : 2,
                    }}>
                    {isCluster ? `✦ ${n.label}` : n.label}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="row gap-4" style={{ flexWrap: 'wrap' }}>
          <Legend color="var(--pink)" label="Pilar de conteúdo"/>
          <Legend color="var(--e-operacional)" label="Cliente ativo"/>
          <Legend color="var(--e-foco)" label="Atenção (cliente)"/>
          <Legend color="var(--e-cansada)" label="Prospect / Sistema"/>
          <Legend color="var(--e-social)" label="Formato (canal)"/>
          <Legend color="var(--e-maternidade)" label="Pessoal"/>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="row gap-2">
      <span style={{ width: 12, height: 12, borderRadius: 999, background: color }}/>
      <span className="tiny secondary">{label}</span>
    </div>
  );
}

Object.assign(window, { ClientesPage, CRMPage, MapaPage });
