/* ──────────────────────────────────────────────
   pages-deploy.jsx — Guia de "Como por no ar"
   Notion · GitHub · Supabase · Vercel
   ────────────────────────────────────────────── */

function DeployPage() {
  const [step, setStep] = useState(0);
  const STEPS = [
    { id: 'visao',     label: 'Visão geral'    },
    { id: 'github',    label: 'GitHub'         },
    { id: 'supabase',  label: 'Supabase'       },
    { id: 'notion',    label: 'Notion'         },
    { id: 'claude',    label: 'Claude · IA'    },
    { id: 'vercel',    label: 'Vercel (deploy)'},
    { id: 'manutencao',label: 'Manutenção'     },
  ];

  return (
    <div className="content" style={{ maxWidth: 980 }}>
      <div className="col gap-6 fade-up">
        <PageHeader
          title="Como pôr no ar"
          subtitle="O caminho do zero até o sistema rodando online — sem precisar abrir Notion ou Supabase no dia-a-dia."
        />

        <div className="row" style={{ borderBottom: '1px solid var(--gray-light)', overflowX: 'auto', gap: 4 }}>
          {STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setStep(i)}
              style={{
                padding: '14px 18px',
                background: 'transparent', border: 'none',
                color: step === i ? 'var(--pink-deep)' : 'var(--gray)',
                fontWeight: step === i ? 600 : 500,
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                borderBottom: step === i ? '2px solid var(--pink)' : '2px solid transparent',
                marginBottom: -1,
                whiteSpace: 'nowrap',
              }}>
              <span className="muted" style={{ marginRight: 6, fontWeight: 500 }}>{String(i+1).padStart(2,'0')}</span>
              {s.label}
            </button>
          ))}
        </div>

        <div className="col gap-5">
          {step === 0 && <DeployVisao/>}
          {step === 1 && <DeployGithub/>}
          {step === 2 && <DeploySupabase/>}
          {step === 3 && <DeployNotion/>}
          {step === 4 && <DeployClaude/>}
          {step === 5 && <DeployVercel/>}
          {step === 6 && <DeployManutencao/>}
        </div>

        <div className="row between" style={{ paddingTop: 'var(--s-4)', borderTop: '1px solid var(--gray-light)' }}>
          <Button variant="ghost" disabled={step === 0} onClick={() => setStep(Math.max(0, step-1))}>
            <Icon name="chev-left" size={14}/> Anterior
          </Button>
          <span className="tiny muted">{step+1} de {STEPS.length}</span>
          <Button variant="primary" disabled={step === STEPS.length-1} onClick={() => setStep(Math.min(STEPS.length-1, step+1))}>
            Próximo <Icon name="chev-right" size={14} color="white"/>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Step({ children }) {
  return <div className="col gap-4">{children}</div>;
}

function Para({ children }) {
  return <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-soft)' }}>{children}</p>;
}

function H2({ children }) {
  return <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--ink)' }}>{children}</h2>;
}

function H3({ children }) {
  return <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>{children}</h3>;
}

function Code({ children }) {
  return (
    <pre style={{
      background: 'var(--offwhite)',
      border: '1px solid var(--gray-light)',
      borderRadius: 15,
      padding: 'var(--s-4)',
      fontFamily: 'ui-monospace, SF Mono, monospace',
      fontSize: 12.5,
      color: 'var(--ink)',
      whiteSpace: 'pre-wrap',
      lineHeight: 1.6,
      margin: 0,
      overflow: 'auto',
    }}>{children}</pre>
  );
}

