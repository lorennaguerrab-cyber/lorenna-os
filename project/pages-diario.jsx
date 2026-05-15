/* ──────────────────────────────────────────────
   pages-diario.jsx — Diário Terapêutico
   Requires: React 18 (window.React), ui.jsx (Card, CardHeader, CardBody, Button, Icon, showToast),
             claude-api.jsx (window.callClaude, window.hasClaudeKey)
   Storage: localStorage key `lorenna_diario_entries`
   ────────────────────────────────────────────── */

const { useState, useEffect } = React;

/* ──────────────────────────────────────────────
   Local storage helpers
   ────────────────────────────────────────────── */
function loadEntries() {
  try { return JSON.parse(localStorage.getItem('lorenna_diario_entries') || '[]'); }
  catch { return []; }
}
function saveEntry(entry) {
  const entries = loadEntries();
  const idx = entries.findIndex(e => e.data === entry.data);
  if (idx >= 0) entries[idx] = entry;
  else entries.unshift(entry);
  localStorage.setItem('lorenna_diario_entries', JSON.stringify(entries));
}
function todayStr() {
  return new Date().toISOString().split('T')[0];
}

/* ──────────────────────────────────────────────
   Humor helpers
   ────────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────
   Shared sub-components
   ────────────────────────────────────────────── */
function FieldLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-body)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--gray)',
      marginBottom: 6,
    }}>
      {children}
    </div>
  );
}

