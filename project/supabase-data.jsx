/* ──────────────────────────────────────────────
   supabase-data.jsx — Supabase client + DB layer
   ──────────────────────────────────────────────

SQL to run in Supabase dashboard (Settings → SQL Editor):

create table if not exists tarefas (
  id text primary key,
  titulo text not null,
  status text default 'pendente',
  prioridade text default 'media',
  cliente text,
  area text,
  micro jsonb default '[]',
  dias_semana jsonb default null,
  diario boolean default false,
  energia jsonb default '[]',
  created_at timestamptz default now()
);
-- alter table tarefas add column if not exists dias_semana jsonb default null;
-- alter table tarefas add column if not exists diario boolean default false;
-- alter table tarefas add column if not exists energia jsonb default '[]';
create table if not exists ideias (
  id text primary key,
  titulo text not null,
  descricao text,
  status text default 'bruta',
  categoria text,
  energia text,
  created_at timestamptz default now()
);
create table if not exists conteudos (
  id text primary key,
  titulo text not null,
  status text default 'ideia',
  tipo text,
  categoria text,
  plataformas jsonb default '[]',
  brand text,
  data text,
  created_at timestamptz default now()
);
create table if not exists capturas (
  id uuid primary key default gen_random_uuid(),
  texto text not null,
  energia text,
  created_at timestamptz default now()
);
alter table tarefas enable row level security;
alter table ideias enable row level security;
alter table conteudos enable row level security;
alter table capturas enable row level security;
create policy "public access" on tarefas for all using (true) with check (true);
create policy "public access" on ideias for all using (true) with check (true);
create policy "public access" on conteudos for all using (true) with check (true);
create policy "public access" on capturas for all using (true) with check (true);

*/

const SUPABASE_URL = 'https://eryhuxfdrzmbswunkshb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4ANYidC4dkTzk7knZ7Jv2g_X4pTgzXi';

const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

window.SUPABASE_SQL = `create table if not exists tarefas (
  id text primary key,
  titulo text not null,
  status text default 'pendente',
  prioridade text default 'media',
  cliente text,
  area text,
  micro jsonb default '[]',
  dias_semana jsonb default null,
  diario boolean default false,
  energia jsonb default '[]',
  created_at timestamptz default now()
);
-- Se a tabela já existir, rode também:
-- alter table tarefas add column if not exists dias_semana jsonb default null;
-- alter table tarefas add column if not exists diario boolean default false;
-- alter table tarefas add column if not exists energia jsonb default '[]';
create table if not exists ideias (
  id text primary key,
  titulo text not null,
  descricao text,
  status text default 'bruta',
  categoria text,
  energia text,
  created_at timestamptz default now()
);
create table if not exists conteudos (
  id text primary key,
  titulo text not null,
  status text default 'ideia',
  tipo text,
  categoria text,
  plataformas jsonb default '[]',
  brand text,
  data text,
  created_at timestamptz default now()
);
create table if not exists capturas (
  id uuid primary key default gen_random_uuid(),
  texto text not null,
  energia text,
  created_at timestamptz default now()
);
alter table tarefas enable row level security;
alter table ideias enable row level security;
alter table conteudos enable row level security;
alter table capturas enable row level security;
create policy "public access" on tarefas for all using (true) with check (true);
create policy "public access" on ideias for all using (true) with check (true);
create policy "public access" on conteudos for all using (true) with check (true);
create policy "public access" on capturas for all using (true) with check (true);

-- ── NOVAS TABELAS — rode no Supabase SQL Editor ──
create table if not exists vitorias (
  id text primary key,
  texto text not null,
  icon text default '🎯',
  created_at timestamptz default now()
);
create table if not exists agenda_events (
  id text primary key,
  titulo text not null,
  date text not null,
  hora text,
  tipo text default 'admin',
  recorrente boolean default false,
  created_at timestamptz default now()
);
create table if not exists diario (
  id text primary key,
  data text not null,
  hora text,
  humor integer default 5,
  pesou text default '',
  bom text default '',
  corpo text default '',
  relacoes text default '',
  gatilho text default '',
  terapia text default '',
  livre text default '',
  created_at timestamptz default now()
);
alter table vitorias enable row level security;
alter table agenda_events enable row level security;
alter table diario enable row level security;
create policy "public access" on vitorias for all using (true) with check (true);
create policy "public access" on agenda_events for all using (true) with check (true);
create policy "public access" on diario for all using (true) with check (true);`;

