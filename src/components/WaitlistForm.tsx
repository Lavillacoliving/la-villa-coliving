import { useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * C4 — Liste prioritaire (waitlist).
 * POST direct sur la table Supabase `waitlist` (RLS : insert anon autorisé).
 * Réutilise le pattern statut/erreur du formulaire /candidature (JoinPageV4).
 */
export function WaitlistForm() {
  const { language } = useLanguage();
  const en = language === "en";
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload: Record<string, string> = {};
    fd.forEach((v, k) => { payload[k] = typeof v === "string" ? v : ""; });
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({} as Record<string, unknown>));
        const msg = d && typeof d === "object" && typeof d.message === "string" ? d.message : `Erreur ${res.status}`;
        throw new Error(msg);
      }
      setStatus("success");
      form.reset();
      try { (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "waitlist_submit"); } catch { /* noop */ }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : en ? "Submission failed. Please try again." : "L'envoi a échoué. Merci de réessayer.");
    }
  }

  if (status === "success") {
    return (
      <div className="max-w-xl mx-auto bg-white border border-[#D4A574]/40 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#D4A574]/15 flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-[#D4A574]" />
        </div>
        <h3 className="text-xl font-medium text-[#1C1917] mb-2">{en ? "You're on the list!" : "Vous êtes sur la liste !"}</h3>
        <p className="text-[#57534E] text-sm">
          {en
            ? "We'll reach out the moment a room matching your profile opens up."
            : "On vous contacte dès qu'une chambre correspondant à votre profil se libère."}
        </p>
      </div>
    );
  }

  const field = "w-full px-4 py-3 bg-white border border-[#E7E5E4] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#D4A574] transition-colors";
  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white border border-[#E7E5E4] rounded-2xl p-6 md:p-8 space-y-4 text-left">
      <div className="grid sm:grid-cols-2 gap-4">
        <input name="nom" required placeholder={en ? "Full name" : "Nom complet"} className={field} />
        <input name="email" type="email" required placeholder="Email" className={field} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <select name="profil" required defaultValue="" className={field}>
          <option value="" disabled>{en ? "Your profile" : "Votre profil"}</option>
          <option value="frontalier">{en ? "Cross-border worker" : "Frontalier"}</option>
          <option value="expat">{en ? "Expat / international" : "Expat / international"}</option>
          <option value="jeune_pro">{en ? "Young professional" : "Jeune professionnel"}</option>
          <option value="teletravail">{en ? "Remote worker" : "Télétravailleur"}</option>
        </select>
        <select name="propriete_souhaitee" defaultValue="" className={field}>
          <option value="">{en ? "Preferred house (any)" : "Maison souhaitée (peu importe)"}</option>
          <option value="La Villa">La Villa — Ville-la-Grand</option>
          <option value="Le Loft">Le Loft — Ambilly</option>
          <option value="Le Lodge">Le Lodge — Annemasse</option>
        </select>
      </div>
      <input name="date_souhaitee" type="month" aria-label={en ? "Desired move-in month" : "Mois d'emménagement souhaité"} className={field} />
      <textarea name="message" rows={3} placeholder={en ? "Anything else? (optional)" : "Un mot ? (optionnel)"} className={field} />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full inline-flex items-center justify-center gap-2 bg-[#D4A574] text-white px-8 py-4 text-sm font-semibold uppercase tracking-wider rounded-lg hover:bg-[#44403C] transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? (en ? "Sending…" : "Envoi…") : en ? "Join the priority list" : "Rejoindre la liste prioritaire"}
        <ArrowRight className="w-4 h-4" />
      </button>
      {status === "error" && <p className="text-sm text-red-600 text-center">{error}</p>}
      <p className="text-xs text-[#78716C] text-center">
        {en ? "Free · no commitment · your data stays confidential." : "Gratuit · sans engagement · vos données restent confidentielles."}
      </p>
    </form>
  );
}
