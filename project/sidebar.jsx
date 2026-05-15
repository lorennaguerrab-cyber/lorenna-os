/* ──────────────────────────────────────────────
   sidebar.jsx — left navigation + energy switch
   ────────────────────────────────────────────── */

function Sidebar({ route, setRoute, energy, setEnergy, collapsed, setCollapsed }) {
  const energyCfg = window.ENERGY[energy];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="brand-mark"><span>L</span></div>
        {!collapsed && (
          <div className="brand-text">
            <div className="name">Lorenna OS</div>
            <div className="sub">@lorennagn · Papel da Lola · Agência Logue</div>
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
      <nav className="nav">
        {window.NAV.map(item => (
          <div key={item.href}
            className={`nav-item ${route === item.href ? 'active' : ''}`}
            onClick={() => setRoute(item.href)}
            title={collapsed ? item.label : ''}>
            <Icon name={item.icon} size={17} />
            {!collapsed && <span>{item.label}</span>}
          </div>
        ))}
      </nav>

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
