import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NavbarV7 as Navbar } from "@/components/custom/NavbarV7";
import { FooterV7 as Footer } from "@/components/custom/FooterV7";
import { Navigate } from "react-router-dom";
import { PortailLayout } from "@/pages/portail/PortailLayout";
import { ScrollToTop } from "@/components/ScrollToTop";

// ─── Lazy-loaded public pages (named exports) ──────────────
const HomePage = lazy(() => import("@/pages/HomePage").then(m => ({ default: m.HomePage })));
const ColivingPage = lazy(() => import("@/pages/ColivingPageV4").then(m => ({ default: m.ColivingPageV4 })));
const ServicesPage = lazy(() => import("@/pages/ServicesPageV4").then(m => ({ default: m.ServicesPageV4 })));
const HousesPage = lazy(() => import("@/pages/HousesPageV4").then(m => ({ default: m.HousesPageV4 })));
const RatesPage = lazy(() => import("@/pages/RatesPageV4").then(m => ({ default: m.RatesPageV4 })));
const FAQPage = lazy(() => import("@/pages/FAQPageV4").then(m => ({ default: m.FAQPageV4 })));
const JoinPage = lazy(() => import("@/pages/JoinPageV4").then(m => ({ default: m.JoinPageV4 })));
const HouseDetailPage = lazy(() => import("@/pages/HouseDetailPage").then(m => ({ default: m.HouseDetailPage })));
const BlogPage = lazy(() => import("@/pages/BlogPage").then(m => ({ default: m.BlogPage })));
const BlogPostPage = lazy(() => import("@/pages/BlogPostPage").then(m => ({ default: m.BlogPostPage })));
const ColocationGenevePage = lazy(() => import("@/pages/ColocationGenevePage").then(m => ({ default: m.ColocationGenevePage })));
const AnnemasseColocationPage = lazy(() => import("@/pages/AnnemasseColocationPage").then(m => ({ default: m.AnnemasseColocationPage })));
const ChambreLouerAnnemassePage = lazy(() => import("@/pages/ChambreLouerAnnemassePage").then(m => ({ default: m.ChambreLouerAnnemassePage })));
const InvestisseursPage = lazy(() => import("@/pages/InvestisseursPage").then(m => ({ default: m.InvestisseursPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));

// ─── Lazy-loaded portail pages (named exports) ─────────────
const MaMaisonPage = lazy(() => import("@/pages/portail/MaMaisonPage").then(m => ({ default: m.MaMaisonPage })));
const MonBailPage = lazy(() => import("@/pages/portail/MonBailPage").then(m => ({ default: m.MonBailPage })));
const MesDemandesPage = lazy(() => import("@/pages/portail/MesDemandesPage").then(m => ({ default: m.MesDemandesPage })));
const CommunautePage = lazy(() => import("@/pages/portail/CommunautePage").then(m => ({ default: m.CommunautePage })));

// ─── Lazy-loaded dashboard pages (default exports) ─────────
const DashboardLayout = lazy(() => import("@/pages/dashboard/DashboardLayout"));
const DashboardLoyersPage = lazy(() => import("@/pages/dashboard/DashboardLoyersPage"));
const DashboardLocatairesPage = lazy(() => import("@/pages/dashboard/DashboardLocatairesPage"));
const DashboardDepensesPage = lazy(() => import("@/pages/dashboard/DashboardDepensesPage"));
const DashboardMaintenancePage = lazy(() => import("@/pages/dashboard/DashboardMaintenancePage"));
const DashboardProspectsPage = lazy(() => import("@/pages/dashboard/DashboardProspectsPage"));
const DashboardRoadmapPage = lazy(() => import("@/pages/dashboard/DashboardRoadmapPage"));
const DashboardMaisonsPage = lazy(() => import("@/pages/dashboard/DashboardMaisonsPage"));
const DashboardNouveauBailPage = lazy(() => import("@/pages/dashboard/DashboardNouveauBailPage"));
const DashboardDocumentsPage = lazy(() => import("@/pages/dashboard/DashboardDocumentsPage"));
const DashboardEventsPage = lazy(() => import("@/pages/dashboard/DashboardEventsPage"));
const DashboardRapprochementPage = lazy(() => import("@/pages/dashboard/DashboardRapprochementPage"));
const DashboardCautionsPage = lazy(() => import("@/pages/dashboard/DashboardCautionsPage"));
const DashboardBlogPage = lazy(() => import("@/pages/dashboard/DashboardBlogPage"));
const DashboardComptesLocatairesPage = lazy(() => import("@/pages/dashboard/DashboardComptesLocatairesPage"));

// ─── Lazy-loaded misc pages (default export) ───────────────
const ResetPasswordPage = lazy(() => import("@/pages/ResetPasswordPage"));

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isPortail = location.pathname.startsWith('/portail');
  const isResetPw = location.pathname === '/reset-password';

  return (
    <div className="min-h-screen bg-background">
      {!isDashboard && !isPortail && !isResetPw && <Navbar />}
      <Suspense fallback={<div className="min-h-screen" />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/colocation-geneve" element={<ColocationGenevePage />} />
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
        <Route path="/join-us" element={<Navigate to="/candidature" replace />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/lavilla" element={<HouseDetailPage />} />
        <Route path="/leloft" element={<HouseDetailPage />} />
        <Route path="/lelodge" element={<HouseDetailPage />} />
        <Route path="/investisseurs" element={<InvestisseursPage />} />
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
        <Route path="/en/blog" element={<BlogPage />} />
        <Route path="/en/blog/:slug" element={<BlogPostPage />} />
        <Route path="/en/lavilla" element={<HouseDetailPage />} />
        <Route path="/en/leloft" element={<HouseDetailPage />} />
        <Route path="/en/lelodge" element={<HouseDetailPage />} />
        <Route path="/en/investisseurs" element={<InvestisseursPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
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
          <Route path="nouveau-bail" element={<DashboardNouveauBailPage />} />
          <Route path="blog" element={<DashboardBlogPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </Suspense>
      {!isDashboard && !isPortail && !isResetPw && <Footer />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