function DiaryTextarea({ label, value, onChange, placeholder, minHeight = 72 }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <FieldLabel>{label}</FieldLabel>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight,
          padding: '10px 12px',
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--ink)',
          background: 'var(--offwhite)',
          border: '1.5px solid var(--pink-soft)',
          borderRadius: 10,
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
          lineHeight: 1.6,
          transition: 'border-color .2s',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--pink)'}
        onBlur={e => e.target.style.borderColor = 'var(--pink-soft)'}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────
   VIEW: Hoje (today's entry form)
   ────────────────────────────────────────────── */
function HojeView() {
  const today = todayStr();
  const existing = loadEntries().find(e => e.data === today);

  const [humor, setHumor]       = useState(existing?.humor     ?? 5);
  const [pesou, setPesou]       = useState(existing?.pesou     ?? '');
  const [bom, setBom]           = useState(existing?.bom       ?? '');
  const [corpo, setCorpo]       = useState(existing?.corpo     ?? '');
  const [relacoes, setRelacoes] = useState(existing?.relacoes  ?? '');
  const [gatilho, setGatilho]   = useState(existing?.gatilho   ?? '');
  const [terapia, setTerapia]   = useState(existing?.terapia   ?? '');
  const [livre, setLivre]       = useState(existing?.livre     ?? '');
  const [insight, setInsight]   = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  const todayLabel = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  function buildEntry() {
    return {
      id: existing?.id ?? `d_${Date.now()}`,
      data: today,
      humor,
      pesou, bom, corpo, relacoes, gatilho, terapia, livre,
      created_at: existing?.created_at ?? new Date().toISOString(),
    };
  }

  function handleSave() {
    saveEntry(buildEntry());
    showToast('Entrada salva 💜');
  }

  async function handleSaveWithInsights() {
    saveEntry(buildEntry());
    showToast('Entrada salva! Gerando insight...');
    setLoadingInsight(true);
    setInsight(null);

    const result = await window.callClaude(
      [{
        role: 'user',
        content: `Entrada do diário de hoje:\nHumor: ${humor}/10\nO que pesou: ${pesou}\nO que foi bom: ${bom}\nCorpo: ${corpo}\nRelações: ${relacoes}\nGatilho: ${gatilho}\n\nDê um insight curto e acolhedor (3-4 frases) sobre o que você percebe nessa entrada. Seja gentil, não diagnóstico, foque em padrões construtivos.`,
      }],
      'Você é uma assistente de bem-estar que analisa diários terapêuticos. Seja acolhedora, empática e focada em padrões construtivos.'
    );

    setLoadingInsight(false);
    if (result) {
      setInsight(result);
    } else {
      showToast('Não foi possível gerar o insight agora.');
    }
  }

  return (
    <div>
      {/* Date header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: 'var(--gray)',
          textTransform: 'capitalize',
          letterSpacing: '0.04em',
        }}>
          {todayLabel}
        </div>
        <h2 style={{
          fontFamily: 'var(--font-title)',
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--ink)',
          margin: 0,
          marginTop: 2,
        }}>
          Como foi o seu dia?
        </h2>
      </div>

      <Card>
        <CardBody>

          {/* Humor do dia */}
          <div style={{ marginBottom: 28 }}>
            <FieldLabel>Humor do dia</FieldLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12 }}>
              <div style={{
                fontFamily: 'var(--font-title)',
                fontSize: 48,
                fontWeight: 800,
                color: humorColor(humor),
                lineHeight: 1,
                minWidth: 56,
                textAlign: 'center',
                transition: 'color .2s',
              }}>
                {humor}
              </div>
              <div style={{ fontSize: 36 }}>{humorEmoji(humor)}</div>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={humor}
              onChange={e => setHumor(Number(e.target.value))}
              style={{
                width: '100%',
                accentColor: humorColor(humor),
                cursor: 'pointer',
                height: 6,
              }}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--gray)',
              marginTop: 4,
            }}>
              <span>1 — Muito difícil</span>
              <span>10 — Excelente</span>
            </div>
          </div>

          <DiaryTextarea
            label="O que pesou mais hoje?"
            value={pesou}
            onChange={setPesou}
            placeholder="Algo que foi difícil, que pesou, que te cansou..."
          />
          <DiaryTextarea
            label="O que foi positivo?"
            value={bom}
            onChange={setBom}
            placeholder="Uma conquista, um momento bom, algo que funcionou..."
          />
          <DiaryTextarea
            label="Corpo e energia"
            value={corpo}
            onChange={setCorpo}
            placeholder="Como você dormiu? Sua energia hoje? Dores, cansaço..."
          />
          <DiaryTextarea
            label="Relações"
            value={relacoes}
            onChange={setRelacoes}
            placeholder="Como foram seus relacionamentos hoje? Com os meninos, trabalho, pessoas..."
          />
          <DiaryTextarea
            label="Gatilho ou padrão percebido"
            value={gatilho}
            onChange={setGatilho}
            placeholder="Algo que te desregulou? Uma reação que você notou em si mesma..."
          />
          <DiaryTextarea
            label="Para a terapia"
            value={terapia}
            onChange={setTerapia}
            placeholder="O que você quer trabalhar ou lembrar de mencionar na sessão..."
          />
          <DiaryTextarea
            label="Espaço livre"
            value={livre}
            onChange={setLivre}
            placeholder="Escreva à vontade. Sem estrutura. Só para você."
            minHeight={120}
          />

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            <Button variant="primary" style={{ width: '100%' }} onClick={handleSave}>
              Salvar entrada de hoje
            </Button>

            {window.hasClaudeKey && window.hasClaudeKey() && (
              <Button
                variant="secondary"
                style={{ width: '100%', borderColor: 'var(--pink)', color: 'var(--pink-deep)' }}
                onClick={handleSaveWithInsights}
                disabled={loadingInsight}
              >
                {loadingInsight ? 'Gerando insight...' : '✨ Salvar + Insights da IA'}
              </Button>
            )}
          </div>

        </CardBody>
      </Card>

      {/* Insight card */}
      {(insight || loadingInsight) && (
        <div style={{ marginTop: 16 }}>
          <Card style={{ background: 'var(--pink-tint)', border: '1.5px solid var(--pink-soft)' }}>
            <CardBody>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 10,
              }}>
                <span style={{ fontSize: 18 }}>✨</span>
                <span style={{
                  fontFamily: 'var(--font-title)',
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--pink-deep)',
                }}>
                  Insight do dia
                </span>
              </div>
              {loadingInsight ? (
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--gray)',
                  fontStyle: 'italic',
                }}>
                  Analisando sua entrada com carinho...
                </div>
              ) : (
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--ink)',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                }}>
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

/* ──────────────────────────────────────────────
   Entry card for Histórico
   ────────────────────────────────────────────── */
