import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowRight, BellRing, CalendarClock } from "lucide-react";
import { LocalizedLink } from "@/components/LocalizedLink";
import { supabase } from "@/lib/supabase";
import type { HouseKey } from "@/lib/availability";
import { embedJson, readEmbeddedArray } from "@/lib/prerenderEmbeddedState";

/**
 * Bloc « pipeline » de la section Chambres (Option 2, GO Jérôme 03/09/2026).
 *
 * Le problème réglé : la section montrait l'occupation du jour (« 6 chambres occupées »)
 * alors que ce que la maison vend, c'est la PROCHAINE libération — les résidents restent
 * 13 mois en moyenne, des chambres se libèrent toute l'année. Ce bloc prend la place
 * dans la file : « Candidater pour <mois> » (période transmise au formulaire, champ
 * `arrival` déjà compris par l'Edge send-candidature-email) et, sans dossier,
 * « Juste me prévenir » (prénom + e-mail + mois → table `waitlist`, écriture anonyme
 * autorisée par la policy waitlist_insert_anon).
 *
 * Hydratation (pattern prerenderEmbeddedState, comme la dispo) : le prérendu est une capture
 * Puppeteer d'un rendu CLIENT, donc tout ce qui dépend de la date y figure. Le composant
 * embarque son MOIS DE RÉFÉRENCE dans un <script type="application/json"> (capturé par
 * src/main.tsx avant hydrateRoot) et le relit à l'init : premier rendu client = snapshot,
 * même liste de mois, même libellé « Candidater pour octobre ». Après le montage, si le mois
 * courant a changé (HTML prérendu la veille du 1er), la liste est resynchronisée — après
 * l'hydratation, donc sans mismatch. Les états du mini-formulaire sont vides des deux côtés.
 * ⚠️ PIPELINE_EMBED_ID est enregistré dans la liste de capture de src/main.tsx.
 */

interface RoomPipelineProps {
  house: HouseKey;
  houseName: string;
  en: boolean;
  /** Une chambre est libre ou datée juste au-dessus : on parle des suivantes. */
  hasCandidates: boolean;
  onApplyClick: (month: string) => void;
}

type MonthOption = { value: string; label: string; period: ArrivalPeriod };
type ArrivalPeriod = "asap" | "1-3-months" | "3-6-months" | "later";

const MONTHS_FR = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** Même grille que le select « Quand souhaites-tu nous rejoindre ? » de /candidature. */
function periodFor(offset: number): ArrivalPeriod {
  if (offset <= 0) return "asap";
  if (offset <= 3) return "1-3-months";
  if (offset <= 6) return "3-6-months";
  return "later";
}

export const PIPELINE_EMBED_ID = "__pipeline_ref_month__";

/** « AAAA-MM » du mois courant (fuseau du navigateur ; le prérendu tourne en UTC). */
function currentMonthValue(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** 7 mois glissants à partir du mois de référence « AAAA-MM » — pur, déterministe. */
function upcomingMonths(refMonth: string, en: boolean): MonthOption[] {
  const [y, m] = refMonth.split("-").map(Number);
  const names = en ? MONTHS_EN : MONTHS_FR;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(y, (m - 1) + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { value, label: `${names[d.getMonth()]} ${d.getFullYear()}`, period: periodFor(i) };
  });
}

function track(event: string, params: Record<string, unknown>): void {
  try {
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, params);
  } catch {
    /* noop — l'analytics ne bloque jamais l'UI */
  }
}

