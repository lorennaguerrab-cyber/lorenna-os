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
