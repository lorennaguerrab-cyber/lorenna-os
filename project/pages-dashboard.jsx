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

          <div className="row gap-2" style={{
            padding: '6px 12px',
            background: 'var(--bg-surface)',
            borderRadius: 999, border: '1px solid var(--border)',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--pink)' }}/>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>3 prioridades pra hoje</span>
          </div>

          <div className="row gap-2" style={{
            padding: '6px 12px',
            background: 'var(--bg-surface)',
            borderRadius: 999, border: '1px solid var(--border)',
          }}>
            <Icon name="calendar" size={12} color="var(--text-muted)" />
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>5 lembretes fixos</span>
          </div>
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
        border: '1px solid var(--gray-light)',
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

function TaskRow({ task, dense, large, onDelete }) {
  const [open, setOpen] = useState(false);
  const [concluida, setConcluida] = useState(task.status === 'concluida');
  const [microDone, setMicroDone] = useState(() => Object.fromEntries(task.micro.map(m => [m.id, m.done])));
  const total = task.micro.length;
  const done = Object.values(microDone).filter(Boolean).length;
  const nextStep = task.micro.find(m => !microDone[m.id]);
  const totalMin = task.micro.reduce((a, m) => a + (m.min || 0), 0);

  const prioColor = {
    urgente: '#C44878',
    alta:    '#E89B4C',
    media:   'var(--pink)',
    baixa:   '#7FB68C',
  }[task.prioridade];

  return (
    <div style={{
      borderRadius: 'var(--r-md)',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      transition: 'all .15s var(--easing)',
    }}>
      <div className="row gap-3" style={{ padding: dense ? '10px 14px' : '14px 16px', alignItems: 'flex-start' }}>
        <div onClick={() => { const next = !concluida; setConcluida(next); window.DB.updateTarefaStatus(task.id, next ? 'concluida' : 'pendente'); showToast(concluida ? 'Tarefa reaberta' : 'Tarefa concluída! ✓'); }}
          style={{
            width: 18, height: 18, borderRadius: 999,
            border: `1.5px solid ${prioColor}`,
            background: concluida ? prioColor : 'transparent',
            marginTop: 1, flexShrink: 0,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .15s',
          }}>
          {concluida && <Icon name="check" size={10} color="white"/>}
        </div>

        <div className="grow">
          <div className="row between" style={{ alignItems: 'flex-start' }}>
            <div className="grow">
              <div style={{ fontSize: large ? 15.5 : 14, fontWeight: large ? 600 : 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {task.titulo}
              </div>
              {task.cliente && (
                <div className="tiny muted" style={{ marginTop: 2 }}>
                  Para <strong style={{ color: 'var(--text-secondary)' }}>{task.cliente}</strong>
                </div>
              )}
              {(task.categoria || task.energia?.length > 0) && (
                <div className="row gap-1" style={{ marginTop: 5, flexWrap: 'wrap' }}>
                  {task.categoria && (
                    <span style={{
                      padding: '1px 7px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                      background: task.categoria === 'cliente' ? '#E8EEFF' : task.categoria === 'pessoal' ? 'var(--pink-tint)' : 'var(--bg-elevated)',
                      color: task.categoria === 'cliente' ? '#3A50C4' : task.categoria === 'pessoal' ? 'var(--pink-deep)' : 'var(--text-muted)',
                      border: task.categoria === 'cliente' ? '1px solid #BFC9F5' : task.categoria === 'pessoal' ? '1px solid var(--pink-soft)' : '1px solid var(--border)',
                      textTransform: 'uppercase', letterSpacing: '0.04em',
                    }}>
                      {task.categoria}
                    </span>
                  )}
                  {task.energia?.slice(0, 2).map(e => {
                    const ec = window.ENERGY?.[e];
                    return ec ? (
                      <span key={e} style={{
                        padding: '1px 7px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                        background: `color-mix(in oklch, ${ec.color} 12%, var(--white))`,
                        color: 'var(--text-secondary)',
                        border: `1px solid color-mix(in oklch, ${ec.color} 25%, transparent)`,
                      }}>
                        {ec.emoji} {ec.label}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
            <div className="row gap-2" style={{ flexShrink: 0 }}>
              {total > 0 && (
                <span className="tiny muted">{done}/{total}</span>
              )}
              {total > 0 && (
                <button className="btn ghost icon" onClick={() => setOpen(!open)}>
                  <Icon name={open ? 'chev-down' : 'chev-right'} size={14} />
                </button>
              )}
              {onDelete && (
                <button className="btn ghost icon" title="Apagar tarefa"
                  onClick={ev => { ev.stopPropagation(); onDelete(task.id); }}
                  style={{ opacity: 0.45, color: 'var(--text-muted)' }}>
                  <Icon name="x" size={13}/>
                </button>
              )}
            </div>
          </div>

          {/* progress bar */}
          {total > 0 && (
            <div style={{ marginTop: 8, height: 3, borderRadius: 999, background: 'var(--bg-hover)', overflow: 'hidden' }}>
              <div style={{ width: `${(done/total)*100}%`, height: '100%', background: prioColor, transition: 'width .3s' }}/>
            </div>
          )}

          {/* microsteps */}
          {open && (
            <div style={{ marginTop: 12 }} className="col gap-2">
              {task.micro.map((m, i) => (
                <div key={m.id} className="row gap-3"
                  onClick={() => setMicroDone(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
                  style={{ padding: '8px 10px', background: microDone[m.id] ? 'var(--bg-inset)' : 'var(--bg-elevated)', borderRadius: 'var(--r-sm)', cursor: 'pointer' }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 999,
                    border: `1.5px solid ${microDone[m.id] ? prioColor : 'var(--border-strong)'}`,
                    background: microDone[m.id] ? prioColor : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, transition: 'all .15s',
                  }}>
                    {microDone[m.id] && <Icon name="check" size={10} color="white"/>}
                  </div>
                  <span style={{
                    fontSize: 14.5,
                    color: microDone[m.id] ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: microDone[m.id] ? 'line-through' : 'none',
                    flex: 1,
                  }}>{m.desc}</span>
                  {m.min && <span className="tiny muted">{m.min}min</span>}
                </div>
              ))}
              {totalMin > 0 && (
                <div className="tiny muted" style={{ textAlign: 'right', marginTop: 2 }}>
                  Estimado: {totalMin} min
                </div>
              )}
            </div>
          )}
        </div>
      </div>
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

function WeekView() {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];
  const today = (new Date().getDay() + 6) % 7; // 0=Seg
  // arbitrary mock task counts per day, with light/heavy mix
  const data = [
    { count: 0, energy: 'criativa'    },
    { count: 0, energy: 'operacional' },
    { count: 0, energy: 'foco'        },
    { count: 0, energy: 'operacional' },
    { count: 0, energy: 'gravacao'    },
    { count: 0, energy: 'maternidade' },
    { count: 0, energy: 'cansada'     },
  ];
  return (
    <div>
      <div className="row between" style={{ marginBottom: 'var(--s-3)' }}>
        <div>
          <div className="eyebrow">Visão da semana</div>
          <p className="secondary tiny" style={{ marginTop: 4 }}>Quantas tarefas por dia · energia dominante</p>
        </div>
      </div>
      <div className="row gap-2">
        {days.map((d, i) => {
          const isToday = i === today;
          const cfg = window.ENERGY[data[i].energy];
          return (
            <div key={d} className="col gap-2" style={{ flex: 1, alignItems: 'center' }}>
              <div style={{
                width: '100%', height: 70,
                borderRadius: 'var(--r-md)',
                border: '1px solid',
                borderColor: isToday ? cfg.color : 'var(--border)',
                background: isToday ? `color-mix(in oklch, ${cfg.color} 10%, var(--bg-surface))` : 'var(--bg-elevated)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: 'var(--text-muted)',
                position: 'relative',
              }}>
                <div style={{ fontSize: 22, fontFamily: 'var(--font-title)', color: cfg.color, fontWeight: 600 }}>
                  {data[i].count}
                </div>
                <div style={{ fontSize: 14 }}>{cfg.emoji}</div>
              </div>
              <div className="tiny" style={{ fontWeight: isToday ? 600 : 400, color: isToday ? 'var(--text-primary)' : 'var(--text-muted)' }}>{d}</div>
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
              border: '1px solid var(--gray-light)',
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
                <div className="col gap-2" style={{ padding: '0 14px 14px', borderTop: '1px solid var(--gray-light)' }}>
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
          <div className="eyebrow" style={{ color: '#7FB68C' }}>🏆 Pequenas vitórias</div>
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
                background: 'color-mix(in oklch, #7FB68C 8%, var(--bg-surface))',
                border: '1px solid color-mix(in oklch, #7FB68C 20%, transparent)',
                borderRadius: 'var(--r-md)',
              }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{v.icon}</span>
                <span style={{ fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.4 }}>{v.text}</span>
              </div>
            ))}
          </div>
          {showing < all.length && (
            <button onClick={() => setShowing(all.length)}
              style={{ marginTop: 'var(--s-3)', fontSize: 14, color: '#7FB68C', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
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
  const today = (new Date().getDay() + 6) % 7;
  const r = ROTINA_SEMANAL[today];
  const col = ROTINA_PALETTE[today];

  return (
    <Card>
      <CardBody>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-3)' }}>Rotina da semana</div>

        {/* Barra decorativa dos 7 dias */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 'var(--s-4)' }}>
          {ROTINA_SEMANAL.map((d, i) => {
            const isToday = i === today;
            const c = ROTINA_PALETTE[i];
            return (
              <div key={d.dia} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{
                  height: 6, borderRadius: 99, marginBottom: 6,
                  background: isToday ? c : `color-mix(in oklch, ${c} 35%, var(--bg-elevated))`,
                }} />
                <div style={{
                  fontSize: 14, fontWeight: isToday ? 700 : 400,
                  color: isToday ? '#201e1f' : 'var(--text-muted)',
                }}>{d.dia}</div>
              </div>
            );
          })}
        </div>

        {/* Bloco de hoje com contraste garantido */}
        <div style={{
          background: col,
          borderRadius: 'var(--r-md)',
          padding: 'var(--s-4)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#201e1f', marginBottom: 10 }}>
            Hoje · {r.dia}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {r.temas.map((t, j) => (
              <div key={j} style={{
                fontSize: 14, color: '#201e1f',
                background: 'rgba(32,30,31,.12)',
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
        <div style={{ marginTop: 'var(--s-3)', paddingTop: 'var(--s-2)', borderTop: '1px solid var(--border)' }}>
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
            background: '#FFF8EE',
            border: '1px solid #FDDBB0',
            borderRadius: 'var(--r-md)',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{h.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: '#B5720A' }}>
                {h.nome} — em {daysLeft} dia{daysLeft !== 1 ? 's' : ''}! Hora de planejar.
              </div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 2 }}>
                Sugestão: {h.sugestoes[0]}
              </div>
            </div>
            <div style={{
              fontSize: 15, fontWeight: 700, color: 'white',
              background: '#E89B4C', padding: '5px 12px',
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
              <div style={{ width: 8, height: 8, borderRadius: 999, background: cfg.dot, flexShrink: 0, marginTop: 3 }}/>
              <span style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>
                {tipo === 'filho' ? 'Filhos' : tipo === 'gravacao' ? 'Gravação' : tipo.charAt(0).toUpperCase() + tipo.slice(1)}
              </span>
            </div>
          ))}
          <div className="row gap-2">
            <div style={{ width: 8, height: 8, borderRadius: 999, background: '#E89B4C', flexShrink: 0, marginTop: 3 }}/>
            <span style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>Datas comemorativas</span>
          </div>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => (
            <div key={d} style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', textAlign: 'center', paddingBottom: 6 }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} style={{ minHeight: 80 }}/>;
            const ds = dateStr(d);
            const isToday   = ds === todayStr;
            const dayEvs    = eventsForDay(d);
            const holiday   = holidayForDay(d);
            const isSelected = selectedDay === d;
            return (
              <div key={i} onClick={() => setSelectedDay(isSelected ? null : d)}
                style={{
                  minHeight: 80, padding: '7px 8px',
                  borderRadius: 'var(--r-md)',
                  border: `1.5px solid ${isToday ? 'var(--pink)' : isSelected ? 'var(--ink)' : holiday ? '#FDDBB0' : 'var(--border)'}`,
                  background: isToday
                    ? 'color-mix(in oklch, var(--pink) 10%, var(--bg-surface))'
                    : holiday ? '#FFF8EE' : 'var(--bg-elevated)',
                  cursor: 'pointer',
                  transition: 'border-color .15s',
                  overflow: 'hidden',
                }}>
                <div className="row gap-1" style={{ marginBottom: 4, alignItems: 'center' }}>
                  <span style={{
                    fontSize: 14, fontWeight: isToday ? 700 : 500,
                    color: isToday ? 'var(--pink-deep)' : holiday ? '#B5720A' : 'var(--text-primary)',
                    lineHeight: 1,
                  }}>{d}</span>
                  {holiday && <span style={{ fontSize: 11 }}>{holiday.emoji}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {dayEvs.slice(0, 2).map(ev => {
                    const cfg = typeColors[ev.tipo] || typeColors.admin || { bg: '#F5F5F5', text: '#555' };
                    return (
                      <div key={ev.id} style={{
                        fontSize: 11, lineHeight: 1.25, padding: '2px 4px',
                        background: cfg.bg, color: cfg.text,
                        borderRadius: 3,
                        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                      }}>
                        {ev.hora && <span style={{ fontWeight: 700, marginRight: 2 }}>{ev.hora.split(':')[0]}h</span>}
                        {ev.titulo}
                      </div>
                    );
                  })}
                  {dayEvs.length > 2 && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', paddingLeft: 2 }}>+{dayEvs.length - 2}</div>
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
              <div style={{ marginBottom: selDayEvents.length > 0 ? 'var(--s-3)' : 0, padding: 'var(--s-3)', background: '#FFF8EE', border: '1px solid #FDDBB0', borderRadius: 'var(--r-md)' }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: '#B5720A', marginBottom: 8 }}>
                  {selHoliday.emoji} Oportunidade de campanha
                </div>
                <div className="col gap-1">
                  {selHoliday.sugestoes.map((s, idx) => (
                    <div key={idx} className="row gap-2">
                      <span style={{ color: '#E89B4C', fontSize: 14, flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>{s}</span>
                    </div>
                  ))}
                </div>
                {selHoliday.clientes.length > 0 && (
                  <div className="row gap-2" style={{ marginTop: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>Clientes:</span>
                    {selHoliday.clientes.map((c, idx) => (
                      <span key={idx} style={{ fontSize: 13.5, padding: '2px 8px', background: 'rgba(232,155,76,0.2)', borderRadius: 999, color: '#B5720A', fontWeight: 500 }}>{c}</span>
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
            border: '1px solid var(--border)',
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
  const aguaCor = aguaPct >= 100 ? '#7FB68C' : aguaPct >= 60 ? '#5B9BD5' : '#bce1f6';

  const done = window.RECURRENCES.filter(r => r.tipo !== 'agua' && checkedState(r)).length;
  const total = window.RECURRENCES.filter(r => r.tipo !== 'agua').length;

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
            background: done === total ? '#7FB68C' : 'var(--bg-elevated)',
            color: done === total ? 'white' : 'var(--text-muted)',
          }}>{done}/{total}</span>
        </div>
      </CardHeader>
      <CardBody className="col gap-2">

        {/* Água — tracker inline */}
        <div style={{
          padding: 'var(--s-3)', borderRadius: 'var(--r-md)',
          background: `color-mix(in oklch, #bce1f6 28%, var(--bg-surface))`,
          borderLeft: '3px solid #bce1f6',
        }}>
          <div className="row between" style={{ marginBottom: 8 }}>
            <div className="row gap-2">
              <span style={{ fontSize: 16 }}>💧</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#201e1f' }}>Beber água</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: aguaPct >= 100 ? '#7FB68C' : '#5B9BD5' }}>
              {aguaMl >= 1000 ? `${(aguaMl/1000).toFixed(1)}L` : `${aguaMl}ml`} / 3L
            </span>
          </div>
          {/* Barra de progresso */}
          <div style={{ height: 8, borderRadius: 999, background: 'var(--bg-elevated)', overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${aguaPct}%`, background: aguaCor, borderRadius: 999, transition: 'width .3s' }}/>
          </div>
          {/* Botões de adição */}
          <div className="row gap-2">
            {[250, 350, 500].map(ml => (
              <button key={ml} onClick={() => addAgua(ml)} style={{
                flex: 1, padding: '6px 0',
                borderRadius: 'var(--r-md)', border: '1.5px solid #bce1f6',
                background: 'white', color: '#201e1f',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}>+{ml}ml</button>
            ))}
          </div>
        </div>

        {/* Demais lembretes com check */}
        {window.RECURRENCES.filter(r => r.tipo !== 'agua').map(r => {
          const checked = checkedState(r);
          return (
            <div key={r.texto} onClick={() => r.tipo === 'habito' ? toggleHabito(r.id) : toggleMeds(r.ids)}
              style={{
                padding: '10px var(--s-3)',
                borderRadius: 'var(--r-md)',
                background: checked
                  ? `color-mix(in oklch, ${r.cor} 35%, var(--bg-surface))`
                  : `color-mix(in oklch, ${r.cor} 18%, var(--bg-surface))`,
                borderLeft: `3px solid ${r.cor}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', transition: 'background .15s',
              }}>
              <div className="row gap-2" style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{r.icon}</span>
                <span style={{
                  fontSize: 14, fontWeight: 500, color: '#201e1f',
                  textDecoration: checked ? 'line-through' : 'none',
                  opacity: checked ? 0.6 : 1,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{r.texto}</span>
              </div>
              <div style={{
                width: 24, height: 24, borderRadius: 999, flexShrink: 0, marginLeft: 8,
                border: `2px solid ${checked ? r.cor : 'var(--border-strong)'}`,
                background: checked ? r.cor : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s',
              }}>
                {checked && <Icon name="check" size={13} color="white"/>}
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
                borderLeft: `3px solid ${cor}`,
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

  return (
    <div className="content">
      <div className="col gap-5 fade-up-stagger">
        <DayFocusCard energy={energy} />

        <Card>
          <CardBody>
            <EnergySelector energy={energy} setEnergy={setEnergy} />
          </CardBody>
        </Card>

        <RotinaSemanalWidget />

        <HolidayAlertBanner />

        <SugestoesWidget setRoute={setRoute} />

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
                    <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>Tarefas</h2>
                    <p className="tiny muted" style={{ marginTop: 2 }}>
                      {e.show_heavy
                        ? `${visible.length} para hoje`
                        : `${visible.length} tarefa(s) leve(s) · modo ${e.label.toLowerCase()}`}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={openCapture}>
                    <Icon name="plus" size={13} /> Nova
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                {visible.length === 0 ? (
                  <div className="center muted" style={{ padding: 'var(--s-6) 0' }}>
                    <div style={{ fontSize: 30 }}>{e.emoji}</div>
                    <p className="small" style={{ marginTop: 8 }}>
                      Nenhuma tarefa cabe nesse modo agora. Respira.
                    </p>
                  </div>
                ) : (
                  <div className="col gap-2">
                    {visible.map(t => <TaskRow key={t.id} task={t} large />)}
                  </div>
                )}
                <div className="row gap-2" style={{ marginTop: 'var(--s-3)' }}
                  onClick={() => setRoute('/tarefas')}>
                  <a className="row gap-2 small muted" style={{ cursor: 'pointer' }}>
                    Ver todas as tarefas <Icon name="arrow" size={11} />
                  </a>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <WeekView />
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

            <Card>
              <CardBody>
                <RoutinesWidget />
              </CardBody>
            </Card>
          </div>
        </div>

        <FullCalendarWidget />
      </div>
    </div>
  );
}

window.DashboardPage = DashboardPage;
window.TaskRow = TaskRow;
