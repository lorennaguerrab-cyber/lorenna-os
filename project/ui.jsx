/* ──────────────────────────────────────────────
   ui.jsx — Card, Button, Badge, Icon, Toast
   ────────────────────────────────────────────── */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ── Icon system — line-style, paper-friendly ── */
function Icon({ name, size = 16, color, style }) {
  const s = size;
  const stroke = color || 'currentColor';
  const sw = 1.6;
  const props = {
    width: s, height: s, viewBox: '0 0 24 24',
    fill: 'none', stroke, strokeWidth: sw,
    strokeLinecap: 'round', strokeLinejoin: 'round',
    style,
  };
  switch (name) {
    case 'home':     return <svg {...props}><path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"/></svg>;
    case 'zap':      return <svg {...props}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>;
    case 'bulb':     return <svg {...props}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3v1h6v-1c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2Z"/></svg>;
    case 'check':    return <svg {...props}><path d="M3 12.5 4 17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H6"/><path d="m8 12 3 3 7-7"/></svg>;
    case 'doc':      return <svg {...props}><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/></svg>;
    case 'book':     return <svg {...props}><path d="M4 4.5A2 2 0 0 1 6 2.5h13v18H6.5A2.5 2.5 0 0 1 4 18Z"/><path d="M19 20.5H6.5A2.5 2.5 0 0 1 4 18"/></svg>;
    case 'users':    return <svg {...props}><circle cx="9" cy="8" r="3.5"/><path d="M3 20c0-3 2.7-5 6-5s6 2 6 5"/><path d="M15.5 11.5a3 3 0 0 0 0-6"/><path d="M17 20c0-2.5 1.7-3.5 4-3.5"/></svg>;
    case 'sparkle':  return <svg {...props}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>;
    case 'network':  return <svg {...props}><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M12 7.5V14m-5 1.5 4-2.5m6 2.5-4-2.5"/></svg>;
    case 'plus':     return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case 'search':   return <svg {...props}><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/></svg>;
    case 'arrow':    return <svg {...props}><path d="M5 12h14M14 5l7 7-7 7"/></svg>;
    case 'chev-right':return<svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case 'chev-down':return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case 'chev-left':return <svg {...props}><path d="m15 6-6 6 6 6"/></svg>;
    case 'send':     return <svg {...props}><path d="m22 2-11 11M22 2l-7 20-4-9-9-4Z"/></svg>;
    case 'mic':      return <svg {...props}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M9 21h6"/></svg>;
    case 'bell':     return <svg {...props}><path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 8H4c0-2 2-3 2-8Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>;
    case 'copy':     return <svg {...props}><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M3 16V5a2 2 0 0 1 2-2h11"/></svg>;
    case 'archive':  return <svg {...props}><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8M10 12h4"/></svg>;
    case 'calendar': return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case 'filter':   return <svg {...props}><path d="M3 5h18l-7 9v6l-4-2v-4Z"/></svg>;
    case 'list':     return <svg {...props}><path d="M9 6h12M9 12h12M9 18h12M5 6h.01M5 12h.01M5 18h.01"/></svg>;
    case 'grid':     return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case 'heart':    return <svg {...props}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/></svg>;
    case 'brain':    return <svg {...props}><path d="M12 5a3 3 0 0 0-5 2 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 5 2"/><path d="M12 5a3 3 0 0 1 5 2 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-5 2"/></svg>;
    case 'trend':    return <svg {...props}><path d="m3 17 6-6 4 4 8-8M15 7h6v6"/></svg>;
    case 'alert':    return <svg {...props}><path d="M12 9v4M12 17h.01M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>;
    case 'x':        return <svg {...props}><path d="M18 6 6 18M6 6l12 12"/></svg>;
    case 'flower':   return <svg {...props}><circle cx="12" cy="12" r="2"/><path d="M12 10V4M12 14v6M14 12h6M10 12H4M14.5 9.5 19 5M9.5 14.5 5 19M14.5 14.5 19 19M9.5 9.5 5 5"/></svg>;
    case 'tag':      return <svg {...props}><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="8" cy="8" r="1.5"/></svg>;
    case 'menu':     return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
    case 'mail':     return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>;
    case 'play':     return <svg {...props}><path d="M6 4v16l14-8Z"/></svg>;
    case 'msg':      return <svg {...props}><path d="M21 12a8 8 0 0 1-12 7l-6 2 2-6a8 8 0 1 1 16-3Z"/></svg>;
    case 'cog':      return <svg {...props}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 1 1 4.3 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.8L4.3 7a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.7 7l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>;
    case 'coin':     return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5C9.5 8.1 10.6 7 12 7s2.5 1.1 2.5 2.5S13.4 12 12 12s-2.5 1.1-2.5 2.5S10.6 17 12 17s2.5-1.1 2.5-2.5"/></svg>;
    case 'print':    return <svg {...props}><path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="9" rx="1"/><path d="M6 18v3h12v-3M6 13h.01M9 13h.01"/></svg>;
    case 'link':     return <svg {...props}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
    case 'bookmark': return <svg {...props}><path d="M5 3h14a1 1 0 0 1 1 1v17l-8-4-8 4V4a1 1 0 0 1 1-1Z"/></svg>;
    case 'camera':   return <svg {...props}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg>;
    case 'pen':      return <svg {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>;
    default: return null;
  }
}

/* ── Card ── */
function Card({ children, className = '', variant = 'default', hoverable, onClick, style }) {
  const v = variant !== 'default' ? variant : '';
  const h = hoverable ? 'hoverable' : '';
  return <div className={`card ${v} ${h} ${className}`} onClick={onClick} style={style}>{children}</div>;
}
function CardHeader({ children, className = '' }) { return <div className={`card-header ${className}`}>{children}</div>; }
function CardBody({ children, className = '', tight }) { return <div className={`card-body ${tight ? 'tight' : ''} ${className}`}>{children}</div>; }

/* ── Button ── */
function Button({ children, variant = 'secondary', size = 'md', onClick, className = '', disabled, type = 'button', style, title }) {
  return (
    <button type={type} title={title} disabled={disabled} style={style}
      className={`btn ${variant} ${size} ${disabled ? 'disabled' : ''} ${className}`}
      onClick={onClick}>
      {children}
    </button>
  );
}

/* ── Badge ── */
function Badge({ children, variant = 'default', className = '', style }) {
  return <span className={`badge ${variant !== 'default' ? variant : ''} ${className}`} style={style}>{children}</span>;
}

/* ── Toast ── */
let toastTimer = null;
function showToast(message) {
  let host = document.getElementById('toast-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toast-host';
    document.body.appendChild(host);
  }
  host.innerHTML = '';
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  host.appendChild(el);
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.remove(); }, 2600);
}

/* ── Score bar ── */
function ScoreBar({ value, max = 5, color }) {
  return (
    <div className="row" style={{ gap: 3 }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: 999,
          background: i < value ? color : 'var(--bg-hover)',
          transition: 'background .2s',
        }}/>
      ))}
    </div>
  );
}

Object.assign(window, { Icon, Card, CardHeader, CardBody, Button, Badge, showToast, ScoreBar });
