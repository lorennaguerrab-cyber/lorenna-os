/* ──────────────────────────────────────────────
   pages-diario.jsx — Diário Terapêutico
   ────────────────────────────────────────────── */

const { useState, useEffect } = React;

const DIARIO_KEY = 'lorenna_diario_entries';

function loadEntries() {
  try { return JSON.parse(localStorage.getItem(DIARIO_KEY) || '[]'); }
  catch { return []; }
}
function persistEntries(list) {
  localStorage.setItem(DIARIO_KEY, JSON.stringify(list));
}
function todayStr() {
  return new Date().toISOString().split('T')[0];
}
function nowHora() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function humorEmoji(v) {
  if (v <= 3) return '😔';
  if (v <= 5) return '😐';
  if (v <= 7) return '🙂';
  if (v <= 9) return '😊';
  return '🌟';
}
function humorColor(v) {
  if (v <= 3) return '#A89AC9';
  if (v <= 6) return '#E8A87C';
  if (v <= 8) return 'var(--pink)';
  return '#7FB68C';
}

function FieldLabel({ children }) {
  return (
    <div style={{
      fontSize: 14, fontWeight: 500, letterSpacing: '0.06em',
      textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6,
    }}>
      {children}
    </div>
  );
}

function DiaryTextarea({ label, value, onChange, placeholder, minHeight = 72 }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', minHeight,
          padding: '10px 12px',
          fontSize: 15, color: 'var(--ink)',
          background: 'var(--offwhite)',
          border: '1.5px solid var(--pink-soft)',
          borderRadius: 10, resize: 'vertical', outline: 'none',
          boxSizing: 'border-box', lineHeight: 1.6, transition: 'border-color .2s',
          fontFamily: 'var(--font-body)',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--pink)'}
        onBlur={e => e.target.style.borderColor = 'var(--pink-soft)'}
      />
    </div>
  );
}

