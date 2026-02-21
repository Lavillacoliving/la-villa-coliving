import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NavbarV7 as Navbar } from "@/components/custom/NavbarV7";
import { FooterV7 as Footer } from "@/components/custom/FooterV7";
import { HomePage } from "@/pages/HomePage";
import { Navigate } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { WhatsAppButton } from "@/components/WhatsAppButton";

// Lazy-loaded pages for code splitting
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
const InvestisseursPage = lazy(() => import("@/pages/InvestisseursPage").then(m => ({ default: m.InvestisseursPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const PortailLayout = lazy(() => import("@/pages/portail/PortailLayout").then(m => ({ default: m.PortailLayout })));
const MaMaisonPage = lazy(() => import("@/pages/portail/MaMaisonPage").then(m => ({ default: m.MaMaisonPage })));
const MonBailPage = lazy(() => import("@/pages/portail/MonBailPage").then(m => ({ default: m.MonBailPage })));
const MesDemandesPage = lazy(() => import("@/pages/portail/MesDemandesPage").then(m => ({ default: m.MesDemandesPage })));
const CommunautePage = lazy(() => import("@/pages/portail/CommunautePage").then(m => ({ default: m.CommunautePage })));
const DashboardLayout = lazy(() => import("@/pages/dashboard/DashboardLayout"));
const DashboardLoyersPage = lazy(() => import("@/pages/dashboard/DashboardLoyersPage"));
const DashboardLocatairesPage = lazy(() => import("@/pages/dashboard/DashboardLocatairesPage"));
const DashboardDepensesPage = lazy(() => import("@/pages/dashboard/DashboardDepensesPage"));
const DashboardMaintenancePage = lazy(() => import("@/pages/dashboard/DashboardMaintenancePage"));
const DashboardProspectsPage = lazy(() => import("@/pages/dashboard/DashboardProspectsPage"));
const DashboardRoadmapPage = lazy(() => import("@/pages/dashboard/DashboardRoadmapPage"));
const DashboardDocumentsPage = lazy(() => import("@/pages/dashboard/DashboardDocumentsPage"));

// Loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
    <div className="w-8 h-8 border-2 border-[#D4A574] border-t-transparent rounded-full animate-spin" />
  </div>
);

function AppLayout() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isPortail = location.pathname.startsWith('/portail');
  const showChrome = !isDashboard && !isPortail;

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-background">
        {!isDashboard && <Navbar />}
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/colocation-geneve" element={<ColocationGenevePage />} />
          <Route path="/le-coliving" element={<ColivingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/nos-maisons" element={<HousesPage />} />
          <Route path="/tarifs" element={<RatesPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/candidature" element={<JoinPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/investisseurs" element={<InvestisseursPage />} />
          {/* English URL redirects (301 via React Navigate) */}
          <Route path="/the-coliving" element={<Navigate to="/le-coliving" replace />} />
          <Route path="/our-houses" element={<Navigate to="/nos-maisons" replace />} />
          <Route path="/rates" element={<Navigate to="/tarifs" replace />} />
          <Route path="/join-us" element={<Navigate to="/candidature" replace />} />
          <Route path="/nous-rejoindre" element={<Navigate to="/candidature" replace />} />
          <Route path="/lavilla" element={<HouseDetailPage />} />
          <Route path="/leloft" element={<HouseDetailPage />} />
          <Route path="/lelodge" element={<HouseDetailPage />} />
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
            <Route path="depenses" element={<DashboardDepensesPage />} />
            <Route path="maintenance" element={<DashboardMaintenancePage />} />
            <Route path="prospects" element={<DashboardProspectsPage />} />
            <Route path="roadmap" element={<DashboardRoadmapPage />} />
            <Route path="documents" element={<DashboardDocumentsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
        {!isDashboard && <Footer />}
        {showChrome && <WhatsAppButton />}
      </div>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