export function RoomPipeline({ house, houseName, en, hasCandidates, onApplyClick }: RoomPipelineProps) {
  // Mois de référence : celui embarqué par le prérendu (hydratation identique), sinon le
  // mois courant (prérendu lui-même, ou navigation SPA sans HTML prérendu).
  const [refMonth, setRefMonth] = useState<string>(
    () => readEmbeddedArray<string>(PIPELINE_EMBED_ID)?.[0] ?? currentMonthValue(),
  );
  useEffect(() => {
    // Resynchronisation APRÈS l'hydratation (le HTML a pu être prérendu un autre mois).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- volontaire : mise à jour post-hydratation, jamais au premier rendu
    if (currentMonthValue() !== refMonth) setRefMonth(currentMonthValue());
  }, [refMonth]);
  const months = useMemo<MonthOption[]>(() => upcomingMonths(refMonth, en), [refMonth, en]);
  const [monthChoice, setMonth] = useState("");
  // Par défaut : le mois prochain (le premier de la liste étant le mois en cours).
  const month = monthChoice || months[1]?.value || months[0]?.value || "";
  const [showAlert, setShowAlert] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // pot de miel anti-robots, jamais affiché
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const selected = months.find((m) => m.value === month) ?? null;
  const applyHref = selected
    ? `/candidature?property_interest=${house}&arrival=${selected.period}`
    : `/candidature?property_interest=${house}`;
  const monthLabel = selected?.label.split(" ")[0] ?? "";

  const submitAlert = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    if (website) {
      setStatus("done");
      return;
    }
    setStatus("sending");
    const { error } = await supabase.from("waitlist").insert({
      nom: firstName.trim().slice(0, 80),
      email: email.trim().slice(0, 120),
      profil: "site_pipeline",
      propriete_souhaitee: house,
      date_souhaitee: month || null,
      message: en
        ? `Room alert — ${houseName} house page`
        : `Alerte libération — page maison ${houseName}`,
    });
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("done");
    track("waitlist_signup", { house, month, page_path: window.location.pathname, language: en ? "en" : "fr" });
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-[#E7E5E4] bg-white focus:border-[#D4A574] focus:outline-none transition-colors";

  return (
    <div className="bg-white rounded-2xl border border-[#E7E5E4] border-l-4 border-l-[#D4A574] shadow-sm p-6 md:p-8 mb-10">
      {/* Mois de référence sérialisé au prérendu — relu à l'init du state ci-dessus. */}
      <script type="application/json" id={PIPELINE_EMBED_ID} dangerouslySetInnerHTML={{ __html: embedJson([refMonth]) }} />
      <div className="flex items-start gap-4">
        <CalendarClock className="text-[#D4A574] mt-1 shrink-0 hidden sm:block" size={28} />
        <div className="flex-1 min-w-0">
          <h3
            className="text-2xl md:text-3xl text-[#1C1917] mb-3"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {en ? "A room frees up? You're told first." : "Une chambre se libère ? Tu es prévenu en premier."}
          </h3>
          <p className="text-[#57534E] font-medium leading-relaxed max-w-2xl">
            {en
              ? `Our residents stay 13 months on average: rooms open up all year round in our three houses${hasCandidates ? ", not only the one above" : ""}. Tell us when you'd like to move in and we'll offer you the first room that matches — before it even shows up here.`
              : `Nos résidents restent 13 mois en moyenne : des chambres se libèrent toute l'année dans nos trois maisons${hasCandidates ? ", pas seulement celle ci-dessus" : ""}. Dis-nous quand tu veux emménager, on te propose la première chambre qui correspond — avant même qu'elle n'apparaisse ici.`}
          </p>

          {/* Mois souhaité + candidature (période transmise au formulaire) */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="sr-only" htmlFor={`pipeline-month-${house}`}>
              {en ? "Desired move-in month" : "Mois d'emménagement souhaité"}
            </label>
            <select
              id={`pipeline-month-${house}`}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className={`${inputClass} sm:w-56`}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
            <LocalizedLink
              to={applyHref}
              onClick={() => onApplyClick(month)}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#D4A574] text-[#1C1917] font-bold rounded-full hover:bg-[#E0BB8A] transition-colors"
            >
              {monthLabel
                ? (en ? `Apply for ${monthLabel}` : `Candidater pour ${monthLabel}`)
                : (en ? "Apply" : "Candidater")}
              <ArrowRight className="w-5 h-5" />
            </LocalizedLink>
            {!showAlert && status === "idle" && (
              <button
                type="button"
                onClick={() => { setShowAlert(true); track("waitlist_open", { house, page_path: window.location.pathname }); }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#1C1917] underline underline-offset-4 hover:text-[#D4A574] transition-colors sm:ml-2"
              >
                <BellRing size={16} />
                {en ? "Just let me know" : "Juste me prévenir"}
              </button>
            )}
          </div>

          {/* Mini-formulaire « Juste me prévenir » → waitlist */}
          {showAlert && status !== "done" && (
            <form onSubmit={submitAlert} className="mt-5 pt-5 border-t border-[#E7E5E4]">
              <p className="text-sm text-[#57534E] mb-3">
                {en
                  ? `No application needed: one email when a room opens up at ${houseName} for ${monthLabel || "your month"}.`
                  : `Sans dossier : un e-mail quand une chambre se libère au ${houseName.replace(/^Le /, "")} pour ${monthLabel || "ton mois"}.`}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_auto] gap-3">
                <input
                  type="text"
                  required
                  maxLength={80}
                  autoComplete="given-name"
                  placeholder={en ? "First name" : "Prénom"}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="email"
                  required
                  maxLength={120}
                  autoComplete="email"
                  placeholder={en ? "Email" : "E-mail"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1C1917] text-white font-semibold rounded-xl hover:bg-[#D4A574] hover:text-[#1C1917] transition-colors disabled:opacity-60"
                >
                  <BellRing size={16} />
                  {status === "sending" ? (en ? "Sending…" : "Envoi…") : (en ? "Notify me" : "Me prévenir")}
                </button>
              </div>
              {status === "error" && (
                <p className="mt-3 text-sm text-[#B91C1C]">
                  {en ? "Something went wrong — " : "Ça n'a pas fonctionné — "}
                  <LocalizedLink to={applyHref} className="underline underline-offset-4">
                    {en ? "apply directly instead" : "candidate directement"}
                  </LocalizedLink>
                  .
                </p>
              )}
              <p className="mt-3 text-xs text-[#78716C]">
                {en ? "One email when a room opens up, never a newsletter. " : "Un seul e-mail quand une chambre se libère, jamais de newsletter. "}
                <LocalizedLink to="/politique-de-confidentialite" className="underline underline-offset-4">
                  {en ? "Privacy policy" : "Politique de confidentialité"}
                </LocalizedLink>
              </p>
            </form>
          )}
          {status === "done" && (
            <p className="mt-5 pt-5 border-t border-[#E7E5E4] text-[#0F5132] font-semibold">
              {en
                ? `Noted! We'll email you as soon as a room opens up at ${houseName}${monthLabel ? ` for ${monthLabel}` : ""}.`
                : `C'est noté ! On t'écrit dès qu'une chambre se libère au ${houseName.replace(/^Le /, "")}${monthLabel ? ` pour ${monthLabel}` : ""}.`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
