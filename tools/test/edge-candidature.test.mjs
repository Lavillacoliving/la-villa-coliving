// Edge Function send-candidature-email v19 — tests HORS PRODUCTION (Lot A du brief « Formulaire,
// hydratation, mesure », 30/09/2026). Le fichier index.ts est importé tel quel par Node 24 (types
// retirés) avec un `Deno` simulé ; PostgREST (Supabase) et l'API Resend sont des faux en mémoire.
// Aucun email n'est envoyé, aucune ligne n'est écrite nulle part.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { loadEntityFacts } from '../../scripts/lib/load-entity-facts.mjs';

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
// (v23) Sources du site (places.ts, appart.ts, placeBridge.ts) : la clé INTERNE de L'Appart est lue dans le pont, jamais
// écrite ici (garde « aucune clé interne » des sources, tools/test/internal-keys.test.mjs).
const facts = await loadEntityFacts();

const ADMIN = 'jerome@lavillacoliving.com';

/** Faux Supabase + Resend + n8n. (v23) `fsFails` : form_submissions refuse tout (500) → rien n'est enregistré. */
function backend({ dupRecent = false, fsConflict = false, fsRejectsOffer = false, fsFails = false, adminEmailFails = false, beforePatch } = {}) {
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
        if (fsFails) return json(500, { message: 'down' });
        if (fsConflict) return new Response('{"code":"23505","message":"duplicate key value violates unique constraint submission_key"}', { status: 409 });
        // (v20) Migration `offer` pas encore appliquée : PostgREST refuse la colonne inconnue.
        if (fsRejectsOffer && body && 'offer' in body) return new Response('{"code":"PGRST204","message":"Could not find the \'offer\' column of \'form_submissions\' in the schema cache"}', { status: 400 });
        return new Response(null, { status: 201 });
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

// ── v20 — offre « Pose tes valises avant l'hiver » (brief Jérôme du 06/10/2026) ─────────────────
const OFFER_LINE = 'Offre : Pose tes valises (−50 % 1er mois, bail signé ≤ 25/11, démarrage à la libération)';
const fsBodies = (be) => be.calls.filter((c) => c.method === 'POST' && c.url.pathname === '/rest/v1/form_submissions').map((c) => c.body);

test('offer=hiver : ligne « Offre : … » EN TÊTE des notes, en tête de l\'email admin, form_submissions.offer', async () => {
  const be = backend();
  const r = await call(be, candidate({ offer: 'hiver', contact_preference: 'whatsapp', source: 'facebook' }));
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  const p = onlyProspect(be);
  assert.equal(p.notes.split('\n')[0], OFFER_LINE);
  assert.match(p.notes, /Canal préféré : WhatsApp/);
  assert.equal(p.source, 'facebook'); // le canal déclaré n'est jamais surchargé par l'offre
  const html = text(adminMail(be).html);
  assert.match(html, new RegExp(`<strong>${OFFER_LINE.replace(/[()]/g, '\\$&')}</strong>`));
  // en tête : avant la première ligne du tableau (Prénom)
  assert.ok(html.indexOf(OFFER_LINE) < html.indexOf('Prénom'));
  assert.doesNotMatch(autoReply(be).html, /Offre/); // l'auto-réponse candidat ne change pas
  const bodies = fsBodies(be);
  assert.equal(bodies.length, 1);
  assert.equal(bodies[0].offer, 'hiver');
  assert.equal(bodies[0].form_type, 'candidature');
});

test('offer inconnue (xyz, constructor, vide) : ignorée sans erreur, corps identiques à la v19', async () => {
  for (const value of ['xyz', 'constructor', '', '  ', 'HIVER2']) {
    const be = backend();
    const r = await call(be, candidate({ offer: value }));
    assert.equal(r.status, 200, JSON.stringify(value));
    assert.equal(onlyProspect(be).notes, null, JSON.stringify(value));
    assert.doesNotMatch(adminMail(be).html, /Offre :/);
    assert.ok(!('offer' in fsBodies(be)[0]), JSON.stringify(value));
  }
  // casse et espaces normalisés : « Hiver » reste une offre valide
  const be = backend();
  await call(be, candidate({ offer: ' Hiver ' }));
  assert.equal(onlyProspect(be).notes, OFFER_LINE);
  assert.equal(fsBodies(be)[0].offer, 'hiver');
});

// ── v21 — offre « Ta première année avec nous » (brief Jérôme du 21/11/2026) ─────────────────────
const FIRST_YEAR_LINE = 'Offre : Ta première année (jusqu\'à 1 400 € remboursés, bail signé du 24/11 au 31/12/2026)';

test('v21 — offer=premiere-annee : ligne « Offre : Ta première année … » en tête des notes et de l\'email, form_submissions.offer', async () => {
  const be = backend();
  const r = await call(be, candidate({ offer: 'premiere-annee', contact_preference: 'whatsapp', source: 'facebook', property_interest: 'leloft', room_interest: 'chambre-1' }));
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  const p = onlyProspect(be);
  assert.equal(p.notes.split('\n')[0], FIRST_YEAR_LINE);
  assert.equal(p.source, 'facebook'); // le canal déclaré n'est jamais surchargé par l'offre
  const html = text(adminMail(be).html);
  assert.ok(html.includes(`<strong>${FIRST_YEAR_LINE}</strong>`), 'ligne de l\'offre en tête de la notification');
  assert.ok(html.indexOf(FIRST_YEAR_LINE) < html.indexOf('Prénom'));
  assert.doesNotMatch(autoReply(be).html, /Offre/); // l'auto-réponse candidat ne change pas
  const bodies = fsBodies(be);
  assert.equal(bodies.length, 1);
  assert.equal(bodies[0].offer, 'premiere-annee');
  // casse et espaces normalisés, comme pour « hiver »
  const be2 = backend();
  await call(be2, candidate({ offer: ' Premiere-Annee ' }));
  assert.equal(onlyProspect(be2).notes, FIRST_YEAR_LINE);
  assert.equal(fsBodies(be2)[0].offer, 'premiere-annee');
});

test('v21 — « hiver » inchangée ; variantes inconnues de la nouvelle offre ignorées sans erreur', async () => {
  const be = backend();
  await call(be, candidate({ offer: 'hiver' }));
  assert.equal(onlyProspect(be).notes, OFFER_LINE);
  for (const value of ['premiere_annee', 'première-année', 'premiere-annee-2027', 'premiere annee']) {
    const b = backend();
    const r = await call(b, candidate({ offer: value }));
    assert.equal(r.status, 200, value);
    assert.equal(onlyProspect(b).notes, null, value);
    assert.ok(!('offer' in fsBodies(b)[0]), value);
  }
});

test('sans offer : aucun changement (ni notes, ni email, ni clé dans form_submissions)', async () => {
  const be = backend();
  await call(be, candidate());
  assert.equal(onlyProspect(be).notes, null);
  assert.doesNotMatch(adminMail(be).html, /Offre :/);
  assert.ok(!('offer' in fsBodies(be)[0]));
});

test('colonne form_submissions.offer absente (migration non appliquée) : rejoué sans elle, candidature sauvée, notes intactes', async () => {
  const be = backend({ fsRejectsOffer: true });
  const r = await call(be, candidate({ offer: 'hiver', utm_source: 'facebook', utm_medium: 'social', property_interest: 'lelodge', landing_page: '/offre-hiver' }));
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  assert.equal(typeof r.body.details_token, 'string');
  const bodies = fsBodies(be);
  assert.equal(bodies.length, 2);
  assert.equal(bodies[0].offer, 'hiver');
  assert.ok(!('offer' in bodies[1]));
  // seule l'offre est retirée : attribution, intérêt et atterrissage restent dans la 2ᵉ tentative
  assert.equal(bodies[1].utm_source, 'facebook');
  assert.equal(bodies[1].property_interest, '45175bde-8b94-446a-9dd4-e6dee4b5a509');
  assert.equal(bodies[1].landing_page, '/offre-hiver');
  assert.equal(onlyProspect(be).notes.split('\n')[0], OFFER_LINE);
  assert.equal(be.emails.length, 2);
});

// ── v23 — « Programmer une visite » (plan « visite hors site » du 24/11/2026, lot 1) ───────────────────────────────
// Maisons et formulaire sans maison : « demande de visite ». L'Appart (clé interne lue dans le pont) : « candidature ».
const APPART_INTERNAL = facts.toInternalPropertySlug(facts.APPART_KEY);
const APPART_UUID = '57ecaa58-81e3-4c8c-8681-d5ac50b0d437'; // properties.id de L'Appart (table PROPERTIES de l'Edge, inchangée)
/** Texte visible d'un email : sans <head>, balises retirées, entités décodées, espaces resserrés (l'insécable reste). */
const visible = (html) => text(html.replace(/<head>[\s\S]*?<\/head>/, '').replace(/<[^>]+>/g, ' ')).replace(/[ \t\r\n]+/g, ' ').trim();
/** Règle des deux gammes (docs/claude/lappart.md) : jamais un équipement des maisons, un prix ni une date dans un texte de L'Appart. */
function assertAppartSafe(label, t) {
  assert.doesNotMatch(t, /piscine|sauna|salle de sport|\bpool\b|\bgym\b/i, `${label} : équipement des maisons`);
  assert.doesNotMatch(t, /€|\bCHF\b|\bEUR\b/, `${label} : prix`);
  assert.doesNotMatch(t, /\b20\d\d\b|\b(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|january|february|april|june|july|august|september|october|november|december)\b/i, `${label} : date`);
}

test('v23 — maison, FR : « demande de visite » partout, le reste de l\'email inchangé ; notification « Nouvelle demande de visite » + ligne « Demande », objet inchangé', async () => {
  const be = backend();
  const r = await call(be, candidate({ property_interest: 'leloft', room_interest: 'chambre-3' }));
  assert.equal(r.status, 200);
  const mail = autoReply(be);
  assert.equal(mail.subject, 'Ta demande de visite — bien reçue');
  assert.deepEqual(mail.to, ['marie@example.com']);
  assert.equal(mail.reply_to, ADMIN);
  assert.match(mail.html, /<html lang="fr">/);
  assert.match(mail.html, /<title>Ta demande de visite<\/title>/);
  const v = visible(mail.html);
  for (const s of [
    'Marie, ravis d\'avoir reçu ta demande de visite.',
    'on prend le temps de bien faire les choses. Toute l\'équipe a hâte de te rencontrer.',
    'Et maintenant ? Demande bien reçue ! On regarde ce que tu cherches, pour te montrer les chambres qui te correspondent.',
    // titre de l'étape 2 (espace insécable dans « 48 h »), texte de l'étape 2 inchangé
    'On te recontacte sous 48\u00a0h pour caler ta visite. Par email ou téléphone, pour faire connaissance autour d\'un échange — sans pression, sans engagement.',
    'Tu visites, sur place ou en vidéo. Et tu rencontreras peut-être déjà certains de tes futurs colocataires.',
    'En attendant La Villa, ce n\'est pas une colocation comme les autres. C\'est une maison, une vraie',
    'Découvrir La Villa Instagram Une question avant qu\'on se parle ?',
    'À très vite, Jérôme & l\'équipe de La Villa',
    'Cet email t\'a été envoyé suite à ta demande de visite. Tes données restent strictement confidentielles.',
  ]) assert.ok(v.includes(s), s);
  assert.doesNotMatch(v, /candidat|on te fait visiter|découvrir ton profil|qui tu es/i);
  // liens inchangés
  assert.match(mail.html, /<a href="https:\/\/lavillacoliving\.com" style=/);
  assert.match(mail.html, /<a href="https:\/\/www\.instagram\.com\/la_villa_coliving_geneva" style=/);
  // notification : objet inchangé, bandeau et ligne « Demande » en tête du tableau
  const admin = adminMail(be);
  assert.equal(admin.subject, '[Candidature] Marie Dupont');
  assert.equal(admin.reply_to, 'marie@example.com');
  assert.match(visible(admin.html), /^Nouvelle demande de visite Marie Dupont Demande Visite — Le Loft, chambre 3 Prénom Marie /);
  assert.doesNotMatch(admin.html, /Nouvelle candidature/);
  // base inchangée
  const fs = fsBodies(be)[0];
  assert.equal(fs.form_type, 'candidature');
  assert.equal(fs.property_interest, '177ebcb2-6852-461c-8150-d416aa62ecf1');
  assert.equal(fs.room_interest, 'chambre-3');
  assert.equal(onlyProspect(be).property_interest, '177ebcb2-6852-461c-8150-d416aa62ecf1');
  // l'email « Compléments » garde son objet et son fil
  await call(be, { mode: 'details', details_token: r.body.details_token, duration: '3-6', language: 'fr' });
  assert.equal(detailsMail(be).subject, 'Re: [Candidature] Marie Dupont');
  assert.match(detailsMail(be).html, /Compléments de candidature/);
});

test('v23 — maison, EN : « visit request » partout, le reste inchangé (canal préféré compris) ; liste d\'attente dans la ligne « Demande »', async () => {
  const be = backend();
  await call(be, candidate({ language: 'en', property_interest: 'lelodge', room_interest: 'liste-attente', contact_preference: 'call' }));
  const mail = autoReply(be);
  assert.equal(mail.subject, 'Your visit request — received');
  assert.match(mail.html, /<html lang="en">/);
  assert.match(mail.html, /<title>Your visit request<\/title>/);
  const v = visible(mail.html);
  for (const s of [
    'Marie, we\'re delighted to have received your visit request.',
    'we take the time to do things right. The whole team is looking forward to meeting you.',
    'What happens next? Request received! We look at what you\'re looking for, so we can show you the rooms that suit you.',
    'We\'ll get back to you within 48\u00a0h to set up your visit. Fanny will reach out by phone to get to know you — no pressure, no commitment.',
    'You visit, on site or by video. And you might already meet some of your future housemates.',
    'In the meantime La Villa isn\'t your average flatshare. It\'s a house — a real one',
    'See you very soon, Jérôme & the La Villa team',
    'This email was sent to you following your visit request. Your data remains strictly confidential.',
  ]) assert.ok(v.includes(s), s);
  assert.doesNotMatch(v, /applica|candidat|show you around|discovering your profile|who you are/i);
  // la notification reste en français, objet inchangé
  const admin = adminMail(be);
  assert.equal(admin.subject, '[Candidature] Marie Dupont');
  assert.match(visible(admin.html), /^Nouvelle demande de visite Marie Dupont Demande Visite — Le Lodge, liste d'attente Prénom Marie /);
  assert.equal(fsBodies(be)[0].language, 'en');
});

test('v23 — L\'Appart, FR (clé interne lue dans le pont) : « candidature » gardée, corrections Q1 ; ni visite, ni équipement des maisons, ni prix, ni date', async () => {
  assert.notEqual(APPART_INTERNAL, facts.APPART_KEY, 'le site envoie la clé interne, pas la clé publique');
  assert.ok(facts.INTERNAL_ONLY_KEYS.includes(APPART_INTERNAL));
  const be = backend();
  const r = await call(be, candidate({ property_interest: APPART_INTERNAL, room_interest: 'liste-attente' }));
  assert.equal(r.status, 200);
  const mail = autoReply(be);
  assert.equal(mail.subject, 'Ta candidature à L\'Appart — bien reçue');
  assert.match(mail.html, /<title>Ta candidature à L'Appart<\/title>/);
  const v = visible(mail.html);
  for (const s of [
    'Marie, ravis d\'avoir reçu ta candidature.',
    'Toute l\'équipe a hâte de découvrir ton profil.',
    'Candidature bien reçue ! On regarde qui tu es, ce que tu cherches, et si L\'Appart correspond à ce dont tu as besoin.',
    'On te recontacte sous 48h. Par email ou téléphone, pour faire connaissance autour d\'un échange — sans pression, sans engagement.',
    'Si tout est aligné, tu réserves ta chambre. On te tient au courant jusqu\'à l\'ouverture de L\'Appart.',
    'En attendant L\'Appart, c\'est une colocation à Annemasse, quartier de la gare : quatre chambres, les communs entretenus chaque semaine, et l\'accès aux soirées des maisons.',
    'Cet email t\'a été envoyé suite à ta candidature. Tes données restent strictement confidentielles.',
  ]) assert.ok(v.includes(s), s);
  // les faits viennent de la source de L'Appart (src/data/appart.ts) : à revoir ici s'ils changent
  assert.ok(v.includes(`c'est une ${facts.APPART.descriptor.fr} :`), 'descripteur de L\'Appart');
  assert.equal(facts.APPART.rooms.total, 4, '« quatre chambres »');
  assert.doesNotMatch(v, /visit|demande de visite|La Villa, ce n'est pas|une maison, une vraie|à La Villa/i);
  assertAppartSafe('auto-réponse', `${mail.subject} ${v}`);
  // notification : objet inchangé, bandeau et ligne « Demande » de L'Appart
  const admin = adminMail(be);
  assert.equal(admin.subject, '[Candidature] Marie Dupont');
  assert.match(visible(admin.html), /^Nouvelle candidature — L'Appart Marie Dupont Demande Candidature — L'Appart, liste d'attente Prénom Marie /);
  assertAppartSafe('notification', visible(admin.html));
  // base inchangée ; la clé interne n'est recopiée dans aucun email
  assert.equal(fsBodies(be)[0].form_type, 'candidature');
  assert.equal(fsBodies(be)[0].property_interest, APPART_UUID);
  assert.equal(onlyProspect(be).property_interest, APPART_UUID);
  for (const e of be.emails) assert.ok(!JSON.stringify(e).toLowerCase().includes(APPART_INTERNAL), 'clé interne dans un email');
});

test('v23 — L\'Appart, EN : « application » gardée, corrections Q1 ; ni visite, ni équipement des maisons, ni prix, ni date', async () => {
  const be = backend();
  await call(be, candidate({ language: 'en', property_interest: APPART_INTERNAL, room_interest: 'chambre-5', contact_preference: 'whatsapp' }));
  const mail = autoReply(be);
  assert.equal(mail.subject, 'Your application to L\'Appart — received');
  assert.match(mail.html, /<title>Your application to L'Appart<\/title>/);
  const v = visible(mail.html);
  for (const s of [
    'Marie, we\'re delighted to have received your application.',
    'The whole team is looking forward to discovering your profile.',
    'Application received! We look at who you are, what you\'re looking for, and whether L\'Appart matches what you need.',
    'We\'ll get back to you within 48h. Fanny will reach out on WhatsApp to get to know you — no pressure, no commitment.',
    'If everything lines up, you reserve your room. We\'ll keep you posted until L\'Appart opens.',
    'In the meantime L\'Appart is a flatshare in Annemasse, near the station: four rooms, shared areas cleaned every week, and access to the houses\' evenings.',
    'This email was sent to you following your application. Your data remains strictly confidential.',
  ]) assert.ok(v.includes(s), s);
  assert.ok(v.includes(`L'Appart is a ${facts.APPART.descriptor.en}:`), 'descripteur de L\'Appart');
  assert.doesNotMatch(v, /visit|La Villa isn't your average|a real one|to La Villa/i);
  assertAppartSafe('auto-réponse EN', `${mail.subject} ${v}`);
  const admin = adminMail(be);
  assert.equal(admin.subject, '[Candidature] Marie Dupont');
  assert.match(visible(admin.html), /^Nouvelle candidature — L'Appart Marie Dupont Demande Candidature — L'Appart, chambre 5 Prénom Marie /);
  assertAppartSafe('notification EN', visible(admin.html));
});

test('v23 — rien n\'a pu être enregistré (502) : « demande » pour une visite, « candidature » pour L\'Appart, FR et EN ; aucun email', async () => {
  const cases = [
    [{}, 'fr', 'Ta demande n\'a pas pu être enregistrée. Réessaie dans un instant, ou écris-nous directement.'],
    [{ property_interest: 'lavilla' }, 'en', 'Your request couldn\'t be saved. Please try again in a moment, or contact us directly.'],
    [{ property_interest: APPART_INTERNAL }, 'fr', 'Ta candidature n\'a pas pu être enregistrée. Réessaie dans un instant, ou écris-nous directement.'],
    [{ property_interest: APPART_INTERNAL }, 'en', 'Your application couldn\'t be saved. Please try again in a moment, or contact us directly.'],
  ];
  for (const [extra, language, message] of cases) {
    const be = backend({ fsFails: true });
    const r = await call(be, candidate({ ...extra, language }));
    assert.equal(r.status, 502, message);
    assert.deepEqual(r.body, { error: message });
    assert.equal(be.emails.length, 0, 'aucun email quand rien n\'est enregistré');
    assert.equal(be.prospects.size, 0);
  }
});

test('v23 — sans maison (lien général), lieu inconnu ou « constructor » : email « visite », « Visite (maison non précisée) » ; chambre seule, valeur libre échappée', async () => {
  for (const extra of [{}, { property_interest: '' }, { property_interest: 'xyz' }, { property_interest: 'constructor' }]) {
    const be = backend();
    const r = await call(be, candidate(extra));
    assert.equal(r.status, 200, JSON.stringify(extra));
    assert.equal(autoReply(be).subject, 'Ta demande de visite — bien reçue', JSON.stringify(extra));
    assert.match(visible(adminMail(be).html), /^Nouvelle demande de visite Marie Dupont Demande Visite \(maison non précisée\) Prénom Marie /, JSON.stringify(extra));
  }
  const be = backend();
  await call(be, candidate({ room_interest: 'chambre-2' }));
  assert.match(visible(adminMail(be).html), /Demande Visite \(maison non précisée\), chambre 2 Prénom/);
  const be2 = backend();
  await call(be2, candidate({ property_interest: 'lavilla', room_interest: '<b>suite</b>' }));
  assert.match(adminMail(be2).html, /Visite — La Villa, &lt;b&gt;suite&lt;\/b&gt;/);
});

test('v23 — les 3 maisons : nom du site (PLACE_LABEL) dans la ligne « Demande » et email « visite » ; L\'Appart seul en « candidature »', async () => {
  for (const key of facts.MAISON_KEYS) {
    const be = backend();
    await call(be, candidate({ property_interest: facts.toInternalPropertySlug(key) }));
    assert.equal(autoReply(be).subject, 'Ta demande de visite — bien reçue', key);
    assert.match(visible(adminMail(be).html), new RegExp(`^Nouvelle demande de visite Marie Dupont Demande Visite — ${facts.PLACE_LABEL[key]} Prénom`), key);
  }
  const be = backend();
  await call(be, candidate({ property_interest: APPART_INTERNAL }));
  assert.equal(autoReply(be).subject, `Ta candidature à ${facts.PLACE_LABEL[facts.APPART_KEY]} — bien reçue`);
  assert.match(visible(adminMail(be).html), new RegExp(`Demande Candidature — ${facts.PLACE_LABEL[facts.APPART_KEY]} Prénom`));
});
