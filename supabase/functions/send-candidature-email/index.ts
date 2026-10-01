// Supabase Edge Function — send-candidature-email
// v19 — 10/2026 — Formulaire allégé + 2 questions après l'envoi (Lot A du brief « Formulaire,
//   hydratation, mesure » du 30/09/2026, plan + débrief validés par Jérôme le 30/09)
//   CHANGEMENTS vs v18 :
//   1. Mode « compléments » (`mode: "details"`, branche isolée en tête) : les 2 questions
//      facultatives arrivée/durée, posées sur l'écran de succès, mettent à jour LA MÊME ligne
//      `prospects` — `lease_duration` seulement si NULL, lignes « Souhait d'arrivée : » /
//      « Durée souhaitée : » seulement si absentes, PATCH conditionné à la valeur lue de `notes`
//      (jamais d'écrasement d'une saisie), idempotent (`updated:false` au rejeu). Autorisé par un
//      jeton HMAC à 1 h (`details_token`) renvoyé par le chemin normal — prospect, clé de
//      soumission, id Resend de la notification. Aucun email candidat, aucune écriture
//      `form_submissions`, aucun changement de schéma.
//   2. Email « Compléments » (admin seulement, mêmes destinataires que la notification) envoyé
//      SEULEMENT quand quelque chose a été écrit, dans le fil de la notification (« Re: » +
//      In-Reply-To / References = message_id Resend de la notification).
//   3. Notification admin orientée Fanny : plus de lignes « — » pour l'arrivée et la durée (une
//      phrase annonce l'email « Compléments ») ; libellés au lieu des clés brutes ; canal préféré
//      accolé au téléphone.
//   4. Canal préféré `contact_preference` ∈ whatsapp | call | email (pastilles facultatives) :
//      ligne « Canal préféré : … » dans `notes`, phrase « Fanny te contacte par … » dans
//      l'auto-réponse. Valeur hors liste ignorée SANS erreur.
//   5. Destinataires supplémentaires facultatifs des emails admin : secrets
//      `CANDIDATURE_NOTIFY_TO` / `CANDIDATURE_NOTIFY_CC` (listes séparées par des virgules),
//      jamais en dur, IGNORÉS pour une soumission `is_test`.
//   6. Insert `prospects` en `return=representation&select=id` (id du jeton) ; tables de
//      libellés au niveau module ; « Jusqu'à 3 mois » aligné sur le formulaire (29/09).
//   Le jeton est construit APRÈS les emails, sous try/catch : il ne peut ni faire échouer une
//   candidature ni empêcher ses emails. Pas de jeton sur le honeypot, sur un doublon de clé, ni
//   sur le chemin « même email < 10 min » (on n'écrit jamais sur la fiche d'un autre).
//   Rétrocompatible : un front v18 ignore `details_token` ; la v18 ignorait déjà tout champ inconnu.
//   Tests hors production : tools/test/edge-candidature.test.mjs (Deno simulé, PostgREST et
//   Resend factices). Ordre de déploiement : merge sur main → déploiement v19 DEPUIS main (MCP,
//   verify_jwt: true) → test express ?test=1 avec le front actuel → merge du front.
// v18 — 09/2026 — Canal déclaré « Assistant IA » (Lot S3 du brief Socle entité, plan validé 04/09)
//   CHANGEMENTS vs v17 :
//   1. Nouvelle valeur du select `source` du formulaire : `ai-assistant` (libellé « Assistant IA
//      (ChatGPT, Perplexity, Gemini…) », en 3ᵉ position après Google). CHANNEL_LABELS["ai-assistant"]
//      = « Assistant IA » (notes du prospect) ; PROSPECT_SOURCE_MAP["ai-assistant"] = `assistant_ia`,
//      valeur ajoutée à prospects_source_check (16 valeurs) par
//      scripts/migration-prospects-source-assistant-ia.sql, à appliquer AVANT ce déploiement.
//      Si la contrainte refusait la valeur, le filet existant retomberait sur site_web avec
//      « Canal déclaré : Assistant IA » en notes — aucune candidature perdue, rebascule possible.
//   2. AUCUN changement de logique d'envoi, d'idempotence, de filets ni d'emails.
//   Rétrocompatible : sans cette valeur, comportement v17 strictement identique.
//   Ordre de déploiement : migration (Jérôme, MCP) → merge sur main → déploiement v18 DEPUIS main
//   (jamais depuis la branche) → le front la propose (déjà mergé avec cette version).
// v17 — 03/09/2026 — Page d'atterrissage + portes internes (Lot 1 du brief SEO funnel, plan validé 03/09)
//   CHANGEMENTS vs v16 :
//   1. Payload optionnel `landing_page` / `referrer` / `entry_page` (posés par le front :
//      première page de la session et son referrer — origine + chemin, sans query —,
//      page de soumission) → 3 colonnes text NULL de form_submissions SEULEMENT
//      (migration `attribution_landing_2026_09_03`). Trim, caractères de contrôle retirés,
//      512 caractères max, vide → null. Jointes à l'insert QUE si au moins une valeur.
//   2. Les colonnes utm_* reçoivent désormais aussi les « UTM virtuels » des portes
//      internes (utm_source = site, utm_medium = bloc_offre | article_cta | …), écrits par
//      le front dans le même sessionStorage que l'attribution Ads — AUCUN changement ici :
//      mêmes clés, mêmes colonnes, `is_paid` inchangé (site ≠ cpc → organique).
//   3. Notes du prospect : ligne « Atterrissage : /blog/<slug> — via <referrer> » (décision
//      Q11b), lisible par Fanny au dashboard. `prospects` n'a pas de colonne pour ça.
//   4. Cascade de filets étendue, toujours « du plus récent au plus établi » : complet →
//      sans atterrissage → sans intérêt → sans attribution → sans clé. AUCUN changement de
//      logique d'envoi, d'idempotence ni d'emails.
//   Rétrocompatible : sans ces champs, corps identiques à la v16.
//   Ordre de déploiement : migration → merge sur main → déploiement v17 DEPUIS main
//   (jamais depuis la branche) → le front les envoie (déjà mergé avec cette version).
// v16 — 02/09/2026 — Canaux de découverte Facebook / WhatsApp / Google Maps (demande + GO Jérôme 02/09)
//   CHANGEMENTS vs v15 :
//   1. Trois nouvelles valeurs du select `source` du formulaire : `facebook`, `whatsapp`,
//      `google-maps` (CHANNEL_LABELS + PROSPECT_SOURCE_MAP). `facebook` et `whatsapp`
//      existaient déjà dans prospects_source_check ; `google_maps` y a été ajouté par
//      Jérôme le 02/09 (scripts/migration-prospects-source-google-maps.sql — 15 valeurs
//      vérifiées par pg_get_constraintdef) → les trois sont écrits tels quels.
//      Si la contrainte refusait un jour `google_maps`, le filet existant retomberait
//      sur site_web, le canal exact restant en notes (« Canal déclaré : Google Maps »).
//   2. AUCUN changement de logique d'envoi, d'idempotence, de filets ni d'emails.
//   Rétrocompatible : sans ces valeurs, comportement v15 strictement identique.
//   Ordre de déploiement : migration (faite 02/09) → merge sur main → déploiement v16
//   DEPUIS main (jamais depuis la branche).
// v15 — 29/08/2026 — Durabilité du pipeline (Brief Conversion V2, Lot 1a — plan validé 29/08)
//   CHANGEMENTS vs v14 :
//   1. ORDRE INVERSÉ : écritures AVANT les emails. `form_submissions` devient la
//      source de vérité (2 candidatures perdues + 4 clusters de doubles en 2 mois,
//      audit 28/08). Échec TOTAL d'écriture = SEUL cas 502 (rien n'est sauvé, le
//      retry est sûr grâce à la clé). Échec de l'email admin APRÈS écriture →
//      200 candidat + alerte n8n immédiate (env `N8N_ALERT_WEBHOOK_URL`, payload
//      sans PII) — une candidature n'est plus jamais perdue pour un email.
//   2. IDEMPOTENCE : payload optionnel `submission_key` (uuid v4 posé par le front
//      en sessionStorage, livré avec le lot 1b) → colonne UNIQUE (migration
//      20260829120000_submission_key). Re-POST même clé = 409/23505 → no-op :
//      200 `duplicate: true`, AUCUN email renvoyé, aucun prospect recréé.
//      Côté `prospects` : garde applicative « même email < 10 min » → skip insert.
//   3. i18n : langue résolue AVANT la validation ; erreurs 400/502 localisées FR/EN
//      avec libellés humains (« prénom », pas `firstName`) ; le 502 n'expose plus
//      la réponse brute de Resend.
//   4. Auto-réponse FR au TUTOIEMENT (sujet compris) — décision Jérôme 28/08,
//      alignée sur le registre du site. EN et HTML inchangés.
//   Rétrocompatible front v14 (sans clé → comportement v14 côté idempotence).
//   Ordre de déploiement : migration → merge sur main → déploiement v15 DEPUIS main
//   (jamais depuis la branche) → front (lot 1b, qui envoie la clé).
// v14 — 24/08/2026 — Intérêt maison/chambre (LP /chambres-septembre) — brief LOT 2
//   CHANGEMENTS vs v13 :
//   1. Payload optionnel `property_interest` / `room_interest` (posés par les CTA des
//      cartes chambre de la LP, via query params sur /candidature) → colonnes dédiées
//      sur form_submissions ET prospects (migration `property_interest_2026_08_24`).
//      ⚠️ `prospects.property_interest` PRÉEXISTAIT en base : c'est un **uuid** avec
//      une clé étrangère vers properties(id), pas du texte (introspection prod du
//      24/08 : 6 lignes déjà renseignées). Le front envoie un SLUG lisible
//      (`lavilla`…) et c'est CETTE fonction qui le traduit en uuid. Écrire le slug
//      tel quel serait rejeté par le type, et le filet ci-dessous jetterait le champ
//      en silence — le pré-remplissage échouerait sans aucune alerte.
//   2. `source` (canal DÉCLARÉ par le candidat) reste intact : l'intérêt déclaré au clic
//      vit dans ses propres colonnes, exactement comme l'attribution Ads de la v13.
//   3. Filet en CASCADE ordonnée par valeur : si l'insert est refusé, on retire d'abord
//      les champs d'intérêt (les plus récents), et seulement ensuite l'attribution Ads
//      (donnée établie depuis le 22/08) — une candidature n'est jamais perdue, et un
//      champ neuf ne fait jamais tomber une mesure qui marche.
//      Ordre de déploiement recommandé : migration → v14 → front.
//
// v13 — 22/08/2026 — Attribution Ads (UTM + gclid) — brief UTM/GCLID, prérequis Ads 25/08
//   CHANGEMENTS vs v12 :
//   1. Payload optionnel `utm_source` / `utm_medium` / `utm_campaign` / `utm_content` /
//      `utm_term` / `gclid` (capturés à l'atterrissage par le front — first-touch de
//      session, sessionStorage, cf. src/lib/attribution.ts) → écrits TELS QUELS (trim,
//      256 caractères max, aucune autre normalisation) dans les colonnes homonymes de
//      form_submissions ET prospects (migration `utm_attribution_2026_08_22`, text NULL).
//   2. `prospects.source` n'est PAS touché : le déclaratif du candidat prime, l'attribution
//      technique vit dans ses colonnes dédiées (`is_paid` = gclid présent OU utm_medium=cpc,
//      calculé dans v_form_submissions_clean et bulletin_seo_metrics).
//   3. Rétrocompatible dans les deux sens : sans ces champs dans le payload, les corps
//      envoyés à PostgREST sont identiques à la v12 ; si les colonnes sont refusées
//      (migration absente), filet : l'insert est rejoué SANS les champs d'attribution —
//      une candidature n'est jamais perdue pour un champ de mesure.
//      Ordre de déploiement recommandé : migration → v13 → front.
//   ⚠️ Déployer au Dashboard Supabase (collage manuel) ou via MCP deploy_edge_function
//      (verify_jwt = true, inchangé).
// v12 — 21/08/2026 — Marqueur de test (checkpoint R1)
//   CHANGEMENTS vs v11 :
//   1. Payload optionnel `isTest` ("1"/"true", posé par /candidature?test=1) →
//      `is_test = true` sur form_submissions ET prospects (colonnes ajoutées le
//      21/08/2026, défaut false). Le bulletin et la vue v_form_submissions_clean
//      excluent ces lignes. Sans le champ : comportement v11 strictement identique.
//   2. Email admin préfixé « [TEST] » dans ce cas (les emails partent toujours,
//      pour vérifier la chaîne de bout en bout).
//   ⚠️ Déployer au Dashboard Supabase (collage manuel) — rétrocompatible, aucun
//      ordre imposé vis-à-vis du front.
// v11 — 10/08/2026 — Formulaire 1 étape (sprint conversion S33)
//   CHANGEMENTS vs v10 :
//   1. `arrival` et `duration` ne sont PLUS requis (retirés du formulaire ;
//      questions posées par Fanny à l'appel de qualification). La fonction reste
//      RÉTROCOMPATIBLE : si l'ancien front les envoie, ils sont traités comme avant.
//   2. Email admin : affiche « — » quand arrival/duration sont absents.
//   ⚠️ Déployer cette v11 dans le dashboard Supabase AVANT de merger le front
//      1 étape (la v10 renvoie 400 si arrival/duration manquent).
//
// Reçoit une soumission du formulaire de candidature et envoie :
//   1. Une notification admin à jerome@lavillacoliving.com
//   2. Un email d'auto-réponse personnalisé au candidat