window.DB = {
  /* Load all data from Supabase and replace demo globals */
  async loadAll() {
    try {
      const [tarefasRes, ideiasRes, conteudosRes] = await Promise.all([
        _sb.from('tarefas').select('*').order('created_at', { ascending: true }),
        _sb.from('ideias').select('*').order('created_at', { ascending: true }),
        _sb.from('conteudos').select('*').order('created_at', { ascending: true }),
      ]);

      // Only replace if data came back without error and has rows
      if (!tarefasRes.error && tarefasRes.data && tarefasRes.data.length > 0) {
        window.DEMO_TASKS = tarefasRes.data;
      }
      if (!ideiasRes.error && ideiasRes.data && ideiasRes.data.length > 0) {
        window.DEMO_IDEAS = ideiasRes.data;
      }
      if (!conteudosRes.error && conteudosRes.data && conteudosRes.data.length > 0) {
        window.DEMO_CONTENT = conteudosRes.data;
      }
    } catch (err) {
      // Fail silently — demo data remains as fallback
      console.warn('[DB] loadAll failed, using demo data:', err);
    }
  },

  /* Upsert a task to 'tarefas' */
  async saveTarefa(tarefa) {
    try {
      const { data, error } = await _sb.from('tarefas').upsert(tarefa, { onConflict: 'id' });
      if (error) return null;
      return data;
    } catch { return null; }
  },

  /* Upsert an idea to 'ideias' */
  async saveIdeia(ideia) {
    try {
      const { data, error } = await _sb.from('ideias').upsert(ideia, { onConflict: 'id' });
      if (error) return null;
      return data;
    } catch { return null; }
  },

  /* Upsert content to 'conteudos' */
  async saveConteudo(conteudo) {
    try {
      const { data, error } = await _sb.from('conteudos').upsert(conteudo, { onConflict: 'id' });
      if (error) return null;
      return data;
    } catch { return null; }
  },

  /* Insert a quick capture to 'capturas' */
  async saveCaptura(texto, energia) {
    try {
      const { data, error } = await _sb.from('capturas').insert({
        id: crypto.randomUUID(),
        texto,
        energia: energia || null,
        created_at: new Date().toISOString(),
      });
      if (error) return null;
      return data;
    } catch { return null; }
  },

  /* Update just the status field of a tarefa */
  async updateTarefaStatus(id, status) {
    try {
      const { data, error } = await _sb.from('tarefas').update({ status }).eq('id', id);
      if (error) return null;
      return data;
    } catch { return null; }
  },

  /* Update the micro array of a tarefa — toggle one micro step's done state */
  async updateMicroDone(tarefaId, microId, done) {
    try {
      const { data: rows, error: fetchErr } = await _sb.from('tarefas').select('micro').eq('id', tarefaId).single();
      if (fetchErr || !rows) return null;
      const micro = (rows.micro || []).map(m => m.id === microId ? { ...m, done } : m);
      const { data, error } = await _sb.from('tarefas').update({ micro }).eq('id', tarefaId);
      if (error) return null;
      return data;
    } catch { return null; }
  },

  /* ── Pequenas Vitórias ── */
  async loadVitorias() {
    try {
      const { data, error } = await _sb.from('vitorias').select('*').order('created_at', { ascending: false });
      if (error || !data) return null;
      return data;
    } catch { return null; }
  },
  async saveVitoria(v) {
    try {
      const { error } = await _sb.from('vitorias').upsert(
        { id: String(v.id), texto: v.texto || v.text, icon: v.icon || '🎯', created_at: v.created_at || new Date().toISOString() },
        { onConflict: 'id' }
      );
      return !error;
    } catch { return false; }
  },

  /* ── Agenda Events ── */
  async loadAgendaEvents() {
    try {
      const { data, error } = await _sb.from('agenda_events').select('*').order('date', { ascending: true });
      if (error || !data) return null;
      return data;
    } catch { return null; }
  },
  async saveAgendaEvent(ev) {
    try {
      const { error } = await _sb.from('agenda_events').upsert(
        { id: String(ev.id), titulo: ev.titulo, date: ev.date, hora: ev.hora || null, tipo: ev.tipo || 'admin', recorrente: !!ev.recorrente, created_at: new Date().toISOString() },
        { onConflict: 'id' }
      );
      return !error;
    } catch { return false; }
  },
  async deleteAgendaEvent(id) {
    try {
      const { error } = await _sb.from('agenda_events').delete().eq('id', String(id));
      return !error;
    } catch { return false; }
  },

  /* ── Diário Terapêutico ── */
  async loadDiario() {
    try {
      const { data, error } = await _sb.from('diario').select('*').order('data', { ascending: false });
      if (error || !data) return null;
      return data;
    } catch { return null; }
  },
  async saveDiarioEntry(e) {
    try {
      const { error } = await _sb.from('diario').upsert(
        { id: e.id, data: e.data, hora: e.hora || null, humor: e.humor ?? 5,
          pesou: e.pesou || '', bom: e.bom || '', corpo: e.corpo || '',
          relacoes: e.relacoes || '', gatilho: e.gatilho || '',
          terapia: e.terapia || '', livre: e.livre || '',
          created_at: e.created_at || new Date().toISOString() },
        { onConflict: 'id' }
      );
      return !error;
    } catch { return false; }
  },
};
