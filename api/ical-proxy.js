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
    const base = parseICS(ics);
    const events = expandRecurring(base);
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
      const tm = val.match(/T(\d{2})(\d{2})/);
      if (tm) current.hora = `${tm[1]}:${tm[2]}`;
    } else if (/^RRULE[;:]/.test(line)) {
      current.rrule = line.replace(/^RRULE[^:]*:/, '').trim();
    } else if (/^EXDATE/.test(line)) {
      const vals = line.replace(/^EXDATE[^:]*:/, '').split(',');
      current.exdates = current.exdates || [];
      vals.forEach(v => {
        const d = v.replace(/T.*/, '').trim();
        if (d.length === 8) current.exdates.push(`${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`);
      });
    }
  }

  events.forEach((ev, i) => {
    if (!ev.id) ev.id = `apple-${ev.date}-${i}`;
    if (!ev.tipo) ev.tipo = 'apple';
  });

  return events;
}

function expandRecurring(events) {
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - 31);
  const windowEnd = new Date(now);
  windowEnd.setDate(windowEnd.getDate() + 92);

  const result = [];
  const DOW = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  for (const ev of events) {
    if (!ev.rrule) {
      result.push(ev);
      continue;
    }

    const r = parseRrule(ev.rrule);
    const exdates = new Set(ev.exdates || []);
    const until = r.until
      ? new Date(Math.min(r.until.getTime(), windowEnd.getTime()))
      : windowEnd;

    // Start cursor at noon UTC on the event's start date (avoids DST off-by-one)
    let cursor = new Date(ev.date + 'T12:00:00Z');
    const origDow = cursor.getUTCDay();
    const origDay = cursor.getUTCDate();
    const origMonth = cursor.getUTCMonth();

    let matchCount = 0;
    let stepIdx = 0;

    while (cursor <= until && stepIdx < 730) {
      stepIdx++;
      const y = cursor.getUTCFullYear();
      const m = String(cursor.getUTCMonth() + 1).padStart(2, '0');
      const d = String(cursor.getUTCDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;
      const inWindow = cursor >= windowStart && cursor <= windowEnd;
      const excluded = exdates.has(dateStr);

      if (!excluded && inWindow) {
        let matches = false;

        if (r.freq === 'DAILY') {
          matches = true;
        } else if (r.freq === 'WEEKLY') {
          matches = r.byday
            ? r.byday.includes(DOW[cursor.getUTCDay()])
            : cursor.getUTCDay() === origDow;
        } else if (r.freq === 'MONTHLY') {
          matches = cursor.getUTCDate() === origDay;
        } else if (r.freq === 'YEARLY') {
          matches = cursor.getUTCMonth() === origMonth && cursor.getUTCDate() === origDay;
        }

        if (matches) {
          result.push({
            ...ev,
            id: `${ev.id}_${dateStr}`,
            date: dateStr,
            rrule: undefined,
            exdates: undefined,
          });
          matchCount++;
          if (r.count && matchCount >= r.count) break;
        }
      }

      // Advance cursor
      if (r.freq === 'DAILY') {
        cursor.setUTCDate(cursor.getUTCDate() + r.interval);
      } else if (r.freq === 'WEEKLY') {
        // Step 1 day for BYDAY (check each day), 7*interval for plain weekly
        cursor.setUTCDate(cursor.getUTCDate() + (r.byday ? 1 : 7 * r.interval));
      } else if (r.freq === 'MONTHLY') {
        cursor.setUTCMonth(cursor.getUTCMonth() + r.interval);
      } else if (r.freq === 'YEARLY') {
        cursor.setUTCFullYear(cursor.getUTCFullYear() + r.interval);
      } else {
        break;
      }
    }
  }

  return result;
}

function parseRrule(str) {
  const r = { freq: '', interval: 1, count: null, until: null, byday: null };
  str.split(';').forEach(part => {
    const [k, v] = part.split('=');
    if (!k || !v) return;
    if (k === 'FREQ') r.freq = v;
    else if (k === 'INTERVAL') r.interval = parseInt(v) || 1;
    else if (k === 'COUNT') r.count = parseInt(v);
    else if (k === 'UNTIL') {
      const d = v.replace(/T.*/, '');
      if (d.length === 8) r.until = new Date(`${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}T23:59:59Z`);
    } else if (k === 'BYDAY') {
      r.byday = v.split(',').map(x => x.replace(/^[+-]?\d+/, '')); // strip ordinal (1MO → MO)
    }
  });
  return r;
}
