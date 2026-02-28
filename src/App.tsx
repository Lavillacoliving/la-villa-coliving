import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { NavbarV7 as Navbar } from "@/components/custom/NavbarV7";
import { FooterV7 as Footer } from "@/components/custom/FooterV7";
import { HomePage } from "@/pages/HomePage";
import { ColivingPageV4 as ColivingPage } from "@/pages/ColivingPageV4";
import { ServicesPageV4 as ServicesPage } from "@/pages/ServicesPageV4";
import { HousesPageV4 as HousesPage } from "@/pages/HousesPageV4";
import { RatesPageV4 as RatesPage } from "@/pages/RatesPageV4";
import { FAQPageV4 as FAQPage } from "@/pages/FAQPageV4";
import { JoinPageV4 as JoinPage } from "@/pages/JoinPageV4";
import { HouseDetailPage } from "@/pages/HouseDetailPage";
import { BlogPage } from "@/pages/BlogPage";
import { BlogPostPage } from "@/pages/BlogPostPage";
import { ColocationGenevePage } from "@/pages/ColocationGenevePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { Navigate } from "react-router-dom";
import { PortailLayout } from "@/pages/portail/PortailLayout";
import { MaMaisonPage } from "@/pages/portail/MaMaisonPage";
import { MonBailPage } from "@/pages/portail/MonBailPage";
import { MesDemandesPage } from "@/pages/portail/MesDemandesPage";
import { CommunautePage } from "@/pages/portail/CommunautePage";
import { ScrollToTop } from "@/components/ScrollToTop";
import DashboardLayout from "@/pages/dashboard/DashboardLayout";
import DashboardLoyersPage from "@/pages/dashboard/DashboardLoyersPage";
import DashboardLocatairesPage from "@/pages/dashboard/DashboardLocatairesPage";
import DashboardDepensesPage from "@/pages/dashboard/DashboardDepensesPage";
import DashboardMaintenancePage from "@/pages/dashboard/DashboardMaintenancePage";
import DashboardProspectsPage from "@/pages/dashboard/DashboardProspectsPage";
import DashboardRoadmapPage from "@/pages/dashboard/DashboardRoadmapPage";
import DashboardMaisonsPage from '@/pages/dashboard/DashboardMaisonsPage';
import DashboardNouveauBailPage from '@/pages/dashboard/DashboardNouveauBailPage';
import DashboardDocumentsPage from "@/pages/dashboard/DashboardDocumentsPage";
import DashboardEventsPage from "@/pages/dashboard/DashboardEventsPage";
import DashboardRapprochementPage from "@/pages/dashboard/DashboardRapprochementPage";
import DashboardCautionsPage from "@/pages/dashboard/DashboardCautionsPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isPortail = location.pathname.startsWith('/portail');
  const isResetPw = location.pathname === '/reset-password';

  return (
    <div className="min-h-screen bg-background">
      {!isDashboard && !isPortail && !isResetPw && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/colocation-geneve" element={<ColocationGenevePage />} />
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
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
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
