/* ──────────────────────────────────────────────
   pages-saude.jsx — Saúde: consultas, remédios, exames
   ────────────────────────────────────────────── */

const FAMILIA = [
  { id: 'lorenna',   nome: 'Lorenna',   emoji: '👩‍🦰', cor: '#fe7dae', idade: null },
  { id: 'jefferson', nome: 'Jefferson', emoji: '👨',   cor: '#f0bff8', idade: '31 anos' },
  { id: 'mateus',    nome: 'Mateus',    emoji: '👦',   cor: '#bce1f6', nascimento: '2018-09-08', idade: '7 anos' },
  { id: 'murilo',    nome: 'Murilo',    emoji: '👦',   cor: '#f1e18d', nascimento: '2018-09-08', idade: '7 anos' },
  { id: 'miguel',    nome: 'Miguel',    emoji: '👶',   cor: '#ffe1bd', nascimento: '2024-07-10', idade: '1 ano e 10 meses' },
];

function loadMembro(membro, tipo) {
  try { return JSON.parse(localStorage.getItem(`lorenna_saude_${membro}_${tipo}`) || '[]'); } catch { return []; }
}
function saveMembro(membro, tipo, data) {
  localStorage.setItem(`lorenna_saude_${membro}_${tipo}`, JSON.stringify(data));
}
function loadChat(membro) {
  try { return JSON.parse(localStorage.getItem(`lorenna_saude_${membro}_chat`) || '[]'); } catch { return []; }
}
function saveChat(membro, msgs) {
  localStorage.setItem(`lorenna_saude_${membro}_chat`, JSON.stringify(msgs));
}
function loadNotas(membro) {
  try { return JSON.parse(localStorage.getItem(`lorenna_saude_${membro}_notas`) || '[]'); } catch { return []; }
}
function saveNotas(membro, notas) {
  localStorage.setItem(`lorenna_saude_${membro}_notas`, JSON.stringify(notas));
}

