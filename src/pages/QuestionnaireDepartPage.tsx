import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { SUPABASE_URL } from '@/lib/supabase';

/*
 * Page publique du questionnaire de satisfaction de départ.
 * Route : /questionnaire-depart/:token  (pas d'auth, lien à token unique).
 * Back : Edge Function publique `exit-survey` (GET charge, POST enregistre).
 * Design : maquette validée (gold #b8860b, Fraunces + Hanken Grotesk).
 * Avis Google proposé À TOUS de la même façon (pas de review gating — banni par Google).
 * CSS scopé sous .esd pour ne pas interférer avec le reste du site.
 */

const FN_URL = `${SUPABASE_URL}/functions/v1/exit-survey`;
// Fiche Google Business unique de La Villa Coliving (avis publics).
const GOOGLE_REVIEW_URL = 'https://g.page/r/CTbYoHhhGGzJEBM/review';

type Lang = 'fr' | 'en';
type Screen = 'loading' | 'form' | 'thanks' | 'used' | 'expired' | 'invalid';

interface Resident {
  first_name: string;
  house: string;
  room: number | null;
  months: number | null;
}

// Dimensions notées. `api` = clé attendue par l'Edge Function (alignement strict).
const DIMS = [
  { key: 'room',    api: 'rating_room',      fr: 'Ta chambre',                              en: 'Your bedroom' },
  { key: 'clean',   api: 'rating_clean',     fr: 'La propreté des espaces communs',         en: 'Cleanliness of shared spaces' },
  { key: 'equip',   api: 'rating_equipment', fr: 'Les équipements (wifi, piscine, sport…)', en: 'The facilities (wifi, pool, gym…)' },
  { key: 'vibe',    api: 'rating_vibe',      fr: "L'ambiance et la vie entre colocs",       en: 'The vibe and life between housemates' },
  { key: 'support', api: 'rating_support',   fr: 'Notre réactivité (Jérôme & Fanny)',       en: 'How responsive we were (Jérôme & Fanny)' },
] as const;

// Raisons de départ. ⚠️ clé 'unhappy' (la maquette utilisait 'unhap' — la Function attend 'unhappy').
const REASONS = [
  { key: 'end',     fr: "Fin de mission / d'études",           en: 'End of contract / studies' },
  { key: 'move',    fr: "J'ai acheté / je m'installe",         en: "I bought / I'm settling down" },
  { key: 'job',     fr: 'Mutation, nouveau job ailleurs',      en: 'Relocation, new job elsewhere' },
  { key: 'unhappy', fr: "Je n'étais pas pleinement satisfait", en: "I wasn't fully satisfied" },
  { key: 'other',   fr: "Autre / je préfère ne pas dire",      en: "Other / I'd rather not say" },
] as const;

