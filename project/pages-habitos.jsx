/* ──────────────────────────────────────────────
   pages-habitos.jsx — Rastreador de Hábitos
   ────────────────────────────────────────────── */

const MEDICAMENTOS_CONFIG = [
  { id: 'venvanse',    nome: 'VENVANSE',    membro: 'lorenna', turno: 'manha', cor: '#FF78B0' },
  { id: 'bupropiona',  nome: 'BUPROPIONA',  membro: 'lorenna', turno: 'manha', cor: '#FF78B0' },
  { id: 'olmesartana', nome: 'OLMESARTANA', membro: 'lorenna', turno: 'manha', cor: '#FF78B0' },
  { id: 'fluoxetina',  nome: 'FLUOXETINA',  membro: 'lorenna', turno: 'manha', cor: '#FF78B0' },
  { id: 'amitril_mateus', nome: 'AMITRIL', membro: 'mateus', turno: 'noite', cor: '#5B9BD5' },
];

const HABITOS_PADRAO = [
  { id: 'exercicio',         nome: 'Exercício físico',              emoji: '🏃' },
  { id: 'fruta',             nome: 'Comer fruta',                    emoji: '🍎' },
  { id: 'leitura',           nome: 'Leitura',                        emoji: '📖' },
  { id: 'meditacao',         nome: 'Meditação / respiro',            emoji: '🧘' },
  { id: 'vitamina_miguel',   nome: 'Vitamina do Miguel (GROWVIT)',   emoji: '🌿' },
  { id: 'tarefas_escolares', nome: 'Tarefas escolares M&M',         emoji: '✏️' },
  { id: 'brincadeira_miguel',nome: 'Brincadeiras com os meninos',   emoji: '🐣' },
  { id: 'futebol',           nome: 'Futebol M&M',                    emoji: '⚽' },
];

const META_AGUA_ML = 3000;
const AGUA_OPCOES = [250, 350, 500];

function dateKey(date) {
  return date.toISOString().slice(0, 10);
}

function loadDia(dateStr) {
  try {
    return JSON.parse(localStorage.getItem(`lorenna_habitos_${dateStr}`) || 'null') || {
      medicamentos: {},
      agua_ml: 0,
      habitos: {},
    };
  } catch { return { medicamentos: {}, agua_ml: 0, habitos: {} }; }
}

function saveDia(dateStr, data) {
  localStorage.setItem(`lorenna_habitos_${dateStr}`, JSON.stringify(data));
}

function loadHabitosConfig() {
  try {
    return JSON.parse(localStorage.getItem('lorenna_habitos_config') || 'null') || HABITOS_PADRAO;
  } catch { return HABITOS_PADRAO; }
}

function saveHabitosConfig(cfg) {
  localStorage.setItem('lorenna_habitos_config', JSON.stringify(cfg));
}

