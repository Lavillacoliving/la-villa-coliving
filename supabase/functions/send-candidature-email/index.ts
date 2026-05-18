// Supabase Edge Function — send-candidature-email
// Reçoit une soumission du formulaire de candidature et envoie :
//   1. Une notification admin à jerome@lavillacoliving.com
//   2. Un email d'auto-réponse personnalisé au candidat

const RESEND_API_URL = "https://api.resend.com/emails";

const ADMIN_EMAIL = "jerome@lavillacoliving.com";
const FROM_AUTORESPONSE = "La Villa Coliving <bonjour@lavillacoliving.com>";
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
    ["Date d'arrivée souhaitée", data.arrival],
    ["Durée du séjour", data.duration],
    ["Comment a entendu parler", data.source || "—"],
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

function buildAutoresponseEmail(firstName: string): string {
  const safeFirstName = escapeHtml(firstName);
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Votre candidature à La Villa</title>
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
      <h2 style="margin:0 0 24px 0;font-family:'Georgia','Times New Roman',serif;font-weight:300;font-size:30px;color:#1C1917;line-height:1.3;">${safeFirstName}, ravis d'avoir reçu votre candidature.</h2>
      <p style="margin:0;font-size:16px;line-height:1.75;color:#57534E;">Vous venez peut-être de faire le premier pas vers un autre quotidien — et chez nous, on prend le temps de bien faire les choses. Toute l'équipe a hâte de découvrir votre profil.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:0 40px;background-color:#FFFFFF;">
      <div style="height:1px;background-color:#E7E5E4;margin:36px 0;"></div>
    </td>
  </tr>
  <tr>
    <td style="padding:0 40px 40px 40px;background-color:#FFFFFF;">
      <p style="margin:0 0 28px 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#D4A574;text-align:center;">Et maintenant ?</p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr><td style="padding:0 0 26px 0;">
          <p style="margin:0 0 6px 0;font-size:16px;font-weight:600;color:#1C1917;">On lit votre candidature attentivement.</p>
          <p style="margin:0;font-size:14px;line-height:1.65;color:#57534E;">Pas un tri express. On regarde qui vous êtes, ce que vous cherchez, et si La Villa correspond vraiment à ce dont vous avez besoin.</p>
        </td></tr>
        <tr><td style="padding:0 0 26px 0;">
          <p style="margin:0 0 6px 0;font-size:16px;font-weight:600;color:#1C1917;">On vous recontacte sous 48h.</p>
          <p style="margin:0;font-size:14px;line-height:1.65;color:#57534E;">Par email ou téléphone, pour faire connaissance autour d'un échange — sans pression, sans engagement.</p>
        </td></tr>
        <tr><td style="padding:0;">
          <p style="margin:0 0 6px 0;font-size:16px;font-weight:600;color:#1C1917;">Si tout est aligné, on vous fait visiter.</p>
          <p style="margin:0;font-size:14px;line-height:1.65;color:#57534E;">Et vous rencontrerez peut-être déjà certains de vos futurs colocataires.</p>
        </td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:40px;background-color:#FAF9F6;border-top:1px solid #E7E5E4;border-bottom:1px solid #E7E5E4;text-align:center;">
      <p style="margin:0 0 16px 0;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#78716C;">En attendant</p>
      <p style="margin:0 0 28px 0;font-size:15px;line-height:1.75;color:#57534E;">La Villa, ce n'est pas une colocation comme les autres. C'est une maison, une vraie, avec ses pièces de vie, ses moments partagés, et des gens qui ont choisi de ne pas vivre seuls.</p>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center"><tr>
        <td style="padding:0 8px;">
          <a href="https://lavillacoliving.com" style="display:inline-block;padding:14px 28px;background-color:#1C1917;color:#FFFFFF;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Découvrir La Villa</a>
        </td>
        <td style="padding:0 8px;">
          <a href="https://www.instagram.com/la_villa_coliving_geneva" style="display:inline-block;padding:14px 28px;background-color:#FFFFFF;color:#1C1917;text-decoration:none;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:600;border:1px solid #1C1917;">Instagram</a>
        </td>
      </tr></table>
    </td>
  </tr>
  <tr>
    <td style="padding:48px 40px;background-color:#FFFFFF;text-align:center;">
      <p style="margin:0 0 12px 0;font-size:15px;line-height:1.7;color:#57534E;">Une question avant qu'on se parle ?<br>Répondez simplement à cet email, on est là.</p>
      <p style="margin:32px 0 0 0;font-size:15px;line-height:1.6;color:#1C1917;">À très vite,<br><strong style="font-weight:600;">Jérôme &amp; l'équipe de La Villa</strong></p>
    </td>
  </tr>
  <tr>
    <td style="padding:28px 40px;background-color:#1C1917;text-align:center;">
      <p style="margin:0 0 8px 0;font-size:12px;color:#D4A574;letter-spacing:2px;text-transform:uppercase;font-weight:600;">La Villa Coliving</p>
      <p style="margin:0 0 14px 0;font-size:12px;color:#A8A29E;line-height:1.6;"><a href="https://lavillacoliving.com" style="color:#D4A574;text-decoration:none;">lavillacoliving.com</a></p>
      <p style="margin:0;font-size:11px;color:#78716C;line-height:1.5;">Cet email vous a été envoyé suite à votre candidature.<br>Vos données restent strictement confidentielles.</p>
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
  const required = ["firstName", "lastName", "email", "phone", "arrival", "duration"];
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

  // 1. Email de notification admin
  const adminEmail = {
    from: FROM_ADMIN_NOTIF,
    to: [ADMIN_EMAIL],
    reply_to: data.email,
    subject: `[Candidature] ${data.firstName} ${data.lastName}`,
    html: buildAdminEmail(data),
  };

  // 2. Auto-réponse au candidat
  const autoresponseEmail = {
    from: FROM_AUTORESPONSE,
    to: [data.email],
    reply_to: ADMIN_EMAIL,
    subject: "Votre candidature à La Villa — bien reçue",
    html: buildAutoresponseEmail(data.firstName),
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

  return new Response(JSON.stringify({
    success: true,
    autoresponseSent: candidateRes.ok,
  }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
