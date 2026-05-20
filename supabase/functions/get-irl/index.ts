// Supabase Edge Function — get-irl
// Récupère l'Indice de Référence des Loyers (IRL) publié par l'INSEE.
// Source : Banque de Données Macro-économiques INSEE, série 001515333
//   https://api.insee.fr/series/BDM/V1/data/SERIES_BDM/001515333 (public, XML SDMX, pas d'OAuth)
//
// Cache : table public.irl_history (1 ligne par trimestre)
// Robustesse :
//   1. Appelle l'API INSEE
//   2. Si succès, met en cache (UPSERT par period)
//   3. Si échec → renvoie le dernier IRL en cache (≤ 1 an)
//   4. Si rien → 503

const ALLOWED_ORIGINS = [
  "https://www.lavillacoliving.com",
  "https://lavillacoliving.com",
  "http://localhost:5173",
  "http://localhost:4173",
];

function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

interface IrlResult {
  period: string;   // "2026-Q1"
  value: number;    // 146.6
  date_jo: string;  // "2026-04-16" (date de publication au JO)
  source: "insee" | "cache";
}

// Format INSEE "2026-Q1" → "1er trimestre 2026" (français legal)
function frenchQuarter(period: string): string {
  const m = period.match(/^(\d{4})-Q([1-4])$/);
  if (!m) return period;
  const year = m[1];
  const q = parseInt(m[2], 10);
  const label = q === 1 ? "1er" : `${q}ème`;
  return `${label} trimestre ${year}`;
}

// ---------- Source INSEE ----------
async function tryInsee(): Promise<IrlResult | null> {
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch("https://api.insee.fr/series/BDM/V1/data/SERIES_BDM/001515333", {
      signal: ctrl.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const xml = await res.text();

    // Le XML retourne les Obs triées de la plus récente à la plus ancienne.
    // On extrait toutes les observations puis on prend la première (plus récente).
    const obsMatches = Array.from(xml.matchAll(/<Obs\s+TIME_PERIOD="([^"]+)"\s+OBS_VALUE="([^"]+)"[^>]*?(?:DATE_JO="([^"]+)")?[^>]*\/>/g));
    if (obsMatches.length === 0) return null;

    // Trouve la plus récente (TIME_PERIOD au format "YYYY-Qn" comparable lexicographiquement)
    let latest: { period: string; value: number; date_jo: string } | null = null;
    for (const m of obsMatches) {
      const period = m[1];
      const value = parseFloat(m[2]);
      const date_jo = m[3] || "";
      if (!latest || period > latest.period) {
        latest = { period, value, date_jo };
      }
    }
    if (!latest) return null;
    return { ...latest, source: "insee" };
  } catch (e) {
    console.warn("[get-irl] INSEE API failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

// ---------- Cache Supabase ----------
async function getCachedIrl(supabaseUrl: string, serviceRoleKey: string): Promise<IrlResult | null> {
  try {
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const url = `${supabaseUrl}/rest/v1/irl_history?fetched_at=gte.${oneYearAgo}&order=period.desc&limit=1`;
    const res = await fetch(url, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });
    if (!res.ok) return null;
    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const row = rows[0];
    return {
      period: String(row.period),
      value: Number(row.value),
      date_jo: row.date_jo ? String(row.date_jo) : "",
      source: "cache",
    };
  } catch (e) {
    console.warn("[get-irl] Cache read failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

async function saveToCache(
  supabaseUrl: string,
  serviceRoleKey: string,
  result: IrlResult,
): Promise<void> {
  try {
    const url = `${supabaseUrl}/rest/v1/irl_history`;
    await fetch(url, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        period: result.period,
        value: result.value,
        date_jo: result.date_jo || null,
        source: "insee",
      }),
    });
  } catch (e) {
    console.warn("[get-irl] Cache write failed:", e instanceof Error ? e.message : e);
  }
}

// ---------- Handler ----------
Deno.serve(async (req: Request): Promise<Response> => {
  const origin = req.headers.get("origin");
  const headers = { ...corsHeaders(origin), "Content-Type": "application/json" };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  // Tente INSEE en premier
  let result = await tryInsee();

  // Si succès, met en cache
  if (result && supabaseUrl && serviceRoleKey) {
    await saveToCache(supabaseUrl, serviceRoleKey, result);
  }

  // Si INSEE échoue, on lit le cache
  if (!result && supabaseUrl && serviceRoleKey) {
    result = await getCachedIrl(supabaseUrl, serviceRoleKey);
  }

  if (!result) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "INSEE indisponible et aucun IRL en cache valide.",
      }),
      { status: 503, headers },
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      period: result.period,                       // "2026-Q1"
      period_label: frenchQuarter(result.period),  // "1er trimestre 2026"
      value: result.value,                          // 146.6
      date_jo: result.date_jo || null,              // "2026-04-16"
      source: result.source,                        // "insee" | "cache"
    }),
    { status: 200, headers },
  );
});
