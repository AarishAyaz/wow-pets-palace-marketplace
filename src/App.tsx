import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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
import { CartProvider } from "./context/CartContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import GoogleOneTap from "./components/GoogleOneTap";
import { UserProfilePage } from "./components/ProfileN";
import { Toaster } from "react-hot-toast";
import CartCheckoutWrapper from "./components/CartCheckoutWrapper";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PetDetailPage } from "./components/PetDetails";

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
  const hideHeaderFooter =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-background">
      {!hideHeaderFooter && <Header />}
      <main>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default function App() {
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  return (
    <Router basename="/wowpets">
      <AuthProvider>
        <CartProvider>
            <Elements stripe={stripePromise}>
              <GoogleOneTap />
              <Toaster position="top-right" />
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<ProductsPage />} />
                  <Route
                    path="/product/:slug"
                    element={<ProductDetailsPage />}
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/profile" element={<UserProfilePage />} />
                  <Route
                    path="/cart"
                    element={
                      <ProtectedRoute>
                        <CartCheckoutWrapper />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/pet/:slug" element={<PetDetailPage />} />
                </Routes>
              </Layout>
            </Elements>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}
