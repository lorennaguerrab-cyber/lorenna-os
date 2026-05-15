/* ──────────────────────────────────────────────
   pages-precificacao.jsx — Calculadora de preços e orçamentos
   ────────────────────────────────────────────── */

const { useState } = React;

const SERVICOS_TIPOS = [
  'Social Media (gestão mensal)',
  'Identidade Visual',
  'Web Design',
  'Produção de Conteúdo',
  'UGC / Publi',
  'Consultoria',
  'Fotografia',
  'Vídeo / Edição',
  'Outro',
];

const COMPLEXIDADE = [
  { value: 'simples',  label: 'Simples',  mult: 1   },
  { value: 'medio',    label: 'Médio',    mult: 1.4 },
  { value: 'complexo', label: 'Complexo', mult: 1.8 },
  { value: 'premium',  label: 'Premium',  mult: 2.5 },
];

const PRAZOS = [
  { value: '1 semana',  label: '1 semana',   urgMult: 1.30 },
  { value: '2 semanas', label: '2 semanas',  urgMult: 1.15 },
  { value: '1 mês',     label: '1 mês',      urgMult: 1.00 },
  { value: '2 meses',   label: '2 meses',    urgMult: 1.00 },
  { value: '3+ meses',  label: '3+ meses',   urgMult: 1.00 },
];

const INCLUI_OPTS = [
  { id: 'estrategia',        label: 'Estratégia'          },
  { id: 'identidade_visual', label: 'Identidade visual'   },
  { id: 'textos',            label: 'Textos / copy'       },
  { id: 'trafego',           label: 'Gestão de tráfego'   },
  { id: 'relatorios',        label: 'Relatórios'          },
  { id: 'reunioes',          label: 'Reuniões mensais'    },
];

