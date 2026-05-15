/* ──────────────────────────────────────────────
   pages-extras.jsx
   AgendaPage · FinanceiroPage · SobrePage
   MonetizacaoPage · ImpressosPage
   ────────────────────────────────────────────── */

const { useState, useEffect, useRef } = React;

/* ═══════════════════════════════════════════════
   1. AGENDA PAGE
   ═══════════════════════════════════════════════ */

const AGENDA_EVENTS = [
  { id: 1,  dia: 0, data: '19/05', hora: '08:20', titulo: 'Futebol Mateus e Murilo', tipo: 'filho',    recorrente: true  },
  { id: 2,  dia: 0, data: '19/05', hora: '14:00', titulo: 'Reunião cliente (Espaço Criar)', tipo: 'cliente',  recorrente: false },
  { id: 3,  dia: 1, data: '20/05', hora: '09:00', titulo: 'Gravação conteúdo @lorennagn — reel bastidores', tipo: 'gravacao', recorrente: false },
  { id: 4,  dia: 1, data: '20/05', hora: null,    titulo: 'Ótica — visita Sabrina Sachez (influencer)', tipo: 'cliente',  recorrente: false },
  { id: 5,  dia: 2, data: '21/05', hora: '08:20', titulo: 'Futebol Mateus e Murilo', tipo: 'filho',    recorrente: true  },
  { id: 6,  dia: 2, data: '21/05', hora: null,    titulo: 'Ótica — visita Waltencir (influencer)', tipo: 'cliente',  recorrente: false },
  { id: 7,  dia: 2, data: '21/05', hora: '10:00', titulo: 'Entrega posts Pratique (semana)', tipo: 'conteudo', recorrente: false },
  { id: 8,  dia: 3, data: '22/05', hora: null,    titulo: 'Ótica — visita Thais Lage (influencer)', tipo: 'cliente',  recorrente: false },
  { id: 9,  dia: 3, data: '22/05', hora: '15:00', titulo: 'Gravação vídeo Jornal Cidades Minerais', tipo: 'gravacao', recorrente: false },
  { id: 10, dia: 4, data: '23/05', hora: '08:20', titulo: 'Futebol Mateus e Murilo', tipo: 'filho',    recorrente: true  },
  { id: 11, dia: 4, data: '23/05', hora: '16:00', titulo: 'Planejamento semana editorial', tipo: 'admin',    recorrente: false },
  { id: 12, dia: 5, data: '24/05', hora: null,    titulo: 'Família — tempo com os meninos', tipo: 'filho',    recorrente: false },
  { id: 13, dia: 6, data: '25/05', hora: null,    titulo: 'Revisão semana e planejamento próxima', tipo: 'admin',    recorrente: false },
];

const AGENDA_TYPE_COLORS = {
  conteudo: { bg: '#FFE3EE', border: '#FFC7DD', text: '#E8538D', dot: '#FF78B0' },
  filho:    { bg: '#E8F5ED', border: '#C3DEC9', text: '#3A8C50', dot: '#5FAD74' },
  cliente:  { bg: '#E8EEFF', border: '#BFC9F5', text: '#3A50C4', dot: '#5B72E8' },
  gravacao: { bg: '#F2E8FF', border: '#D5BFEF', text: '#7A3DB5', dot: '#9E62D8' },
  admin:    { bg: '#FFF3E3', border: '#FDDBB0', text: '#B5720A', dot: '#E89B4C' },
};

const AGENDA_DAYS = [
  { short: 'Seg', full: 'Segunda' },
  { short: 'Ter', full: 'Terça'   },
  { short: 'Qua', full: 'Quarta'  },
  { short: 'Qui', full: 'Quinta'  },
  { short: 'Sex', full: 'Sexta'   },
  { short: 'Sab', full: 'Sábado'  },
  { short: 'Dom', full: 'Domingo' },
];

const AGENDA_DATES = ['19/05', '20/05', '21/05', '22/05', '23/05', '24/05', '25/05'];

function AgendaEventCard({ ev }) {
  const cfg = AGENDA_TYPE_COLORS[ev.tipo] || AGENDA_TYPE_COLORS.admin;
  return (
    <div style={{
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      borderRadius: 'var(--r-md)',
      padding: '7px 10px',
      marginBottom: 6,
      position: 'relative',
      cursor: 'default',
    }}>
      {ev.recorrente && (
        <div style={{
          position: 'absolute', top: 6, right: 8,
          width: 6, height: 6, borderRadius: 999,
          background: cfg.dot, opacity: 0.7,
        }} title="Recorrente" />
      )}
      {ev.hora && (
        <div style={{
          fontSize: 10.5,
          fontFamily: 'var(--font-title)',
          fontWeight: 700,
          color: cfg.text,
          letterSpacing: '0.02em',
          marginBottom: 3,
        }}>
          {ev.hora}
        </div>
      )}
      <div style={{
        fontSize: 12,
        fontFamily: 'var(--font-body)',
        color: cfg.text,
        lineHeight: 1.35,
        fontWeight: 500,
      }}>
        {ev.titulo}
      </div>
    </div>
  );
}

