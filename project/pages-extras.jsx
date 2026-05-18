/* ──────────────────────────────────────────────
   pages-extras.jsx
   AgendaPage · FinanceiroPage · SobrePage
   MonetizacaoPage
   ────────────────────────────────────────────── */

const { useState, useEffect, useRef } = React;

/* ═══════════════════════════════════════════════
   1. AGENDA PAGE
   ═══════════════════════════════════════════════ */

const AGENDA_EVENTS = [
  // Futebol: toda QUARTA e SEXTA às 08:20
  { id: 1,  date: '2026-05-06', hora: '08:20', titulo: 'Futebol Mateus e Murilo', tipo: 'filho',    recorrente: true  },
  { id: 2,  date: '2026-05-08', hora: '08:20', titulo: 'Futebol Mateus e Murilo', tipo: 'filho',    recorrente: true  },
  { id: 3,  date: '2026-05-13', hora: '08:20', titulo: 'Futebol Mateus e Murilo', tipo: 'filho',    recorrente: true  },
  { id: 4,  date: '2026-05-15', hora: '08:20', titulo: 'Futebol Mateus e Murilo', tipo: 'filho',    recorrente: true  },
  { id: 5,  date: '2026-05-20', hora: '08:20', titulo: 'Futebol Mateus e Murilo', tipo: 'filho',    recorrente: true  },
  { id: 6,  date: '2026-05-22', hora: '08:20', titulo: 'Futebol Mateus e Murilo', tipo: 'filho',    recorrente: true  },
  { id: 7,  date: '2026-05-27', hora: '08:20', titulo: 'Futebol Mateus e Murilo', tipo: 'filho',    recorrente: true  },
  { id: 8,  date: '2026-05-29', hora: '08:20', titulo: 'Futebol Mateus e Murilo', tipo: 'filho',    recorrente: true  },
  // Divulgar serviços — toda SEGUNDA-FEIRA
  { id: 9,  date: '2026-05-04', hora: '10:00', titulo: '📣 Divulgar serviços (stories + feed)', tipo: 'conteudo', recorrente: true },
  { id: 10, date: '2026-05-11', hora: '10:00', titulo: '📣 Divulgar serviços (stories + feed)', tipo: 'conteudo', recorrente: true },
  { id: 11, date: '2026-05-18', hora: '10:00', titulo: '📣 Divulgar serviços (stories + feed)', tipo: 'conteudo', recorrente: true },
  { id: 12, date: '2026-05-25', hora: '10:00', titulo: '📣 Divulgar serviços (stories + feed)', tipo: 'conteudo', recorrente: true },
  // Outros eventos
  { id: 13, date: '2026-05-01', hora: '09:00', titulo: 'Reunião início do mês — Logue', tipo: 'admin',    recorrente: false },
  { id: 14, date: '2026-05-05', hora: '14:00', titulo: 'Entrega posts Espaço Criar', tipo: 'conteudo', recorrente: false },
  { id: 15, date: '2026-05-07', hora: '11:00', titulo: 'Gravação reel Papel da Lola', tipo: 'gravacao', recorrente: false },
  { id: 16, date: '2026-05-08', hora: '09:00', titulo: 'Atendimento cliente Pratique', tipo: 'cliente',  recorrente: false },
  { id: 17, date: '2026-05-13', hora: '10:00', titulo: 'Entrega posts Ótica Igor Giordano', tipo: 'conteudo', recorrente: false },
  { id: 18, date: '2026-05-14', hora: '15:00', titulo: 'Sessão de terapia', tipo: 'admin',    recorrente: false },
  { id: 19, date: '2026-05-15', hora: '14:00', titulo: 'Reunião Jornal Cidades Minerais', tipo: 'cliente',  recorrente: false },
  { id: 20, date: '2026-05-19', hora: '14:00', titulo: 'Reunião cliente (Espaço Criar)', tipo: 'cliente',  recorrente: false },
  { id: 21, date: '2026-05-20', hora: '09:00', titulo: 'Gravação conteúdo @lorennagn — reel bastidores', tipo: 'gravacao', recorrente: false },
  { id: 22, date: '2026-05-20', hora: null,    titulo: 'Ótica — visita Sabrina Sachez (influencer)', tipo: 'cliente',  recorrente: false },
  { id: 23, date: '2026-05-21', hora: null,    titulo: 'Ótica — visita Waltencir (influencer)', tipo: 'cliente',  recorrente: false },
  { id: 24, date: '2026-05-21', hora: '10:00', titulo: 'Entrega posts Pratique (semana)', tipo: 'conteudo', recorrente: false },
  { id: 25, date: '2026-05-22', hora: null,    titulo: 'Ótica — visita Thais Lage (influencer)', tipo: 'cliente',  recorrente: false },
  { id: 26, date: '2026-05-22', hora: '15:00', titulo: 'Gravação vídeo Jornal Cidades Minerais', tipo: 'gravacao', recorrente: false },
  { id: 27, date: '2026-05-23', hora: '16:00', titulo: 'Planejamento semana editorial', tipo: 'admin',    recorrente: false },
  { id: 28, date: '2026-05-24', hora: null,    titulo: 'Família — tempo com os meninos', tipo: 'filho',    recorrente: false },
  { id: 29, date: '2026-05-25', hora: null,    titulo: 'Revisão semana e planejamento próxima', tipo: 'admin',    recorrente: false },
  { id: 30, date: '2026-05-27', hora: '10:00', titulo: 'Gravação conteúdo UGC', tipo: 'gravacao', recorrente: false },
  { id: 31, date: '2026-05-28', hora: '14:00', titulo: 'Entrega relatório clientes', tipo: 'admin',    recorrente: false },
  { id: 32, date: '2026-05-29', hora: '09:00', titulo: 'Reunião planejamento junho', tipo: 'admin',    recorrente: false },
];

