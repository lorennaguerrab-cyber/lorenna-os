/* ──────────────────────────────────────────────
   sidebar.jsx — left navigation + energy switch
   ────────────────────────────────────────────── */

const { useState, useRef } = React;

function Sidebar({ route, setRoute, energy, setEnergy, collapsed, setCollapsed }) {
  const energyCfg = window.ENERGY[energy];
  const [photo, setPhoto] = useState(() => localStorage.getItem('lorenna_profile_photo') || null);
  const fileRef = useRef(null);

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const data = ev.target.result;
      localStorage.setItem('lorenna_profile_photo', data);
      setPhoto(data);
      showToast('Foto atualizada!');
    };
    reader.readAsDataURL(file);
  }

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div
          className="brand-mark"
          onClick={() => fileRef.current?.click()}
          title="Clique para trocar a foto"
          style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
        >
          {photo ? (
            <img src={photo} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} alt="Foto" />
          ) : (
            <span>L</span>
          )}
          <div className="brand-mark-overlay">
            <Icon name="camera" size={14} color="white" />
          </div>
        </div>
        <input type="file" ref={fileRef} accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
        {!collapsed && (
          <div className="brand-text">
            <div className="name">Córtex Lola</div>
          </div>
        )}
      </div>

      {/* Energy chip */}
      <div className={`energy-chip ${collapsed ? 'collapsed' : ''}`} style={{
        background: `color-mix(in oklch, ${energyCfg.color} 12%, var(--bg-surface))`,
        borderColor: `color-mix(in oklch, ${energyCfg.color} 25%, transparent)`,
      }}>
        {collapsed ? (
          <span style={{ fontSize: 20 }}>{energyCfg.emoji}</span>
        ) : (
          <>
            <div className="label">Modo atual</div>
            <div className="value" style={{ color: energyCfg.color }}>
              <span>{energyCfg.emoji}</span> {energyCfg.label}
            </div>
          </>
        )}
      </div>

      {/* Nav */}
      {/* Color map by href */}
      {(() => {
        const NAV_COLORS = {
          '/':             '#fe7dae',
          '/tarefas':      '#fe7dae',
          '/saude':        '#ffe1bd',
          '/habitos':      '#fec9df',
          '/studio':       '#f1e18d',
          '/conteudo':     '#f0bff8',
          '/ideias':       '#f0bff8',
          '/diario':       '#fec9df',
          '/agenda':       '#bce1f6',
          '/clientes':     '#bce1f6',
          '/crm':          '#bce1f6',
          '/monetizacao':  '#ffe1bd',
          '/financeiro':   '#ffe1bd',
          '/materiais':    '#f1e18d',
          '/precificacao': '#f1e18d',
          '/sobre':        '#f0bff8',
        };
        return (
          <nav className="nav">
            {window.NAV.map(item => {
              const active = route === item.href;
              const col = NAV_COLORS[item.href] || 'var(--pink)';
              return (
                <div key={item.href}
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={() => setRoute(item.href)}
                  title={collapsed ? item.label : ''}
                  style={{
                    position: 'relative',
                    background: active
                      ? `color-mix(in oklch, ${col} 18%, var(--bg-surface))`
                      : 'transparent',
                    borderRadius: 10,
                    margin: '1px 0',
                  }}>
                  {active && (
                    <div style={{
                      position: 'absolute', left: 0, top: '20%', bottom: '20%',
                      width: 3, borderRadius: '0 3px 3px 0',
                      background: col,
                    }}/>
                  )}
                  <div style={{
                    width: 32, height: 32,
                    borderRadius: 8,
                    background: active
                      ? `color-mix(in oklch, ${col} 25%, var(--bg-surface))`
                      : `color-mix(in oklch, ${col} 10%, var(--bg-surface))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all .15s',
                  }}>
                    <Icon name={item.icon} size={16} color={active ? col : `color-mix(in oklch, ${col} 60%, var(--text-muted))`} />
                  </div>
                  {!collapsed && (
                    <span style={{
                      color: active ? col : 'var(--text-secondary)',
                      fontWeight: active ? 600 : 400,
                      fontSize: 14,
                      transition: 'color .15s',
                    }}>{item.label}</span>
                  )}
                </div>
              );
            })}
          </nav>
        );
      })()}

      {/* Collapse */}
      <div className="collapse-toggle">
        <button onClick={() => setCollapsed(!collapsed)} title={collapsed ? 'Expandir' : 'Recolher'}>
          <Icon name={collapsed ? 'chev-right' : 'chev-left'} size={15} />
        </button>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
