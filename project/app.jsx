/* ──────────────────────────────────────────────
   app.jsx — main shell, router, quick capture, tweaks
   ────────────────────────────────────────────── */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "pinkTone": "primary",
  "density": "comfortable",
  "showScribbles": true,
  "motion": true,
  "rounded": "soft"
}/*EDITMODE-END*/;

function QuickCapture({ open, setOpen, energy }) {
  const [text, setText] = useState('');
  const e = window.ENERGY[energy];

  function save() {
    if (!text.trim()) return;
    window.DB.saveCaptura(text.trim(), energy);
    showToast('Captura salva! IA vai processar.');
    setText('');
    setOpen(false);
  }

  useEffect(() => {
    function onKey(ev) {
      if (ev.key === 'Escape' && open) setOpen(false);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div onClick={() => setOpen(false)} style={{
      position: 'fixed', inset: 0,
      background: 'rgba(42, 34, 34, 0.45)',
      backdropFilter: 'blur(4px)',
      zIndex: 100,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      paddingTop: '14vh',
    }} className="fade-up">
      <div onClick={ev => ev.stopPropagation()} style={{
        width: 'min(600px, 92vw)',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--r-xl)',
        border: '1px solid var(--border)',
        boxShadow: 'none',
        overflow: 'hidden',
      }}>
        <div style={{ height: 4, background: e.color }}/>
        <div style={{ padding: 'var(--s-5)' }}>
          <div className="row between" style={{ marginBottom: 'var(--s-3)' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 18, fontWeight: 600 }}>
                Captura rápida {e.emoji}
              </h3>
              <p className="small muted" style={{ marginTop: 2 }}>
                Pode jogar tudo. A IA organiza depois.
              </p>
            </div>
            <button className="btn ghost icon" onClick={() => setOpen(false)}>
              <Icon name="x" size={14}/>
            </button>
          </div>
          <textarea
            autoFocus
            className="textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Despeje tudo aqui — pensamento, ideia, to-do, lembrete…"
            style={{ minHeight: 140 }}
            onKeyDown={ev => {
              if ((ev.metaKey || ev.ctrlKey) && ev.key === 'Enter') save();
            }}
          />
          <div className="row between" style={{ marginTop: 'var(--s-3)' }}>
            <span className="tiny muted">⌘ + Enter para salvar · Esc para fechar</span>
            <Button variant="primary" onClick={save} disabled={!text.trim()}>
              <Icon name="send" size={13} color="white"/> Salvar e organizar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingCapture({ onClick }) {
  return (
    <button onClick={onClick} title="Captura rápida (C)"
      style={{
        position: 'fixed', right: 28, bottom: 28, zIndex: 50,
        width: 56, height: 56,
        borderRadius: 999,
        border: 'none',
        background: 'var(--pink)',
        color: 'white',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .2s var(--easing)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <Icon name="zap" size={22} color="white"/>
    </button>
  );
}

function Tweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to root
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Pink tone
    const pinkPresets = {
      primary:  { pink: '#FF78B0', deep: '#E8538D', soft: '#FFC7DD', tint: '#FFE3EE' },
      warm:     { pink: '#FF6B9D', deep: '#D9477E', soft: '#FFBED1', tint: '#FFE0EB' },
      dusty:    { pink: '#D08AAB', deep: '#A75E80', soft: '#E3C2D2', tint: '#F5E6EE' },
      neon:     { pink: '#FF4FA1', deep: '#D62F84', soft: '#FCBAD8', tint: '#FFDFEC' },
    };
    const tone = pinkPresets[t.pinkTone] || pinkPresets.primary;
    root.style.setProperty('--pink',       tone.pink);
    root.style.setProperty('--pink-deep',  tone.deep);
    root.style.setProperty('--pink-soft',  tone.soft);
    root.style.setProperty('--pink-tint',  tone.tint);
    root.style.setProperty('--border-accent', tone.pink);
    root.style.setProperty('--text-accent', tone.deep);
    root.style.setProperty('--e-criativa', tone.pink);
    root.style.setProperty('--border-soft', tone.tint + '55');

    // Density
    if (t.density === 'compact') {
      root.style.setProperty('--s-4', '12px');
      root.style.setProperty('--s-5', '18px');
      root.style.setProperty('--s-6', '24px');
      root.style.setProperty('--s-7', '32px');
    } else if (t.density === 'airy') {
      root.style.setProperty('--s-4', '20px');
      root.style.setProperty('--s-5', '28px');
      root.style.setProperty('--s-6', '40px');
      root.style.setProperty('--s-7', '56px');
    } else {
      root.style.setProperty('--s-4', '16px');
      root.style.setProperty('--s-5', '24px');
      root.style.setProperty('--s-6', '32px');
      root.style.setProperty('--s-7', '48px');
    }

    // Rounded
    if (t.rounded === 'sharp') {
      root.style.setProperty('--r-md', '8px');
      root.style.setProperty('--r-lg', '10px');
      root.style.setProperty('--r-xl', '14px');
    } else if (t.rounded === 'pillowy') {
      root.style.setProperty('--r-md', '20px');
      root.style.setProperty('--r-lg', '28px');
      root.style.setProperty('--r-xl', '36px');
    } else {
      root.style.setProperty('--r-md', '14px');
      root.style.setProperty('--r-lg', '20px');
      root.style.setProperty('--r-xl', '28px');
    }

    // Motion
    body.dataset.motion = t.motion ? 'on' : 'off';

    // Scribbles
    document.querySelectorAll('.dna-scribble').forEach(el => {
      el.style.display = t.showScribbles ? 'block' : 'none';
    });
  }, [t]);

  return (
    <TweaksPanel title="Tweaks · Papel da Lola">
      <TweakSection label="Identidade visual">
        <TweakRadio label="Tom de rosa"
          value={t.pinkTone}
          options={[
            { value: 'primary', label: 'Padrão'  },
            { value: 'warm',    label: 'Quente'  },
            { value: 'dusty',   label: 'Empoeirado' },
            { value: 'neon',    label: 'Vibrante' },
          ]}
          onChange={v => setTweak('pinkTone', v)} />
        <TweakToggle label="Floreio decorativo (Papel da Lola DNA)"
          value={t.showScribbles}
          onChange={v => setTweak('showScribbles', v)} />
      </TweakSection>

      <TweakSection label="Ergonomia (TDAH)">
        <TweakRadio label="Densidade"
          value={t.density}
          options={[
            { value: 'compact',     label: 'Densa' },
            { value: 'comfortable', label: 'Padrão' },
            { value: 'airy',        label: 'Arejada' },
          ]}
          onChange={v => setTweak('density', v)} />
        <TweakRadio label="Cantos"
          value={t.rounded}
          options={[
            { value: 'sharp',    label: 'Limpos' },
            { value: 'soft',     label: 'Suaves' },
            { value: 'pillowy',  label: 'Almofadados' },
          ]}
          onChange={v => setTweak('rounded', v)} />
        <TweakToggle label="Animações"
          value={t.motion}
          onChange={v => setTweak('motion', v)} />
      </TweakSection>
    </TweaksPanel>
  );
}

function App() {
  const [route, setRoute] = useState('/');
  const [energy, setEnergy] = useState('criativa');
  const [collapsed, setCollapsed] = useState(false);
  const [capture, setCapture] = useState(false);
  const [dbReady, setDbReady] = useState(false);

  // Load data from Supabase on mount
  useEffect(() => {
    window.DB.loadAll().then(() => setDbReady(true));
  }, []);

  // Hotkey: C opens capture
  useEffect(() => {
    function onKey(ev) {
      if ((ev.key === 'c' || ev.key === 'C') && !capture &&
          document.activeElement.tagName !== 'INPUT' &&
          document.activeElement.tagName !== 'TEXTAREA') {
        setCapture(true);
        ev.preventDefault();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [capture]);

  const sidebarWidth = collapsed ? 76 : 248;

  const PageMap = {
    '/':            () => <DashboardPage   energy={energy} setEnergy={setEnergy} setRoute={setRoute} openCapture={() => setCapture(true)} />,
    '/captura':     () => <CapturaPage     energy={energy} />,
    '/ideias':      () => <IdeiasPage      />,
    '/tarefas':     () => <TarefasPage     />,
    '/conteudo':    () => <ConteudoPage    />,
    '/prompts':     () => <PromptsPage     />,
    '/clientes':    () => <ClientesPage    setRoute={setRoute} />,
    '/crm':         () => <CRMPage         />,
    '/agenda':      () => <AgendaPage      />,
    '/financeiro':  () => <FinanceiroPage  />,
    '/materiais':   () => <MateriaisPage   />,
    '/precificacao':() => <PrecificacaoPage />,
    '/diario':      () => <DiarioPage      />,
    '/blog':        () => <BlogPage         />,
    '/referencias': () => <ReferenciasPage />,
    '/sobre':       () => <SobrePage       />,
    '/monetizacao': () => <MonetizacaoPage />,
    '/deploy':      () => <DeployPage      />,
    '/mapa':        () => <MapaPage        />,
  };
  const Page = PageMap[route] || PageMap['/'];

  // Page-screen labels for review comments
  const screenLabels = {
    '/':             '01 Dashboard',
    '/captura':      '02 Captura Mental',
    '/ideias':       '03 Banco de Ideias',
    '/tarefas':      '04 Tarefas',
    '/conteudo':     '05 Conteúdos',
    '/prompts':      '06 Prompts',
    '/clientes':     '07 Clientes',
    '/crm':          '08 CRM Criativo',
    '/agenda':       '09 Agenda',
    '/financeiro':   '10 Financeiro',
    '/materiais':    '11 Materiais',
    '/precificacao': '12 Precificação',
    '/diario':       '13 Diário da Terapia',
    '/blog':         '15 Blog',
    '/referencias':  '16 Referências',
    '/sobre':        '17 Sobre',
    '/monetizacao':  '14 Monetização',
    '/deploy':       '15 Como Pôr no Ar',
    '/mapa':         '16 Mapa Mental',
  };

  if (!dbReady) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text-muted)', fontSize: 14 }}>
        Carregando...
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar
        route={route} setRoute={setRoute}
        energy={energy} setEnergy={setEnergy}
        collapsed={collapsed} setCollapsed={setCollapsed}
      />
      <main className="app-main" style={{ marginLeft: sidebarWidth }}
        data-screen-label={screenLabels[route]} key={route}>
        <Page />
      </main>
      <FloatingCapture onClick={() => setCapture(true)} />
      <QuickCapture open={capture} setOpen={setCapture} energy={energy} />
      <ClaudeKeyButton />
      <Tweaks />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
