// Edge Function send-candidature-email v19 — tests HORS PRODUCTION (Lot A du brief « Formulaire,
// hydratation, mesure », 30/09/2026). Le fichier index.ts est importé tel quel par Node 24 (types
// retirés) avec un `Deno` simulé ; PostgREST (Supabase) et l'API Resend sont des faux en mémoire.
// Aucun email n'est envoyé, aucune ligne n'est écrite nulle part.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const ENV = {
  RESEND_API_KEY: 're_test_key',
  SUPABASE_URL: 'https://sb.example',
  SUPABASE_SERVICE_ROLE_KEY: 'service-role-test-key',
  N8N_ALERT_WEBHOOK_URL: 'https://n8n.example/alert',
};
let handler;
globalThis.Deno = { env: { get: (k) => ENV[k] }, serve: (h) => { handler = h; } };
await import('../../supabase/functions/send-candidature-email/index.ts');
assert.equal(typeof handler, 'function', 'Deno.serve non appelé');

const ADMIN = 'jerome@lavillacoliving.com';

/** Faux Supabase + Resend + n8n. */
function backend({ dupRecent = false, fsConflict = false, adminEmailFails = false, beforePatch } = {}) {
  const prospects = new Map();
  const emails = [];
  const calls = [];
  let n = 1;
  const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
  async function fakeFetch(input, init = {}) {
    const url = new URL(typeof input === 'string' ? input : input.url);
    const method = (init.method ?? 'GET').toUpperCase();
    const body = init.body ? JSON.parse(init.body) : undefined;
    calls.push({ method, url, body, headers: init.headers ?? {} });
    if (url.hostname === 'api.resend.com') {
      if (method === 'POST' && url.pathname === '/emails') {
        const admin = String(body.from).includes('notifications@');
        if (admin && adminEmailFails && !String(body.subject).startsWith('Re:')) return json(500, { message: 'down' });
        const id = `email-${String(emails.length + 1).padStart(4, '0')}-abcd`;
        emails.push({ id, ...body });
        return json(200, { id });
      }
      if (method === 'GET' && url.pathname.startsWith('/emails/')) {
        const id = decodeURIComponent(url.pathname.slice('/emails/'.length));
        return emails.some((e) => e.id === id) ? json(200, { id, message_id: `${id}@resend.example` }) : json(404, {});
      }
    }
    if (url.hostname === 'n8n.example') return json(200, {});
    if (url.hostname === 'sb.example') {
      const table = url.pathname.replace('/rest/v1/', '');
      const q = url.searchParams;
      if (table === 'form_submissions' && method === 'POST') {
        return fsConflict
          ? new Response('{"code":"23505","message":"duplicate key value violates unique constraint submission_key"}', { status: 409 })
          : new Response(null, { status: 201 });
      }
      if (table === 'prospects' && method === 'GET' && q.has('email')) {
        return json(200, dupRecent ? [{ id: '00000000-0000-4000-8000-000000000999' }] : []);
      }
      if (table === 'prospects' && method === 'POST') {
        const id = `00000000-0000-4000-8000-${String(n++).padStart(12, '0')}`;
        prospects.set(id, { id, created_at: new Date().toISOString(), move_in_date: null, lease_duration: null, notes: null, ...body });
        return json(201, [{ id }]);
      }
      if (table === 'prospects' && method === 'GET' && q.has('id')) {
        const row = prospects.get(q.get('id').replace(/^eq\./, ''));
        return json(200, row ? [{ ...row }] : []);
      }
      if (table === 'prospects' && method === 'PATCH') {
        const row = prospects.get(q.get('id').replace(/^eq\./, ''));
        if (!row) return json(200, []);
        if (beforePatch) beforePatch(row);
        const nf = q.get('notes');
        const notesOk = nf === 'is.null' ? row.notes === null : nf === `eq.${row.notes}`;
        const leaseOk = !q.has('lease_duration') || (q.get('lease_duration') === 'is.null' && row.lease_duration === null);
        if (!notesOk || !leaseOk) return json(200, []);
        Object.assign(row, body);
        return json(200, [{ id: row.id }]);
      }
    }
    throw new Error(`fetch inattendu : ${method} ${url}`);
  }
  return { prospects, emails, calls, fetch: fakeFetch };
}