const RESEND_API_URL = "https://api.resend.com/emails";

const ADMIN_EMAIL = "jerome@lavillacoliving.com";
const FROM_AUTORESPONSE = "La Villa Coliving <hello@lavillacoliving.com>";
const FROM_ADMIN_NOTIF = "Site La Villa <notifications@lavillacoliving.com>";

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
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function escapeHtml(input: unknown): string {
  if (input === null || input === undefined) return "";
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// (v15) Libellés humains des champs pour les messages d'erreur — le front
// affiche `data.error` tel quel (JoinPageV4) : jamais de clé technique.
const FIELD_LABELS: Record<string, { fr: string; en: string }> = {
  firstName: { fr: "prénom", en: "first name" },
  lastName: { fr: "nom de famille", en: "last name" },
  email: { fr: "email", en: "email" },
  phone: { fr: "téléphone", en: "phone number" },
};

// (v19) Tables de libellés au niveau module : le chemin normal (notes, emails) et le mode
// « compléments » s'en servent tous les deux. Clés = valeurs des listes du front (JoinPageV4,
// CandidatureDetails) : ne jamais les renommer d'un seul côté.
const ARRIVAL_LABELS: Record<string, string> = {
  "asap": "Le plus tôt possible (sous 1 mois)",
  "1-3-months": "Dans 1 à 3 mois",
  "3-6-months": "Dans 3 à 6 mois",
  "later": "Plus tard / pas encore décidé",
};
// lease_duration est contraint (prospects_lease_duration_check) : seules 3_mois / 6_mois /
// 12_mois / flexible passent.
const LEASE_DURATION_MAP: Record<string, string> = {
  "2-3": "3_mois",
  "3-6": "6_mois",
  "6-12": "12_mois",
  "12+": "12_mois",
};
// (v19) « Jusqu'à 3 mois » : libellé du formulaire depuis le 29/09/2026 (plus de durée minimale ;
// la clé « 2-3 » reste celle de LEASE_DURATION_MAP).
const DURATION_LABELS: Record<string, string> = {
  "2-3": "Jusqu'à 3 mois",
  "3-6": "3-6 mois",
  "6-12": "6-12 mois",
  "12+": "12+ mois",
};
// (v19) Canal préféré — pastilles facultatives sous le téléphone.
const CONTACT_PREFERENCE_LABELS: Record<string, string> = {
  "whatsapp": "WhatsApp",
  "call": "Appel",
  "email": "Email",
};
const CONTACT_PREFERENCE_PHRASES: Record<"fr" | "en", Record<string, string>> = {
  fr: { whatsapp: "par WhatsApp", call: "par téléphone", email: "par email" },
  en: { whatsapp: "on WhatsApp", call: "by phone", email: "by email" },
};

/** Lecture d'une table de libellés sans jamais remonter au prototype (« constructor »…). */
function own(map: Record<string, string>, key: string): string | null {
  return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : null;
}

/**
 * (v19) Destinataires supplémentaires des emails admin (Fanny, si Jérôme le décide) : secrets
 * d'environnement, jamais en dur ; adresses invalides ignorées ; AUCUN pour une soumission de
 * test — les emails [TEST] ne partent qu'à ADMIN_EMAIL.
 */
function extraAdminRecipients(isTest: boolean): { to: string[]; cc: string[] } {
  if (isTest) return { to: [], cc: [] };
  const list = (name: string): string[] =>
    (Deno.env.get(name) ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && isValidEmail(s) && s.toLowerCase() !== ADMIN_EMAIL);
  return { to: list("CANDIDATURE_NOTIFY_TO"), cc: list("CANDIDATURE_NOTIFY_CC") };
}

// (v19) Jeton du mode « compléments » : base64url(JSON) + "." + base64url(HMAC-SHA256).
// Clé = SUPABASE_SERVICE_ROLE_KEY (déjà présente dans l'environnement de la fonction), message
// préfixé d'un libellé de domaine : aucun secret à créer ni à faire transiter. Contenu : id du
// prospect (pid), clé de soumission (sk), id Resend de la notification admin (nid — pour le fil
// d'emails), expiration (exp, en ms) à 1 h.
const DETAILS_TOKEN_LABEL = "candidature-details-v1";
const DETAILS_TOKEN_TTL_MS = 60 * 60 * 1000;

interface DetailsTokenPayload {
  v: 1;
  pid: string;
  sk: string;
  nid: string | null;
  exp: number;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(text: string): Uint8Array {
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4);
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

async function detailsHmac(secret: string, body: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(`${DETAILS_TOKEN_LABEL}.${body}`)));
}