const AGENDA_TYPE_COLORS = {
  conteudo: { bg: '#FFE3EE', border: '#FFC7DD', text: '#E8538D', dot: '#FF78B0' },
  filho:    { bg: '#E8F5ED', border: '#C3DEC9', text: '#3A8C50', dot: '#5FAD74' },
  cliente:  { bg: '#E8EEFF', border: '#BFC9F5', text: '#3A50C4', dot: '#5B72E8' },
  gravacao: { bg: '#F2E8FF', border: '#D5BFEF', text: '#7A3DB5', dot: '#9E62D8' },
  admin:    { bg: '#FFF3E3', border: '#FDDBB0', text: '#B5720A', dot: '#E89B4C' },
};

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
  const [currentView, setCurrentView] = useState('semana');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 19)); // May 19, 2026
  const [selectedDay, setSelectedDay] = useState(null);

  const todayStr = '2026-05-15'; // today per env

  // ── helpers ──────────────────────────────────
  function isoDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function eventsForDate(dateStr) {
    return AGENDA_EVENTS.filter(e => e.date === dateStr);
  }

  // ── navigation ───────────────────────────────
  function navigate(dir) {
    const d = new Date(currentDate);
    if (currentView === 'semana') d.setDate(d.getDate() + dir * 7);
    if (currentView === 'mes')    { d.setDate(1); d.setMonth(d.getMonth() + dir); }
    if (currentView === 'dia')    d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  }

  function switchToDay(dateStr) {
    const [y, m, day] = dateStr.split('-').map(Number);
    setCurrentDate(new Date(y, m - 1, day));
    setSelectedDay(dateStr);
    setCurrentView('dia');
  }

  // ── WEEK VIEW ─────────────────────────────────
  function getWeekDays() {
    // Find Monday of the week
    const d = new Date(currentDate);
    const dow = d.getDay(); // 0=Sun
    const diff = dow === 0 ? -6 : 1 - dow;
    d.setDate(d.getDate() + diff);
    return Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(d);
      dd.setDate(d.getDate() + i);
      return dd;
    });
  }

  const WEEK_NAMES = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  function WeekView() {
    const days = getWeekDays();
    const startStr = days[0].toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    const endStr   = days[6].toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    return (
      <div className="col gap-4">
        <div style={{ fontSize: 13, color: 'var(--gray)', fontWeight: 500 }}>
          Semana de {startStr} a {endStr}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 'var(--s-3)',
          alignItems: 'start',
        }}>
          {days.map((day, i) => {
            const ds = isoDate(day);
            const events = eventsForDate(ds);
            const isToday = ds === todayStr;
            const isWeekend = i >= 5;
            return (
              <div key={i} style={{
                borderRadius: 'var(--r-lg)',
                background: isWeekend ? 'var(--offwhite)' : 'var(--white)',
                border: `1px solid ${isToday ? 'var(--pink-soft)' : 'var(--gray-light)'}`,
                overflow: 'hidden',
                minHeight: 120,
                cursor: 'pointer',
              }} onClick={() => switchToDay(ds)}>
                <div style={{
                  padding: '10px 12px 8px',
                  borderBottom: `1px solid ${isToday ? 'var(--pink-soft)' : 'var(--gray-light)'}`,
                  background: isToday ? 'var(--pink-tint)' : 'transparent',
                }}>
                  <div style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: isToday ? 'var(--pink-deep)' : 'var(--gray)', marginBottom: 2 }}>
                    {WEEK_NAMES[i]}
                  </div>
                  <div style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 700, color: isToday ? 'var(--pink-deep)' : 'var(--ink)', lineHeight: 1 }}>
                    {day.getDate()}
                  </div>
                  {events.length > 0 && (
                    <div style={{ fontSize: 10, color: isToday ? 'var(--pink-deep)' : 'var(--gray)', marginTop: 3, opacity: 0.8 }}>
                      {events.length} {events.length === 1 ? 'item' : 'itens'}
                    </div>
                  )}
                </div>
                <div style={{ padding: '10px 10px 8px' }}>
                  {events.length === 0 ? (
                    <div style={{ fontSize: 11, color: 'var(--gray)', fontStyle: 'italic', textAlign: 'center', padding: '12px 0', opacity: 0.6 }}>
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
      </div>
    );
  }

  // ── MONTH VIEW ────────────────────────────────
  function MonthView() {
    const year  = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay  = new Date(year, month + 1, 0);
    // Monday-based week: 0=Mon…6=Sun
    const startDow = (firstDay.getDay() + 6) % 7;
    const totalCells = Math.ceil((startDow + lastDay.getDate()) / 7) * 7;

    const monthName = firstDay.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

    const cells = [];
    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startDow + 1;
      if (dayNum < 1 || dayNum > lastDay.getDate()) {
        cells.push(null);
      } else {
        cells.push(new Date(year, month, dayNum));
      }
    }

    return (
      <div className="col gap-3">
        <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600, textTransform: 'capitalize' }}>
          {monthName}
        </div>
        {/* Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 10.5, fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.06em', padding: '4px 0' }}>
              {d}
            </div>
          ))}
        </div>
        {/* Days grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} style={{ minHeight: 64 }} />;
            const ds = isoDate(day);
            const events = eventsForDate(ds);
            const isToday = ds === todayStr;
            const isWeekend = i % 7 >= 5;
            return (
              <div
                key={i}
                onClick={() => switchToDay(ds)}
                style={{
                  minHeight: 64,
                  borderRadius: 'var(--r-md)',
                  border: `1px solid ${isToday ? 'var(--pink)' : 'var(--gray-light)'}`,
                  background: isToday ? 'var(--pink-tint)' : isWeekend ? 'var(--offwhite)' : 'var(--white)',
                  padding: '6px 8px',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => { if (!isToday) e.currentTarget.style.borderColor = 'var(--pink-soft)'; }}
                onMouseLeave={e => { if (!isToday) e.currentTarget.style.borderColor = 'var(--gray-light)'; }}
              >
                <div style={{
                  fontFamily: 'var(--font-title)',
                  fontSize: 14,
                  fontWeight: 700,
                  color: isToday ? 'var(--pink-deep)' : 'var(--ink)',
                  marginBottom: 4,
                }}>
                  {day.getDate()}
                </div>
                <div className="col gap-1">
                  {events.slice(0, 3).map(ev => {
                    const cfg = AGENDA_TYPE_COLORS[ev.tipo] || AGENDA_TYPE_COLORS.admin;
                    return (
                      <div key={ev.id} style={{
                        height: 6, borderRadius: 3,
                        background: cfg.dot,
                        title: ev.titulo,
                      }} />
                    );
                  })}
                  {events.length > 3 && (
                    <div style={{ fontSize: 9, color: 'var(--gray)', fontWeight: 600 }}>+{events.length - 3}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── DAY VIEW ──────────────────────────────────
  function DayView() {
    const ds = isoDate(currentDate);
    const events = eventsForDate(ds).sort((a, b) => {
      if (!a.hora && !b.hora) return 0;
      if (!a.hora) return 1;
      if (!b.hora) return -1;
      return a.hora.localeCompare(b.hora);
    });
    const dayLabel = currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
    const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 07–22

    return (
      <div className="col gap-3">
        <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600, textTransform: 'capitalize' }}>
          {dayLabel}
        </div>
        {events.length === 0 && (
          <div style={{ padding: 'var(--s-5)', textAlign: 'center', color: 'var(--gray)', fontSize: 13, fontStyle: 'italic' }}>
            Sem compromissos
          </div>
        )}
        {/* All-day events (no hora) */}
        {events.filter(e => !e.hora).length > 0 && (
          <div className="col gap-2" style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gray)' }}>Dia todo</div>
            {events.filter(e => !e.hora).map(ev => <AgendaEventCard key={ev.id} ev={ev} />)}
          </div>
        )}
        {/* Time slots */}
        <div className="col gap-0" style={{ border: '1px solid var(--gray-light)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
          {HOURS.map(h => {
            const hourStr = String(h).padStart(2, '0') + ':00';
            const hourEvs = events.filter(e => e.hora && parseInt(e.hora) === h);
            return (
              <div key={h} style={{
                display: 'grid',
                gridTemplateColumns: '52px 1fr',
                borderBottom: '1px solid var(--gray-light)',
                minHeight: 48,
                background: hourEvs.length > 0 ? 'var(--offwhite-2)' : 'var(--white)',
              }}>
                <div style={{
                  padding: '10px 8px 0',
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--gray)',
                  borderRight: '1px solid var(--gray-light)',
                  fontFamily: 'var(--font-title)',
                }}>
                  {hourStr}
                </div>
                <div style={{ padding: '6px 10px' }}>
                  {hourEvs.map(ev => <AgendaEventCard key={ev.id} ev={ev} />)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── label for header ──────────────────────────
  function navLabel() {
    if (currentView === 'mes') {
      return currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    }
    if (currentView === 'semana') {
      const days = getWeekDays();
      return `${days[0].getDate()}/${days[0].getMonth()+1} – ${days[6].getDate()}/${days[6].getMonth()+1}`;
    }
    return currentDate.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
  }

  const totalEvents = AGENDA_EVENTS.length;

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Agenda"
          subtitle={`${totalEvents} compromissos em maio · clique num dia para ver detalhes`}
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

        {/* View toggle + nav */}
        <div className="row between" style={{ flexWrap: 'wrap', gap: 8 }}>
          {/* View selector */}
          <div className="row gap-1" style={{
            background: 'var(--offwhite)',
            border: '1px solid var(--gray-light)',
            borderRadius: 'var(--r-md)',
            padding: 4,
          }}>
            {[['mes', 'Mês'], ['semana', 'Semana'], ['dia', 'Dia']].map(([v, label]) => (
              <button
                key={v}
                onClick={() => setCurrentView(v)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--r-md)',
                  background: currentView === v ? 'var(--white)' : 'transparent',
                  border: currentView === v ? '1px solid var(--gray-light)' : '1px solid transparent',
                  color: currentView === v ? 'var(--pink-deep)' : 'var(--gray)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: currentView === v ? 600 : 400,
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.15s var(--easing)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="row gap-2" style={{ alignItems: 'center' }}>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <Icon name="chev-left" size={14} />
              Anterior
            </Button>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', minWidth: 120, textAlign: 'center', textTransform: 'capitalize' }}>
              {navLabel()}
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigate(1)}>
              Próxima
              <Icon name="chev-right" size={14} />
            </Button>
          </div>
        </div>

        {/* Legenda */}
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

        {/* View content */}
        {currentView === 'semana' && <WeekView />}
        {currentView === 'mes'    && <MonthView />}
        {currentView === 'dia'    && <DayView />}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════
   2. FINANCEIRO PAGE
   ═══════════════════════════════════════════════ */

const STATUS_FIN = {
  pago:     { label: 'Pago',     bg: '#E8F5ED', text: '#3A8C50', border: '#C3DEC9' },
  pendente: { label: 'Pendente', bg: '#FFF8E3', text: '#B5720A', border: '#FDDBB0' },
  atrasado: { label: 'Atrasado', bg: '#FFE9E9', text: '#C0392B', border: '#F5C0BE' },
};

const STATUS_CYCLE = ['pago', 'pendente', 'atrasado'];

function fmt(val) {
  return val.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function PieChart({ data, title }) {
  const total = data.reduce((s, d) => s + d.valor, 0);
  if (total === 0) return null;
  let angle = -Math.PI / 2;
  const cx = 70, cy = 70, r = 55, innerR = 30;

  const slices = data.map(d => {
    const slice_angle = (d.valor / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(angle + slice_angle);
    const y2 = cy + r * Math.sin(angle + slice_angle);
    const ix1 = cx + innerR * Math.cos(angle);
    const iy1 = cy + innerR * Math.sin(angle);
    const ix2 = cx + innerR * Math.cos(angle + slice_angle);
    const iy2 = cy + innerR * Math.sin(angle + slice_angle);
    const large = slice_angle > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${large} 0 ${ix1} ${iy1} Z`;
    const result = { ...d, path, color: d.color };
    angle += slice_angle;
    return result;
  });

  return (
    <div className="col gap-3">
      <div className="eyebrow">{title}</div>
      <div className="row gap-4" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={s.color} />
          ))}
          <text x="70" y="74" textAnchor="middle" style={{ fontSize: 11, fontFamily: 'Poppins', fill: '#2B2B2B', fontWeight: 600 }}>
            R$ {(total / 1000).toFixed(1)}k
          </text>
        </svg>
        <div className="col gap-2">
          {slices.map((s, i) => (
            <div key={i} className="row gap-2" style={{ alignItems: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.nome}</span>
              <span style={{ fontSize: 12, fontWeight: 600, marginLeft: 'auto' }}>R$ {s.valor.toLocaleString('pt-BR')}</span>
            </div>
          ))}
        </div>
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
  const [receitas, setReceitas] = useState([
    { id: 'r1', nome: 'Ótica Igor Giordano',     valor: 1200, status: 'pago', dia: 10, tipo: 'cliente' },
    { id: 'r2', nome: 'Pratique',                valor: 1200, status: 'pago', dia: 11, tipo: 'cliente' },
    { id: 'r3', nome: 'Jornal Cidades Minerais', valor: 1000, status: 'pago', dia: 15, tipo: 'cliente' },
    { id: 'r4', nome: 'Espaço Criar',            valor:  600, status: 'pago', dia:  5, tipo: 'cliente' },
    { id: 'r5', nome: 'Pensão',                  valor:  750, status: 'pago', dia:  1, tipo: 'pensao'  },
  ]);
  const [despesas, setDespesas] = useState([
    { id: 'd1', nome: 'Aluguel',         valor: 1200, status: 'pago', dia:  5, categoria: 'fixo'       },
    { id: 'd2', nome: 'Alimentação',     valor:  800, status: 'pago', dia:  0, categoria: 'alimentacao'},
    { id: 'd3', nome: 'Escola meninos',  valor:  600, status: 'pago', dia: 10, categoria: 'filhos'     },
    { id: 'd4', nome: 'Streaming/Apps',  valor:  150, status: 'pago', dia: 15, categoria: 'lazer'      },
  ]);

  const [showAddReceita, setShowAddReceita] = useState(false);
  const [showAddDespesa, setShowAddDespesa] = useState(false);
  const [newReceita, setNewReceita] = useState({ nome: '', valor: '', dia: '' });
  const [newDespesa, setNewDespesa] = useState({ nome: '', valor: '', dia: '', categoria: 'fixo' });

  // ── status cycling ─────────────────────────────
  function cycleStatus(list, setList, id) {
    setList(prev => prev.map(item => {
      if (item.id !== id) return item;
      const idx = STATUS_CYCLE.indexOf(item.status);
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
      return { ...item, status: next };
    }));
  }

  function togglePensao() {
    setReceitas(prev => prev.map(r =>
      r.tipo === 'pensao'
        ? { ...r, status: r.status === 'pago' ? 'pendente' : 'pago' }
        : r
    ));
  }

  // ── add entries ────────────────────────────────
  function addReceita() {
    if (!newReceita.nome || !newReceita.valor) return;
    const id = 'r' + Date.now();
    setReceitas(prev => [...prev, {
      id,
      nome: newReceita.nome,
      valor: parseFloat(newReceita.valor),
      dia: parseInt(newReceita.dia) || 0,
      status: 'pendente',
      tipo: 'cliente',
    }]);
    setNewReceita({ nome: '', valor: '', dia: '' });
    setShowAddReceita(false);
  }

  function addDespesa() {
    if (!newDespesa.nome || !newDespesa.valor) return;
    const id = 'd' + Date.now();
    setDespesas(prev => [...prev, {
      id,
      nome: newDespesa.nome,
      valor: parseFloat(newDespesa.valor),
      dia: parseInt(newDespesa.dia) || 0,
      status: 'pendente',
      categoria: newDespesa.categoria,
    }]);
    setNewDespesa({ nome: '', valor: '', dia: '', categoria: 'fixo' });
    setShowAddDespesa(false);
  }

  // ── summary calculations ───────────────────────
  const totalReceitas  = receitas.reduce((s, e) => s + e.valor, 0);
  const totalRecebido  = receitas.filter(e => e.status === 'pago').reduce((s, e) => s + e.valor, 0);
  const totalDespesas  = despesas.reduce((s, e) => s + e.valor, 0);
  const saldo          = totalRecebido - totalDespesas;
  const pendentes      = [...receitas, ...despesas].filter(e => e.status === 'pendente' || e.status === 'atrasado').length;

  // ── pie chart data ─────────────────────────────
  const receitasByTipo = Object.entries(
    receitas.reduce((acc, r) => {
      acc[r.tipo] = (acc[r.tipo] || 0) + r.valor;
      return acc;
    }, {})
  ).map(([tipo, valor]) => ({
    nome: tipo === 'cliente' ? 'Clientes' : tipo === 'pensao' ? 'Pensão' : tipo,
    valor,
    color: tipo === 'cliente' ? '#FF78B0' : '#A89AC9',
  }));

  const categoriaColors = {
    fixo: '#5A6F9C', alimentacao: '#E8A87C', filhos: '#7FB68C',
    lazer: '#A89AC9', saude: '#E8538D', outros: '#908F8E',
  };
  const despesasByCategoria = Object.entries(
    despesas.reduce((acc, d) => {
      acc[d.categoria] = (acc[d.categoria] || 0) + d.valor;
      return acc;
    }, {})
  ).map(([cat, valor]) => ({
    nome: cat.charAt(0).toUpperCase() + cat.slice(1),
    valor,
    color: categoriaColors[cat] || '#908F8E',
  }));

  // ── inline form style helpers ──────────────────
  const inputStyle = {
    padding: '7px 10px',
    borderRadius: 'var(--r-md)',
    border: '1px solid var(--gray-light)',
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--ink)',
    background: 'var(--white)',
    width: '100%',
    boxSizing: 'border-box',
  };

  function StatusBadge({ status, onClick }) {
    const cfg = STATUS_FIN[status] || STATUS_FIN.pendente;
    return (
      <span
        onClick={onClick}
        style={{
          display: 'inline-block',
          padding: '2px 9px',
          borderRadius: 'var(--r-pill)',
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          color: cfg.text,
          fontSize: 11,
          fontWeight: 600,
          fontFamily: 'var(--font-body)',
          cursor: onClick ? 'pointer' : 'default',
          userSelect: 'none',
          transition: 'opacity 0.15s',
        }}
        title={onClick ? 'Clique para mudar status' : undefined}
      >
        {cfg.label}
      </span>
    );
  }

  function ReceitaRow({ item }) {
    const isPensao = item.tipo === 'pensao';
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
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>{item.nome}</div>
          <div style={{ fontSize: 11, color: 'var(--gray)' }}>Dia {item.dia || '—'}</div>
        </div>
        {isPensao ? (
          <span
            onClick={togglePensao}
            style={{
              padding: '2px 10px',
              borderRadius: 'var(--r-pill)',
              background: item.status === 'pago' ? '#E8F5ED' : '#FFF8E3',
              border: `1px solid ${item.status === 'pago' ? '#C3DEC9' : '#FDDBB0'}`,
              color: item.status === 'pago' ? '#3A8C50' : '#B5720A',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {item.status === 'pago' ? 'Recebida ✓' : 'Não recebida'}
          </span>
        ) : (
          <StatusBadge status={item.status} onClick={() => cycleStatus(receitas, setReceitas, item.id)} />
        )}
        <div style={{
          fontFamily: 'var(--font-title)',
          fontWeight: 700,
          fontSize: 15,
          color: '#3A8C50',
          flexShrink: 0,
          minWidth: 80,
          textAlign: 'right',
        }}>
          + R$ {fmt(item.valor)}
        </div>
      </div>
    );
  }

  function DespesaRow({ item }) {
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
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>{item.nome}</div>
          <div style={{ fontSize: 11, color: 'var(--gray)' }}>
            {item.dia ? `Dia ${item.dia}` : '—'}
            {' · '}
            <span style={{ textTransform: 'capitalize' }}>{item.categoria}</span>
          </div>
        </div>
        <StatusBadge status={item.status} onClick={() => cycleStatus(despesas, setDespesas, item.id)} />
        <div style={{
          fontFamily: 'var(--font-title)',
          fontWeight: 700,
          fontSize: 15,
          color: '#C0392B',
          flexShrink: 0,
          minWidth: 80,
          textAlign: 'right',
        }}>
          − R$ {fmt(item.valor)}
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Financeiro"
          subtitle="Maio 2026 · visão geral de entradas e saídas"
        />

        {/* Summary cards */}
        <div className="row gap-4" style={{ flexWrap: 'wrap' }}>
          <SummaryCard
            label="Total recebido"
            value={`R$ ${fmt(totalRecebido)}`}
            sub={`de R$ ${fmt(totalReceitas)} esperado`}
            color="#3A8C50"
          />
          <SummaryCard
            label="Total despesas"
            value={`R$ ${fmt(totalDespesas)}`}
            sub={`${despesas.length} lançamentos`}
            color="#C0392B"
          />
          <SummaryCard
            label="Saldo"
            value={`R$ ${fmt(saldo)}`}
            sub="Recebido menos despesas"
            color={saldo >= 0 ? '#3A8C50' : '#C0392B'}
            highlight
          />
          <SummaryCard
            label="Pendentes"
            value={String(pendentes)}
            sub="Itens aguardando ou atrasados"
            color={pendentes > 0 ? '#B5720A' : '#3A8C50'}
          />
        </div>

        {/* Pie charts */}
        <Card>
          <CardBody>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-6)', alignItems: 'start' }}>
              <PieChart data={receitasByTipo} title="De onde vem" />
              <PieChart data={despesasByCategoria} title="Para onde vai" />
            </div>
          </CardBody>
        </Card>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-5)', alignItems: 'start' }}>
          {/* Receitas */}
          <Card>
            <CardHeader>
              <div className="row between">
                <div>
                  <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 700 }}>Entradas</h2>
                  <p className="tiny muted" style={{ marginTop: 2 }}>R$ {fmt(totalReceitas)} esperado</p>
                </div>
                <span style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 700, color: '#3A8C50' }}>
                  R$ {fmt(totalRecebido)}
                </span>
              </div>
            </CardHeader>
            <CardBody>
              <div className="col gap-2">
                {receitas.map(item => <ReceitaRow key={item.id} item={item} />)}
              </div>

              {/* Add receita form */}
              {showAddReceita ? (
                <div className="col gap-2" style={{ marginTop: 12, padding: '12px', background: 'var(--offwhite)', border: '1px solid var(--gray-light)', borderRadius: 'var(--r-md)' }}>
                  <input
                    style={inputStyle}
                    placeholder="Nome"
                    value={newReceita.nome}
                    onChange={e => setNewReceita(p => ({ ...p, nome: e.target.value }))}
                  />
                  <div className="row gap-2">
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="Valor (R$)"
                      type="number"
                      value={newReceita.valor}
                      onChange={e => setNewReceita(p => ({ ...p, valor: e.target.value }))}
                    />
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="Dia do mês"
                      type="number"
                      min="1"
                      max="31"
                      value={newReceita.dia}
                      onChange={e => setNewReceita(p => ({ ...p, dia: e.target.value }))}
                    />
                  </div>
                  <div className="row gap-2">
                    <Button variant="primary" onClick={addReceita}>Salvar</Button>
                    <Button variant="ghost" onClick={() => setShowAddReceita(false)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddReceita(true)}
                  style={{
                    marginTop: 10,
                    padding: '8px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px dashed var(--pink-soft)',
                    background: 'transparent',
                    color: 'var(--pink-deep)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  + Adicionar entrada
                </button>
              )}
            </CardBody>
          </Card>

          {/* Despesas */}
          <Card>
            <CardHeader>
              <div className="row between">
                <div>
                  <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 700 }}>Saídas</h2>
                  <p className="tiny muted" style={{ marginTop: 2 }}>{despesas.length} lançamentos</p>
                </div>
                <span style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 700, color: '#C0392B' }}>
                  R$ {fmt(totalDespesas)}
                </span>
              </div>
            </CardHeader>
            <CardBody>
              <div className="col gap-2">
                {despesas.map(item => <DespesaRow key={item.id} item={item} />)}
              </div>

              {/* Add despesa form */}
              {showAddDespesa ? (
                <div className="col gap-2" style={{ marginTop: 12, padding: '12px', background: 'var(--offwhite)', border: '1px solid var(--gray-light)', borderRadius: 'var(--r-md)' }}>
                  <input
                    style={inputStyle}
                    placeholder="Nome"
                    value={newDespesa.nome}
                    onChange={e => setNewDespesa(p => ({ ...p, nome: e.target.value }))}
                  />
                  <div className="row gap-2">
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="Valor (R$)"
                      type="number"
                      value={newDespesa.valor}
                      onChange={e => setNewDespesa(p => ({ ...p, valor: e.target.value }))}
                    />
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      placeholder="Dia do mês"
                      type="number"
                      min="1"
                      max="31"
                      value={newDespesa.dia}
                      onChange={e => setNewDespesa(p => ({ ...p, dia: e.target.value }))}
                    />
                  </div>
                  <select
                    style={inputStyle}
                    value={newDespesa.categoria}
                    onChange={e => setNewDespesa(p => ({ ...p, categoria: e.target.value }))}
                  >
                    {['fixo', 'alimentacao', 'filhos', 'lazer', 'saude', 'outros'].map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                  <div className="row gap-2">
                    <Button variant="primary" onClick={addDespesa}>Salvar</Button>
                    <Button variant="ghost" onClick={() => setShowAddDespesa(false)}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddDespesa(true)}
                  style={{
                    marginTop: 10,
                    padding: '8px 12px',
                    borderRadius: 'var(--r-md)',
                    border: '1px dashed var(--gray-light)',
                    background: 'transparent',
                    color: 'var(--gray)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: 12.5,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  + Adicionar saída
                </button>
              )}

              {/* Saldo box */}
              <div style={{
                marginTop: 'var(--s-4)',
                padding: 'var(--s-4)',
                background: saldo >= 0 ? '#E8F5ED' : '#FFE9E9',
                border: `1px solid ${saldo >= 0 ? '#C3DEC9' : '#F5C0BE'}`,
                borderRadius: 'var(--r-md)',
              }}>
                <div style={{ fontSize: 11, color: 'var(--gray)', marginBottom: 4 }}>Saldo do mês (recebido − saídas)</div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 700, color: saldo >= 0 ? '#3A8C50' : '#C0392B' }}>
                  R$ {fmt(saldo)}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Status legend */}
        <div className="row gap-3" style={{ flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11.5, color: 'var(--gray)', fontWeight: 500 }}>Status (clique para alternar):</span>
          {Object.entries(STATUS_FIN).map(([key, cfg]) => (
            <span key={key} style={{
              padding: '2px 10px',
              borderRadius: 'var(--r-pill)',
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              color: cfg.text,
              fontSize: 11,
              fontWeight: 600,
            }}>{cfg.label}</span>
          ))}
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
  { id: 1, nome: 'Social media (clientes)',  tipo: 'recorrente', minVal: 3600, maxVal: 4800, status: 'ativo',     icon: 'users',   mesPassado: 4000 },
  { id: 2, nome: 'UGC creator',             tipo: 'campanha',   minVal:  300, maxVal: 1500, status: 'ativo',     icon: 'mic',     mesPassado: 450  },
  { id: 3, nome: 'Afiliados',               tipo: 'passivo',    minVal:   50, maxVal:  300, status: 'ativo',     icon: 'trend',   mesPassado: 120  },
  { id: 4, nome: 'Ebooks e printables',     tipo: 'digital',    minVal:  100, maxVal:  600, status: 'potencial', icon: 'doc',     mesPassado: 0    },
  { id: 5, nome: 'Planners físicos',        tipo: 'produto',    minVal:  150, maxVal:  800, status: 'potencial', icon: 'book',    mesPassado: 0    },
  { id: 6, nome: 'Oficinas e cursos',       tipo: 'sazonal',    minVal:  200, maxVal: 1200, status: 'potencial', icon: 'sparkle', mesPassado: 180  },
  { id: 7, nome: 'Consultoria e branding',  tipo: 'projeto',    minVal:  300, maxVal: 1500, status: 'ativo',     icon: 'bulb',    mesPassado: 300  },
  { id: 8, nome: 'Comunidade',              tipo: 'futuro',     minVal:  400, maxVal: 2000, status: 'futuro',    icon: 'heart',   mesPassado: 0    },
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
  const [expandedSource, setExpandedSource] = useState(null);

  function gerarIdeia() {
    setIdeiaVis(true);
    setIdeiaIdx(prev => (prev + 1) % MON_IDEIAS.length);
  }

  function toggleSource(id) {
    setExpandedSource(prev => prev === id ? null : id);
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
          subtitle="Estratégia e potencial de receita — Maio 2026"
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
              const stCfg  = MON_STATUS_CFG[f.status];
              const tipoCor = MON_TIPO_CFG[f.tipo] || 'var(--gray)';
              const isOpen  = expandedSource === f.id;
              return (
                <div
                  key={f.id}
                  onClick={() => toggleSource(f.id)}
                  style={{
                    padding: 'var(--s-4)',
                    background: isOpen ? 'var(--offwhite-2)' : 'var(--white)',
                    border: `1px solid ${isOpen ? 'var(--pink-soft)' : 'var(--gray-light)'}`,
                    borderRadius: 'var(--r-md)',
                    cursor: 'pointer',
                    transition: 'all 0.18s var(--easing)',
                  }}
                >
                  {/* Collapsed: just icon + name */}
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{
                      width: 38, height: 38,
                      borderRadius: 'var(--r-md)',
                      background: isOpen ? 'var(--white)' : 'var(--offwhite)',
                      border: '1px solid var(--gray-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon name={f.icon} size={16} color={tipoCor} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', flex: 1 }}>{f.nome}</span>
                    <span style={{ fontSize: 12, color: 'var(--gray)', marginLeft: 'auto' }}>
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </div>

                  {/* Expanded details */}
                  {isOpen && (
                    <div className="col gap-2" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--gray-light)' }}>
                      <div className="row between">
                        <span style={{ fontSize: 11, color: tipoCor, fontWeight: 500, textTransform: 'capitalize' }}>{f.tipo}</span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--r-pill)',
                          background: stCfg.bg,
                          border: `1px solid ${stCfg.border}`,
                          color: stCfg.text,
                          fontSize: 10.5,
                          fontWeight: 600,
                        }}>{stCfg.label}</span>
                      </div>
                      <div className="row between">
                        <span style={{ fontSize: 12, color: 'var(--gray)' }}>Potencial</span>
                        <span style={{ fontFamily: 'var(--font-title)', fontSize: 13, fontWeight: 700, color: f.status === 'futuro' ? 'var(--gray)' : 'var(--ink)' }}>
                          R$ {f.minVal.toLocaleString('pt-BR')}–{f.maxVal.toLocaleString('pt-BR')}
                        </span>
                      </div>
                      {f.mesPassado > 0 && (
                        <div className="row between">
                          <span style={{ fontSize: 12, color: 'var(--gray)' }}>Mês passado</span>
                          <span style={{ fontFamily: 'var(--font-title)', fontSize: 13, fontWeight: 700, color: '#3A8C50' }}>
                            R$ {f.mesPassado.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
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
                <div style={{ fontSize: 12, color: 'var(--gray)' }}>Maio 2026</div>
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
   EXPORTS
   ═══════════════════════════════════════════════ */

Object.assign(window, {
  AgendaPage,
  FinanceiroPage,
  SobrePage,
  MonetizacaoPage,
});
