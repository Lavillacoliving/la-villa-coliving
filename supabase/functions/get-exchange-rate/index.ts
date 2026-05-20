// Supabase Edge Function — get-exchange-rate
// Récupère le taux EUR→CHF depuis Frankfurter ou la BCE (XML), côté serveur.
// Pas de souci CORS pour le frontend : tout l'appel externe se fait depuis Deno.
//
// Robustesse :
//   1. Tente Frankfurter (api.frankfurter.app) — source rapide
//   2. Si échec → tente le XML direct de la BCE (ecb.europa.eu)
//   3. Si succès, met en cache dans la table public.exchange_rates
//   4. Si les deux échouent → fallback sur le dernier taux en cache (≤7 jours)
//   5. Si pas de cache exploitable → renvoie 503

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
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

interface RateResult {
  rate: number;
  date: string;        // YYYY-MM-DD
  source: "frankfurter" | "ecb_xml" | "cache";
}

// ---------- Source 1 : Frankfurter ----------
async function tryFrankfurter(): Promise<RateResult | null> {
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch("https://api.frankfurter.app/latest?from=EUR&to=CHF", { signal: ctrl.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const rate = Number(data?.rates?.CHF);
    const date = String(data?.date || "");
    if (!rate || !date) return null;
    return { rate, date, source: "frankfurter" };
  } catch (e) {
    console.warn("[get-exchange-rate] Frankfurter failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

// ---------- Source 2 : ECB XML direct ----------
async function tryEcbXml(): Promise<RateResult | null> {
  try {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 5000);
    const res = await fetch("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml", { signal: ctrl.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const xml = await res.text();
    const rateMatch = xml.match(/currency="CHF"[^>]*rate="([0-9.]+)"/);
    const dateMatch = xml.match(/time="(\d{4}-\d{2}-\d{2})"/);
    if (!rateMatch || !dateMatch) return null;
    return { rate: parseFloat(rateMatch[1]), date: dateMatch[1], source: "ecb_xml" };
  } catch (e) {
    console.warn("[get-exchange-rate] ECB XML failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

// ---------- Cache Supabase ----------
async function getCachedRate(supabaseUrl: string, serviceRoleKey: string): Promise<RateResult | null> {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const url = `${supabaseUrl}/rest/v1/exchange_rates?from_currency=eq.EUR&to_currency=eq.CHF&rate_date=gte.${sevenDaysAgo}&order=rate_date.desc&limit=1`;
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
    return { rate: Number(row.rate), date: String(row.rate_date), source: "cache" };
  } catch (e) {
    console.warn("[get-exchange-rate] Cache read failed:", e instanceof Error ? e.message : e);
    return null;
  }
}

async function saveToCache(
  supabaseUrl: string,
  serviceRoleKey: string,
  result: RateResult,
): Promise<void> {
  try {
    const url = `${supabaseUrl}/rest/v1/exchange_rates`;
    await fetch(url, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        from_currency: "EUR",
        to_currency: "CHF",
        rate: result.rate,
        rate_date: result.date,
        source: result.source,
      }),
    });
  } catch (e) {
    console.warn("[get-exchange-rate] Cache write failed:", e instanceof Error ? e.message : e);
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

  // Tente Frankfurter en premier
  let result = await tryFrankfurter();

  // Sinon ECB XML
  if (!result) {
    result = await tryEcbXml();
  }

  // Si une API a répondu, on met à jour le cache
  if (result && supabaseUrl && serviceRoleKey) {
    await saveToCache(supabaseUrl, serviceRoleKey, result);
  }

  // Si les 2 APIs échouent, on lit le cache (≤ 7 jours)
  if (!result && supabaseUrl && serviceRoleKey) {
    result = await getCachedRate(supabaseUrl, serviceRoleKey);
  }

  if (!result) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Toutes les sources de taux sont indisponibles (Frankfurter, BCE XML et cache).",
      }),
      { status: 503, headers },
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      rate: result.rate,
      date: result.date,
      source: result.source,
    }),
    { status: 200, headers },
  );
});
