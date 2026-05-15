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
            <span style={{ fontSize: 12, fontWeight: 500 }}>{e.label}</span>
          </div>

          <div className="row gap-2" style={{
            padding: '6px 12px',
            background: 'var(--bg-surface)',
            borderRadius: 999, border: '1px solid var(--border)',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--pink)' }}/>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>3 prioridades pra hoje</span>
          </div>

          <div className="row gap-2" style={{
            padding: '6px 12px',
            background: 'var(--bg-surface)',
            borderRadius: 999, border: '1px solid var(--border)',
          }}>
            <Icon name="calendar" size={12} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>2 lembretes fixos</span>
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

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(43,34,34,0.45)',
      backdropFilter: 'blur(4px)',
      zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--s-4)',
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
  );
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
          <p className="secondary" style={{ fontSize: 12, marginTop: 4 }}>
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
                cursor: 'pointer', fontSize: 12.5,
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
            cursor: 'pointer', fontSize: 12.5, fontWeight: 500,
            transition: 'all .15s var(--easing)',
          }}>
          <span style={{ fontSize: 14 }}>🤍</span>
          Não sei ainda
        </button>
      </div>
    </div>
  );
}

function TaskRow({ task, dense }) {
  const [open, setOpen] = useState(false);
  const total = task.micro.length;
  const done = task.micro.filter(m => m.done).length;
  const nextStep = task.micro.find(m => !m.done);
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
        <div style={{
          width: 18, height: 18, borderRadius: 999,
          border: `1.5px solid ${prioColor}`,
          background: task.status === 'concluida' ? prioColor : 'transparent',
          marginTop: 1, flexShrink: 0,
          cursor: 'pointer',
        }} title={task.prioridade}/>

        <div className="grow">
          <div className="row between" style={{ alignItems: 'flex-start' }}>
            <div className="grow">
              <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {task.titulo}
              </div>
              {task.cliente && (
                <div className="tiny muted" style={{ marginTop: 2 }}>
                  Para <strong style={{ color: 'var(--text-secondary)' }}>{task.cliente}</strong>
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
            </div>
          </div>

          {/* progress bar */}
          {total > 0 && (
            <div style={{ marginTop: 8, height: 3, borderRadius: 999, background: 'var(--bg-hover)', overflow: 'hidden' }}>
              <div style={{ width: `${(done/total)*100}%`, height: '100%', background: prioColor, transition: 'width .3s' }}/>
            </div>
          )}

          {/* next-step CTA when collapsed */}
          {!open && nextStep && (
            <div className="row gap-2" style={{ marginTop: 10, padding: '6px 10px', background: 'var(--pink-softer)', borderRadius: 'var(--r-sm)', border: '1px solid var(--border-soft)' }}>
              <Icon name="arrow" size={11} color="var(--pink-deep)" />
              <span style={{ fontSize: 12, color: 'var(--pink-deep)', fontWeight: 500 }}>Próxima:</span>
              <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{nextStep.desc}</span>
              {nextStep.min && <span className="tiny muted" style={{ marginLeft: 'auto' }}>~{nextStep.min}min</span>}
            </div>
          )}

          {/* microsteps */}
          {open && (
            <div style={{ marginTop: 12 }} className="col gap-2">
              {task.micro.map((m, i) => (
                <div key={m.id} className="row gap-3" style={{ padding: '8px 10px', background: m.done ? 'var(--bg-inset)' : 'var(--bg-elevated)', borderRadius: 'var(--r-sm)' }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: 999,
                    border: `1.5px solid ${m.done ? prioColor : 'var(--border-strong)'}`,
                    background: m.done ? prioColor : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {m.done && <Icon name="check" size={10} color="white"/>}
                  </div>
                  <span style={{
                    fontSize: 12.5,
                    color: m.done ? 'var(--text-muted)' : 'var(--text-primary)',
                    textDecoration: m.done ? 'line-through' : 'none',
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
    { count: 4, energy: 'criativa'    },
    { count: 6, energy: 'operacional' },
    { count: 3, energy: 'foco'        },
    { count: 5, energy: 'operacional' },
    { count: 2, energy: 'gravacao'    },
    { count: 1, energy: 'maternidade' },
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
                fontSize: 11, color: 'var(--text-muted)',
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
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{r.titulo}</div>
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
                          fontSize: 12.5,
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
  const vitorias = [
    { icon: '🎯', text: 'Post Pratique entregue no prazo', tipo: 'entrega' },
    { icon: '✍️', text: 'Newsletter escrita e agendada', tipo: 'conteudo' },
    { icon: '🎬', text: 'Reel bastidores gravado e editado', tipo: 'conteudo' },
    { icon: '💰', text: 'Ótica Igor Giordano — pagamento recebido', tipo: 'financeiro' },
    { icon: '🌱', text: 'Blog: post sobre organização publicado', tipo: 'publicado' },
    { icon: '💌', text: '3 DMs respondidas — networking ativo', tipo: 'social' },
  ];
  const [showing, setShowing] = useState(3);

  return (
    <div>
      <div className="row between" style={{ marginBottom: 'var(--s-3)' }}>
        <div>
          <div className="eyebrow" style={{ color: '#7FB68C' }}>Pequenas vitórias</div>
          <p className="tiny muted" style={{ marginTop: 4 }}>Tudo que você fez importa. Mesmo o que parece pequeno.</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => showToast('Adicionar vitória — em breve!')}>
          <Icon name="plus" size={12}/>
        </Button>
      </div>
      <div className="col gap-2">
        {vitorias.slice(0, showing).map((v, i) => (
          <div key={i} className="row gap-3" style={{
            padding: '10px 14px',
            background: 'color-mix(in oklch, #7FB68C 8%, var(--bg-surface))',
            border: '1px solid color-mix(in oklch, #7FB68C 20%, transparent)',
            borderRadius: 'var(--r-md)',
          }}>
            <span style={{ fontSize: 15, flexShrink: 0 }}>{v.icon}</span>
            <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.4 }}>{v.text}</span>
          </div>
        ))}
      </div>
      {showing < vitorias.length && (
        <button onClick={() => setShowing(vitorias.length)}
          style={{ marginTop: 'var(--s-3)', fontSize: 12, color: '#7FB68C', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
          Ver todas ({vitorias.length}) →
        </button>
      )}
    </div>
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
              <div style={{ fontSize: 12.5, fontWeight: 500 }}>{c.nome}</div>
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

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--s-5)' }} className="dash-grid">
          {/* LEFT */}
          <div className="col gap-4">
            {next && !e.show_heavy && <NextActionCard task={next} />}

            <Card>
              <CardBody>
                <PequenasVitorias />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="row between">
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 600 }}>Tarefas</h2>
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
                    {visible.map(t => <TaskRow key={t.id} task={t} />)}
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
            <Card>
              <CardBody>
                <RoutinesWidget />
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <ClientsWidget />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="row between">
                  <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 15, fontWeight: 600 }}>Ideias recentes</h2>
                  <a className="tiny" style={{ color: 'var(--pink-deep)', cursor: 'pointer' }}
                    onClick={() => setRoute('/ideias')}>Ver todas →</a>
                </div>
              </CardHeader>
              <CardBody className="col gap-2">
                {window.DEMO_IDEAS.slice(0, 3).map(i => (
                  <div key={i.id} className="row gap-2"
                    onClick={() => setRoute('/ideias')}
                    style={{
                      padding: 'var(--s-3)', borderRadius: 'var(--r-md)',
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      cursor: 'pointer',
                      alignItems: 'flex-start',
                    }}>
                    <Icon name="bulb" size={13} color="var(--pink)" style={{ marginTop: 2, flexShrink: 0 }}/>
                    <span style={{ fontSize: 12, lineHeight: 1.45, color: 'var(--text-secondary)' }}>
                      {i.titulo}
                    </span>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="row gap-2" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} onClick={openCapture}>
                  <Icon name="plus" size={12}/> Capturar ideia
                </Button>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="row gap-2">
                  <Icon name="bell" size={13} color="var(--text-muted)" />
                  <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 15, fontWeight: 600 }}>Lembretes fixos</h2>
                </div>
              </CardHeader>
              <CardBody className="col gap-2">
                {window.RECURRENCES.map(r => (
                  <div key={r.texto} className="row between" style={{
                    padding: 'var(--s-3)',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                  }}>
                    <div className="row gap-2">
                      <span style={{ fontSize: 14 }}>{r.icon}</span>
                      <span style={{ fontSize: 12.5 }}>{r.texto}</span>
                    </div>
                    <span className="tiny" style={{
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: `color-mix(in oklch, ${r.cor} 18%, transparent)`,
                      color: r.cor,
                    }}>
                      {r.hora}
                    </span>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

window.DashboardPage = DashboardPage;
window.TaskRow = TaskRow;
