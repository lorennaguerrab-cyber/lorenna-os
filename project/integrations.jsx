/* ──────────────────────────────────────────────
   integrations.jsx — Supabase, Notion, Google, Canva
   ────────────────────────────────────────────── */

/* ─── Storage helpers ─── */
function getIntegration(id) {
  try { return JSON.parse(localStorage.getItem(`lorenna_integration_${id}`) || 'null'); } catch { return null; }
}
function saveIntegration(id, data) {
  localStorage.setItem(`lorenna_integration_${id}`, JSON.stringify({ ...data, connectedAt: new Date().toISOString() }));
}
function clearIntegration(id) {
  localStorage.removeItem(`lorenna_integration_${id}`);
}

/* ─── Integration definitions ─── */
const INTEGRATION_DEFS = {
  supabase: {
    id: 'supabase',
    name: 'Supabase',
    emoji: '⚡',
    color: '#3ECF8E',
    description: 'Banco de dados em tempo real. Salva tarefas, ideias, conteúdos e contatos permanentemente.',
    fields: [
      { key: 'url', label: 'Project URL', placeholder: 'https://xxxxxxxxxxx.supabase.co', type: 'url' },
      { key: 'anon_key', label: 'Anon/Public Key', placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI...', type: 'password' },
    ],
    howto: 'https://supabase.com/dashboard → Settings → API',
    capabilities: ['Tarefas persistentes', 'CRM real', 'Ideias salvas', 'Histórico financeiro'],
  },
  notion: {
    id: 'notion',
    name: 'Notion',
    emoji: '📓',
    color: '#000000',
    description: 'Exporta tarefas, ideias e briefs de clientes direto para o seu workspace.',
    fields: [
      { key: 'token', label: 'Integration Token', placeholder: 'secret_xxxxxxxxxxxxxxxxxxx', type: 'password' },
      { key: 'database_id', label: 'Database ID (opcional)', placeholder: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', type: 'text' },
    ],
    howto: 'notion.so → Settings → Integrations → New integration',
    capabilities: ['Exportar tarefas', 'Exportar briefs', 'Criar páginas de cliente', 'Banco de ideias'],
  },
  gcal: {
    id: 'gcal',
    name: 'Google Agenda',
    emoji: '📅',
    color: '#4285F4',
    description: 'Sincroniza sua agenda com Google Calendar — eventos reais no seu dashboard.',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'AIzaSy...', type: 'password' },
      { key: 'calendar_id', label: 'Calendar ID', placeholder: 'lorenna@gmail.com', type: 'text' },
    ],
    howto: 'console.cloud.google.com → APIs → Calendar API → Credentials',
    capabilities: ['Ver eventos hoje', 'Criar lembretes', 'Sincronizar compromissos', 'Bloquear tempo'],
  },
  gdrive: {
    id: 'gdrive',
    name: 'Google Drive',
    emoji: '💾',
    color: '#0F9D58',
    description: 'Acessa arquivos de clientes e faz upload de entregas direto do Córtex Lola.',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'AIzaSy...', type: 'password' },
      { key: 'folder_id', label: 'Pasta raiz (opcional)', placeholder: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms', type: 'text' },
    ],
    howto: 'console.cloud.google.com → APIs → Drive API → Credentials',
    capabilities: ['Anexar arquivos a clientes', 'Upload de entregas', 'Compartilhar com clientes', 'Biblioteca de assets'],
  },
  canva: {
    id: 'canva',
    name: 'Canva',
    emoji: '🎨',
    color: '#00C4CC',
    description: 'Abre e cria designs do Canva direto dos seus conteúdos e templates.',
    fields: [
      { key: 'api_key', label: 'API Key', placeholder: 'OAuthClientId...', type: 'password' },
    ],
    howto: 'canva.com/developers → Create an app',
    capabilities: ['Criar template de post', 'Abrir design existente', 'Galeria de assets', 'Templates de marca'],
  },
};