async function compressPhoto(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 900 / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function PhotoUpload({ foto, onFoto, label }) {
  const ref = React.useRef(null);
  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const compressed = await compressPhoto(file);
    onFoto(compressed);
  }
  return (
    <div className="col gap-2">
      <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>{label || 'Foto / Receita'}</label>
      {foto ? (
        <div style={{ position: 'relative', width: '100%', maxWidth: 280 }}>
          <img src={foto} alt="receita" style={{ width: '100%', borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}/>
          <button onClick={() => onFoto(null)} style={{
            position: 'absolute', top: 6, right: 6, background: 'rgba(43,34,34,0.7)',
            border: 'none', borderRadius: 999, width: 24, height: 24,
            color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="x" size={11} color="white"/>
          </button>
        </div>
      ) : (
        <button onClick={() => ref.current?.click()}
          style={{
            padding: '12px 16px', borderRadius: 'var(--r-md)',
            border: '1.5px dashed var(--border-strong)',
            background: 'var(--bg-elevated)', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 14,
            fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 8,
          }}>
          <Icon name="camera" size={14}/> Adicionar foto
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile}/>
    </div>
  );
}

/* ── CONSULTAS ─────────────────────── */
function ConsultaModal({ item, onClose, onSave }) {
  const empty = { id: '', titulo: '', especialidade: '', medico: '', data: '', hora: '', local: '', status: 'agendada', notas: '', foto: null };
  const [form, setForm] = useState(item || empty);
  const f = v => setForm(p => ({ ...p, ...v }));
  const isNew = !item?.id;

  function salvar() {
    if (!form.titulo.trim()) { showToast('Preencha o título'); return; }
    onSave({ ...form, id: form.id || ('c-' + Date.now()) });
    onClose();
  }

  const STATUS_CONSULTA = { agendada: 'Agendada', realizada: 'Realizada', cancelada: 'Cancelada' };
  const STATUS_COLORS = { agendada: 'var(--pink)', realizada: '#7FB68C', cancelada: '#999' };

  return ReactDOM.createPortal(
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(43,34,34,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '24px', overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(640px, 96vw)', background: 'var(--white)',
        borderRadius: 'var(--r-xl)', border: '1px solid var(--gray-light)', overflow: 'hidden',
      }}>
        <div style={{ height: 4, background: 'var(--pink)' }}/>
        <div style={{ padding: 'var(--s-5)' }}>
          <div className="row between" style={{ marginBottom: 'var(--s-4)' }}>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 19, fontWeight: 700 }}>{isNew ? 'Nova consulta' : 'Editar consulta'}</h2>
            <Button variant="ghost" size="sm" className="icon" onClick={onClose}><Icon name="x" size={15}/></Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
            <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Título *</label>
              <input className="input" placeholder="Ex: Neurologia — Dr. Silva" value={form.titulo} onChange={e => f({ titulo: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Especialidade</label>
              <input className="input" placeholder="Neurologia, Psiquiatria..." value={form.especialidade} onChange={e => f({ especialidade: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Médico(a)</label>
              <input className="input" placeholder="Dr(a). Nome" value={form.medico} onChange={e => f({ medico: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Data</label>
              <input className="input" type="date" value={form.data} onChange={e => f({ data: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Horário</label>
              <input className="input" type="time" value={form.hora} onChange={e => f({ hora: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Local / Clínica</label>
              <input className="input" placeholder="Endereço ou nome da clínica" value={form.local} onChange={e => f({ local: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Status</label>
              <select className="select" value={form.status} onChange={e => f({ status: e.target.value })}>
                {Object.entries(STATUS_CONSULTA).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Anotações da consulta</label>
              <textarea className="textarea" rows={4} placeholder="Diagnóstico, orientações do médico, próximos passos..."
                value={form.notas} onChange={e => f({ notas: e.target.value })}/>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <PhotoUpload foto={form.foto} onFoto={foto => f({ foto })} label="Foto / Receita / Exame"/>
            </div>
          </div>
          <div className="row gap-2" style={{ marginTop: 'var(--s-4)' }}>
            <Button variant="primary" onClick={salvar}><Icon name="check" size={13} color="white"/> Salvar</Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </div>
        </div>
      </div>
    </div>
  , document.body);
}

function ConsultaCard({ item, onEdit, onDelete }) {
  const colors = { agendada: 'var(--pink)', realizada: '#7FB68C', cancelada: '#999' };
  const labels = { agendada: 'Agendada', realizada: 'Realizada', cancelada: 'Cancelada' };
  const color = colors[item.status] || '#999';

  function diasRestantes() {
    if (!item.data || item.status !== 'agendada') return null;
    const diff = Math.ceil((new Date(item.data + 'T00:00') - new Date()) / 86400000);
    if (diff < 0) return null;
    if (diff === 0) return 'Hoje!';
    if (diff === 1) return 'Amanhã';
    return `Em ${diff} dias`;
  }
  const restantes = diasRestantes();

  return (
    <Card hoverable>
      <CardBody className="col gap-3">
        <div className="row between" style={{ alignItems: 'flex-start' }}>
          <div className="grow">
            <div className="row gap-2" style={{ flexWrap: 'wrap', marginBottom: 4 }}>
              <p style={{ fontFamily: 'var(--font-title)', fontSize: 15, fontWeight: 600 }}>{item.titulo}</p>
              {restantes && (
                <span style={{ padding: '2px 9px', borderRadius: 999, fontSize: 14, fontWeight: 700, background: 'color-mix(in oklch, var(--pink-deep) 12%, transparent)', color: 'var(--pink-deep)' }}>
                  {restantes}
                </span>
              )}
            </div>
            <div className="row gap-3" style={{ flexWrap: 'wrap' }}>
              {item.data && <span className="tiny muted">{new Date(item.data + 'T00:00').toLocaleDateString('pt-BR')} {item.hora && `· ${item.hora}`}</span>}
              {item.local && <span className="tiny muted">{item.local}</span>}
            </div>
          </div>
          <div className="row gap-1">
            <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: 14, fontWeight: 600, background: `color-mix(in oklch, ${color} 14%, transparent)`, color }}>{labels[item.status]}</span>
          </div>
        </div>
        {item.notas && <p className="small secondary" style={{ lineHeight: 1.5, paddingLeft: 4 }}>{item.notas.slice(0, 160)}{item.notas.length > 160 ? '...' : ''}</p>}
        {item.foto && <img src={item.foto} alt="anexo" style={{ maxWidth: 200, borderRadius: 'var(--r-md)', border: '1px solid var(--border)' }}/>}
        <div className="row gap-2">
          <Button variant="ghost" size="sm" onClick={onEdit}><Icon name="pen" size={12}/> Editar</Button>
          <Button variant="ghost" size="sm" onClick={onDelete} style={{ color: 'var(--text-muted)' }}><Icon name="x" size={12}/></Button>
        </div>
      </CardBody>
    </Card>
  );
}

/* ── REMÉDIOS ─────────────────────── */
function RemedioModal({ item, onClose, onSave }) {
  const empty = { id: '', nome: '', dose: '', frequencia: '', status: 'preciso_comprar', estoque: '', validade_receita: '', notas: '', receita_foto: null };
  const [form, setForm] = useState(item || empty);
  const f = v => setForm(p => ({ ...p, ...v }));
  const isNew = !item?.id;

  function salvar() {
    if (!form.nome.trim()) { showToast('Preencha o nome do remédio'); return; }
    onSave({ ...form, id: form.id || ('r-' + Date.now()) });
    onClose();
  }

  const STATUS_REMEDIO = {
    preciso_comprar: 'Preciso comprar',
    comprando:       'Comprando',
    ativo:           'Tomando',
    finalizado:      'Finalizado',
  };

  return ReactDOM.createPortal(
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(43,34,34,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '24px', overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(600px, 96vw)', background: 'var(--white)',
        borderRadius: 'var(--r-xl)', border: '1px solid var(--gray-light)', overflow: 'hidden',
      }}>
        <div style={{ height: 4, background: '#E89B4C' }}/>
        <div style={{ padding: 'var(--s-5)' }}>
          <div className="row between" style={{ marginBottom: 'var(--s-4)' }}>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 19, fontWeight: 700 }}>{isNew ? 'Novo remédio' : 'Editar remédio'}</h2>
            <Button variant="ghost" size="sm" className="icon" onClick={onClose}><Icon name="x" size={15}/></Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
            <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Nome do remédio *</label>
              <input className="input" placeholder="Ex: Ritalina LA 30mg" value={form.nome} onChange={e => f({ nome: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Dosagem</label>
              <input className="input" placeholder="Ex: 30mg" value={form.dose} onChange={e => f({ dose: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Frequência</label>
              <input className="input" placeholder="Ex: 1x ao dia - manhã" value={form.frequencia} onChange={e => f({ frequencia: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Status</label>
              <select className="select" value={form.status} onChange={e => f({ status: e.target.value })}>
                {Object.entries(STATUS_REMEDIO).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Estoque atual</label>
              <input className="input" placeholder="Ex: 7 comprimidos" value={form.estoque} onChange={e => f({ estoque: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Validade da receita</label>
              <input className="input" type="date" value={form.validade_receita} onChange={e => f({ validade_receita: e.target.value })}/>
            </div>
            <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Observações</label>
              <textarea className="textarea" rows={2} placeholder="Tomar com água, evitar com cafeína..."
                value={form.notas} onChange={e => f({ notas: e.target.value })}/>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <PhotoUpload foto={form.receita_foto} onFoto={receita_foto => f({ receita_foto })} label="Foto da receita"/>
            </div>
          </div>
          <div className="row gap-2" style={{ marginTop: 'var(--s-4)' }}>
            <Button variant="primary" onClick={salvar}><Icon name="check" size={13} color="white"/> Salvar</Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </div>
        </div>
      </div>
    </div>
  , document.body);
}

function RemedioCard({ item, onEdit, onDelete, onStatus }) {
  const STATUS_REMEDIO = {
    preciso_comprar: { label: 'Preciso comprar', color: '#C44878', bg: 'color-mix(in oklch, #C44878 12%, transparent)' },
    comprando:       { label: 'Comprando',       color: '#E89B4C', bg: 'color-mix(in oklch, #E89B4C 12%, transparent)' },
    ativo:           { label: 'Tomando',         color: '#7FB68C', bg: 'color-mix(in oklch, #7FB68C 12%, transparent)' },
    finalizado:      { label: 'Finalizado',      color: '#999',    bg: 'var(--bg-elevated)' },
  };
  const cfg = STATUS_REMEDIO[item.status] || STATUS_REMEDIO.preciso_comprar;
  const nextStatus = { preciso_comprar: 'comprando', comprando: 'ativo', ativo: 'finalizado', finalizado: 'preciso_comprar' };
  const nextLabels = { preciso_comprar: '→ Comprei!', comprando: '→ Comecei a tomar', ativo: '→ Finalizado', finalizado: '→ Preciso comprar de novo' };

  return (
    <Card hoverable>
      <CardBody className="col gap-3">
        <div className="row between" style={{ alignItems: 'flex-start' }}>
          <div className="grow">
            <div className="row gap-2" style={{ flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
              <p style={{ fontFamily: 'var(--font-title)', fontSize: 15, fontWeight: 600 }}>{item.nome}</p>
              {item.dose && <span className="tiny muted">{item.dose}</span>}
            </div>
            {item.frequencia && <p className="tiny muted">{item.frequencia}</p>}
          </div>
          <span style={{ padding: '3px 11px', borderRadius: 999, fontSize: 14, fontWeight: 700, background: cfg.bg, color: cfg.color, flexShrink: 0 }}>
            {cfg.label}
          </span>
        </div>
        <div className="row gap-3" style={{ flexWrap: 'wrap' }}>
          {item.estoque && <span className="tiny" style={{ padding: '2px 8px', borderRadius: 999, background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>Estoque: {item.estoque}</span>}
          {item.validade_receita && <span className="tiny muted">Receita válida até {new Date(item.validade_receita + 'T00:00').toLocaleDateString('pt-BR')}</span>}
        </div>
        {item.notas && <p className="tiny secondary" style={{ lineHeight: 1.45 }}>{item.notas}</p>}
        {item.receita_foto && (
          <img src={item.receita_foto} alt="receita" style={{ maxWidth: 180, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', cursor: 'pointer' }}
            onClick={() => window.open(item.receita_foto)}/>
        )}
        <div className="row gap-2" style={{ flexWrap: 'wrap' }}>
          <Button variant="primary" size="sm" onClick={() => onStatus(nextStatus[item.status])}>
            {nextLabels[item.status]}
          </Button>
          <Button variant="ghost" size="sm" onClick={onEdit}><Icon name="pen" size={12}/></Button>
          <Button variant="ghost" size="sm" onClick={onDelete} style={{ color: 'var(--text-muted)' }}><Icon name="x" size={12}/></Button>
        </div>
      </CardBody>
    </Card>
  );
}

/* ── EXAMES ─────────────────────── */
function ExameModal({ item, onClose, onSave }) {
  const empty = { id: '', nome: '', solicitado_em: '', realizado_em: '', status: 'pendente', notas: '', resultado_foto: null };
  const [form, setForm] = useState(item || empty);
  const f = v => setForm(p => ({ ...p, ...v }));

  function salvar() {
    if (!form.nome.trim()) { showToast('Preencha o nome do exame'); return; }
    onSave({ ...form, id: form.id || ('e-' + Date.now()) });
    onClose();
  }

  return ReactDOM.createPortal(
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(43,34,34,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '24px', overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(560px, 96vw)', background: 'var(--white)',
        borderRadius: 'var(--r-xl)', border: '1px solid var(--gray-light)', overflow: 'hidden',
      }}>
        <div style={{ height: 4, background: '#A89AC9' }}/>
        <div style={{ padding: 'var(--s-5)' }}>
          <div className="row between" style={{ marginBottom: 'var(--s-4)' }}>
            <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 19, fontWeight: 700 }}>{!item?.id ? 'Novo exame' : 'Editar exame'}</h2>
            <Button variant="ghost" size="sm" className="icon" onClick={onClose}><Icon name="x" size={15}/></Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--s-3)' }}>
            <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Nome do exame *</label>
              <input className="input" placeholder="Ex: Hemograma completo" value={form.nome} onChange={e => f({ nome: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Solicitado em</label>
              <input className="input" type="date" value={form.solicitado_em} onChange={e => f({ solicitado_em: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Realizado em</label>
              <input className="input" type="date" value={form.realizado_em} onChange={e => f({ realizado_em: e.target.value })}/>
            </div>
            <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Status</label>
              <select className="select" value={form.status} onChange={e => f({ status: e.target.value })}>
                <option value="pendente">Pendente</option>
                <option value="agendado">Agendado</option>
                <option value="realizado">Realizado</option>
              </select>
            </div>
            <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Observações / Resultado</label>
              <textarea className="textarea" rows={3} placeholder="Resultado, valores de referência, observações do médico..."
                value={form.notas} onChange={e => f({ notas: e.target.value })}/>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <PhotoUpload foto={form.resultado_foto} onFoto={resultado_foto => f({ resultado_foto })} label="Foto do resultado"/>
            </div>
          </div>
          <div className="row gap-2" style={{ marginTop: 'var(--s-4)' }}>
            <Button variant="primary" onClick={salvar}><Icon name="check" size={13} color="white"/> Salvar</Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </div>
        </div>
      </div>
    </div>
  , document.body);
}

/* ── RELATÓRIO MODAL ─────────────────────── */
function RelatorioModal({ membro, onClose }) {
  const consultas = loadMembro(membro.id, 'consultas');
  const remedios  = loadMembro(membro.id, 'remedios');
  const exames    = loadMembro(membro.id, 'exames');
  const chat      = loadChat(membro.id);

  const dataGerado = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  function formatConsultas() {
    if (!consultas.length) return '  Nenhuma consulta registrada.\n';
    return consultas.map(c => {
      const lines = [`  • ${c.titulo}`];
      if (c.especialidade) lines.push(`    Especialidade: ${c.especialidade}`);
      if (c.medico) lines.push(`    Médico(a): ${c.medico}`);
      if (c.data) lines.push(`    Data: ${new Date(c.data + 'T00:00').toLocaleDateString('pt-BR')}${c.hora ? ` às ${c.hora}` : ''}`);
      if (c.local) lines.push(`    Local: ${c.local}`);
      lines.push(`    Status: ${{ agendada: 'Agendada', realizada: 'Realizada', cancelada: 'Cancelada' }[c.status] || c.status}`);
      if (c.notas) lines.push(`    Notas: ${c.notas}`);
      return lines.join('\n');
    }).join('\n\n') + '\n';
  }

  function formatRemedios() {
    if (!remedios.length) return '  Nenhum medicamento registrado.\n';
    return remedios.map(r => {
      const lines = [`  • ${r.nome}${r.dose ? ` (${r.dose})` : ''}`];
      if (r.frequencia) lines.push(`    Frequência: ${r.frequencia}`);
      const statusLabel = { preciso_comprar: 'Preciso comprar', comprando: 'Comprando', ativo: 'Tomando', finalizado: 'Finalizado' };
      lines.push(`    Status: ${statusLabel[r.status] || r.status}`);
      if (r.estoque) lines.push(`    Estoque: ${r.estoque}`);
      if (r.validade_receita) lines.push(`    Validade da receita: ${new Date(r.validade_receita + 'T00:00').toLocaleDateString('pt-BR')}`);
      if (r.notas) lines.push(`    Obs: ${r.notas}`);
      return lines.join('\n');
    }).join('\n\n') + '\n';
  }

  function formatExames() {
    if (!exames.length) return '  Nenhum exame registrado.\n';
    return exames.map(e => {
      const lines = [`  • ${e.nome}`];
      if (e.solicitado_em) lines.push(`    Solicitado em: ${new Date(e.solicitado_em + 'T00:00').toLocaleDateString('pt-BR')}`);
      if (e.realizado_em) lines.push(`    Realizado em: ${new Date(e.realizado_em + 'T00:00').toLocaleDateString('pt-BR')}`);
      lines.push(`    Status: ${{ pendente: 'Pendente', agendado: 'Agendado', realizado: 'Realizado' }[e.status] || e.status}`);
      if (e.notas) lines.push(`    Resultado/Obs: ${e.notas}`);
      return lines.join('\n');
    }).join('\n\n') + '\n';
  }

  function formatChat() {
    if (!chat.length) return '  Nenhum histórico de sintomas registrado.\n';
    return chat.map(m => {
      const role = m.role === 'user' ? 'Você' : 'Assistente IA';
      const ts = m.ts ? new Date(m.ts).toLocaleString('pt-BR') : '';
      return `  [${ts}] ${role}:\n  ${m.content}`;
    }).join('\n\n') + '\n';
  }

  function formatNotas() {
    const ns = loadNotas(membro.id);
    if (!ns.length) return '  Nenhuma anotação registrada.\n';
    return ns.map(n => {
      const ts = n.ts ? new Date(n.ts).toLocaleString('pt-BR') : '';
      return `  [${ts}]\n  ${n.texto}`;
    }).join('\n\n') + '\n';
  }

  const relatorio = [
    `RELATÓRIO DE SAÚDE — ${membro.nome.toUpperCase()}${membro.idade ? ` (${membro.idade})` : ''}`,
    `Gerado em: ${dataGerado}`,
    `${'─'.repeat(60)}`,
    '',
    'CONSULTAS MÉDICAS',
    '─'.repeat(40),
    formatConsultas(),
    'MEDICAMENTOS',
    '─'.repeat(40),
    formatRemedios(),
    'EXAMES',
    '─'.repeat(40),
    formatExames(),
    'ANOTAÇÕES DE SAÚDE',
    '─'.repeat(40),
    formatNotas(),
    `${'─'.repeat(60)}`,
    `Fim do relatório`,
  ].join('\n');

  function copiar() {
    navigator.clipboard.writeText(relatorio).then(() => {
      showToast('Relatório copiado!');
    }).catch(() => {
      showToast('Erro ao copiar. Selecione o texto manualmente.');
    });
  }

  const content = (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(43,34,34,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      padding: '24px', overflowY: 'auto',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(720px, 96vw)', background: 'var(--white)',
        borderRadius: 'var(--r-xl)', border: '1px solid var(--gray-light)', overflow: 'hidden',
      }}>
        <div style={{ height: 4, background: 'var(--pink)' }}/>
        <div style={{ padding: 'var(--s-5)' }}>
          <div className="row between" style={{ marginBottom: 'var(--s-4)', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 19, fontWeight: 700 }}>
                Relatório de Saúde — {membro.emoji} {membro.nome}
              </h2>
              <p className="tiny muted" style={{ marginTop: 2 }}>Gerado em {dataGerado}</p>
            </div>
            <div className="row gap-2">
              <Button variant="primary" size="sm" onClick={copiar}>
                <Icon name="copy" size={13} color="white"/> Copiar relatório
              </Button>
              <Button variant="ghost" size="sm" className="icon" onClick={onClose}>
                <Icon name="x" size={15}/>
              </Button>
            </div>
          </div>
          <pre style={{
            background: 'var(--bg-elevated)', borderRadius: 'var(--r-md)',
            border: '1px solid var(--border)', padding: 'var(--s-4)',
            fontSize: 13, lineHeight: 1.7, fontFamily: 'monospace',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
            maxHeight: '60vh', overflowY: 'auto',
            color: 'var(--text-primary)',
          }}>
            {relatorio}
          </pre>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}

/* ── SAÚDE NOTAS ─────────────────────── */
function SaudeNotas({ membro, onRelatorio }) {
  const [notas, setNotas] = React.useState(() => loadNotas(membro.id));
  const [input, setInput] = React.useState('');

  React.useEffect(() => {
    setNotas(loadNotas(membro.id));
  }, [membro.id]);

  function salvar() {
    if (!input.trim()) return;
    const nota = { id: Date.now(), texto: input.trim(), ts: Date.now() };
    const next = [nota, ...notas];
    setNotas(next);
    saveNotas(membro.id, next);
    setInput('');
    showToast('Anotação salva!');
  }

  function deletar(id) {
    const next = notas.filter(n => n.id !== id);
    setNotas(next);
    saveNotas(membro.id, next);
  }

  return (
    <div className="col gap-4">
      <Card>
        <CardBody className="col gap-3">
          <div className="row between" style={{ alignItems: 'center' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 2 }}>Nova anotação — {membro.emoji} {membro.nome}</div>
              <p className="tiny muted">Sintomas, consultas, observações, medicação nova…</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onRelatorio}>
              <Icon name="file-text" size={13}/> Relatório
            </Button>
          </div>
          <textarea
            className="textarea"
            placeholder="Ex: Dor de cabeça há 2 dias, tomou dipirona 500mg…"
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={3}
            onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') salvar(); }}
          />
          <div className="row between">
            <span className="tiny muted">⌘ + Enter para salvar</span>
            <Button variant="primary" onClick={salvar} disabled={!input.trim()}>
              <Icon name="check" size={13} color="white"/> Salvar
            </Button>
          </div>
        </CardBody>
      </Card>

      {notas.length === 0 ? (
        <div className="col gap-3" style={{ padding: 'var(--s-6) 0', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ fontSize: 36 }}>📝</span>
          <p className="small muted">Nenhuma anotação registrada ainda para {membro.nome}.</p>
        </div>
      ) : (
        <div className="col gap-2">
          {notas.map(n => (
            <Card key={n.id}>
              <CardBody>
                <div className="row between" style={{ alignItems: 'flex-start', gap: 12 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.6, flex: 1, color: 'var(--text-primary)' }}>{n.texto}</p>
                  <button onClick={() => deletar(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, flexShrink: 0 }}>
                    <Icon name="x" size={12}/>
                  </button>
                </div>
                <span className="tiny muted" style={{ display: 'block', marginTop: 6 }}>
                  {new Date(n.ts).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · {new Date(n.ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── CARDÁPIO SEMANAL ─────────────────────── */
const DIAS_CARDAPIO = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const REFEICOES = [
  { id: 'cafe',   label: 'Café',    icon: '☕' },
  { id: 'almoco', label: 'Almoço',  icon: '🍽' },
  { id: 'lanche', label: 'Lanche',  icon: '🍎' },
  { id: 'jantar', label: 'Jantar',  icon: '🌙' },
];
const DEFAULT_MEALS = {
  cafe:   ['Tapioca com queijo', 'Pão + ovo mexido', 'Vitamina de banana', 'Iogurte + granola', 'Cuscuz + ovo', 'Panqueca simples', 'Bolo de cenoura'],
  almoco: ['Arroz, feijão + frango grelhado', 'Macarrão ao molho', 'Arroz, feijão + carne moída', 'Arroz, feijão + peixe', 'Frango assado + batata', 'Omelete + arroz', 'Sopa de legumes'],
  lanche: ['Fruta + iogurte', 'Biscoito + suco', 'Fruta da estação', 'Bolo caseiro', 'Torrada + geleia', 'Vitamina de frutas', 'Pipoca'],
  jantar: ['Sopa de legumes', 'Omelete + salada', 'Macarrão simples', 'Panqueca de frango', 'Arroz + frango', 'Caldo de feijão', 'Torrada + ovo'],
};

function CardapioSemanal() {
  const [refeicoes, setRefeicoes] = useState(() => {
    try {
      const saved = localStorage.getItem('lorenna_cardapio');
      if (saved) return JSON.parse(saved);
    } catch {}
    const d = {};
    REFEICOES.forEach(r => {
      d[r.id] = DIAS_CARDAPIO.map((_, i) => DEFAULT_MEALS[r.id][i] || '');
    });
    return d;
  });

  function updateCell(refeicao, diaIdx, val) {
    const next = { ...refeicoes, [refeicao]: refeicoes[refeicao].map((v, i) => i === diaIdx ? val : v) };
    setRefeicoes(next);
    localStorage.setItem('lorenna_cardapio', JSON.stringify(next));
  }

  function gerarPrompt() {
    const notas = FAMILIA.map(m => {
      try { const n = JSON.parse(localStorage.getItem(`lorenna_saude_${m.id}_notas`) || '[]'); return n.length > 0 ? `${m.nome}: ${n.slice(0,3).map(x=>x.texto).join('; ')}` : null; } catch { return null; }
    }).filter(Boolean).join('\n');

    const cardapioAtual = DIAS_CARDAPIO.map((dia, i) =>
      `${dia}: ${REFEICOES.map(r => `${r.label}: ${refeicoes[r.id][i]}`).join(' | ')}`
    ).join('\n');

    const prompt = `Família: Lorenna (adulta), Jefferson (31 anos), Mateus e Murilo (gêmeos, 7 anos), Miguel (1 ano e 10 meses)

Observações de saúde:
${notas || 'Nenhuma observação registrada'}

Cardápio atual:
${cardapioAtual}

Por favor, sugira um cardápio semanal completo (café da manhã, almoço, lanche e jantar) para toda a família.
Considere:
- Refeições rápidas e fáceis de preparar (até 30 min)
- Custo acessível (ingredientes simples do cotidiano)
- Adequadas para crianças de 7 anos e bebê de quase 2 anos
- Variadas e nutritivas

Retorne em formato de tabela com os 7 dias da semana e as 4 refeições.`;

    navigator.clipboard.writeText(prompt).then(() => showToast('Prompt copiado! Cole no Claude.ai ou ChatGPT'));
  }

  return (
    <div className="col gap-4">
      <div className="row between" style={{ alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>Cardápio da semana</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 2 }}>Edite diretamente nas células · salvo automaticamente</div>
        </div>
        <Button variant="ghost" onClick={gerarPrompt}><Icon name="copy" size={14}/> Gerar prompt para IA</Button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(7, 1fr)', gap: 6, minWidth: 600 }}>
          {/* Header row */}
          <div />
          {DIAS_CARDAPIO.map(d => (
            <div key={d} style={{ fontSize: 13, fontWeight: 500, textAlign: 'center', color: 'var(--text-muted)', paddingBottom: 4 }}>{d}</div>
          ))}

          {/* Meal rows */}
          {REFEICOES.map(r => (
            <React.Fragment key={r.id}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', paddingTop: 8 }}>
                <div style={{ fontSize: 16 }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginTop: 2 }}>{r.label}</div>
              </div>
              {DIAS_CARDAPIO.map((_, i) => (
                <textarea
                  key={i}
                  value={refeicoes[r.id][i]}
                  onChange={e => updateCell(r.id, i, e.target.value)}
                  style={{
                    fontSize: 13, minHeight: 68, padding: '7px 9px',
                    background: 'var(--offwhite)', borderRadius: 8, border: 'none', outline: 'none',
                    resize: 'none', width: '100%', fontFamily: 'var(--font-body)',
                    color: 'var(--ink)', lineHeight: 1.5, boxSizing: 'border-box',
                  }}
                />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── PAGE ─────────────────────── */
function SaudePage() {
  const [membro, setMembro] = useState(FAMILIA[0]);
  const [subTab, setSubTab] = useState('notas');
  const [consultas, setConsultas] = useState(() => loadMembro(FAMILIA[0].id, 'consultas'));
  const [remedios, setRemedios] = useState(() => loadMembro(FAMILIA[0].id, 'remedios'));
  const [exames, setExames] = useState(() => loadMembro(FAMILIA[0].id, 'exames'));

  const [editingConsulta, setEditingConsulta] = useState(null);
  const [editingRemedio, setEditingRemedio] = useState(null);
  const [editingExame, setEditingExame] = useState(null);
  const [showNewConsulta, setShowNewConsulta] = useState(false);
  const [showNewRemedio, setShowNewRemedio] = useState(false);
  const [showNewExame, setShowNewExame] = useState(false);
  const [showRelatorio, setShowRelatorio] = useState(false);

  function switchMembro(m) {
    setMembro(m);
    setConsultas(loadMembro(m.id, 'consultas'));
    setRemedios(loadMembro(m.id, 'remedios'));
    setExames(loadMembro(m.id, 'exames'));
    setSubTab('notas');
  }

  function saveConsulta(c) {
    const next = consultas.find(x => x.id === c.id)
      ? consultas.map(x => x.id === c.id ? c : x)
      : [c, ...consultas];
    setConsultas(next);
    saveMembro(membro.id, 'consultas', next);
    showToast('Consulta salva!');
  }
  function deleteConsulta(id) {
    const next = consultas.filter(c => c.id !== id);
    setConsultas(next);
    saveMembro(membro.id, 'consultas', next);
  }

  function saveRemedio(r) {
    const next = remedios.find(x => x.id === r.id)
      ? remedios.map(x => x.id === r.id ? r : x)
      : [r, ...remedios];
    setRemedios(next);
    saveMembro(membro.id, 'remedios', next);
    showToast('Remédio salvo!');
  }
  function updateRemedioStatus(id, status) {
    const next = remedios.map(r => r.id === id ? { ...r, status } : r);
    setRemedios(next);
    saveMembro(membro.id, 'remedios', next);
    showToast('Status atualizado!');
  }
  function deleteRemedio(id) {
    const next = remedios.filter(r => r.id !== id);
    setRemedios(next);
    saveMembro(membro.id, 'remedios', next);
  }

  function saveExame(e) {
    const next = exames.find(x => x.id === e.id)
      ? exames.map(x => x.id === e.id ? e : x)
      : [e, ...exames];
    setExames(next);
    saveMembro(membro.id, 'exames', next);
    showToast('Exame salvo!');
  }
  function deleteExame(id) {
    const next = exames.filter(e => e.id !== id);
    setExames(next);
    saveMembro(membro.id, 'exames', next);
  }

  const precisoComprar = remedios.filter(r => r.status === 'preciso_comprar');
  const proximasConsultas = consultas
    .filter(c => c.status === 'agendada' && c.data)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 3);
  const examesPendentes = exames.filter(e => e.status === 'pendente' || e.status === 'agendado');

  const SUB_TABS = [
    { id: 'notas',     label: 'Anotações' },
    { id: 'resumo',    label: 'Resumo' },
    { id: 'consultas', label: 'Consultas' },
    { id: 'remedios',  label: 'Remédios' },
    { id: 'exames',    label: 'Exames' },
    { id: 'cardapio',  label: 'Cardápio' },
  ];

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Saúde"
          subtitle="Consultas, remédios e exames — tudo em um lugar"
          action={
            <div className="row gap-2">
              {subTab === 'consultas' && <Button variant="primary" onClick={() => setShowNewConsulta(true)}><Icon name="plus" size={14} color="white"/> Nova consulta</Button>}
              {subTab === 'remedios'  && <Button variant="primary" onClick={() => setShowNewRemedio(true)}><Icon name="plus" size={14} color="white"/> Novo remédio</Button>}
              {subTab === 'exames'    && <Button variant="primary" onClick={() => setShowNewExame(true)}><Icon name="plus" size={14} color="white"/> Novo exame</Button>}
              {subTab === 'resumo'    && <Button variant="primary" onClick={() => setShowNewRemedio(true)}><Icon name="plus" size={14} color="white"/> Adicionar</Button>}
              {subTab === 'notas'     && <Button variant="ghost" onClick={() => setShowRelatorio(true)}><Icon name="file-text" size={14}/> Relatório</Button>}
              {subTab === 'cardapio'  && <Button variant="ghost" onClick={() => setSubTab('notas')}><Icon name="x" size={14}/> Fechar</Button>}
            </div>
          }
        />

        {/* Family member picker */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12 }}>
          {FAMILIA.map(m => {
            const ativo = membro.id === m.id;
            return (
              <button
                key={m.id}
                onClick={() => switchMembro(m)}
                style={{
                  padding: '16px 12px',
                  borderRadius: 'var(--r-md)',
                  fontSize: 15,
                  fontWeight: ativo ? 700 : 500,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  transition: 'all .15s',
                  border: `2px solid ${ativo ? m.cor : 'var(--border)'}`,
                  background: ativo ? m.cor : 'var(--bg-elevated)',
                  color: '#201e1f',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 28, lineHeight: 1 }}>{m.emoji}</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: ativo ? 700 : 600 }}>{m.nome}</div>
                  {m.idade && <div style={{ fontSize: 13, opacity: 0.65, marginTop: 2 }}>{m.idade}</div>}
                </div>
                {ativo && (
                  <div style={{
                    fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 999,
                    background: 'rgba(32,30,31,.12)', color: '#201e1f',
                    textTransform: 'uppercase', letterSpacing: '.05em',
                  }}>Selecionado</div>
                )}
              </button>
            );
          })}
        </div>

        {/* Sub-tabs */}
        <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
          {SUB_TABS.map(t => (
            <button key={t.id} onClick={() => setSubTab(t.id)}
              style={{
                padding: '8px 16px', borderRadius: 'var(--r-md)', fontSize: 14, fontWeight: 500,
                background: subTab === t.id ? 'var(--pink-tint)' : 'var(--bg-surface)',
                border: `1px solid ${subTab === t.id ? 'var(--pink-soft)' : 'var(--border)'}`,
                color: subTab === t.id ? 'var(--pink-deep)' : 'var(--text-secondary)',
                cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all .15s',
              }}>{t.label}</button>
          ))}
        </div>

        {/* ANOTAÇÕES */}
        {subTab === 'notas' && (
          <SaudeNotas membro={membro} onRelatorio={() => setShowRelatorio(true)}/>
        )}

        {/* RESUMO */}
        {subTab === 'resumo' && (
          <div className="col gap-4">
            {precisoComprar.length === 0 && proximasConsultas.length === 0 && examesPendentes.length === 0 ? (
              <Card>
                <CardBody>
                  <div className="center col gap-3" style={{ padding: 'var(--s-6) 0' }}>
                    <span style={{ fontSize: 36 }}>✅</span>
                    <p className="small muted">Tudo em dia! Nenhuma pendência de saúde no momento para {membro.nome}.</p>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <>
                {precisoComprar.length > 0 && (
                  <Card>
                    <CardBody>
                      <div className="row gap-2" style={{ marginBottom: 'var(--s-3)' }}>
                        <span style={{ fontSize: 18 }}>💊</span>
                        <div>
                          <div className="eyebrow" style={{ color: '#C44878' }}>Remédios para comprar</div>
                          <p className="tiny muted">{precisoComprar.length} medicamento{precisoComprar.length > 1 ? 's' : ''} precisando ser comprado{precisoComprar.length > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      <div className="col gap-2">
                        {precisoComprar.map(r => (
                          <div key={r.id} className="row between" style={{
                            padding: '10px 14px', borderRadius: 'var(--r-md)',
                            background: 'color-mix(in oklch, #C44878 6%, var(--bg-surface))',
                            border: '1px solid color-mix(in oklch, #C44878 20%, transparent)',
                          }}>
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 600 }}>{r.nome}</p>
                              {r.dose && <p className="tiny muted">{r.dose}{r.frequencia ? ` · ${r.frequencia}` : ''}</p>}
                            </div>
                            <Button variant="primary" size="sm" onClick={() => updateRemedioStatus(r.id, 'comprando')}>
                              Comprei ✓
                            </Button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setSubTab('remedios')} style={{ marginTop: 8, fontSize: 14, color: '#C44878', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                        Ver todos os remédios →
                      </button>
                    </CardBody>
                  </Card>
                )}

                {proximasConsultas.length > 0 && (
                  <Card>
                    <CardBody>
                      <div className="row gap-2" style={{ marginBottom: 'var(--s-3)' }}>
                        <span style={{ fontSize: 18 }}>🩺</span>
                        <div className="eyebrow" style={{ color: 'var(--pink-deep)' }}>Próximas consultas</div>
                      </div>
                      <div className="col gap-2">
                        {proximasConsultas.map(c => {
                          const diff = Math.ceil((new Date(c.data + 'T00:00') - new Date()) / 86400000);
                          return (
                            <div key={c.id} className="row between" style={{
                              padding: '10px 14px', borderRadius: 'var(--r-md)',
                              background: 'var(--pink-tint)', border: '1px solid var(--pink-soft)',
                            }}>
                              <div>
                                <p style={{ fontSize: 14, fontWeight: 600 }}>{c.titulo}</p>
                                <p className="tiny muted">{new Date(c.data + 'T00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} {c.hora && `· ${c.hora}`}</p>
                              </div>
                              <span style={{ fontSize: 14, fontWeight: 700, color: diff <= 3 ? 'var(--pink-deep)' : 'var(--text-secondary)' }}>
                                {diff === 0 ? 'Hoje!' : diff === 1 ? 'Amanhã' : `${diff}d`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <button onClick={() => setSubTab('consultas')} style={{ marginTop: 8, fontSize: 14, color: 'var(--pink-deep)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                        Ver todas as consultas →
                      </button>
                    </CardBody>
                  </Card>
                )}

                {examesPendentes.length > 0 && (
                  <Card>
                    <CardBody>
                      <div className="row gap-2" style={{ marginBottom: 'var(--s-3)' }}>
                        <span style={{ fontSize: 18 }}>🔬</span>
                        <div className="eyebrow" style={{ color: '#A89AC9' }}>Exames pendentes</div>
                      </div>
                      <div className="col gap-2">
                        {examesPendentes.map(e => (
                          <div key={e.id} className="row between" style={{
                            padding: '10px 14px', borderRadius: 'var(--r-md)',
                            background: 'color-mix(in oklch, #A89AC9 8%, var(--bg-surface))',
                            border: '1px solid color-mix(in oklch, #A89AC9 22%, transparent)',
                          }}>
                            <p style={{ fontSize: 14, fontWeight: 600 }}>{e.nome}</p>
                            <span style={{ padding: '2px 9px', borderRadius: 999, fontSize: 14, fontWeight: 600, background: 'color-mix(in oklch, #A89AC9 16%, transparent)', color: '#7B6FAA' }}>
                              {e.status === 'pendente' ? 'Pendente' : 'Agendado'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {/* CONSULTAS */}
        {subTab === 'consultas' && (
          <div className="col gap-3">
            {consultas.length === 0 ? (
              <div className="center col gap-3" style={{ padding: 'var(--s-7) 0' }}>
                <span style={{ fontSize: 36 }}>🩺</span>
                <p className="small muted">Nenhuma consulta registrada ainda para {membro.nome}.</p>
                <Button variant="primary" onClick={() => setShowNewConsulta(true)}>
                  <Icon name="plus" size={13} color="white"/> Adicionar consulta
                </Button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--s-3)' }}>
                {consultas.map(c => (
                  <ConsultaCard key={c.id} item={c}
                    onEdit={() => setEditingConsulta(c)}
                    onDelete={() => deleteConsulta(c.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* REMÉDIOS */}
        {subTab === 'remedios' && (
          <div className="col gap-3">
            {remedios.length === 0 ? (
              <div className="center col gap-3" style={{ padding: 'var(--s-7) 0' }}>
                <span style={{ fontSize: 36 }}>💊</span>
                <p className="small muted">Nenhum remédio cadastrado para {membro.nome}.</p>
                <Button variant="primary" onClick={() => setShowNewRemedio(true)}>
                  <Icon name="plus" size={13} color="white"/> Adicionar remédio
                </Button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--s-3)' }}>
                {remedios.map(r => (
                  <RemedioCard key={r.id} item={r}
                    onEdit={() => setEditingRemedio(r)}
                    onDelete={() => deleteRemedio(r.id)}
                    onStatus={status => updateRemedioStatus(r.id, status)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* EXAMES */}
        {subTab === 'exames' && (
          <div className="col gap-3">
            {exames.length === 0 ? (
              <div className="center col gap-3" style={{ padding: 'var(--s-7) 0' }}>
                <span style={{ fontSize: 36 }}>🔬</span>
                <p className="small muted">Nenhum exame registrado para {membro.nome}.</p>
                <Button variant="primary" onClick={() => setShowNewExame(true)}>
                  <Icon name="plus" size={13} color="white"/> Adicionar exame
                </Button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 'var(--s-3)' }}>
                {exames.map(e => (
                  <Card key={e.id} hoverable>
                    <CardBody className="col gap-3">
                      <div className="row between">
                        <p style={{ fontFamily: 'var(--font-title)', fontSize: 15, fontWeight: 600 }}>{e.nome}</p>
                        <span style={{
                          padding: '2px 10px', borderRadius: 999, fontSize: 14, fontWeight: 600,
                          background: e.status === 'realizado' ? 'color-mix(in oklch, #7FB68C 14%, transparent)' : 'color-mix(in oklch, #A89AC9 14%, transparent)',
                          color: e.status === 'realizado' ? '#2E6B42' : '#7B6FAA',
                        }}>
                          {e.status === 'pendente' ? 'Pendente' : e.status === 'agendado' ? 'Agendado' : 'Realizado'}
                        </span>
                      </div>
                      <div className="row gap-3">
                        {e.solicitado_em && <span className="tiny muted">Solicitado: {new Date(e.solicitado_em + 'T00:00').toLocaleDateString('pt-BR')}</span>}
                        {e.realizado_em && <span className="tiny muted">Realizado: {new Date(e.realizado_em + 'T00:00').toLocaleDateString('pt-BR')}</span>}
                      </div>
                      {e.notas && <p className="small secondary" style={{ lineHeight: 1.5 }}>{e.notas.slice(0, 120)}{e.notas.length > 120 ? '...' : ''}</p>}
                      {e.resultado_foto && (
                        <img src={e.resultado_foto} alt="resultado" style={{ maxWidth: 180, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', cursor: 'pointer' }}
                          onClick={() => window.open(e.resultado_foto)}/>
                      )}
                      <div className="row gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingExame(e)}><Icon name="pen" size={12}/> Editar</Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteExame(e.id)} style={{ color: 'var(--text-muted)' }}><Icon name="x" size={12}/></Button>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {showNewConsulta  && <ConsultaModal item={null} onClose={() => setShowNewConsulta(false)}  onSave={saveConsulta}/>}
      {editingConsulta  && <ConsultaModal item={editingConsulta}  onClose={() => setEditingConsulta(null)}  onSave={saveConsulta}/>}
      {showNewRemedio   && <RemedioModal  item={null} onClose={() => setShowNewRemedio(false)}   onSave={saveRemedio}/>}
      {editingRemedio   && <RemedioModal  item={editingRemedio}   onClose={() => setEditingRemedio(null)}   onSave={saveRemedio}/>}
      {showNewExame     && <ExameModal    item={null} onClose={() => setShowNewExame(false)}     onSave={saveExame}/>}
      {editingExame     && <ExameModal    item={editingExame}     onClose={() => setEditingExame(null)}     onSave={saveExame}/>}
      {showRelatorio && <RelatorioModal membro={membro} onClose={() => setShowRelatorio(false)}/>}

      {subTab === 'cardapio' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(32,30,31,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '60px 24px', overflowY: 'auto' }}
          onClick={() => setSubTab('notas')}>
          <div onClick={e => e.stopPropagation()} style={{ width: 'min(1100px, 96vw)', background: 'var(--white)', borderRadius: 20, padding: 28 }}>
            <div className="row between" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 17, fontWeight: 500, fontFamily: 'var(--font-title)' }}>Cardápio Semanal</div>
              <button onClick={() => setSubTab('notas')} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><Icon name="x" size={16}/></button>
            </div>
            <CardapioSemanal />
          </div>
        </div>
      )}
    </div>
  );
}

window.SaudePage = SaudePage;
