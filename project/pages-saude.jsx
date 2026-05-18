/* ──────────────────────────────────────────────
   pages-saude.jsx — Saúde: consultas, remédios, exames
   ────────────────────────────────────────────── */

const SAUDE_KEYS = {
  consultas: 'lorenna_saude_consultas',
  remedios:  'lorenna_saude_remedios',
  exames:    'lorenna_saude_exames',
};

function loadSaude(key) {
  try { return JSON.parse(localStorage.getItem(SAUDE_KEYS[key]) || '[]'); } catch { return []; }
}
function saveSaude(key, data) {
  localStorage.setItem(SAUDE_KEYS[key], JSON.stringify(data));
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
      <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>{label || 'Foto / Receita'}</label>
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
            color: 'var(--text-muted)', fontSize: 13,
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
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Título *</label>
              <input className="input" placeholder="Ex: Neurologia — Dr. Silva" value={form.titulo} onChange={e => f({ titulo: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Especialidade</label>
              <input className="input" placeholder="Neurologia, Psiquiatria..." value={form.especialidade} onChange={e => f({ especialidade: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Médico(a)</label>
              <input className="input" placeholder="Dr(a). Nome" value={form.medico} onChange={e => f({ medico: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Data</label>
              <input className="input" type="date" value={form.data} onChange={e => f({ data: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Horário</label>
              <input className="input" type="time" value={form.hora} onChange={e => f({ hora: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Local / Clínica</label>
              <input className="input" placeholder="Endereço ou nome da clínica" value={form.local} onChange={e => f({ local: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Status</label>
              <select className="select" value={form.status} onChange={e => f({ status: e.target.value })}>
                {Object.entries(STATUS_CONSULTA).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Anotações da consulta</label>
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
                <span style={{ padding: '2px 9px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: 'color-mix(in oklch, var(--pink-deep) 12%, transparent)', color: 'var(--pink-deep)' }}>
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
            <span style={{ padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: `color-mix(in oklch, ${color} 14%, transparent)`, color }}>{labels[item.status]}</span>
          </div>
        </div>
        {item.notas && <p className="small secondary" style={{ lineHeight: 1.5, borderLeft: `2px solid var(--border)`, paddingLeft: 10 }}>{item.notas.slice(0, 160)}{item.notas.length > 160 ? '...' : ''}</p>}
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
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Nome do remédio *</label>
              <input className="input" placeholder="Ex: Ritalina LA 30mg" value={form.nome} onChange={e => f({ nome: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Dosagem</label>
              <input className="input" placeholder="Ex: 30mg" value={form.dose} onChange={e => f({ dose: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Frequência</label>
              <input className="input" placeholder="Ex: 1x ao dia - manhã" value={form.frequencia} onChange={e => f({ frequencia: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Status</label>
              <select className="select" value={form.status} onChange={e => f({ status: e.target.value })}>
                {Object.entries(STATUS_REMEDIO).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
              </select>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Estoque atual</label>
              <input className="input" placeholder="Ex: 7 comprimidos" value={form.estoque} onChange={e => f({ estoque: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Validade da receita</label>
              <input className="input" type="date" value={form.validade_receita} onChange={e => f({ validade_receita: e.target.value })}/>
            </div>
            <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Observações</label>
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
    <Card hoverable style={{ borderLeft: `3px solid ${cfg.color}` }}>
      <CardBody className="col gap-3">
        <div className="row between" style={{ alignItems: 'flex-start' }}>
          <div className="grow">
            <div className="row gap-2" style={{ flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
              <p style={{ fontFamily: 'var(--font-title)', fontSize: 15, fontWeight: 600 }}>{item.nome}</p>
              {item.dose && <span className="tiny muted">{item.dose}</span>}
            </div>
            {item.frequencia && <p className="tiny muted">{item.frequencia}</p>}
          </div>
          <span style={{ padding: '3px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.color, flexShrink: 0 }}>
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
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Nome do exame *</label>
              <input className="input" placeholder="Ex: Hemograma completo" value={form.nome} onChange={e => f({ nome: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Solicitado em</label>
              <input className="input" type="date" value={form.solicitado_em} onChange={e => f({ solicitado_em: e.target.value })}/>
            </div>
            <div className="col gap-1">
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Realizado em</label>
              <input className="input" type="date" value={form.realizado_em} onChange={e => f({ realizado_em: e.target.value })}/>
            </div>
            <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Status</label>
              <select className="select" value={form.status} onChange={e => f({ status: e.target.value })}>
                <option value="pendente">Pendente</option>
                <option value="agendado">Agendado</option>
                <option value="realizado">Realizado</option>
              </select>
            </div>
            <div className="col gap-1" style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--gray)' }}>Observações / Resultado</label>
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

/* ── PAGE ─────────────────────── */
function SaudePage() {
  const [tab, setTab] = useState('urgente');
  const [consultas, setConsultas] = useState(() => loadSaude('consultas'));
  const [remedios, setRemedios] = useState(() => loadSaude('remedios'));
  const [exames, setExames] = useState(() => loadSaude('exames'));

  const [editingConsulta, setEditingConsulta] = useState(null);
  const [editingRemedio, setEditingRemedio] = useState(null);
  const [editingExame, setEditingExame] = useState(null);
  const [showNewConsulta, setShowNewConsulta] = useState(false);
  const [showNewRemedio, setShowNewRemedio] = useState(false);
  const [showNewExame, setShowNewExame] = useState(false);

  function saveConsulta(c) {
    const next = consultas.find(x => x.id === c.id)
      ? consultas.map(x => x.id === c.id ? c : x)
      : [c, ...consultas];
    setConsultas(next);
    saveSaude('consultas', next);
    showToast('Consulta salva!');
  }
  function deleteConsulta(id) {
    const next = consultas.filter(c => c.id !== id);
    setConsultas(next);
    saveSaude('consultas', next);
  }

  function saveRemedio(r) {
    const next = remedios.find(x => x.id === r.id)
      ? remedios.map(x => x.id === r.id ? r : x)
      : [r, ...remedios];
    setRemedios(next);
    saveSaude('remedios', next);
    showToast('Remédio salvo!');
  }
  function updateRemedioStatus(id, status) {
    const next = remedios.map(r => r.id === id ? { ...r, status } : r);
    setRemedios(next);
    saveSaude('remedios', next);
    showToast('Status atualizado!');
  }
  function deleteRemedio(id) {
    const next = remedios.filter(r => r.id !== id);
    setRemedios(next);
    saveSaude('remedios', next);
  }

  function saveExame(e) {
    const next = exames.find(x => x.id === e.id)
      ? exames.map(x => x.id === e.id ? e : x)
      : [e, ...exames];
    setExames(next);
    saveSaude('exames', next);
    showToast('Exame salvo!');
  }
  function deleteExame(id) {
    const next = exames.filter(e => e.id !== id);
    setExames(next);
    saveSaude('exames', next);
  }

  const precisoComprar = remedios.filter(r => r.status === 'preciso_comprar');
  const proximasConsultas = consultas
    .filter(c => c.status === 'agendada' && c.data)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 3);
  const examesPendentes = exames.filter(e => e.status === 'pendente' || e.status === 'agendado');

  const TABS = [
    { id: 'urgente', label: '🔔 Urgente' },
    { id: 'consultas', label: '🩺 Consultas' },
    { id: 'remedios', label: '💊 Remédios' },
    { id: 'exames', label: '🔬 Exames' },
  ];

  return (
    <div className="content">
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Saúde"
          subtitle="Consultas, remédios e exames — tudo em um lugar"
          action={
            <div className="row gap-2">
              {tab === 'consultas' && <Button variant="primary" onClick={() => setShowNewConsulta(true)}><Icon name="plus" size={14} color="white"/> Nova consulta</Button>}
              {tab === 'remedios'  && <Button variant="primary" onClick={() => setShowNewRemedio(true)}><Icon name="plus" size={14} color="white"/> Novo remédio</Button>}
              {tab === 'exames'    && <Button variant="primary" onClick={() => setShowNewExame(true)}><Icon name="plus" size={14} color="white"/> Novo exame</Button>}
              {tab === 'urgente'   && <Button variant="primary" onClick={() => setShowNewRemedio(true)}><Icon name="plus" size={14} color="white"/> Adicionar</Button>}
            </div>
          }
        />

        {/* Tabs */}
        <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                padding: '8px 16px', borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 500,
                background: tab === t.id ? 'var(--pink-tint)' : 'var(--bg-surface)',
                border: `1px solid ${tab === t.id ? 'var(--pink-soft)' : 'var(--border)'}`,
                color: tab === t.id ? 'var(--pink-deep)' : 'var(--text-secondary)',
                cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all .15s',
              }}>{t.label}</button>
          ))}
        </div>

        {/* URGENTE */}
        {tab === 'urgente' && (
          <div className="col gap-4">
            {precisoComprar.length === 0 && proximasConsultas.length === 0 && examesPendentes.length === 0 ? (
              <Card>
                <CardBody>
                  <div className="center col gap-3" style={{ padding: 'var(--s-6) 0' }}>
                    <span style={{ fontSize: 36 }}>✅</span>
                    <p className="small muted">Tudo em dia! Nenhuma pendência de saúde no momento.</p>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <>
                {precisoComprar.length > 0 && (
                  <Card style={{ borderLeft: '3px solid #C44878' }}>
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
                      <button onClick={() => setTab('remedios')} style={{ marginTop: 8, fontSize: 12, color: '#C44878', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                        Ver todos os remédios →
                      </button>
                    </CardBody>
                  </Card>
                )}

                {proximasConsultas.length > 0 && (
                  <Card style={{ borderLeft: '3px solid var(--pink)' }}>
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
                              <span style={{ fontSize: 13, fontWeight: 700, color: diff <= 3 ? 'var(--pink-deep)' : 'var(--text-secondary)' }}>
                                {diff === 0 ? 'Hoje!' : diff === 1 ? 'Amanhã' : `${diff}d`}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <button onClick={() => setTab('consultas')} style={{ marginTop: 8, fontSize: 12, color: 'var(--pink-deep)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                        Ver todas as consultas →
                      </button>
                    </CardBody>
                  </Card>
                )}

                {examesPendentes.length > 0 && (
                  <Card style={{ borderLeft: '3px solid #A89AC9' }}>
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
                            <span style={{ padding: '2px 9px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: 'color-mix(in oklch, #A89AC9 16%, transparent)', color: '#7B6FAA' }}>
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
        {tab === 'consultas' && (
          <div className="col gap-3">
            {consultas.length === 0 ? (
              <div className="center col gap-3" style={{ padding: 'var(--s-7) 0' }}>
                <span style={{ fontSize: 36 }}>🩺</span>
                <p className="small muted">Nenhuma consulta registrada ainda.</p>
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
        {tab === 'remedios' && (
          <div className="col gap-3">
            {remedios.length === 0 ? (
              <div className="center col gap-3" style={{ padding: 'var(--s-7) 0' }}>
                <span style={{ fontSize: 36 }}>💊</span>
                <p className="small muted">Nenhum remédio cadastrado.</p>
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
        {tab === 'exames' && (
          <div className="col gap-3">
            {exames.length === 0 ? (
              <div className="center col gap-3" style={{ padding: 'var(--s-7) 0' }}>
                <span style={{ fontSize: 36 }}>🔬</span>
                <p className="small muted">Nenhum exame registrado.</p>
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
                          padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
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
    </div>
  );
}

window.SaudePage = SaudePage;
