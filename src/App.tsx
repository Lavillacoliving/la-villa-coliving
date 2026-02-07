import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { ScrollToTop } from "@/components/ScrollToTop"; // ← AJOUTEZ CETTE LIGNE

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop /> {/* ← AJOUTEZ CETTE LIGNE ICI */}
        <div className="min-h-screen bg-background">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/the-coliving" element={<ColivingPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/our-houses" element={<HousesPage />} />
            <Route path="/rates" element={<RatesPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/join-us" element={<JoinPage />} />
            <Route path="/:id" element={<HouseDetailPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