function formatDate(date) {
  return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function formatDateShort(date) {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

/* ── Medalhinha de check visual ─── */
function CheckRound({ checked, onChange, cor, size = 22 }) {
  return (
    <div
      onClick={onChange}
      style={{
        width: size, height: size, borderRadius: 999, flexShrink: 0,
        border: `2px solid ${checked ? cor : 'var(--border-strong)'}`,
        background: checked ? cor : 'transparent',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .15s',
      }}>
      {checked && <Icon name="check" size={size * 0.55} color="white"/>}
    </div>
  );
}

/* ── Barra de progresso de água ─── */
function AguaBar({ ml, meta }) {
  const pct = Math.min(100, (ml / meta) * 100);
  const cor = pct >= 100 ? '#7FB68C' : pct >= 60 ? '#5B9BD5' : '#A89AC9';
  return (
    <div style={{ position: 'relative', height: 12, borderRadius: 999, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: `${pct}%`, background: cor,
        borderRadius: 999, transition: 'width .3s ease',
      }}/>
    </div>
  );
}

/* ── Semana mini view ─── */
function SemanaView({ data: currentDate, habitos }) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const seg = new Date(currentDate);
  const dow = seg.getDay();
  const diff = dow === 0 ? -6 : 1 - dow;
  seg.setDate(seg.getDate() + diff);
  seg.setHours(0, 0, 0, 0);

  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(seg);
    d.setDate(seg.getDate() + i);
    return d;
  });

  const diasNomes = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  return (
    <Card>
      <CardBody>
        <div className="eyebrow" style={{ marginBottom: 'var(--s-3)', color: 'var(--text-secondary)' }}>Visão da semana</div>

        {/* Legend */}
        <div className="row gap-4" style={{ marginBottom: 'var(--s-4)', flexWrap: 'wrap' }}>
          {[['#FF78B0', '💊 Remédios'], ['#5B9BD5', '💧 Água'], ['#7FB68C', '✅ Hábitos']].map(([c, l]) => (
            <div key={l} className="row gap-1" style={{ alignItems: 'center' }}>
              <div style={{ width: 10, height: 5, borderRadius: 2, background: c }}/>
              <span className="tiny muted">{l}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
          {dias.map((d, i) => {
            const dk = dateKey(d);
            const dia = loadDia(dk);
            const isFuture = d > hoje;
            const isToday = dk === dateKey(hoje);

            const medPct = MEDICAMENTOS_CONFIG.length > 0
              ? MEDICAMENTOS_CONFIG.filter(m => dia.medicamentos?.[m.id]).length / MEDICAMENTOS_CONFIG.length
              : 0;
            const habPct = habitos.length > 0
              ? habitos.filter(h => dia.habitos?.[h.id]).length / habitos.length
              : 0;
            const aguaPct = Math.min(1, (dia.agua_ml || 0) / META_AGUA_ML);

            const hasData = !isFuture && (medPct > 0 || habPct > 0 || aguaPct > 0);
            const score = !isFuture ? (medPct * 0.4 + habPct * 0.4 + aguaPct * 0.2) : null;

            return (
              <div key={i} style={{ textAlign: 'center' }}>
                {/* Day name */}
                <div style={{
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
                  color: isToday ? '#fe7dae' : 'rgba(32,30,31,0.35)',
                  marginBottom: 5,
                }}>{diasNomes[i]}</div>

                {/* Date */}
                <div style={{
                  width: 28, height: 28, borderRadius: 999, margin: '0 auto',
                  background: isToday ? '#fe7dae' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: isToday ? 700 : 500,
                  color: isToday ? 'white' : 'rgba(32,30,31,0.6)',
                  marginBottom: 10,
                }}>
                  {d.getDate()}
                </div>

                {/* 3 mini progress bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {[
                    { pct: medPct, color: '#FF78B0' },
                    { pct: aguaPct, color: '#5B9BD5' },
                    { pct: habPct, color: '#7FB68C' },
                  ].map(({ pct, color }, j) => (
                    <div key={j} style={{
                      height: 5, borderRadius: 999,
                      background: isFuture ? 'transparent' : 'rgba(32,30,31,0.07)',
                      overflow: 'hidden',
                    }}>
                      {!isFuture && pct > 0 && (
                        <div style={{
                          width: `${pct * 100}%`, height: '100%',
                          background: color, borderRadius: 999,
                          transition: 'width .4s ease',
                        }}/>
                      )}
                    </div>
                  ))}
                </div>

                {/* Score % */}
                {hasData && score !== null && score > 0 && (
                  <div style={{
                    marginTop: 6, fontSize: 10, fontWeight: 600,
                    color: score >= 0.8 ? '#3A8C50' : score >= 0.5 ? '#B06A20' : '#C44878',
                  }}>
                    {Math.round(score * 100)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

/* ── PÁGINA PRINCIPAL ─── */
function HabitosPage() {
  const [dataAtual, setDataAtual] = useState(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); return d;
  });
  const [dia, setDia] = useState(() => loadDia(dateKey(new Date())));
  const [habitos, setHabitos] = useState(() => loadHabitosConfig());
  const [novoHabito, setNovoHabito] = useState('');
  const [adicionando, setAdicionando] = useState(false);

  const dk = dateKey(dataAtual);
  const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  const isHoje = dk === dateKey(hoje);

  function navDia(dir) {
    const d = new Date(dataAtual);
    d.setDate(d.getDate() + dir);
    setDataAtual(d);
    setDia(loadDia(dateKey(d)));
  }

  function update(path, val) {
    setDia(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {};
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = val;
      saveDia(dk, next);
      return next;
    });
  }

  function toggleMed(id) {
    update(`medicamentos.${id}`, !dia.medicamentos?.[id]);
  }

  function addAgua(ml) {
    const atual = dia.agua_ml || 0;
    update('agua_ml', atual + ml);
  }

  function resetAgua() {
    if (!confirm('Zerar registro de água de hoje?')) return;
    update('agua_ml', 0);
  }

  function toggleHabito(id) {
    update(`habitos.${id}`, !dia.habitos?.[id]);
  }

  function adicionarHabito() {
    if (!novoHabito.trim()) return;
    const novo = {
      id: 'h_' + Date.now(),
      nome: novoHabito.trim(),
      emoji: '✅',
    };
    const lista = [...habitos, novo];
    setHabitos(lista);
    saveHabitosConfig(lista);
    setNovoHabito('');
    setAdicionando(false);
  }

  function removerHabito(id) {
    const lista = habitos.filter(h => h.id !== id);
    setHabitos(lista);
    saveHabitosConfig(lista);
  }

  const aguaMl = dia.agua_ml || 0;
  const aguaPct = Math.min(100, (aguaMl / META_AGUA_ML) * 100);

  const manhaMeds = MEDICAMENTOS_CONFIG.filter(m => m.turno === 'manha');
  const noiteMeds = MEDICAMENTOS_CONFIG.filter(m => m.turno === 'noite');

  const totalMed = MEDICAMENTOS_CONFIG.length;
  const tomouMed = MEDICAMENTOS_CONFIG.filter(m => dia.medicamentos?.[m.id]).length;
  const totalHab = habitos.length;
  const fezHab = habitos.filter(h => dia.habitos?.[h.id]).length;

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Hábitos"
          subtitle="Medicamentos, água e rotina diária — tudo registrado"
        />

        {/* Navegação de data */}
        <div className="row between" style={{ alignItems: 'center' }}>
          <button onClick={() => navDia(-1)}
            style={{ padding: '8px 16px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--bg-surface)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14 }}>
            ← Ontem
          </button>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 600, textTransform: 'capitalize', color: isHoje ? 'var(--pink-deep)' : 'var(--text-primary)' }}>
              {isHoje ? '✨ Hoje' : formatDate(dataAtual)}
            </div>
            {!isHoje && <div className="tiny muted">{formatDate(dataAtual)}</div>}
          </div>
          <button onClick={() => navDia(1)}
            style={{ padding: '8px 16px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--bg-surface)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 14 }}>
            Amanhã →
          </button>
        </div>

        {/* Score do dia */}
        {!isHoje || tomouMed > 0 || aguaMl > 0 || fezHab > 0 ? (
          <div className="row gap-3" style={{ flexWrap: 'wrap' }}>
            <div style={{
              flex: 1, minWidth: 120,
              padding: 'var(--s-3) var(--s-4)',
              borderRadius: 'var(--r-md)',
              background: `color-mix(in oklch, #FF78B0 10%, var(--white))`,
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 700, color: '#E8538D' }}>
                {tomouMed}/{totalMed}
              </div>
              <div className="tiny muted">Remédios</div>
            </div>
            <div style={{
              flex: 1, minWidth: 120,
              padding: 'var(--s-3) var(--s-4)',
              borderRadius: 'var(--r-md)',
              background: `color-mix(in oklch, #5B9BD5 10%, var(--white))`,
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 700, color: '#3A7DC4' }}>
                {aguaMl}ml
              </div>
              <div className="tiny muted">{Math.round(aguaPct)}% da meta</div>
            </div>
            <div style={{
              flex: 1, minWidth: 120,
              padding: 'var(--s-3) var(--s-4)',
              borderRadius: 'var(--r-md)',
              background: `color-mix(in oklch, #7FB68C 10%, var(--white))`,
              textAlign: 'center',
            }}>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 700, color: '#3A8C50' }}>
                {fezHab}/{totalHab}
              </div>
              <div className="tiny muted">Hábitos</div>
            </div>
          </div>
        ) : null}

        {/* Medicamentos */}
        <Card>
          <CardBody className="col gap-4">
            <div className="row between" style={{ alignItems: 'center' }}>
              <div className="eyebrow">💊 Medicamentos</div>
              <span className="tiny muted">{tomouMed} de {totalMed} tomados</span>
            </div>

            {/* Manhã — Lorenna */}
            <div className="col gap-1">
              <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: '#FF78B0', marginBottom: 4 }}>
                🌅 Manhã — Lorenna
              </div>
              {manhaMeds.map(m => {
                const checked = !!dia.medicamentos?.[m.id];
                return (
                  <div key={m.id} onClick={() => toggleMed(m.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 14px', borderRadius: 'var(--r-md)', cursor: 'pointer',
                      background: checked ? 'color-mix(in oklch, #FF78B0 8%, var(--white))' : 'var(--bg-elevated)',
                      transition: 'all .15s',
                    }}>
                    <CheckRound checked={checked} onChange={() => toggleMed(m.id)} cor="#FF78B0"/>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, letterSpacing: '0.01em',
                      color: checked ? '#E8538D' : 'var(--text-primary)',
                      textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.7 : 1,
                    }}>{m.nome}</span>
                    {checked && <span style={{ marginLeft: 'auto', fontSize: 13 }}>✓</span>}
                  </div>
                );
              })}
            </div>

            {/* Noite — Mateus */}
            <div className="col gap-1">
              <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: '#5B9BD5', marginBottom: 4 }}>
                🌙 Noite — Mateus
              </div>
              {noiteMeds.map(m => {
                const checked = !!dia.medicamentos?.[m.id];
                return (
                  <div key={m.id} onClick={() => toggleMed(m.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 14px', borderRadius: 'var(--r-md)', cursor: 'pointer',
                      background: checked ? 'color-mix(in oklch, #5B9BD5 8%, var(--white))' : 'var(--bg-elevated)',
                      transition: 'all .15s',
                    }}>
                    <CheckRound checked={checked} onChange={() => toggleMed(m.id)} cor="#5B9BD5"/>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, letterSpacing: '0.01em',
                      color: checked ? '#3A7DC4' : 'var(--text-primary)',
                      textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.7 : 1,
                    }}>{m.nome}</span>
                    {checked && <span style={{ marginLeft: 'auto', fontSize: 13 }}>✓</span>}
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Água */}
        <Card>
          <CardBody className="col gap-4">
            <div className="row between" style={{ alignItems: 'center' }}>
              <div className="eyebrow">💧 Água</div>
              <div className="row gap-2" style={{ alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 700,
                  color: aguaPct >= 100 ? '#3A8C50' : '#3A7DC4',
                }}>
                  {aguaMl}ml
                </span>
                <span className="tiny muted">/ {META_AGUA_ML}ml</span>
              </div>
            </div>

            <AguaBar ml={aguaMl} meta={META_AGUA_ML}/>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="tiny muted">{aguaPct >= 100 ? '🎉 Meta atingida!' : `Faltam ${META_AGUA_ML - aguaMl}ml para a meta`}</span>
            </div>

            <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
              {AGUA_OPCOES.map(ml => (
                <button key={ml} onClick={() => addAgua(ml)}
                  style={{
                    padding: '10px 20px', borderRadius: 'var(--r-md)',
                    background: 'color-mix(in oklch, #5B9BD5 10%, var(--white))',
                    color: '#3A7DC4', fontWeight: 700, fontSize: 14,
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                    transition: 'all .1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'color-mix(in oklch, #5B9BD5 20%, var(--white))'}
                  onMouseLeave={e => e.currentTarget.style.background = 'color-mix(in oklch, #5B9BD5 10%, var(--white))'}
                >
                  +{ml}ml
                </button>
              ))}
              {aguaMl > 0 && (
                <button onClick={resetAgua}
                  style={{
                    padding: '10px 16px', borderRadius: 'var(--r-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-elevated)',
                    color: 'var(--text-muted)', fontSize: 13,
                    cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}>
                  Zerar
                </button>
              )}
            </div>

            {/* Visualização em copos */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Array.from({ length: Math.ceil(META_AGUA_ML / 250) }, (_, i) => {
                const cheio = (i + 1) * 250 <= aguaMl;
                const parcial = !cheio && i * 250 < aguaMl;
                return (
                  <div key={i} onClick={() => addAgua(250)}
                    title={`Copo ${i + 1} — 250ml`}
                    style={{
                      width: 28, height: 36, cursor: 'pointer',
                      borderRadius: '4px 4px 8px 8px',
                      background: cheio ? '#5B9BD5' : parcial ? 'color-mix(in oklch, #5B9BD5 35%, var(--white))' : 'var(--white)',
                      transition: 'all .15s',
                      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                      fontSize: 10,
                    }}
                  />
                );
              })}
            </div>
          </CardBody>
        </Card>

        {/* Hábitos */}
        <Card>
          <CardBody className="col gap-3">
            <div className="row between" style={{ alignItems: 'center' }}>
              <div className="eyebrow">✅ Hábitos do dia</div>
              <span className="tiny muted">{fezHab}/{totalHab} completos</span>
            </div>

            <div className="col gap-2">
              {habitos.map(h => {
                const checked = !!dia.habitos?.[h.id];
                return (
                  <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div onClick={() => toggleHabito(h.id)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 14px', borderRadius: 'var(--r-md)', cursor: 'pointer',
                        background: checked ? 'color-mix(in oklch, #7FB68C 10%, var(--white))' : 'var(--bg-elevated)',
                        transition: 'all .15s',
                      }}>
                      <CheckRound checked={checked} onChange={() => toggleHabito(h.id)} cor="#7FB68C"/>
                      <span style={{ fontSize: 16 }}>{h.emoji}</span>
                      <span style={{
                        fontSize: 14, fontWeight: 500,
                        color: checked ? '#3A8C50' : 'var(--text-primary)',
                        textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.7 : 1,
                      }}>{h.nome}</span>
                    </div>
                    {!HABITOS_PADRAO.find(p => p.id === h.id) && (
                      <button onClick={() => removerHabito(h.id)}
                        style={{ padding: 6, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', opacity: 0.5 }}>
                        <Icon name="x" size={13}/>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Adicionar hábito */}
            {adicionando ? (
              <div className="row gap-2">
                <input className="input" style={{ flex: 1 }}
                  placeholder="Nome do hábito..."
                  value={novoHabito}
                  onChange={e => setNovoHabito(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') adicionarHabito(); if (e.key === 'Escape') setAdicionando(false); }}
                  autoFocus
                />
                <Button variant="primary" size="sm" onClick={adicionarHabito} disabled={!novoHabito.trim()}>
                  Adicionar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setAdicionando(false); setNovoHabito(''); }}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <button onClick={() => setAdicionando(true)}
                style={{
                  padding: '9px 14px', borderRadius: 'var(--r-md)',
                  border: '1.5px dashed var(--border-strong)',
                  background: 'transparent', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: 13,
                  fontFamily: 'var(--font-body)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                <Icon name="plus" size={13}/> Adicionar hábito
              </button>
            )}
          </CardBody>
        </Card>

        {/* Semana */}
        <SemanaView data={dataAtual} habitos={habitos}/>

      </div>
    </div>
  );
}

window.HabitosPage = HabitosPage;
window.loadHabitosHoje = loadDia;
window.saveHabitosHoje = saveDia;
window.META_AGUA_ML = META_AGUA_ML;
window.AGUA_OPCOES = AGUA_OPCOES;
