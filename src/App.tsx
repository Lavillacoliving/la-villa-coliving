import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NavbarV7 as Navbar } from "@/components/custom/NavbarV7";
import { FooterV7 as Footer } from "@/components/custom/FooterV7";
import { Navigate } from "react-router-dom";
import { PortailLayout } from "@/pages/portail/PortailLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AvailabilityEmbed } from "@/components/AvailabilityEmbed";
import { RouteChangeTracker } from "@/lib/routeTracking";
import { InternalRefCapture } from "@/components/InternalRefCapture";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// ─── Lazy-loaded public pages (named exports) ──────────────
// Tous les imports dynamiques passent par lazyWithRetry (Lot C, 02/09/2026) : un chunk
// renommé par un déploiement déclenche un rechargement contrôlé au lieu d'une page blanche.
// ⚠️ Nouvelle page PRÉRENDUE = l'ajouter aussi à src/lib/routePreload.ts
// (préchargement avant hydratation — fix #418) et à scripts/prerender.mjs.
const HomePage = lazyWithRetry(() => import("@/pages/HomePage").then(m => ({ default: m.HomePage })), "HomePage");
const ColivingPage = lazyWithRetry(() => import("@/pages/ColivingPageV4").then(m => ({ default: m.ColivingPageV4 })), "ColivingPage");
const ServicesPage = lazyWithRetry(() => import("@/pages/ServicesPageV4").then(m => ({ default: m.ServicesPageV4 })), "ServicesPage");
const HousesPage = lazyWithRetry(() => import("@/pages/HousesPageV4").then(m => ({ default: m.HousesPageV4 })), "HousesPage");
const RatesPage = lazyWithRetry(() => import("@/pages/RatesPageV4").then(m => ({ default: m.RatesPageV4 })), "RatesPage");
const FAQPage = lazyWithRetry(() => import("@/pages/FAQPageV4").then(m => ({ default: m.FAQPageV4 })), "FAQPage");
const JoinPage = lazyWithRetry(() => import("@/pages/JoinPageV4").then(m => ({ default: m.JoinPageV4 })), "JoinPage");
const HouseDetailPage = lazyWithRetry(() => import("@/pages/HouseDetailPage").then(m => ({ default: m.HouseDetailPage })), "HouseDetailPage");
const BlogPage = lazyWithRetry(() => import("@/pages/BlogPage").then(m => ({ default: m.BlogPage })), "BlogPage");
const BlogPostPage = lazyWithRetry(() => import("@/pages/BlogPostPage").then(m => ({ default: m.BlogPostPage })), "BlogPostPage");
const ColocationGenevePage = lazyWithRetry(() => import("@/pages/ColocationGenevePage").then(m => ({ default: m.ColocationGenevePage })), "ColocationGenevePage");
const AnnemasseColocationPage = lazyWithRetry(() => import("@/pages/AnnemasseColocationPage").then(m => ({ default: m.AnnemasseColocationPage })), "AnnemasseColocationPage");
const ChambreLouerAnnemassePage = lazyWithRetry(() => import("@/pages/ChambreLouerAnnemassePage").then(m => ({ default: m.ChambreLouerAnnemassePage })), "ChambreLouerAnnemassePage");
const InvestisseursPage = lazyWithRetry(() => import("@/pages/InvestisseursPage").then(m => ({ default: m.InvestisseursPage })), "InvestisseursPage");
const ObservatoireLogementPage = lazyWithRetry(() => import("@/pages/ObservatoireLogementFrontalierPage").then(m => ({ default: m.ObservatoireLogementFrontalierPage })), "ObservatoireLogementPage");
const QuiSommesNousPage = lazyWithRetry(() => import("@/pages/QuiSommesNousPage").then(m => ({ default: m.QuiSommesNousPage })), "QuiSommesNousPage");
const NotFoundPage = lazyWithRetry(() => import("@/pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })), "NotFoundPage");
const CharteTransparencePage = lazyWithRetry(() => import("@/pages/CharteTransparencePage").then(m => ({ default: m.CharteTransparencePage })), "CharteTransparencePage");
const MentionsLegalesPage = lazyWithRetry(() => import("@/pages/MentionsLegalesPage").then(m => ({ default: m.MentionsLegalesPage })), "MentionsLegalesPage");
// QuiSommesNousPage : composant prêt (src/pages/QuiSommesNousPage.tsx) mais PAS routé —
// Jérôme retravaille la page dans une autre session. Au moment de la router : lazy import ici,
// routes FR+EN, liens navbar/footer, route prerender.mjs, et ABOUT_PAGE_LIVE=true (structuredData.ts).
const PolitiqueConfidentialitePage = lazyWithRetry(() => import("@/pages/PolitiqueConfidentialitePage").then(m => ({ default: m.PolitiqueConfidentialitePage })), "PolitiqueConfidentialitePage");
const QuestionnaireDepartPage = lazyWithRetry(() => import("@/pages/QuestionnaireDepartPage").then(m => ({ default: m.QuestionnaireDepartPage })), "QuestionnaireDepartPage");

// ─── Lazy-loaded portail pages (named exports) ─────────────
const MaMaisonPage = lazyWithRetry(() => import("@/pages/portail/MaMaisonPage").then(m => ({ default: m.MaMaisonPage })), "MaMaisonPage");
const MonBailPage = lazyWithRetry(() => import("@/pages/portail/MonBailPage").then(m => ({ default: m.MonBailPage })), "MonBailPage");
const MesDemandesPage = lazyWithRetry(() => import("@/pages/portail/MesDemandesPage").then(m => ({ default: m.MesDemandesPage })), "MesDemandesPage");
const CommunautePage = lazyWithRetry(() => import("@/pages/portail/CommunautePage").then(m => ({ default: m.CommunautePage })), "CommunautePage");

// ─── Lazy-loaded dashboard pages (default exports) ─────────
const DashboardLayout = lazyWithRetry(() => import("@/pages/dashboard/DashboardLayout"), "DashboardLayout");
const DashboardLoyersPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardLoyersPage"), "DashboardLoyersPage");
const DashboardLocatairesPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardLocatairesPage"), "DashboardLocatairesPage");
const DashboardDepensesPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardDepensesPage"), "DashboardDepensesPage");
const DashboardMaintenancePage = lazyWithRetry(() => import("@/pages/dashboard/DashboardMaintenancePage"), "DashboardMaintenancePage");
const DashboardProspectsPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardProspectsPage"), "DashboardProspectsPage");
const DashboardRoadmapPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardRoadmapPage"), "DashboardRoadmapPage");
const DashboardMaisonsPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardMaisonsPage"), "DashboardMaisonsPage");
const DashboardDispoPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardDispoPage"), "DashboardDispoPage");
const DashboardNouveauBailPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardNouveauBailPage"), "DashboardNouveauBailPage");
const DashboardDocumentsPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardDocumentsPage"), "DashboardDocumentsPage");
const DashboardEventsPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardEventsPage"), "DashboardEventsPage");
const DashboardRapprochementPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardRapprochementPage"), "DashboardRapprochementPage");
const DashboardCautionsPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardCautionsPage"), "DashboardCautionsPage");
const DashboardBlogPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardBlogPage"), "DashboardBlogPage");
const DashboardComptesLocatairesPage = lazyWithRetry(() => import("@/pages/dashboard/DashboardComptesLocatairesPage"), "DashboardComptesLocatairesPage");

// ─── Lazy-loaded misc pages (default export) ───────────────
const ResetPasswordPage = lazyWithRetry(() => import("@/pages/ResetPasswordPage"), "ResetPasswordPage");
// LP payante (brief LOT 2) — noindex, hors sitemap, aucun lien interne entrant.
const ChambresDisponiblesPage = lazyWithRetry(() =>
  import("@/pages/ChambresDisponiblesPage").then(m => ({ default: m.ChambresDisponiblesPage })), "ChambresDisponiblesPage");

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isPortail = location.pathname.startsWith('/portail');
  const isResetPw = location.pathname === '/reset-password';
  const isQuestionnaire = location.pathname.startsWith('/questionnaire-depart');
  // Langue de l'écran d'erreur (ErrorBoundary est une classe : pas de hook, on dérive de l'URL).
  const isEn = location.pathname === '/en' || location.pathname.startsWith('/en/');

  return (
    <div className="min-h-screen bg-background">
      {!isDashboard && !isPortail && !isResetPw && !isQuestionnaire && <Navbar />}
      {/* Filet Lot C : keyé par le chemin pour se réinitialiser à chaque navigation ; ne rend
          aucun élément DOM en fonctionnement normal (shell [header…footer] inchangé pour
          scripts/prerender.mjs et l'hydratation). */}
      <ErrorBoundary key={location.pathname} en={isEn}>
      <Suspense fallback={<div className="min-h-screen" />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Pilier FR consolidé 07/07/2026 vers l'article élu par Google (pos 9,3 vs 44,8).
            Navigate = clics SPA (liens des contenus en base) ; vercel.json porte le 308
            serveur. La version EN /en/colocation-geneve reste servie (money page en
            progression) — voir src/lib/siteLinks.ts. */}
        <Route path="/colocation-geneve" element={<Navigate to="/blog/trouver-colocation-geneve-frontalier" replace />} />
        <Route path="/annemasse-colocation" element={<AnnemasseColocationPage />} />
        <Route path="/chambre-a-louer-annemasse" element={<ChambreLouerAnnemassePage />} />
        <Route path="/le-coliving" element={<ColivingPage />} />
        <Route path="/the-coliving" element={<Navigate to="/le-coliving" replace />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/nos-maisons" element={<HousesPage />} />
        <Route path="/our-houses" element={<Navigate to="/nos-maisons" replace />} />
        <Route path="/tarifs" element={<RatesPage />} />
        <Route path="/rates" element={<Navigate to="/tarifs" replace />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/candidature" element={<JoinPage />} />
        {/* (Lot 3 SEO funnel, 03/09/2026) Page money des disponibilités — indexable, prérendue.
            L'ancienne LP Ads /chambres-septembre redirige (301 dans vercel.json, Navigate en SPA). */}
        <Route path="/chambres-disponibles" element={<ChambresDisponiblesPage />} />
        <Route path="/chambres-septembre" element={<Navigate to="/chambres-disponibles" replace />} />
        <Route path="/join-us" element={<Navigate to="/candidature" replace />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/lavilla" element={<HouseDetailPage />} />
        <Route path="/leloft" element={<HouseDetailPage />} />
        <Route path="/lelodge" element={<HouseDetailPage />} />
        <Route path="/investisseurs" element={<InvestisseursPage />} />
        <Route path="/observatoire-logement-frontalier-geneve" element={<ObservatoireLogementPage />} />
        <Route path="/qui-sommes-nous" element={<QuiSommesNousPage />} />
        <Route path="/charte-transparence" element={<CharteTransparencePage />} />
        <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialitePage />} />
        {/* EN routes — same components, language detected from /en prefix */}
        <Route path="/en" element={<HomePage />} />
        <Route path="/en/colocation-geneve" element={<ColocationGenevePage />} />
        <Route path="/en/annemasse-colocation" element={<AnnemasseColocationPage />} />
        <Route path="/en/chambre-a-louer-annemasse" element={<ChambreLouerAnnemassePage />} />
        <Route path="/en/le-coliving" element={<ColivingPage />} />
        <Route path="/en/nos-maisons" element={<HousesPage />} />
        <Route path="/en/services" element={<ServicesPage />} />
        <Route path="/en/tarifs" element={<RatesPage />} />
        <Route path="/en/faq" element={<FAQPage />} />
        <Route path="/en/candidature" element={<JoinPage />} />
        <Route path="/en/chambres-disponibles" element={<ChambresDisponiblesPage />} />
        <Route path="/en/rooms-september" element={<Navigate to="/en/chambres-disponibles" replace />} />
        <Route path="/en/blog" element={<BlogPage />} />
        <Route path="/en/blog/:slug" element={<BlogPostPage />} />
        <Route path="/en/lavilla" element={<HouseDetailPage />} />
        <Route path="/en/leloft" element={<HouseDetailPage />} />
        <Route path="/en/lelodge" element={<HouseDetailPage />} />
        <Route path="/en/investisseurs" element={<InvestisseursPage />} />
        <Route path="/en/observatoire-logement-frontalier-geneve" element={<ObservatoireLogementPage />} />
        <Route path="/en/qui-sommes-nous" element={<QuiSommesNousPage />} />
        <Route path="/en/charte-transparence" element={<CharteTransparencePage />} />
        <Route path="/en/mentions-legales" element={<MentionsLegalesPage />} />
        <Route path="/en/politique-de-confidentialite" element={<PolitiqueConfidentialitePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/questionnaire-depart/:token" element={<QuestionnaireDepartPage />} />
        <Route path="/mon-espace" element={<Navigate to="/portail" replace />} />
        <Route path="/portail" element={<PortailLayout />}>
          <Route index element={<Navigate to="/portail/ma-maison" replace />} />
          <Route path="ma-maison" element={<MaMaisonPage />} />
          <Route path="mon-bail" element={<MonBailPage />} />
          <Route path="mes-demandes" element={<MesDemandesPage />} />
          <Route path="communaute" element={<CommunautePage />} />
        </Route>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/loyers" replace />} />
          <Route path="loyers" element={<DashboardLoyersPage />} />
          <Route path="locataires" element={<DashboardLocatairesPage />} />
          <Route path="comptes-locataires" element={<DashboardComptesLocatairesPage />} />
          <Route path="rapprochement" element={<DashboardRapprochementPage />} />
          <Route path="depenses" element={<DashboardDepensesPage />} />
          <Route path="cautions" element={<DashboardCautionsPage />} />
          <Route path="maintenance" element={<DashboardMaintenancePage />} />
          <Route path="prospects" element={<DashboardProspectsPage />} />
          <Route path="roadmap" element={<DashboardRoadmapPage />} />
          <Route path="documents" element={<DashboardDocumentsPage />} />
          <Route path="events" element={<DashboardEventsPage />} />
          <Route path="maisons" element={<DashboardMaisonsPage />} />
          <Route path="dispo" element={<DashboardDispoPage />} />
          <Route path="nouveau-bail" element={<DashboardNouveauBailPage />} />
          <Route path="blog" element={<DashboardBlogPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* État de dispo embarqué pour l'hydratation sans fetch — instance unique.
          DOIT rester DANS le <Suspense> : scripts/prerender.mjs encadre d'un
          marqueur de frontière Suspense TOUT ce qui sépare le header du footer.
          Placé en dehors, ce <script> se retrouvait à l'intérieur de la frontière
          côté HTML mais en dehors côté React → mismatch d'hydratation #418 sur
          chaque page affichant la dispo (constaté en prod le 29/08 : /lavilla,
          /lelodge, /nos-maisons, /candidature ; /tarifs et /services indemnes). */}
      <AvailabilityEmbed />
      </Suspense>
      </ErrorBoundary>
      {!isDashboard && !isPortail && !isResetPw && !isQuestionnaire && <Footer />}
    </div>
  );
}

function App() {
  // LanguageProvider DOIT être dans BrowserRouter : la langue est dérivée de
  // l'URL (useLocation) et le toggle navigue vers l'URL miroir (useNavigate).
  return (
    <AuthProvider>
      <BrowserRouter>
        <LanguageProvider>
          <ScrollToTop />
          {/* route_change (Lot 1b) — trace les navigations SPA (cécité GA4/Clarity). */}
          <RouteChangeTracker />
          <InternalRefCapture />
          <AppContent />
        </LanguageProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
