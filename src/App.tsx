import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { SearchSection } from "./components/SearchSection";
import { CategoryChips } from "./components/CategoryChips";
import { FeaturedProductSection } from "./components/FeaturedProductSection";
import { FeaturedPetsProductsSection } from "./components/FeaturedPetsProductsSection";
import { ShelterSection } from "./components/ShelterSection";
import { BreedsSection } from "./components/BreedsSection";
import { ArticlesSection } from "./components/ArticlesSection";
import { FeaturedBanner } from "./components/FeaturedBanner";
import { ContentFeed } from "./components/ContentFeed";
import { AboutUsSection } from "./components/AboutUsSection";
import { FAQSection } from "./components/FAQSection";
import { ProductsPage } from "./components/ProductsPage";
import { ProductDetailsPage } from "./components/ProductDetails";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";

function Home() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <CategoryChips />
      <FeaturedProductSection />
      <FeaturedPetsProductsSection />
      <ShelterSection />
      <BreedsSection />
      <ArticlesSection />
      <FeaturedBanner />
      <ContentFeed />
      <AboutUsSection />
      <FAQSection />
    </>
  );
}

// Wrapper component to handle conditional layout
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-background">
      {!hideHeaderFooter && <Header />}
      <main>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router basename="/wowpets">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}