function Checklist({ items }) {
  return (
    <div className="col gap-2">
      {items.map((t, i) => (
        <div key={i} className="row gap-3" style={{
          padding: '12px 14px', background: 'var(--offwhite)',
          border: '1px solid var(--gray-light)', borderRadius: 15, alignItems: 'flex-start',
        }}>
          <div style={{ width: 18, height: 18, borderRadius: 5, border: '1.5px solid var(--gray)', flexShrink: 0, marginTop: 2 }}/>
          <span style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--ink-soft)' }}>{t}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Etapas ── */

function DeployVisao() {
  return (
    <Step>
      <H2>A arquitetura em uma página</H2>
      <Para>
        O Córtex Lola roda como um app web (Next.js no servidor) que conecta três fontes invisíveis:
        Supabase pra dados, Notion pra criação livre e Claude pra IA. Você só interage com o app —
        o resto trabalha por baixo.
      </Para>

      <Card variant="accent">
        <CardBody className="col gap-3">
          <H3>O fluxo do dia-a-dia</H3>
          <div className="col gap-2">
            {[
              ['1', 'Você abre o app (lorennaos.com.br ou domínio próprio)'],
              ['2', 'Captura uma ideia / cria tarefa / pede post pra cliente'],
              ['3', 'O app salva no Supabase automaticamente'],
              ['4', 'Quando precisa de criação livre, abre página espelhada no Notion'],
              ['5', 'Quando precisa de IA, Claude responde dentro do próprio app'],
            ].map(([n, t]) => (
              <div key={n} className="row gap-3" style={{ padding: '8px 0' }}>
                <span style={{
                  width: 26, height: 26, borderRadius: 999, background: 'var(--pink)',
                  color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 12, flexShrink: 0,
                }}>{n}</span>
                <span style={{ fontSize: 13.5, color: 'var(--ink-soft)' }}>{t}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <H3>O que cada peça faz</H3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--s-3)' }}>
        {[
          { icon: '🐙', t: 'GitHub',   d: 'Guarda o código do app. Toda mudança fica versionada — dá pra voltar a qualquer momento.' },
          { icon: '🗄️', t: 'Supabase', d: 'Banco de dados online. Guarda tarefas, ideias, clientes, capturas. Roda sozinho.' },
          { icon: '📝', t: 'Notion',    d: 'Onde você escreve livre — rascunhos longos, biblioteca de prompts, conteúdo editorial.' },
          { icon: '🌸', t: 'Claude',    d: 'IA que processa capturas, sugere microetapas, monta planos. Chamada de dentro do app.' },
          { icon: '▲',  t: 'Vercel',    d: 'Servidor que serve o app. Conecta com GitHub: você faz commit, ele publica.' },
        ].map(c => (
          <Card key={c.t}>
            <CardBody tight className="col gap-2">
              <div style={{ fontSize: 24 }}>{c.icon}</div>
              <H3>{c.t}</H3>
              <p style={{ fontSize: 12.5, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{c.d}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </Step>
  );
}

function DeployGithub() {
  return (
    <Step>
      <H2>GitHub · o esqueleto</H2>
      <Para>
        Você já tem o repositório <code>lorennaguerrab-cyber/agencia-logue</code> conectado.
        Aqui mora todo o código do Córtex Lola. Quando precisar mudar algo, ou eu (Claude) fizer uma atualização,
        cai aqui antes.
      </Para>

      <H3>Setup inicial (1 vez só)</H3>
      <Checklist items={[
        'Instalar Node.js no computador (versão 20 ou maior) — node.js.org',
        'Clonar o repo: abra o terminal e rode "git clone https://github.com/lorennaguerrab-cyber/agencia-logue.git"',
        'Entrar na pasta: "cd agencia-logue"',
        'Instalar dependências: "npm install"',
        'Rodar local: "npm run dev" — abre em localhost:3000',
      ]}/>

      <H3>Fluxo diário (5 segundos)</H3>
      <Para>
        Você não vai mexer no código todo dia. Mas se mexer (ou se eu mexer pra você), o ritual é:
      </Para>
      <Code>{`# Pegou alterações novas?
git pull

# Fez alguma mudança?
git add .
git commit -m "o que mudou"
git push`}</Code>

      <Card variant="accent">
        <CardBody>
          <H3>Atalho TDAH-friendly</H3>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: 6 }}>
            Instale o app <strong>GitHub Desktop</strong>. Ele faz tudo isso com botão visual, sem digitar nada.
            Você só clica em "Pull" pra pegar atualizações e "Push" pra enviar.
          </p>
        </CardBody>
      </Card>
    </Step>
  );
}

function DeploySupabase() {
  return (
    <Step>
      <H2>Supabase · onde os dados moram</H2>
      <Para>
        Hoje os dados são todos locais (vivem no navegador). Pra rodar de verdade, eles precisam ir pra um
        banco online. Supabase é grátis pra começar e nunca exige cartão de crédito até estourar limite generoso.
      </Para>

      <H3>Setup (15 minutos)</H3>
      <Checklist items={[
        'Criar conta em supabase.com',
        'Criar novo projeto: "lorenna-os"',
        'Anotar a URL e a anon key (Settings · API)',
        'Criar tabelas básicas (rodar SQL abaixo no SQL Editor)',
        'Adicionar essas chaves no arquivo .env.local do projeto',
      ]}/>

      <H3>SQL pra rodar (cria as tabelas)</H3>
      <Code>{`-- tabelas principais
create table tasks (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  status text default 'pendente',
  prioridade text default 'media',
  energia text[],
  categoria text,
  cliente_id uuid references clients(id),
  recorrente boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table ideas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  categoria text,
  plataformas text[],
  status text default 'bruta',
  tags text[],
  created_at timestamp default now()
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  setor text,
  receita_mensal numeric,
  custo_cognitivo int,
  alinhamento int,
  esforco int,
  created_at timestamp default now()
);

create table captures (
  id uuid primary key default gen_random_uuid(),
  conteudo_raw text not null,
  conteudo_processado text,
  tarefas_extraidas text[],
  ideias_extraidas text[],
  created_at timestamp default now()
);`}</Code>

      <H3>O .env.local</H3>
      <Code>{`NEXT_PUBLIC_SUPABASE_URL=https://seuprojeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui`}</Code>

      <Card variant="accent">
        <CardBody>
          <H3>Por que Supabase e não outro?</H3>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: 6 }}>
            Tem painel visual (você consegue olhar os dados sem abrir terminal),
            backup automático, autenticação pronta (se um dia quiser convidar alguém pra usar com você),
            e o tier gratuito aguenta até bem mais do que você vai precisar nos primeiros meses.
          </p>
        </CardBody>
      </Card>
    </Step>
  );
}

function DeployNotion() {
  return (
    <Step>
      <H2>Notion · sua base criativa</H2>
      <Para>
        Notion entra pra coisas que precisam de espaço pra respirar: rascunhos longos, banco de prompts editáveis,
        biblioteca de referências, conteúdo do blog em construção. O Córtex Lola lê e escreve no Notion via API —
        você não precisa abrir o Notion todo dia.
      </Para>

      <H3>Setup (10 minutos)</H3>
      <Checklist items={[
        'Criar integração em notion.so/my-integrations',
        'Nome: "Córtex Lola" · Tipo: Internal',
        'Copiar o "Internal Integration Token"',
        'Criar uma página-mãe no Notion: "🌸 Córtex Lola"',
        'Compartilhar essa página com a integração (botão "..." > "Connections")',
        'Pegar o ID da página (último trecho da URL, antes do "?")',
        'Adicionar no .env.local',
      ]}/>

      <H3>O .env.local</H3>
      <Code>{`NOTION_TOKEN=secret_seu_token_aqui
NOTION_PARENT_PAGE_ID=21abc...`}</Code>

      <H3>Estrutura sugerida dentro do Notion</H3>
      <Code>{`🌸 Córtex Lola (página-mãe)
├── 📥 Inbox (capturas que viraram texto longo)
├── 📚 Biblioteca de prompts (versão editável)
├── ✍️ Rascunhos longos
│   ├── Posts blog em construção
│   ├── Newsletters não enviadas
│   └── Roteiros
├── 🎨 Banco de referências (imagens, links)
└── 📓 Banco da voz (textos seus que viraram régua de tom)`}</Code>
    </Step>
  );
}

function DeployClaude() {
  return (
    <Step>
      <H2>Claude · sua copiloto</H2>
      <Para>
        Quando você captura "preciso lembrar de pedir o boleto e tive uma ideia sobre IA",
        é o Claude que separa em tarefa + ideia, categoriza e sugere microetapas. Tudo dentro do app.
      </Para>

      <H3>Setup (5 minutos)</H3>
      <Checklist items={[
        'Criar conta em console.anthropic.com',
        'Adicionar crédito mínimo (US$ 5 — dura meses no uso pessoal)',
        'Criar API key na seção "API Keys"',
        'Adicionar no .env.local',
        'Pronto — o app já tem a integração feita',
      ]}/>

      <H3>O .env.local</H3>
      <Code>{`ANTHROPIC_API_KEY=sk-ant-api03-...`}</Code>

      <Card variant="accent">
        <CardBody>
          <H3>Quanto custa por mês?</H3>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: 6 }}>
            Com uso médio (50 capturas mentais + 20 sugestões de microetapas + 10 roteiros sugeridos por mês),
            fica em torno de <strong>US$ 2-4</strong>. Você pode setar um teto duro de US$ 10/mês nas configurações
            da Anthropic pra dormir tranquila.
          </p>
        </CardBody>
      </Card>
    </Step>
  );
}

function DeployVercel() {
  return (
    <Step>
      <H2>Vercel · publicar no ar</H2>
      <Para>
        Esse é o passo que transforma o projeto local num site acessível pelo celular, pelo iPad,
        de qualquer lugar. Vercel conecta no seu GitHub e publica sozinho.
      </Para>

      <H3>Setup (5 minutos)</H3>
      <Checklist items={[
        'Criar conta em vercel.com (entra com GitHub)',
        'Clicar em "Add New > Project"',
        'Selecionar o repo "agencia-logue"',
        'Em "Environment Variables", colar todas as chaves do .env.local',
        'Clicar em "Deploy"',
        'Esperar 2 minutos · pronto · você tem uma URL: lorenna-os.vercel.app',
      ]}/>

      <H3>Domínio próprio (opcional)</H3>
      <Para>
        Comprar <code>os.papeldalola.com.br</code> ou <code>lorenna.os</code>:
      </Para>
      <Checklist items={[
        'Comprar domínio em registro.br (R$ 40/ano) ou Namecheap',
        'No Vercel, ir em Settings · Domains',
        'Adicionar o domínio · copiar os DNS que ele pede',
        'Colar esses DNS no painel onde comprou o domínio',
        'Esperar até 24h propagação · vira automático',
      ]}/>

      <Card variant="accent">
        <CardBody>
          <H3>A grande mágica</H3>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55, marginTop: 6 }}>
            Daqui em diante, todo <code>git push</code> que você der publica automático.
            Mudou texto? push. Adicionou cliente novo? push. Site atualizado em 30 segundos.
          </p>
        </CardBody>
      </Card>
    </Step>
  );
}

function DeployManutencao() {
  return (
    <Step>
      <H2>Manutenção · rotina de cuidado</H2>
      <Para>
        Um sistema vivo pede pouco cuidado, mas regular. Bota essas tarefas no Córtex Lola como recorrências.
      </Para>

      <H3>Diário · 2 minutos</H3>
      <Checklist items={[
        'Abrir o Córtex Lola de manhã (parte do ritual)',
        'Conferir foco do dia',
        'Definir energia atual',
      ]}/>

      <H3>Semanal · 20 minutos (domingo à noite)</H3>
      <Checklist items={[
        'Revisar capturas da semana — arquivar o que não virou nada',
        'Atualizar status de tarefas de clientes',
        'Adicionar novos insights nos cards de cliente',
        'Conferir métricas dos clientes (custo cognitivo + ROI)',
      ]}/>

      <H3>Mensal · 1 hora (último domingo do mês)</H3>
      <Checklist items={[
        'Backup do banco Supabase (Settings · Database · Backups)',
        'Revisar gastos: Vercel (R$ 0 no Hobby), Supabase (R$ 0 no Free), Claude (US$ 2-4)',
        'Atualizar dependências: rodar "npm outdated" e ver se vale upgrade',
        'Reavaliar carga cognitiva dos clientes — renegociar quem está em 4-5',
      ]}/>

      <Card variant="accent">
        <CardBody className="col gap-3">
          <H3>Quando algo quebrar</H3>
          <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.55 }}>
            Volta pra cá, abre uma conversa com Claude (este projeto mesmo) e cola o erro.
            Em 95% dos casos o conserto é uma linha. Site fora do ar? Vercel · Deployments · Redeploy.
          </p>
        </CardBody>
      </Card>

      <H3>Custo total mensal</H3>
      <Card>
        <CardBody>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <tbody>
              {[
                ['Vercel (Hobby)', 'R$ 0'],
                ['Supabase (Free)', 'R$ 0'],
                ['Claude API (uso médio)', 'US$ 2-4 · ~R$ 15-22'],
                ['Domínio próprio (opcional)', 'R$ 3,30 (R$ 40/ano)'],
              ].map(([k, v]) => (
                <tr key={k} style={{ borderBottom: '1px solid var(--gray-light)' }}>
                  <td style={{ padding: '12px 0', color: 'var(--ink-soft)' }}>{k}</td>
                  <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600 }}>{v}</td>
                </tr>
              ))}
              <tr>
                <td style={{ padding: '14px 0 0', fontFamily: 'var(--font-title)', fontWeight: 600 }}>Total estimado</td>
                <td style={{ padding: '14px 0 0', textAlign: 'right', fontFamily: 'var(--font-title)', fontWeight: 600, color: 'var(--pink-deep)' }}>≈ R$ 25/mês</td>
              </tr>
            </tbody>
          </table>
        </CardBody>
      </Card>
    </Step>
  );
}

Object.assign(window, { DeployPage });