type Dict = Record<string, string>;
const I18N: Record<Lang, Dict> = {
  fr: {
    hero_pre: "Merci d'avoir fait partie de La Villa,", hero_post: '.',
    hero_sub: "Tu viens de tourner une page. Avant de filer vers la suite, quelques minutes pour nous dire comment c'était ? Ton retour nous aide à rendre les maisons meilleures pour celles et ceux qui arrivent.",
    room_word: 'Chambre', months_word: 'mois parmi nous',
    nps_eyebrow: 'La grande question', nps_q: 'Recommanderais-tu La Villa à un ami ou un collègue ?',
    nps_hint: '0 = surtout pas · 10 = les yeux fermés.', nps_low: 'Surtout pas', nps_high: 'Les yeux fermés',
    dim_eyebrow: 'Dans le détail', dim_q: "Qu'est-ce qui a compté pour toi ?", dim_hint: '1 étoile = à revoir · 5 étoiles = au top.',
    love_eyebrow: 'Le meilleur', love_q: 'Ce que tu as préféré', love_ph: 'Un souvenir, un détail, une personne… ce qui va te manquer.',
    improve_eyebrow: 'Pour progresser', improve_q: "Ce qu'on pourrait améliorer", improve_ph: "Sois honnête, c'est comme ça qu'on avance. Rien n'est trop petit.",
    reason_eyebrow: 'Ton départ', reason_q: "Qu'est-ce qui t'amène à partir ?", reason_hint: 'Une seule réponse, ça nous aide à comprendre.',
    extra_eyebrow: 'Deux dernières choses', testi_q: "On peut partager un extrait de ton avis (avec ton prénom) sur notre site ?",
    testi_hint: "Rien n'est publié sans ton feu vert.", yes: 'Oui, volontiers', no: 'Non merci',
    contact_q: 'On garde le lien ?', contact_hint: "Laisse-nous un email si tu veux rester dans la boucle (facultatif).",
    contact_ph: 'ton@email.com', contact_coopt: 'On a aussi un petit merci quand tu nous recommandes un futur coloc.',
    submit: 'Envoyer mon retour', submit_error: "Oups, l'envoi n'a pas fonctionné. Réessaie dans un instant.",
    legal: 'Tes réponses restent confidentielles et servent uniquement à améliorer La Villa.',
    thanks_pre: "C'est envoyé — merci,", thanks_post: ' 🙏',
    thanks_body: "Ton retour compte vraiment. On te souhaite le meilleur pour la suite… et qui sait, à un de ces jours à la maison.",
    thanks_sign: '— Jérôme & Fanny',
    google_pitch: "Ton retour aide aussi les autres à nous découvrir. Si le cœur t'en dit, partage ton expérience sur Google.",
    google_btn: 'Laisser un avis Google',
    verbatim_intro: "Tu viens d'écrire ceci :", verbatim_copy: 'Copier mon texte', verbatim_copied: 'Copié ✓',
    verbatim_help: 'On te le remet — copie-le et colle-le sur Google, c\'est déjà prêt.',
    used_title: 'Ce retour est déjà enregistré', used_body: 'Tu as déjà répondu à ce questionnaire — merci encore ! Si tu penses qu\'il y a une erreur, écris-nous à hello@lavillacoliving.com.',
    expired_title: 'Ce lien a expiré', expired_body: "Ton questionnaire n'est plus disponible (les liens expirent après 30 jours). Si tu souhaites quand même nous laisser un retour, écris-nous à hello@lavillacoliving.com.",
    invalid_title: 'Lien invalide', invalid_body: "Ce lien ne correspond à aucun questionnaire. Vérifie que tu as bien copié l'adresse complète, ou écris-nous à hello@lavillacoliving.com.",
    loading: 'Chargement…',
  },
  en: {
    hero_pre: 'Thanks for being part of La Villa,', hero_post: '.',
    hero_sub: "You've just turned a page. Before you head off, a few minutes to tell us how it was? Your feedback helps us make the houses better for whoever comes next.",
    room_word: 'Room', months_word: 'months with us',
    nps_eyebrow: 'The big one', nps_q: 'Would you recommend La Villa to a friend or colleague?',
    nps_hint: '0 = definitely not · 10 = absolutely.', nps_low: 'Definitely not', nps_high: 'Absolutely',
    dim_eyebrow: 'The details', dim_q: 'What mattered to you?', dim_hint: '1 star = needs work · 5 stars = nailed it.',
    love_eyebrow: 'The best bits', love_q: 'What you loved most', love_ph: "A memory, a detail, a person… what you'll miss.",
    improve_eyebrow: 'To do better', improve_q: 'What we could improve', improve_ph: "Be honest, that's how we grow. Nothing's too small.",
    reason_eyebrow: 'Your move', reason_q: "What's taking you away?", reason_hint: 'Pick one, it helps us understand.',
    extra_eyebrow: 'Two last things', testi_q: 'Can we share a snippet of your review (with your first name) on our site?',
    testi_hint: 'Nothing goes public without your OK.', yes: 'Yes, happily', no: 'No thanks',
    contact_q: 'Stay in touch?', contact_hint: "Leave an email if you'd like to stay in the loop (optional).",
    contact_ph: 'you@email.com', contact_coopt: 'We also have a little thank-you when you refer a future housemate.',
    submit: 'Send my feedback', submit_error: "Oops, that didn't go through. Please try again in a moment.",
    legal: 'Your answers stay private and are only used to make La Villa better.',
    thanks_pre: 'Sent — thank you,', thanks_post: ' 🙏',
    thanks_body: "Your feedback really matters. We wish you all the best for what's next… and who knows, see you around the house someday.",
    thanks_sign: '— Jérôme & Fanny',
    google_pitch: "Your feedback also helps others discover us. If you're up for it, share your experience on Google.",
    google_btn: 'Leave a Google review',
    verbatim_intro: "Here's what you just wrote:", verbatim_copy: 'Copy my text', verbatim_copied: 'Copied ✓',
    verbatim_help: "We've kept it for you — copy and paste it on Google, ready to go.",
    used_title: 'This feedback is already in', used_body: "You've already answered this survey — thanks again! If you think something's off, drop us a line at hello@lavillacoliving.com.",
    expired_title: 'This link has expired', expired_body: "Your survey is no longer available (links expire after 30 days). If you'd still like to share feedback, drop us a line at hello@lavillacoliving.com.",
    invalid_title: 'Invalid link', invalid_body: "This link doesn't match any survey. Please check you copied the full address, or write to us at hello@lavillacoliving.com.",
    loading: 'Loading…',
  },
};