function EntryCard({ entry }) {
  const [expanded, setExpanded] = useState(false);

  const preview = (entry.pesou || entry.livre || '').slice(0, 60);
  const dateLabel = new Date(entry.data + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <Card style={{ marginBottom: 10 }}>
      <CardBody tight>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', paddingBottom: expanded ? 12 : 0 }}
          onClick={() => setExpanded(v => !v)}
        >
          {/* Humor badge */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 44,
            background: 'var(--offwhite)',
            borderRadius: 10,
            padding: '6px 8px',
            border: '1.5px solid var(--pink-soft)',
          }}>
            <span style={{ fontSize: 18 }}>{humorEmoji(entry.humor)}</span>
            <span style={{
              fontFamily: 'var(--font-title)',
              fontSize: 13,
              fontWeight: 700,
              color: humorColor(entry.humor),
            }}>
              {entry.humor}
            </span>
          </div>

          {/* Date + preview */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--gray)',
              textTransform: 'capitalize',
              marginBottom: 2,
            }}>
              {dateLabel}
            </div>
            {preview && (
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--ink)',
                opacity: 0.75,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {preview}{(entry.pesou || entry.livre || '').length > 60 ? '…' : ''}
              </div>
            )}
          </div>

          {/* Chevron */}
          <Icon
            name={expanded ? 'chev-down' : 'chev-right'}
            size={18}
            color="var(--gray)"
          />
        </div>

        {/* Expanded content */}
        {expanded && (
          <div style={{
            paddingTop: 12,
            borderTop: '1px solid var(--pink-soft)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {[
              { label: 'O que pesou', value: entry.pesou },
              { label: 'O que foi positivo', value: entry.bom },
              { label: 'Corpo e energia', value: entry.corpo },
              { label: 'Relações', value: entry.relacoes },
              { label: 'Gatilho ou padrão', value: entry.gatilho },
              { label: 'Para a terapia', value: entry.terapia },
              { label: 'Espaço livre', value: entry.livre },
            ].filter(f => f.value && f.value.trim()).map(f => (
              <div key={f.label}>
                <FieldLabel>{f.label}</FieldLabel>
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--ink)',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-wrap',
                }}>
                  {f.value}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/* ──────────────────────────────────────────────
   VIEW: Histórico + Relatório
   ────────────────────────────────────────────── */
function HistoricoView() {
  const [entries, setEntries] = useState([]);
  const [periodo, setPeriodo] = useState(7);
  const [relatorio, setRelatorio] = useState(null);
  const [loadingRelatorio, setLoadingRelatorio] = useState(false);

  useEffect(() => {
    const all = loadEntries();
    all.sort((a, b) => (a.data < b.data ? 1 : -1));
    setEntries(all);
  }, []);

  function filteredEntries() {
    if (periodo === 'todos') return entries;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - periodo);
    const cutoffStr = cutoff.toISOString().split('T')[0];
    return entries.filter(e => e.data >= cutoffStr);
  }

  async function gerarRelatorio() {
    const filtered = filteredEntries();
    if (filtered.length === 0) {
      showToast('Nenhuma entrada para esse período');
      return;
    }
    if (!window.hasClaudeKey || !window.hasClaudeKey()) {
      showToast('Configure sua chave Claude primeiro (botão ✨ no canto inferior)');
      return;
    }

    setLoadingRelatorio(true);
    setRelatorio(null);

    const systemPrompt = `Você é uma assistente terapêutica especializada em identificar padrões emocionais e comportamentais. Analise as entradas do diário com empatia e profundidade. Organize a análise em seções claras. Seja acolhedora, não diagnóstica.`;

    const entriesText = filtered.map(e =>
      `Data: ${e.data} | Humor: ${e.humor}/10\nPesou: ${e.pesou}\nPositivo: ${e.bom}\nCorpo: ${e.corpo}\nRelações: ${e.relacoes}\nGatilho: ${e.gatilho}\nPara terapia: ${e.terapia}\nLivre: ${e.livre}`
    ).join('\n\n---\n\n');

    const periodoLabel = periodo === 'todos' ? 'total' : periodo;

    const userMessage = `Analise estas ${filtered.length} entradas do meu diário (período: ${periodoLabel} dias):\n\n${entriesText}\n\nIdentifique:\n1. Padrões emocionais recorrentes\n2. Gatilhos mais comuns\n3. O que parece me afetar mais\n4. Momentos de mais energia e bem-estar\n5. Sugestões para levar à terapia`;

    const result = await window.callClaude(
      [{ role: 'user', content: userMessage }],
      systemPrompt,
      'claude-sonnet-4-6'
    );

    setLoadingRelatorio(false);

    if (result) {
      setRelatorio(result);
    } else {
      showToast('Não foi possível gerar o relatório. Verifique sua chave da API.');
    }
  }

  function copiarRelatorio() {
    if (!relatorio) return;
    navigator.clipboard.writeText(relatorio).then(() => {
      showToast('Relatório copiado!');
    }).catch(() => {
      showToast('Não foi possível copiar.');
    });
  }

  const periodoBtns = [
    { label: '7 dias', value: 7 },
    { label: '15 dias', value: 15 },
    { label: '30 dias', value: 30 },
    { label: 'Todos', value: 'todos' },
  ];

  return (
    <div>
      {/* Entries list */}
      <div style={{ marginBottom: 28 }}>
        <h3 style={{
          fontFamily: 'var(--font-title)',
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--ink)',
          margin: '0 0 16px 0',
        }}>
          Entradas anteriores
        </h3>

        {entries.length === 0 ? (
          <Card>
            <CardBody>
              <div style={{
                textAlign: 'center',
                padding: '32px 0',
                fontFamily: 'var(--font-body)',
                color: 'var(--gray)',
                fontSize: 14,
              }}>
                Nenhuma entrada ainda. Comece escrevendo hoje!
              </div>
            </CardBody>
          </Card>
        ) : (
          entries.map(entry => (
            <EntryCard key={entry.id} entry={entry} />
          ))
        )}
      </div>

      {/* Relatório com IA */}
      <Card>
        <CardHeader>
          <div style={{
            fontFamily: 'var(--font-title)',
            fontSize: 16,
            fontWeight: 700,
            color: 'var(--ink)',
          }}>
            Identificar Padrões
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            color: 'var(--gray)',
            marginTop: 4,
          }}>
            A IA analisa suas entradas e identifica padrões emocionais
          </div>
        </CardHeader>
        <CardBody>
          {/* Period selector */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {periodoBtns.map(b => (
              <button
                key={b.value}
                onClick={() => setPeriodo(b.value)}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1.5px solid',
                  borderColor: periodo === b.value ? 'var(--pink)' : 'var(--pink-soft)',
                  background: periodo === b.value ? 'var(--pink-tint)' : 'transparent',
                  color: periodo === b.value ? 'var(--pink-deep)' : 'var(--gray)',
                  cursor: 'pointer',
                  transition: 'all .15s',
                }}
              >
                {b.label}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            style={{ width: '100%' }}
            onClick={gerarRelatorio}
            disabled={loadingRelatorio}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Icon name="sparkle" size={16} color="currentColor" />
              {loadingRelatorio ? 'Analisando entradas...' : 'Gerar relatório'}
            </span>
          </Button>

          {/* Report output */}
          {(relatorio || loadingRelatorio) && (
            <div style={{ marginTop: 20 }}>
              {loadingRelatorio ? (
                <div style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--gray)',
                  fontStyle: 'italic',
                  textAlign: 'center',
                  padding: '24px 0',
                }}>
                  Analisando seus padrões com cuidado... isso pode levar alguns segundos.
                </div>
              ) : (
                <div style={{
                  background: 'var(--pink-tint)',
                  border: '1.5px solid var(--pink-soft)',
                  borderRadius: 12,
                  padding: 20,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 14,
                  }}>
                    <Icon name="brain" size={18} color="var(--pink-deep)" />
                    <span style={{
                      fontFamily: 'var(--font-title)',
                      fontWeight: 700,
                      fontSize: 15,
                      color: 'var(--pink-deep)',
                    }}>
                      Análise de padrões
                    </span>
                  </div>

                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    color: 'var(--ink)',
                    lineHeight: 1.75,
                    whiteSpace: 'pre-wrap',
                    marginBottom: 16,
                  }}>
                    {relatorio}
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={copiarRelatorio}
                      style={{ borderColor: 'var(--pink-soft)', color: 'var(--pink-deep)' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Icon name="copy" size={14} color="currentColor" />
                        Copiar relatório
                      </span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.print()}
                      style={{ borderColor: 'var(--pink-soft)', color: 'var(--pink-deep)' }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Icon name="print" size={14} color="currentColor" />
                        Imprimir
                      </span>
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

/* ──────────────────────────────────────────────
   Main: DiarioPage
   ────────────────────────────────────────────── */
function DiarioPage() {
  const [tab, setTab] = useState('hoje');

  const tabs = [
    { id: 'hoje',      label: 'Hoje' },
    { id: 'historico', label: 'Histórico' },
  ];

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 0 40px' }}>
      {/* Page title */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{
          fontFamily: 'var(--font-title)',
          fontSize: 28,
          fontWeight: 800,
          color: 'var(--ink)',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <Icon name="heart" size={26} color="var(--pink)" />
          Diário Terapêutico
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 14,
          color: 'var(--gray)',
          margin: '6px 0 0',
        }}>
          Um espaço só seu, para acompanhar como você está.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 4,
        background: 'var(--pink-tint)',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
        border: '1.5px solid var(--pink-soft)',
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: 9,
              border: 'none',
              background: tab === t.id ? 'var(--white)' : 'transparent',
              color: tab === t.id ? 'var(--pink-deep)' : 'var(--gray)',
              cursor: 'pointer',
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all .15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* View content */}
      {tab === 'hoje'      && <HojeView />}
      {tab === 'historico' && <HistoricoView />}
    </div>
  );
}

window.DiarioPage = DiarioPage;