function formatBRL(val) {
  return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function todayBR() {
  return new Date().toLocaleDateString('pt-BR');
}

function PrecificacaoPage() {
  const [form, setForm] = useState({
    tipo: 'Social Media (gestão mensal)',
    cliente: '',
    horas: 10,
    valorHora: 80,
    complexidade: 'medio',
    inclui: [],
    prazo: '1 mês',
    obs: '',
  });

  const [historico, setHistorico] = useState([]);

  /* ── Calculation ── */
  const complexMult = COMPLEXIDADE.find(c => c.value === form.complexidade)?.mult || 1;
  const urgMult     = PRAZOS.find(p => p.value === form.prazo)?.urgMult || 1;
  const base        = (Number(form.horas) || 0) * (Number(form.valorHora) || 0);
  const valorFinal  = Math.round(base * complexMult * urgMult);

  /* ── Proposal text ── */
  function buildOrcamento() {
    const incSelecionados = INCLUI_OPTS.filter(o => form.inclui.includes(o.id));
    const escopoLines = incSelecionados.map(o => `• ${o.label}`).join('\n');
    const complexLabel = COMPLEXIDADE.find(c => c.value === form.complexidade)?.label || '';
    const urgLabel = urgMult > 1 ? ` (urgência +${Math.round((urgMult - 1) * 100)}%)` : '';
    return [
      `ORÇAMENTO — ${form.tipo.toUpperCase()}`,
      `Cliente: ${form.cliente || '—'}`,
      `Data: ${todayBR()}`,
      '',
      `Serviço: ${form.tipo}`,
      `Prazo: ${form.prazo}`,
      `Complexidade: ${complexLabel}${urgLabel}`,
      '',
      'Escopo:',
      escopoLines || '• A definir',
      '',
      `Investimento: R$ ${formatBRL(valorFinal)}`,
      '',
      'Forma de pagamento sugerida:',
      '50% na assinatura do contrato',
      '50% na entrega',
      form.obs ? `\nObservações: ${form.obs}` : '',
      '',
      'Lorenna Guerreiro — Agência Logue',
    ].filter(l => l !== undefined).join('\n');
  }

  const orcamentoText = buildOrcamento();

  function copiarOrcamento() {
    navigator.clipboard.writeText(orcamentoText).then(() => {
      showToast('Orçamento copiado!');
    }).catch(() => {
      showToast('Orçamento copiado!');
    });
  }

  function novoOrcamento() {
    // Save to history (max 5)
    if (valorFinal > 0 || form.cliente) {
      const entry = {
        id: Date.now(),
        tipo: form.tipo,
        cliente: form.cliente || 'Sem nome',
        valor: valorFinal,
        prazo: form.prazo,
        data: todayBR(),
        texto: orcamentoText,
      };
      setHistorico(prev => [entry, ...prev].slice(0, 5));
    }
    setForm({
      tipo: 'Social Media (gestão mensal)',
      cliente: '',
      horas: 10,
      valorHora: 80,
      complexidade: 'medio',
      inclui: [],
      prazo: '1 mês',
      obs: '',
    });
    showToast('Formulário resetado!');
  }

  function toggleInclui(id) {
    setForm(prev => ({
      ...prev,
      inclui: prev.inclui.includes(id)
        ? prev.inclui.filter(i => i !== id)
        : [...prev.inclui, id],
    }));
  }

  const complexLabel = COMPLEXIDADE.find(c => c.value === form.complexidade)?.label || '';
  const urgLabel = urgMult > 1 ? ` + ${Math.round((urgMult - 1) * 100)}% urgência` : '';

  return (
    <div className="content" style={{ maxWidth: 1200 }}>
      <div className="col gap-6 fade-up">

        {/* Header */}
        <div className="row between" style={{ alignItems: 'flex-start', marginBottom: 'var(--s-5)' }}>
          <div>
            <h1 className="page-title">Precificação</h1>
            <p className="page-subtitle">Calcule o valor dos seus serviços com clareza</p>
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-5)', alignItems: 'flex-start' }}>

          {/* LEFT — Calculadora */}
          <div className="col gap-4">
            <Card>
              <CardBody className="col gap-4">
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  Calculadora
                </h2>

                {/* Tipo de serviço */}
                <label className="col gap-2">
                  <span className="tiny" style={{ fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Tipo de serviço</span>
                  <select className="select" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
                    {SERVICOS_TIPOS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>

                {/* Cliente */}
                <label className="col gap-2">
                  <span className="tiny" style={{ fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Cliente</span>
                  <input className="input" placeholder="Nome do cliente..." value={form.cliente} onChange={e => setForm({ ...form, cliente: e.target.value })}/>
                </label>

                {/* Horas + Valor/hora */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
                  <label className="col gap-2">
                    <span className="tiny" style={{ fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Horas estimadas</span>
                    <input className="input" type="number" min={1} value={form.horas} onChange={e => setForm({ ...form, horas: e.target.value })}/>
                  </label>
                  <label className="col gap-2">
                    <span className="tiny" style={{ fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Valor/hora (R$)</span>
                    <input className="input" type="number" min={1} value={form.valorHora} onChange={e => setForm({ ...form, valorHora: e.target.value })}/>
                  </label>
                </div>

                {/* Complexidade */}
                <div className="col gap-2">
                  <span className="tiny" style={{ fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Nível de complexidade</span>
                  <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
                    {COMPLEXIDADE.map(c => (
                      <label key={c.value} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="complexidade"
                          value={c.value}
                          checked={form.complexidade === c.value}
                          onChange={() => setForm({ ...form, complexidade: c.value })}
                          style={{ accentColor: 'var(--pink)', cursor: 'pointer' }}
                        />
                        <span style={{
                          fontSize: 13, fontWeight: form.complexidade === c.value ? 600 : 400,
                          color: form.complexidade === c.value ? 'var(--pink-deep)' : 'var(--text-secondary)',
                        }}>
                          {c.label}
                          <span className="tiny muted" style={{ marginLeft: 4 }}>×{c.mult}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Inclui */}
                <div className="col gap-2">
                  <span className="tiny" style={{ fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Inclui</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-2)' }}>
                    {INCLUI_OPTS.map(o => (
                      <label key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={form.inclui.includes(o.id)}
                          onChange={() => toggleInclui(o.id)}
                          style={{ accentColor: 'var(--pink)', cursor: 'pointer', width: 15, height: 15 }}
                        />
                        <span style={{ fontSize: 13, color: form.inclui.includes(o.id) ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: form.inclui.includes(o.id) ? 500 : 400 }}>{o.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Prazo */}
                <label className="col gap-2">
                  <span className="tiny" style={{ fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Prazo</span>
                  <select className="select" value={form.prazo} onChange={e => setForm({ ...form, prazo: e.target.value })}>
                    {PRAZOS.map(p => (
                      <option key={p.value} value={p.value}>
                        {p.label}{p.urgMult > 1 ? ` (+${Math.round((p.urgMult - 1) * 100)}% urgência)` : ''}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Observações */}
                <label className="col gap-2">
                  <span className="tiny" style={{ fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.06em' }}>Observações</span>
                  <textarea className="textarea" rows={2} placeholder="Condições especiais, descontos, extras..." value={form.obs} onChange={e => setForm({ ...form, obs: e.target.value })}/>
                </label>
              </CardBody>
            </Card>

            {/* Price display */}
            <Card variant="accent">
              <CardBody className="col gap-3">
                <div className="row between" style={{ alignItems: 'flex-start' }}>
                  <div>
                    <div className="eyebrow" style={{ marginBottom: 6 }}>Valor sugerido</div>
                    <div style={{ fontFamily: 'var(--font-title)', fontSize: 38, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--pink-deep)', lineHeight: 1 }}>
                      R$ {formatBRL(valorFinal)}
                    </div>
                    <p className="tiny muted" style={{ marginTop: 8 }}>
                      baseado em {form.horas}h × R$ {form.valorHora}/h × {complexMult} ({complexLabel}){urgLabel}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => showToast('Configure Claude API para usar esta função — entre em contato com o desenvolvedor')}
                  style={{ alignSelf: 'flex-start' }}>
                  ✨ Ajustar com IA
                </Button>
              </CardBody>
            </Card>
          </div>

          {/* RIGHT — Orçamento gerado */}
          <div className="col gap-4">
            <Card>
              <CardBody className="col gap-4">
                <div className="row between">
                  <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>
                    Orçamento gerado
                  </h2>
                  <div className="row gap-2">
                    <Button variant="ghost" size="sm" onClick={novoOrcamento}>
                      Novo orçamento
                    </Button>
                    <Button variant="primary" size="sm" onClick={copiarOrcamento}>
                      <Icon name="copy" size={13} color="white"/> Copiar
                    </Button>
                  </div>
                </div>

                {/* Preview */}
                <div style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  padding: 'var(--s-4)',
                  position: 'relative',
                }}>
                  <pre style={{
                    fontSize: 12,
                    fontFamily: 'ui-monospace, SF Mono, monospace',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                  }}>{orcamentoText}</pre>
                  <button
                    onClick={copiarOrcamento}
                    title="Copiar orçamento"
                    style={{
                      position: 'absolute', top: 10, right: 10,
                      background: 'var(--bg-surface)', border: '1px solid var(--border)',
                      borderRadius: 6, padding: 5, cursor: 'pointer',
                      color: 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                    <Icon name="copy" size={12}/>
                  </button>
                </div>
              </CardBody>
            </Card>

            {/* Histórico */}
            {historico.length > 0 && (
              <div className="col gap-3">
                <div className="eyebrow" style={{ paddingLeft: 2 }}>Últimos orçamentos</div>
                <div className="col gap-2">
                  {historico.map(entry => (
                    <Card key={entry.id} hoverable>
                      <CardBody tight>
                        <div className="row gap-3">
                          <div style={{
                            width: 38, height: 38, borderRadius: 'var(--r-sm)',
                            background: 'var(--pink-tint)', border: '1px solid var(--pink-soft)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <Icon name="doc" size={16} color="var(--pink-deep)"/>
                          </div>
                          <div className="grow">
                            <p style={{ fontSize: 13, fontWeight: 600 }}>{entry.tipo}</p>
                            <p className="tiny muted" style={{ marginTop: 2 }}>{entry.cliente} · {entry.data}</p>
                          </div>
                          <div className="col" style={{ alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                            <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 15, color: 'var(--pink-deep)' }}>
                              R$ {formatBRL(entry.valor)}
                            </span>
                            <button
                              onClick={() => { navigator.clipboard.writeText(entry.texto).catch(() => {}); showToast('Orçamento copiado!'); }}
                              className="btn ghost icon"
                              title="Copiar este orçamento"
                              style={{ padding: 4 }}>
                              <Icon name="copy" size={12}/>
                            </button>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

window.PrecificacaoPage = PrecificacaoPage;