const CSS = `
.esd{
  --gold:#b8860b;--gold-soft:#c9971f;--gold-deep:#9a710a;
  --ink:#2a2320;--ink-soft:#6b5f57;--hero:#211915;--hero-card:#2e241d;
  --cream:#fbf9f5;--card:#ffffff;--line:#eae2d7;--line-strong:#ddd2c3;--ok:#3f7d5a;
  --radius:18px;
  --shadow:0 1px 2px rgba(42,35,32,.04),0 8px 30px rgba(42,35,32,.06);
  --shadow-lift:0 10px 34px rgba(42,35,32,.12);
  min-height:100vh;background:var(--cream);color:var(--ink);
  font-family:"Hanken Grotesk",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  font-size:16px;line-height:1.55;-webkit-font-smoothing:antialiased;
}
.esd *{box-sizing:border-box}
.esd .stage{max-width:680px;margin:0 auto;padding:0 20px 120px}
.esd .hero{position:relative;margin:0 -20px 0;padding:28px 32px 40px;background:radial-gradient(120% 90% at 85% -10%,rgba(184,134,11,.22),transparent 60%),var(--hero);color:#f3ece2;overflow:hidden}
.esd .hero--slim{padding-bottom:26px}
.esd .hero__top{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:34px}
.esd .hero--slim .hero__top{margin-bottom:0}
.esd .wordmark{font-family:"Fraunces",serif;font-weight:600;font-size:15px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-soft)}
.esd .wordmark span{color:#f3ece2;font-weight:400}
.esd .lang{display:inline-flex;border:1px solid rgba(243,236,226,.28);border-radius:999px;overflow:hidden}
.esd .lang button{appearance:none;border:0;background:transparent;color:rgba(243,236,226,.7);font:inherit;font-size:12.5px;font-weight:600;letter-spacing:.06em;padding:6px 13px;cursor:pointer;transition:.18s}
.esd .lang button.is-active{background:var(--gold);color:#231a12}
.esd .hero h1{font-family:"Fraunces",serif;font-weight:500;font-size:clamp(28px,6.4vw,42px);line-height:1.08;letter-spacing:-.01em;margin:0 0 16px}
.esd .hero h1 .hl{color:var(--gold-soft);font-weight:600}
.esd .hero p.sub{max-width:46ch;margin:0 0 26px;color:rgba(243,236,226,.82);font-size:16.5px}
.esd .stay{display:inline-flex;flex-wrap:wrap;align-items:center;gap:12px;background:var(--hero-card);border:1px solid rgba(243,236,226,.1);border-radius:14px;padding:12px 18px;font-size:14.5px;color:#ece3d7}
.esd .stay .dot{width:4px;height:4px;border-radius:50%;background:var(--gold-soft);opacity:.8}
.esd .stay b{color:#fff;font-weight:600}
.esd main{margin-top:26px}
.esd .block{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:26px 26px 28px;margin-bottom:16px;box-shadow:var(--shadow)}
.esd .eyebrow{display:block;font-size:12px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--gold-deep);margin-bottom:8px}
.esd .block h2{font-family:"Fraunces",serif;font-weight:500;font-size:22px;line-height:1.2;letter-spacing:-.01em;margin:0 0 4px;color:var(--ink)}
.esd .block .hint{margin:2px 0 20px;color:var(--ink-soft);font-size:14.5px}
.esd .nps{display:flex;flex-wrap:wrap;gap:8px}
.esd .nps button{appearance:none;cursor:pointer;font:inherit;font-weight:600;font-size:15px;width:44px;height:44px;border-radius:12px;border:1.5px solid var(--line-strong);background:#fff;color:var(--ink);transition:.15s}
.esd .nps button:hover{border-color:var(--gold);transform:translateY(-2px)}
.esd .nps button.is-on{background:var(--gold);border-color:var(--gold);color:#fff;box-shadow:0 6px 16px rgba(184,134,11,.28)}
.esd .nps-anchors{display:flex;justify-content:space-between;margin-top:12px;font-size:12.5px;color:var(--ink-soft)}
.esd .dim{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 0;border-top:1px solid var(--line)}
.esd .dim:first-of-type{border-top:0;padding-top:4px}
.esd .dim__label{font-size:15.5px;font-weight:500;max-width:60%}
.esd .stars{display:inline-flex;gap:4px;flex-shrink:0}
.esd .stars span{cursor:pointer;font-size:26px;line-height:1;color:var(--line-strong);transition:.12s;user-select:none}
.esd .stars span:hover{transform:scale(1.14)}
.esd .stars span.lit{color:var(--gold)}
.esd .field{margin-top:2px}
.esd textarea{width:100%;min-height:96px;resize:vertical;border:1.5px solid var(--line-strong);border-radius:14px;padding:13px 15px;font:inherit;font-size:15.5px;color:var(--ink);background:#fff;transition:.15s}
.esd textarea::placeholder{color:#a89c90}
.esd textarea:focus,.esd input[type=email]:focus{outline:0;border-color:var(--gold);box-shadow:0 0 0 4px rgba(184,134,11,.12)}
.esd .chips{display:flex;flex-wrap:wrap;gap:10px}
.esd .chips button{appearance:none;cursor:pointer;font:inherit;font-size:14.5px;font-weight:500;border:1.5px solid var(--line-strong);background:#fff;color:var(--ink);border-radius:999px;padding:9px 16px;transition:.15s}
.esd .chips button:hover{border-color:var(--gold-soft)}
.esd .chips button.is-on{background:var(--gold);border-color:var(--gold);color:#fff}
.esd .yesno{display:inline-flex;gap:10px}
.esd .yesno button{appearance:none;cursor:pointer;font:inherit;font-size:14.5px;font-weight:600;border:1.5px solid var(--line-strong);background:#fff;color:var(--ink);border-radius:12px;padding:10px 22px;transition:.15s}
.esd .yesno button.is-on{background:var(--ink);border-color:var(--ink);color:#fff}
.esd .yesno button.is-on.no{background:#8a7f76;border-color:#8a7f76}
.esd input[type=email]{width:100%;margin-top:14px;border:1.5px solid var(--line-strong);border-radius:14px;padding:13px 15px;font:inherit;font-size:15.5px;color:var(--ink);background:#fff}
.esd input[type=email]::placeholder{color:#a89c90}
.esd .muted{font-size:13px;color:var(--ink-soft);margin-top:10px}
.esd .actions{margin-top:24px}
.esd .submit{appearance:none;cursor:pointer;border:0;width:100%;font:inherit;font-weight:700;font-size:16.5px;color:#fff;background:var(--gold);border-radius:14px;padding:16px 20px;letter-spacing:.01em;box-shadow:0 8px 22px rgba(184,134,11,.28);transition:.16s}
.esd .submit:hover{background:var(--gold-deep);transform:translateY(-2px);box-shadow:var(--shadow-lift)}
.esd .submit:disabled{opacity:.6;cursor:default;transform:none;box-shadow:none}
.esd .submit-error{margin-top:12px;text-align:center;color:#b4433a;font-size:14px}
.esd footer.legal{text-align:center;color:var(--ink-soft);font-size:12.5px;margin-top:18px;line-height:1.5}
.esd .panel{text-align:center;background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:52px 32px;box-shadow:var(--shadow);margin-top:26px;animation:esd-rise .5s ease both}
.esd .panel .mark{font-size:40px;margin-bottom:8px}
.esd .panel h2{font-family:"Fraunces",serif;font-weight:500;font-size:clamp(24px,5vw,32px);line-height:1.15;margin:0 0 14px;color:var(--ink)}
.esd .panel h2 .hl{color:var(--gold-deep)}
.esd .panel p{max-width:42ch;margin:0 auto 6px;color:var(--ink-soft);font-size:16px}
.esd .panel .sign{margin-top:18px;font-family:"Fraunces",serif;font-style:italic;color:var(--gold-deep);font-size:17px}
.esd .gbox{margin:30px auto 0;max-width:440px;text-align:center;background:linear-gradient(180deg,#fffdf8,#fbf7ee);border:1px solid #ecdfc4;border-radius:16px;padding:24px 22px}
.esd .gbox p.pitch{margin:0 auto 16px;color:var(--ink);font-size:15px;max-width:36ch}
.esd .verbatim{margin:0 0 18px}
.esd .verbatim .lead{font-size:13px;color:var(--ink-soft);margin:0 0 8px}
.esd .verbatim blockquote{margin:0;padding:12px 15px;background:#fff;border-left:3px solid var(--gold);border-radius:0 10px 10px 0;font-family:"Fraunces",serif;font-style:italic;font-size:15.5px;color:var(--ink);text-align:left}
.esd .verbatim .copy{appearance:none;cursor:pointer;margin-top:12px;font:inherit;font-size:13.5px;font-weight:600;border:1.5px solid var(--line-strong);background:#fff;color:var(--ink);border-radius:10px;padding:8px 16px;transition:.15s}
.esd .verbatim .copy:hover{border-color:var(--gold)}
.esd .verbatim .help{display:block;margin-top:10px;font-size:12.5px;color:var(--ink-soft)}
.esd .gbtn{display:inline-flex;align-items:center;gap:10px;text-decoration:none;background:#fff;border:1.5px solid var(--line-strong);border-radius:12px;padding:13px 22px;color:var(--ink);font-weight:700;font-size:15px;transition:.15s;box-shadow:var(--shadow)}
.esd .gbtn:hover{border-color:var(--gold);transform:translateY(-2px);box-shadow:var(--shadow-lift)}
.esd .gbtn .gstars{color:var(--gold);letter-spacing:1px;font-size:13px}
@keyframes esd-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@media (max-width:560px){
  .esd .hero{padding:24px 22px 34px}
  .esd .block{padding:22px 18px 24px}
  .esd .dim__label{max-width:52%;font-size:15px}
  .esd .stars span{font-size:24px}
  .esd .nps button{width:calc((100% - 32px)/5)}
}
@media (prefers-reduced-motion:reduce){
  .esd *{animation:none!important;transition:none!important}
  .esd .nps button:hover,.esd .submit:hover,.esd .stars span:hover,.esd .gbtn:hover{transform:none}
}
.esd :focus-visible{outline:2px solid var(--gold);outline-offset:2px;border-radius:6px}
`;