function AgendaPage() {
  const today = new Date();
  const todayStr = today.toLocaleDateString('pt-BR').slice(0, 5);

  const totalEvents = AGENDA_EVENTS.length;
  const tipos = [...new Set(AGENDA_EVENTS.map(e => e.tipo))];

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Agenda"
          subtitle={`Semana de 19 a 25 de maio · ${totalEvents} compromissos`}
          action={
            <Button
              variant="ghost"
              onClick={() => showToast('Em breve · integração Google Calendar')}
            >
              <Icon name="calendar" size={14} color="var(--pink-deep)" />
              Integrar com Google Agenda
            </Button>
          }
        />

        {/* Legenda de tipos */}
        <div className="row gap-3" style={{ flexWrap: 'wrap' }}>
          {Object.entries(AGENDA_TYPE_COLORS).map(([tipo, cfg]) => (
            <div key={tipo} className="row gap-2" style={{
              padding: '4px 12px',
              borderRadius: 'var(--r-pill)',
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: 999, background: cfg.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, color: cfg.text, fontWeight: 500, textTransform: 'capitalize' }}>
                {tipo === 'filho' ? 'Filhos' : tipo === 'gravacao' ? 'Gravação' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </span>
            </div>
          ))}
        </div>

        {/* Grid semanal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 'var(--s-3)',
          alignItems: 'start',
        }}>
          {AGENDA_DAYS.map((day, i) => {
            const events = AGENDA_EVENTS.filter(e => e.dia === i);
            const isToday = AGENDA_DATES[i] === todayStr;
            const isWeekend = i >= 5;

            return (
              <div key={i} style={{
                borderRadius: 'var(--r-lg)',
                background: isWeekend ? 'var(--offwhite)' : 'var(--white)',
                border: `1px solid ${isToday ? 'var(--pink-soft)' : 'var(--gray-light)'}`,
                overflow: 'hidden',
                minHeight: 120,
              }}>
                {/* Day header */}
                <div style={{
                  padding: '10px 12px 8px',
                  borderBottom: `1px solid ${isToday ? 'var(--pink-soft)' : 'var(--gray-light)'}`,
                  background: isToday ? 'var(--pink-tint)' : 'transparent',
                }}>
                  <div style={{
                    fontSize: 10.5,
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: isToday ? 'var(--pink-deep)' : 'var(--gray)',
                    marginBottom: 2,
                  }}>
                    {day.short}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-title)',
                    fontSize: 18,
                    fontWeight: 700,
                    color: isToday ? 'var(--pink-deep)' : 'var(--ink)',
                    lineHeight: 1,
                  }}>
                    {AGENDA_DATES[i].slice(0, 2)}
                  </div>
                  {events.length > 0 && (
                    <div style={{
                      fontSize: 10,
                      color: isToday ? 'var(--pink-deep)' : 'var(--gray)',
                      marginTop: 3,
                      opacity: 0.8,
                    }}>
                      {events.length} {events.length === 1 ? 'item' : 'itens'}
                    </div>
                  )}
                </div>

                {/* Events */}
                <div style={{ padding: '10px 10px 8px' }}>
                  {events.length === 0 ? (
                    <div style={{
                      fontSize: 11,
                      color: 'var(--gray)',
                      fontStyle: 'italic',
                      textAlign: 'center',
                      padding: '12px 0',
                      opacity: 0.6,
                    }}>
                      Livre
                    </div>
                  ) : (
                    events
                      .sort((a, b) => {
                        if (!a.hora && !b.hora) return 0;
                        if (!a.hora) return 1;
                        if (!b.hora) return -1;
                        return a.hora.localeCompare(b.hora);
                      })
                      .map(ev => <AgendaEventCard key={ev.id} ev={ev} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Nav e botão Google Agenda */}
        <div className="row between" style={{ paddingTop: 'var(--s-2)' }}>
          <div className="row gap-2">
            <Button variant="ghost" size="sm" onClick={() => showToast('Semana anterior')}>
              <Icon name="chev-left" size={14} />
              Anterior
            </Button>
            <Button variant="ghost" size="sm" onClick={() => showToast('Próxima semana')}>
              Próxima
              <Icon name="chev-right" size={14} />
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={() => showToast('Em breve · integração Google Calendar')}
            style={{ color: 'var(--pink-deep)', borderColor: 'var(--pink-soft)' }}
          >
            <Icon name="calendar" size={14} color="var(--pink-deep)" />
            Sincronizar Google Agenda
          </Button>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   2. FINANCEIRO PAGE
   ═══════════════════════════════════════════════ */

const FINANCEIRO_DATA = {
  entradas: [
    { id: 1, nome: 'Ótica Igor Giordano',     valor: 1200, status: 'pago',     dia: 10, tipo: 'cliente' },
    { id: 2, nome: 'Pratique',                valor: 1200, status: 'pago',     dia: 11, tipo: 'cliente' },
    { id: 3, nome: 'Jornal Cidades Minerais', valor: 1000, status: 'atrasado', dia: 15, tipo: 'cliente' },
    { id: 4, nome: 'Espaço Criar',            valor:  600, status: 'pendente', dia:  5, tipo: 'cliente' },
    { id: 5, nome: 'Pensão (recebida)',        valor:  750, status: 'pago',     dia: 10, tipo: 'pensao'  },
  ],
  saidas: [
    { id: 6, nome: 'Aluguel',           valor: 1250, status: 'pago', dia:  1, tipo: 'fixo'       },
    { id: 7, nome: 'Futebol meninos',   valor:  220, status: 'pago', dia:  5, tipo: 'fixo'       },
    { id: 8, nome: 'Claude AI',         valor:  119, status: 'pago', dia: 15, tipo: 'ferramenta' },
  ],
};

const STATUS_FIN = {
  pago:     { label: 'Pago',     bg: '#E8F5ED', text: '#3A8C50', border: '#C3DEC9' },
  pendente: { label: 'Pendente', bg: '#FFF8E3', text: '#B5720A', border: '#FDDBB0' },
  atrasado: { label: 'Atrasado', bg: '#FFE9E9', text: '#C0392B', border: '#F5C0BE' },
};

function fmt(val) {
  return val.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function StatusBadge({ status }) {
  const cfg = STATUS_FIN[status] || STATUS_FIN.pendente;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 9px',
      borderRadius: 'var(--r-pill)',
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      color: cfg.text,
      fontSize: 11,
      fontWeight: 600,
      fontFamily: 'var(--font-body)',
    }}>
      {cfg.label}
    </span>
  );
}