async function call(be, payload, { origin = 'https://www.lavillacoliving.com' } = {}) {
  globalThis.fetch = be.fetch;
  const log = console.log, err = console.error;
  console.log = () => {}; console.error = () => {};
  try {
    const res = await handler(new Request('https://sb.example/functions/v1/send-candidature-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: origin },
      body: JSON.stringify(payload),
    }));
    return { status: res.status, body: await res.json() };
  } finally {
    console.log = log; console.error = err;
  }
}

const candidate = (extra = {}) => ({
  firstName: 'Marie', lastName: 'Dupont', email: 'marie@example.com', phone: '06 12 34 56 78',
  language: 'fr', submission_key: randomUUID(), ...extra,
});
const adminMail = (be) => be.emails.find((e) => String(e.from).includes('notifications@') && !String(e.subject).startsWith('Re:'));
const autoReply = (be) => be.emails.find((e) => String(e.from).includes('hello@'));
const detailsMail = (be) => be.emails.find((e) => String(e.subject).startsWith('Re:'));
const onlyProspect = (be) => [...be.prospects.values()][0];
/** Texte lisible d'un email (entités HTML d'escapeHtml décodées). */
const text = (html) => html.replace(/&#039;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

test('candidature à 4 champs : 200, jeton, notification sans « — » pour l\'arrivée et la durée', async () => {
  const be = backend();
  const r = await call(be, candidate());
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  assert.equal(typeof r.body.details_token, 'string');
  const html = text(adminMail(be).html);
  assert.match(html, /Arrivée et durée/);
  assert.match(html, /Pas encore renseignées\. Le candidat peut les ajouter juste après l'envoi ; si c'est le cas, un email « Compléments » suivra dans ce fil\./);
  assert.doesNotMatch(html, /Date d'arrivée souhaitée/);
  assert.doesNotMatch(html, /Durée du séjour/);
  assert.deepEqual(adminMail(be).to, [ADMIN]);
  assert.equal(adminMail(be).cc, undefined);
  const p = onlyProspect(be);
  assert.equal(p.lease_duration, null);
  assert.equal(p.notes, null);
  // insert prospects : seul l'id est relu
  const insert = be.calls.find((c) => c.method === 'POST' && c.url.pathname === '/rest/v1/prospects');
  assert.equal(insert.url.searchParams.get('select'), 'id');
  assert.equal(insert.headers.Prefer, 'return=representation');
});

test('canal préféré : ligne de notes, mention en gras près du téléphone, phrase de l\'auto-réponse', async () => {
  for (const [value, label, fr] of [['whatsapp', 'WhatsApp', 'par WhatsApp'], ['call', 'Appel', 'par téléphone'], ['email', 'Email', 'par email']]) {
    const be = backend();
    const r = await call(be, candidate({ contact_preference: value }));
    assert.equal(r.status, 200);
    assert.match(onlyProspect(be).notes, new RegExp(`Canal préféré : ${label}`));
    assert.match(adminMail(be).html, new RegExp(`06 12 34 56 78 — <strong>préfère ${label}</strong>`));
    assert.match(autoReply(be).html, new RegExp(`Fanny te contacte ${fr} pour faire connaissance`));
  }
  const en = backend();
  await call(en, candidate({ contact_preference: 'call', language: 'en' }));
  assert.match(autoReply(en).html, /Fanny will reach out by phone to get to know you/);
});

test('canal hors liste : ignoré sans erreur (champ facultatif, jamais bloquant)', async () => {
  for (const value of ['sms', 'constructor', '<script>', 'WHATSAPP ']) {
    const be = backend();
    const r = await call(be, candidate({ contact_preference: value }));
    assert.equal(r.status, 200, value);
    const notes = onlyProspect(be).notes ?? '';
    if (value === 'WHATSAPP ') {
      // casse et espaces normalisés : valeur valide
      assert.match(notes, /Canal préféré : WhatsApp/);
      assert.match(autoReply(be).html, /Fanny te contacte par WhatsApp/);
    } else {
      assert.doesNotMatch(notes, /Canal préféré/, value);
      assert.doesNotMatch(autoReply(be).html, /Fanny te contacte/, value);
      assert.doesNotMatch(adminMail(be).html, /préfère/, value);
    }
  }
});

test('?arrival= transmis : arrivée affichée avec son libellé, durée annoncée pour plus tard', async () => {
  const be = backend();
  await call(be, candidate({ arrival: '1-3-months' }));
  const html = text(adminMail(be).html);
  assert.match(html, /Date d'arrivée souhaitée[\s\S]*Dans 1 à 3 mois/);
  assert.match(html, /Durée du séjour[\s\S]*Pas encore renseignée\. Le candidat peut l'ajouter juste après l'envoi/);
  assert.doesNotMatch(html, /Arrivée et durée/);
  assert.match(onlyProspect(be).notes, /^Souhait d'arrivée : Dans 1 à 3 mois$/m);
});

test('ancien front (arrivée + durée envoyées) : libellés, « Jusqu\'à 3 mois », lease_duration', async () => {
  const be = backend();
  await call(be, candidate({ arrival: 'asap', duration: '2-3' }));
  const html = text(adminMail(be).html);
  assert.match(html, /Le plus tôt possible \(sous 1 mois\)/);
  assert.match(html, /Jusqu'à 3 mois/);
  const p = onlyProspect(be);
  assert.equal(p.lease_duration, '3_mois');
  assert.match(p.notes, /Durée souhaitée : Jusqu'à 3 mois/);
});

test('destinataires supplémentaires (secrets) : ajoutés aux vraies candidatures, JAMAIS aux tests', async () => {
  ENV.CANDIDATURE_NOTIFY_TO = 'fanny@example.com, pas-un-email, jerome@lavillacoliving.com';
  ENV.CANDIDATURE_NOTIFY_CC = 'assistant@example.com';
  try {
    let be = backend();
    await call(be, candidate());
    assert.deepEqual(adminMail(be).to, [ADMIN, 'fanny@example.com']);
    assert.deepEqual(adminMail(be).cc, ['assistant@example.com']);
    be = backend();
    await call(be, candidate({ isTest: '1' }));
    assert.deepEqual(adminMail(be).to, [ADMIN]);
    assert.equal(adminMail(be).cc, undefined);
    assert.match(adminMail(be).subject, /^\[TEST\] \[Candidature\] Marie Dupont$/);
  } finally {
    delete ENV.CANDIDATURE_NOTIFY_TO;
    delete ENV.CANDIDATURE_NOTIFY_CC;
  }
});

test('honeypot : succès simulé, aucun email, aucun jeton', async () => {
  const be = backend();
  const r = await call(be, candidate({ botcheck: 'spam' }));
  assert.equal(r.status, 200);
  assert.equal(r.body.details_token, undefined);
  assert.equal(be.emails.length, 0);
});

test('re-POST de la même clé (409) : doublon sans email ni jeton', async () => {
  const be = backend({ fsConflict: true });
  const r = await call(be, candidate());
  assert.equal(r.body.duplicate, true);
  assert.equal(r.body.details_token, undefined);
  assert.equal(be.emails.length, 0);
});

test('même email < 10 min : pas de nouveau prospect et PAS de jeton (jamais la fiche d\'un autre)', async () => {
  const be = backend({ dupRecent: true });
  const r = await call(be, candidate());
  assert.equal(r.status, 200);
  assert.equal(r.body.details_token, undefined);
  assert.equal(be.prospects.size, 0);
  assert.equal(be.emails.length, 2); // les emails partent comme avant
});

test('notification admin en échec : candidature OK, alerte n8n, jeton sans fil (nid null)', async () => {
  const be = backend({ adminEmailFails: true });
  const r = await call(be, candidate());
  assert.equal(r.status, 200);
  assert.equal(r.body.adminNotified, false);
  assert.ok(be.calls.some((c) => c.url.hostname === 'n8n.example'));
  const d = await call(be, { mode: 'details', details_token: r.body.details_token, duration: '6-12', language: 'fr' });
  assert.equal(d.body.updated, true);
  assert.equal(detailsMail(be).headers, undefined); // pas de message_id connu → « Re: » seul
});

test('mode compléments : même prospect mis à jour, email « Compléments » dans le fil', async () => {
  const be = backend();
  const r = await call(be, candidate({ contact_preference: 'whatsapp' }));
  const notesBefore = onlyProspect(be).notes;
  const d = await call(be, { mode: 'details', details_token: r.body.details_token, arrival: 'asap', duration: '6-12', language: 'fr' });
  assert.equal(d.status, 200);
  assert.deepEqual(d.body, { success: true, updated: true });
  assert.equal(be.prospects.size, 1);
  const p = onlyProspect(be);
  assert.equal(p.lease_duration, '12_mois');
  assert.equal(p.notes, `${notesBefore}\nSouhait d'arrivée : Le plus tôt possible (sous 1 mois)\nDurée souhaitée : 6-12 mois`);
  // aucune écriture form_submissions supplémentaire, aucun email candidat supplémentaire
  assert.equal(be.calls.filter((c) => c.url.pathname === '/rest/v1/form_submissions').length, 1);
  assert.equal(be.emails.filter((e) => String(e.from).includes('hello@')).length, 1);
  const mail = detailsMail(be);
  assert.equal(mail.subject, 'Re: [Candidature] Marie Dupont');
  const notifId = adminMail(be).id;
  assert.deepEqual(mail.headers, { 'In-Reply-To': `<${notifId}@resend.example>`, References: `<${notifId}@resend.example>` });
  assert.deepEqual(mail.to, [ADMIN]);
  assert.equal(mail.reply_to, 'marie@example.com');
  assert.match(mail.html, /Arrivée souhaitée[\s\S]*Le plus tôt possible/);
  assert.match(mail.html, /Durée souhaitée[\s\S]*6-12 mois/);
});

test('rejeu du bloc : updated:false, aucune écriture, AUCUN 2ᵉ email', async () => {
  const be = backend();
  const r = await call(be, candidate());
  await call(be, { mode: 'details', details_token: r.body.details_token, duration: '3-6', language: 'fr' });
  const patches = be.calls.filter((c) => c.method === 'PATCH').length;
  const mails = be.emails.length;
  const again = await call(be, { mode: 'details', details_token: r.body.details_token, duration: '12+', language: 'fr' });
  assert.deepEqual(again.body, { success: true, updated: false });
  assert.equal(be.calls.filter((c) => c.method === 'PATCH').length, patches);
  assert.equal(be.emails.length, mails);
  assert.equal(onlyProspect(be).lease_duration, '6_mois'); // la 1ʳᵉ réponse n'est jamais remplacée
});

test('arrivée déjà connue par ?arrival= : seule la durée est écrite', async () => {
  const be = backend();
  const r = await call(be, candidate({ arrival: '3-6-months' }));
  const d = await call(be, { mode: 'details', details_token: r.body.details_token, arrival: 'asap', duration: '12+', language: 'fr' });
  assert.equal(d.body.updated, true);
  const notes = onlyProspect(be).notes;
  assert.equal((notes.match(/Souhait d'arrivée/g) ?? []).length, 1);
  assert.match(notes, /Souhait d'arrivée : Dans 3 à 6 mois/);
  assert.match(notes, /Durée souhaitée : 12\+ mois/);
  assert.doesNotMatch(detailsMail(be).html, /Arrivée souhaitée/);
});

test('saisie intercalée (notes modifiées entre lecture et écriture) : relecture, jamais d\'écrasement', async () => {
  let touched = false;
  const be = backend({
    beforePatch(row) {
      if (!touched) { touched = true; row.notes = 'Fanny : rappeler jeudi'; }
    },
  });
  const r = await call(be, candidate());
  const d = await call(be, { mode: 'details', details_token: r.body.details_token, duration: '3-6', language: 'fr' });
  assert.equal(d.body.updated, true);
  assert.equal(onlyProspect(be).notes, 'Fanny : rappeler jeudi\nDurée souhaitée : 3-6 mois');
  assert.equal(be.calls.filter((c) => c.method === 'PATCH').length, 2);
});

test('durée déjà saisie par l\'équipe : rien n\'est remplacé', async () => {
  const be = backend();
  const r = await call(be, candidate());
  onlyProspect(be).lease_duration = 'flexible';
  const d = await call(be, { mode: 'details', details_token: r.body.details_token, duration: '6-12', language: 'fr' });
  assert.deepEqual(d.body, { success: true, updated: false });
  assert.equal(onlyProspect(be).lease_duration, 'flexible');
});

test('compléments d\'une candidature de test : sujet [TEST], jamais aux destinataires supplémentaires', async () => {
  ENV.CANDIDATURE_NOTIFY_TO = 'fanny@example.com';
  try {
    const be = backend();
    const r = await call(be, candidate({ isTest: '1' }));
    onlyProspect(be).is_test = true;
    await call(be, { mode: 'details', details_token: r.body.details_token, duration: '6-12', language: 'fr' });
    assert.equal(detailsMail(be).subject, 'Re: [TEST] [Candidature] Marie Dupont');
    assert.deepEqual(detailsMail(be).to, [ADMIN]);
  } finally {
    delete ENV.CANDIDATURE_NOTIFY_TO;
  }
});

test('jeton altéré, expiré ou absent : 401, aucune écriture', async () => {
  const be = backend();
  const r = await call(be, candidate());
  const [body, sig] = r.body.details_token.split('.');
  const forged = Buffer.from(JSON.stringify({ v: 1, pid: '00000000-0000-4000-8000-000000000999', sk: 'x', nid: null, exp: Date.now() + 1e6 })).toString('base64url');
  for (const token of [`${forged}.${sig}`, `${body}.${sig.slice(0, -2)}AA`, '', 'abc', `${body}`]) {
    const d = await call(be, { mode: 'details', details_token: token, duration: '6-12', language: 'en' });
    assert.equal(d.status, 401, token);
    assert.match(d.body.error, /expired/);
  }
  // expiré : on avance l'horloge de 61 min
  const realNow = Date.now;
  Date.now = () => realNow() + 61 * 60 * 1000;
  try {
    const d = await call(be, { mode: 'details', details_token: r.body.details_token, duration: '6-12', language: 'fr' });
    assert.equal(d.status, 401);
    assert.match(d.body.error, /expiré/);
  } finally {
    Date.now = realNow;
  }
  assert.equal(be.calls.filter((c) => c.method === 'PATCH').length, 0);
});

test('réponses hors liste ou vides : 400, aucune écriture', async () => {
  const be = backend();
  const r = await call(be, candidate());
  for (const answers of [{ duration: '24' }, { arrival: 'demain' }, {}, { duration: 'constructor' }]) {
    const d = await call(be, { mode: 'details', details_token: r.body.details_token, language: 'fr', ...answers });
    assert.equal(d.status, 400, JSON.stringify(answers));
  }
  assert.equal(be.calls.filter((c) => c.method === 'PATCH').length, 0);
});

test('CORS : localhost:5173 et :4173 autorisés pour les tests locaux, origine inconnue ramenée à la prod', async () => {
  for (const origin of ['http://localhost:5173', 'http://localhost:4173']) {
    globalThis.fetch = backend().fetch;
    const res = await handler(new Request('https://sb.example/x', { method: 'OPTIONS', headers: { Origin: origin } }));
    assert.equal(res.headers.get('Access-Control-Allow-Origin'), origin);
  }
  const res = await handler(new Request('https://sb.example/x', { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } }));
  assert.equal(res.headers.get('Access-Control-Allow-Origin'), 'https://www.lavillacoliving.com');
});