function StarRow({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="stars" role="group" aria-label={label}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={shown >= s ? 'lit' : ''}
          role="button"
          tabIndex={0}
          aria-label={`${s}/5`}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(s); } }}
        >★</span>
      ))}
    </div>
  );
}

export function QuestionnaireDepartPage() {
  const { token } = useParams<{ token: string }>();
  const [lang, setLang] = useState<Lang>('fr');
  const [screen, setScreen] = useState<Screen>('loading');
  const [resident, setResident] = useState<Resident | null>(null);

  const [nps, setNps] = useState<number | null>(null);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [loved, setLoved] = useState('');
  const [improve, setImprove] = useState('');
  const [reason, setReason] = useState<string | null>(null);
  const [testimonialOk, setTestimonialOk] = useState<boolean | null>(null);
  const [contactEmail, setContactEmail] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submittedLoved, setSubmittedLoved] = useState('');
  const [copied, setCopied] = useState(false);

  const t = I18N[lang];

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!token) { setScreen('invalid'); return; }
      try {
        const res = await fetch(`${FN_URL}?token=${encodeURIComponent(token)}`, { headers: { Accept: 'application/json' } });
        const data = await res.json().catch(() => ({} as Record<string, unknown>));
        if (cancelled) return;
        const state = (data as { state?: string }).state;
        if (state === 'pending') {
          const d = data as { first_name?: string; house?: string; room?: number; months?: number; lang?: string };
          setResident({ first_name: d.first_name || '', house: d.house || '', room: d.room ?? null, months: d.months ?? null });
          if (d.lang === 'en' || d.lang === 'fr') setLang(d.lang);
          setScreen('form');
        } else if (state === 'completed') setScreen('used');
        else if (state === 'expired') setScreen('expired');
        else setScreen('invalid');
      } catch {
        if (!cancelled) setScreen('invalid');
      }
    }
    load();
    return () => { cancelled = true; };
  }, [token]);

  const submit = async () => {
    if (submitting || !token) return;
    setSubmitting(true);
    setSubmitError(false);
    const payload: Record<string, string | number | boolean> = { token };
    if (nps !== null) payload.nps = nps;
    for (const d of DIMS) { if (ratings[d.key]) payload[d.api] = ratings[d.key]; }
    if (loved.trim()) payload.loved = loved.trim();
    if (improve.trim()) payload.improve = improve.trim();
    if (reason) payload.leave_reason = reason;
    if (testimonialOk !== null) payload.testimonial_ok = testimonialOk;
    if (contactEmail.trim()) payload.contact_email = contactEmail.trim();
    try {
      const res = await fetch(FN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.status === 409) { setSubmittedLoved(loved.trim()); setScreen('used'); return; }
      if (res.status === 410) { setScreen('expired'); return; }
      if (!res.ok) { setSubmitError(true); setSubmitting(false); return; }
      setSubmittedLoved(loved.trim());
      setScreen('thanks');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitError(true);
      setSubmitting(false);
    }
  };

  const copyLoved = async () => {
    try { if (navigator.clipboard && submittedLoved) await navigator.clipboard.writeText(submittedLoved); } catch { /* noop */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const LangToggle = (
    <div className="lang" role="group" aria-label="Langue / Language">
      <button className={lang === 'fr' ? 'is-active' : ''} onClick={() => setLang('fr')}>FR</button>
      <button className={lang === 'en' ? 'is-active' : ''} onClick={() => setLang('en')}>EN</button>
    </div>
  );

  const Wordmark = <div className="wordmark">La Villa <span>Coliving</span></div>;

  const head = (
    <Helmet>
      <html lang={lang} />
      <title>Questionnaire de départ · La Villa Coliving</title>
      <meta name="robots" content="noindex, nofollow" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  );

  // ── Écrans "statut" (déjà utilisé / expiré / invalide / chargement) ──
  if (screen !== 'form' && screen !== 'thanks') {
    const panels: Record<string, { mark: string; title: string; body: string }> = {
      loading: { mark: '', title: t.loading, body: '' },
      used: { mark: '✓', title: t.used_title, body: t.used_body },
      expired: { mark: '⌛', title: t.expired_title, body: t.expired_body },
      invalid: { mark: '↪', title: t.invalid_title, body: t.invalid_body },
    };
    const p = panels[screen];
    return (
      <div className="esd">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        {head}
        <div className="stage">
          <header className="hero hero--slim">
            <div className="hero__top">{Wordmark}{LangToggle}</div>
          </header>
          {screen !== 'loading' && (
            <main>
              <section className="screen">
                <div className="panel">
                  {p.mark && <div className="mark">{p.mark}</div>}
                  <h2>{p.title}</h2>
                  {p.body && <p>{p.body}</p>}
                </div>
              </section>
            </main>
          )}
        </div>
      </div>
    );
  }

  // ── Écran de remerciement ──
  if (screen === 'thanks') {
    return (
      <div className="esd">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        {head}
        <div className="stage">
          <header className="hero hero--slim">
            <div className="hero__top">{Wordmark}{LangToggle}</div>
          </header>
          <main>
            <section className="screen">
              <div className="panel">
                <div className="mark">🙏</div>
                <h2>{t.thanks_pre} <span className="hl">{resident?.first_name}</span>{t.thanks_post}</h2>
                <p>{t.thanks_body}</p>
                <div className="sign">{t.thanks_sign}</div>

                {/* Avis Google — proposé à TOUS de la même façon (aucun gating) */}
                <div className="gbox">
                  <p className="pitch">{t.google_pitch}</p>
                  {submittedLoved && (
                    <div className="verbatim">
                      <p className="lead">{t.verbatim_intro}</p>
                      <blockquote>« {submittedLoved} »</blockquote>
                      <button className="copy" onClick={copyLoved}>{copied ? t.verbatim_copied : t.verbatim_copy}</button>
                      <span className="help">{t.verbatim_help}</span>
                    </div>
                  )}
                  <a className="gbtn" href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">
                    <span className="gstars">★★★★★</span><span>{t.google_btn}</span>
                  </a>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    );
  }

  // ── Formulaire ──
  return (
    <div className="esd">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {head}
      <div className="stage">
        <header className="hero">
          <div className="hero__top">{Wordmark}{LangToggle}</div>
          <h1>{t.hero_pre} <span className="hl">{resident?.first_name}</span>{t.hero_post}</h1>
          <p className="sub">{t.hero_sub}</p>
          {resident && (resident.house || resident.room != null || resident.months != null) && (
            <div className="stay">
              {resident.house && <b>{resident.house}</b>}
              {resident.room != null && <><span className="dot" />{t.room_word} {resident.room}</>}
              {resident.months != null && <><span className="dot" /><b>{resident.months}</b>&nbsp;{t.months_word}</>}
            </div>
          )}
        </header>

        <main>
          <section className="screen">
            {/* NPS */}
            <div className="block">
              <span className="eyebrow">{t.nps_eyebrow}</span>
              <h2>{t.nps_q}</h2>
              <p className="hint">{t.nps_hint}</p>
              <div className="nps" role="group" aria-label="Note de 0 à 10">
                {Array.from({ length: 11 }, (_, i) => (
                  <button key={i} className={nps === i ? 'is-on' : ''} aria-label={`Note ${i}`} onClick={() => setNps(i)}>{i}</button>
                ))}
              </div>
              <div className="nps-anchors"><span>{t.nps_low}</span><span>{t.nps_high}</span></div>
            </div>

            {/* Dimensions */}
            <div className="block">
              <span className="eyebrow">{t.dim_eyebrow}</span>
              <h2>{t.dim_q}</h2>
              <p className="hint">{t.dim_hint}</p>
              <div>
                {DIMS.map((d) => (
                  <div className="dim" key={d.key}>
                    <div className="dim__label">{d[lang]}</div>
                    <StarRow value={ratings[d.key] || 0} onChange={(n) => setRatings((r) => ({ ...r, [d.key]: n }))} label={d[lang]} />
                  </div>
                ))}
              </div>
            </div>

            {/* Loved */}
            <div className="block">
              <span className="eyebrow">{t.love_eyebrow}</span>
              <h2>{t.love_q}</h2>
              <div className="field">
                <textarea value={loved} onChange={(e) => setLoved(e.target.value)} placeholder={t.love_ph} />
              </div>
            </div>

            {/* Improve */}
            <div className="block">
              <span className="eyebrow">{t.improve_eyebrow}</span>
              <h2>{t.improve_q}</h2>
              <div className="field">
                <textarea value={improve} onChange={(e) => setImprove(e.target.value)} placeholder={t.improve_ph} />
              </div>
            </div>

            {/* Reason */}
            <div className="block">
              <span className="eyebrow">{t.reason_eyebrow}</span>
              <h2>{t.reason_q}</h2>
              <p className="hint">{t.reason_hint}</p>
              <div className="chips">
                {REASONS.map((r) => (
                  <button key={r.key} className={reason === r.key ? 'is-on' : ''} onClick={() => setReason(r.key)}>{r[lang]}</button>
                ))}
              </div>
            </div>

            {/* Testimonial + contact */}
            <div className="block">
              <span className="eyebrow">{t.extra_eyebrow}</span>
              <h2>{t.testi_q}</h2>
              <p className="hint">{t.testi_hint}</p>
              <div className="yesno" role="group" aria-label="Autorisation témoignage">
                <button className={testimonialOk === true ? 'is-on' : ''} onClick={() => setTestimonialOk(true)}>{t.yes}</button>
                <button className={`no ${testimonialOk === false ? 'is-on' : ''}`} onClick={() => setTestimonialOk(false)}>{t.no}</button>
              </div>
              <div style={{ marginTop: 22 }}>
                <h2 style={{ fontSize: 19 }}>{t.contact_q}</h2>
                <p className="hint">{t.contact_hint}</p>
                <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder={t.contact_ph} autoComplete="email" />
                <p className="muted">{t.contact_coopt}</p>
              </div>
            </div>

            <div className="actions">
              <button className="submit" onClick={submit} disabled={submitting}>{submitting ? '…' : t.submit}</button>
              {submitError && <p className="submit-error">{t.submit_error}</p>}
            </div>

            <footer className="legal">{t.legal}</footer>
          </section>
        </main>
      </div>
    </div>
  );
}

export default QuestionnaireDepartPage;