function FinRowItem({ item, isEntrada }) {
  return (
    <div className="row between" style={{
      padding: '11px 14px',
      background: 'var(--offwhite-2)',
      border: '1px solid var(--gray-light)',
      borderRadius: 'var(--r-md)',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>
          {item.nome}
        </div>
        <div style={{ fontSize: 11, color: 'var(--gray)' }}>
          Dia {item.dia}
          {item.tipo === 'pensao' && (
            <span style={{ marginLeft: 6, color: 'var(--pink-deep)', fontStyle: 'italic' }}>
              · não paga pela outra parte
            </span>
          )}
        </div>
      </div>
      <StatusBadge status={item.status} />
      <div style={{
        fontFamily: 'var(--font-title)',
        fontWeight: 700,
        fontSize: 15,
        color: isEntrada ? '#3A8C50' : 'var(--ink)',
        flexShrink: 0,
        minWidth: 80,
        textAlign: 'right',
      }}>
        {isEntrada ? '+' : '−'} R$ {fmt(item.valor)}
      </div>
    </div>
  );
}

function ProgressBar({ value, max, color = 'var(--pink)' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div style={{
        height: 8,
        background: 'var(--gray-light)',
        borderRadius: 'var(--r-pill)',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 'var(--r-pill)',
          transition: 'width 0.6s var(--easing)',
        }} />
      </div>
      <div className="row between" style={{ marginTop: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--gray)' }}>Recebido: R$ {fmt(value)}</span>
        <span style={{ fontSize: 11, color: 'var(--gray)' }}>{pct}% de R$ {fmt(max)}</span>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub, color, highlight }) {
  return (
    <div style={{
      padding: 'var(--s-5)',
      background: highlight ? 'var(--pink-tint)' : 'var(--white)',
      border: `1px solid ${highlight ? 'var(--pink-soft)' : 'var(--gray-light)'}`,
      borderRadius: 'var(--r-lg)',
      flex: 1,
      minWidth: 140,
    }}>
      <div style={{ fontSize: 11.5, color: 'var(--gray)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-title)',
        fontSize: 24,
        fontWeight: 700,
        color: color || 'var(--ink)',
        letterSpacing: '-0.02em',
        lineHeight: 1,
        marginBottom: 4,
      }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function FinanceiroPage() {
  const { entradas, saidas } = FINANCEIRO_DATA;

  const totalEntradas = entradas.reduce((s, e) => s + e.valor, 0);
  const totalPago     = entradas.filter(e => e.status === 'pago').reduce((s, e) => s + e.valor, 0);
  const totalSaidas   = saidas.reduce((s, e) => s + e.valor, 0);
  const saldo         = totalPago - totalSaidas;
  const pctPago       = Math.round((totalPago / totalEntradas) * 100);

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Financeiro"
          subtitle="Maio 2025 · visão geral de entradas e saídas"
        />

        {/* Summary cards */}
        <div className="row gap-4" style={{ flexWrap: 'wrap' }}>
          <SummaryCard
            label="Total Entradas"
            value={`R$ ${fmt(totalEntradas)}`}
            sub={`${entradas.filter(e => e.status === 'pago').length} de ${entradas.length} recebidos`}
            color="#3A8C50"
          />
          <SummaryCard
            label="Total Saídas"
            value={`R$ ${fmt(totalSaidas)}`}
            sub={`${saidas.length} pagamentos fixos`}
            color="var(--ink)"
          />
          <SummaryCard
            label="Saldo Estimado"
            value={`R$ ${fmt(saldo)}`}
            sub="Com base no que já entrou"
            color={saldo >= 0 ? '#3A8C50' : '#C0392B'}
            highlight
          />
          <SummaryCard
            label="Recebido"
            value={`${pctPago}%`}
            sub={`R$ ${fmt(totalPago)} de R$ ${fmt(totalEntradas)}`}
            color="var(--pink-deep)"
          />
        </div>

        {/* Progress */}
        <Card>
          <CardBody>
            <div style={{ marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
              Recebimento do mês
            </div>
            <ProgressBar value={totalPago} max={totalEntradas} color="var(--pink)" />
            {entradas.some(e => e.status === 'atrasado') && (
              <div style={{
                marginTop: 10,
                padding: '8px 12px',
                background: '#FFE9E9',
                border: '1px solid #F5C0BE',
                borderRadius: 'var(--r-md)',
                fontSize: 12,
                color: '#C0392B',
                fontWeight: 500,
              }}>
                Atenção: há {entradas.filter(e => e.status === 'atrasado').length} entrada(s) em atraso — total R$ {fmt(entradas.filter(e => e.status === 'atrasado').reduce((s, e) => s + e.valor, 0))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-5)', alignItems: 'start' }}>
          {/* Entradas */}
          <Card>
            <CardHeader>
              <div className="row between">
                <div>
                  <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 700 }}>Entradas</h2>
                  <p className="tiny muted" style={{ marginTop: 2 }}>R$ {fmt(totalEntradas)} esperado</p>
                </div>
                <span style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#3A8C50',
                }}>
                  R$ {fmt(totalPago)}
                </span>
              </div>
            </CardHeader>
            <CardBody>
              <div className="col gap-2">
                {entradas.map(item => <FinRowItem key={item.id} item={item} isEntrada />)}
              </div>
              <div style={{
                marginTop: 'var(--s-4)',
                padding: '10px 12px',
                background: 'var(--offwhite)',
                border: '1px solid var(--gray-light)',
                borderRadius: 'var(--r-md)',
                fontSize: 11.5,
                color: 'var(--gray)',
                fontStyle: 'italic',
              }}>
                Pensão: recebida, nao paga pela outra parte
              </div>
            </CardBody>
          </Card>

          {/* Saídas */}
          <Card>
            <CardHeader>
              <div className="row between">
                <div>
                  <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 700 }}>Saídas</h2>
                  <p className="tiny muted" style={{ marginTop: 2 }}>{saidas.length} compromissos fixos</p>
                </div>
                <span style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 18,
                  fontWeight: 700,
                  color: 'var(--ink)',
                }}>
                  R$ {fmt(totalSaidas)}
                </span>
              </div>
            </CardHeader>
            <CardBody>
              <div className="col gap-2">
                {saidas.map(item => <FinRowItem key={item.id} item={item} isEntrada={false} />)}
              </div>
              <div style={{
                marginTop: 'var(--s-5)',
                padding: 'var(--s-4)',
                background: saldo >= 0 ? '#E8F5ED' : '#FFE9E9',
                border: `1px solid ${saldo >= 0 ? '#C3DEC9' : '#F5C0BE'}`,
                borderRadius: 'var(--r-md)',
              }}>
                <div style={{ fontSize: 11, color: 'var(--gray)', marginBottom: 4 }}>Saldo do mês (recebido − saídas)</div>
                <div style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 22,
                  fontWeight: 700,
                  color: saldo >= 0 ? '#3A8C50' : '#C0392B',
                }}>
                  R$ {fmt(saldo)}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   3. SOBRE PAGE
   ═══════════════════════════════════════════════ */

const SOBRE_TABS = [
  { id: 'lorenna',      label: 'Lorenna'        },
  { id: 'papeldalola',  label: 'Papel da Lola'  },
  { id: 'logue',        label: 'Agência Logue'  },
  { id: 'monetizacao',  label: 'Monetização'    },
  { id: 'redes',        label: 'Redes Sociais'  },
];

const REDES_LIST = [
  { plataforma: 'LinkedIn',          handle: 'lorennaguerra',              url: 'https://linkedin.com/in/lorennaguerra/',     icon: 'network' },
  { plataforma: 'YouTube',           handle: '@lorennaguerra',             url: 'https://youtube.com/@lorennaguerra',         icon: 'play'    },
  { plataforma: 'Instagram pessoal', handle: '@lorennagn',                 url: 'https://instagram.com/lorennagn',            icon: 'heart'   },
  { plataforma: 'Instagram blog',    handle: '@papeldalola',               url: 'https://instagram.com/papeldalola',          icon: 'book'    },
  { plataforma: 'Instagram agência', handle: '@agencialogue',              url: 'https://instagram.com/agencialogue',         icon: 'sparkle' },
  { plataforma: 'TikTok pessoal',    handle: '@lorennagn',                 url: 'https://tiktok.com/@lorennagn',             icon: 'zap'     },
  { plataforma: 'TikTok blog',       handle: '@papeldalola',               url: 'https://tiktok.com/@papeldalola',           icon: 'book'    },
  { plataforma: 'Substack',          handle: 'lorennagn.substack.com',     url: 'https://lorennagn.substack.com',            icon: 'mail'    },
  { plataforma: 'Site',              handle: 'papeldalola.com',            url: 'https://papeldalola.com',                   icon: 'flower'  },
];

const MONETIZACAO_FONTES_SOBRE = [
  { nome: 'Social media (clientes)',  tipo: 'recorrente',  icon: 'users'   },
  { nome: 'UGC creator',             tipo: 'campanha',    icon: 'mic'     },
  { nome: 'Afiliados',               tipo: 'passivo',     icon: 'trend'   },
  { nome: 'Ebooks e printables',     tipo: 'digital',     icon: 'doc'     },
  { nome: 'Planners físicos',        tipo: 'produto',     icon: 'book'    },
  { nome: 'Oficinas e cursos',       tipo: 'sazonal',     icon: 'sparkle' },
  { nome: 'Consultoria e branding',  tipo: 'projeto',     icon: 'bulb'    },
  { nome: 'Comunidade',              tipo: 'futuro',      icon: 'heart'   },
];

const RECURSOS_SOBRE = [
  'WooCommerce', 'Canva Pro', 'Claude', 'Impressora',
  'Encadernadora wire-o', 'Encadernadora espiral', 'Encadernadora disco',
  'Plastificadora', 'Guilhotina',
];

function SobreTabLorenna() {
  const roles = ['Designer', 'Web Designer', 'Social Media', 'UGC Creator', 'Estrategista', 'Mãe', 'Empreendedora'];
  return (
    <div className="col gap-5">
      {/* Hero */}
      <div style={{
        padding: 'var(--s-6)',
        background: 'var(--pink-tint)',
        border: '1px solid var(--pink-soft)',
        borderRadius: 'var(--r-xl)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', right: -30, top: -30, opacity: 0.18 }}>
          <g stroke="var(--pink)" strokeWidth="1.4" fill="none" strokeLinecap="round">
            <ellipse cx="100" cy="80" rx="14" ry="26" transform="rotate(0 100 80)"/>
            <ellipse cx="100" cy="80" rx="14" ry="26" transform="rotate(60 100 80)"/>
            <ellipse cx="100" cy="80" rx="14" ry="26" transform="rotate(120 100 80)"/>
            <circle cx="100" cy="80" r="6" fill="var(--pink)" stroke="none"/>
          </g>
        </svg>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pink-deep)', fontWeight: 600, marginBottom: 8 }}>
            Lorenna Luiza Guerra Nunes Barbosa
          </div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 28, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 16 }}>
            Criativa multifuncional.<br />Itabira/MG.
          </h1>
          <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
            {roles.map(r => (
              <span key={r} style={{
                padding: '4px 12px',
                borderRadius: 'var(--r-pill)',
                background: 'var(--white)',
                border: '1px solid var(--pink-soft)',
                fontSize: 12,
                color: 'var(--pink-deep)',
                fontWeight: 500,
              }}>{r}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }}>
        {/* Perfil */}
        <Card>
          <CardBody>
            <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>Perfil neurodivergente</div>
            <div className="col gap-2">
              {['TDAH', 'TEA nível 1', 'Altas Habilidades'].map(tag => (
                <div key={tag} className="row gap-2" style={{
                  padding: '8px 12px',
                  background: 'var(--offwhite)',
                  border: '1px solid var(--gray-light)',
                  borderRadius: 'var(--r-md)',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--pink)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{tag}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Filhos */}
        <Card>
          <CardBody>
            <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>Família</div>
            <div className="col gap-3">
              <div style={{
                padding: '10px 12px',
                background: '#E8F5ED',
                border: '1px solid #C3DEC9',
                borderRadius: 'var(--r-md)',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#3A8C50' }}>Mateus e Murilo</div>
                <div style={{ fontSize: 12, color: '#5FAD74' }}>Gêmeos · 7 anos</div>
              </div>
              <div style={{
                padding: '10px 12px',
                background: '#E8EEFF',
                border: '1px solid #BFC9F5',
                borderRadius: 'var(--r-md)',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#3A50C4' }}>Miguel</div>
                <div style={{ fontSize: 12, color: '#5B72E8' }}>1 ano e 10 meses</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Citação */}
      <div style={{
        padding: 'var(--s-5) var(--s-6)',
        background: 'var(--white)',
        border: '1px solid var(--gray-light)',
        borderLeft: '4px solid var(--pink)',
        borderRadius: 'var(--r-md)',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14.5,
          color: 'var(--ink-soft)',
          lineHeight: 1.65,
          fontStyle: 'italic',
          margin: 0,
        }}>
          "Sou uma pessoa que pensa em mil coisas ao mesmo tempo, cria sistemas pra não perder nada, e tenta fazer tudo com beleza — até o caos."
        </p>
      </div>
    </div>
  );
}

function SobreTabPapelDaLola() {
  const pilares = [
    'Análise de marcas',
    'Mulheres incríveis',
    'Livros infantis',
    'Maternidade criativa',
    'IA com afeto',
    'Bastidores criativos',
  ];
  const plataformas = [
    { nome: 'Instagram', handle: '@papeldalola', icon: 'heart'  },
    { nome: 'YouTube',   handle: 'Canal',        icon: 'play'   },
    { nome: 'Blog',      handle: 'papeldalola.com', icon: 'doc' },
    { nome: 'Substack',  handle: 'Newsletter',   icon: 'mail'   },
    { nome: 'TikTok',    handle: '@papeldalola', icon: 'zap'    },
    { nome: 'Pinterest', handle: 'Papel da Lola',icon: 'flower' },
  ];

  return (
    <div className="col gap-5">
      <div style={{
        padding: 'var(--s-5) var(--s-6)',
        background: 'var(--pink-tint)',
        border: '1px solid var(--pink-soft)',
        borderRadius: 'var(--r-xl)',
      }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--pink-deep)', fontWeight: 600, marginBottom: 6 }}>
          papeldalola.com
        </div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
          Papel da Lola
        </h2>
        <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
          Blog e marca pessoal de Lorenna. Conteúdo sobre criatividade, marcas e maternidade com profundidade e sem frescura.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }}>
        <Card>
          <CardBody>
            <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>Pilares de conteúdo</div>
            <div className="col gap-2">
              {pilares.map((p, i) => (
                <div key={i} className="row gap-3" style={{ alignItems: 'center' }}>
                  <div style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--pink)', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--ink)' }}>{p}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>Plataformas</div>
            <div className="col gap-2">
              {plataformas.map((p, i) => (
                <div key={i} className="row gap-3" style={{
                  padding: '8px 10px',
                  background: 'var(--offwhite)',
                  border: '1px solid var(--gray-light)',
                  borderRadius: 'var(--r-md)',
                  alignItems: 'center',
                }}>
                  <Icon name={p.icon} size={13} color="var(--pink-deep)" />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)' }}>{p.nome}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray)' }}>{p.handle}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Missão</div>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
            "Criar conteúdo sobre criatividade, marcas e maternidade com profundidade e sem frescura."
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

function SobreTabLogue() {
  const clientes = [
    { nome: 'Pratique',                cor: '#5FAD74' },
    { nome: 'Espaço Criar',            cor: '#5B72E8' },
    { nome: 'Ótica Igor Giordano',     cor: '#E89B4C' },
    { nome: 'Jornal Cidades Minerais', cor: '#9E62D8' },
  ];
  const servicos = [
    { nome: 'Social media',       icon: 'sparkle' },
    { nome: 'Gestão de conteúdo', icon: 'doc'     },
    { nome: 'Branding',           icon: 'flower'  },
    { nome: 'UGC',                icon: 'mic'     },
  ];

  return (
    <div className="col gap-5">
      <div style={{
        padding: 'var(--s-5) var(--s-6)',
        background: 'var(--offwhite-2)',
        border: '1px solid var(--gray-light)',
        borderRadius: 'var(--r-xl)',
      }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray)', fontWeight: 600, marginBottom: 6 }}>
          Agência
        </div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
          Agência Logue
        </h2>
        <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
          Agência de social media focada em negócios locais. Pacotes mensais recorrentes com gestão completa de presença digital.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }}>
        <Card>
          <CardBody>
            <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>Clientes ativos</div>
            <div className="col gap-2">
              {clientes.map((c, i) => (
                <div key={i} className="row gap-3" style={{
                  padding: '10px 12px',
                  background: 'var(--offwhite)',
                  border: '1px solid var(--gray-light)',
                  borderRadius: 'var(--r-md)',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: 999, background: c.cor, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{c.nome}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>Serviços</div>
            <div className="col gap-2">
              {servicos.map((s, i) => (
                <div key={i} className="row gap-3" style={{
                  padding: '10px 12px',
                  background: 'var(--offwhite)',
                  border: '1px solid var(--gray-light)',
                  borderRadius: 'var(--r-md)',
                }}>
                  <Icon name={s.icon} size={14} color="var(--pink-deep)" />
                  <span style={{ fontSize: 13, color: 'var(--ink)' }}>{s.nome}</span>
                </div>
              ))}
            </div>
            <div style={{
              marginTop: 'var(--s-4)',
              padding: '10px 12px',
              background: 'var(--pink-tint)',
              border: '1px solid var(--pink-soft)',
              borderRadius: 'var(--r-md)',
              fontSize: 12,
              color: 'var(--pink-deep)',
            }}>
              Modelo: pacotes mensais recorrentes
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function SobreTabMonetizacao() {
  const tipoColors = {
    recorrente: { bg: '#E8F5ED', text: '#3A8C50', border: '#C3DEC9' },
    campanha:   { bg: '#E8EEFF', text: '#3A50C4', border: '#BFC9F5' },
    passivo:    { bg: '#FFF3E3', text: '#B5720A', border: '#FDDBB0' },
    digital:    { bg: 'var(--pink-tint)', text: 'var(--pink-deep)', border: 'var(--pink-soft)' },
    produto:    { bg: '#F2E8FF', text: '#7A3DB5', border: '#D5BFEF' },
    sazonal:    { bg: '#FFF8E3', text: '#B5720A', border: '#FDDBB0' },
    projeto:    { bg: 'var(--offwhite)', text: 'var(--gray)', border: 'var(--gray-light)' },
    futuro:     { bg: 'var(--offwhite)', text: 'var(--gray)', border: 'var(--gray-light)' },
  };

  return (
    <div className="col gap-5">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 'var(--s-3)',
      }}>
        {MONETIZACAO_FONTES_SOBRE.map((f, i) => {
          const cfg = tipoColors[f.tipo] || tipoColors.projeto;
          return (
            <div key={i} style={{
              padding: 'var(--s-4)',
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: 'var(--r-md)',
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}>
              <Icon name={f.icon} size={16} color={cfg.text} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{f.nome}</div>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 'var(--r-pill)',
                  background: 'rgba(255,255,255,0.6)',
                  border: `1px solid ${cfg.border}`,
                  fontSize: 10.5,
                  color: cfg.text,
                  fontWeight: 600,
                }}>
                  {f.tipo}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <Card>
        <CardBody>
          <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>Recursos disponíveis</div>
          <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
            {RECURSOS_SOBRE.map((r, i) => (
              <span key={i} style={{
                padding: '5px 13px',
                borderRadius: 'var(--r-pill)',
                background: 'var(--offwhite)',
                border: '1px solid var(--gray-light)',
                fontSize: 12,
                color: 'var(--ink-soft)',
                fontWeight: 500,
              }}>
                {r}
              </span>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function SobreTabRedes() {
  return (
    <div className="col gap-5">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--s-3)' }}>
        {REDES_LIST.map((r, i) => (
          <a
            key={i}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: 'var(--s-4)',
              background: 'var(--white)',
              border: '1px solid var(--gray-light)',
              borderRadius: 'var(--r-md)',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'border-color 0.15s var(--easing)',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--pink-soft)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-light)'}
          >
            <div style={{
              width: 36, height: 36,
              borderRadius: 'var(--r-md)',
              background: 'var(--pink-tint)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon name={r.icon} size={16} color="var(--pink-deep)" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>{r.plataforma}</div>
              <div style={{ fontSize: 11.5, color: 'var(--pink-deep)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.handle}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function SobrePage() {
  const [tab, setTab] = useState('lorenna');

  const tabContent = {
    lorenna:     <SobreTabLorenna />,
    papeldalola: <SobreTabPapelDaLola />,
    logue:       <SobreTabLogue />,
    monetizacao: <SobreTabMonetizacao />,
    redes:       <SobreTabRedes />,
  };

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Sobre"
          subtitle="Lorenna, suas marcas e projetos"
        />

        {/* Tab bar */}
        <div className="row gap-1" style={{
          background: 'var(--offwhite)',
          border: '1px solid var(--gray-light)',
          borderRadius: 'var(--r-md)',
          padding: 4,
          width: 'fit-content',
        }}>
          {SOBRE_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '7px 16px',
                borderRadius: 'var(--r-md)',
                background: tab === t.id ? 'var(--white)' : 'transparent',
                border: tab === t.id ? '1px solid var(--gray-light)' : '1px solid transparent',
                color: tab === t.id ? 'var(--pink-deep)' : 'var(--gray)',
                fontFamily: 'var(--font-body)',
                fontWeight: tab === t.id ? 600 : 400,
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.15s var(--easing)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {tabContent[tab]}
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   4. MONETIZACAO PAGE
   ═══════════════════════════════════════════════ */

const MON_FONTES = [
  { id: 1, nome: 'Social media (clientes)',  tipo: 'recorrente', minVal: 3600, maxVal: 4800, status: 'ativo',     icon: 'users'   },
  { id: 2, nome: 'UGC creator',             tipo: 'campanha',   minVal:  300, maxVal: 1500, status: 'ativo',     icon: 'mic'     },
  { id: 3, nome: 'Afiliados',               tipo: 'passivo',    minVal:   50, maxVal:  300, status: 'ativo',     icon: 'trend'   },
  { id: 4, nome: 'Ebooks e printables',     tipo: 'digital',    minVal:  100, maxVal:  600, status: 'potencial', icon: 'doc'     },
  { id: 5, nome: 'Planners físicos',        tipo: 'produto',    minVal:  150, maxVal:  800, status: 'potencial', icon: 'book'    },
  { id: 6, nome: 'Oficinas e cursos',       tipo: 'sazonal',    minVal:  200, maxVal: 1200, status: 'potencial', icon: 'sparkle' },
  { id: 7, nome: 'Consultoria e branding',  tipo: 'projeto',    minVal:  300, maxVal: 1500, status: 'ativo',     icon: 'bulb'    },
  { id: 8, nome: 'Comunidade',              tipo: 'futuro',     minVal:  400, maxVal: 2000, status: 'futuro',    icon: 'heart'   },
];

const MON_RECURSOS = [
  'WooCommerce', 'Canva Pro', 'Claude', 'Impressora',
  'Encadernadora wire-o', 'Encadernadora espiral', 'Encadernadora disco',
  'Plastificadora', 'Guilhotina',
];

const MON_IDEIAS = [
  "Crie um ebook de 5 páginas sobre branding feminino no Canva. Preço: R$ 17. Divulgue em 3 stories hoje.",
  "Monte um planner semanal impresso. Venda na coleção WooCommerce por R$ 27. Imprime em casa.",
  "Poste um story com link de produto afiliado da Shopee (tema: papelaria premium). Caption honesta e pessoal.",
  "Ofereça 1 vaga de mentoria de 45min sobre social media local. Preço: R$ 150. Story simples hoje.",
  "Monte um kit digital: 3 templates Canva para pequenas marcas. Preço: R$ 37. Fácil de criar.",
  "Escreva um post pago no blog sobre sua rotina de trabalho (afiliado: ferramenta de produtividade).",
];

const MON_META = 6000;
const MON_ATUAL = 4750;

const MON_STATUS_CFG = {
  ativo:     { label: 'Ativo',     bg: '#E8F5ED', text: '#3A8C50', border: '#C3DEC9' },
  potencial: { label: 'Potencial', bg: '#FFF8E3', text: '#B5720A', border: '#FDDBB0' },
  futuro:    { label: 'Futuro',    bg: 'var(--offwhite)', text: 'var(--gray)', border: 'var(--gray-light)' },
};

const MON_TIPO_CFG = {
  recorrente: '#3A8C50',
  campanha:   '#3A50C4',
  passivo:    '#B5720A',
  digital:    'var(--pink-deep)',
  produto:    '#7A3DB5',
  sazonal:    '#B5720A',
  projeto:    'var(--ink-soft)',
  futuro:     'var(--gray)',
};

function MonetizacaoPage() {
  const [ideiaIdx, setIdeiaIdx] = useState(0);
  const [ideiaVis, setIdeiaVis] = useState(false);

  function gerarIdeia() {
    setIdeiaVis(true);
    setIdeiaIdx(prev => (prev + 1) % MON_IDEIAS.length);
  }

  const ativoMin = MON_FONTES.filter(f => f.status === 'ativo').reduce((s, f) => s + f.minVal, 0);
  const ativoMax = MON_FONTES.filter(f => f.status === 'ativo').reduce((s, f) => s + f.maxVal, 0);
  const pctMeta  = Math.min(100, Math.round((MON_ATUAL / MON_META) * 100));

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        {/* Header */}
        <PageHeader
          title="Monetização"
          subtitle="Estratégia e potencial de receita — Maio 2025"
        />

        {/* Summary */}
        <div className="row gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{
            flex: 1, minWidth: 200,
            padding: 'var(--s-5)',
            background: 'var(--pink-tint)',
            border: '1px solid var(--pink-soft)',
            borderRadius: 'var(--r-lg)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--pink-deep)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Potencial ativo (mês)
            </div>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: 26, fontWeight: 700, color: 'var(--pink-deep)', lineHeight: 1 }}>
              R$ {ativoMin.toLocaleString('pt-BR')} – {ativoMax.toLocaleString('pt-BR')}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--pink-deep)', marginTop: 6, opacity: 0.8 }}>
              {MON_FONTES.filter(f => f.status === 'ativo').length} fontes ativas
            </div>
          </div>
          <div style={{
            flex: 1, minWidth: 200,
            padding: 'var(--s-5)',
            background: 'var(--white)',
            border: '1px solid var(--gray-light)',
            borderRadius: 'var(--r-lg)',
          }}>
            <div style={{ fontSize: 11, color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Meta mensal
            </div>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: 26, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>
              R$ {MON_META.toLocaleString('pt-BR')}
            </div>
            <div style={{ marginTop: 10, height: 6, background: 'var(--gray-light)', borderRadius: 'var(--r-pill)', overflow: 'hidden' }}>
              <div style={{ width: `${pctMeta}%`, height: '100%', background: 'var(--pink)', borderRadius: 'var(--r-pill)' }} />
            </div>
            <div style={{ fontSize: 11, color: 'var(--gray)', marginTop: 4 }}>{pctMeta}% atingido (R$ {MON_ATUAL.toLocaleString('pt-BR')} realizado)</div>
          </div>
        </div>

        {/* Fontes de renda */}
        <div>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 700, marginBottom: 'var(--s-3)' }}>
            Fontes de renda
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--s-3)' }}>
            {MON_FONTES.map(f => {
              const stCfg = MON_STATUS_CFG[f.status];
              const tipoCor = MON_TIPO_CFG[f.tipo] || 'var(--gray)';
              return (
                <div key={f.id} style={{
                  padding: 'var(--s-4)',
                  background: 'var(--white)',
                  border: '1px solid var(--gray-light)',
                  borderRadius: 'var(--r-md)',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 38, height: 38,
                    borderRadius: 'var(--r-md)',
                    background: 'var(--offwhite)',
                    border: '1px solid var(--gray-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon name={f.icon} size={16} color={tipoCor} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="row between" style={{ marginBottom: 4, gap: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{f.nome}</span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--r-pill)',
                        background: stCfg.bg,
                        border: `1px solid ${stCfg.border}`,
                        color: stCfg.text,
                        fontSize: 10.5,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}>{stCfg.label}</span>
                    </div>
                    <div className="row between">
                      <span style={{
                        fontSize: 11,
                        color: tipoCor,
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}>{f.tipo}</span>
                      <span style={{
                        fontFamily: 'var(--font-title)',
                        fontSize: 12,
                        fontWeight: 700,
                        color: f.status === 'futuro' ? 'var(--gray)' : 'var(--ink)',
                      }}>
                        R$ {f.minVal.toLocaleString('pt-BR')}–{f.maxVal.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recursos */}
        <Card>
          <CardBody>
            <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>Recursos disponíveis</div>
            <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
              {MON_RECURSOS.map((r, i) => (
                <span key={i} style={{
                  padding: '5px 13px',
                  borderRadius: 'var(--r-pill)',
                  background: 'var(--offwhite)',
                  border: '1px solid var(--gray-light)',
                  fontSize: 12,
                  color: 'var(--ink-soft)',
                  fontWeight: 500,
                }}>
                  {r}
                </span>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Ideias pra monetizar hoje */}
        <Card>
          <CardHeader>
            <div className="row between">
              <div>
                <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 700 }}>Ideia pra Monetizar Hoje</h2>
                <p className="tiny muted" style={{ marginTop: 2 }}>Uma ação concreta que você pode fazer agora</p>
              </div>
              <Button variant="primary" onClick={gerarIdeia}>
                <Icon name="sparkle" size={13} color="white" />
                Gerar ideia
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {ideiaVis ? (
              <div style={{
                padding: 'var(--s-5)',
                background: 'var(--pink-tint)',
                border: '1px solid var(--pink-soft)',
                borderRadius: 'var(--r-md)',
                position: 'relative',
              }}>
                <div style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--pink-deep)',
                  fontWeight: 600,
                  marginBottom: 8,
                }}>
                  Ideia #{ideiaIdx + 1} de {MON_IDEIAS.length}
                </div>
                <p style={{
                  fontSize: 14.5,
                  color: 'var(--ink)',
                  lineHeight: 1.65,
                  margin: 0,
                  fontWeight: 500,
                }}>
                  {MON_IDEIAS[ideiaIdx]}
                </p>
                <button
                  onClick={gerarIdeia}
                  style={{
                    marginTop: 14,
                    fontSize: 12,
                    color: 'var(--pink-deep)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                  }}
                >
                  Gerar outra ideia
                </button>
              </div>
            ) : (
              <div className="center" style={{ padding: 'var(--s-5) 0', color: 'var(--gray)' }}>
                <Icon name="sparkle" size={24} color="var(--gray-light)" />
                <p className="small muted" style={{ marginTop: 10 }}>
                  Clique em "Gerar ideia" para receber uma sugestão concreta de monetização.
                </p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Meta progress */}
        <Card>
          <CardBody>
            <div className="row between" style={{ marginBottom: 'var(--s-4)' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 700, marginBottom: 2 }}>
                  Meta de renda mensal
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray)' }}>Maio 2025</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>
                  R$ {MON_ATUAL.toLocaleString('pt-BR')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--gray)' }}>de R$ {MON_META.toLocaleString('pt-BR')}</div>
              </div>
            </div>
            <div style={{ height: 12, background: 'var(--gray-light)', borderRadius: 'var(--r-pill)', overflow: 'hidden', marginBottom: 8 }}>
              <div style={{
                width: `${pctMeta}%`,
                height: '100%',
                background: 'var(--pink)',
                borderRadius: 'var(--r-pill)',
                transition: 'width 0.6s var(--easing)',
              }} />
            </div>
            <div className="row between">
              <span style={{ fontSize: 12, color: 'var(--gray)' }}>R$ {(MON_META - MON_ATUAL).toLocaleString('pt-BR')} para a meta</span>
              <span style={{
                fontFamily: 'var(--font-title)',
                fontSize: 14,
                fontWeight: 700,
                color: pctMeta >= 100 ? '#3A8C50' : 'var(--pink-deep)',
              }}>
                {pctMeta}%
              </span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   5. IMPRESSOS PAGE
   ═══════════════════════════════════════════════ */

const IMPRESSOS_TEMPLATES = [
  {
    id: 'rotina-semanal',
    nome: 'Rotina Semanal',
    desc: 'Blocos de foco da semana',
    icon: 'calendar',
    perguntas: [
      { id: 'horarios', label: 'Quais são seus horários fixos?', placeholder: 'Ex: 08:20 futebol meninos, 14h reunião...' },
      { id: 'pico',     label: 'Qual seu horário de pico criativo?', placeholder: 'Ex: manhã, após almoço...' },
      { id: 'filhos',   label: 'Quantos filhos você cuida?', placeholder: 'Ex: 3 (Mateus, Murilo e Miguel)' },
    ],
  },
  {
    id: 'planner-diario',
    nome: 'Planner Diário',
    desc: 'Prioridades, tarefas e estado emocional',
    icon: 'list',
    perguntas: [
      { id: 'prio',   label: 'Quais suas 3 prioridades do dia?', placeholder: 'Ex: gravar reel, entregar posts, reunião...' },
      { id: 'estado', label: 'Como está sua energia hoje?', placeholder: 'Ex: cansada, criativa, focada...' },
      { id: 'meta',   label: 'Uma meta pequena e realizável hoje?', placeholder: 'Ex: enviar 1 proposta...' },
    ],
  },
  {
    id: 'checklist-conteudo',
    nome: 'Checklist de Conteúdo',
    desc: 'Verificação para publicações',
    icon: 'check',
    perguntas: [
      { id: 'plat',    label: 'Qual plataforma?', placeholder: 'Instagram, TikTok, Blog...' },
      { id: 'formato', label: 'Formato do conteúdo?', placeholder: 'Reel, carrossel, post estático...' },
      { id: 'marca',   label: 'Para qual marca?', placeholder: 'Papel da Lola, Logue, pessoal...' },
    ],
  },
  {
    id: 'planejamento-alimentar',
    nome: 'Planejamento Alimentar',
    desc: 'Organização de refeições',
    icon: 'heart',
    perguntas: [
      { id: 'dias',      label: 'Quantos dias quer planejar?', placeholder: '3, 5, 7 dias...' },
      { id: 'pessoas',   label: 'Para quantas pessoas?', placeholder: 'Ex: 4 (eu + 3 filhos)' },
      { id: 'restricao', label: 'Alguma restrição alimentar?', placeholder: 'Ex: sem lactose, vegetariano...' },
    ],
  },
  {
    id: 'tarefas-semana',
    nome: 'Tarefas da Semana',
    desc: 'Lista organizada por categoria',
    icon: 'doc',
    perguntas: [
      { id: 'cats',   label: 'Quais categorias de tarefas?', placeholder: 'Ex: agência, conteúdo, pessoal, filhos...' },
      { id: 'inicio', label: 'Dia de início da semana?', placeholder: 'Segunda-feira' },
      { id: 'foco',   label: 'Qual área merece mais foco essa semana?', placeholder: 'Ex: clientes novos, conteúdo pessoal...' },
    ],
  },
  {
    id: 'planejamento-mensal',
    nome: 'Planejamento Mensal',
    desc: 'Visão geral do mês com metas',
    icon: 'trend',
    perguntas: [
      { id: 'mes',   label: 'Qual mês?', placeholder: 'Ex: Junho 2025' },
      { id: 'metas', label: 'Suas 3 metas principais do mês?', placeholder: 'Ex: fechar 1 cliente, lançar ebook...' },
      { id: 'foco',  label: 'Uma palavra que define o mês?', placeholder: 'Ex: crescimento, equilíbrio, entrega...' },
    ],
  },
  {
    id: 'rotina-emocional',
    nome: 'Rotina Emocional',
    desc: 'Acompanhamento de estado emocional',
    icon: 'brain',
    perguntas: [
      { id: 'estados', label: 'Quais estados emocionais você costuma ter?', placeholder: 'Ex: ansiosa, empolgada, cansada, criativa...' },
      { id: 'ancora',  label: 'O que te ancora quando desregula?', placeholder: 'Ex: caminhar, música, escrever...' },
      { id: 'periodo', label: 'Quantos dias quer acompanhar?', placeholder: '7, 14, 30 dias...' },
    ],
  },
  {
    id: 'plano-monetizacao',
    nome: 'Plano de Monetização',
    desc: 'Estratégias e metas financeiras',
    icon: 'trend',
    perguntas: [
      { id: 'meta',   label: 'Meta de renda para o mês?', placeholder: 'Ex: R$ 6.000' },
      { id: 'fontes', label: 'Quais suas fontes de renda ativas?', placeholder: 'Ex: clientes, UGC, afiliados...' },
      { id: 'acao',   label: 'Uma ação nova pra testar esse mês?', placeholder: 'Ex: lançar ebook, mentoria...' },
    ],
  },
  {
    id: 'agenda-semanal',
    nome: 'Agenda Semanal',
    desc: 'Compromissos e horários',
    icon: 'calendar',
    perguntas: [
      { id: 'semana',  label: 'Semana de?', placeholder: 'Ex: 19 a 25 de maio' },
      { id: 'fixos',   label: 'Compromissos fixos recorrentes?', placeholder: 'Ex: futebol seg/qua/sex 08:20...' },
      { id: 'novos',   label: 'Novos compromissos da semana?', placeholder: 'Ex: reunião cliente, gravação...' },
    ],
  },
];

function ImpressosModal({ template, onClose }) {
  const [respostas, setRespostas] = useState({});
  const [gerado, setGerado] = useState(false);

  function handleGerar() {
    setGerado(true);
    showToast('Documento gerado! Pronto para imprimir.');
  }

  function handleImprimir() {
    window.print();
  }

  if (!template) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(43, 43, 43, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--s-4)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(540px, 96vw)',
          background: 'var(--white)',
          borderRadius: 'var(--r-xl)',
          border: '1px solid var(--gray-light)',
          overflow: 'hidden',
        }}
      >
        {/* Top accent */}
        <div style={{ height: 4, background: 'var(--pink)' }} />

        {/* Header */}
        <div style={{ padding: 'var(--s-5) var(--s-5) 0' }}>
          <div className="row between" style={{ marginBottom: 'var(--s-3)' }}>
            <div className="row gap-3">
              <div style={{
                width: 40, height: 40,
                borderRadius: 'var(--r-md)',
                background: 'var(--pink-tint)',
                border: '1px solid var(--pink-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon name={template.icon} size={18} color="var(--pink-deep)" />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 700, marginBottom: 2 }}>
                  {template.nome}
                </h3>
                <p style={{ fontSize: 12, color: 'var(--gray)', margin: 0 }}>{template.desc}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: 999,
                background: 'var(--offwhite)', border: '1px solid var(--gray-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}
            >
              <Icon name="x" size={14} color="var(--gray)" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: 'var(--s-4) var(--s-5) var(--s-5)' }}>
          {!gerado ? (
            <div className="col gap-4">
              {template.perguntas.map(q => (
                <div key={q.id}>
                  <label style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--ink)',
                    marginBottom: 6,
                    fontFamily: 'var(--font-body)',
                  }}>
                    {q.label}
                  </label>
                  <input
                    type="text"
                    placeholder={q.placeholder}
                    value={respostas[q.id] || ''}
                    onChange={e => setRespostas(prev => ({ ...prev, [q.id]: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'var(--offwhite)',
                      border: '1px solid var(--gray-light)',
                      borderRadius: 'var(--r-md)',
                      fontSize: 13,
                      color: 'var(--ink)',
                      fontFamily: 'var(--font-body)',
                      transition: 'border-color 0.15s var(--easing)',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--pink-soft)'}
                    onBlur={e => e.target.style.borderColor = 'var(--gray-light)'}
                  />
                </div>
              ))}
              <div className="row gap-3" style={{ marginTop: 'var(--s-2)', justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                <Button variant="primary" onClick={handleGerar}>
                  <Icon name="doc" size={13} color="white" />
                  Gerar documento
                </Button>
              </div>
            </div>
          ) : (
            <div className="col gap-4">
              <div style={{
                padding: 'var(--s-5)',
                background: '#E8F5ED',
                border: '1px solid #C3DEC9',
                borderRadius: 'var(--r-md)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 30, marginBottom: 10 }}>
                  <Icon name="check" size={32} color="#3A8C50" />
                </div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 700, color: '#3A8C50', marginBottom: 4 }}>
                  Documento gerado!
                </div>
                <p style={{ fontSize: 13, color: '#5FAD74', margin: 0 }}>
                  {template.nome} pronto para imprimir.
                </p>
              </div>

              {/* Preview card */}
              <div style={{
                padding: 'var(--s-4)',
                background: 'var(--offwhite)',
                border: '1px solid var(--gray-light)',
                borderRadius: 'var(--r-md)',
              }}>
                <div style={{ fontSize: 12, color: 'var(--gray)', marginBottom: 8, fontWeight: 600 }}>
                  Visualização — {template.nome}
                </div>
                {template.perguntas.map(q => respostas[q.id] && (
                  <div key={q.id} style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--gray)' }}>{q.label}: </span>
                    <span style={{ fontSize: 12, color: 'var(--ink)', fontWeight: 500 }}>{respostas[q.id]}</span>
                  </div>
                ))}
                {Object.values(respostas).every(v => !v) && (
                  <p style={{ fontSize: 12, color: 'var(--gray)', fontStyle: 'italic', margin: 0 }}>
                    Nenhuma informação adicionada — documento gerado com estrutura padrão.
                  </p>
                )}
              </div>

              <div className="row gap-3" style={{ justifyContent: 'flex-end' }}>
                <Button variant="ghost" onClick={onClose}>Fechar</Button>
                <Button variant="primary" onClick={handleImprimir}>
                  <Icon name="doc" size={13} color="white" />
                  Imprimir
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ImpressosPage() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Impressos"
          subtitle={`${IMPRESSOS_TEMPLATES.length} modelos de documentos imprimíveis`}
        />

        {/* Templates grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 'var(--s-4)',
        }}>
          {IMPRESSOS_TEMPLATES.map(tpl => (
            <div
              key={tpl.id}
              style={{
                padding: 'var(--s-5)',
                background: 'var(--white)',
                border: '1px solid var(--gray-light)',
                borderRadius: 'var(--r-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--s-3)',
                transition: 'border-color 0.15s var(--easing)',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--pink-soft)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-light)'}
            >
              {/* Icon */}
              <div style={{
                width: 44, height: 44,
                borderRadius: 'var(--r-md)',
                background: 'var(--pink-tint)',
                border: '1px solid var(--pink-soft)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon name={tpl.icon} size={20} color="var(--pink-deep)" />
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: 'var(--ink)',
                  marginBottom: 4,
                }}>
                  {tpl.nome}
                </div>
                <p style={{
                  fontSize: 12.5,
                  color: 'var(--gray)',
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  {tpl.desc}
                </p>
              </div>

              {/* Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(tpl)}
                style={{
                  justifyContent: 'center',
                  borderColor: 'var(--pink-soft)',
                  color: 'var(--pink-deep)',
                  fontWeight: 600,
                  width: '100%',
                }}
              >
                <Icon name="doc" size={13} color="var(--pink-deep)" />
                Gerar
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <ImpressosModal
          template={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════
   EXPORTS
   ═══════════════════════════════════════════════ */

Object.assign(window, {
  AgendaPage,
  FinanceiroPage,
  SobrePage,
  MonetizacaoPage,
  ImpressosPage,
});
