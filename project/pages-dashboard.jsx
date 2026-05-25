/* ──────────────────────────────────────────────
   pages/dashboard.jsx — main landing
   ────────────────────────────────────────────── */

function DayFocusCard({ energy }) {
  const e = window.ENERGY[energy];
  const today = new Date();
  const d = today.toLocaleDateString('pt-BR', { weekday: 'long' });
  const day = today.getDate();
  const month = today.toLocaleDateString('pt-BR', { month: 'long' });

  // Hour-aware greeting
  const h = today.getHours();
  const greet = h < 12 ? 'Bom dia, Lorenna' : h < 18 ? 'Boa tarde, Lorenna' : 'Boa noite, Lorenna';

  // Real counts
  const todayIdx_dc = (today.getDay() + 6) % 7;
  const todayStr_dc = today.toLocaleDateString('en-CA'); // YYYY-MM-DD
  const priorityCount = (window.DEMO_TASKS || []).filter(t =>
    t.status !== 'concluida' &&
    (t.prioridade === 'urgente' || t.prioridade === 'alta') &&
    (t.diario || (t.diasDaSemana && t.diasDaSemana.includes(todayIdx_dc)))
  ).length;
  const eventCount = (window.AGENDA_EVENTS || []).filter(ev => ev.date === todayStr_dc).length;

  return (
    <Card className="day-focus" style={{
      background: `var(--pink-tint)`,
      borderColor: 'var(--pink-soft)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Decorative scribble flower SVG in corner */}
      <svg width="180" height="180" viewBox="0 0 180 180" style={{ position:'absolute', right:-20, top:-30, opacity:.35 }}>
        <g stroke="var(--pink)" strokeWidth="1.3" fill="none" strokeLinecap="round">
          <path d="M90 30c-10 12-10 26 0 38s10 24 0 36"/>
          <path d="M60 60c12 10 26 10 38 0s24-10 36 0"/>
          <ellipse cx="90" cy="70" rx="12" ry="22" transform="rotate(0 90 70)"/>
          <ellipse cx="90" cy="70" rx="12" ry="22" transform="rotate(60 90 70)"/>
          <ellipse cx="90" cy="70" rx="12" ry="22" transform="rotate(120 90 70)"/>
          <circle cx="90" cy="70" r="5" fill="var(--pink)" stroke="none"/>
        </g>
      </svg>

      <CardBody style={{ padding: 'var(--s-6)', position: 'relative', zIndex: 1 }}>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-2)' }}>
          {d.charAt(0).toUpperCase() + d.slice(1)} · {day} de {month}
        </div>
        <h1 className="page-title" style={{ fontSize: 30, marginBottom: 6 }}>{greet}.</h1>
        <p className="secondary" style={{ marginBottom: 'var(--s-5)' }}>
          Hoje sua energia está <strong style={{ color: e.color, fontWeight: 600 }}>{e.label.toLowerCase()}</strong> — {e.desc.toLowerCase()}
        </p>

        <div className="row gap-4" style={{ flexWrap: 'wrap' }}>
          <div className="row gap-2" style={{
            padding: '6px 12px',
            background: 'var(--bg-surface)',
            borderRadius: 999, border: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 16 }}>{e.emoji}</span>
            <span style={{ fontSize: 14, fontWeight: 500 }}>{e.label}</span>
          </div>

          {priorityCount > 0 && (
            <div className="row gap-2" style={{
              padding: '6px 12px',
              background: 'var(--bg-surface)',
              borderRadius: 999, border: '1px solid var(--border)',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--pink)', flexShrink: 0 }}/>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{priorityCount} {priorityCount === 1 ? 'prioridade' : 'prioridades'} hoje</span>
            </div>
          )}

          {eventCount > 0 && (
            <div className="row gap-2" style={{
              padding: '6px 12px',
              background: 'var(--bg-surface)',
              borderRadius: 999, border: '1px solid var(--border)',
            }}>
              <Icon name="calendar" size={12} color="var(--text-muted)" />
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{eventCount} {eventCount === 1 ? 'compromisso' : 'compromissos'} hoje</span>
            </div>
          )}

        </div>
      </CardBody>
    </Card>
  );
}

/* ─── NÃO SEI AINDA Quiz ─── */
const MOOD_QUIZ = [
  {
    id: 'q1', pergunta: 'Como está seu corpo agora?',
    opcoes: [
      { label: 'Pesado e cansado',   energy: 'cansada'     },
      { label: 'Normal, ok',         energy: null          },
      { label: 'Leve e disposto',    energy: 'criativa'    },
    ],
  },
  {
    id: 'q2', pergunta: 'Seus pensamentos estão...',
    opcoes: [
      { label: 'Espalhados, muitos ao mesmo tempo', energy: 'cansada'     },
      { label: 'Moderados',                         energy: null          },
      { label: 'Claros e organizados',              energy: 'foco'        },
    ],
  },
  {
    id: 'q3', pergunta: 'O que mais te atrai agora?',
    opcoes: [
      { label: 'Descanso e silêncio',   energy: 'cansada'     },
      { label: 'Criar algo novo',        energy: 'criativa'    },
      { label: 'Resolver e organizar',   energy: 'operacional' },
      { label: 'Gravar e aparecer',      energy: 'gravacao'    },
    ],
  },
  {
    id: 'q4', pergunta: 'Você sente sobrecarga ou ansiedade?',
    opcoes: [
      { label: 'Sim, bastante',   energy: 'cansada'     },
      { label: 'Um pouco',        energy: 'cansada'     },
      { label: 'Não, estou bem',  energy: null          },
    ],
  },
  {
    id: 'q5', pergunta: 'Quanto foco você consegue manter agora?',
    opcoes: [
      { label: 'Quase nenhum',               energy: 'cansada'     },
      { label: 'Médio, consigo com pausas',   energy: 'operacional' },
      { label: 'Alto, consigo mergulhar',     energy: 'foco'        },
    ],
  },
  {
    id: 'q6', pergunta: 'Sua prioridade real agora é...',
    opcoes: [
      { label: 'Cuidar de mim ou dos filhos', energy: 'maternidade' },
      { label: 'Conectar com pessoas',         energy: 'social'      },
      { label: 'Criar e expressar',            energy: 'criativa'    },
      { label: 'Cumprir entregas urgentes',    energy: 'operacional' },
    ],
  },
];

function NaoSeiAindaQuiz({ onClose, onResult }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  function choose(energy) {
    const next = [...answers, energy];
    if (step < MOOD_QUIZ.length - 1) {
      setAnswers(next);
      setStep(step + 1);
    } else {
      // Calculate result
      const counts = {};
      next.forEach(e => { if (e) counts[e] = (counts[e] || 0) + 1; });
      const winner = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      const suggested = winner ? winner[0] : 'cansada';
      setResult(suggested);
    }
  }

  const q = MOOD_QUIZ[step];
  const e = result ? window.ENERGY[result] : null;

  return ReactDOM.createPortal(
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(43,34,34,0.45)',
      backdropFilter: 'blur(4px)',
      zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      overflowY: 'auto',
    }}>
      <div onClick={ev => ev.stopPropagation()} style={{
        width: 'min(520px, 94vw)',
        background: 'var(--white)',
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
      }}>
        <div style={{ height: 4, background: 'var(--pink)' }}/>
        <div style={{ padding: 'var(--s-6)' }}>
          {!result ? (
            <>
              <div className="row between" style={{ marginBottom: 'var(--s-5)' }}>
                <div>
                  <div className="eyebrow" style={{ color: 'var(--pink-deep)' }}>
                    Pergunta {step + 1} de {MOOD_QUIZ.length}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 19, fontWeight: 600, marginTop: 6, lineHeight: 1.3 }}>
                    {q.pergunta}
                  </h3>
                </div>
                <button className="btn ghost icon" onClick={onClose} style={{ flexShrink: 0, alignSelf: 'flex-start' }}>
                  <Icon name="x" size={14}/>
                </button>
              </div>
              {/* Progress bar */}
              <div style={{ height: 3, background: 'var(--gray-light)', borderRadius: 999, marginBottom: 'var(--s-5)', overflow: 'hidden' }}>
                <div style={{ width: `${((step) / MOOD_QUIZ.length) * 100}%`, height: '100%', background: 'var(--pink)', transition: 'width .3s' }}/>
              </div>
              <div className="col gap-3">
                {q.opcoes.map((op, i) => (
                  <button key={i} onClick={() => choose(op.energy)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: 'var(--r-md)',
                      border: '1.5px solid var(--gray-light)',
                      background: 'var(--offwhite)',
                      textAlign: 'left', cursor: 'pointer',
                      fontSize: 14, color: 'var(--ink-soft)',
                      fontFamily: 'var(--font-body)',
                      transition: 'all .15s var(--easing)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--pink)'; e.currentTarget.style.color = 'var(--ink)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--gray-light)'; e.currentTarget.style.color = 'var(--ink-soft)'; }}>
                    {op.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="col gap-5">
              <div className="row between" style={{ alignItems: 'flex-start' }}>
                <div>
                  <div className="eyebrow" style={{ color: 'var(--pink-deep)' }}>Resultado do quiz</div>
                  <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 600, marginTop: 6 }}>
                    {e.emoji} {e.label}
                  </h3>
                </div>
                <button className="btn ghost icon" onClick={onClose}><Icon name="x" size={14}/></button>
              </div>
              <div style={{ padding: 'var(--s-4)', background: 'var(--pink-tint)', borderRadius: 'var(--r-md)', border: '1px solid var(--pink-soft)' }}>
                <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{e.desc}</p>
              </div>
              <p className="small muted">O sistema vai adaptar suas tarefas e prioridades pra esse modo.</p>
              <div className="row gap-3">
                <Button variant="primary" onClick={() => { onResult(result); onClose(); }}>
                  <Icon name="check" size={13} color="white"/> Aplicar esse modo
                </Button>
                <Button variant="ghost" onClick={() => { setStep(0); setAnswers([]); setResult(null); }}>
                  Refazer quiz
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  , document.body);
}

function EnergySelector({ energy, setEnergy }) {
  const [showQuiz, setShowQuiz] = useState(false);
  return (
    <div>
      {showQuiz && (
        <NaoSeiAindaQuiz
          onClose={() => setShowQuiz(false)}
          onResult={(e) => { setEnergy(e); setShowQuiz(false); }}
        />
      )}
      <div className="row between" style={{ marginBottom: 'var(--s-3)' }}>
        <div>
          <div className="eyebrow">Sua energia agora</div>
          <p className="secondary" style={{ fontSize: 14, marginTop: 4 }}>
            O sistema adapta tarefas e prioridades ao seu estado.
          </p>
        </div>
      </div>
      <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
        {window.ENERGY_LIST.map(e => {
          const active = e.id === energy;
          return (
            <button key={e.id} onClick={() => setEnergy(e.id)}
              className="row gap-2"
              style={{
                padding: '8px 14px', borderRadius: 999, border: '1px solid',
                background: active ? `color-mix(in oklch, ${e.color} 14%, var(--bg-surface))` : 'var(--bg-surface)',
                borderColor: active ? e.color : 'var(--border)',
                color: active ? e.color : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: 14.5,
                fontWeight: active ? 600 : 500,
                transition: 'all .15s var(--easing)',
              }}>
              <span style={{ fontSize: 14 }}>{e.emoji}</span>
              {e.label}
            </button>
          );
        })}
        {/* NÃO SEI AINDA */}
        <button onClick={() => setShowQuiz(true)}
          className="row gap-2"
          style={{
            padding: '8px 14px', borderRadius: 999,
            border: '1.5px dashed var(--pink-soft)',
            background: 'var(--pink-tint)',
            color: 'var(--pink-deep)',
            cursor: 'pointer', fontSize: 14.5, fontWeight: 500,
            transition: 'all .15s var(--easing)',
          }}>
          <span style={{ fontSize: 14 }}>🤍</span>
          Não sei ainda
        </button>
      </div>
    </div>
  );
}

function TaskRow({ task, dense, large, onDelete, onUpdate, showMeta }) {
  const [expanded, setExpanded] = useState(false);
  const [concluida, setConcluida] = useState(task.status === 'concluida');
  const [microDone, setMicroDone] = useState(() => Object.fromEntries((task.micro || []).map(m => [m.id, m.done])));
  const [editando, setEditando] = useState(false);
  const [tituloEdit, setTituloEdit] = useState(task.titulo);
  const total = (task.micro || []).length;
  const done = Object.values(microDone).filter(Boolean).length;
  const totalMin = (task.micro || []).reduce((a, m) => a + (m.min || 0), 0);

  const accentMap = { urgente: '#fe7dae', alta: '#ffe1bd', media: '#bce1f6', baixa: '#f1e18d' };
  const bgMap = {
    urgente: 'color-mix(in oklch, #fe7dae 11%, white)',
    alta:    'color-mix(in oklch, #ffe1bd 18%, white)',
    media:   'color-mix(in oklch, #bce1f6 14%, white)',
    baixa:   'color-mix(in oklch, #f1e18d 13%, white)',
  };
  const accent = accentMap[task.prioridade] || '#fec9df';
  const bg = bgMap[task.prioridade] || 'color-mix(in oklch, #fec9df 11%, white)';
  const D = 'rgba(32,30,31,';
  const DIAS_LABELS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const todayIdx = window.todayBrasilia();
  const isUrgente = task.prioridade === 'urgente';
  const hasExpandable = total > 0 || onDelete || (task.diasDaSemana || []).length > 0 || (task.energia || []).length > 0 || task.ferramentasIA;

  function salvarEdicao() {
    if (tituloEdit.trim() && tituloEdit.trim() !== task.titulo) {
      task.titulo = tituloEdit.trim();
      onUpdate && onUpdate(task);
      showToast('Tarefa atualizada');
    }
    setEditando(false);
  }

  /* Subtitle: client · today/deadline */
  const subtitleParts = [];
  if (task.cliente) subtitleParts.push({ text: task.cliente, weight: 500, color: `${D}0.65)` });
  if (showMeta && (task.diasDaSemana || []).includes(todayIdx)) subtitleParts.push({ text: 'hoje', weight: 600, color: accent });
  else if (showMeta && task.diario) subtitleParts.push({ text: 'diário', weight: 400, color: `${D}0.45)` });

  return (
    <div style={{
      background: bg,
      borderRadius: 12,
      outline: `1px solid color-mix(in oklch, ${accent} 22%, transparent)`,
      overflow: 'hidden',
    }}>
      {/* ── Collapsed row ── */}
      <div style={{ padding: dense ? '9px 12px' : '12px 14px', display: 'flex', gap: 11, alignItems: 'flex-start' }}>

        {/* Checkbox — boxShadow instead of border */}
        <div onClick={() => {
          const next = !concluida;
          setConcluida(next);
          window.DB && window.DB.updateTarefaStatus && window.DB.updateTarefaStatus(task.id, next ? 'concluida' : 'pendente');
          showToast(concluida ? 'Tarefa reaberta' : 'Tarefa concluída! ✓');
        }} style={{
          width: 20, height: 20, borderRadius: 999, flexShrink: 0, marginTop: 1,
          background: concluida ? accent : 'rgba(255,255,255,0.85)',
          boxShadow: `inset 0 0 0 1.5px ${concluida ? accent : `${D}0.2)`}`,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all .15s',
        }}>
          {concluida && <Icon name="check" size={11} color="white"/>}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {editando ? (
            <input className="input" autoFocus value={tituloEdit}
              onChange={e => setTituloEdit(e.target.value)}
              onBlur={salvarEdicao}
              onKeyDown={e => { if (e.key === 'Enter') salvarEdicao(); if (e.key === 'Escape') setEditando(false); }}
              style={{ fontSize: 15, fontWeight: 500, background: 'rgba(255,255,255,0.7)', color: '#201e1f', borderRadius: 7, padding: '3px 8px', width: '100%', boxShadow: `inset 0 0 0 1px ${D}0.12)` }}
            />
          ) : (
            <div style={{
              fontSize: 15, fontWeight: 500, lineHeight: 1.4,
              color: concluida ? `${D}0.28)` : '#201e1f',
              textDecoration: concluida ? 'line-through' : 'none',
            }}>
              {task.hora && <span style={{ fontSize: 13, fontWeight: 400, color: `${D}0.38)`, marginRight: 6 }}>{task.hora}</span>}
              {task.titulo}
            </div>
          )}

          {/* Subtitle */}
          {subtitleParts.length > 0 && !editando && (
            <div style={{ marginTop: 3, display: 'flex', flexWrap: 'wrap', gap: '0 3px', alignItems: 'center', lineHeight: 1.5 }}>
              {subtitleParts.map((p, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ fontSize: 12, color: `${D}0.22)` }}>·</span>}
                  <span style={{ fontSize: 13, fontWeight: p.weight, color: p.color }}>{p.text}</span>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Progress bar — always visible if has microsteps */}
          {total > 0 && (
            <div style={{ marginTop: 8, height: 2, borderRadius: 999, background: `${D}0.08)`, overflow: 'hidden' }}>
              <div style={{ width: `${(done / total) * 100}%`, height: '100%', background: accent, borderRadius: 999, transition: 'width .3s' }}/>
            </div>
          )}
        </div>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, marginTop: 1 }}>
          {total > 0 && (
            <span style={{ fontSize: 12, color: `${D}0.32)`, fontWeight: 500, marginRight: 2 }}>{done}/{total}</span>
          )}
          {hasExpandable && (
            <button onClick={() => setExpanded(!expanded)} style={{
              width: 24, height: 24, borderRadius: 6, background: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0.28, border: 'none', transition: 'opacity .15s',
            }}>
              <Icon name={expanded ? 'chev-down' : 'chev-right'} size={13} color="#201e1f"/>
            </button>
          )}
        </div>
      </div>

      {/* ── Expanded section ── */}
      {expanded && (
        <div style={{ padding: '2px 14px 14px 45px', background: `${D}0.018)` }}>

          {/* Days + energia */}
          {showMeta && ((task.diasDaSemana || []).length > 0 || (task.energia || []).length > 0 || task.diario) && (
            <div style={{ fontSize: 13, color: `${D}0.45)`, marginBottom: 10, display: 'flex', flexWrap: 'wrap', gap: '0 6px', alignItems: 'center' }}>
              {task.diario && <span>Diário</span>}
              {(task.diasDaSemana || []).map(d => (
                <span key={d} style={{ fontWeight: d === todayIdx ? 700 : 400, color: d === todayIdx ? accent : `${D}0.45)` }}>{DIAS_LABELS[d]}</span>
              ))}
              {(task.energia || []).map(e => { const ec = window.ENERGY[e]; return ec ? <span key={e}>{ec.emoji} {ec.label}</span> : null; })}
            </div>
          )}

          {/* Microsteps */}
          {total > 0 && (
            <div className="col gap-0" style={{ marginBottom: 8 }}>
              {(task.micro || []).map(m => (
                <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', padding: '5px 0' }}
                  onClick={() => setMicroDone(prev => ({ ...prev, [m.id]: !prev[m.id] }))}>
                  <div style={{
                    width: 15, height: 15, borderRadius: 999, flexShrink: 0, marginTop: 1,
                    background: microDone[m.id] ? `${D}0.1)` : 'rgba(255,255,255,0.75)',
                    boxShadow: `inset 0 0 0 1.5px ${microDone[m.id] ? `${D}0.35)` : `${D}0.17)`}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s',
                  }}>
                    {microDone[m.id] && <Icon name="check" size={9} color="#201e1f"/>}
                  </div>
                  <span style={{ fontSize: 14, flex: 1, color: microDone[m.id] ? `${D}0.28)` : '#201e1f', textDecoration: microDone[m.id] ? 'line-through' : 'none' }}>{m.desc}</span>
                  {m.min && <span style={{ fontSize: 12, color: `${D}0.32)` }}>{m.min}min</span>}
                </div>
              ))}
              {totalMin > 0 && <div style={{ fontSize: 12, color: `${D}0.3)`, paddingTop: 3 }}>Total estimado: {totalMin}min</div>}
            </div>
          )}

          {/* AI tools */}
          {task.ferramentasIA && task.ferramentasIA.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: `${D}0.3)`, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>IA útil</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {task.ferramentasIA.map((f, i) => <span key={i} style={{ fontSize: 13, color: `${D}0.5)` }}>{f}</span>)}
              </div>
            </div>
          )}

          {/* Actions — text only */}
          <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
            <button onClick={() => { setTituloEdit(task.titulo); setEditando(true); setExpanded(false); }}
              style={{ fontSize: 13, color: `${D}0.38)`, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)' }}>
              Editar
            </button>
            {onDelete && (
              <button onClick={ev => { ev.stopPropagation(); onDelete(task.id); }}
                style={{ fontSize: 13, color: `${D}0.3)`, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)' }}>
                Remover
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NextActionCard({ task }) {
  const next = task.micro.find(m => !m.done);
  if (!next) return null;
  return (
    <Card variant="accent" className="next-action">
      <CardBody>
        <div className="row gap-2" style={{ marginBottom: 'var(--s-2)' }}>
          <Icon name="zap" size={14} color="var(--pink-deep)" />
          <span className="eyebrow" style={{ color: 'var(--pink-deep)' }}>Próxima micro-ação</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          {next.desc}
        </h3>
        <p className="small muted" style={{ marginTop: 6 }}>
          De <strong style={{ color: 'var(--text-secondary)' }}>{task.titulo}</strong>
          {next.min && <> · {next.min}min</>}
        </p>
        <div className="row gap-2" style={{ marginTop: 'var(--s-4)' }}>
          <Button variant="primary" size="sm" onClick={() => showToast('Começando...')}>
            <Icon name="play" size={13} color="white"/> Começar agora
          </Button>
          <Button variant="ghost" size="sm" onClick={() => showToast('Pulado pra próxima')}>Pular</Button>
        </div>
      </CardBody>
    </Card>
  );
}

const WEEK_ENERGY = ['criativa', 'operacional', 'foco', 'operacional', 'gravacao', 'maternidade', 'cansada'];

function WeekView() {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const today = window.todayBrasilia();

  const taskCounts = days.map((_, i) =>
    (window.DEMO_TASKS || []).filter(t =>
      t.status !== 'concluida' && (
        t.diario ||
        t.prioridade === 'urgente' ||
        (t.diasDaSemana && t.diasDaSemana.includes(i))
      )
    ).length
  );
  const maxCount = Math.max(...taskCounts, 1);

  return (
    <div>
      <div className="row between" style={{ marginBottom: 'var(--s-4)' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 700 }}>Visão da semana</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
            Tarefas reais por dia · energia dominante · carga de trabalho
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {days.map((d, i) => {
          const isToday = i === today;
          const col = ROTINA_PALETTE[i];
          const cfg = window.ENERGY[WEEK_ENERGY[i]];
          const count = taskCounts[i];
          const barPct = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={d} style={{
              borderRadius: 'var(--r-md)',
              border: `2px solid ${isToday ? col : 'var(--border)'}`,
              background: isToday ? col : 'var(--bg-elevated)',
              padding: '14px 10px 18px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              position: 'relative', overflow: 'hidden',
              transition: 'transform .15s',
              cursor: 'default',
            }}>
              {/* Day label */}
              <div style={{
                fontSize: 14, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase',
                color: isToday ? '#fffcfa' : 'var(--text-muted)',
              }}>{d}</div>

              {/* Energy emoji */}
              <div style={{ fontSize: 24, lineHeight: 1 }}>{cfg.emoji}</div>

              {/* Task count */}
              <div style={{
                fontFamily: 'var(--font-title)', fontSize: 32, fontWeight: 800, lineHeight: 1,
                color: isToday ? '#fffcfa' : col,
              }}>{count}</div>
              <div style={{
                fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.04em',
                color: isToday ? 'rgba(255,252,250,.7)' : 'var(--text-muted)',
              }}>{count === 1 ? 'tarefa' : 'tarefas'}</div>

              {/* Workload bar */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 5,
                background: isToday ? 'rgba(32,30,31,.1)' : 'var(--border)',
              }}>
                <div style={{
                  height: '100%', width: `${barPct}%`,
                  background: isToday ? 'rgba(32,30,31,.25)' : col,
                  transition: 'width .4s ease',
                }}/>
              </div>
            </div>
          );
        })}
      </div>

      {/* Energy legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'var(--s-4)' }}>
        {[...new Set(WEEK_ENERGY)].map(eId => {
          const cfg = window.ENERGY[eId];
          return (
            <div key={eId} className="row gap-2" style={{
              padding: '5px 14px', borderRadius: 999, fontSize: 14,
              background: `color-mix(in oklch, ${cfg.color} 10%, var(--bg-surface))`,
              color: 'var(--text-secondary)', fontWeight: 500,
            }}>
              <span>{cfg.emoji}</span> {cfg.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RoutinesWidget() {
  const [openId, setOpenId] = useState('manha');
  const [done, setDone] = useState({});

  function toggle(routineId, stepId) {
    const key = `${routineId}-${stepId}`;
    setDone(prev => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="col gap-3">
      <div className="row between">
        <div>
          <div className="eyebrow">Rotinas âncora</div>
          <p className="tiny muted" style={{ marginTop: 4 }}>Sequência que te traz de volta quando perde o fio.</p>
        </div>
      </div>
      <div className="col gap-2">
        {window.ROUTINES.map(r => {
          const isOpen = openId === r.id;
          const total = r.passos.length;
          const doneCount = r.passos.filter(p => done[`${r.id}-${p.id}`]).length;
          return (
            <div key={r.id} style={{
              background: 'var(--offwhite)',
              borderRadius: 15,
              overflow: 'hidden',
            }}>
              <button onClick={() => setOpenId(isOpen ? null : r.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  width: '100%', padding: '12px 14px',
                  background: 'transparent', cursor: 'pointer', textAlign: 'left',
                  fontFamily: 'var(--font-body)',
                }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{r.icone}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{r.titulo}</div>
                  <div className="tiny muted" style={{ marginTop: 2 }}>{r.horario} · {doneCount}/{total}</div>
                </div>
                <Icon name={isOpen ? 'chev-down' : 'chev-right'} size={14} color="var(--gray)"/>
              </button>
              {isOpen && (
                <div className="col gap-2" style={{ padding: '0 14px 14px' }}>
                  <div style={{ height: 12 }}/>
                  {r.passos.map(p => {
                    const isDone = !!done[`${r.id}-${p.id}`];
                    return (
                      <button key={p.id} onClick={() => toggle(r.id, p.id)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 10,
                          padding: '8px 10px', borderRadius: 12,
                          background: isDone ? 'var(--white)' : 'transparent',
                          textAlign: 'left', cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          width: '100%',
                        }}>
                        <div style={{
                          width: 16, height: 16, borderRadius: 5,
                          border: `1.5px solid ${isDone ? r.cor : 'var(--gray)'}`,
                          background: isDone ? r.cor : 'transparent',
                          flexShrink: 0, marginTop: 2,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>{isDone && <Icon name="check" size={10} color="white"/>}</div>
                        <span style={{
                          flex: 1,
                          fontSize: 14.5,
                          color: isDone ? 'var(--gray)' : 'var(--ink)',
                          textDecoration: isDone ? 'line-through' : 'none',
                        }}>{p.desc}</span>
                        {p.min && <span className="tiny muted" style={{ flexShrink: 0 }}>~{p.min}min</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PequenasVitorias() {
  const completedTasks = window.DEMO_TASKS.filter(t => t.status === 'concluida');
  const [custom, setCustom] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lorenna_vitorias') || '[]'); } catch { return []; }
  });
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const [showing, setShowing] = useState(4);

  const all = [
    ...custom,
    ...completedTasks.map(t => ({ icon: '✅', text: t.titulo, id: t.id })),
  ];

  function addVitoria() {
    if (!newText.trim()) return;
    const v = { icon: '🎯', text: newText.trim(), id: Date.now() };
    const next = [v, ...custom];
    setCustom(next);
    localStorage.setItem('lorenna_vitorias', JSON.stringify(next));
    setNewText('');
    setAdding(false);
    showToast('Vitória registrada! 🎉');
  }

  return (
    <div>
      <div className="row between" style={{ marginBottom: 'var(--s-3)' }}>
        <div>
          <div className="eyebrow" style={{ color: 'var(--text-secondary)' }}>🏆 Pequenas vitórias</div>
          <p className="tiny muted" style={{ marginTop: 4 }}>Tudo que você fez importa. Mesmo o que parece pequeno.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setAdding(a => !a)}>
          <Icon name="plus" size={12}/>
        </Button>
      </div>

      {adding && (
        <div className="row gap-2" style={{ marginBottom: 'var(--s-3)' }}>
          <input
            className="input" autoFocus
            style={{ flex: 1, fontSize: 14 }}
            placeholder="Qual foi sua vitória de hoje?"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addVitoria(); if (e.key === 'Escape') { setAdding(false); setNewText(''); } }}
          />
          <Button variant="primary" size="sm" onClick={addVitoria} disabled={!newText.trim()}>
            <Icon name="check" size={12} color="white"/>
          </Button>
        </div>
      )}

      {all.length === 0 ? (
        <div className="center muted" style={{ padding: 'var(--s-5) 0', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 24 }}>🌱</span>
          <p className="tiny">Nenhuma tarefa concluída ainda. Vai lá!</p>
        </div>
      ) : (
        <>
          <div className="col gap-2">
            {all.slice(0, showing).map((v, i) => (
              <div key={v.id || i} className="row gap-3" style={{
                padding: '10px 14px',
                background: 'color-mix(in oklch, #f1e18d 15%, var(--bg-surface))',
                border: '1px solid color-mix(in oklch, #f1e18d 30%, transparent)',
                borderRadius: 'var(--r-md)',
              }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{v.icon}</span>
                <span style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.4 }}>{v.text}</span>
              </div>
            ))}
          </div>
          {showing < all.length && (
            <button onClick={() => setShowing(all.length)}
              style={{ marginTop: 'var(--s-3)', fontSize: 14, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              Ver todas ({all.length}) →
            </button>
          )}
        </>
      )}
    </div>
  );
}

const ROTINA_SEMANAL = [
  { dia: 'Seg', temas: ['📋 Burocracias', '✍️ Roteiros', '📝 Blog', '🔎 Novos contratos'] },
  { dia: 'Ter', temas: ['📸 Fotos ext.', '🎬 Vídeos ext.'] },
  { dia: 'Qua', temas: ['💌 Newsletter', '🎬 Gravação', '✂️ Edição'] },
  { dia: 'Qui', temas: ['📸 Fotos ext.', '🎬 Vídeos ext.'] },
  { dia: 'Sex', temas: ['✂️ Edição', '⏳ Pendências'] },
  { dia: 'Sáb', temas: ['🎬 Vlog família', '🌿 Descanso'] },
  { dia: 'Dom', temas: ['🌿 Descanso'] },
];

const ROTINA_PALETTE = ['#bce1f6', '#f0bff8', '#fe7dae', '#f1e18d', '#ffe1bd', '#fec9df', '#fffcfa'];

function RotinaSemanalWidget() {
  const today = window.todayBrasilia();
  const [selected, setSelected] = React.useState(today);
  const r = ROTINA_SEMANAL[selected];
  const col = ROTINA_PALETTE[selected];
  const isToday = selected === today;

  return (
    <Card>
      <CardBody>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>Rotina da semana</div>

        {/* Dias clicáveis */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--s-4)' }}>
          {ROTINA_SEMANAL.map((d, i) => {
            const isActiveDay = i === today;
            const isSel = i === selected;
            const c = ROTINA_PALETTE[i];
            return (
              <div key={d.dia} onClick={() => setSelected(i)}
                style={{ flex: 1, textAlign: 'center', cursor: 'pointer' }}>
                <div style={{
                  height: 6, borderRadius: 99, marginBottom: 6,
                  background: isSel ? c : `color-mix(in oklch, ${c} 35%, var(--bg-elevated))`,
                  transition: 'background .15s',
                }} />
                <div style={{
                  fontSize: 14, fontWeight: isActiveDay ? 700 : 400,
                  color: isSel ? '#201e1f' : 'var(--text-muted)',
                  transition: 'color .15s',
                }}>{d.dia}</div>
              </div>
            );
          })}
        </div>

        {/* Bloco do dia selecionado */}
        <div style={{
          background: `color-mix(in oklch, ${col} 30%, white)`,
          borderRadius: 'var(--r-md)',
          padding: 'var(--s-4)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#201e1f', marginBottom: 10 }}>
            {isToday ? 'Hoje' : r.dia} · {r.dia}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {r.temas.map((t, j) => (
              <div key={j} style={{
                fontSize: 14, color: '#201e1f',
                background: `color-mix(in oklch, ${col} 45%, white)`,
                padding: '5px 12px', borderRadius: 999,
                fontWeight: 500,
              }}>{t}</div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function MiniCalendarWidget() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = (firstDay.getDay() + 6) % 7;
  const monthName = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const pad = n => String(n).padStart(2, '0');
  const events = window.AGENDA_EVENTS || [];

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d);

  function hasEvent(d) {
    if (!d) return false;
    const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
    return events.some(e => e.date === dateStr);
  }

  const todayStr = `${year}-${pad(month + 1)}-${pad(today.getDate())}`;
  const todayEvents = events.filter(e => e.date === todayStr);

  return (
    <div>
      <div className="row between" style={{ marginBottom: 'var(--s-3)' }}>
        <div className="eyebrow">{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, textAlign: 'center' }}>
        {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
          <div key={i} style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', paddingBottom: 4 }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i}/>;
          const isToday = d === today.getDate();
          const hasEv = hasEvent(d);
          return (
            <div key={i} style={{
              aspectRatio: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 1, borderRadius: 6,
              background: isToday ? 'var(--pink)' : 'transparent',
              color: isToday ? 'white' : 'var(--text-primary)',
              fontSize: 14, fontWeight: isToday ? 700 : 400, position: 'relative',
            }}>
              {d}
              {hasEv && !isToday && (
                <div style={{ width: 3, height: 3, borderRadius: 999, background: 'var(--pink)', position: 'absolute', bottom: 2 }}/>
              )}
            </div>
          );
        })}
      </div>
      {todayEvents.length > 0 && (
        <div style={{ marginTop: 'var(--s-3)', paddingTop: 'var(--s-2)' }}>
          <div className="eyebrow" style={{ color: 'var(--pink-deep)', marginBottom: 6 }}>Hoje</div>
          <div className="col gap-1">
            {todayEvents.map(ev => (
              <div key={ev.id} className="row gap-2">
                <span className="tiny muted" style={{ flexShrink: 0 }}>{ev.hora}</span>
                <span style={{ fontSize: 14, lineHeight: 1.3 }}>{ev.titulo}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const BR_HOLIDAYS = [
  { date: '2026-05-10', nome: 'Dia das Mães',          emoji: '💐', campanha: true,
    clientes: ['Ótica Igor Giordano', 'Espaço Criar', 'Pratique'],
    sugestoes: ['Post emocional sobre maternidade', 'Oferta especial Dia das Mães', 'Reel bastidores com os filhos', 'Campanha de presente'] },
  { date: '2026-06-11', nome: 'Copa do Mundo — Início', emoji: '⚽', campanha: true,
    clientes: ['Ótica Igor Giordano', 'Pratique', '@lorennagn'],
    sugestoes: ['Campanha Copa com visual verde+amarelo', 'Reel "assista em grande estilo"', 'Promoção temática durante torneio', 'Stories reação aos jogos'] },
  { date: '2026-06-12', nome: 'Dia dos Namorados',      emoji: '💕', campanha: true,
    clientes: ['Ótica Igor Giordano', 'Pratique'],
    sugestoes: ['Campanha o presente perfeito', 'Post casais + produto', 'Stories românticos', 'Oferta especial dupla'] },
  { date: '2026-06-13', nome: 'Corpus Christi',          emoji: '✝️', campanha: false, clientes: [], sugestoes: [] },
  { date: '2026-06-24', nome: 'São João',                emoji: '🎉', campanha: true,
    clientes: ['@lorennagn', 'Espaço Criar'],
    sugestoes: ['Content de festa junina', 'Receitas típicas', 'Look junino', 'Atividades para crianças'] },
  { date: '2026-08-09', nome: 'Dia dos Pais',            emoji: '👔', campanha: true,
    clientes: ['Ótica Igor Giordano', 'Pratique'],
    sugestoes: ['Campanha presente para o pai', 'Armação masculina destaque', 'Post emocional paternidade'] },
  { date: '2026-09-07', nome: 'Independência do Brasil', emoji: '🇧🇷', campanha: true,
    clientes: ['@lorennagn', 'Ótica Igor Giordano'],
    sugestoes: ['Post patriótico com identidade visual', 'Campanha verde e amarelo'] },
  { date: '2026-10-12', nome: 'Dia das Crianças',        emoji: '🧒', campanha: true,
    clientes: ['Espaço Criar', '@lorennagn'],
    sugestoes: ['Conteúdo sobre educação criativa', 'Post com os filhos', 'Campanha Espaço Criar', 'Reel infantil'] },
  { date: '2026-11-27', nome: 'Black Friday',             emoji: '🛍️', campanha: true,
    clientes: ['Ótica Igor Giordano', 'Pratique', 'Agência Logue'],
    sugestoes: ['Oferta Black Friday exclusiva', 'Campanha desconto especial', 'Stories contagem regressiva', 'E-mail marketing Black'] },
  { date: '2026-12-25', nome: 'Natal',                   emoji: '🎄', campanha: true,
    clientes: ['Ótica Igor Giordano', 'Pratique', 'Espaço Criar', '@lorennagn'],
    sugestoes: ['Campanha de Natal', 'Post emocional fim de ano', 'Oferta presente especial', 'Vídeo making of natal'] },
  { date: '2026-12-31', nome: 'Réveillon',               emoji: '🎆', campanha: true,
    clientes: ['@lorennagn', 'Ótica Igor Giordano'],
    sugestoes: ['Post retrospectiva do ano', 'Mensagem de virada', 'Reel highlights 2026'] },
  { date: '2027-05-09', nome: 'Dia das Mães',            emoji: '💐', campanha: true,
    clientes: ['Ótica Igor Giordano', 'Espaço Criar', 'Pratique'],
    sugestoes: ['Post emocional sobre maternidade', 'Oferta especial Dia das Mães', 'Reel bastidores com os filhos'] },
];

function HolidayAlertBanner() {
  const today = new Date();
  const in30 = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const upcoming = BR_HOLIDAYS.filter(h => {
    if (!h.campanha) return false;
    const [y, m, d] = h.date.split('-').map(Number);
    const hDate = new Date(y, m - 1, d);
    return hDate > today && hDate <= in30;
  });
  if (upcoming.length === 0) return null;
  return (
    <div className="col gap-2">
      {upcoming.map(h => {
        const [y, m, d] = h.date.split('-').map(Number);
        const daysLeft = Math.ceil((new Date(y, m - 1, d) - today) / (24 * 60 * 60 * 1000));
        return (
          <div key={h.date} className="row gap-3" style={{
            padding: '12px 16px',
            background: '#fffcfa',
            borderRadius: 'var(--r-md)',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{h.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: '#201e1f' }}>
                {h.nome} — em {daysLeft} dia{daysLeft !== 1 ? 's' : ''}! Hora de planejar.
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 2 }}>
                Sugestão: {h.sugestoes[0]}
              </div>
            </div>
            <div style={{
              fontSize: 15, fontWeight: 700, color: '#201e1f',
              background: '#ffe1bd', padding: '5px 12px',
              borderRadius: 999, flexShrink: 0,
            }}>
              {daysLeft}d
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FullCalendarWidget() {
  const todayReal = new Date();
  const [viewDate, setViewDate] = useState(() => new Date(todayReal.getFullYear(), todayReal.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const lastDay  = new Date(year, month + 1, 0);
  const startDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const pad = n => String(n).padStart(2, '0');
  const monthName = viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const todayStr  = `${todayReal.getFullYear()}-${pad(todayReal.getMonth() + 1)}-${pad(todayReal.getDate())}`;
  const events    = window.AGENDA_EVENTS || [];
  const typeColors = window.AGENDA_TYPE_COLORS || {};

  function dateStr(d) { return `${year}-${pad(month + 1)}-${pad(d)}`; }
  function eventsForDay(d) { const ds = dateStr(d); return events.filter(e => e.date === ds); }
  function holidayForDay(d) { const ds = dateStr(d); return BR_HOLIDAYS.find(h => h.date === ds) || null; }

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const selDayEvents = selectedDay ? eventsForDay(selectedDay) : [];
  const selHoliday   = selectedDay ? holidayForDay(selectedDay) : null;

  return (
    <Card>
      <CardBody>
        <div className="row between" style={{ marginBottom: 'var(--s-4)' }}>
          <div>
            <div className="eyebrow">Calendário</div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 20, fontWeight: 700, marginTop: 2 }}>
              {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
            </h2>
          </div>
          <div className="row gap-2">
            <Button variant="ghost" size="sm" onClick={() => { setViewDate(new Date(year, month - 1, 1)); setSelectedDay(null); }}>
              <Icon name="chev-left" size={14}/>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setViewDate(new Date(todayReal.getFullYear(), todayReal.getMonth(), 1)); setSelectedDay(null); }}>
              Hoje
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { setViewDate(new Date(year, month + 1, 1)); setSelectedDay(null); }}>
              <Icon name="chev-right" size={14}/>
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="row gap-4" style={{ flexWrap: 'wrap', marginBottom: 'var(--s-4)' }}>
          {Object.entries(typeColors).map(([tipo, cfg]) => (
            <div key={tipo} className="row gap-2">
              <div style={{ width: 10, height: 10, borderRadius: 999, background: cfg.dot, flexShrink: 0, marginTop: 2 }}/>
              <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                {tipo === 'filho' ? 'Filhos' : tipo === 'gravacao' ? 'Gravação' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </span>
            </div>
          ))}
          <div className="row gap-2">
            <div style={{ width: 8, height: 8, borderRadius: 999, background: '#ffe1bd', border: '1px solid #201e1f', flexShrink: 0, marginTop: 3 }}/>
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Datas comemorativas</span>
          </div>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
            <div key={d} style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', paddingBottom: 6 }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} style={{ minHeight: 100 }}/>;
            const ds = dateStr(d);
            const isToday   = ds === todayStr;
            const dayEvs    = eventsForDay(d);
            const holiday   = holidayForDay(d);
            const isSelected = selectedDay === d;
            return (
              <div key={i} onClick={() => setSelectedDay(isSelected ? null : d)}
                style={{
                  minHeight: 100, padding: '8px',
                  borderRadius: 'var(--r-md)',
                  border: `2px solid ${isToday ? 'var(--pink)' : isSelected ? '#201e1f' : holiday ? '#ffe1bd' : 'var(--border)'}`,
                  background: isToday
                    ? 'color-mix(in oklch, var(--pink) 12%, var(--bg-surface))'
                    : isSelected ? 'color-mix(in oklch, #201e1f 5%, var(--bg-surface))'
                    : holiday ? '#fffcfa' : 'var(--bg-elevated)',
                  cursor: 'pointer',
                  transition: 'border-color .15s, background .15s',
                  overflow: 'hidden',
                }}>
                <div style={{ marginBottom: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: isToday ? 26 : 'auto', height: isToday ? 26 : 'auto',
                    borderRadius: isToday ? 999 : 0,
                    background: isToday ? 'var(--pink)' : 'transparent',
                    fontSize: 15, fontWeight: isToday ? 800 : 600,
                    color: isToday ? 'white' : holiday ? '#201e1f' : 'var(--text-primary)',
                    lineHeight: 1, flexShrink: 0,
                  }}>{d}</span>
                  {holiday && <span style={{ fontSize: 13 }}>{holiday.emoji}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {dayEvs.slice(0, 3).map(ev => {
                    const cfg = typeColors[ev.tipo] || typeColors.admin || { bg: '#fec9df', text: '#201e1f', dot: '#fe7dae' };
                    return (
                      <div key={ev.id} style={{
                        fontSize: 13, lineHeight: 1.3, padding: '3px 6px',
                        background: cfg.bg, color: cfg.text,
                        borderRadius: 4,
                        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                      }}>
                        {ev.hora && <span style={{ fontWeight: 700, marginRight: 3 }}>{ev.hora.split(':')[0]}h</span>}
                        {ev.titulo}
                      </div>
                    );
                  })}
                  {dayEvs.length > 3 && (
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', paddingLeft: 4, fontWeight: 600 }}>+{dayEvs.length - 3} mais</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected day detail */}
        {selectedDay && (
          <div style={{ marginTop: 'var(--s-4)', padding: 'var(--s-4)', background: 'var(--bg-surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}>
            <div className="row between" style={{ marginBottom: 'var(--s-3)', alignItems: 'center' }}>
              <div className="eyebrow">
                {selectedDay} de {monthName.split(' ')[0]}
                {selHoliday && ` · ${selHoliday.emoji} ${selHoliday.nome}`}
              </div>
              <button onClick={() => setSelectedDay(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <Icon name="x" size={13} color="var(--text-muted)"/>
              </button>
            </div>

            {selHoliday && selHoliday.campanha && (
              <div style={{ marginBottom: selDayEvents.length > 0 ? 'var(--s-3)' : 0, padding: 'var(--s-3)', background: '#fffcfa', border: '1px solid #ffe1bd', borderRadius: 'var(--r-md)' }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: '#201e1f', marginBottom: 8 }}>
                  {selHoliday.emoji} Oportunidade de campanha
                </div>
                <div className="col gap-1">
                  {selHoliday.sugestoes.map((s, idx) => (
                    <div key={idx} className="row gap-2">
                      <span style={{ color: '#201e1f', fontSize: 14, flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{s}</span>
                    </div>
                  ))}
                </div>
                {selHoliday.clientes.length > 0 && (
                  <div className="row gap-2" style={{ marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Clientes:</span>
                    {selHoliday.clientes.map((c, idx) => (
                      <span key={idx} style={{ fontSize: 13.5, padding: '2px 8px', background: '#ffe1bd', borderRadius: 999, color: '#201e1f', fontWeight: 500 }}>{c}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {selDayEvents.length === 0 && !selHoliday && (
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Nenhum evento neste dia.</p>
            )}

            {selDayEvents.length > 0 && (
              <div className="col gap-2">
                {selDayEvents.map(ev => {
                  const cfg = typeColors[ev.tipo] || typeColors.admin || { bg: '#F5F5F5', border: '#DDD', text: '#555' };
                  return (
                    <div key={ev.id} style={{ padding: '8px 12px', background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 'var(--r-md)' }}>
                      {ev.hora && <div style={{ fontSize: 14, fontWeight: 700, color: cfg.text, marginBottom: 2 }}>{ev.hora}</div>}
                      <div style={{ fontSize: 14.5, color: cfg.text, lineHeight: 1.3 }}>{ev.titulo}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function ClientsWidget() {
  return (
    <div>
      <div className="row between" style={{ marginBottom: 'var(--s-3)' }}>
        <div className="eyebrow">Clientes ativos</div>
        <span className="tiny muted">{window.DEMO_CLIENTS.length} clientes · R$ {window.DEMO_CLIENTS.reduce((s, c) => s + c.receita, 0).toLocaleString('pt-BR')}</span>
      </div>
      <div className="col gap-2">
        {window.DEMO_CLIENTS.map(c => (
          <div key={c.id} className="row gap-3" style={{
            padding: '10px 12px',
            background: 'var(--bg-elevated)',
            borderRadius: 'var(--r-md)',
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: 999, background: c.cor, flexShrink: 0,
            }}/>
            <div className="grow">
              <div style={{ fontSize: 14.5, fontWeight: 500 }}>{c.nome}</div>
              <div className="tiny muted">R$ {c.receita.toLocaleString('pt-BR')}/mês</div>
            </div>
            {c.pendentes > 0 && (
              <span className="tiny" style={{
                background: `color-mix(in oklch, ${c.cor} 18%, var(--bg-surface))`,
                color: c.cor,
                padding: '2px 8px', borderRadius: 999, fontWeight: 600,
              }}>
                {c.pendentes}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Lembretes + Hábitos conectados ─── */
function LembretesHabitosWidget() {
  const todayStr = new Date().toISOString().slice(0, 10);
  const [dia, setDia] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`lorenna_habitos_${todayStr}`) || 'null') || { medicamentos: {}, agua_ml: 0, habitos: {} }; }
    catch { return { medicamentos: {}, agua_ml: 0, habitos: {} }; }
  });

  function save(next) {
    setDia(next);
    localStorage.setItem(`lorenna_habitos_${todayStr}`, JSON.stringify(next));
  }

  function toggleHabito(id) {
    save({ ...dia, habitos: { ...dia.habitos, [id]: !dia.habitos[id] } });
  }

  function toggleMeds(ids) {
    const allOn = ids.every(id => dia.medicamentos[id]);
    const nextMeds = { ...dia.medicamentos };
    ids.forEach(id => { nextMeds[id] = !allOn; });
    save({ ...dia, medicamentos: nextMeds });
    showToast(allOn ? 'Desmarcado' : '✅ Marcado!');
  }

  function addAgua(ml) {
    const next = { ...dia, agua_ml: (dia.agua_ml || 0) + ml };
    save(next);
    const pct = Math.round((next.agua_ml / 3000) * 100);
    showToast(`💧 +${ml}ml · ${pct}% da meta`);
  }

  function checkedState(r) {
    if (r.tipo === 'habito') return !!dia.habitos[r.id];
    if (r.tipo === 'meds')   return r.ids.every(id => dia.medicamentos[id]);
    return false;
  }

  const aguaMl = dia.agua_ml || 0;
  const aguaPct = Math.min(100, (aguaMl / 3000) * 100);
  const aguaCor = aguaPct >= 100 ? '#f1e18d' : aguaPct >= 60 ? '#bce1f6' : 'color-mix(in oklch, #bce1f6 50%, var(--bg-elevated))';

  const todayDow = window.todayBrasilia();
  const done = window.RECURRENCES.filter(r => r.tipo !== 'agua' && (!r.diasDaSemana || r.diasDaSemana.includes(todayDow)) && checkedState(r)).length;
  const total = window.RECURRENCES.filter(r => r.tipo !== 'agua' && (!r.diasDaSemana || r.diasDaSemana.includes(todayDow))).length;

  return (
    <Card>
      <CardHeader>
        <div className="row between" style={{ alignItems: 'center' }}>
          <div className="row gap-2">
            <Icon name="bell" size={13} color="var(--text-muted)" />
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 15, fontWeight: 600 }}>Lembretes do dia</h2>
          </div>
          <span style={{
            fontSize: 14, fontWeight: 600, padding: '2px 10px', borderRadius: 999,
            background: done === total ? '#f1e18d' : 'var(--bg-elevated)',
            color: done === total ? '#201e1f' : 'var(--text-muted)',
          }}>{done}/{total}</span>
        </div>
      </CardHeader>
      <CardBody className="col gap-2">

        {/* Água — tracker inline */}
        <div style={{
          padding: '12px var(--s-3)', borderRadius: 'var(--r-md)',
          background: `color-mix(in oklch, #bce1f6 18%, var(--bg-surface))`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0, width: 28, textAlign: 'center' }}>💧</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#201e1f', lineHeight: 1.3 }}>Beber água</div>
              <div style={{ fontSize: 13, color: '#201e1f', opacity: 0.5, marginTop: 2 }}>🕐 Ao longo do dia</div>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#201e1f', flexShrink: 0 }}>
              {aguaMl >= 1000 ? `${(aguaMl/1000).toFixed(1)}L` : `${aguaMl}ml`} / 3L
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: 'var(--bg-elevated)', overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${aguaPct}%`, background: aguaCor, borderRadius: 999, transition: 'width .3s' }}/>
          </div>
          <div className="row gap-2">
            {[250, 350, 500].map(ml => (
              <button key={ml} onClick={() => addAgua(ml)} style={{
                flex: 1, padding: '7px 0',
                borderRadius: 'var(--r-md)', border: '1.5px solid #bce1f6',
                background: 'var(--bg-surface)', color: '#201e1f',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}>+{ml}ml</button>
            ))}
          </div>
        </div>

        {/* Demais lembretes com check */}
        {window.RECURRENCES.filter(r => {
          if (r.tipo === 'agua') return false;
          if (r.diasDaSemana) {
            const dow = window.todayBrasilia();
            return r.diasDaSemana.includes(dow);
          }
          return true;
        }).map(r => {
          const checked = checkedState(r);
          return (
            <div key={r.texto} onClick={() => r.tipo === 'habito' ? toggleHabito(r.id) : toggleMeds(r.ids)}
              style={{
                padding: '12px var(--s-3)',
                borderRadius: 'var(--r-md)',
                background: checked
                  ? `color-mix(in oklch, ${r.cor} 35%, var(--bg-surface))`
                  : `color-mix(in oklch, ${r.cor} 18%, var(--bg-surface))`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', transition: 'background .15s',
                gap: 8,
              }}>
              {/* Emoji */}
              <span style={{ fontSize: 18, flexShrink: 0, width: 28, textAlign: 'center' }}>{r.icon}</span>

              {/* Text block */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: 600, color: '#201e1f', lineHeight: 1.3,
                  textDecoration: checked ? 'line-through' : 'none',
                  opacity: checked ? 0.55 : 1,
                }}>{r.texto}</div>
                {r.hora && (
                  <div style={{ fontSize: 13, color: '#201e1f', opacity: 0.5, marginTop: 2 }}>
                    🕐 {r.hora}
                  </div>
                )}
                {r.desc && (
                  <div style={{
                    fontSize: 13, color: '#201e1f', opacity: checked ? 0.4 : 0.65,
                    marginTop: 3, lineHeight: 1.35,
                  }}>{r.desc}</div>
                )}
              </div>

              {/* Checkbox */}
              <div style={{
                width: 26, height: 26, borderRadius: 999, flexShrink: 0,
                border: `2px solid ${checked ? r.cor : 'var(--border-strong)'}`,
                background: checked ? r.cor : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s',
              }}>
                {checked && <Icon name="check" size={13} color="#201e1f"/>}
              </div>
            </div>
          );
        })}
      </CardBody>
    </Card>
  );
}

const SUGESTAO_PALETTE = ['#fec9df', '#bce1f6', '#f1e18d', '#f0bff8', '#ffe1bd'];
const AGENTE_ROTULO = { carta: 'Carta da Lola', roteiro: 'Roteirista', blog: 'Blog SEO', post_cliente: 'Post de Cliente' };

function gerarSugestoesLocais(offset) {
  const clientes = window.DEMO_CLIENTS || [];
  const ideias = window.DEMO_IDEAS || [];
  const hoje = new Date();
  const seed = hoje.getDate() + hoje.getMonth() * 31 + offset * 7;
  const pick = (arr, extra) => arr[(seed + extra) % arr.length];

  const sugestoes = [];

  // 1. Ideia do banco → Blog SEO
  const ideiasProBlog = ideias.filter(i => ['pronta', 'desenvolvendo'].includes(i.status));
  if (ideiasProBlog.length) {
    const ideia = pick(ideiasProBlog, 0);
    sugestoes.push({
      titulo: ideia.titulo.length > 65 ? ideia.titulo.slice(0, 62) + '…' : ideia.titulo,
      descricao: ideia.desc,
      origem: `Do seu Banco de Ideias — marcada como "${ideia.status === 'pronta' ? 'pronta para produzir' : 'em desenvolvimento'}"`,
      formato: 'Blog', emoji: '📝', agente: 'blog',
    });
  }

  // 2. Newsletter semanal
  const newsletterTemas = [
    { titulo: 'Carta desta semana: criar com TDAH e não desistir', descricao: 'Uma cena real da semana vira reflexão sobre processo criativo e neurodivergência', origem: 'Com base na sua rotina como criadora com TDAH — tema central do Papel da Lola' },
    { titulo: 'Carta desta semana: maternidade e trabalho no mesmo dia', descricao: 'A tensão real entre ser mãe de três e tocar uma agência', origem: 'Com base na sua vida com Mateus, Murilo e Miguel e a Agência Logue' },
    { titulo: 'Carta desta semana: o que aprendi esta semana com um cliente', descricao: 'Bastidores de uma descoberta do trabalho que vale para todo mundo', origem: 'Com base nas suas tarefas abertas com clientes esta semana' },
    { titulo: 'Carta desta semana: sobre sistemas que funcionam de verdade', descricao: 'Do Córtex Lola a qualquer sistema — por que estrutura liberta', origem: 'Com base no seu Córtex Lola e na sua relação com produtividade neurodivergente' },
  ];
  sugestoes.push({ ...pick(newsletterTemas, 1), formato: 'Newsletter', emoji: '💌', agente: 'carta' });

  // 3. Reels/TikTok pessoal
  const reelsTemas = [
    { titulo: 'Minha rotina real com TDAH + 3 filhos', descricao: 'Sem glamour — do caos ao sistema que funciona, mostrando o Córtex Lola', origem: 'Com base no Córtex Lola e na sua rotina — conteúdo único que só você tem neste nicho' },
    { titulo: 'Como organizo minha semana criativa com IA', descricao: 'Mostrando as ferramentas reais do Córtex Lola no dia a dia', origem: 'Com base no seu sistema Córtex Lola — tendência crescente de produtividade + IA' },
    { titulo: 'Ser mãe de filho com TEA: o que ninguém fala', descricao: 'A realidade com o Mateus — diagnóstico, adaptação, amor sem romantização', origem: 'Com base na sua história com o Mateus — tema com potencial de grande alcance e acolhimento' },
    { titulo: 'O que mudou no meu trabalho depois que parei de postar todo dia', descricao: 'Resultado real de focar em consistência com qualidade vs. volume', origem: 'Com base na sua experiência como criadora e gestora de conteúdo para clientes' },
  ];
  sugestoes.push({ ...pick(reelsTemas, 2), formato: 'Reels', emoji: '🎬', agente: 'roteiro' });

  // 4. Post de cliente ou ensaio fotográfico
  if (clientes.length) {
    const cliente = pick(clientes, 3);
    sugestoes.push({
      titulo: `Post novo para ${cliente.nome}`,
      descricao: `Caption criativa com a voz do cliente — engajar a audiência e destacar o diferencial`,
      origem: `${cliente.nome} é um dos seus clientes ativos na Agência Logue`,
      formato: 'Post', emoji: '✨', agente: 'post_cliente',
    });
  } else {
    sugestoes.push({
      titulo: 'Ensaio: bastidores do trabalho criativo',
      descricao: 'Fotos do espaço de trabalho, tela do computador, anotações — o processo em imagens',
      origem: 'Conteúdo de bastidores tem alto engajamento e humaniza a marca pessoal',
      formato: 'Ensaio', emoji: '📸', agente: 'roteiro',
    });
  }

  // 5. YouTube longo
  const ytTemas = [
    { titulo: 'Tour pelo Córtex Lola — meu segundo cérebro digital', descricao: 'Vídeo longo mostrando o sistema completo, como foi criado e como uso no dia a dia', origem: 'Com base no Córtex Lola — conteúdo 100% exclusivo que só você pode criar, pioneiro no nicho' },
    { titulo: 'Como monto estratégia de conteúdo para clientes locais', descricao: 'Bastidores reais da Agência Logue — processo de criação para marcas pequenas', origem: 'Com base no seu trabalho com ' + (clientes.slice(0, 2).map(c => c.nome).join(' e ') || 'clientes') + ' na Agência Logue' },
    { titulo: 'Produtividade para mães neurodivergentes: o que funciona', descricao: 'Sistemas, ferramentas e a realidade sem romantização — para quem vive de verdade', origem: 'Com base na sua experiência com TDAH + TEA e 3 filhos — nicho crescente e carente de referências' },
    { titulo: 'Nos bastidores de uma agência criativa pequena', descricao: 'Como é gerir clientes, criar conteúdo e ser mãe ao mesmo tempo', origem: 'Com base no dia a dia da Agência Logue e da sua rotina como empreendedora criativa' },
  ];
  sugestoes.push({ ...pick(ytTemas, 4), formato: 'YouTube', emoji: '📹', agente: 'roteiro' });

  return sugestoes;
}

function LogueDashWidget({ setRoute }) {
  const logue = window.LOGUE_DATA || { projetos: [], pagamentos: [] };
  const emAberto = logue.projetos.filter(p => p.status !== 'entregue');
  const pagsPendentes = logue.pagamentos.filter(p => p.status === 'pendente');
  const today = new Date().getDate();
  const pagsProximos = pagsPendentes.filter(p => {
    const diff = p.dia - today;
    return diff >= 0 && diff <= 7;
  });

  if (emAberto.length === 0 && pagsPendentes.length === 0) return null;

  const clientesCores = { otica: '#bce1f6', espaco: '#f1e18d', pratique: '#f0bff8', jornal: '#ffe1bd' };
  const clientesNomes = { otica: 'Ótica Igor', espaco: 'Espaço Criar', pratique: 'Pratique', jornal: 'Jornal' };

  return (
    <Card>
      <CardHeader>
        <div className="row between">
          <div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 500 }}>Agência Logue</h2>
            <p className="tiny muted" style={{ marginTop: 2 }}>{emAberto.length} vídeos em aberto</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setRoute('/logue')}>
            Ver tudo →
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
          {/* Open projects */}
          <div className="col gap-2">
            <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 2 }}>Pendências</div>
            {emAberto.slice(0, 5).map(p => {
              const cor = clientesCores[p.cliente] || '#fec9df';
              const nome = clientesNomes[p.cliente] || p.cliente;
              return (
                <div key={p.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 999, background: cor, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#201e1f', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.titulo}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{nome}</div>
                  </div>
                </div>
              );
            })}
            {emAberto.length > 5 && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>+ {emAberto.length - 5} outros</div>
            )}
          </div>

          {/* Payments */}
          <div className="col gap-2">
            <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-muted)', marginBottom: 2 }}>Equipe — pagamentos</div>
            {pagsPendentes.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 13, color: '#201e1f' }}>{p.destinatario}</div>
                  <div style={{ fontSize: 12, color: pagsProximos.some(x => x.id === p.id) ? '#C0392B' : 'var(--text-muted)' }}>
                    Dia {p.dia} {pagsProximos.some(x => x.id === p.id) ? '· próximo!' : ''}
                  </div>
                </div>
                <span style={{ fontFamily: 'var(--font-title)', fontSize: 15, fontWeight: 500, color: '#201e1f' }}>R$ {p.valor}</span>
              </div>
            ))}
            {pagsPendentes.length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Todos pagos este mês</div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

function SugestoesWidget({ setRoute }) {
  const [offset, setOffset] = useState(0);
  const [itens, setItens] = useState(() => gerarSugestoesLocais(0));

  function atualizar() {
    const novoOffset = offset + 1;
    setOffset(novoOffset);
    setItens(gerarSugestoesLocais(novoOffset));
  }

  return (
    <Card>
      <CardHeader>
        <div className="row between" style={{ alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 700 }}>✨ Sugestões de conteúdo</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 3 }}>Baseadas no seu sistema · sem custo adicional</p>
          </div>
          <Button variant="ghost" size="sm" onClick={atualizar}>↺ Novas ideias</Button>
        </div>
      </CardHeader>
      <CardBody>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
          {itens.map((s, i) => {
            const cor = SUGESTAO_PALETTE[i % 5];
            return (
              <div key={i} style={{
                padding: 'var(--s-4)',
                borderRadius: 'var(--r-md)',
                background: `color-mix(in oklch, ${cor} 28%, var(--bg-surface))`,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div className="row gap-2" style={{ alignItems: 'center' }}>
                  <span style={{ fontSize: 20 }}>{s.emoji}</span>
                  <span style={{
                    fontSize: 14, fontWeight: 700,
                    padding: '2px 10px', borderRadius: 999,
                    background: cor, color: '#201e1f',
                  }}>{s.formato}</span>
                </div>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 600, lineHeight: 1.3, color: 'var(--text-primary)' }}>
                  {s.titulo}
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {s.descricao}
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.45, margin: 0 }}>
                  {s.origem}
                </p>
                <Button variant="ghost" size="sm"
                  style={{ color: 'var(--pink-deep)', fontWeight: 600, fontSize: 14, padding: '4px 0', alignSelf: 'flex-start', marginTop: 4 }}
                  onClick={() => { window.STUDIO_AUTOAGENTE = s.agente; setRoute('/studio'); }}>
                  Gostei dessa ideia →
                </Button>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

function DashboardPage({ energy, setEnergy, setRoute, openCapture }) {
  const e = window.ENERGY[energy];
  const all = window.DEMO_TASKS;
  const visible = e.show_heavy
    ? all.filter(t => t.status !== 'concluida')
    : all.filter(t => t.status !== 'concluida' && (t.micro.length <= 2) && t.prioridade !== 'baixa');

  const next = all.find(t => t.status !== 'concluida' && t.micro.some(m => !m.done));

  function buildListaHoje() {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const dayOfWeek = (now.getDay() + 6) % 7; // 0=Seg … 6=Dom
    const prioOrd = { urgente: 0, alta: 1, media: 2, baixa: 3 };

    const lista = [];
    [...all]
      .filter(t => t.status !== 'concluida')
      .filter(t => {
        if (t.diario) return true;
        if (t.prioridade === 'urgente') return true;
        if (t.diasDaSemana && t.diasDaSemana.includes(dayOfWeek)) return true;
        return false;
      })
      .sort((a, b) => (prioOrd[a.prioridade] ?? 2) - (prioOrd[b.prioridade] ?? 2))
      .forEach(t => lista.push(t));

    (window.AGENDA_EVENTS || [])
      .filter(ev => ev.date === todayStr)
      .forEach(ev => lista.push({
        id: `ag_${ev.id}`,
        titulo: ev.titulo,
        status: 'pendente',
        prioridade: 'media',
        micro: [],
        hora: ev.hora,
        fonte: '📅 Agenda',
      }));
    return lista;
  }
  const listaHoje = buildListaHoje();

  return (
    <div className="content">
      <div className="col gap-5 fade-up-stagger">
        {/* Saudação + Logue atalho + Energia lado a lado */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.9fr', gap: 'var(--s-4)' }} className="dash-top-grid">
          <DayFocusCard energy={energy} />
          <button onClick={() => setRoute('/logue')} style={{
            background: '#201e1f',
            borderRadius: 'var(--r-xl)',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--s-5)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'left',
            position: 'relative',
            overflow: 'hidden',
            minHeight: 160,
          }}>
            {/* Glow circle decoration */}
            <span style={{
              position: 'absolute', right: -32, top: -32,
              width: 120, height: 120, borderRadius: 999,
              background: 'radial-gradient(circle, rgba(254,125,174,0.18) 0%, transparent 70%)',
            }}/>
            <div>
              {/* logue. logo */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 0, marginBottom: 8 }}>
                <span style={{
                  fontFamily: 'Syne, sans-serif', fontSize: 30, fontWeight: 800,
                  color: '#fffcfa', letterSpacing: '-0.03em', lineHeight: 1,
                }}>logue</span>
                <span style={{
                  width: 9, height: 9, borderRadius: 999, flexShrink: 0,
                  background: 'radial-gradient(circle at 35% 30%, #fec9df, #d966aa)',
                  display: 'inline-block', marginBottom: 4, marginLeft: 1,
                }}/>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,252,250,0.45)', fontStyle: 'italic', marginBottom: 0, letterSpacing: '0.01em' }}>agência digital</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: 14, color: 'rgba(255,252,250,0.55)' }}>Ver projetos</span>
              <Icon name="arrow" size={13} color="#fe7dae"/>
            </div>
          </button>
          <Card>
            <CardBody>
              <EnergySelector energy={energy} setEnergy={setEnergy} />
            </CardBody>
          </Card>
        </div>

        {/* Rotina + Datas sazonais lado a lado */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-4)' }} className="dash-middle-grid">
          <RotinaSemanalWidget />
          <div className="col gap-3">
            <HolidayAlertBanner />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--s-5)' }} className="dash-grid">
          {/* LEFT — Tarefas em destaque */}
          <div className="col gap-4">
            {next && !e.show_heavy && <NextActionCard task={next} />}

            <Card style={{
              background: `color-mix(in oklch, ${e.color} 5%, var(--bg-surface))`,
              borderColor: `color-mix(in oklch, ${e.color} 30%, var(--border))`,
            }}>
              <CardHeader>
                <div className="row between">
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Tarefas de hoje</h2>
                    <p className="tiny muted" style={{ marginTop: 2 }}>
                      {`${listaHoje.length} para hoje`}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={openCapture}>
                    <Icon name="plus" size={13} /> Nova
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {listaHoje.length === 0 ? (
                  <div className="center muted" style={{ padding: 'var(--s-6) 0' }}>
                    <div style={{ fontSize: 30 }}>{e.emoji}</div>
                    <p className="small" style={{ marginTop: 8 }}>
                      Nenhuma tarefa cabe nesse modo agora. Respira.
                    </p>
                  </div>
                ) : (
                  (() => {
                    const urgentes = listaHoje.filter(t => t.prioridade === 'urgente');
                    const outros = listaHoje.filter(t => t.prioridade !== 'urgente');
                    return (
                      <div className="col gap-3">
                        {urgentes.length > 0 && (
                          <div className="col gap-2">
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#fe7dae', textTransform: 'uppercase', letterSpacing: '.06em', paddingLeft: 2 }}>
                              🔥 Urgente
                            </div>
                            {urgentes.map(t => <TaskRow key={t.id} task={t} />)}
                          </div>
                        )}
                        {outros.length > 0 && (
                          <div className="col gap-2">
                            {urgentes.length > 0 && (
                              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', paddingLeft: 2 }}>
                                📋 De hoje
                              </div>
                            )}
                            {outros.map(t => <TaskRow key={t.id} task={t} />)}
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}
                <div className="row gap-2" style={{ marginTop: 'var(--s-3)' }}
                  onClick={() => setRoute('/tarefas')}>
                  <a className="row gap-2 small muted" style={{ cursor: 'pointer' }}>
                    Ver todas as tarefas <Icon name="arrow" size={11} />
                  </a>
                </div>
              </CardBody>
            </Card>

          </div>

          {/* RIGHT */}
          <div className="col gap-4">
            <LembretesHabitosWidget />

            <Card>
              <CardBody>
                <PequenasVitorias />
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Visão da semana — largura total */}
        <Card>
          <CardBody>
            <WeekView />
          </CardBody>
        </Card>

        {/* Agência Logue — resumo */}
        <LogueDashWidget setRoute={setRoute} />

        {/* Sugestões de conteúdo — largura total */}
        <SugestoesWidget setRoute={setRoute} />

        <FullCalendarWidget />
      </div>
    </div>
  );
}

window.DashboardPage = DashboardPage;
window.TaskRow = TaskRow;
