// Frais de dossier (visite, dossier, rédaction du bail) + état des lieux d'entrée,
// proportionnels à la surface de la chambre (décision Jérôme 08/10/2026).
// Partagé par le PDF (BailPDF), la prévisualisation HTML et le formulaire (DashboardNouveauBailPage).
export function computeFraisEntree(
  surfaceM2: number | null | undefined,
  dossierM2: number,
  edlM2: number,
): { surface: number; dossier: number; edl: number; total: number } {
  const surface = Number(surfaceM2) || 0;
  const dossier = Math.round(surface * (dossierM2 || 0) * 100) / 100;
  const edl = Math.round(surface * (edlM2 || 0) * 100) / 100;
  return { surface, dossier, edl, total: Math.round((dossier + edl) * 100) / 100 };
}