/* ── Today's entry form ── */
function HojeView() {
  const today = todayStr();
  // Load the most recent entry for today (if exists) to pre-fill
  const existing = loadEntries().find(e => e.data === today && !e._editId);
  const [entryId] = useState(() => existing?.id ?? `d_${Date.now()}`);
  const isEditing = !!existing;

  const [humor, setHumor]       = useState(existing?.humor    ?? 5);
  const [pesou, setPesou]       = useState(existing?.pesou    ?? '');
  const [bom, setBom]           = useState(existing?.bom      ?? '');
  const [corpo, setCorpo]       = useState(existing?.corpo    ?? '');
  const [relacoes, setRelacoes] = useState(existing?.relacoes ?? '');
  const [gatilho, setGatilho]   = useState(existing?.gatilho  ?? '');
  const [terapia, setTerapia]   = useState(existing?.terapia  ?? '');
  const [livre, setLivre]       = useState(existing?.livre    ?? '');
  const [insight, setInsight]   = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const todayLabel = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  function buildEntry() {
    return {
      id: entryId,
      data: today,
      hora: existing?.hora ?? nowHora(),
      humor, pesou, bom, corpo, relacoes, gatilho, terapia, livre,
      created_at: existing?.created_at ?? new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  function upsertEntry(entry) {
    const list = loadEntries();
    const idx = list.findIndex(e => e.id === entry.id);
    if (idx >= 0) list[idx] = entry;
    else list.unshift(entry);
    persistEntries(list);
    if (window.DB && window.DB.saveDiarioEntry) window.DB.saveDiarioEntry(entry).catch(() => {});
  }

  function handleSave() {
    upsertEntry(buildEntry());
    showToast('Entrada salva 💜');
  }

  async function handleSaveWithInsights() {
    upsertEntry(buildEntry());
    showToast('Entrada salva! Gerando insight…');
    setLoadingInsight(true);
    setInsight(null);

    const result = await window.callClaude([{
      role: 'user',
      content: `Entrada do diário:\nHumor: ${humor}/10\nO que pesou: ${pesou}\nO que foi bom: ${bom}\nCorpo: ${corpo}\nRelações: ${relacoes}\nGatilho: ${gatilho}\n\nDê um insight curto e acolhedor (3-4 frases) sobre o que percebe nessa entrada. Seja gentil, não diagnóstica, foque em padrões construtivos.`,
    }],
    'Você é uma assistente de bem-estar que analisa diários terapêuticos. Seja acolhedora, empática e focada em padrões construtivos.',
    'claude-haiku-4-5-20251001');

    setLoadingInsight(false);
    if (result) setInsight(result);
    else showToast('Não foi possível gerar o insight agora.');
  }

  function handleNovaEntrada() {
    const newId = `d_${Date.now()}`;
    const list = loadEntries();
    const nova = {
      id: newId, data: today, hora: nowHora(), humor: 5,
      pesou: '', bom: '', corpo: '', relacoes: '', gatilho: '', terapia: '', livre: '',
      created_at: new Date().toISOString(),
    };
    list.unshift(nova);
    persistEntries(list);
    if (window.DB && window.DB.saveDiarioEntry) window.DB.saveDiarioEntry(nova).catch(() => {});
    showToast('Nova entrada iniciada!');
    window.location.reload();
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, color: 'var(--gray)', textTransform: 'capitalize', letterSpacing: '0.04em' }}>
          {todayLabel}
        </div>
        <div className="row between" style={{ marginTop: 4 }}>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 24, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>
            {isEditing ? 'Editar entrada de hoje' : 'Como foi o seu dia?'}
          </h2>
          {isEditing && (
            <Button variant="ghost" size="sm" onClick={handleNovaEntrada}
              style={{ color: 'var(--pink-deep)', fontSize: 14 }}>
              + Nova entrada do dia
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardBody>
          {/* Humor */}
          <div style={{ marginBottom: 24 }}>
            <FieldLabel>Humor do dia</FieldLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12 }}>
              <div style={{
                fontFamily: 'var(--font-title)', fontSize: 48, fontWeight: 500,
                color: humorColor(humor), lineHeight: 1, minWidth: 56, textAlign: 'center',
                transition: 'color .2s',
              }}>{humor}</div>
              <div style={{ fontSize: 36 }}>{humorEmoji(humor)}</div>
            </div>
            <input type="range" min={1} max={10} value={humor}
              onChange={e => setHumor(Number(e.target.value))}
              style={{ width: '100%', accentColor: humorColor(humor), cursor: 'pointer', height: 6 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--gray)', marginTop: 4 }}>
              <span>1 — Muito difícil</span>
              <span>10 — Excelente</span>
            </div>
          </div>

          <DiaryTextarea label="O que pesou mais hoje?" value={pesou} onChange={setPesou}
            placeholder="Algo que foi difícil, que pesou, que te cansou…"/>
          <DiaryTextarea label="O que foi positivo?" value={bom} onChange={setBom}
            placeholder="Uma conquista, um momento bom, algo que funcionou…"/>
          <DiaryTextarea label="Corpo e energia" value={corpo} onChange={setCorpo}
            placeholder="Como você dormiu? Sua energia hoje? Dores, cansaço…"/>
          <DiaryTextarea label="Relações" value={relacoes} onChange={setRelacoes}
            placeholder="Como foram seus relacionamentos hoje?"/>
          <DiaryTextarea label="Gatilho ou padrão percebido" value={gatilho} onChange={setGatilho}
            placeholder="Algo que te desregulou? Uma reação que você notou em si mesma…"/>
          <DiaryTextarea label="Para a terapia" value={terapia} onChange={setTerapia}
            placeholder="O que você quer trabalhar ou lembrar de mencionar na sessão…"/>
          <DiaryTextarea label="Espaço livre" value={livre} onChange={setLivre}
            placeholder="Escreva à vontade. Sem estrutura. Só para você." minHeight={120}/>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <Button variant="primary" style={{ width: '100%' }} onClick={handleSave}>
              Salvar entrada de hoje
            </Button>
            {window.hasClaudeKey && window.hasClaudeKey() && (
              <Button variant="secondary"
                style={{ width: '100%', borderColor: 'var(--pink)', color: 'var(--pink-deep)' }}
                onClick={handleSaveWithInsights} disabled={loadingInsight}>
                {loadingInsight ? 'Gerando insight…' : '✨ Salvar + Insights da IA'}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {(insight || loadingInsight) && (
        <div style={{ marginTop: 16 }}>
          <Card style={{ background: 'var(--pink-tint)' }}>
            <CardBody>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>✨</span>
                <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 14, color: 'var(--pink-deep)' }}>
                  Insight do dia
                </span>
              </div>
              {loadingInsight ? (
                <div style={{ fontSize: 14, color: 'var(--gray)', fontStyle: 'italic' }}>
                  Analisando com carinho…
                </div>
              ) : (
                <div style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {insight}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ── Entry card for Histórico ── */
function EntryCard({ entry }) {
  const [expanded, setExpanded] = useState(false);
  const preview = (entry.pesou || entry.livre || '').slice(0, 80);
  const dateLabel = new Date(entry.data + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'short', day: 'numeric', month: 'short',
  });

  return (
    <Card style={{ marginBottom: 8 }}>
      <CardBody tight>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', paddingBottom: expanded ? 12 : 0 }}
          onClick={() => setExpanded(v => !v)}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            minWidth: 48, background: 'color-mix(in oklch, var(--pink) 8%, var(--white))', borderRadius: 10,
            padding: '6px 8px', flexShrink: 0,
          }}>
            <span style={{ fontSize: 18 }}>{humorEmoji(entry.humor)}</span>
            <span style={{ fontFamily: 'var(--font-title)', fontSize: 14, fontWeight: 700, color: humorColor(entry.humor) }}>
              {entry.humor}
            </span>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', textTransform: 'capitalize' }}>{dateLabel}</span>
              {entry.hora && (
                <span style={{ fontSize: 14, color: 'var(--gray)', background: 'var(--offwhite)', padding: '1px 7px', borderRadius: 999 }}>
                  {entry.hora}
                </span>
              )}
            </div>
            {preview && (
              <div style={{ fontSize: 14, color: 'var(--ink-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {preview}{(entry.pesou || entry.livre || '').length > 80 ? '…' : ''}
              </div>
            )}
          </div>

          <Icon name={expanded ? 'chev-down' : 'chev-right'} size={18} color="var(--gray)"/>
        </div>

        {expanded && (
          <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'O que pesou',        value: entry.pesou },
              { label: 'O que foi positivo', value: entry.bom },
              { label: 'Corpo e energia',    value: entry.corpo },
              { label: 'Relações',           value: entry.relacoes },
              { label: 'Gatilho ou padrão',  value: entry.gatilho },
              { label: 'Para a terapia',     value: entry.terapia },
              { label: 'Espaço livre',       value: entry.livre },
            ].filter(f => f.value && f.value.trim()).map(f => (
              <div key={f.label}>
                <FieldLabel>{f.label}</FieldLabel>
                <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{f.value}</div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/* ── Histórico + Relatório ── */
function HistoricoView() {
  const [entries, setEntries] = useState([]);
  const [periodo, setPeriodo] = useState(7);
  const [relatorio, setRelatorio] = useState(null);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);

  useEffect(() => {
    function sortEntries(list) {
      return list.slice().sort((a, b) => {
        const d = b.data.localeCompare(a.data);
        return d !== 0 ? d : (b.hora || '').localeCompare(a.hora || '');
      });
    }
    // Mostrar localStorage primeiro (rápido)
    const local = loadEntries();
    setEntries(sortEntries(local));

    // Sincronizar com Supabase
    if (!window.DB || !window.DB.loadDiario) return;
    window.DB.loadDiario().then(data => {
      if (data && data.length > 0) {
        // Mesclar: Supabase ganha conflitos
        const map = new Map(local.map(e => [e.id, e]));
        data.forEach(e => map.set(e.id, e));
        const merged = sortEntries([...map.values()]);
        setEntries(merged);
        persistEntries(merged);
      } else if (local.length > 0) {
        // Migrar localStorage → Supabase
        local.forEach(e => window.DB.saveDiarioEntry(e).catch(() => {}));
      }
    }).catch(() => {});
  }, []);

  function filteredEntries() {
    if (periodo === 'todos') return entries;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - periodo);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    return entries.filter(e => e.data >= cutoffStr);
  }

  function exportarEntradas() {
    const list = filteredEntries();
    if (list.length === 0) { showToast('Nenhuma entrada para esse período'); return; }

    const byDay = {};
    list.forEach(e => {
      if (!byDay[e.data]) byDay[e.data] = [];
      byDay[e.data].push(e);
    });

    const corpo = Object.entries(byDay)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, dayEntries]) => {
        const dateLabel = new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
          weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
        });
        const parts = dayEntries.map((e, i) => {
          const lines = [`Humor: ${e.humor}/10`];
          if (e.pesou)    lines.push(`Pesou: ${e.pesou}`);
          if (e.bom)      lines.push(`Positivo: ${e.bom}`);
          if (e.corpo)    lines.push(`Corpo: ${e.corpo}`);
          if (e.relacoes) lines.push(`Relações: ${e.relacoes}`);
          if (e.gatilho)  lines.push(`Gatilho: ${e.gatilho}`);
          if (e.terapia)  lines.push(`Para terapia: ${e.terapia}`);
          if (e.livre)    lines.push(`Livre: ${e.livre}`);
          return (dayEntries.length > 1 ? `[Entrada ${i + 1}]\n` : '') + lines.join('\n');
        }).join('\n\n');
        return `📅 ${dateLabel}\n${parts}`;
      }).join('\n\n──────────\n\n');

    const texto = `DIÁRIO TERAPÊUTICO — LORENNA\n${list.length} entrada${list.length !== 1 ? 's' : ''} · ${new Date().toLocaleDateString('pt-BR')}\n\n${corpo}\n\n──────────\nCole este texto no Claude.ai, ChatGPT ou outro assistente IA para análise.`;

    navigator.clipboard.writeText(texto).then(() => {
      showToast('Entradas copiadas! Cole em qualquer IA para análise 🤖');
    }).catch(() => showToast('Não foi possível copiar. Tente de novo.'));
  }

  async function gerarRelatorio() {
    const filtered = filteredEntries();
    if (filtered.length === 0) { showToast('Nenhuma entrada para esse período'); return; }
    if (!window.hasClaudeKey || !window.hasClaudeKey()) {
      exportarEntradas();
      return;
    }

    setLoadingRelatorio(true);
    setRelatorio(null);

    // Group by day
    const byDay = {};
    filtered.forEach(e => {
      if (!byDay[e.data]) byDay[e.data] = [];
      byDay[e.data].push(e);
    });

    const entriesText = Object.entries(byDay).sort((a, b) => b[0].localeCompare(a[0])).map(([date, dayEntries]) => {
      const dateLabel = new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
      const parts = dayEntries.map((e, i) => {
        const header = dayEntries.length > 1 ? `  [Entrada ${i + 1} — ${e.hora || ''}]` : '';
        return `${header}\n  Humor: ${e.humor}/10${e.pesou ? `\n  Pesou: ${e.pesou}` : ''}${e.bom ? `\n  Positivo: ${e.bom}` : ''}${e.corpo ? `\n  Corpo: ${e.corpo}` : ''}${e.relacoes ? `\n  Relações: ${e.relacoes}` : ''}${e.gatilho ? `\n  Gatilho: ${e.gatilho}` : ''}${e.terapia ? `\n  Para terapia: ${e.terapia}` : ''}${e.livre ? `\n  Livre: ${e.livre}` : ''}`;
      }).join('\n');
      return `📅 ${dateLabel}\n${parts}`;
    }).join('\n\n---\n\n');

    const periodoLabel = periodo === 'todos' ? 'total registrado' : `últimos ${periodo} dias`;

    const result = await window.callClaude([{
      role: 'user',
      content: `Analise estas ${filtered.length} entradas do meu diário (${periodoLabel}):\n\n${entriesText}\n\nGere um relatório completo com:\n1. **Padrões emocionais recorrentes** — o que aparece com frequência\n2. **Gatilhos mais comuns** — o que me desregula\n3. **Momentos de mais bem-estar** — quando me sinto melhor e por quê\n4. **Padrões no corpo/energia** — o que o físico diz\n5. **Para levar à terapia** — temas importantes a trabalhar\n6. **Uma frase de encorajamento** — baseada em tudo que você viu`,
    }],
    'Você é uma assistente terapêutica especializada em identificar padrões emocionais e comportamentais. Analise com empatia e profundidade. Seja acolhedora, não diagnóstica. Organize em seções claras com marcadores.',
    'claude-sonnet-4-6');

    setLoadingRelatorio(false);
    if (result) setRelatorio(result);
    else showToast('Não foi possível gerar o relatório. Verifique sua chave da API.');
  }

  const periodoBtns = [
    { label: '7 dias',  value: 7 },
    { label: '15 dias', value: 15 },
    { label: '30 dias', value: 30 },
    { label: 'Todos',   value: 'todos' },
  ];

  const filtered = filteredEntries();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 700, color: 'var(--ink)', margin: '0 0 14px 0' }}>
          Entradas anteriores
        </h3>
        {entries.length === 0 ? (
          <Card><CardBody>
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--gray)', fontSize: 14 }}>
              Nenhuma entrada ainda. Comece escrevendo hoje!
            </div>
          </CardBody></Card>
        ) : (
          entries.map(entry => <EntryCard key={entry.id} entry={entry}/>)
        )}
      </div>

      {/* Report */}
      <Card>
        <CardHeader>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>
            ✨ Gerar Relatório de Padrões
          </div>
          <div style={{ fontSize: 14, color: 'var(--gray)', marginTop: 4 }}>
            A IA analisa suas entradas e identifica padrões emocionais para levar à terapia
          </div>
        </CardHeader>
        <CardBody>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {periodoBtns.map(b => (
              <button key={b.value} onClick={() => setPeriodo(b.value)} style={{
                fontSize: 14, fontWeight: 600, padding: '6px 14px', borderRadius: 20,
                border: '1.5px solid', fontFamily: 'var(--font-body)',
                borderColor: periodo === b.value ? 'var(--pink)' : 'var(--pink-soft)',
                background: periodo === b.value ? 'var(--pink-tint)' : 'transparent',
                color: periodo === b.value ? 'var(--pink-deep)' : 'var(--gray)',
                cursor: 'pointer', transition: 'all .15s',
              }}>{b.label}</button>
            ))}
          </div>

          <div style={{ fontSize: 14, color: 'var(--gray)', marginBottom: 12 }}>
            {filtered.length} entrada{filtered.length !== 1 ? 's' : ''} nesse período
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" style={{ flex: 1 }} onClick={gerarRelatorio} disabled={loadingRelatorio || filtered.length === 0}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Icon name="sparkle" size={16} color="currentColor"/>
                {loadingRelatorio ? 'Analisando entradas…' : `Gerar relatório (${filtered.length} entradas)`}
              </span>
            </Button>
            <Button variant="secondary" onClick={exportarEntradas} disabled={filtered.length === 0}
              style={{ whiteSpace: 'nowrap' }}>
              Copiar para IA
            </Button>
          </div>

          {(relatorio || loadingRelatorio) && (
            <div style={{ marginTop: 20 }}>
              {loadingRelatorio ? (
                <div style={{ fontSize: 14, color: 'var(--gray)', fontStyle: 'italic', textAlign: 'center', padding: '24px 0' }}>
                  Analisando seus padrões com cuidado… isso pode levar alguns segundos.
                </div>
              ) : (
                <div style={{ background: 'var(--pink-tint)', border: '1.5px solid var(--pink-soft)', borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Icon name="brain" size={18} color="var(--pink-deep)"/>
                    <span style={{ fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 15, color: 'var(--pink-deep)' }}>
                      Análise de padrões
                    </span>
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.75, whiteSpace: 'pre-wrap', marginBottom: 16 }}>
                    {relatorio}
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Button variant="secondary" size="sm"
                      onClick={() => { navigator.clipboard.writeText(relatorio); showToast('Relatório copiado!'); }}
                      style={{ borderColor: 'var(--pink-soft)', color: 'var(--pink-deep)' }}>
                      <Icon name="copy" size={14} color="currentColor"/> Copiar
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => window.print()}
                      style={{ borderColor: 'var(--pink-soft)', color: 'var(--pink-deep)' }}>
                      <Icon name="print" size={14} color="currentColor"/> Imprimir
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setRelatorio(null)}>
                      <Icon name="x" size={14}/> Fechar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

/* ── DiarioPage ── */
function DiarioPage() {
  const [tab, setTab] = useState('hoje');

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 'var(--s-5) var(--s-4) 60px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-title)', fontSize: 30, fontWeight: 800,
          color: 'var(--ink)', margin: 0, display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <Icon name="heart" size={26} color="var(--pink)"/> Diário Terapêutico
        </h1>
        <p style={{ fontSize: 15, color: 'var(--gray)', margin: '6px 0 0' }}>
          Um espaço só seu, para acompanhar como você está.
        </p>
      </div>

      <div style={{
        display: 'flex', gap: 4, background: 'var(--pink-tint)', borderRadius: 12,
        padding: 4, marginBottom: 24, border: '1.5px solid var(--pink-soft)',
      }}>
        {[{ id: 'hoje', label: 'Hoje' }, { id: 'historico', label: 'Histórico & Relatório' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, fontSize: 14, fontWeight: 600, padding: '8px 16px', borderRadius: 9,
            border: 'none', fontFamily: 'var(--font-body)',
            background: tab === t.id ? '#201e1f' : 'transparent',
            color: tab === t.id ? '#fffcfa' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all .15s',
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'hoje'      && <HojeView/>}
      {tab === 'historico' && <HistoricoView/>}
    </div>
  );
}

window.DiarioPage = DiarioPage;
