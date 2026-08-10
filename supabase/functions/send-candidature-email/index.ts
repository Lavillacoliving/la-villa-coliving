// Supabase Edge Function — send-candidature-email
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

function buildAdminEmail(data: Record<string, string>): string {
  const rows: Array<[string, string]> = [
    ["Prénom", data.firstName],
    ["Nom", data.lastName],
    ["Email", data.email],
    ["Téléphone", data.phone],
    ["Date de naissance", data.birthDate || "—"],
    ["Poste", data.job || "—"],
    // v11 : arrival/duration retirés du formulaire 1 étape — affichés seulement
    // si un (ancien) front les envoie encore. Fanny qualifie ces points à l'appel.
    ["Date d'arrivée souhaitée", data.arrival || "—"],
    ["Durée du séjour", data.duration || "—"],
    ["Comment a entendu parler", data.source || "—"],
    // Programme parrainage : le nom du parrain déclaré doit être visible dès la
    // notification, pour le rattachement par Fanny à la qualification.
    ["Parrainé par", (data.referrerName ?? "").trim().slice(0, 80) || "—"],
  ];

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

// Textes de l'auto-réponse candidat, FR (registre vouvoyé historique) + EN.
// Le HTML est unique : seule la langue des chaînes change.
const AUTORESPONSE_TEXTS = {
  fr: {
    htmlLang: "fr",
    title: "Votre candidature à La Villa",
    heading: (name: string) => `${name}, ravis d'avoir reçu votre candidature.`,
    intro: "Vous venez peut-être de faire le premier pas vers un autre quotidien — et chez nous, on prend le temps de bien faire les choses. Toute l'équipe a hâte de découvrir votre profil.",
    nextLabel: "Et maintenant ?",
    step1Title: "Candidature bien reçue !",
    step1Body: "On regarde qui vous êtes, ce que vous cherchez, et si La Villa correspond à ce dont vous avez besoin.",
    step2Title: "On vous recontacte sous 48h.",
    step2Body: "Par email ou téléphone, pour faire connaissance autour d'un échange — sans pression, sans engagement.",
    step3Title: "Si tout est aligné, on vous fait visiter.",
    step3Body: "Et vous rencontrerez peut-être déjà certains de vos futurs colocataires.",
    meanwhileLabel: "En attendant",
    meanwhileBody: "La Villa, ce n'est pas une colocation comme les autres. C'est une maison, une vraie, avec ses pièces de vie, ses moments partagés, et des gens qui ont choisi de ne pas vivre seuls.",
    ctaDiscover: "Découvrir La Villa",
    questionBlock: "Une question avant qu'on se parle ?<br>Répondez simplement à cet email, on est là.",
    signoff: "À très vite,",
    team: "Jérôme &amp; l'équipe de La Villa",
    footerNote: "Cet email vous a été envoyé suite à votre candidature.<br>Vos données restent strictement confidentielles.",
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

function buildAutoresponseEmail(firstName: string, language: "fr" | "en"): string {
  const safeFirstName = escapeHtml(firstName);
  const T = AUTORESPONSE_TEXTS[language];
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
          <p style="margin:0;font-size:14px;line-height:1.65;color:#57534E;">${T.step2Body}</p>
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

  let data: Record<string, string>;
  try {
    data = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Honeypot anti-spam : si rempli, on simule un succès (sans envoyer d'email)
  if (data.botcheck && data.botcheck.trim().length > 0) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Validation des champs obligatoires
  // v11 : `arrival` et `duration` retirés des requis (formulaire 1 étape).
  // Ces infos sont qualifiées par Fanny à l'appel. Rétrocompatible : si un
  // ancien front les envoie, ils sont traités plus bas comme avant.
  const required = ["firstName", "lastName", "email", "phone"];
  const missing = required.filter((k) => !data[k] || String(data[k]).trim().length === 0);
  if (missing.length > 0) {
    return new Response(JSON.stringify({ error: `Champs manquants : ${missing.join(", ")}` }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  if (!isValidEmail(data.email)) {
    return new Response(JSON.stringify({ error: "Email invalide" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Langue du candidat : champ explicite du payload (fiable depuis 08/2026),
  // sinon heuristique Referer historique — la Referrer-Policy par défaut ampute
  // le path en cross-origin, ce qui classait toutes les soumissions en « fr ».
  const referer = req.headers.get("Referer") ?? "";
  const language: "fr" | "en" =
    data.language === "en" || data.language === "fr"
      ? (data.language as "fr" | "en")
      : /\/en(\/|$|\?)/.test(referer)
        ? "en"
        : "fr";

  // 1. Email de notification admin
  const adminEmail = {
    from: FROM_ADMIN_NOTIF,
    to: [ADMIN_EMAIL],
    reply_to: data.email,
    subject: `[Candidature] ${data.firstName} ${data.lastName}`,
    html: buildAdminEmail(data),
  };

  // 2. Auto-réponse au candidat (dans sa langue)
  const autoresponseEmail = {
    from: FROM_AUTORESPONSE,
    to: [data.email],
    reply_to: ADMIN_EMAIL,
    subject: language === "en"
      ? "Your application to La Villa — received"
      : "Votre candidature à La Villa — bien reçue",
    html: buildAutoresponseEmail(data.firstName, language),
  };

  // Envoi en parallèle
  const [adminRes, candidateRes] = await Promise.all([
    sendEmail(adminEmail, apiKey),
    sendEmail(autoresponseEmail, apiKey),
  ]);

  if (!adminRes.ok) {
    console.error("Admin email failed", adminRes);
  }
  if (!candidateRes.ok) {
    console.error("Candidate autoresponse failed", candidateRes);
  }

  // Si l'admin notification a échoué, on signale une erreur (priorité au business)
  if (!adminRes.ok) {
    return new Response(JSON.stringify({
      error: "L'envoi de la notification a échoué. Merci de réessayer ou de nous contacter directement.",
      details: adminRes.body,
    }), {
      status: 502,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // 3. Journalisation best-effort de la candidature (trace serveur, SANS donnée personnelle).
  //    Alimente le Health Check hebdo n8n ("Check Candidatures 7j") et garde une trace
  //    indépendante de GA4 (corrige la cause racine de la perte de suivi mai→juin 2026).
  //    On ne bloque JAMAIS la candidature si la journalisation échoue : l'email reste prioritaire.
  try {
    const sbUrl = Deno.env.get("SUPABASE_URL");
    const sbKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (sbUrl && sbKey) {
      // `language` : calculé plus haut (payload explicite > heuristique Referer).
      const logRes = await fetch(`${sbUrl}/rest/v1/form_submissions`, {
        method: "POST",
        headers: {
          "apikey": sbKey,
          "Authorization": `Bearer ${sbKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal",
        },
        body: JSON.stringify({
          form_type: "candidature",
          source: data.source || null,
          language,
        }),
      });
      if (!logRes.ok) {
        console.error("form_submissions logging failed", logRes.status, await logRes.text().catch(() => ""));
      }
    } else {
      console.error("form_submissions logging skipped: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing");
    }
  } catch (e) {
    console.error("form_submissions logging threw (non-blocking)", e);
  }

  // 4. Enregistrement de la candidature dans la table `prospects` (CRM / dashboard / Google Sheet).
  //    Best-effort : on ne bloque JAMAIS la candidature si l'insert échoue — l'email de
  //    notification reste la source de vérité prioritaire (voir le 502 plus haut). Utilise la
  //    clé service_role (RLS : `prospects` est inaccessible en anon), déjà disponible dans
  //    l'environnement de la fonction (même clé que la journalisation ci-dessus). Aucune clé
  //    secrète n'est exposée côté client.
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

      const ARRIVAL_LABELS: Record<string, string> = {
        "asap": "Le plus tôt possible (sous 1 mois)",
        "1-3-months": "Dans 1 à 3 mois",
        "3-6-months": "Dans 3 à 6 mois",
        "later": "Plus tard / pas encore décidé",
      };
      const CHANNEL_LABELS: Record<string, string> = {
        "google": "Google",
        "instagram": "Instagram",
        "word-of-mouth": "Bouche à oreille",
        "article-blog": "Un article du blog",
        "leboncoin": "Leboncoin",
        "resident-referral": "Un résident m'a recommandé",
        "other": "Autre",
      };
      // Canal déclaré (select du formulaire) → valeur autorisée par prospects_source_check.
      const PROSPECT_SOURCE_MAP: Record<string, string> = {
        "google": "google",
        "instagram": "instagram",
        "word-of-mouth": "bouche_a_oreille",
        "article-blog": "article_blog",
        "leboncoin": "leboncoin",
        "resident-referral": "parrainage",
        "other": "autre",
      };
      // lease_duration est contraint (prospects_lease_duration_check) : seules 3_mois / 6_mois /
      // 12_mois / flexible passent. Mapping conservé pour rétrocompatibilité (v11).
      const LEASE_DURATION_MAP: Record<string, string> = {
        "2-3": "3_mois",
        "3-6": "6_mois",
        "6-12": "12_mois",
        "12+": "12_mois",
      };
      const DURATION_LABELS: Record<string, string> = {
        "2-3": "2-3 mois",
        "3-6": "3-6 mois",
        "6-12": "6-12 mois",
        "12+": "12+ mois",
      };
      const durationRaw = (data.duration ?? "").trim();
      const leaseDuration = LEASE_DURATION_MAP[durationRaw] ?? null;

      // notes : tout ce qui n'a pas de colonne dédiée dans `prospects`.
      const notesParts: string[] = [];
      const birthDate = (data.birthDate ?? "").trim();
      if (birthDate) notesParts.push(`Né(e) le ${birthDate}`);
      if (arrivalRaw && !moveInDate) {
        notesParts.push(`Souhait d'arrivée : ${ARRIVAL_LABELS[arrivalRaw] ?? arrivalRaw}`);
      }
      if (durationRaw) notesParts.push(`Durée souhaitée : ${DURATION_LABELS[durationRaw] ?? durationRaw}`);
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
      const prospectSource: string =
        PROSPECT_SOURCE_MAP[channel] ??
        (refSrc === "bloc_offre" ? "article_blog" : "site_web");
      const extraMessage = (data.message ?? "").trim();
      if (extraMessage) notesParts.push(extraMessage);

      // property_interest (uuid) : NON renseigné — le formulaire de candidature n'a pas de
      // sélection de maison. Pour mémoire, si un champ "maison" est ajouté un jour :
      //   La Villa   → d39d074a-ad6d-471c-b7c7-0e576521730e
      //   Le Loft    → 177ebcb2-6852-461c-8150-d416aa62ecf1
      //   Le Lodge   → 45175bde-8b94-446a-9dd4-e6dee4b5a509
      //   Mont-Blanc → 57ecaa58-81e3-4c8c-8681-d5ac50b0d437
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
      };

      const insertProspect = (body: Record<string, unknown>) =>
        fetch(`${sbUrl}/rest/v1/prospects`, {
          method: "POST",
          headers: {
            "apikey": sbKey,
            "Authorization": `Bearer ${sbKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
          },
          body: JSON.stringify(body),
        });

      let insertRes = await insertProspect(prospect);
      if (!insertRes.ok && prospectSource !== "site_web") {
        // Filet : si la contrainte prospects_source_check ne connaît pas la valeur,
        // on ne perd JAMAIS la candidature — on retombe sur site_web, détail en notes.
        console.error("prospects insert rejected for source=" + prospectSource + ", retrying with site_web", insertRes.status, await insertRes.text().catch(() => ""));
        insertRes = await insertProspect({ ...prospect, source: "site_web" });
      }
      if (!insertRes.ok) {
        console.error("prospects insert failed", insertRes.status, await insertRes.text().catch(() => ""));
      }
    } else {
      console.error("prospects insert skipped: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing");
    }
  } catch (e) {
    console.error("prospects insert threw (non-blocking)", e);
  }

  return new Response(JSON.stringify({
    success: true,
    autoresponseSent: candidateRes.ok,
  }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