async function signDetailsToken(payload: DetailsTokenPayload, secret: string): Promise<string> {
  const body = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  return `${body}.${base64UrlEncode(await detailsHmac(secret, body))}`;
}

/** Jeton valide et non expiré → son contenu ; sinon null (comparaison à temps constant). */
async function verifyDetailsToken(token: string, secret: string, now: number): Promise<DetailsTokenPayload | null> {
  try {
    const parts = String(token ?? "").split(".");
    if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
    const expected = await detailsHmac(secret, parts[0]);
    const given = base64UrlDecode(parts[1]);
    if (given.length !== expected.length) return null;
    let diff = 0;
    for (let i = 0; i < expected.length; i++) diff |= expected[i] ^ given[i];
    if (diff !== 0) return null;
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[0]))) as DetailsTokenPayload;
    if (!payload || payload.v !== 1 || typeof payload.exp !== "number") return null;
    if (typeof payload.pid !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.pid)) return null;
    if (now > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// (v19) Lignes « séjour » de la notification : jamais de « — » pour l'arrivée et la durée (Fanny
// lit les candidatures dans ses emails). Inconnues → une phrase annonce l'email « Compléments » ;
// connues (?arrival= des pages maisons, ancien front) → leur libellé.
const STAY_NOT_YET_BOTH = "Pas encore renseignées. Le candidat peut les ajouter juste après l'envoi ; si c'est le cas, un email « Compléments » suivra dans ce fil.";
const STAY_NOT_YET_ONE = "Pas encore renseignée. Le candidat peut l'ajouter juste après l'envoi ; si c'est le cas, un email « Compléments » suivra dans ce fil.";

function arrivalLabel(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return own(ARRIVAL_LABELS, v) ?? v;
}

function durationLabel(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  return own(DURATION_LABELS, v) ?? v;
}

function buildAdminEmail(data: Record<string, string>, contactPref: string | null = null): string {
  const arrival = arrivalLabel(data.arrival ?? "");
  const duration = durationLabel(data.duration ?? "");
  const stayRows: Array<[string, string]> = arrival || duration
    ? [
      ["Date d'arrivée souhaitée", arrival ?? STAY_NOT_YET_ONE],
      ["Durée du séjour", duration ?? STAY_NOT_YET_ONE],
    ]
    : [["Arrivée et durée", STAY_NOT_YET_BOTH]];
  const prefLabel = contactPref ? own(CONTACT_PREFERENCE_LABELS, contactPref) : null;
  // Valeurs déjà échappées : le canal préféré est mis en gras, accolé au téléphone (v19).
  const rows: Array<[string, string]> = [
    ["Prénom", escapeHtml(data.firstName)],
    ["Nom", escapeHtml(data.lastName)],
    ["Email", escapeHtml(data.email)],
    ["Téléphone", escapeHtml(data.phone) + (prefLabel ? ` — <strong>préfère ${escapeHtml(prefLabel)}</strong>` : "")],
    ["Date de naissance", escapeHtml(data.birthDate || "—")],
    ["Poste", escapeHtml(data.job || "—")],
    ...stayRows.map(([label, value]): [string, string] => [label, escapeHtml(value)]),
    ["Comment a entendu parler", escapeHtml(data.source || "—")],
    // Programme parrainage : le nom du parrain déclaré doit être visible dès la
    // notification, pour le rattachement par Fanny à la qualification.
    ["Parrainé par", escapeHtml((data.referrerName ?? "").trim().slice(0, 80) || "—")],
  ];

  const tableRows = rows.map(([label, valueHtml]) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #E7E5E4;font-size:13px;color:#78716C;width:200px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #E7E5E4;font-size:14px;color:#1C1917;">${valueHtml}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html><body style="margin:0;padding:30px;background:#FAF9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #E7E5E4;">
    <tr>
      <td style="padding:24px 30px;background:#1C1917;color:#FFFFFF;">
        <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#D4A574;">Nouvelle candidature</p>
        <h1 style="margin:4px 0 0 0;font-size:20px;font-weight:500;">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 30px;">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">${tableRows}</table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 30px;background:#FAF9F6;border-top:1px solid #E7E5E4;text-align:center;">
        <p style="margin:0;font-size:12px;color:#78716C;">Réponse rapide : il suffit de cliquer sur "Répondre" — ta réponse partira directement à ${escapeHtml(data.email)}.</p>
      </td>
    </tr>
  </table>
</body></html>`;
}

// Textes de l'auto-réponse candidat, FR (tutoiement — aligné sur le site,
// décision Jérôme 28/08/2026) + EN. Le HTML est unique : seule la langue des chaînes change.
const AUTORESPONSE_TEXTS = {
  fr: {
    htmlLang: "fr",
    title: "Ta candidature à La Villa",
    heading: (name: string) => `${name}, ravis d'avoir reçu ta candidature.`,
    intro: "Tu viens peut-être de faire le premier pas vers un autre quotidien — et chez nous, on prend le temps de bien faire les choses. Toute l'équipe a hâte de découvrir ton profil.",
    nextLabel: "Et maintenant ?",
    step1Title: "Candidature bien reçue !",
    step1Body: "On regarde qui tu es, ce que tu cherches, et si La Villa correspond à ce dont tu as besoin.",
    step2Title: "On te recontacte sous 48h.",
    step2Body: "Par email ou téléphone, pour faire connaissance autour d'un échange — sans pression, sans engagement.",
    step3Title: "Si tout est aligné, on te fait visiter.",
    step3Body: "Et tu rencontreras peut-être déjà certains de tes futurs colocataires.",
    meanwhileLabel: "En attendant",
    meanwhileBody: "La Villa, ce n'est pas une colocation comme les autres. C'est une maison, une vraie, avec ses pièces de vie, ses moments partagés, et des gens qui ont choisi de ne pas vivre seuls.",
    ctaDiscover: "Découvrir La Villa",
    questionBlock: "Une question avant qu'on se parle ?<br>Réponds simplement à cet email, on est là.",
    signoff: "À très vite,",
    team: "Jérôme &amp; l'équipe de La Villa",
    footerNote: "Cet email t'a été envoyé suite à ta candidature.<br>Tes données restent strictement confidentielles.",
  },
  en: {
    htmlLang: "en",
    title: "Your application to La Villa",
    heading: (name: string) => `${name}, we're delighted to have received your application.`,
    intro: "You may have just taken the first step towards a different everyday life — and here, we take the time to do things right. The whole team is looking forward to discovering your profile.",
    nextLabel: "What happens next?",
    step1Title: "Application received!",
    step1Body: "We look at who you are, what you're looking for, and whether La Villa matches what you need.",
    step2Title: "We'll get back to you within 48h.",
    step2Body: "By email or phone, to get to know each other — no pressure, no commitment.",
    step3Title: "If everything lines up, we'll show you around.",
    step3Body: "And you might already meet some of your future housemates.",
    meanwhileLabel: "In the meantime",
    meanwhileBody: "La Villa isn't your average flatshare. It's a house — a real one — with shared living spaces, shared moments, and people who chose not to live alone.",
    ctaDiscover: "Discover La Villa",
    questionBlock: "A question before we talk?<br>Just reply to this email, we're here.",
    signoff: "See you very soon,",
    team: "Jérôme &amp; the La Villa team",
    footerNote: "This email was sent to you following your application.<br>Your data remains strictly confidential.",
  },
} as const;

function buildAutoresponseEmail(firstName: string, language: "fr" | "en", contactPref: string | null = null): string {
  const safeFirstName = escapeHtml(firstName);
  const T = AUTORESPONSE_TEXTS[language];
  // (v19) Canal choisi par le candidat → l'étape 2 dit comment Fanny le contacte (sous le titre
  // « On te recontacte sous 48h. », inchangé). Sans canal : texte historique.
  const phrase = contactPref ? own(CONTACT_PREFERENCE_PHRASES[language], contactPref) : null;
  const step2Body = phrase
    ? (language === "en"
      ? `Fanny will reach out ${phrase} to get to know you — no pressure, no commitment.`
      : `Fanny te contacte ${phrase} pour faire connaissance — sans pression, sans engagement.`)
    : T.step2Body;
  return `<!DOCTYPE html>
<html lang="${T.htmlLang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${T.title}</title>
</head>
<body style="margin:0;padding:0;background-color:#FAF9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1C1917;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width:600px;margin:0 auto;background-color:#FAF9F6;">
  <tr>
    <td style="padding:48px 30px;text-align:center;background-color:#1C1917;">
      <h1 style="margin:0;font-family:'Georgia','Times New Roman',serif;font-weight:300;font-size:34px;color:#FFFFFF;letter-spacing:1px;">La Villa</h1>
    </td>
  </tr>
  <tr>
    <td style="padding:56px 40px 24px 40px;background-color:#FFFFFF;text-align:center;">
      <h2 style="margin:0 0 24px 0;font-family:'Georgia','Times New Roman',serif;font-weight:300;font-size:30px;color:#1C1917;line-height:1.3;">${T.heading(safeFirstName)}</h2>
      <p style="margin:0;font-size:16px;line-height:1.75;color:#57534E;">${T.intro}</p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 40px;background-color:#FFFFFF;">
      <div style="height:1px;background-color:#E7E5E4;margin:36px 0;"></div>
    </td>
  </tr>
  <tr>
    <td style="padding:0 40px 40px 40px;background-color:#FFFFFF;">
      <p style="margin:0 0 28px 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#D4A574;text-align:center;">${T.nextLabel}</p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr><td style="padding:0 0 26px 0;">
          <p style="margin:0 0 6px 0;font-size:16px;font-weight:600;color:#1C1917;">${T.step1Title}</p>
          <p style="margin:0;font-size:14px;line-height:1.65;color:#57534E;">${T.step1Body}</p>
        </td></tr>
        <tr><td style="padding:0 0 26px 0;">
          <p style="margin:0 0 6px 0;font-size:16px;font-weight:600;color:#1C1917;">${T.step2Title}</p>
          <p style="margin:0;font-size:14px;line-height:1.65;color:#57534E;">${step2Body}</p>
        </td></tr>
        <tr><td style="padding:0;">
          <p style="margin:0 0 6px 0;font-size:16px;font-weight:600;color:#1C1917;">${T.step3Title}</p>
          <p style="margin:0;font-size:14px;line-height:1.65;color:#57534E;">${T.step3Body}</p>
        </td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:40px;background-color:#FAF9F6;border-top:1px solid #E7E5E4;border-bottom:1px solid #E7E5E4;text-align:center;">
      <p style="margin:0 0 16px 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#78716C;">${T.meanwhileLabel}</p>
      <p style="margin:0 0 28px 0;font-size:15px;line-height:1.75;color:#57534E;">${T.meanwhileBody}</p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center"><tr>
        <td style="padding:0 8px;">
          <a href="https://lavillacoliving.com" style="display:inline-block;padding:14px 28px;background-color:#1C1917;color:#FFFFFF;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">${T.ctaDiscover}</a>
        </td>
        <td style="padding:0 8px;">
          <a href="https://www.instagram.com/la_villa_coliving_geneva" style="display:inline-block;padding:14px 28px;background-color:#FFFFFF;color:#1C1917;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;border:1px solid #1C1917;">Instagram</a>
        </td>
      </tr></table>
    </td>
  </tr>
  <tr>
    <td style="padding:48px 40px;background-color:#FFFFFF;text-align:center;">
      <p style="margin:0 0 12px 0;font-size:15px;line-height:1.7;color:#57534E;">${T.questionBlock}</p>
      <p style="margin:32px 0 0 0;font-size:15px;line-height:1.6;color:#1C1917;">${T.signoff}<br><strong style="font-weight:600;">${T.team}</strong></p>
    </td>
  </tr>
  <tr>
    <td style="padding:28px 40px;background-color:#1C1917;text-align:center;">
      <p style="margin:0 0 8px 0;font-size:12px;color:#D4A574;letter-spacing:2px;text-transform:uppercase;font-weight:600;">La Villa Coliving</p>
      <p style="margin:0 0 14px 0;font-size:12px;color:#A8A29E;line-height:1.6;"><a href="https://lavillacoliving.com" style="color:#D4A574;text-decoration:none;">lavillacoliving.com</a></p>
      <p style="margin:0;font-size:11px;color:#78716C;line-height:1.5;">${T.footerNote}</p>
    </td>
  </tr>
</table>
</body>
</html>`;
}

async function sendEmail(payload: Record<string, unknown>, apiKey: string): Promise<{ ok: boolean; status: number; body: unknown }> {
  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

// (v15) Alerte opérationnelle vers n8n — webhook dédié en secret d'env, jamais en
// dur. Fire-and-forget : ne bloque ni ne fait échouer la réponse candidat. Payload
// minimal SANS PII. Le Health Check hebdo n8n reste le filet de fond.
async function alertN8n(payload: Record<string, unknown>): Promise<void> {
  const url = Deno.env.get("N8N_ALERT_WEBHOOK_URL");
  if (!url) {
    console.error("N8N_ALERT_WEBHOOK_URL manquante — alerte non envoyée:", JSON.stringify(payload));
    return;
  }
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("n8n alert failed (non bloquant)", e);
  }
}

// (v19) Email « Compléments » — admin seulement, dans le fil de la notification.
function buildDetailsEmail(
  p: { first_name: string; last_name: string | null; email: string | null },
  arrival: string | null,
  duration: string | null,
): string {
  const rows: Array<[string, string]> = [];
  if (arrival) rows.push(["Arrivée souhaitée", arrival]);
  if (duration) rows.push(["Durée souhaitée", duration]);
  const tableRows = rows.map(([label, value]) => `
    <tr>
      <td style="padding:10px 14px;border-bottom:1px solid #E7E5E4;font-size:13px;color:#78716C;width:200px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #E7E5E4;font-size:14px;color:#1C1917;">${escapeHtml(value)}</td>
    </tr>
  `).join("");
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:30px;background:#FAF9F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width:640px;margin:0 auto;background:#FFFFFF;border:1px solid #E7E5E4;">
    <tr>
      <td style="padding:24px 30px;background:#1C1917;color:#FFFFFF;">
        <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#D4A574;">Compléments de candidature</p>
        <h1 style="margin:4px 0 0 0;font-size:20px;font-weight:500;">${escapeHtml(p.first_name)} ${escapeHtml(p.last_name ?? "")}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 30px;">
        <table cellspacing="0" cellpadding="0" border="0" width="100%">${tableRows}</table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 30px;background:#FAF9F6;border-top:1px solid #E7E5E4;text-align:center;">
        <p style="margin:0;font-size:12px;color:#78716C;">Réponses données juste après l'envoi de la candidature.${p.email ? ` Réponse rapide : il suffit de cliquer sur "Répondre" — ta réponse partira directement à ${escapeHtml(p.email)}.` : ""}</p>
      </td>
    </tr>
  </table>
</body></html>`;
}

/** (v19) message_id de la notification (GET /emails/:id, API Resend) → en-têtes du fil. */
async function resendMessageId(nid: string | null, apiKey: string): Promise<string | null> {
  if (!nid || !/^[0-9A-Za-z-]{8,64}$/.test(nid)) return null;
  try {
    const res = await fetch(`${RESEND_API_URL}/${encodeURIComponent(nid)}`, {
      headers: { "Authorization": `Bearer ${apiKey}` },
    });
    if (!res.ok) return null;
    const body = await res.json().catch(() => ({})) as { message_id?: unknown };
    const mid = typeof body.message_id === "string" ? body.message_id.trim() : "";
    if (!mid) return null;
    return mid.startsWith("<") ? mid : `<${mid}>`;
  } catch {
    return null;
  }
}

/**
 * (v19) Mode « compléments » : les 2 questions facultatives (arrivée, durée) posées sur l'écran de
 * succès écrivent sur LA MÊME ligne `prospects`, seulement là où rien n'est encore renseigné.
 * Ni `form_submissions` ni email candidat ; email « Compléments » admin seulement si écrit.
 */
async function handleDetails(
  data: Record<string, string>,
  language: "fr" | "en",
  cors: Record<string, string>,
  apiKey: string,
): Promise<Response> {
  const json = (status: number, body: Record<string, unknown>) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
  const expired = () => json(401, {
    error: language === "en"
      ? "This link has expired: your answers weren't saved — we'll cover them on our call."
      : "Ce lien a expiré : tes réponses n'ont pas été enregistrées, on en parlera à l'échange.",
  });

  const sbUrl = Deno.env.get("SUPABASE_URL");
  const sbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!sbUrl || !sbKey) {
    console.error("details mode: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing");
    return json(500, { error: "Server configuration error" });
  }

  const now = Date.now();
  const token = await verifyDetailsToken(String(data.details_token ?? ""), sbKey, now);
  if (!token) return expired();

  const arrivalKey = String(data.arrival ?? "").trim();
  const durationKey = String(data.duration ?? "").trim();
  const arrivalOk = !arrivalKey || own(ARRIVAL_LABELS, arrivalKey) !== null;
  const durationOk = !durationKey || own(DURATION_LABELS, durationKey) !== null;
  if (!arrivalOk || !durationOk || (!arrivalKey && !durationKey)) {
    return json(400, { error: language === "en" ? "Invalid answer." : "Réponse invalide." });
  }

  type ProspectRow = {
    id: string;
    first_name: string;
    last_name: string | null;
    email: string | null;
    lease_duration: string | null;
    move_in_date: string | null;
    notes: string | null;
    created_at: string;
    is_test: boolean | null;
  };
  const headers = { "apikey": sbKey, "Authorization": `Bearer ${sbKey}` };
  const readRow = async (): Promise<ProspectRow | null> => {
    const res = await fetch(
      `${sbUrl}/rest/v1/prospects?id=eq.${encodeURIComponent(token.pid)}&select=id,first_name,last_name,email,lease_duration,move_in_date,notes,created_at,is_test`,
      { headers },
    );
    if (!res.ok) throw new Error(`prospects read ${res.status}`);
    const rows = await res.json();
    return Array.isArray(rows) && rows[0] ? rows[0] as ProspectRow : null;
  };

  try {
    // Deux passes au plus : si la ligne a changé entre la lecture et l'écriture (saisie
    // simultanée au dashboard), on relit et on recalcule une seule fois.
    for (let attempt = 0; attempt < 2; attempt++) {
      const row = await readRow();
      if (!row) return expired();
      const createdAt = Date.parse(row.created_at);
      if (!Number.isFinite(createdAt) || now - createdAt > DETAILS_TOKEN_TTL_MS + 5 * 60 * 1000) return expired();

      // « Seulement si encore vide » : une valeur déjà connue (formulaire, ?arrival=, saisie de
      // l'équipe) n'est jamais remplacée — ni par un rejeu, ni par une autre réponse.
      const lines = (row.notes ?? "").split("\n");
      const hasArrival = row.move_in_date !== null || lines.some((l) => l.startsWith("Souhait d'arrivée :"));
      const hasDuration = row.lease_duration !== null || lines.some((l) => l.startsWith("Durée souhaitée :"));
      const writeArrival = arrivalKey && !hasArrival ? own(ARRIVAL_LABELS, arrivalKey) : null;
      const writeDuration = durationKey && !hasDuration ? own(DURATION_LABELS, durationKey) : null;
      if (!writeArrival && !writeDuration) return json(200, { success: true, updated: false });

      const added = [
        ...(writeArrival ? [`Souhait d'arrivée : ${writeArrival}`] : []),
        ...(writeDuration ? [`Durée souhaitée : ${writeDuration}`] : []),
      ].join("\n");
      const filters = [
        `id=eq.${encodeURIComponent(row.id)}`,
        // PATCH conditionné à la valeur lue : jamais d'écrasement d'une saisie intercalée.
        // Pas de `or=(…)` : PostgREST y exige de citer , . : ( ), que les notes contiennent.
        row.notes === null ? "notes=is.null" : `notes=eq.${encodeURIComponent(row.notes)}`,
        ...(writeDuration ? ["lease_duration=is.null"] : []),
        "select=id",
      ].join("&");
      const patch = await fetch(`${sbUrl}/rest/v1/prospects?${filters}`, {
        method: "PATCH",
        headers: { ...headers, "Content-Type": "application/json", "Prefer": "return=representation" },
        body: JSON.stringify({
          notes: row.notes ? `${row.notes}\n${added}` : added,
          ...(writeDuration ? { lease_duration: own(LEASE_DURATION_MAP, durationKey) } : {}),
          updated_at: new Date().toISOString(),
        }),
      });
      if (!patch.ok) throw new Error(`prospects patch ${patch.status} ${await patch.text().catch(() => "")}`);
      const updated = await patch.json().catch(() => []);
      if (!Array.isArray(updated) || updated.length === 0) continue;

      // Email « Compléments » : best-effort, après l'écriture (la réponse reste updated:true).
      try {
        const isTest = row.is_test === true;
        const extra = extraAdminRecipients(isTest);
        const messageId = await resendMessageId(token.nid, apiKey);
        const res = await sendEmail({
          from: FROM_ADMIN_NOTIF,
          to: [ADMIN_EMAIL, ...extra.to],
          ...(extra.cc.length > 0 ? { cc: extra.cc } : {}),
          ...(row.email ? { reply_to: row.email } : {}),
          subject: `Re: ${isTest ? "[TEST] " : ""}[Candidature] ${row.first_name} ${row.last_name ?? ""}`.trimEnd(),
          ...(messageId ? { headers: { "In-Reply-To": messageId, "References": messageId } } : {}),
          html: buildDetailsEmail(row, writeArrival, writeDuration),
        }, apiKey);
        if (!res.ok) {
          console.error("Details email failed", res);
          await alertN8n({
            event: "candidature_details_email_failed",
            submission_key: token.sk,
            is_test: isTest,
            resend_status: res.status,
            at: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.error("details email threw (non bloquant)", e);
      }
      return json(200, { success: true, updated: true });
    }
    return json(409, { error: language === "en" ? "Please try again in a moment." : "Réessaie dans un instant." });
  } catch (e) {
    console.error("details mode failed", e);
    return json(502, {
      error: language === "en"
        ? "Your answers couldn't be saved — we'll cover them on our call."
        : "Tes réponses n'ont pas pu être enregistrées — on en parlera à l'échange.",
    });
  }
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("Origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: cors });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY env var is missing");
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Langue du candidat — résolue AVANT la validation (v15) pour localiser les
  // erreurs : champ explicite du payload (fiable depuis 08/2026), sinon
  // heuristique Referer historique — la Referrer-Policy par défaut ampute le
  // path en cross-origin, ce qui classait toutes les soumissions en « fr ».
  const referer = req.headers.get("Referer") ?? "";
  const refererLang: "fr" | "en" = /\/en(\/|$|\?)/.test(referer) ? "en" : "fr";

  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    // Corps illisible : pas de payload → seule l'heuristique Referer est disponible.
    return new Response(JSON.stringify({
      error: refererLang === "en"
        ? "Unreadable request. Please reload the page and try again."
        : "Requête illisible. Recharge la page et réessaie.",
    }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const language: "fr" | "en" =
    data.language === "en" || data.language === "fr"
      ? (data.language as "fr" | "en")
      : refererLang;

  // (v19) Mode « compléments » (2 questions facultatives après l'envoi) : branche isolée, qui
  // ne touche ni la validation, ni form_submissions, ni les emails du chemin normal.
  if (data.mode === "details") {
    return await handleDetails(data, language, cors, apiKey);
  }

  // Honeypot anti-spam : si rempli, on simule un succès (sans envoyer d'email)
  if (data.botcheck && data.botcheck.trim().length > 0) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Validation des champs obligatoires
  // v11 : `arrival` et `duration` retirés des requis (le front 1 étape les a
  // rétablis le 29/08, mais le serveur reste moins strict — rétrocompatible).
  // (v15) : messages localisés FR/EN, libellés humains via FIELD_LABELS.
  const required = ["firstName", "lastName", "email", "phone"];
  const missing = required.filter((k) => !data[k] || String(data[k]).trim().length === 0);
  if (missing.length > 0) {
    const labels = missing.map((k) => FIELD_LABELS[k]?.[language] ?? k).join(", ");
    return new Response(JSON.stringify({
      error: language === "en" ? `Missing fields: ${labels}` : `Champs manquants : ${labels}`,
    }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  if (!isValidEmail(data.email)) {
    return new Response(JSON.stringify({
      error: language === "en" ? "Invalid email address" : "Email invalide",
    }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Soumission de test (v12) : /candidature?test=1 → exclue des comptages.
  const isTest = ["1", "true"].includes(String(data.isTest ?? "").trim().toLowerCase());

  // (v19) Canal préféré (pastilles facultatives sous le téléphone) : une valeur hors liste est
  // ignorée SANS erreur — un champ facultatif ne bloque jamais une candidature.
  const contactPrefRaw = String(data.contact_preference ?? "").trim().toLowerCase();
  const contactPref = own(CONTACT_PREFERENCE_LABELS, contactPrefRaw) !== null ? contactPrefRaw : null;

  // Idempotence (v15) : uuid v4 posé par le front (sessionStorage, au premier clic
  // submit, réutilisé tant que le succès n'est pas reçu — livré avec le lot 1b).
  // Format validé ici ; absent ou invalide → null (ancien front) : pas
  // d'idempotence, comportement v14 inchangé.
  const submissionKeyRaw = String(data.submission_key ?? "").trim().toLowerCase();
  const submissionKey =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(submissionKeyRaw)
      ? submissionKeyRaw
      : null;

  // Attribution technique Ads (v13) : utm_* + gclid posés par le front (first-touch de
  // session). Trim + 256 caractères max, aucune autre normalisation ; vide → null.
  // Les clés ne sont jointes aux inserts QUE si au moins une valeur est présente :
  // sans attribution, les corps envoyés à PostgREST sont identiques à la v12.
  const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid"] as const;
  const attribution: Record<string, string | null> = {};
  for (const key of ATTRIBUTION_KEYS) {
    const value = String(data[key] ?? "").trim().slice(0, 256);
    attribution[key] = value || null;
  }
  const hasAttribution = Object.values(attribution).some((v) => v !== null);
  const attributionFields: Record<string, string | null> = hasAttribution ? attribution : {};
  const withoutAttribution = (body: Record<string, unknown>): Record<string, unknown> =>
    Object.fromEntries(Object.entries(body).filter(([k]) => !(ATTRIBUTION_KEYS as readonly string[]).includes(k)));

  // Intérêt maison/chambre (v14) : déclaré par le CTA de la carte chambre cliquée sur la
  // LP /chambres-septembre, transporté en query params jusqu'au formulaire. Même
  // traitement que l'attribution (trim, 256 car., vide → null) et même règle : les clés
  // ne sont jointes aux inserts QUE si au moins une valeur est présente, donc sans LP les
  // corps envoyés à PostgREST sont identiques à la v13.
  // properties.id — figés, relevés en production le 24/08/2026. Une table de
  // correspondance côté serveur garantit que la valeur écrite satisfait TOUJOURS la
  // clé étrangère : un slug inconnu donne null, jamais un uuid inventé.
  const PROPERTY_IDS: Record<string, string> = {
    lavilla: "d39d074a-ad6d-471c-b7c7-0e576521730e",
    leloft: "177ebcb2-6852-461c-8150-d416aa62ecf1",
    lelodge: "45175bde-8b94-446a-9dd4-e6dee4b5a509",
    montblanc: "57ecaa58-81e3-4c8c-8681-d5ac50b0d437",
  };
  const INTEREST_KEYS = ["property_interest", "room_interest"] as const;
  const propertySlug = String(data.property_interest ?? "").trim().toLowerCase();
  const interest: Record<string, string | null> = {
    property_interest: PROPERTY_IDS[propertySlug] ?? null,
    room_interest: String(data.room_interest ?? "").trim().slice(0, 256) || null,
  };
  const hasInterest = Object.values(interest).some((v) => v !== null);
  const interestFields: Record<string, string | null> = hasInterest ? interest : {};
  const withoutInterest = (body: Record<string, unknown>): Record<string, unknown> =>
    Object.fromEntries(Object.entries(body).filter(([k]) => !(INTEREST_KEYS as readonly string[]).includes(k)));

  // Page d'atterrissage (v17) : première page de la session, son referrer (origine + chemin,
  // déjà réduit par le front — on ne fait pas confiance, on re-nettoie) et la page de
  // soumission. Chemins/URL uniquement : caractères de contrôle retirés, 512 caractères
  // max, vide → null. Même règle que l'attribution : clés jointes à l'insert QUE si au
  // moins une valeur est présente — sans elles, corps identiques à la v16.
  const LANDING_KEYS = ["landing_page", "referrer", "entry_page"] as const;
  const cleanPath = (value: unknown): string | null => {
    // deno-lint-ignore no-control-regex
    const s = String(value ?? "").replace(/[\x00-\x1f\x7f]/g, "").trim().slice(0, 512);
    return s || null;
  };
  const landing: Record<string, string | null> = {};
  for (const key of LANDING_KEYS) landing[key] = cleanPath(data[key]);
  const hasLanding = Object.values(landing).some((v) => v !== null);
  const landingFields: Record<string, string | null> = hasLanding ? landing : {};
  const withoutLanding = (body: Record<string, unknown>): Record<string, unknown> =>
    Object.fromEntries(Object.entries(body).filter(([k]) => !(LANDING_KEYS as readonly string[]).includes(k)));

  // 1. Email de notification admin
  //    (v19) + destinataires supplémentaires facultatifs (secrets d'env, jamais en test).
  const extraRecipients = extraAdminRecipients(isTest);
  const adminEmail = {
    from: FROM_ADMIN_NOTIF,
    to: [ADMIN_EMAIL, ...extraRecipients.to],
    ...(extraRecipients.cc.length > 0 ? { cc: extraRecipients.cc } : {}),
    reply_to: data.email,
    subject: `${isTest ? "[TEST] " : ""}[Candidature] ${data.firstName} ${data.lastName}`,
    html: buildAdminEmail(data, contactPref),
  };

  // 2. Auto-réponse au candidat (dans sa langue)
  const autoresponseEmail = {
    from: FROM_AUTORESPONSE,
    to: [data.email],
    reply_to: ADMIN_EMAIL,
    subject: language === "en"
      ? "Your application to La Villa — received"
      // Tutoiement (v15) — aligné sur AUTORESPONSE_TEXTS.fr, décision Jérôme 28/08.
      : "Ta candidature à La Villa — bien reçue",
    html: buildAutoresponseEmail(data.firstName, language, contactPref),
  };

  // (v15) Les emails partent EN DERNIER, après les écritures — voir plus bas.

  // 3. Journalisation de la candidature (trace serveur, SANS donnée personnelle).
  //    Alimente le Health Check hebdo n8n ("Check Candidatures 7j") et garde une trace
  //    indépendante de GA4 (corrige la cause racine de la perte de suivi mai→juin 2026).
  //    (v15) ÉCRITURE D'ABORD : form_submissions est la source de vérité. Un échec
  //    TOTAL ici (cascade épuisée ou exception) est le SEUL cas 502 — rien n'est
  //    sauvé, le candidat doit réessayer, la clé d'idempotence rend le retry sûr.
  //    Une clé déjà en base (409/23505) = resoumission → no-op succès, sans
  //    ré-emails ni prospect. Env Supabase manquante = accident de config : on
  //    continue en mode dégradé v14 (emails seuls, erreur loggée) plutôt que de
  //    bloquer toutes les candidatures pour un secret absent.
  let submissionSaved = false;
  let submissionDuplicate = false;
  let loggingAvailable = false;
  try {
    const sbUrl = Deno.env.get("SUPABASE_URL");
    const sbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (sbUrl && sbKey) {
      loggingAvailable = true;
      // `language` : calculé plus haut (payload explicite > heuristique Referer).
      const logSubmission = (body: Record<string, unknown>) =>
        fetch(`${sbUrl}/rest/v1/form_submissions`, {
          method: "POST",
          headers: {
            "apikey": sbKey,
            "Authorization": `Bearer ${sbKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify(body),
        });
      const submissionRow: Record<string, unknown> = {
        form_type: "candidature",
        source: data.source || null,
        language,
        is_test: isTest,
        // v15 : clé d'idempotence — jointe seulement si le front l'a fournie.
        ...(submissionKey ? { submission_key: submissionKey } : {}),
        // v13 : attribution Ads — clés présentes uniquement si au moins une valeur.
        ...attributionFields,
        // v14 : intérêt maison/chambre — même règle.
        ...interestFields,
        // v17 : page d'atterrissage / referrer / page de soumission — même règle.
        ...landingFields,
      };
      // Cascade v13/v14/v17 conservée, exprimée en tentatives ordonnées « du plus
      // récent au plus établi » : complet → sans atterrissage → sans intérêt →
      // sans attribution. Un 409/23505 (submission_key) court-circuite : c'est un
      // doublon, pas un refus de schéma.
      const attempts: Array<Record<string, unknown>> = [submissionRow];
      if (hasLanding) attempts.push(withoutLanding(submissionRow));
      if (hasInterest) attempts.push(withoutInterest(withoutLanding(submissionRow)));
      if (hasAttribution) attempts.push(withoutAttribution(withoutInterest(withoutLanding(submissionRow))));
      if (submissionKey) {
        // Filet v15 : migration submission_key pas encore appliquée (colonne
        // inconnue) → dernier recours SANS la clé. La trace prime sur
        // l'idempotence — une candidature n'est jamais perdue pour un champ neuf.
        const { submission_key: _unused, ...withoutKey } =
          withoutAttribution(withoutInterest(withoutLanding(submissionRow))) as Record<string, unknown> & { submission_key?: string };
        attempts.push(withoutKey);
      }
      for (const body of attempts) {
        const res = await logSubmission(body);
        if (res.ok) {
          submissionSaved = true;
          break;
        }
        const text = await res.text().catch(() => "");
        if (res.status === 409 && (text.includes("23505") || text.includes("submission_key"))) {
          submissionDuplicate = true;
          break;
        }
        console.error("form_submissions insert rejected, cascade continue", res.status, text);
      }
      if (!submissionSaved && !submissionDuplicate) {
        console.error("form_submissions logging failed après cascade complète");
      }
    } else {
      console.error("form_submissions logging skipped: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing");
    }
  } catch (e) {
    console.error("form_submissions logging threw", e);
  }

  // Resoumission (même submission_key) : le premier POST a déjà écrit la ligne et
  // envoyé les emails — on re-renvoie simplement le succès.
  if (submissionDuplicate) {
    return new Response(JSON.stringify({ success: true, autoresponseSent: true, duplicate: true }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Échec total d'écriture alors que la base était joignable : rien n'est sauvé,
  // le candidat doit réessayer (retry sûr grâce à la clé). Message localisé,
  // sans détail technique.
  if (loggingAvailable && !submissionSaved) {
    return new Response(JSON.stringify({
      error: language === "en"
        ? "Your application couldn't be saved. Please try again in a moment, or contact us directly."
        : "Ta candidature n'a pas pu être enregistrée. Réessaie dans un instant, ou écris-nous directement.",
    }), {
      status: 502,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // 4. Enregistrement de la candidature dans la table `prospects` (CRM / dashboard / Google Sheet).
  //    Best-effort : on ne bloque JAMAIS la candidature si l'insert échoue — la trace
  //    `form_submissions` ci-dessus est la source de vérité (v15). Utilise la
  //    clé service_role (RLS : `prospects` est inaccessible en anon), déjà disponible dans
  //    l'environnement de la fonction (même clé que la journalisation ci-dessus). Aucune clé
  //    secrète n'est exposée côté client.
  //    (v19) L'id du prospect créé est relu (return=representation) pour le jeton du mode
  //    « compléments » ; il reste null sur le chemin « même email < 10 min » (pas de jeton).
  let prospectId: string | null = null;
  try {
    const sbUrl = Deno.env.get("SUPABASE_URL");
    const sbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (sbUrl && sbKey) {
      // v11 : le formulaire 1 étape n'envoie plus arrival/duration. Les blocs
      // ci-dessous restent pour la rétrocompatibilité (ancien front, tests) :
      // avec des valeurs absentes, moveInDate = null, leaseDuration = null et
      // aucune ligne correspondante dans `notes`.
      const arrivalRaw = (data.arrival ?? "").trim();
      const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(arrivalRaw);
      const moveInDate = isIsoDate ? arrivalRaw : null;

      // (v19) ARRIVAL_LABELS / LEASE_DURATION_MAP / DURATION_LABELS : tables au niveau module.
      const CHANNEL_LABELS: Record<string, string> = {
        "google": "Google",
        "ai-assistant": "Assistant IA", // v18 — canal déclaré « Assistant IA (ChatGPT, Perplexity, Gemini…) »
        "google-maps": "Google Maps",
        "instagram": "Instagram",
        "facebook": "Facebook",
        "whatsapp": "WhatsApp",
        "word-of-mouth": "Bouche à oreille",
        "article-blog": "Un article du blog",
        "leboncoin": "Leboncoin",
        "resident-referral": "Un résident m'a recommandé",
        "other": "Autre",
      };
      // Canal déclaré (select du formulaire) → valeur autorisée par prospects_source_check.
      const PROSPECT_SOURCE_MAP: Record<string, string> = {
        "google": "google",
        "ai-assistant": "assistant_ia", // v18 — valeur ajoutée à la contrainte par migration-prospects-source-assistant-ia.sql
        "google-maps": "google_maps", // v16 — valeur ajoutée à la contrainte le 02/09/2026
        "instagram": "instagram",
        "facebook": "facebook",
        "whatsapp": "whatsapp",
        "word-of-mouth": "bouche_a_oreille",
        "article-blog": "article_blog",
        "leboncoin": "leboncoin",
        "resident-referral": "parrainage",
        "other": "autre",
      };
      const durationRaw = (data.duration ?? "").trim();
      const leaseDuration = own(LEASE_DURATION_MAP, durationRaw);

      // notes : tout ce qui n'a pas de colonne dédiée dans `prospects`.
      const notesParts: string[] = [];
      const birthDate = (data.birthDate ?? "").trim();
      if (birthDate) notesParts.push(`Né(e) le ${birthDate}`);
      if (arrivalRaw && !moveInDate) {
        notesParts.push(`Souhait d'arrivée : ${own(ARRIVAL_LABELS, arrivalRaw) ?? arrivalRaw}`);
      }
      if (durationRaw) notesParts.push(`Durée souhaitée : ${own(DURATION_LABELS, durationRaw) ?? durationRaw}`);
      // (v19) Canal préféré, lisible par Fanny à côté des autres réponses.
      if (contactPref) notesParts.push(`Canal préféré : ${CONTACT_PREFERENCE_LABELS[contactPref]}`);
      // Attribution — deux couches (plan blog-conversion 07/07/2026) :
      // 1) DÉCLARÉE : « Comment as-tu entendu parler ? » (optionnel depuis v11) →
      //    prospects.source + libellé gardé en notes.
      // 2) OBSERVÉE : ?src=bloc_offre&article={slug} posé par les blocs offre du blog
      //    (transmis en ref_src/ref_article) → notes, et fallback pour source.
      //    Le déclaré PRIME.
      const channel = (data.source ?? "").trim();
      if (channel) notesParts.push(`Canal déclaré : ${CHANNEL_LABELS[channel] ?? channel}`);
      // Parrainage : nom du parrain tel que déclaré, en clair dans les notes.
      // La résolution vers un tenant_id est faite PAR FANNY au dashboard
      // (humain dans la boucle) — jamais automatiquement ici (homonymes, fautes).
      const referrerName = (data.referrerName ?? "").trim().slice(0, 80);
      if (referrerName) notesParts.push(`Parrain déclaré : ${referrerName}`);
      const refSrc = (data.ref_src ?? "").trim().slice(0, 50);
      const refArticle = (data.ref_article ?? "").trim().slice(0, 120);
      if (refSrc) {
        notesParts.push(`Origine observée : ${refSrc}${refArticle ? ` — article « ${refArticle} »` : ""}`);
      }
      // (v17) Page d'atterrissage de la session, lisible par Fanny (décision Q11b du
      // 03/09) — en notes, pas en colonne : `prospects` garde son schéma.
      if (landing.landing_page) {
        const via = landing.referrer ? ` — via ${landing.referrer.replace(/^https?:\/\//, "")}` : "";
        notesParts.push(`Atterrissage : ${landing.landing_page}${via}`);
      }
      const prospectSource: string =
        PROSPECT_SOURCE_MAP[channel] ??
        (refSrc === "bloc_offre" ? "article_blog" : "site_web");
      const extraMessage = (data.message ?? "").trim();
      if (extraMessage) notesParts.push(extraMessage);

      // property_interest (uuid) : renseigné depuis la v14 quand la candidature vient
      // d'une carte de la LP (slug traduit en uuid plus haut, cf. PROPERTY_IDS).
      // Reste null pour toute candidature arrivée par le formulaire nu — celui-ci n'a
      // toujours pas de sélection de maison, et on n'en invente pas une.
      const prospect: Record<string, unknown> = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        occupation: (data.job ?? "").trim() || null,
        move_in_date: moveInDate,
        lease_duration: leaseDuration,
        source: prospectSource,
        status: "new",
        notes: notesParts.length > 0 ? notesParts.join("\n") : null,
        is_test: isTest,
        // v13 : attribution Ads dans ses colonnes dédiées (`source` = déclaratif, intact).
        ...attributionFields,
        // v14 : intérêt maison/chambre déclaré au clic sur une carte de la LP.
        ...interestFields,
      };

      // Garde anti-doublon (v15) : un prospect au même email créé il y a moins de
      // 10 minutes = resoumission (4 clusters en 2 mois, doublons fusionnés à la
      // main par Fanny) → on n'insère pas ; la soumission reste tracée dans
      // form_submissions. Contrôle best-effort : s'il échoue, on insère normalement.
      let recentProspectExists = false;
      try {
        const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        const dupRes = await fetch(
          `${sbUrl}/rest/v1/prospects?select=id&email=eq.${encodeURIComponent(data.email)}&created_at=gte.${encodeURIComponent(since)}&limit=1`,
          { headers: { "apikey": sbKey, "Authorization": `Bearer ${sbKey}` } },
        );
        if (dupRes.ok) {
          const rows = await dupRes.json().catch(() => []);
          recentProspectExists = Array.isArray(rows) && rows.length > 0;
        }
      } catch { /* contrôle best-effort — jamais bloquant */ }

      if (recentProspectExists) {
        console.log("prospects insert skipped: même email < 10 min (resoumission)");
      } else {
        // (v19) return=representation + select=id : seul l'id revient, pour le jeton.
        const insertProspect = (body: Record<string, unknown>) =>
          fetch(`${sbUrl}/rest/v1/prospects?select=id`, {
            method: "POST",
            headers: {
              "apikey": sbKey,
              "Authorization": `Bearer ${sbKey}`,
              "Content-Type": "application/json",
              "Prefer": "return=representation",
            },
            body: JSON.stringify(body),
          });

        let prospectBody: Record<string, unknown> = prospect;
        let insertRes = await insertProspect(prospectBody);
        if (!insertRes.ok && prospectSource !== "site_web") {
          // Filet : si la contrainte prospects_source_check ne connaît pas la valeur,
          // on ne perd JAMAIS la candidature — on retombe sur site_web, détail en notes.
          console.error("prospects insert rejected for source=" + prospectSource + ", retrying with site_web", insertRes.status, await insertRes.text().catch(() => ""));
          prospectBody = { ...prospectBody, source: "site_web" };
          insertRes = await insertProspect(prospectBody);
        }
        if (!insertRes.ok && hasInterest) {
          // Filet v14 : on retire d'abord les champs d'intérêt (les plus récents) — jamais
          // l'attribution Ads en premier.
          console.error("prospects insert rejected with interest fields, retrying without", insertRes.status, await insertRes.text().catch(() => ""));
          prospectBody = withoutInterest(prospectBody);
          insertRes = await insertProspect(prospectBody);
        }
        if (!insertRes.ok && hasAttribution) {
          // Filet v13 : colonnes d'attribution refusées (migration absente…) → on rejoue
          // sans elles. Une candidature n'est JAMAIS perdue pour un champ de mesure.
          console.error("prospects insert rejected with attribution fields, retrying without", insertRes.status, await insertRes.text().catch(() => ""));
          prospectBody = withoutAttribution(withoutInterest(prospectBody));
          insertRes = await insertProspect(prospectBody);
        }
        if (!insertRes.ok) {
          console.error("prospects insert failed", insertRes.status, await insertRes.text().catch(() => ""));
        } else {
          // (v19) Corps illisible → pas de jeton ; la candidature, elle, est enregistrée.
          try {
            const rows = await insertRes.json();
            const id = Array.isArray(rows) ? rows[0]?.id : null;
            if (typeof id === "string") prospectId = id;
          } catch { /* pas de jeton, rien d'autre ne change */ }
        }
      }
    } else {
      console.error("prospects insert skipped: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing");
    }
  } catch (e) {
    console.error("prospects insert threw (non-blocking)", e);
  }

  // 5. (v15) Emails EN DERNIER : la candidature est déjà en base. Un échec d'email
  //    n'est plus un échec candidat — c'est un incident interne, alerté immédiatement
  //    (la promesse « réponse sous 48 h » ne survivrait pas à 6 jours de silence
  //    jusqu'au Health Check hebdo).
  const [adminRes, candidateRes] = await Promise.all([
    sendEmail(adminEmail, apiKey),
    sendEmail(autoresponseEmail, apiKey),
  ]);

  if (!adminRes.ok) {
    console.error("Admin email failed", adminRes);
    await alertN8n({
      event: "candidature_admin_email_failed",
      submission_key: submissionKey,
      language,
      is_test: isTest,
      resend_status: adminRes.status,
      autoresponse_sent: candidateRes.ok,
      submission_saved: submissionSaved,
      at: new Date().toISOString(),
    });
  }
  if (!candidateRes.ok) {
    console.error("Candidate autoresponse failed", candidateRes);
  }

  // 6. (v19) Jeton du mode « compléments » — construit APRÈS les emails, sous try/catch : il ne
  //    peut ni faire échouer la candidature ni empêcher ses emails (un 500 suivi d'un rejeu de la
  //    même clé tomberait sur le chemin doublon, qui ne renvoie aucun email). Exige la ligne
  //    form_submissions, la clé et l'id du prospect créé par CETTE soumission.
  let detailsToken: string | null = null;
  try {
    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (secret && submissionSaved && submissionKey && prospectId) {
      const nid = adminRes.ok ? (adminRes.body as { id?: unknown } | null)?.id : null;
      detailsToken = await signDetailsToken({
        v: 1,
        pid: prospectId,
        sk: submissionKey,
        nid: typeof nid === "string" ? nid : null,
        exp: Date.now() + DETAILS_TOKEN_TTL_MS,
      }, secret);
    }
  } catch (e) {
    console.error("details token failed (non bloquant)", e);
  }

  return new Response(JSON.stringify({
    success: true,
    autoresponseSent: candidateRes.ok,
    adminNotified: adminRes.ok,
    ...(detailsToken ? { details_token: detailsToken } : {}),
  }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
