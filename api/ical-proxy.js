export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      },
    });
  }

  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) {
    return new Response(JSON.stringify({ error: 'url param required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const fetchUrl = url.replace(/^webcal:\/\//i, 'https://');

  try {
    const resp = await fetch(fetchUrl, {
      headers: { 'User-Agent': 'CortexLola/1.0' },
    });
    if (!resp.ok) throw new Error(`Calendário retornou ${resp.status}`);
    const ics = await resp.text();
    const events = parseICS(ics);
    return new Response(JSON.stringify({ events }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'max-age=300',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}

function parseICS(ics) {
  const events = [];
  // Unfold continuation lines (RFC 5545)
  const text = ics.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
  const lines = text.split(/\r?\n/);

  let current = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { current = {}; continue; }
    if (line === 'END:VEVENT') {
      if (current && current.titulo && current.date) events.push(current);
      current = null;
      continue;
    }
    if (!current) continue;

    if (/^SUMMARY[;:]/.test(line)) {
      current.titulo = line.replace(/^SUMMARY[^:]*:/, '').replace(/\\n/g, ' ').trim();
    } else if (/^UID[;:]/.test(line)) {
      current.id = 'apple-' + line.replace(/^UID[^:]*:/, '').trim().slice(-24);
    } else if (/^DTSTART/.test(line)) {
      const val = line.replace(/^DTSTART[^:]*:/, '');
      const d = val.replace(/T.*/, '');
      if (d.length === 8) {
        current.date = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
      }
      // Extract time (ignore timezone for simplicity)
      const tm = val.match(/T(\d{2})(\d{2})/);
      if (tm) current.hora = `${tm[1]}:${tm[2]}`;
    }
  }

  // Assign fallback IDs
  events.forEach((ev, i) => {
    if (!ev.id) ev.id = `apple-${ev.date}-${i}`;
    if (!ev.tipo) ev.tipo = 'apple';
  });

  return events;
}