/* ─── IntegrationCard ─── */
function IntegrationCard({ defn }) {
  const [saved, setSaved] = useState(() => getIntegration(defn.id));
  const [editing, setEditing] = useState(!saved);
  const [form, setForm] = useState(() => {
    const existing = getIntegration(defn.id) || {};
    return Object.fromEntries(defn.fields.map(f => [f.key, existing[f.key] || '']));
  });

  function connect() {
    const hasValues = defn.fields.some(f => form[f.key]?.trim());
    if (!hasValues) { showToast('Preencha pelo menos um campo'); return; }
    saveIntegration(defn.id, form);
    setSaved(getIntegration(defn.id));
    setEditing(false);
    showToast(`${defn.name} conectado! ✓`);
  }

  function disconnect() {
    clearIntegration(defn.id);
    setSaved(null);
    setForm(Object.fromEntries(defn.fields.map(f => [f.key, ''])));
    setEditing(true);
    showToast(`${defn.name} desconectado.`);
  }

  return (
    <Card>
      <div style={{ height: 3, background: defn.color, borderRadius: 'var(--r-md) var(--r-md) 0 0' }}/>
      <CardBody className="col gap-4">
        {/* Header */}
        <div className="row between" style={{ alignItems: 'flex-start' }}>
          <div className="row gap-3">
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `color-mix(in oklch, ${defn.color} 14%, var(--bg-elevated))`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>{defn.emoji}</div>
            <div>
              <div className="row gap-2" style={{ alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 600 }}>{defn.name}</h3>
                {saved && (
                  <span className="tiny" style={{
                    padding: '2px 8px', borderRadius: 999,
                    background: 'color-mix(in oklch, #7FB68C 14%, transparent)',
                    color: '#5A9A6A', fontWeight: 600,
                  }}>● Conectado</span>
                )}
              </div>
              <p className="tiny muted" style={{ marginTop: 3 }}>{defn.description}</p>
            </div>
          </div>
          {saved && !editing && (
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>Editar</Button>
          )}
        </div>

        {/* Capabilities */}
        <div className="row gap-1" style={{ flexWrap: 'wrap' }}>
          {defn.capabilities.map(c => (
            <span key={c} className="tiny" style={{
              padding: '2px 8px', borderRadius: 999,
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}>{c}</span>
          ))}
        </div>

        {/* Fields */}
        {editing && (
          <div className="col gap-3" style={{
            padding: 'var(--s-4)', background: 'var(--bg-elevated)',
            borderRadius: 'var(--r-md)', border: '1px solid var(--border)',
          }}>
            {defn.fields.map(f => (
              <div key={f.key} className="col gap-1">
                <label className="tiny" style={{ fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                  {f.label}
                </label>
                <input
                  className="input"
                  type={f.type === 'password' ? 'password' : 'text'}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  style={{ fontSize: 12, fontFamily: f.type === 'password' ? 'ui-monospace, monospace' : 'var(--font-body)' }}
                />
              </div>
            ))}
            <p className="tiny muted" style={{ marginTop: 4 }}>
              🔑 Como obter: <a href={defn.howto} target="_blank" rel="noopener"
                style={{ color: defn.color }}>{defn.howto}</a>
            </p>
            <div className="row gap-2" style={{ marginTop: 4 }}>
              <Button variant="primary" onClick={connect}
                style={{ background: defn.color, borderColor: defn.color }}>
                Conectar {defn.name}
              </Button>
              {saved && (
                <Button variant="ghost" onClick={() => setEditing(false)}>Cancelar</Button>
              )}
              {saved && (
                <Button variant="ghost" onClick={disconnect}
                  style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>
                  Desconectar
                </Button>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/* ─── IntegrationPage ─── */
function IntegrationPage() {
  const connected = Object.values(INTEGRATION_DEFS).filter(d => getIntegration(d.id));

  return (
    <div className="content" style={{ maxWidth: 800 }}>
      <div className="col gap-5 fade-up">
        <PageHeader
          title="Integrações"
          subtitle="Conecte seus apps favoritos ao Córtex Lola"
        />

        {connected.length > 0 && (
          <div style={{
            padding: 'var(--s-4) var(--s-5)',
            background: 'color-mix(in oklch, #7FB68C 10%, var(--bg-surface))',
            border: '1px solid color-mix(in oklch, #7FB68C 25%, transparent)',
            borderRadius: 'var(--r-md)',
          }}>
            <div className="row gap-2">
              <span>🔗</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>
                {connected.length} {connected.length === 1 ? 'serviço conectado' : 'serviços conectados'}:
                {' '}{connected.map(d => d.name).join(', ')}
              </span>
            </div>
          </div>
        )}

        <div className="col gap-4">
          {Object.values(INTEGRATION_DEFS).map(defn => (
            <IntegrationCard key={defn.id} defn={defn} />
          ))}
        </div>

        <div style={{
          padding: 'var(--s-4)',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--r-md)',
          border: '1px solid var(--border)',
        }}>
          <p className="small" style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            🔒 <strong style={{ color: 'var(--text-primary)' }}>Segurança:</strong> Todas as credenciais são salvas apenas no seu navegador (<code>localStorage</code>). Nunca são enviadas para nenhum servidor externo. Use chaves com permissões mínimas necessárias.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Exported helpers for use in other pages ─── */
window.getIntegration = getIntegration;
window.IntegrationPage = IntegrationPage;

/* ─── Google Calendar helper ─── */
window.gcalFetchEvents = async function(calendarId, timeMin, timeMax) {
  const cfg = getIntegration('gcal');
  if (!cfg?.api_key) return null;
  const cal = calendarId || cfg.calendar_id || 'primary';
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(cal)}/events?key=${cfg.api_key}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.items || [];
  } catch { return null; }
};

/* ─── Notion export helper ─── */
window.notionCreatePage = async function(databaseId, properties, content) {
  const cfg = getIntegration('notion');
  if (!cfg?.token) return null;
  const dbId = databaseId || cfg.database_id;
  if (!dbId) return null;
  try {
    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cfg.token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        parent: { database_id: dbId },
        properties,
        children: content || [],
      }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
};

/* ─── Supabase helper ─── */
window.supabaseQuery = async function(table, method = 'GET', body = null) {
  const cfg = getIntegration('supabase');
  if (!cfg?.url || !cfg?.anon_key) return null;
  const url = `${cfg.url}/rest/v1/${table}`;
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'apikey': cfg.anon_key,
        'Authorization': `Bearer ${cfg.anon_key}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
};
