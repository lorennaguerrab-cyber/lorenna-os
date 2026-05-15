/* ──────────────────────────────────────────────
   claude-api.jsx — Claude API integration
   ────────────────────────────────────────────── */

const CLAUDE_KEY_STORAGE = 'lorenna_claude_api_key';

/* ─── Core API call ─── */
window.callClaude = async function(messages, systemPrompt, model) {
  const key = localStorage.getItem(CLAUDE_KEY_STORAGE);
  if (!key) return null;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: model || 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        system: systemPrompt || '',
        messages,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      if (err?.error?.type === 'authentication_error') {
        showToast('Chave da API inválida. Verifique em Configurar IA.');
      }
      return null;
    }
    const data = await res.json();
    return data.content?.[0]?.text || null;
  } catch { return null; }
};

window.hasClaudeKey = function() {
  return !!localStorage.getItem(CLAUDE_KEY_STORAGE);
};

window.setClaudeKey = function(key) {
  localStorage.setItem(CLAUDE_KEY_STORAGE, key.trim());
};

/* ─── AI Key Setup Banner ─── */
function ClaudeKeyModal({ onClose }) {
  const { useState } = React;
  const [key, setKey] = useState(localStorage.getItem(CLAUDE_KEY_STORAGE) || '');

  function save() {
    if (!key.trim()) return;
    window.setClaudeKey(key.trim());
    showToast('Chave salva! IA pronta para usar.');
    onClose();
  }

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(43,34,34,0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'var(--s-4)',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 'min(520px, 96vw)',
        background: 'var(--white)',
        borderRadius: 'var(--r-xl)',
        border: '1px solid var(--gray-light)',
        overflow: 'hidden',
      }}>
        <div style={{ height: 4, background: 'var(--pink)' }}/>
        <div style={{ padding: 'var(--s-5)' }}>
          <div className="row between" style={{ marginBottom: 'var(--s-4)' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 600 }}>
                ✨ Configurar IA (Claude)
              </h3>
              <p className="small muted" style={{ marginTop: 4 }}>
                Para usar IA real no Baú de Ideias, Diário e Prompts.
              </p>
            </div>
            <button className="btn ghost icon" onClick={onClose}>
              <Icon name="x" size={14}/>
            </button>
          </div>

          <div className="col gap-3">
            <div>
              <label className="tiny" style={{ fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                Chave da API Anthropic
              </label>
              <input
                className="input"
                type="password"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="sk-ant-api03-..."
                style={{ marginTop: 6, fontFamily: 'monospace', fontSize: 12 }}
                onKeyDown={e => e.key === 'Enter' && save()}
                autoFocus
              />
            </div>

            <div style={{
              padding: 'var(--s-3) var(--s-4)',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--border)',
            }}>
              <p className="tiny muted" style={{ lineHeight: 1.6 }}>
                🔐 Salva só aqui no seu navegador — nunca vai a nenhum servidor.<br/>
                📍 Obtenha em: <strong style={{ color: 'var(--pink-deep)' }}>console.anthropic.com → API Keys</strong>
              </p>
            </div>

            <div className="row gap-2" style={{ justifyContent: 'flex-end', marginTop: 4 }}>
              <Button variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button variant="primary" onClick={save} disabled={!key.trim()}>
                Salvar e ativar IA
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Floating AI config button ─── */
function ClaudeKeyButton() {
  const { useState } = React;
  const [open, setOpen] = useState(false);
  const hasKey = window.hasClaudeKey();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={hasKey ? 'IA ativa — clique para reconfigurar' : 'Configurar IA'}
        style={{
          position: 'fixed', right: 28, bottom: 96, zIndex: 49,
          width: 42, height: 42,
          borderRadius: 999,
          border: '1px solid var(--border)',
          background: hasKey ? 'color-mix(in oklch, var(--pink) 12%, var(--white))' : 'var(--white)',
          color: hasKey ? 'var(--pink-deep)' : 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
          transition: 'all .2s',
        }}
      >
        {hasKey ? '✨' : '🤖'}
      </button>
      {open && <ClaudeKeyModal onClose={() => setOpen(false)} />}
    </>
  );
}

window.ClaudeKeyButton = ClaudeKeyButton;
window.ClaudeKeyModal = ClaudeKeyModal;
